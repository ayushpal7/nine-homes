import { createServerFn } from "@tanstack/react-start";

function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD not configured");
  if (password !== expected) throw new Error("Invalid password");
}

export const verifyAdmin = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    checkPassword(data.password);
    return { ok: true as const };
  });

export const adminListInquiries = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return rows ?? [];
  });

export const adminListListings = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("listing_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return rows ?? [];
  });

export const adminListFeatured = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("featured_properties")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return rows ?? [];
  });

export type FeaturedInput = {
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

export const adminUpsertFeatured = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string; property: FeaturedInput }) => d)
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const p = data.property;
    if (p.id) {
      const { error } = await supabaseAdmin.from("featured_properties").update({
        title: p.title, location: p.location, price: p.price, tag: p.tag,
        bhk: p.bhk, size: p.size, description: p.description,
        image_urls: p.image_urls, is_active: p.is_active, sort_order: p.sort_order,
      }).eq("id", p.id);
      if (error) throw error;
      return { id: p.id };
    } else {
      const { data: row, error } = await supabaseAdmin.from("featured_properties").insert({
        title: p.title, location: p.location, price: p.price, tag: p.tag,
        bhk: p.bhk, size: p.size, description: p.description,
        image_urls: p.image_urls, is_active: p.is_active, sort_order: p.sort_order,
      }).select("id").single();
      if (error) throw error;
      return { id: row.id };
    }
  });

export const adminDeleteFeatured = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string; id: string }) => d)
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("featured_properties").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true as const };
  });
