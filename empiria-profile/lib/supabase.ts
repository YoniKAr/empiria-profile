import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export function getSupabaseAdmin() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
    { auth: { persistSession: false } }
  );
}

/** Untyped client for mutations (until database.types.ts has Insert/Update types) */
export function getSupabaseAdminUntyped() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
    { auth: { persistSession: false } }
  );
}
