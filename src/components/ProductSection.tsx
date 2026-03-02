import { useState } from "react";
import { motion } from "framer-motion";
import { products, Product } from "@/data/products";
import ProductCard from "./ProductCard";
import OrderModal from "./OrderModal";

const ProductSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<"all" | "batik" | "kosmetik">("all");

  const filtered = filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <section id="products" className="py-20 sm:py-28 bg-card/50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            Koleksi Produk
          </h2>
          <div className="w-16 h-0.5 bg-secondary mx-auto mb-6" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            Temukan koleksi batik eksklusif dan produk kecantikan pilihan untuk tampil sempurna setiap hari.
          </p>
        </motion.div>

        {/* Filter */}
        <div className="flex justify-center gap-3 mb-10">
          {[
            { key: "all", label: "Semua" },
            { key: "batik", label: "Batik" },
            { key: "kosmetik", label: "Kosmetik" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onOrder={setSelectedProduct}
            />
          ))}
        </div>
      </div>

      <OrderModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
};

export default ProductSection;
