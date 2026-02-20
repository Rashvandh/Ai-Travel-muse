import { X, Star, MapPin, Navigation } from "lucide-react";
import type { AINearbyPlace } from "@/types/travel";

interface Props {
  places: AINearbyPlace[];
  destinationName: string;
  onClose: () => void;
}

const NearbyPlaces = ({ places, destinationName, onClose }: Props) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-card rounded-2xl shadow-elevated max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-scale-in">
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-5 flex items-center justify-between rounded-t-2xl">
        <div>
          <h3 className="font-display text-xl font-bold text-card-foreground">Nearby Places</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="h-3.5 w-3.5" /> {destinationName}
          </p>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-5 space-y-4">
        <div className="bg-secondary rounded-xl h-40 flex items-center justify-center text-muted-foreground text-sm">
          <Navigation className="h-5 w-5 mr-2" /> Map Preview
        </div>

        {places.map((place, i) => (
          <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
            <div className="w-20 h-20 rounded-xl bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center text-2xl">
              {place.imageUrl ? (
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=300&q=80";
                  }}
                />
              ) : (
                place.type === "Temple" ? "🛕" : place.type === "Beach" ? "🏖️" : place.type === "Nature" ? "🌿" : place.type === "Wildlife" ? "🦁" : place.type === "History" ? "🏛️" : "📍"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-card-foreground">{place.name}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{place.type} · {place.distance} away</p>
              <div className="flex items-center gap-1 mt-1.5">
                <Star className="h-3.5 w-3.5 text-gold fill-gold" />
                <span className="text-sm font-medium">{place.rating}</span>
              </div>
            </div>
          </div>
        ))}

        {places.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No nearby places data available.</p>
        )}
      </div>
    </div>
  </div>
);

export default NearbyPlaces;
