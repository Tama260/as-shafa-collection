import { motion } from "framer-motion";
import { Sparkles, Heart, Shield } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Kualitas Premium",
    desc: "Setiap produk dipilih dengan standar kualitas tertinggi untuk Anda.",
  },
  {
    icon: Heart,
    title: "Sentuhan Feminin",
    desc: "Desain elegan yang menonjolkan keanggunan dan keindahan wanita Indonesia.",
  },
  {
    icon: Shield,
    title: "Terpercaya",
    desc: "Ribuan pelanggan puas dengan layanan dan produk kami yang konsisten.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            Tentang Kami
          </h2>
          <div className="w-16 h-0.5 bg-secondary mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            As-Shafa Shop hadir untuk memenuhi kebutuhan fashion batik dan kecantikan wanita Indonesia.
            Kami percaya setiap wanita berhak tampil cantik dan percaya diri dengan produk berkualitas
            yang terjangkau.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-card rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-secondary/15 rounded-full flex items-center justify-center mx-auto mb-5">
                <f.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
