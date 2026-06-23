import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import heroImg from "@/assets/hero.jpg";
import satishImg from "@/assets/satish.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zero9Home.com — Curating Delhi NCR's Finest Homes" },
      { name: "description", content: "24+ years curating verified residential, commercial & rental properties across Delhi, Gurgaon, Noida, Faridabad & Ghaziabad." },
      { property: "og:title", content: "Zero9Home.com — Curating Delhi NCR's Finest Homes" },
      { property: "og:description", content: "Verified luxury homes across Delhi NCR. Personally curated by Satish Pal." },
    ],
  }),
  component: Index,
});

// EmailJS config — public key is safe in browser
const EMAILJS_PUBLIC_KEY = "4QayvNxjOzOJJMGGJ";
const EMAILJS_SERVICE_ID = "service_k6i5o1c";
const EMAILJS_TEMPLATE_EXPLORE = "template_ybtpeoa";
const EMAILJS_TEMPLATE_LIST = "template_xzn46iq";

const WHATSAPP_URL = "https://wa.me/919911526004";
const PHONE = "+919911526004";
const EMAIL = "contact@zero9home.com";

function Index() {
  useEffect(() => {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <Hero />
      <WhyUs />
      <Featured />
      <SatishBio />
      <Areas />
      <Testimonials />
      <ExploreForm />
      <ListForm />
      <Footer />
      <FloatingActions />
    </div>
  );
}

/* ---------------- HEADER ---------------- */
function Header() {
  const [open, setOpen] = useState(false);
  const nav = [
    { label: "HOME", href: "#top" },
    { label: "PROPERTIES", href: "#properties" },
    { label: "BUY", href: "#explore?type=buy", action: "buy" },
    { label: "RENT", href: "#explore?type=rent", action: "rent" },
    { label: "LIST PROPERTY", href: "#list" },
    { label: "ABOUT US", href: "#about" },
    { label: "CONTACT", href: "#contact" },
  ];

  const handleNav = (item: typeof nav[number], e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (item.action) {
      const params = new URLSearchParams(window.location.search);
      params.set("type", item.action);
      window.history.replaceState({}, "", `?${params.toString()}#explore`);
      window.dispatchEvent(new CustomEvent("zero9-type-change", { detail: item.action }));
      document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
    } else {
      const id = item.href.replace("#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header id="top" className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-[rgba(10,25,49,0.85)] border-b border-[rgba(212,175,55,0.2)]">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-3 shrink-0" onClick={(e) => handleNav({ label: "", href: "#top" }, e)}>
          <span className="grid place-items-center w-11 h-11 rounded-full bg-gold text-navy-deep font-display font-bold text-2xl shrink-0">9</span>
          <span className="font-display text-xl tracking-wide">Zero9Home<span className="gold-text">.com</span></span>
        </a>
        <nav className="hidden lg:flex items-center gap-7 text-[11px] font-mono tracking-[0.15em]">
          {nav.map((item) => (
            <a key={item.label} href={item.href} onClick={(e) => handleNav(item, e)} className="hover:text-gold transition-colors">
              {item.label}
            </a>
          ))}
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-gold hover:text-gold-soft">WHATSAPP</a>
        </nav>
        <button onClick={() => setOpen(!open)} className="lg:hidden text-gold p-2" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={open ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-navy border-t border-[rgba(212,175,55,0.2)] px-5 py-4 flex flex-col gap-4 text-sm font-mono">
          {nav.map((item) => (
            <a key={item.label} href={item.href} onClick={(e) => handleNav(item, e)} className="hover:text-gold">{item.label}</a>
          ))}
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-gold">WHATSAPP</a>
        </div>
      )}
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 px-5">
      <img src={heroImg} alt="Delhi NCR luxury skyline" className="absolute inset-0 w-full h-full object-cover opacity-30" width={1920} height={1280} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1931]/70 via-[#0A1931]/85 to-[#0A1931]" />
      <div className="relative max-w-6xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] gold-text border border-[rgba(212,175,55,0.4)] rounded-full px-4 py-2 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          DELHI · NCR · EST. SINCE 2001
        </div>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] mb-8 max-w-5xl">
          Curating Delhi NCR's <span className="gold-text italic">Finest Homes</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl text-white/90 leading-relaxed mb-12 font-light">
          Serving Delhi NCR with <span className="gold-text font-medium">24+ years</span> of experience in residential, commercial, and rental properties across Delhi, Gurgaon, Noida, Greater Noida, Faridabad, and Ghaziabad.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="#explore" onClick={(e) => { e.preventDefault(); document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" }); }} className="btn-gold">
            Explore properties →
          </a>
          <a href="#list" onClick={(e) => { e.preventDefault(); document.getElementById("list")?.scrollIntoView({ behavior: "smooth" }); }} className="btn-gold-outline">
            List your property
          </a>
        </div>
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl border-t border-[rgba(212,175,55,0.2)] pt-10">
          {[
            ["24+", "Years"],
            ["2,400+", "Homes Sold"],
            ["6", "NCR Cities"],
            ["100%", "Verified"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-4xl md:text-5xl gold-text">{n}</div>
              <div className="font-mono text-xs tracking-widest uppercase mt-2 text-white/70">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHY US ---------------- */
function WhyUs() {
  const items = [
    { t: "24+ Years Experience", d: "Helping families and investors make informed property decisions." },
    { t: "Verified Properties", d: "Every listing is personally reviewed before recommendation." },
    { t: "End-to-End Support", d: "From site visits to documentation and registration." },
    { t: "Local Market Knowledge", d: "Deep understanding of Delhi NCR micro-markets." },
  ];
  return (
    <section className="py-24 px-5 bg-surface/40">
      <div className="max-w-7xl mx-auto">
        <SectionLabel kicker="The Zero9 Standard" title={<>Why Choose <em className="gold-text not-italic">Zero9Home</em></>} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {items.map((it, i) => (
            <div key={it.t} className="relative gold-border rounded-2xl p-8 bg-navy-deep/60 hover:bg-navy/80 transition-all hover:-translate-y-1 group">
              <div className="font-mono text-xs gold-text mb-6">0{i + 1}</div>
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
function Featured() {
  // Empty state until client provides listings
  return (
    <section id="properties" className="py-24 px-5">
      <div className="max-w-7xl mx-auto">
        <SectionLabel kicker="Featured Listings" title={<>Hand-picked <em className="gold-text not-italic">residences</em></>} />
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder cards until listings are provided — render verified badge as required */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-surface border border-[rgba(212,175,55,0.25)] group">
              <div className="aspect-[4/3] bg-gradient-to-br from-navy to-navy-deep grid place-items-center relative">
                <span className="font-display text-6xl text-white/10">9</span>
                <span className="absolute top-4 left-4 bg-gold text-navy-deep text-xs font-mono font-semibold px-3 py-1.5 rounded-full">ON REQUEST</span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl mb-1">Premium Listing #{i}</h3>
                <p className="text-white/80 text-sm">Delhi NCR · Coming soon</p>
                <div className="flex items-center gap-2 mt-3 text-gold text-xs font-mono tracking-wider">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  VERIFIED LISTING
                </div>
                <a href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi, I'd like details on Listing #${i}`)}`} target="_blank" rel="noreferrer" className="btn-gold-outline mt-5 w-full text-sm">Inquire on WhatsApp</a>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-white/70 mt-10 text-sm font-mono">Full inventory coming soon — share your requirement below for curated matches.</p>
      </div>
    </section>
  );
}

/* ---------------- SATISH BIO ---------------- */
function SatishBio() {
  return (
    <section id="about" className="py-24 px-5 bg-surface/40">
      <div className="max-w-7xl mx-auto">
        <SectionLabel kicker="The Face of the Brand" title={<>Meet <em className="gold-text not-italic">Satish Pal</em></>} />
        <div className="grid lg:grid-cols-12 gap-6 mt-14">
          <div className="lg:col-span-5 rounded-2xl overflow-hidden gold-border bg-navy-deep">
            <img src={satishImg} alt="Satish Pal — Founder, Zero9Home" loading="lazy" width={1024} height={1280} className="w-full h-full object-cover aspect-[4/5]" />
          </div>
          <div className="lg:col-span-7 grid gap-6">
            <div className="rounded-2xl gold-border p-8 bg-navy">
              <div className="font-mono text-xs gold-text tracking-widest mb-3">FOUNDER · ADVISOR</div>
              <h3 className="font-display text-4xl md:text-5xl mb-6">Satish Pal</h3>
              <p className="text-lg leading-relaxed text-white/90">
                For over <span className="gold-text font-medium">24 years</span>, Satish Pal has helped families, investors, and business owners navigate Delhi NCR's real estate market with confidence. His hands-on approach and local expertise have made him a trusted advisor for property buyers, sellers, and landlords alike.
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
  const areas = ["Delhi", "Gurgaon", "Noida", "Faridabad", "Uttar Pradesh"];
  return (
    <section className="py-20 px-5">
      <div className="max-w-7xl mx-auto">
        <SectionLabel kicker="Coverage" title={<>Geographical areas <em className="gold-text not-italic">we serve</em></>} />
        <div className="flex flex-wrap gap-3 mt-10 justify-center">
          {areas.map((a) => (
            <span key={a} className="px-6 py-3 rounded-full gold-border bg-navy-deep font-mono text-sm tracking-wider hover:bg-gold hover:text-navy-deep transition-all cursor-default">
              ◆ {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS ---------------- */
function Testimonials() {
  const t = [
    { name: "Rajesh Mehra", role: "Purchased a 3BHK in Vasant Kunj", quote: "Satish ji guided us throughout the entire process and ensured everything was transparent and hassle-free." },
    { name: "Rohan & Priya", role: "Rented in Gurgaon", quote: "We were looking for a rental in Gurgaon for months. One call to Zero9Home and we had our perfect apartment in a week. Outstanding service!" },
    { name: "Anil Verma", role: "Sold property in Noida", quote: "Sold my property in Noida at the best market price within 3 weeks. Satish Pal's network and negotiation skills are exceptional. A true professional!" },
  ];
  return (
    <section className="py-24 px-5 bg-surface/40">
      <div className="max-w-7xl mx-auto">
        <SectionLabel kicker="Prime Client Stories" title={<>Words from <em className="gold-text not-italic">our clients</em></>} />
        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {t.map((it) => (
            <figure key={it.name} className="rounded-2xl p-8 bg-navy-deep gold-border flex flex-col gap-6 hover:gold-glow transition-all">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="var(--gold)" className="opacity-80"><path d="M4.5 10C4.5 6 7 4 10 4v3c-1.5 0-3 1-3 3h3v7H4.5v-7zm9 0c0-4 2.5-6 5.5-6v3c-1.5 0-3 1-3 3h3v7h-5.5v-7z"/></svg>
              <blockquote className="text-white/95 leading-relaxed text-[15px] flex-1">"{it.quote}"</blockquote>
              <figcaption>
                <div className="font-display text-xl">{it.name}</div>
                <div className="font-mono text-[11px] tracking-wider gold-text mt-1 uppercase">{it.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- EXPLORE FORM ---------------- */
function ExploreForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<"buy" | "rent">("buy");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  useEffect(() => {
    const sync = () => {
      const p = new URLSearchParams(window.location.search).get("type");
      if (p === "rent" || p === "buy") setType(p);
    };
    sync();
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "rent" || detail === "buy") setType(detail);
    };
    window.addEventListener("zero9-type-change", handler);
    return () => window.removeEventListener("zero9-type-change", handler);
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus("sending");
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_EXPLORE, formRef.current, { publicKey: EMAILJS_PUBLIC_KEY });
      setStatus("ok");
      formRef.current.reset();
    } catch (err) {
      console.error(err);
      setStatus("err");
    }
  };

  return (
    <section id="explore" className="py-24 px-5">
      <div className="max-w-4xl mx-auto">
        <SectionLabel kicker="Form 01 / Explore" title={<>Tell us what <em className="gold-text not-italic">you're looking for</em></>} />
        <form ref={formRef} onSubmit={submit} className="mt-12 grid sm:grid-cols-2 gap-5 p-8 md:p-10 rounded-2xl gold-border bg-surface">
          <input type="hidden" name="form_type" value="Explore Properties (findForm)" />
          <Field name="name" label="Full Name" required />
          <Field name="email" label="Email" type="email" required />
          <Field name="mobile" label="Mobile (10 digits)" type="tel" pattern="[0-9]{10}" maxLength={10} required />
          <div>
            <label className="label-gold">I want to</label>
            <div className="flex gap-2">
              {(["buy", "rent"] as const).map((v) => (
                <label key={v} className={`flex-1 cursor-pointer text-center py-3 rounded-lg border transition-all font-mono text-sm uppercase tracking-wider ${type === v ? "bg-gold text-navy-deep border-gold" : "border-[rgba(212,175,55,0.3)] hover:border-gold"}`}>
                  <input type="radio" name="intent" value={v} checked={type === v} onChange={() => setType(v)} className="sr-only" />
                  {v}
                </label>
              ))}
            </div>
          </div>
          <Field name="budget" label="Budget (₹)" placeholder="e.g. 1.5 Cr / 45,000 pm" required />
          <Field name="sector" label="Preferred Sector" placeholder="e.g. Sector 62, Noida" required />
          <Field name="pincode" label="Pincode" pattern="[0-9]{6}" maxLength={6} required />
          <div>
            <label className="label-gold">Category</label>
            <select name="category" required className="field">
              <option value="" className="bg-navy">Select…</option>
              {["Apartment", "Independent Floor", "Villa", "Plot", "Commercial Office", "Retail Shop"].map((c) => (
                <option key={c} className="bg-navy">{c}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4 mt-4">
            <p className="text-xs font-mono text-white/70">We respond within 24 hours.</p>
            <button type="submit" disabled={status === "sending"} className="btn-gold">
              {status === "sending" ? "Sending…" : status === "ok" ? "✓ Sent!" : "Submit inquiry"}
            </button>
          </div>
          {status === "err" && <p className="sm:col-span-2 text-gold text-sm">Something went wrong. Please WhatsApp us instead.</p>}
        </form>
      </div>
    </section>
  );
}

/* ---------------- LIST FORM ---------------- */
function ListForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [images, setImages] = useState<{ name: string; data: string }[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    const out: { name: string; data: string }[] = [];
    for (const f of files) {
      const data = await new Promise<string>((res) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.readAsDataURL(f);
      });
      out.push({ name: f.name, data });
    }
    setImages(out);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus("sending");
    try {
      const fd = new FormData(formRef.current);
      const payload: Record<string, string> = {};
      fd.forEach((v, k) => { payload[k] = String(v); });
      payload.form_type = "List Your Property (sellPropertyForm)";
      payload.image_count = String(images.length);
      payload.image_names = images.map((i) => i.name).join(", ");
      // EmailJS template size limits — send first image inline; rest as names
      payload.image_1 = images[0]?.data?.slice(0, 45000) || "";
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_LIST, payload, { publicKey: EMAILJS_PUBLIC_KEY });
      setStatus("ok");
      formRef.current.reset();
      setImages([]);
    } catch (err) {
      console.error(err);
      setStatus("err");
    }
  };

  return (
    <section id="list" className="py-24 px-5 bg-surface/40">
      <div className="max-w-4xl mx-auto">
        <SectionLabel kicker="Form 02 / List" title={<>List your <em className="gold-text not-italic">property</em></>} />
        <form ref={formRef} onSubmit={submit} className="mt-12 grid sm:grid-cols-2 gap-5 p-8 md:p-10 rounded-2xl gold-border bg-navy-deep">
          <div className="sm:col-span-2">
            <label className="label-gold">Purpose</label>
            <div className="flex gap-2">
              {["Sell", "Rent Out"].map((v) => (
                <label key={v} className="flex-1 cursor-pointer text-center py-3 rounded-lg border border-[rgba(212,175,55,0.3)] hover:border-gold font-mono text-sm uppercase tracking-wider has-[:checked]:bg-gold has-[:checked]:text-navy-deep has-[:checked]:border-gold transition-all">
                  <input type="radio" name="purpose" value={v} required className="sr-only" defaultChecked={v === "Sell"} />
                  {v}
                </label>
              ))}
            </div>
          </div>
          <Field name="name" label="Landlord Name" required />
          <Field name="email" label="Email" type="email" required />
          <Field name="mobile" label="Mobile (10 digits)" type="tel" pattern="[0-9]{10}" maxLength={10} required />
          <Field name="pincode" label="Pincode" pattern="[0-9]{6}" maxLength={6} required />
          <div className="sm:col-span-2">
            <label className="label-gold">Property Address</label>
            <input name="address" required className="field" />
          </div>
          <Field name="size" label="Size (sq.ft)" required />
          <Field name="price" label="Asking Price (₹)" required />
          <div className="sm:col-span-2">
            <label className="label-gold">Specifications</label>
            <textarea name="spec_details" rows={4} required className="field resize-none" placeholder="BHK, floor, amenities, age, parking, condition…" />
          </div>
          <div className="sm:col-span-2">
            <label className="label-gold">Property Photos (1–5)</label>
            <input type="file" accept="image/*" multiple onChange={onFiles} className="field file:bg-gold file:border-0 file:text-navy-deep file:font-semibold file:rounded file:px-3 file:py-1 file:mr-3" />
            {images.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {images.map((img, i) => (
                  <img key={i} src={img.data} alt={img.name} className="w-20 h-20 object-cover rounded gold-border" />
                ))}
              </div>
            )}
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4 mt-4">
            <p className="text-xs font-mono text-white/70">Your details are kept strictly confidential.</p>
            <button type="submit" disabled={status === "sending"} className="btn-gold">
              {status === "sending" ? "Sending…" : status === "ok" ? "✓ Submitted!" : "Submit listing"}
            </button>
          </div>
          {status === "err" && <p className="sm:col-span-2 text-gold text-sm">Submission failed. Please WhatsApp the details directly.</p>}
        </form>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer id="contact" className="pt-20 pb-10 px-5 border-t border-[rgba(212,175,55,0.2)] bg-navy-deep">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <span className="grid place-items-center w-12 h-12 rounded-full bg-gold text-navy-deep font-display font-bold text-2xl">9</span>
            <span className="font-display text-2xl">Zero9Home<span className="gold-text">.com</span></span>
          </div>
          <p className="text-white/85 leading-relaxed max-w-md mb-8">Delhi NCR's trusted real estate advisor since 2001. Verified listings, end-to-end service.</p>
          <div className="space-y-3 font-mono text-sm">
            <a href={`tel:${PHONE}`} className="flex gap-3 items-center hover:text-gold"><span className="gold-text">CALL</span> +91 99115 26004</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex gap-3 items-center hover:text-gold"><span className="gold-text">WHATSAPP</span> +91 99115 26004</a>
            <a href={`mailto:${EMAIL}`} className="flex gap-3 items-center hover:text-gold"><span className="gold-text">EMAIL</span> {EMAIL}</a>
            <div className="flex gap-3 items-start"><span className="gold-text shrink-0">HQ</span> Sector 62, Noida, Uttar Pradesh 201309</div>
          </div>
        </div>
        <div className="lg:col-span-7 rounded-2xl overflow-hidden gold-border min-h-[360px]">
          <iframe
            title="Zero9Home Office — Sector 62, Noida"
            src="https://www.google.com/maps?q=Sector+62+Noida+Uttar+Pradesh&output=embed"
            className="w-full h-full min-h-[360px] grayscale-[40%] contrast-110"
            loading="lazy"
          />
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-14 pt-6 border-t border-[rgba(212,175,55,0.15)] flex flex-wrap justify-between gap-4 text-xs font-mono text-white/70">
        <span>© {new Date().getFullYear()} Zero9Home.com — All rights reserved.</span>
        <span className="gold-text">Curated by Satish Pal · Delhi NCR</span>
      </div>
    </footer>
  );
}

/* ---------------- FLOATING ACTIONS ---------------- */
function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid place-items-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
      </a>
      <a href={`tel:${PHONE}`} aria-label="Call" className="grid place-items-center w-14 h-14 rounded-full bg-gold text-navy-deep shadow-lg hover:scale-110 transition-transform">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 00-1.02.24l-2.2 2.2a15.05 15.05 0 01-6.59-6.59l2.2-2.2a1 1 0 00.25-1.02A11.36 11.36 0 018.5 4a1 1 0 00-1-1H4a1 1 0 00-1 1c0 9.39 7.61 17 17 17a1 1 0 001-1v-3.5a1 1 0 00-1-1z"/></svg>
      </a>
    </div>
  );
}

/* ---------------- helpers ---------------- */
function SectionLabel({ kicker, title }: { kicker: string; title: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-xs gold-text tracking-[0.25em] uppercase mb-4">— {kicker}</div>
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl">{title}</h2>
    </div>
  );
}

function Field({ label, name, type = "text", required, pattern, maxLength, placeholder }: { label: string; name: string; type?: string; required?: boolean; pattern?: string; maxLength?: number; placeholder?: string }) {
  return (
    <div>
      <label className="label-gold">{label}</label>
      <input type={type} name={name} required={required} pattern={pattern} maxLength={maxLength} placeholder={placeholder} className="field" />
    </div>
  );
}
