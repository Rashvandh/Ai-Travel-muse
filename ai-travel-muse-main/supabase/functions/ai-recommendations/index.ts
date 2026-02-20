import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { preference, budget, duration, people, month, interests } = await req.json();

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "Groq API key is not configured. Please add GROQ_API_KEY to Supabase secrets." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a world-class travel advisor AI. Based on the user's preferences, recommend exactly 6 travel destinations.

User preferences:
- Destination type: ${preference || "Any"}
- Budget: $${budget || 5000}
- Duration: ${duration || "4-7 days"}
- Number of people: ${people || "2"}
- Travel month: ${month || "Any"}
- Interests: ${interests?.length ? interests.join(", ") : "General"}

Return a JSON array of exactly 6 destination objects. Each object must have:
- name: destination name (e.g. "Bali, Indonesia")
- location: region (e.g. "Southeast Asia")
- description: 1-2 sentence compelling description
- budget: budget range as string (e.g. "$1,200 – $2,500")
- bestTime: best months to visit (e.g. "April – October")
- rating: number between 4.0 and 5.0
- personalizedReason: a short sentence (max 15 words) explaining why this destination is perfect for them, mentioning one or more of their specific interests (${interests?.length ? interests.join(", ") : "General"})
- nearbyPlaces: array of 3 objects, each with: name, distance (e.g. "13 km"), rating (number), type (e.g. "Temple", "Beach", "Nature")
- hotels: array of 3 objects, each with: name, stars (3-5), price (number per night in USD), rating (number), amenities (array of strings), ac (boolean), wifi (boolean), familyFriendly (boolean)

IMPORTANT: Return ONLY the raw JSON array. DO NOT include markdown formatting, code blocks, or any other text.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: "You are a travel recommendation AI. You must respond with a JSON array only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const text = await response.text();
      console.error("Groq API error:", status, text);
      throw new Error(`Groq API error: ${status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content in AI response");

    // Groq with json_object might return the array inside an object or just the array string
    let destinations;
    try {
      const parsed = JSON.parse(content);
      destinations = Array.isArray(parsed) ? parsed : (parsed.destinations || Object.values(parsed)[0]);
    } catch (e) {
      // Fallback for non-strict JSON
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      destinations = JSON.parse(cleaned);
    }

    if (!Array.isArray(destinations)) {
      throw new Error("AI did not return a valid destinations array");
    }

    return new Response(JSON.stringify({ destinations: destinations.slice(0, 6) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-recommendations error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
