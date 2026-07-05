
-- featured-images: no public writes, keep public read (homepage displays them)
DROP POLICY IF EXISTS "Public upload featured-images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete featured-images" ON storage.objects;

-- listing-images: keep INSERT so the sell/rent-out form works, drop SELECT
DROP POLICY IF EXISTS "Public read listing-images" ON storage.objects;
