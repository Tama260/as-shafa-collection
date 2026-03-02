import logo from "@/assets/logo.jpeg";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("hero")}>
            <img src={logo} alt="As-Shafa Shop Logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover shadow-md" />
            <span className="font-display text-lg sm:text-xl font-semibold text-foreground tracking-wide">
              As-Shafa Shop
            </span>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Beranda", id: "hero" },
              { label: "Tentang", id: "about" },
              { label: "Produk", id: "products" },
              { label: "Testimoni", id: "testimonials" },
              { label: "Kontak", id: "footer" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
          <div className="px-4 py-4 space-y-3">
            {[
              { label: "Beranda", id: "hero" },
              { label: "Tentang", id: "about" },
              { label: "Produk", id: "products" },
              { label: "Testimoni", id: "testimonials" },
              { label: "Kontak", id: "footer" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
