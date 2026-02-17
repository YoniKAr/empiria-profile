import { auth0 } from "@/lib/auth0";
import { getUserByAuth0Id } from "@/lib/data";
import { getInitials } from "@/lib/utils";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();
  if (!session?.user?.sub) redirect("/api/auth/login");

  const user = await getUserByAuth0Id(session.user.sub);
  if (!user) redirect("https://empiriaindia.com");

  // Role gate — only attendees belong here
  if (user.role === "organizer" || user.role === "non_profit") {
    redirect("https://organizer.empiriaindia.com");
  }
  if (user.role === "admin") {
    redirect("https://admin.empiriaindia.com");
  }

  const userName = user.full_name || user.email;
  const initials = getInitials(userName);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        userName={userName}
        avatarUrl={user.avatar_url}
        initials={initials}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
