import { Plane, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer id="contact" className="bg-foreground text-primary-foreground/80">
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand */}
        <div className="text-center md:text-left">
          <a href="#home" className="flex items-center justify-center md:justify-start gap-2 text-primary-foreground font-display text-xl font-bold mb-4">
            <Plane className="h-6 w-6" /> TravelAI
          </a>
          <p className="text-sm max-w-xs leading-relaxed">
            Your AI-powered travel companion. Discover destinations, find hotels, and plan your perfect trip.
          </p>
        </div>

        <div className="text-center md:text-right text-xs pt-4 border-t border-primary-foreground/10 md:border-t-0 md:pt-0">
          © {new Date().getFullYear()} TravelAI. All rights reserved. <br className="md:hidden" /> Powered by Artificial Intelligence.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
