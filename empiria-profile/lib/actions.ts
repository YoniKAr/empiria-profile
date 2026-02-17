"use server";

import { auth0 } from "@/lib/auth0";
import { getSupabaseAdminUntyped } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

/**
 * Get the current user's auth0_id from the session.
 */
async function getAuth0Id(): Promise<string> {
  const session = await auth0.getSession();
  if (!session?.user?.sub) throw new Error("Not authenticated");
  return session.user.sub;
}

/**
 * Update the user's basic profile info.
 */
export async function updateProfile(formData: FormData) {
  const auth0Id = await getAuth0Id();
  const supabase = getSupabaseAdminUntyped();

  const full_name = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;
  const interestsRaw = formData.get("interests") as string;
  const interests = interestsRaw
    ? interestsRaw.split(",").map((i) => i.trim()).filter(Boolean)
    : [];

  const { error } = await supabase
    .from("users")
    .update({ full_name, phone, interests, updated_at: new Date().toISOString() })
    .eq("auth0_id", auth0Id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/settings");
}

/**
 * Update the user's avatar URL.
 */
export async function updateAvatar(avatarUrl: string) {
  const auth0Id = await getAuth0Id();
  const supabase = getSupabaseAdminUntyped();

  const { error } = await supabase
    .from("users")
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq("auth0_id", auth0Id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
}

/**
 * Update notification settings.
 */
export async function updateSettings(settings: { theme: string; notifications: boolean }) {
  const auth0Id = await getAuth0Id();
  const supabase = getSupabaseAdminUntyped();

  const { error } = await supabase
    .from("users")
    .update({ settings, updated_at: new Date().toISOString() })
    .eq("auth0_id", auth0Id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/settings");
}
