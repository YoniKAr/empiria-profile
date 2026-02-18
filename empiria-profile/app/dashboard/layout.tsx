import { auth0 } from "@/lib/auth0";
import { getUserByAuth0Id } from "@/lib/data";
import { getInitials } from "@/lib/utils";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

function RoleGateScreen({
  heading,
  description,
  primaryHref,
  primaryLabel,
}: {
  heading: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-orange-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900">{heading}</h1>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
        <a
          href={primaryHref}
          className="mt-6 inline-block w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          {primaryLabel}
        </a>
        <a
          href="https://shop.empiriaindia.com"
          className="mt-3 inline-block text-sm text-gray-500 hover:text-gray-700"
        >
          Browse Events
        </a>
      </div>
    </div>
  );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();
  if (!session?.user?.sub) redirect("/auth/login");

  const user = await getUserByAuth0Id(session.user.sub);
  if (!user) redirect("https://empiriaindia.com");

  // Role gate — only attendees belong here
  if (user.role === "organizer" || user.role === "non_profit") {
    return (
      <RoleGateScreen
        heading="This area is for attendees"
        description="As an organizer, manage your events and tickets from the Organizer Dashboard."
        primaryHref="https://organizer.empiriaindia.com"
        primaryLabel="Go to Organizer Dashboard"
      />
    );
  }
  if (user.role === "admin") {
    return (
      <RoleGateScreen
        heading="This area is for attendees"
        description="As an admin, manage the platform from the Admin Dashboard."
        primaryHref="https://admin.empiriaindia.com"
        primaryLabel="Go to Admin Dashboard"
      />
    );
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
