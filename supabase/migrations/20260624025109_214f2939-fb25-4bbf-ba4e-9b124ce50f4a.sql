
-- Inquiries from /explore form
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intent TEXT NOT NULL,
  category TEXT,
  city TEXT,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  budget TEXT,
  sector TEXT,
  requirements TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit inquiry" ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Listing submissions from /list form
CREATE TABLE public.listing_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purpose TEXT,
  category TEXT,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  city TEXT,
  address TEXT,
  pincode TEXT,
  size TEXT,
  price TEXT,
  spec_details TEXT,
  image_names TEXT,
  image_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.listing_submissions TO anon, authenticated;
GRANT ALL ON public.listing_submissions TO service_role;
ALTER TABLE public.listing_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit listing" ON public.listing_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Featured properties shown on homepage
CREATE TABLE public.featured_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT 'Buy',
  bhk TEXT,
  size TEXT,
  description TEXT,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.featured_properties TO anon, authenticated;
GRANT ALL ON public.featured_properties TO service_role;
ALTER TABLE public.featured_properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active featured" ON public.featured_properties FOR SELECT TO anon, authenticated USING (is_active = true);
