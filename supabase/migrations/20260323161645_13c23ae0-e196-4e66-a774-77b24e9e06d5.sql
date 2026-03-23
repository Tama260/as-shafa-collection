-- Enable RLS on all tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Allow guest checkout inserts
CREATE POLICY "Allow anonymous order insertion"
ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Public read access for catalog data
CREATE POLICY "Allow public read products"
ON public.products FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public read product_variants"
ON public.product_variants FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public read product_sizes"
ON public.product_sizes FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public read testimonials"
ON public.testimonials FOR SELECT TO anon, authenticated USING (true);