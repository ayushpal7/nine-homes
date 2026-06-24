
DROP POLICY "Anyone can submit inquiry" ON public.inquiries;
CREATE POLICY "Anyone can submit inquiry" ON public.inquiries FOR INSERT TO anon, authenticated
  WITH CHECK (length(name) BETWEEN 2 AND 120 AND length(mobile) BETWEEN 7 AND 20 AND length(intent) BETWEEN 2 AND 30);

DROP POLICY "Anyone can submit listing" ON public.listing_submissions;
CREATE POLICY "Anyone can submit listing" ON public.listing_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (length(name) BETWEEN 2 AND 120 AND length(mobile) BETWEEN 7 AND 20);
