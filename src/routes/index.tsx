import { useEffect, useState } from "react";
import heroImg from "@/assets/hero.jpg";
import satishAsset from "@/assets/satish-real.jpg.asset.json";
import { PageShell, SectionLabel, WHATSAPP_URL } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";

const satishImg = satishAsset.url;

export default function Index() {
  return (
    <PageShell>
      <Hero />
      <WhyUs />
      <Featured />
      <SatishBio />
      <Areas />
      <Testimonials />
      <ContactStrip />
    </PageShell>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const cities = ["DELHI", "GURGAON", "NOIDA", "GREATER NOIDA", "FARIDABAD", "GHAZIABAD"];
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-20 px-5">
      <img src={heroImg} alt="Delhi NCR luxury skyline" className="absolute inset-0 w-full h-full object-cover opacity-30" width={1920} height={1280} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1931]/70 via-[#0A1931]/85 to-[#0A1931]" />
      <div className="relative max-w-6xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] gold-text border border-[rgba(212,175,55,0.4)] rounded-full px-4 py-2 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          ZERO9HOME REAL ESTATE
        </div>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] mb-8 max-w-5xl">
          Curating Delhi NCR's <span className="gold-text italic">Finest Homes</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl text-white/90 leading-relaxed mb-12 font-light">
          Serving Delhi NCR with <span className="gold-text font-medium">24+ years</span> of experience in residential, commercial, and rental properties across Delhi, Gurgaon, Noida, Greater Noida, Faridabad, and Ghaziabad.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="/explore" className="btn-gold">Explore properties →</a>
          <a href="/list" className="btn-gold-outline">List your property</a>
        </div>
        <div className="mt-14 flex flex-wrap gap-2">
          {cities.map((c) => (
            <span key={c} className="px-4 py-2 rounded-full border border-[rgba(212,175,55,0.3)] font-mono text-[10px] tracking-[0.2em] text-white/80 hover:border-gold hover:text-gold transition-colors">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHY US ---------------- */
function WhyUs() {
  const items = [
    { icon: "🏆", t: "24+ Years Experience", d: "Helping families and investors make informed, profitable, and secure property decisions." },
    { icon: "🔍", t: "Verified Properties", d: "Every luxury and premium listing is personally reviewed and authenticated before recommendation." },
    { icon: "🖋️", t: "End-to-End Support", d: "Complete handling from curated site visits to rigorous legal verification, documentation, and registration." },
    { icon: "🗺️", t: "Local Market Knowledge", d: "Deep, micro-market level understanding of pricing cycles and growth spots across Noida, Delhi, and Gurgaon." },
  ];
  return (
    <section className="py-24 px-5 bg-surface/40">
      <div className="max-w-7xl mx-auto">
        <SectionLabel kicker="Established Real Estate" title={<>Why Choose <em className="gold-text not-italic">Zero9Home</em></>} />
        <p className="text-white/80 max-w-2xl mt-6 text-lg">As Delhi NCR's most trusted real estate advisors, we deliver an elite level of care, transparency, and local expertise.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {items.map((it, i) => (
            <div key={it.t} className="relative gold-border rounded-2xl p-8 bg-navy-deep/60 hover:bg-navy/80 transition-all hover:-translate-y-1 group">
              <div className="text-3xl mb-4">{it.icon}</div>
              <div className="font-mono text-xs gold-text mb-3">0{i + 1}</div>
              <h3 className="font-display text-2xl mb-4 leading-tight">{it.t}</h3>
              <p className="text-white/85 text-sm leading-relaxed">{it.d}</p>
              <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FEATURED ---------------- */
type FeaturedRow = {
  id: string; title: string; location: string; price: string; tag: string;
  bhk: string | null; size: string | null; description: string | null;
  image_urls: string[];
};

function Featured() {
  const [listings, setListings] = useState<FeaturedRow[]>([]);
  useEffect(() => {
    supabase.from("featured_properties").select("*").eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => setListings((data as FeaturedRow[]) ?? []));
  }, []);

  return (
    <section className="py-24 px-5">
      <div className="max-w-7xl mx-auto">
        <SectionLabel kicker="Handpicked Exclusives" title={<>Featured <em className="gold-text not-italic">Handpicked Properties</em></>} />
        <p className="text-white/80 max-w-2xl mt-6 text-lg">Browse our exclusive listings with comprehensive photos, location transparency, and detailed parameters.</p>
        {listings.length === 0 ? (
          <p className="mt-14 text-white/60 font-mono text-sm">New featured properties coming soon. Meanwhile, share your requirement on Explore.</p>
        ) : (
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <article key={l.id} className="rounded-2xl overflow-hidden bg-surface border border-[rgba(212,175,55,0.25)] group hover:gold-glow transition-all">
                <div className="aspect-[4/3] bg-gradient-to-br from-navy to-navy-deep relative overflow-hidden">
                  {l.image_urls[0] ? (
                    <img src={l.image_urls[0]} alt={l.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center font-display text-7xl text-white/10">9</span>
                  )}
                  <span className="absolute top-4 left-4 bg-gold text-navy-deep text-[10px] font-mono font-semibold px-3 py-1.5 rounded-full tracking-wider">{l.tag.toUpperCase()}</span>
                  {l.image_urls.length > 1 && (
                    <span className="absolute top-4 right-4 bg-navy-deep/80 text-white text-[10px] font-mono px-3 py-1.5 rounded-full">📷 {l.image_urls.length} Photos</span>
                  )}
                </div>
                <div className="p-6">
                  <div className="font-display text-2xl gold-text mb-1">{l.price}</div>
                  <h3 className="font-display text-xl mb-1">{l.title}</h3>
                  <p className="text-white/70 text-sm mb-4">📍 {l.location}</p>
                  <div className="flex items-center gap-2 text-gold text-[11px] font-mono tracking-wider mb-4">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    VERIFIED LISTING
                  </div>
                  <div className="flex gap-4 text-sm text-white/85 pb-4 border-b border-[rgba(212,175,55,0.15)]">
                    {l.bhk && <span>🛏️ {l.bhk}</span>}{l.size && <span>📐 {l.size}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-gold text-navy-deep grid place-items-center font-mono text-xs font-bold">SP</span>
                      <span className="text-sm">Satish Pal</span>
                    </div>
                    <a href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi, I'd like details on ${l.title}`)}`} target="_blank" rel="noreferrer" className="text-[#25D366] text-sm font-mono tracking-wider hover:text-gold">WhatsApp →</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="text-center mt-12">
          <a href="/explore" className="btn-gold">Explore All properties →</a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- SATISH BIO ---------------- */
function SatishBio() {
  return (
    <section className="py-24 px-5 bg-surface/40">
      <div className="max-w-7xl mx-auto">
        <SectionLabel kicker="The Face of the Brand" title={<>Meet <em className="gold-text not-italic">Satish Pal</em></>} />
        <div className="grid lg:grid-cols-12 gap-6 mt-14">
          <div className="lg:col-span-5 rounded-2xl overflow-hidden gold-border bg-navy-deep">
            <img src={satishImg} alt="Satish Pal — Founder, Zero9Home" loading="lazy" width={1024} height={1280} className="w-full h-full object-cover aspect-[4/5]" />
          </div>
          <div className="lg:col-span-7 grid gap-6">
            <div className="rounded-2xl gold-border p-8 bg-navy">
              <div className="font-mono text-xs gold-text tracking-widest mb-3">FOUNDER · PROPERTY ADVISOR · VISIONARY LEADER</div>
              <h3 className="font-display text-4xl md:text-5xl mb-2">Satish Pal</h3>
              <p className="text-white/70 text-sm mb-6 font-mono">Trusted real estate lead · established 2002</p>
              <p className="text-lg leading-relaxed text-white/90 mb-4">
                For over <span className="gold-text font-medium">24 years</span>, Satish Pal has helped families, investors, and business owners navigate Delhi NCR's real estate market with confidence.
              </p>
              <p className="text-base leading-relaxed text-white/80">
                His hands-on approach, profound legal astuteness, and direct property screening have made him a highly trusted lead advisor for property buyers, sellers, and landlords alike.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[["24+", "Years"], ["2.4K+", "Families"], ["6", "Cities"]].map(([n, l]) => (
                <div key={l} className="rounded-2xl gold-border p-6 bg-navy-deep text-center">
                  <div className="font-display text-3xl gold-text">{n}</div>
                  <div className="font-mono text-[10px] tracking-widest uppercase mt-1 text-white/80">{l}</div>
                </div>
              ))}
            </div>
            <a href={`${WHATSAPP_URL}?text=${encodeURIComponent("Hi Satish ji, I'd like to schedule a consultation.")}`} target="_blank" rel="noreferrer" className="btn-gold text-lg py-5">
              [ Schedule a Consultation ]
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- AREAS ---------------- */
function Areas() {
  const areas = [
    { name: "Delhi", sub: "Core Micro Markets" },
    { name: "Gurgaon", sub: "Luxury & Cyber Hubs" },
    { name: "Noida", sub: "Sectors & Expressways" },
    { name: "Faridabad", sub: "Residential Hubs" },
    { name: "Uttar Pradesh", sub: "Emerging Corridors" },
  ];
  return (
    <section className="py-24 px-5">
      <div className="max-w-7xl mx-auto">
        <SectionLabel kicker="Geographical Coverage" title={<>Areas <em className="gold-text not-italic">We Serve</em></>} />
        <p className="text-white/80 max-w-2xl mt-6 text-lg">Offering luxury, premium, and reliable commercial, residential, and plot assets across North India's premiere real estate hub.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-12">
          {areas.map((a) => (
            <div key={a.name} className="rounded-2xl gold-border bg-navy-deep p-6 text-center hover:bg-navy transition-all">
              <div className="font-display text-2xl mb-1">{a.name}</div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold">{a.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS ---------------- */
function Testimonials() {
  const t = [
    { name: "Rajesh Mehra", role: "Vasant Kunj Resident", quote: "Satish ji guided us throughout the entire process of acquiring our 3BHK flat in Vasant Kunj and ensured everything was transparent and hassle-free. His documentation checks are incredibly thorough." },
    { name: "Rohan & Priya", role: "Gurgaon Tenants", quote: "We were looking for an executive apartment rental in Gurgaon for months. One single interaction with Satish Pal and we had our hands on a fully verified home within our tight timeline. Outstanding service!" },
    { name: "Anil Verma", role: "Property Seller", quote: "Sold my luxury floor in Noida Sector 150 at our exact target price without any third-party pressure. Satish's direct mediation and deep networks are simply unmatched. Elegant real estate at its finest!" },
  ];
  return (
    <section className="py-24 px-5 bg-surface/40">
      <div className="max-w-7xl mx-auto">
        <SectionLabel kicker="Genuine Verification" title={<>Client <em className="gold-text not-italic">Stories</em></>} />
        <p className="text-white/80 max-w-2xl mt-6 text-lg">Read experiences from real homeowners, sellers, and families who placed their total trust in Satish Pal.</p>
        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {t.map((it) => (
            <figure key={it.name} className="rounded-2xl p-8 bg-navy-deep gold-border flex flex-col gap-6 hover:gold-glow transition-all">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="var(--gold)" className="opacity-80"><path d="M4.5 10C4.5 6 7 4 10 4v3c-1.5 0-3 1-3 3h3v7H4.5v-7zm9 0c0-4 2.5-6 5.5-6v3c-1.5 0-3 1-3 3h3v7h-5.5v-7z"/></svg>
              <blockquote className="text-white/95 leading-relaxed text-[15px] flex-1">"{it.quote}"</blockquote>
              <figcaption>
                <div className="font-display text-xl">{it.name}</div>
                <div className="font-mono text-[11px] tracking-wider gold-text mt-1 uppercase">({it.role})</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CONTACT STRIP ---------------- */
function ContactStrip() {
  return (
    <section className="py-24 px-5">
      <div className="max-w-7xl mx-auto">
        <SectionLabel kicker="Direct Engagement" title={<>Contact <em className="gold-text not-italic">Us</em></>} />
        <p className="text-white/80 max-w-2xl mt-6 text-lg">Connect with Satish Pal instantly for verified residential sales, commercial assets, and premium rentals across Delhi NCR.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {[
            { icon: "📞", label: "Direct Line", value: "+91 99115 26004", href: "tel:+919911526004" },
            { icon: "💬", label: "WhatsApp Channel", value: "+91 99115 26004", href: WHATSAPP_URL },
            { icon: "✉️", label: "Brokerage Mail", value: "zero9home@gmail.com", href: "mailto:zero9home@gmail.com" },
            { icon: "📍", label: "Corporate Office", value: "25/276 Trilok Puri, Delhi - 110091", href: `https://www.google.com/maps?q=25%2F276+Trilok+Puri+Delhi+110091` },
          ].map((c) => (
            <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="rounded-2xl gold-border p-6 bg-navy-deep hover:bg-navy transition-all">
              <div className="text-3xl mb-3">{c.icon}</div>
              <div className="font-mono text-[10px] gold-text tracking-widest uppercase mb-2">{c.label}</div>
              <div className="text-white/95 text-sm leading-snug break-words">{c.value}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
