import { SettingsSidebar } from "@/components/setting-sidebar";
import ProfileForm from "@/components/profile-form";
import { auth0 } from "@/lib/auth0";
import { getUserByAuth0Id } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth0.getSession();
  if (!session?.user?.sub) redirect("/auth/login");

  const user = await getUserByAuth0Id(session.user.sub);
  if (!user) redirect(process.env.APP_BASE_URL ?? "https://empiriaindia.com");

  const isGoogleUser = session.user.sub.startsWith("google-oauth2|");

  return (
    <div className="flex min-h-screen bg-card">
      <SettingsSidebar />
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <h1 className="text-3xl font-bold text-foreground">Profile &amp; Settings</h1>
        <p className="mt-2 text-muted-foreground mb-8">Manage your personal information and preferences.</p>
        <ProfileForm user={user} isGoogleUser={isGoogleUser} />
      </div>
    </div>
  );
}
