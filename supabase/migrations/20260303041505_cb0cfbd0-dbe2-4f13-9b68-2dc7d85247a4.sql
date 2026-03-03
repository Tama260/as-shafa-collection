
-- Add CHECK constraints for input validation on orders table
ALTER TABLE public.orders
  ADD CONSTRAINT chk_nama_lengkap_length CHECK (char_length(nama_lengkap) BETWEEN 1 AND 200),
  ADD CONSTRAINT chk_nomor_whatsapp_format CHECK (nomor_whatsapp ~ '^08[0-9]{8,11}$'),
  ADD CONSTRAINT chk_alamat_pengiriman_length CHECK (char_length(alamat_pengiriman) BETWEEN 1 AND 500),
  ADD CONSTRAINT chk_catatan_tambahan_length CHECK (catatan_tambahan IS NULL OR char_length(catatan_tambahan) <= 1000),
  ADD CONSTRAINT chk_jumlah_pesanan_range CHECK (jumlah_pesanan BETWEEN 1 AND 999),
  ADD CONSTRAINT chk_produk_length CHECK (char_length(produk) BETWEEN 1 AND 200),
  ADD CONSTRAINT chk_variasi_produk_length CHECK (variasi_produk IS NULL OR char_length(variasi_produk) <= 200),
  ADD CONSTRAINT chk_ukuran_length CHECK (ukuran IS NULL OR char_length(ukuran) <= 100);
