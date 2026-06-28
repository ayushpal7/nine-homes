import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, SectionLabel, Field } from "@/lib/site";

const PW_KEY = "zero9_admin_pw";
const ADMIN_PASSWORD = "respectayush";

type FeaturedInput = {
  id?: string;
  title: string;
  location: string;
  price: string;
  tag: string;
  bhk?: string;
  size?: string;
  description?: string;
  image_urls: string[];
  is_active: boolean;
  sort_order: number;
};

export default function AdminPage() {
  const [pw, setPw] = useState<string>("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"inquiries" | "listings" | "featured">("inquiries");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem(PW_KEY) : null;
    if (saved === ADMIN_PASSWORD) {
      setPw(saved);
      setAuthed(true);
    }
  }, []);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = (new FormData(e.currentTarget).get("password") as string) || "";
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(PW_KEY, password);
      setPw(password); setAuthed(true);
    } else {
      alert("Wrong password");
    }
  };

  if (!authed) {
    return (
      <PageShell>
        <section className="pt-32 pb-24 px-5 min-h-screen">
          <div className="max-w-md mx-auto">
            <SectionLabel kicker="Restricted" title={<>Admin <em className="gold-text not-italic">Sign In</em></>} />
            <form onSubmit={onLogin} className="mt-10 p-8 rounded-2xl gold-border bg-surface space-y-5">
              <Field label="Password" name="password" type="password" required />
              <button className="btn-gold w-full">Enter</button>
            </form>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="pt-32 pb-24 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <SectionLabel kicker="Control Panel" title={<>Zero9 <em className="gold-text not-italic">Admin</em></>} />
            <button onClick={() => { sessionStorage.removeItem(PW_KEY); setAuthed(false); setPw(""); }} className="btn-gold-outline text-sm">Sign out</button>
          </div>
          <div className="flex gap-2 mb-8 font-mono text-xs uppercase tracking-widest">
            {(["inquiries", "listings", "featured"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg border transition-all ${tab === t ? "bg-gold text-navy-deep border-gold" : "border-[rgba(212,175,55,0.3)] hover:border-gold"}`}>
                {t}
              </button>
            ))}
          </div>
          {tab === "inquiries" && <InquiriesTab pw={pw} />}
          {tab === "listings" && <ListingsTab pw={pw} />}
          {tab === "featured" && <FeaturedTab pw={pw} />}
        </div>
      </section>
    </PageShell>
  );
}

function InquiriesTab({ pw }: { pw: string }) {
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!pw) return;
    supabase.from("inquiries").select("*").order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError("Private submissions are protected in static hosting. Check submitted emails at zero9home@gmail.com.");
        setRows(data ?? []);
      });
  }, [pw]);
  return (
    <div className="space-y-3">
      <p className="font-mono text-xs text-white/60">{rows.length} inquiry submissions</p>
      {error && <p className="rounded-xl gold-border bg-navy-deep p-5 text-sm text-white/80">{error}</p>}
      {rows.map((r) => (
        <div key={r.id} className="rounded-xl gold-border bg-navy-deep p-5 grid sm:grid-cols-4 gap-3 text-sm">
          <div><div className="text-[10px] gold-text font-mono uppercase">When</div>{new Date(r.created_at).toLocaleString()}</div>
          <div><div className="text-[10px] gold-text font-mono uppercase">Name</div>{r.name}<br/><a href={`tel:${r.mobile}`} className="text-gold">{r.mobile}</a>{r.email && <><br/><span className="text-white/70 text-xs">{r.email}</span></>}</div>
          <div><div className="text-[10px] gold-text font-mono uppercase">Intent</div>{r.intent} · {r.category}<br/><span className="text-white/70 text-xs">{r.city} · {r.sector}</span></div>
          <div><div className="text-[10px] gold-text font-mono uppercase">Budget / Notes</div>{r.budget}<br/><span className="text-white/70 text-xs">{r.requirements}</span></div>
        </div>
      ))}
    </div>
  );
}

function ListingsTab({ pw }: { pw: string }) {
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!pw) return;
    supabase.from("listing_submissions").select("*").order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError("Private listing submissions are protected in static hosting. Check submitted emails at zero9home@gmail.com.");
        setRows(data ?? []);
      });
  }, [pw]);
  return (
    <div className="space-y-3">
      <p className="font-mono text-xs text-white/60">{rows.length} owner submissions</p>
      {error && <p className="rounded-xl gold-border bg-navy-deep p-5 text-sm text-white/80">{error}</p>}
      {rows.map((r) => (
        <div key={r.id} className="rounded-xl gold-border bg-navy-deep p-5 grid sm:grid-cols-4 gap-3 text-sm">
          <div><div className="text-[10px] gold-text font-mono uppercase">When</div>{new Date(r.created_at).toLocaleString()}</div>
          <div><div className="text-[10px] gold-text font-mono uppercase">Owner</div>{r.name}<br/><a href={`tel:${r.mobile}`} className="text-gold">{r.mobile}</a>{r.email && <><br/><span className="text-white/70 text-xs">{r.email}</span></>}</div>
          <div><div className="text-[10px] gold-text font-mono uppercase">Property</div>{r.purpose} · {r.category}<br/><span className="text-white/70 text-xs">{r.address}, {r.city} - {r.pincode}</span></div>
          <div><div className="text-[10px] gold-text font-mono uppercase">Price · Size</div>{r.price} · {r.size}<br/><span className="text-white/70 text-xs">📷 {r.image_count} photos: {r.image_names}</span><br/><span className="text-white/70 text-xs">{r.spec_details}</span></div>
        </div>
      ))}
    </div>
  );
}

const blankFeatured: FeaturedInput = {
  title: "", location: "", price: "", tag: "Buy",
  bhk: "", size: "", description: "",
  image_urls: [], is_active: true, sort_order: 0,
};

function FeaturedTab({ pw }: { pw: string }) {
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<FeaturedInput | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const reload = () => {
    if (!pw) return Promise.resolve();
    return supabase.from("featured_properties").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setRows(data ?? []);
      });
  };
  useEffect(() => { reload(); /* eslint-disable-next-line */ }, [pw]);

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editing) return;
    const files = Array.from(e.target.files ?? []).slice(0, 6);
    const urls: string[] = [];
    for (const f of files) {
      urls.push(await new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(f); }));
    }
    setEditing({ ...editing, image_urls: [...editing.image_urls, ...urls].slice(0, 6) });
  };

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      const payload = {
        title: editing.title, location: editing.location, price: editing.price, tag: editing.tag,
        bhk: editing.bhk || null, size: editing.size || null, description: editing.description || null,
        image_urls: editing.image_urls, is_active: editing.is_active, sort_order: editing.sort_order,
      };
      const result = editing.id
        ? await supabase.from("featured_properties").update(payload).eq("id", editing.id)
        : await supabase.from("featured_properties").insert(payload);
      if (result.error) throw result.error;
      setEditing(null);
      await reload();
    }
    catch (e) { console.error(e); alert("Save failed because static hosting cannot securely write admin data without backend permissions."); }
    finally { setBusy(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this featured property?")) return;
    const { error } = await supabase.from("featured_properties").delete().eq("id", id);
    if (error) alert("Delete failed because static hosting cannot securely write admin data without backend permissions.");
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="font-mono text-xs text-white/60">{rows.length} featured properties</p>
        <button onClick={() => setEditing({ ...blankFeatured })} className="btn-gold text-sm">+ New property</button>
      </div>
      {error && <p className="rounded-xl gold-border bg-navy-deep p-5 text-sm text-white/80">{error}</p>}

      {editing && (
        <div className="rounded-xl gold-border bg-navy-deep p-6 space-y-4">
          <h3 className="font-display text-2xl">{editing.id ? "Edit" : "New"} Property</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block"><span className="label-gold">Title *</span><input className="field" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></label>
            <label className="block"><span className="label-gold">Location *</span><input className="field" value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></label>
            <label className="block"><span className="label-gold">Price *</span><input className="field" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} /></label>
            <label className="block"><span className="label-gold">Tag</span>
              <select className="field" value={editing.tag} onChange={(e) => setEditing({ ...editing, tag: e.target.value })}>
                <option className="bg-navy">Buy</option><option className="bg-navy">Rent</option><option className="bg-navy">Sold</option>
              </select>
            </label>
            <label className="block"><span className="label-gold">BHK</span><input className="field" value={editing.bhk ?? ""} onChange={(e) => setEditing({ ...editing, bhk: e.target.value })} /></label>
            <label className="block"><span className="label-gold">Size</span><input className="field" value={editing.size ?? ""} onChange={(e) => setEditing({ ...editing, size: e.target.value })} /></label>
            <label className="block sm:col-span-2"><span className="label-gold">Description</span><textarea rows={3} className="field resize-none" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label>
            <label className="block"><span className="label-gold">Sort order</span><input type="number" className="field" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></label>
            <label className="flex items-end gap-2 pb-3"><input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} /><span>Active (visible on site)</span></label>
            <div className="sm:col-span-2">
              <span className="label-gold">Photos (up to 6)</span>
              <input type="file" accept="image/*" multiple onChange={onFiles} className="field file:bg-gold file:border-0 file:text-navy-deep file:font-semibold file:rounded file:px-3 file:py-1 file:mr-3" />
              <div className="flex flex-wrap gap-2 mt-3">
                {editing.image_urls.map((u, i) => (
                  <div key={i} className="relative">
                    <img src={u} className="w-24 h-24 object-cover rounded gold-border" alt="" />
                    <button type="button" onClick={() => setEditing({ ...editing, image_urls: editing.image_urls.filter((_, j) => j !== i) })} className="absolute -top-2 -right-2 bg-gold text-navy-deep w-6 h-6 rounded-full text-xs">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setEditing(null)} className="btn-gold-outline text-sm">Cancel</button>
            <button onClick={save} disabled={busy} className="btn-gold text-sm">{busy ? "Saving…" : "Save"}</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((r) => (
          <div key={r.id} className={`rounded-xl gold-border bg-navy-deep overflow-hidden ${!r.is_active && "opacity-50"}`}>
            {r.image_urls?.[0] ? <img src={r.image_urls[0]} alt={r.title} className="aspect-[4/3] w-full object-cover" /> : <div className="aspect-[4/3] grid place-items-center text-white/20 font-display text-6xl">9</div>}
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-xs font-mono"><span className="gold-text">{r.tag}</span><span className="text-white/60">#{r.sort_order} {r.is_active ? "" : "(hidden)"}</span></div>
              <h4 className="font-display text-lg">{r.title}</h4>
              <p className="text-xs text-white/70">{r.location} · {r.price}</p>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setEditing({
                  id: r.id, title: r.title, location: r.location, price: r.price, tag: r.tag,
                  bhk: r.bhk ?? "", size: r.size ?? "", description: r.description ?? "",
                  image_urls: r.image_urls ?? [], is_active: r.is_active, sort_order: r.sort_order,
                })} className="btn-gold-outline text-xs flex-1 py-2">Edit</button>
                <button onClick={() => remove(r.id)} className="text-xs px-3 py-2 rounded border border-red-500/40 text-red-300 hover:bg-red-500/10">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
