import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { supabase } from "@/integrations/supabase/client";
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_EXPLORE,
  Field,
  PageShell,
  SectionLabel,
  SubmitSuccessDialog,
  WHATSAPP_URL,
} from "@/lib/site";

export default function ExplorePage() {
  const initialType = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search).get("type") === "rent" ? "rent" : "buy";
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
    const fd = new FormData(formRef.current);
    const get = (k: string) => String(fd.get(k) ?? "");
    try {
      await Promise.all([
        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_EXPLORE, formRef.current, { publicKey: EMAILJS_PUBLIC_KEY }),
        supabase.from("inquiries").insert({
          intent: get("intent") || type, category: get("category"), city: get("city"),
          name: get("name"), mobile: get("mobile"), email: get("email") || null,
          budget: get("budget"), sector: get("sector"), requirements: get("requirements"),
        }),
      ]);
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
            <Field name="budget" label="Budget (₹) *" placeholder="Buy Price / Monthly Rent" required />
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
      <SubmitSuccessDialog
        open={status === "ok"}
        title="Inquiry Submitted Successfully"
        description="Thank you! Satish Pal will personally curate verified matches and get back to you within 24 hours."
      />
    </PageShell>
  );
}
