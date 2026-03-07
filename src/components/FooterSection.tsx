import { MapPin, Phone, Mail, Instagram } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const FooterSection = () => {
  return (
    <footer id="footer" className="bg-primary text-primary-foreground py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="As-Shafa Shop" className="w-10 h-10 rounded-full object-cover" />
              <span className="font-display text-lg font-semibold">As-Shafa Shop</span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Batik & Kosmetik Premium. Keindahan tradisi bertemu perawatan modern untuk wanita Indonesia.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <span>+62 814-1227-5939</span>
              </li>
              <li className="flex items-start gap-2">
                <Instagram className="w-4 h-4 mt-0.5 shrink-0" />
                <span>as.shafa.collection</span>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Alamat</h4>
            <div className="flex items-start gap-2 text-sm text-primary-foreground/70">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Jl. Raya Batik No. 88, Pekalongan, Jawa Tengah, Indonesia</span>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/15 pt-6 text-center">
          <p className="text-xs text-primary-foreground/50">
            © 2026 As-Shafa Shop. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
