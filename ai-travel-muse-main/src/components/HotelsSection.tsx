import { useState } from "react";
import { Star, Wifi, Wind, Users, DollarSign } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import type { AIHotel } from "@/types/travel";

interface Props {
  hotels: AIHotel[];
  destinationName: string;
}

const HotelsSection = ({ hotels, destinationName }: Props) => {
  const maxPrice = Math.max(500, ...hotels.map(h => h.price));
  const [priceRange, setPriceRange] = useState([maxPrice]);
  const [minRating, setMinRating] = useState(0);
  const [filterAC, setFilterAC] = useState(false);
  const [filterWifi, setFilterWifi] = useState(false);
  const [filterFamily, setFilterFamily] = useState(false);

  const filtered = hotels.filter(
    (h) =>
      h.price <= priceRange[0] &&
      h.rating >= minRating &&
      (!filterAC || h.ac) &&
      (!filterWifi || h.wifi) &&
      (!filterFamily || h.familyFriendly)
  );

  return (
    <section id="hotels" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hotels in <span className="text-gradient">{destinationName}</span>
          </h2>
          <p className="text-muted-foreground text-lg">Find the perfect stay for your trip.</p>
        </div>

        <div className="glass-strong rounded-2xl p-5 md:p-6 mb-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Max Price: <span className="text-primary">${priceRange[0]}/night</span>
              </label>
              <Slider value={priceRange} onValueChange={setPriceRange} max={maxPrice} min={50} step={10} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Min Rating: <span className="text-primary">{minRating || "Any"}</span>
              </label>
              <Slider value={[minRating]} onValueChange={([v]) => setMinRating(v)} max={5} min={0} step={0.5} />
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={filterAC} onCheckedChange={(v) => setFilterAC(!!v)} />
                <Wind className="h-4 w-4 text-muted-foreground" /><span className="text-sm">AC</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={filterWifi} onCheckedChange={(v) => setFilterWifi(!!v)} />
                <Wifi className="h-4 w-4 text-muted-foreground" /><span className="text-sm">Free WiFi</span>
              </label>
            </div>
            <div className="flex items-start">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={filterFamily} onCheckedChange={(v) => setFilterFamily(!!v)} />
                <Users className="h-4 w-4 text-muted-foreground" /><span className="text-sm">Family Friendly</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((hotel, i) => (
            <div
              key={i}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover-lift animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={hotel.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute top-3 left-3 gradient-cta text-primary-foreground rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />{hotel.price}/night
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-card-foreground mb-1">{hotel.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-gold fill-gold" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">({hotel.rating})</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {hotel.amenities.map((a) => (
                    <span key={a} className="bg-secondary text-secondary-foreground text-xs px-2.5 py-1 rounded-full">{a}</span>
                  ))}
                </div>
                <button className="w-full gradient-cta text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No hotels match your filters. Try adjusting your criteria.</p>
        )}
      </div>
    </section>
  );
};

export default HotelsSection;
