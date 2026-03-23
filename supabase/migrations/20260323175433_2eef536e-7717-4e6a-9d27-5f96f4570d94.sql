ALTER TABLE public.orders
  ADD CONSTRAINT chk_status
    CHECK (status IS NULL OR status IN ('pending','confirmed','processing','shipped','completed','cancelled')),
  ADD CONSTRAINT chk_metode_pembayaran
    CHECK (metode_pembayaran IN ('Transfer Bank','COD','E-Wallet'));