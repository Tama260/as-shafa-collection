
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  nama_lengkap TEXT NOT NULL,
  nomor_whatsapp TEXT NOT NULL,
  alamat_pengiriman TEXT NOT NULL,
  produk TEXT NOT NULL,
  variasi_produk TEXT,
  ukuran TEXT,
  jumlah_pesanan INTEGER NOT NULL DEFAULT 1,
  catatan_tambahan TEXT,
  status_order TEXT NOT NULL DEFAULT 'baru'
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
