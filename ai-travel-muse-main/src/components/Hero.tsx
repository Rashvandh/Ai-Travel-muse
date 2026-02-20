import { Sparkles, MapPin } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => (
  <section
    id="home"
    className="relative min-h-screen flex items-center justify-center overflow-hidden"
  >
    {/* Background image */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background" />
    </div>

    <div className="relative z-10 container mx-auto px-4 text-center py-32 md:py-40">
      <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 animate-fade-up text-sm font-medium text-primary-foreground/90">
        <Sparkles className="h-4 w-4 text-gold" />
        <span className="text-primary-foreground">AI-Powered Travel Planning</span>
      </div>

      <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-up leading-tight" style={{ animationDelay: "0.1s" }}>
        Discover Your Perfect
        <br />
        <span className="text-gold">Destination</span> with AI
      </h1>

      <p className="max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/80 mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        Personalized travel recommendations, nearby attractions, hotels &amp; stays — all powered by AI.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
        <a
          href="#recommendations"
          className="gradient-cta text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Sparkles className="h-5 w-5" />
          Get Recommendations
        </a>
        <a
          href="#destinations"
          className="glass text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:bg-primary-foreground/10 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <MapPin className="h-5 w-5" />
          Explore Destinations
        </a>
      </div>
    </div>

    {/* Decorative bottom wave */}
    <div className="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
          fill="hsl(200 20% 98%)"
        />
      </svg>
    </div>
  </section>
);

export default Hero;
