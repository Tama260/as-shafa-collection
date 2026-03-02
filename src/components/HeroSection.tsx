import { motion } from "framer-motion";
import logo from "@/assets/logo.jpeg";

const HeroSection = () => {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Decorative circles */}
      <div className="absolute top-20 right-[-100px] w-72 h-72 rounded-full bg-mauve/10 blur-3xl" />
      <div className="absolute bottom-20 left-[-80px] w-96 h-96 rounded-full bg-rose-gold/10 blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <img
            src={logo}
            alt="As-Shafa Shop Logo"
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full object-cover shadow-xl border-4 border-card"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-4 tracking-tight"
        >
          As-Shafa Shop
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg sm:text-xl text-muted-foreground mb-2 font-light"
        >
          Batik & Kosmetik Premium
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-base sm:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Keindahan tradisi batik Indonesia bertemu perawatan kecantikan modern.
          Tampil elegan dengan produk pilihan terbaik dari As-Shafa.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          onClick={scrollToProducts}
          className="inline-flex items-center px-8 py-3.5 bg-primary text-primary-foreground font-medium rounded-full hover:bg-plum-light transition-colors shadow-lg hover:shadow-xl text-sm tracking-wide"
        >
          Lihat Koleksi
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
