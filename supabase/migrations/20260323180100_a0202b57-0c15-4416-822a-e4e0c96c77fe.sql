ALTER TABLE public.orders
  ADD CONSTRAINT chk_produk_dipilih_length
    CHECK (char_length(produk_dipilih) BETWEEN 1 AND 200);