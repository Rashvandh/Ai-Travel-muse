import { MapPin, Calendar, DollarSign, Star, Eye, Hotel } from "lucide-react";
import type { AIDestination } from "@/types/travel";

interface Props {
  destinations: AIDestination[];
  onViewNearby: (index: number) => void;
  onViewHotels: (index: number) => void;
}

const DestinationCards = ({ destinations, onViewNearby, onViewHotels }: Props) => (
  <section id="destinations" className="py-20 md:py-28 bg-secondary/30">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
          AI-Recommended <span className="text-gradient">Destinations</span>
        </h2>
        <p className="text-muted-foreground text-lg">Handpicked destinations tailored to your preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest, i) => (
          <div
            key={i}
            className="group bg-card rounded-2xl overflow-hidden shadow-card hover-lift animate-fade-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="relative overflow-hidden h-52 bg-muted">
              <img
                src={dest.imageUrl || "https://images.unsplash.com/photo-1564507592333-c60657eaa0af?auto=format&fit=crop&w=800&q=80"}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1564507592333-c60657eaa0af?auto=format&fit=crop&w=800&q=80";
                }}
              />
              <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-semibold">
                <Star className="h-3.5 w-3.5 text-gold fill-gold" />
                {dest.rating}
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-display text-xl font-bold text-card-foreground mb-1">{dest.name}</h3>
              <p className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <MapPin className="h-3.5 w-3.5" /> {dest.location}
              </p>
              <p className="text-sm text-card-foreground/70 mb-2 line-clamp-2">{dest.description}</p>
              <p className="text-xs font-medium text-primary mb-4 italic">
                ✨ {dest.personalizedReason}
              </p>

              <div className="flex items-center gap-4 mb-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{dest.budget}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{dest.bestTime}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onViewNearby(i)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-secondary text-secondary-foreground py-2.5 rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  <Eye className="h-4 w-4" /> Nearby Places
                </button>
                <button
                  onClick={() => onViewHotels(i)}
                  className="flex-1 flex items-center justify-center gap-1.5 gradient-cta text-primary-foreground py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Hotel className="h-4 w-4" /> Find Hotels
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DestinationCards;
