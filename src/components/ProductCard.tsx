import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Product, formatPrice } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index: number;
  onOrder: (product: Product) => void;
}

const StarRating = ({ rating, count }: { rating: number; count: number }) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const partial = !filled && rating > star - 1;
          return (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${
                filled
                  ? "text-amber-400 fill-amber-400"
                  : partial
                  ? "text-amber-400 fill-amber-400/50"
                  : "text-muted-foreground/30"
              }`}
            />
          );
        })}
      </div>
      <span className="text-xs font-semibold text-foreground">{rating}</span>
      <span className="text-xs text-muted-foreground">|</span>
      <span className="text-xs text-muted-foreground">{count} rating</span>
    </div>
  );
};

const ProductCard = ({ product, index, onOrder }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Product image */}
      <div className="aspect-[4/5] relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="font-display font-semibold text-foreground text-lg mb-1 leading-snug">{product.name}</h3>
        <StarRating rating={product.rating} count={product.ratingCount} />
        <p className="text-secondary font-semibold text-base mt-2 mb-3">{formatPrice(product.price)}</p>
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
