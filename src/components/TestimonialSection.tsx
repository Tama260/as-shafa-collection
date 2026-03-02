import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sari Dewi",
    text: "Batik dari As-Shafa kualitasnya luar biasa! Jahitannya rapi, motifnya cantik. Sudah 3 kali pesan dan selalu puas.",
    rating: 5,
    location: "Jakarta",
  },
  {
    name: "Rina Maharani",
    text: "Serum brightening-nya mantap banget, kulit jadi lebih cerah dalam 2 minggu. Packaging-nya juga elegan. Recommended!",
    rating: 5,
    location: "Surabaya",
  },
  {
    name: "Fitri Handayani",
    text: "Lipstiknya tahan lama dan warnanya cantik banget. Harganya terjangkau tapi kualitas premium. Pasti repeat order!",
    rating: 5,
    location: "Bandung",
  },
];

const TestimonialSection = () => {
  return (
    <section id="testimonials" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            Apa Kata Pelanggan
          </h2>
          <div className="w-16 h-0.5 bg-secondary mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">
                "{t.text}"
              </p>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
