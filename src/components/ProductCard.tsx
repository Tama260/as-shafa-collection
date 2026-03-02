import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Product, formatPrice } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index: number;
  onOrder: (product: Product) => void;
}

const ProductCard = ({ product, index, onOrder }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Image placeholder */}
      <div className="aspect-[4/5] bg-cream-dark/40 relative overflow-hidden flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-7 h-7 text-secondary" />
          </div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {product.category === "batik" ? "Koleksi Batik" : "Kosmetik"}
          </p>
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="font-display font-semibold text-foreground text-lg mb-1 leading-snug">{product.name}</h3>
        <p className="text-secondary font-semibold text-base mb-3">{formatPrice(product.price)}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{product.description}</p>

        {product.variations && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.variations.map((v) => (
              <span
                key={v}
                className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
              >
                {v}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => onOrder(product)}
          className="w-full py-3 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-plum-light transition-colors shadow-sm"
        >
          Pesan Sekarang
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
