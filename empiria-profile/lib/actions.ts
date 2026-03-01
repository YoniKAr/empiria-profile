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
 * Update the user's basic profile info (name only).
 */
export async function updateProfile(formData: FormData) {
  const auth0Id = await getAuth0Id();
  const supabase = getSupabaseAdminUntyped();

  const full_name = formData.get("full_name") as string;

  const { error } = await supabase
    .from("users")
    .update({ full_name, updated_at: new Date().toISOString() })
    .eq("auth0_id", auth0Id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
}

/**
 * Send a password-change email via Auth0 (only for email/password users).
 */
export async function changePassword() {
  const session = await auth0.getSession();
  if (!session?.user?.sub) throw new Error("Not authenticated");

  const email = session.user.email;
  if (!email) throw new Error("No email found in session.");

  const domain = process.env.AUTH0_ISSUER_BASE_URL!.replace(/^https?:\/\//, "");
  const clientId = process.env.AUTH0_CLIENT_ID!;

  const res = await fetch(`https://${domain}/dbconnections/change_password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      email,
      connection: "Username-Password-Authentication",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to send password reset email.");
  }
}

/**
 * Upload a new avatar image to Supabase Storage and update the user's record.
 */
export async function uploadAvatar(formData: FormData) {
  const auth0Id = await getAuth0Id();
  const supabase = getSupabaseAdminUntyped();

  const file = formData.get("avatar") as File;
  if (!file || file.size === 0) throw new Error("No file provided.");

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${auth0Id.replace("|", "-")}/avatar.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  const { error: dbError } = await supabase
    .from("users")
    .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("auth0_id", auth0Id);

  if (dbError) throw new Error(dbError.message);

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
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
