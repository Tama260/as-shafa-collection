import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { Product, formatPrice } from "@/data/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const OrderModal = ({ product, open, onClose }: OrderModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    whatsapp: "",
    alamat: "",
    variasi: "",
    ukuran: "",
    jumlah: "1",
    catatan: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ nama: "", whatsapp: "", alamat: "", variasi: "", ukuran: "", jumlah: "1", catatan: "" });
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-cream-light border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">
            {submitted ? "Pesanan Terkirim" : "Form Pemesanan"}
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              Terima Kasih!
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Pesanan berhasil dikirim. Tim As-Shafa Shop akan segera menghubungi Anda.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-plum-light transition-colors"
            >
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product info */}
            <div className="bg-muted/50 rounded-xl p-4 mb-2">
              <p className="text-sm font-medium text-foreground">{product.name}</p>
              <p className="text-sm text-secondary font-semibold">{formatPrice(product.price)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nama Lengkap *</label>
              <input
                name="nama"
                required
                value={form.nama}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nomor WhatsApp *</label>
              <input
                name="whatsapp"
                required
                value={form.whatsapp}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Alamat Pengiriman *</label>
              <textarea
                name="alamat"
                required
                value={form.alamat}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 resize-none"
                placeholder="Alamat lengkap pengiriman"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Produk Dipilih</label>
              <input
                readOnly
                value={product.name}
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-muted-foreground text-sm cursor-not-allowed"
              />
            </div>

            {product.variations && product.variations.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Variasi Produk</label>
                <select
                  name="variasi"
                  value={form.variasi}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                >
                  <option value="">Pilih variasi</option>
                  {product.variations.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Ukuran</label>
                <select
                  name="ukuran"
                  value={form.ukuran}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                >
                  <option value="">Pilih ukuran</option>
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Jumlah Pesanan *</label>
              <input
                name="jumlah"
                type="number"
                min="1"
                required
                value={form.jumlah}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Catatan Tambahan</label>
              <textarea
                name="catatan"
                value={form.catatan}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 resize-none"
                placeholder="Catatan khusus (opsional)"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-plum-light transition-colors shadow-sm mt-2"
            >
              Kirim Pesanan
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
