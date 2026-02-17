import { getSupabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

/**
 * Fetch user record from Supabase by auth0_id.
 */
export async function getUserByAuth0Id(auth0Id: string): Promise<UserRow | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth0_id", auth0Id)
    .is("deleted_at", null)
    .single();

  if (error || !data) return null;
  return data as UserRow;
}

/**
 * Fetch all tickets for a user, joined with event + tier data.
 */
export async function getUserTickets(auth0Id: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("tickets")
    .select(`
      *,
      event:events!tickets_event_id_fkey (
        id, title, slug, cover_image_url, start_at, end_at,
        venue_name, address_text, city, status, location_type, currency
      ),
      tier:ticket_tiers!tickets_tier_id_fkey (
        id, name, price, currency
      )
    `)
    .eq("user_id", auth0Id)
    .order("purchase_date", { ascending: false });

  if (error) {
    console.error("Error fetching tickets:", error);
    return [] as any[];
  }
  return (data ?? []) as any[];
}

/**
 * Fetch all orders for a user, joined with event + order items.
 */
export async function getUserOrders(auth0Id: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      event:events!orders_event_id_fkey (
        id, title, slug, cover_image_url, start_at, end_at,
        venue_name, city, currency
      ),
      order_items (
        id, tier_id, quantity, unit_price, subtotal,
        tier:ticket_tiers!order_items_tier_id_fkey ( id, name )
      )
    `)
    .eq("user_id", auth0Id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [] as any[];
  }
  return (data ?? []) as any[];
}
