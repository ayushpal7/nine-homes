// Password-protected admin API. Uses service role internally so no RLS bypass leaks to the browser.
// Client sends { action, payload } and an `x-admin-password` header.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD") ?? "";

const LISTING_BUCKET = "listing-images";
const FEATURED_BUCKET = "featured-images";
const SIGNED_TTL = 60 * 60;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-password",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...cors },
  });
}

async function signMany(admin: ReturnType<typeof createClient>, bucket: string, paths: string[]) {
  if (!paths?.length) return [];
  const toSign = paths.filter((p) => p && !p.startsWith("http") && !p.startsWith("data:"));
  if (!toSign.length) return paths;
  const { data } = await admin.storage.from(bucket).createSignedUrls(toSign, SIGNED_TTL);
  const map = new Map<string, string>();
  (data ?? []).forEach((d, i) => { if (d.signedUrl) map.set(toSign[i], d.signedUrl); });
  return paths.map((p) => map.get(p) ?? p);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  if (!ADMIN_PASSWORD) return json({ error: "admin password not configured" }, 500);
  const pw = req.headers.get("x-admin-password") ?? "";
  if (pw !== ADMIN_PASSWORD) return json({ error: "unauthorized" }, 401);

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "invalid json" }, 400); }
  const action = String(body?.action ?? "");
  const payload = body?.payload ?? {};

  try {
    switch (action) {
      case "list_inquiries": {
        const { data, error } = await admin.from("inquiries").select("*").order("created_at", { ascending: false }).limit(500);
        if (error) throw error;
        return json({ rows: data });
      }
      case "list_listings": {
        const { data, error } = await admin.from("listing_submissions").select("*").order("created_at", { ascending: false }).limit(500);
        if (error) throw error;
        const rows = await Promise.all((data ?? []).map(async (r: any) => ({
          ...r,
          image_signed: await signMany(admin, LISTING_BUCKET, r.image_urls ?? []),
        })));
        return json({ rows });
      }
      case "list_featured": {
        const { data, error } = await admin.from("featured_properties").select("*")
          .order("sort_order", { ascending: true }).order("created_at", { ascending: false });
        if (error) throw error;
        const rows = await Promise.all((data ?? []).map(async (r: any) => ({
          ...r,
          image_signed: await signMany(admin, FEATURED_BUCKET, r.image_urls ?? []),
        })));
        return json({ rows });
      }
      case "upsert_featured": {
        const p = payload;
        const record = {
          title: String(p.title ?? ""), location: String(p.location ?? ""), price: String(p.price ?? ""),
          tag: String(p.tag ?? "Buy"),
          bhk: p.bhk || null, size: p.size || null, description: p.description || null,
          image_urls: Array.isArray(p.image_urls) ? p.image_urls : [],
          is_active: !!p.is_active, sort_order: Number(p.sort_order) || 0,
        };
        const q = p.id
          ? admin.from("featured_properties").update(record).eq("id", p.id)
          : admin.from("featured_properties").insert(record);
        const { error } = await q;
        if (error) throw error;
        return json({ ok: true });
      }
      case "delete_featured": {
        const { error } = await admin.from("featured_properties").delete().eq("id", String(payload.id));
        if (error) throw error;
        return json({ ok: true });
      }
      case "sign_urls": {
        const bucket = String(payload.bucket ?? "");
        const paths = Array.isArray(payload.paths) ? payload.paths : [];
        if (bucket !== LISTING_BUCKET && bucket !== FEATURED_BUCKET) return json({ error: "invalid bucket" }, 400);
        return json({ urls: await signMany(admin, bucket, paths) });
      }
      default:
        return json({ error: "unknown action" }, 400);
    }
  } catch (e: any) {
    return json({ error: e?.message ?? String(e) }, 500);
  }
});
