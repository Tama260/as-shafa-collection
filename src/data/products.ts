export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  details: string;
  variations?: string[];
  sizes?: string[];
  image: string;
  category: "batik" | "kosmetik";
}

export const products: Product[] = [
  {
    id: "batik-tulis-01",
    name: "Batik Tulis Megamendung",
    price: 385000,
    description: "Batik tulis premium dengan motif Megamendung klasik yang anggun.",
    details: "Bahan: Katun primisima. Teknik tulis tangan tradisional. Pewarnaan alam. Cocok untuk acara formal maupun semi-formal.",
    variations: ["Biru Indigo", "Coklat Sogan", "Hijau Tosca"],
    sizes: ["S", "M", "L", "XL"],
    image: "",
    category: "batik",
  },
  {
    id: "batik-cap-01",
    name: "Batik Cap Parang Modern",
    price: 195000,
    description: "Batik cap dengan sentuhan modern pada motif Parang yang timeless.",
    details: "Bahan: Katun voile premium. Ringan dan nyaman dipakai sehari-hari. Warna tidak mudah luntur.",
    variations: ["Merah Maroon", "Navy", "Hitam"],
    sizes: ["M", "L", "XL", "XXL"],
    image: "",
    category: "batik",
  },
  {
    id: "batik-dress-01",
    name: "Dress Batik Peplum",
    price: 275000,
    description: "Dress batik elegan dengan potongan peplum yang feminin.",
    details: "Bahan: Kombinasi katun batik dan satin. Resleting belakang. Furing dalam. Ideal untuk kondangan atau acara kantor.",
    variations: ["Dusty Pink", "Cream Gold"],
    sizes: ["S", "M", "L"],
    image: "",
    category: "batik",
  },
  {
    id: "skincare-serum-01",
    name: "Brightening Glow Serum",
    price: 125000,
    description: "Serum pencerah wajah dengan kandungan Niacinamide & Vitamin C.",
    details: "Volume: 30ml. Kandungan: Niacinamide 5%, Vitamin C, Hyaluronic Acid. BPOM terdaftar. Untuk semua jenis kulit.",
    variations: ["Original", "Extra Glow"],
    image: "",
    category: "kosmetik",
  },
  {
    id: "lipstick-01",
    name: "Velvet Matte Lipstick",
    price: 89000,
    description: "Lipstik matte dengan tekstur velvet yang lembut dan tahan lama.",
    details: "Berat: 3.5g. Formula ringan dan melembapkan. Tahan hingga 8 jam. Tersedia dalam 5 warna cantik.",
    variations: ["Rosewood", "Nude Blush", "Berry Mauve", "Coral Dream", "Dusty Rose"],
    image: "",
    category: "kosmetik",
  },
  {
    id: "bodycare-01",
    name: "Luxury Body Lotion",
    price: 95000,
    description: "Body lotion premium dengan wangi bunga yang mewah dan tahan lama.",
    details: "Volume: 250ml. Kandungan: Shea Butter, Vitamin E, ekstrak bunga Jasmine. Melembapkan hingga 24 jam.",
    variations: ["Jasmine Gold", "Rose Petal"],
    image: "",
    category: "kosmetik",
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
