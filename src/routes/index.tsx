import { useEffect, useState } from "react";
import heroImg from "@/assets/hero.jpg";
import satishImg from "@/assets/satish-real.jpg";
import { PageShell, SectionLabel, WHATSAPP_URL } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";

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
        <div className="flex flex-wrap gap-4 mb-8">
          <a href="/explore" className="btn-gold">Buy/Rent →</a>
          <a href="/list" className="btn-gold-outline">Sell/Rent Out</a>
        </div>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] mb-8 max-w-5xl">
          Curating Delhi NCR's <span className="gold-text italic">Finest Homes</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl text-white/90 leading-relaxed mb-12 font-light">
          Serving Delhi NCR with <span className="gold-text font-medium">24+ years</span> of experience in residential, commercial, and rental properties across Delhi, Gurgaon, Noida, Greater Noida, Faridabad, and Ghaziabad.
        </p>
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
  const [previews, setPreviews] = useState<Record<string, string[]>>({});
  const [activeIdx, setActiveIdx] = useState<Record<string, number>>({});
  const [lightbox, setLightbox] = useState<{ id: string; i: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { resolveUrls, FEATURED_BUCKET } = await import("@/lib/storage");
      const { data } = await supabase.from("featured_properties").select("*").eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      const list = (data as FeaturedRow[]) ?? [];
      setListings(list);
      const map: Record<string, string[]> = {};
      await Promise.all(list.map(async (r) => {
        if (r.image_urls?.length) map[r.id] = await resolveUrls(FEATURED_BUCKET, r.image_urls);
      }));
      setPreviews(map);
    })();
  }, []);

  const step = (id: string, total: number, dir: 1 | -1) =>
    setActiveIdx((s) => ({ ...s, [id]: ((s[id] ?? 0) + dir + total) % total }));

  const lightboxUrls = lightbox ? (previews[lightbox.id] ?? []) : [];

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((s) => s && { ...s, i: (s.i + 1) % lightboxUrls.length });
      if (e.key === "ArrowLeft") setLightbox((s) => s && { ...s, i: (s.i - 1 + lightboxUrls.length) % lightboxUrls.length });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, lightboxUrls.length]);

  return (
    <section className="py-24 px-5">
      <div className="max-w-7xl mx-auto">
        <SectionLabel kicker="Handpicked Exclusives" title={<>Featured <em className="gold-text not-italic">Handpicked Properties</em></>} />
        <p className="text-white/80 max-w-2xl mt-6 text-lg">Browse our exclusive listings with comprehensive photos, location transparency, and detailed parameters.</p>
        {listings.length === 0 ? (
          <p className="mt-14 text-white/60 font-mono text-sm">New featured properties coming soon. Meanwhile, share your requirement on Buy/Rent.</p>
        ) : (
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => {
              const urls = previews[l.id] ?? [];
              const idx = activeIdx[l.id] ?? 0;
              const current = urls[idx] ?? urls[0];
              const total = urls.length;
              return (
              <article key={l.id} className="rounded-2xl overflow-hidden bg-surface border border-[rgba(212,175,55,0.25)] group hover:gold-glow transition-all">
                <div className="aspect-[4/3] bg-gradient-to-br from-navy to-navy-deep relative overflow-hidden">
                  {current ? (
                    <button type="button" onClick={() => setLightbox({ id: l.id, i: idx })} className="block w-full h-full">
                      <img src={current} alt={`${l.title} photo ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ) : (
                    <span className="absolute inset-0 grid place-items-center font-display text-7xl text-white/10">9</span>
                  )}
                  <span className="absolute top-4 left-4 bg-gold text-navy-deep text-[10px] font-mono font-semibold px-3 py-1.5 rounded-full tracking-wider">{l.tag.toUpperCase()}</span>
                  {total > 1 && (
                    <>
                      <span className="absolute top-4 right-4 bg-navy-deep/80 text-white text-[10px] font-mono px-3 py-1.5 rounded-full">📷 {idx + 1}/{total}</span>
                      <button type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); step(l.id, total, -1); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy-deep/70 hover:bg-navy-deep text-gold grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">‹</button>
                      <button type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); step(l.id, total, 1); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy-deep/70 hover:bg-navy-deep text-gold grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">›</button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {urls.map((_, i) => (
                          <button key={i} type="button" aria-label={`Go to photo ${i + 1}`} onClick={(e) => { e.stopPropagation(); setActiveIdx((s) => ({ ...s, [l.id]: i })); }}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-gold w-4" : "bg-white/50"}`} />
                        ))}
                      </div>
                    </>
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
            );})}
          </div>
        )}
        <div className="text-center mt-12">
          <a href="/explore" className="btn-gold">Buy/Rent →</a>
        </div>
      </div>

      {lightbox && lightboxUrls.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/90 grid place-items-center p-4" onClick={() => setLightbox(null)}>
          <button type="button" aria-label="Close" onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-navy-deep/80 text-gold grid place-items-center text-xl">×</button>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/80 font-mono text-xs">{lightbox.i + 1} / {lightboxUrls.length}</div>
          <img src={lightboxUrls[lightbox.i]} alt="" className="max-h-[85vh] max-w-[95vw] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          {lightboxUrls.length > 1 && (
            <>
              <button type="button" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setLightbox((s) => s && { ...s, i: (s.i - 1 + lightboxUrls.length) % lightboxUrls.length }); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-navy-deep/80 hover:bg-navy-deep text-gold grid place-items-center text-2xl">‹</button>
              <button type="button" aria-label="Next" onClick={(e) => { e.stopPropagation(); setLightbox((s) => s && { ...s, i: (s.i + 1) % lightboxUrls.length }); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-navy-deep/80 hover:bg-navy-deep text-gold grid place-items-center text-2xl">›</button>
            </>
          )}
        </div>
      )}
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
            <div className="grid sm:grid-cols-2 gap-4">
              {[["24+", "Years"], ["6", "Cities"]].map(([n, l]) => (
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
    { name: "Chandan Kumar", role: "1 BHK Flat · Trilok Puri, Delhi", quote: "Satish ji made the entire home-buying journey effortless. From site visits to paperwork, everything was transparent and on time." },
    { name: "Dinesh Kumar", role: "2 BHK Flat · Trilok Puri, Delhi", quote: "Got exactly the 2 BHK I wanted within my budget. Satish ji's local knowledge of Trilok Puri is unmatched — highly recommended." },
    { name: "Amit Kumar", role: "2 BHK Flat · Patparganj, Delhi", quote: "Shifted into our new Patparganj flat without a single hiccup. Legal checks and registration were handled end-to-end by Zero9Home." },
    { name: "Alka Gupta", role: "Seller · 1 BHK Flat, Trilok Puri, Delhi", quote: "Sold my flat at the right price without any broker chain confusion. Satish ji brought a genuine buyer and closed it cleanly." },
    { name: "Raj Pal", role: "Seller · 1 BHK Flat, Trilok Puri, Delhi", quote: "I had tried listing on my own for months. Zero9Home closed the deal in weeks with full documentation support." },
    { name: "Ravinder Mahor", role: "2 BHK Flat · Trilok Puri, Delhi", quote: "Trustworthy, patient, and thoroughly professional. Satish ji personally showed us multiple options until we picked the right one." },
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {[
            { icon: "📞", label: "Direct Line", value: "+91 99115 26004", href: "tel:+919911526004" },
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
