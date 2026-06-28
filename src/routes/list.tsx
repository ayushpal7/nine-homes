import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { supabase } from "@/integrations/supabase/client";
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_LIST,
  Field,
  PageShell,
  SectionLabel,
  SubmitSuccessDialog,
  WHATSAPP_URL,
} from "@/lib/site";

export default function ListPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [images, setImages] = useState<{ name: string; data: string }[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  useEffect(() => {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }, []);

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
      payload.form_type = "List Your Property";
      payload.image_count = String(images.length);
      payload.image_names = images.map((i) => i.name).join(", ");
      payload.image_1 = images[0]?.data?.slice(0, 45000) || "";
      await Promise.all([
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_LIST, payload, { publicKey: EMAILJS_PUBLIC_KEY }),
        supabase.from("listing_submissions").insert({
          purpose: payload.purpose, category: payload.category,
          name: payload.name, mobile: payload.mobile, email: payload.email || null,
          city: payload.city, address: payload.address, pincode: payload.pincode,
          size: payload.size, price: payload.price, spec_details: payload.spec_details,
          image_names: payload.image_names, image_count: images.length,
        }),
      ]);
      setStatus("ok");
      formRef.current.reset();
      setImages([]);
    } catch (err) {
      console.error(err);
      setStatus("err");
    }
  };

  return (
    <PageShell>
      <section className="pt-32 pb-24 px-5">
        <div className="max-w-4xl mx-auto">
          <SectionLabel kicker="Register as Landlord / Owner" title={<>List Your <em className="gold-text not-italic">Property</em></>} />
          <p className="text-white/80 max-w-2xl mt-6 text-lg">
            Owner Satish Pal will personally verify your physical submission. Please upload photos and enter detailed requirements below.
          </p>
          <form ref={formRef} onSubmit={submit} className="mt-12 grid sm:grid-cols-2 gap-5 p-8 md:p-10 rounded-2xl gold-border bg-navy-deep">
            <div>
              <label className="label-gold">I want to *</label>
              <select name="purpose" required className="field" defaultValue="">
                <option value="" className="bg-navy">Select Option</option>
                <option className="bg-navy">Sell</option>
                <option className="bg-navy">Rent Out</option>
              </select>
            </div>
            <div>
              <label className="label-gold">Property Category *</label>
              <select name="category" required className="field" defaultValue="">
                <option value="" className="bg-navy">Select Category</option>
                {["Apartment", "Independent Floor", "Villa", "Plot", "Commercial Office", "Retail Shop"].map((c) => (
                  <option key={c} className="bg-navy">{c}</option>
                ))}
              </select>
            </div>
            <Field name="name" label="Your Full Name *" placeholder="Enter your full name" required />
            <Field name="mobile" label="10-Digit Mobile Number *" type="tel" pattern="[0-9]{10}" maxLength={10} placeholder="Enter 10-digit mobile number" required />
            <Field name="email" label="Email Address" type="email" placeholder="e.g. contact@domain.com" />
            <div>
              <label className="label-gold">Select City *</label>
              <select name="city" required className="field" defaultValue="">
                <option value="" className="bg-navy">Select City</option>
                {["Delhi", "Gurgaon", "Noida", "Greater Noida", "Faridabad", "Ghaziabad"].map((c) => (
                  <option key={c} className="bg-navy">{c}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label-gold">Full Property Address *</label>
              <input name="address" required className="field" placeholder="Locality, Block, Sector, Apartment Name" />
            </div>
            <Field name="pincode" label="Pincode *" pattern="[0-9]{6}" maxLength={6} placeholder="6-digit pincode" required />
            <Field name="size" label="Property Size (Gaj / Sq.Ft) *" placeholder="e.g. 150 Gaj or 1500 Sq.Ft" required />
            <div className="sm:col-span-2">
              <label className="label-gold">Expected Asking Price *</label>
              <input name="price" required className="field" placeholder="e.g. 1.2 Crore / 45,000 monthly" />
            </div>
            <div className="sm:col-span-2">
              <label className="label-gold">Property Uploads *</label>
              <p className="text-xs font-mono text-white/70 mb-2">Select 1 to 5 photos. Every listed property must submit at least one direct photo.</p>
              <input type="file" accept="image/*" multiple onChange={onFiles} className="field file:bg-gold file:border-0 file:text-navy-deep file:font-semibold file:rounded file:px-3 file:py-1 file:mr-3" />
              {images.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {images.map((img, i) => (
                    <img key={i} src={img.data} alt={img.name} className="w-20 h-20 object-cover rounded gold-border" />
                  ))}
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="label-gold">Property Specification / Key Details *</label>
              <textarea name="spec_details" rows={4} required className="field resize-none" placeholder="Describe BHK, floor number, water, electricity, facing direction, local landmarks, demand, etc." />
            </div>
            <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4 mt-4">
              <p className="text-xs font-mono text-white/70">Your details are kept strictly confidential.</p>
              <button type="submit" disabled={status === "sending"} className="btn-gold">
                {status === "sending" ? "Sending…" : status === "ok" ? "✓ Submitted!" : "List My Property Now"}
              </button>
            </div>
            {status === "err" && (
              <p className="sm:col-span-2 text-gold text-sm">
                Submission failed. Please <a className="underline" href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp us</a> the details directly.
              </p>
            )}
          </form>
        </div>
      </section>
      <SubmitSuccessDialog
        open={status === "ok"}
        title="Property Listed Successfully"
        description="Thank you! Owner Satish Pal will personally verify your submission and get in touch with you soon."
      />
    </PageShell>
  );
}
