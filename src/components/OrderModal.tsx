import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Product, formatPrice } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const orderSchema = z.object({
  nama: z.string().trim().min(1, "Nama wajib diisi").max(200, "Nama maksimal 200 karakter"),
  whatsapp: z.string().trim().regex(/^08[0-9]{8,11}$/, "Format nomor WhatsApp tidak valid (contoh: 08xxxxxxxxxx)"),
  alamat: z.string().trim().min(1, "Alamat wajib diisi").max(500, "Alamat maksimal 500 karakter"),
  variasi: z.string().max(200).optional(),
  ukuran: z.string().max(100).optional(),
  jumlah: z.string().refine((v) => {
    const n = parseInt(v);
    return !isNaN(n) && n >= 1 && n <= 999;
  }, "Jumlah harus antara 1-999"),
  catatan: z.string().max(1000, "Catatan maksimal 1000 karakter").optional(),
});
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface OrderModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const OrderModal = ({ product, open, onClose }: OrderModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || loading) return;

    const result = orderSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      const { error } = await supabase.from("orders").insert({
        nama_lengkap: form.nama.trim(),
        nomor_whatsapp: form.whatsapp.trim(),
        alamat_pengiriman: form.alamat.trim(),
        produk: product.name,
        variasi_produk: form.variasi || null,
        ukuran: form.ukuran || null,
        jumlah_pesanan: parseInt(form.jumlah) || 1,
        catatan_tambahan: form.catatan.trim() || null,
      });

      if (error) throw error;
      setSubmitted(true);
    } catch {
      toast({
        title: "Gagal mengirim pesanan",
        description: "Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-8"
            >
              <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Pesanan berhasil dikirim!
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Tim As-Shafa Shop akan segera menghubungi Anda melalui WhatsApp.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-plum-light transition-colors"
              >
                Tutup
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
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
                  maxLength={200}
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  placeholder="Masukkan nama lengkap"
                />
                {errors.nama && <p className="text-destructive text-xs mt-1">{errors.nama}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nomor WhatsApp *</label>
                <input
                  name="whatsapp"
                  required
                  maxLength={13}
                  value={form.whatsapp}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  placeholder="08xxxxxxxxxx"
                />
                {errors.whatsapp && <p className="text-destructive text-xs mt-1">{errors.whatsapp}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Alamat Pengiriman *</label>
                <textarea
                  name="alamat"
                  required
                  maxLength={500}
                  value={form.alamat}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 resize-none"
                  placeholder="Alamat lengkap pengiriman"
                />
                {errors.alamat && <p className="text-destructive text-xs mt-1">{errors.alamat}</p>}
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
                  max="999"
                  required
                  value={form.jumlah}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                />
                {errors.jumlah && <p className="text-destructive text-xs mt-1">{errors.jumlah}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Catatan Tambahan</label>
                <textarea
                  name="catatan"
                  maxLength={1000}
                  value={form.catatan}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 resize-none"
                  placeholder="Catatan khusus (opsional)"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-plum-light transition-colors shadow-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  "Kirim Pesanan"
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
