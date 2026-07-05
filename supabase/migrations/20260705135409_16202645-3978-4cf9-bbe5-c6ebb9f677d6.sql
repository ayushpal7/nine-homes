
-- Remove overly-permissive public read/write policies. Data will be accessed
-- via a password-protected edge function using the service role.
DROP POLICY IF EXISTS "Public read inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Public read listing_submissions" ON public.listing_submissions;
DROP POLICY IF EXISTS "Public insert featured" ON public.featured_properties;
DROP POLICY IF EXISTS "Public update featured" ON public.featured_properties;
DROP POLICY IF EXISTS "Public delete featured" ON public.featured_properties;
