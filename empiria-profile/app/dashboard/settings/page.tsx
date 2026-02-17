import { auth0 } from "@/lib/auth0";
import { getUserByAuth0Id } from "@/lib/data";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function SettingsPage() {
  const session = await auth0.getSession();
  if (!session?.user?.sub) redirect("/api/auth/login");

  const user = await getUserByAuth0Id(session.user.sub);
  if (!user) redirect("https://empiriaindia.com");

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile & Settings</h1>
      <p className="mt-1 text-gray-500">Manage your personal information and preferences.</p>

      <ProfileForm user={user} />
    </div>
  );
}
