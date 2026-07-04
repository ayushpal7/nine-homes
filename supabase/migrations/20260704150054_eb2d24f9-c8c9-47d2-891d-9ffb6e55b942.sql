
ALTER TABLE public.listing_submissions
  ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT '{}'::text[];

GRANT SELECT ON public.inquiries TO anon, authenticated;
GRANT SELECT ON public.listing_submissions TO anon, authenticated;

DROP POLICY IF EXISTS "Public read inquiries" ON public.inquiries;
CREATE POLICY "Public read inquiries" ON public.inquiries
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read listing_submissions" ON public.listing_submissions;
CREATE POLICY "Public read listing_submissions" ON public.listing_submissions
  FOR SELECT TO anon, authenticated USING (true);

GRANT INSERT, UPDATE, DELETE ON public.featured_properties TO anon, authenticated;

DROP POLICY IF EXISTS "Public insert featured" ON public.featured_properties;
CREATE POLICY "Public insert featured" ON public.featured_properties
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public update featured" ON public.featured_properties;
CREATE POLICY "Public update featured" ON public.featured_properties
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete featured" ON public.featured_properties;
CREATE POLICY "Public delete featured" ON public.featured_properties
  FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read listing-images" ON storage.objects;
CREATE POLICY "Public read listing-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'listing-images');

DROP POLICY IF EXISTS "Public upload listing-images" ON storage.objects;
CREATE POLICY "Public upload listing-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'listing-images');

DROP POLICY IF EXISTS "Public read featured-images" ON storage.objects;
CREATE POLICY "Public read featured-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'featured-images');

DROP POLICY IF EXISTS "Public upload featured-images" ON storage.objects;
CREATE POLICY "Public upload featured-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'featured-images');

DROP POLICY IF EXISTS "Public delete featured-images" ON storage.objects;
CREATE POLICY "Public delete featured-images" ON storage.objects
  FOR DELETE USING (bucket_id = 'featured-images');
