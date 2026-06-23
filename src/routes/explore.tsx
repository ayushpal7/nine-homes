import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_EXPLORE,
  Field,
  PageShell,
  SectionLabel,
  WHATSAPP_URL,
} from "@/lib/site";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Looking for a Property — Zero9Home Delhi NCR" },
      { name: "description", content: "Share your buying or rental requirement. Satish Pal personally curates verified Delhi NCR properties within 24 hours." },
      { property: "og:title", content: "Looking for a Property — Zero9Home" },
      { property: "og:description", content: "Tell us what you're looking for across Delhi, Gurgaon, Noida, Faridabad and Ghaziabad." },
    ],
  }),
  component: ExplorePage,
  validateSearch: (s: Record<string, unknown>) => ({
    type: s.type === "rent" ? "rent" : "buy",
  }),
});

function ExplorePage() {
  const { type: initialType } = Route.useSearch();
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<"buy" | "rent">(initialType);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  useEffect(() => {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
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
    <PageShell>
      <section className="pt-32 pb-24 px-5">
        <div className="max-w-4xl mx-auto">
          <SectionLabel kicker="Looking For Property" title={<>Tell us what <em className="gold-text not-italic">you're looking for</em></>} />
          <p className="text-white/80 max-w-2xl mt-6 text-lg">
            Share your requirement and Satish Pal will personally curate verified matches across Delhi NCR within 24 hours.
          </p>
          <form ref={formRef} onSubmit={submit} className="mt-12 grid sm:grid-cols-2 gap-5 p-8 md:p-10 rounded-2xl gold-border bg-surface">
            <input type="hidden" name="form_type" value="Explore Properties" />
            <div className="sm:col-span-2">
              <label className="label-gold">I want to *</label>
              <div className="flex gap-2">
                {(["buy", "rent"] as const).map((v) => (
                  <label key={v} className={`flex-1 cursor-pointer text-center py-3 rounded-lg border transition-all font-mono text-sm uppercase tracking-wider ${type === v ? "bg-gold text-navy-deep border-gold" : "border-[rgba(212,175,55,0.3)] hover:border-gold"}`}>
                    <input type="radio" name="intent" value={v} checked={type === v} onChange={() => setType(v)} className="sr-only" />
                    {v}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="label-gold">Property Category *</label>
              <select name="category" required className="field">
                <option value="" className="bg-navy">Select Category</option>
                {["Apartment", "Independent Floor", "Villa", "Plot", "Commercial Office", "Retail Shop"].map((c) => (
                  <option key={c} className="bg-navy">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-gold">Select City *</label>
              <select name="city" required className="field">
                <option value="" className="bg-navy">Select City</option>
                {["Delhi", "Gurgaon", "Noida", "Greater Noida", "Faridabad", "Ghaziabad"].map((c) => (
                  <option key={c} className="bg-navy">{c}</option>
                ))}
              </select>
            </div>
            <Field name="name" label="Your Full Name *" placeholder="Enter your full name" required />
            <Field name="mobile" label="10-Digit Mobile Number *" type="tel" pattern="[0-9]{10}" maxLength={10} placeholder="Enter 10-digit mobile number" required />
            <Field name="email" label="Email Address" type="email" placeholder="e.g. contact@domain.com" />
            <Field name="budget" label="Budget (₹) *" placeholder="e.g. 1.5 Cr / 45,000 pm" required />
            <Field name="sector" label="Preferred Locality / Sector" placeholder="e.g. Sector 62, Noida" />
            <div className="sm:col-span-2">
              <label className="label-gold">Specific Requirements</label>
              <textarea name="requirements" rows={4} className="field resize-none" placeholder="BHK, size, preferred floor, amenities, possession timeline, parking…" />
            </div>
            <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4 mt-4">
              <p className="text-xs font-mono text-white/70">We respond within 24 hours.</p>
              <button type="submit" disabled={status === "sending"} className="btn-gold">
                {status === "sending" ? "Sending…" : status === "ok" ? "✓ Sent!" : "Submit inquiry"}
              </button>
            </div>
            {status === "err" && (
              <p className="sm:col-span-2 text-gold text-sm">
                Submission failed. Please <a className="underline" href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp us</a> instead.
              </p>
            )}
          </form>
        </div>
      </section>
    </PageShell>
  );
}
