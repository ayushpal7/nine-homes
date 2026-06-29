import { useState, type ReactNode } from "react";
import logoImg from "@/assets/logo.jpg";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export const LOGO_URL = logoImg;

export const EMAILJS_PUBLIC_KEY = "4QayvNxjOzOJJMGGJ";
export const EMAILJS_SERVICE_ID = "service_k6i5o1c";
export const EMAILJS_TEMPLATE_EXPLORE = "template_ybtpeoa";
export const EMAILJS_TEMPLATE_LIST = "template_xzn46iq";

export const WHATSAPP_URL = "https://wa.me/919911526004";
export const PHONE = "+919911526004";
export const PHONE_DISPLAY = "+91 99115 26004";
export const EMAIL = "zero9home@gmail.com";
export const OFFICE_ADDRESS = "25/276 Trilok Puri, Delhi - 110091";
export const MAP_QUERY = "25/276+Trilok+Puri+Delhi+110091";

const NAV = [
  { label: "HOME", to: "/" },
  { label: "BUY/RENT", to: "/explore" },
  { label: "SELL/RENT OUT", to: "/list" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = typeof window === "undefined" ? "/" : window.location.pathname;
  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-[rgba(10,25,49,0.85)] border-b border-[rgba(212,175,55,0.2)]">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center shrink-0" onClick={() => setOpen(false)}>
          <img src={LOGO_URL} alt="Zero9Home" className="h-10 sm:h-12 w-auto object-contain" />
        </a>
        <nav className="hidden lg:flex items-center gap-7 text-[11px] font-mono tracking-[0.15em]">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.to}
              className={`transition-colors hover:text-gold ${pathname === item.to ? "text-gold" : ""}`}
            >
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
          {NAV.map((item) => (
            <a key={item.label} href={item.to} onClick={() => setOpen(false)} className="hover:text-gold">{item.label}</a>
          ))}
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-gold">WHATSAPP</a>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="pt-20 pb-10 px-5 border-t border-[rgba(212,175,55,0.2)] bg-navy-deep">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="mb-6">
            <img src={LOGO_URL} alt="Zero9Home" className="h-12 w-auto object-contain" />
          </div>
          <p className="text-white/85 leading-relaxed max-w-md mb-8">
            A premier advisory firm founded on trust, transparent legal structures, and meticulous property checks. Handled directly by Satish Pal.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm">
            <a href="/explore" className="btn-gold text-sm py-3">Buy/Rent</a>
            <a href="/list" className="btn-gold-outline text-sm py-3">Sell/Rent Out</a>
          </div>
        </div>
        <div className="lg:col-span-7 rounded-2xl overflow-hidden gold-border min-h-[360px]">
          <iframe
            title="Zero9Home Office — Trilok Puri, Delhi"
            src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
            className="w-full h-full min-h-[360px] grayscale-[40%] contrast-110"
            loading="lazy"
          />
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-14 pt-6 border-t border-[rgba(212,175,55,0.15)] flex flex-wrap justify-between gap-4 text-xs font-mono text-white/70">
        <span>© {new Date().getFullYear()} Zero9Home.com — All Rights Reserved.</span>
        <span className="gold-text">Under senior mediation of founder Satish Pal · Delhi NCR</span>
      </div>
    </footer>
  );
}

export function FloatingActions() {
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

export function SectionLabel({ kicker, title }: { kicker: string; title: ReactNode }) {
  return (
    <div>
      <div className="font-mono text-xs gold-text tracking-[0.25em] uppercase mb-4">— {kicker}</div>
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl">{title}</h2>
    </div>
  );
}

export function Field({ label, name, type = "text", required, pattern, maxLength, placeholder, defaultValue }: { label: string; name: string; type?: string; required?: boolean; pattern?: string; maxLength?: number; placeholder?: string; defaultValue?: string }) {
  return (
    <div>
      <label className="label-gold">{label}</label>
      <input type={type} name={name} required={required} pattern={pattern} maxLength={maxLength} placeholder={placeholder} defaultValue={defaultValue} className="field" />
    </div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      {children}
      <Footer />
      <FloatingActions />
    </div>
  );
}

export function SubmitSuccessDialog({
  open,
  title = "Submitted Successfully",
  description = "Thank you! We've received your details and will get back to you soon.",
}: {
  open: boolean;
  title?: string;
  description?: string;
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-navy-deep gold-border text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-2xl gold-text">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-white/80">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => { window.location.href = "/"; }} className="btn-gold">
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
