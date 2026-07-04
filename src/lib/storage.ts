import { supabase } from "@/integrations/supabase/client";

export const LISTING_BUCKET = "listing-images";
export const FEATURED_BUCKET = "featured-images";

const SIGNED_URL_TTL = 60 * 60; // 1 hour

export async function uploadFiles(bucket: string, files: File[], prefix = ""): Promise<string[]> {
  const paths: string[] = [];
  for (const file of files) {
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) throw error;
    paths.push(path);
  }
  return paths;
}

export async function resolveUrls(bucket: string, paths: string[]): Promise<string[]> {
  if (!paths || paths.length === 0) return [];
  const passthrough = paths.map((p) => (p.startsWith("http") || p.startsWith("data:") ? p : ""));
  const toSign = paths.filter((p) => p && !p.startsWith("http") && !p.startsWith("data:"));
  if (toSign.length === 0) return passthrough;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrls(toSign, SIGNED_URL_TTL);
  if (error || !data) return passthrough;
  const map = new Map<string, string>();
  data.forEach((d, i) => { if (d.signedUrl) map.set(toSign[i], d.signedUrl); });
  return paths.map((p) => (map.get(p) ?? (p.startsWith("http") || p.startsWith("data:") ? p : "")));
}

export async function removeFiles(bucket: string, paths: string[]): Promise<void> {
  const toRemove = paths.filter((p) => p && !p.startsWith("http") && !p.startsWith("data:"));
  if (toRemove.length === 0) return;
  await supabase.storage.from(bucket).remove(toRemove);
}
