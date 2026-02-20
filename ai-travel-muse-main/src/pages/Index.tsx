import { useState, useCallback } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RecommendationForm from "@/components/RecommendationForm";
import DestinationCards from "@/components/DestinationCards";
import NearbyPlaces from "@/components/NearbyPlaces";
import HotelsSection from "@/components/HotelsSection";
import Footer from "@/components/Footer";
import type { AIDestination, FormData } from "@/types/travel";

const Index = () => {
  const [destinations, setDestinations] = useState<AIDestination[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nearbyIndex, setNearbyIndex] = useState<number | null>(null);
  const [hotelsIndex, setHotelsIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(async (formData: FormData) => {
    setLoading(true);
    setShowResults(false);
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        toast.error("Groq API key is missing. Please add VITE_GROQ_API_KEY to your .env file.");
        return;
      }

      const prompt = `You are a world-class travel advisor AI specializing in Indian tourism. Based on the user's preferences, recommend exactly 6 travel destinations ONLY within ${formData.state ? `the state of ${formData.state}, India` : "India"}.

User preferences:
- Destination type: ${formData.preference || "Any"}
${formData.state ? `- Specific State: ${formData.state}` : ""}
- Budget (in USD): $${formData.budget || 5000}
- Duration: ${formData.duration || "4-7 days"}
- Number of people: ${formData.people || "2"}
- Travel month: ${formData.month || "Any"}
- Interests: ${formData.interests?.length ? formData.interests.join(", ") : "General"}

Return a JSON object with a key named "destinations" containing an array of exactly 6 Indian destination objects. Each destination object must have:
- name: destination name (e.g. "Munnar, Kerala")
- location: state/region in India (e.g. "South India")
- description: 1-2 sentence compelling description
- budget: budget range as string (e.g. "₹25,000 – ₹50,000")
- bestTime: best months to visit (e.g. "September – March")
- rating: number between 4.0 and 5.0
- imageUrl: A highly relevant Unsplash photo URL. Pick the BEST ID from this categorized list:
  * BEACHES (Goa/Tamil Nadu/Kerala): photo-1512343879784-a960bf40e7f2, photo-1590490360182-c33d57733427, photo-1506461883276-13f28247c1bb
  * MOUNTAINS (Ladakh/Kashmir/Sikkim): photo-1581791538302-03537b9c97bf, photo-1614594975525-e45190c55d0b, photo-1531366936337-7c912a4589a7
  * HILL STATIONS (Munnar/Shimla/Ooty): photo-1593181629936-11c609b8db9b, photo-1626621341517-bbf3d9990a23, photo-1548013146-72479768bbaa
  * TEMPLES/CULTURE (Kanyakumari/Varanasi/Madurai): photo-1582510003544-4d00b7f74220, photo-1561361058090-fb315bc85b27, photo-1580231533215-38505500ce18
  * PALACES (Jaipur/Udaipur/Delhi): photo-1599661046289-e31897846e41, photo-1564507592333-c60657eaa0af, photo-1587474260584-136574528ed5
  * BACKWATERS (Kerala): photo-1602216056096-3b40cc0c9944
  Format: https://images.unsplash.com/[PHOTO_ID]?auto=format&fit=crop&w=800&q=80
  CRITICAL: Images MUST match the theme. No people/faces in photos. Use unique IDs.
- personalizedReason: a short sentence (max 15 words) explaining why this destination is perfect for them, mentioning one or more of their specific interests (${formData.interests?.length ? formData.interests.join(", ") : "General"})
- nearbyPlaces: array of 3 objects, each with: name, distance, rating, type, and unique imageUrl
- hotels: array of 3 objects, each with: name, stars, price, rating, unique imageUrl, amenities, ac, wifi, familyFriendly

IMPORTANT: Recommend ONLY places in India. Use CATEGORIZED and VALID Unsplash IDs. Return ONLY raw JSON.`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are a professional Indian travel advisor. You must provide diverse recommendations for India with unique, high-quality Unsplash image IDs. YOU MUST ENSURE the image matches the location type (e.g., don't show a palace for a beach). Avoid images with people." },
            { role: "user", content: prompt },
          ],
          temperature: 0.8,
          response_format: { type: "json_object" }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Groq API error details:", errorData);
        throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
      }

      const rawData = await response.json();
      const content = rawData.choices?.[0]?.message?.content;

      if (!content) throw new Error("No content in AI response");

      let parsedDestinations;
      try {
        const parsed = JSON.parse(content);
        parsedDestinations = Array.isArray(parsed) ? parsed : (parsed.destinations || Object.values(parsed)[0]);
      } catch (e) {
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        parsedDestinations = JSON.parse(cleaned);
      }

      if (!Array.isArray(parsedDestinations)) {
        throw new Error("AI did not return a valid destinations array");
      }

      const dests: AIDestination[] = parsedDestinations.slice(0, 6).map((d: any, i: number) => ({
        ...d,
        id: i,
        nearbyPlaces: d.nearbyPlaces || [],
        hotels: d.hotels || [],
      }));

      setDestinations(dests);
      setShowResults(true);
      setHotelsIndex(null);

      setTimeout(() => {
        document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (e: any) {
      console.error("AI recommendation error:", e);
      toast.error(e?.message || "Failed to generate recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleViewHotels = useCallback((index: number) => {
    setHotelsIndex(index);
    setTimeout(() => {
      document.getElementById("hotels")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const selectedNearby = nearbyIndex !== null ? destinations[nearbyIndex] : null;

  return (
    <div className="scroll-smooth">
      <Navbar />
      <Hero />
      <RecommendationForm onGenerate={handleGenerate} loading={loading} />

      {showResults && destinations.length > 0 && (
        <DestinationCards
          destinations={destinations}
          onViewNearby={(i) => setNearbyIndex(i)}
          onViewHotels={handleViewHotels}
        />
      )}

      {hotelsIndex !== null && destinations[hotelsIndex] && (
        <HotelsSection
          hotels={destinations[hotelsIndex].hotels}
          destinationName={destinations[hotelsIndex].name}
        />
      )}

      {nearbyIndex !== null && selectedNearby && (
        <NearbyPlaces
          places={selectedNearby.nearbyPlaces}
          destinationName={selectedNearby.name}
          onClose={() => setNearbyIndex(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Index;
