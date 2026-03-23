import { useState } from "react";
import { CheckCircle2, Loader2, MapPin, Phone, Instagram, Copy, Check } from "lucide-react";
import { Product, formatPrice } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

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
  metode_pembayaran: z.string().min(1, "Metode pembayaran wajib dipilih"),
});

function generateOrderId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `AS-${num}`;
}

interface OrderModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const OrderModal = ({ product, open, onClose }: OrderModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [copiedId, setCopiedId] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({
    nama: "",
    whatsapp: "",
    alamat: "",
    variasi: "",
    ukuran: "",
    jumlah: "1",
    catatan: "",
    metode_pembayaran: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

    const newOrderId = generateOrderId();

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-order", {
        body: {
          order_id: newOrderId,
          nama_lengkap: form.nama.trim(),
          nomor_whatsapp: form.whatsapp.trim(),
          alamat_pengiriman: form.alamat.trim(),
          produk_dipilih: product.name,
          variasi_produk: form.variasi || null,
          ukuran: form.ukuran || null,
          jumlah_pesanan: parseInt(form.jumlah) || 1,
          metode_pembayaran: form.metode_pembayaran,
          catatan_tambahan: form.catatan.trim() || null,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setOrderId(newOrderId);
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
    setOrderId("");
    setCopiedId(false);
    setForm({ nama: "", whatsapp: "", alamat: "", variasi: "", ukuran: "", jumlah: "1", catatan: "", metode_pembayaran: "" });
    setErrors({});
    onClose();
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
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
            <SuccessView
              orderId={orderId}
              productName={product.name}
              paymentMethod={form.metode_pembayaran}
              copiedId={copiedId}
              onCopy={copyOrderId}
              onClose={handleClose}
            />
          ) : (
            <OrderForm
              product={product}
              form={form}
              errors={errors}
              loading={loading}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

/* ─── Success View ─── */
function SuccessView({
  orderId,
  productName,
  paymentMethod,
  copiedId,
  onCopy,
  onClose,
}: {
  orderId: string;
  productName: string;
  paymentMethod: string;
  copiedId: boolean;
  onCopy: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="py-6 space-y-5"
    >
      <div className="text-center">
        <CheckCircle2 className="w-14 h-14 text-secondary mx-auto mb-3" />
        <h3 className="font-display text-lg font-semibold text-foreground mb-1">
          Terima kasih atas pembayaran Anda!
        </h3>
        <p className="text-muted-foreground text-sm">
          Pesanan Anda telah diterima.
        </p>
      </div>

      {/* Order details */}
      <div className="bg-muted/50 rounded-xl p-4 space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Order ID</span>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground font-mono">{orderId}</span>
            <button onClick={onCopy} className="p-1 hover:bg-muted rounded transition-colors" title="Salin Order ID">
              {copiedId ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Produk</span>
          <span className="font-medium text-foreground text-right max-w-[60%]">{productName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Metode Pembayaran</span>
          <span className="font-medium text-foreground">{paymentMethod}</span>
        </div>
      </div>

      {/* Store contact */}
      <div className="border border-border rounded-xl p-4 space-y-2.5 text-sm">
        <h4 className="font-display font-semibold text-foreground text-sm mb-1">Kontak Toko</h4>
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <span>As Shafa Shop, Jalan G Kerinci II No. 18, Kendayakan, KAB. SERANG, KRAGILAN, BANTEN, ID, 42184</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-4 h-4 shrink-0" />
          <span>+62 814-1227-5939</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Instagram className="w-4 h-4 shrink-0" />
          <span>as.shafa.collection</span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-3 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-plum-light transition-colors"
      >
        Tutup
      </button>
    </motion.div>
  );
}

/* ─── Order Form ─── */
function OrderForm({
  product,
  form,
  errors,
  loading,
  onChange,
  onSubmit,
}: {
  product: Product;
  form: Record<string, string>;
  errors: Record<string, string>;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40";

  return (
    <motion.form
      key="form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onSubmit={onSubmit}
      className="space-y-4"
    >
      {/* Product info */}
      <div className="bg-muted/50 rounded-xl p-4 mb-2">
        <p className="text-sm font-medium text-foreground">{product.name}</p>
        <p className="text-sm text-secondary font-semibold">{formatPrice(product.price)}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Nama Lengkap *</label>
        <input name="nama" required maxLength={200} value={form.nama} onChange={onChange} className={inputClass} placeholder="Masukkan nama lengkap" />
        {errors.nama && <p className="text-destructive text-xs mt-1">{errors.nama}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Nomor WhatsApp *</label>
        <input name="whatsapp" required maxLength={13} value={form.whatsapp} onChange={onChange} className={inputClass} placeholder="08xxxxxxxxxx" />
        {errors.whatsapp && <p className="text-destructive text-xs mt-1">{errors.whatsapp}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Alamat Pengiriman *</label>
        <textarea name="alamat" required maxLength={500} value={form.alamat} onChange={onChange} rows={2} className={`${inputClass} resize-none`} placeholder="Alamat lengkap pengiriman" />
        {errors.alamat && <p className="text-destructive text-xs mt-1">{errors.alamat}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Produk Dipilih</label>
        <input readOnly value={product.name} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-muted-foreground text-sm cursor-not-allowed" />
      </div>

      {product.variations && product.variations.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Variasi Produk</label>
          <select name="variasi" value={form.variasi} onChange={onChange} className={inputClass}>
            <option value="">Pilih variasi</option>
            {product.variations.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      )}

      {product.sizes && product.sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Ukuran</label>
          <select name="ukuran" value={form.ukuran} onChange={onChange} className={inputClass}>
            <option value="">Pilih ukuran</option>
            {product.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Jumlah Pesanan *</label>
        <input name="jumlah" type="number" min="1" max="999" required value={form.jumlah} onChange={onChange} className={inputClass} />
        {errors.jumlah && <p className="text-destructive text-xs mt-1">{errors.jumlah}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Metode Pembayaran *</label>
        <select name="metode_pembayaran" required value={form.metode_pembayaran} onChange={onChange} className={inputClass}>
          <option value="">Pilih metode pembayaran</option>
          <option value="Transfer Bank">Transfer Bank</option>
          <option value="COD">COD (Bayar di Tempat)</option>
          <option value="E-Wallet">E-Wallet</option>
        </select>
        {errors.metode_pembayaran && <p className="text-destructive text-xs mt-1">{errors.metode_pembayaran}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Catatan Tambahan</label>
        <textarea name="catatan" maxLength={1000} value={form.catatan} onChange={onChange} rows={2} className={`${inputClass} resize-none`} placeholder="Catatan khusus (opsional)" />
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
  );
}

export default OrderModal;
