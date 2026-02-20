import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormData } from "@/types/travel";

const preferences = ["Beach", "Mountains", "City", "Temple", "Adventure"];
const interestsList = ["Food", "Nature", "History", "Shopping", "Wildlife", "Nightlife"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const statesOfIndia = [
  "Any", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar", "Delhi", "Ladakh"
];

interface Props {
  onGenerate: (data: FormData) => void;
  loading: boolean;
}

const RecommendationForm = ({ onGenerate, loading }: Props) => {
  const [preference, setPreference] = useState("");
  const [selectedState, setSelectedState] = useState("Any");
  const [budget, setBudget] = useState([5000]);
  const [duration, setDuration] = useState("");
  const [people, setPeople] = useState("");
  const [month, setMonth] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = () => {
    onGenerate({
      preference,
      state: selectedState === "Any" ? undefined : selectedState,
      budget: budget[0],
      duration,
      people,
      month,
      interests: selectedInterests,
    });
  };

  return (
    <section id="recommendations" className="py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find Your <span className="text-gradient">Dream Destination</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Tell us your preferences and let our AI craft the perfect travel plan for you.
          </p>
        </div>

        <div className="glass-strong rounded-2xl p-6 md:p-10 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">Destination Preference</label>
              <div className="flex flex-wrap gap-2">
                {preferences.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPreference(p)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${preference === p
                        ? "gradient-cta text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">Preferred State</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Select State" /></SelectTrigger>
                <SelectContent>
                  {statesOfIndia.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-foreground mb-3">
              Budget Range: <span className="text-primary">${budget[0].toLocaleString()}</span>
            </label>
            <Slider value={budget} onValueChange={setBudget} max={20000} min={500} step={500} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>$500</span><span>$20,000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Duration</label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["1-3 days", "4-7 days", "1-2 weeks", "2+ weeks"].map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">People</label>
              <Select value={people} onValueChange={setPeople}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["Solo", "Couple", "3-4", "5-8", "9+"].map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Travel Month</label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-foreground mb-3">Interests</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {interestsList.map((interest) => (
                <label key={interest} className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={selectedInterests.includes(interest)}
                    onCheckedChange={() => toggleInterest(interest)}
                  />
                  <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full gradient-cta text-primary-foreground py-4 rounded-xl text-base font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="h-5 w-5" /> Generate AI Recommendations</>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecommendationForm;
