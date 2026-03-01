import { auth0 } from "@/lib/auth0";
import { getUserByAuth0Id, getUserTickets } from "@/lib/data";
import { redirect } from "next/navigation";
import DashboardPage from "./dashboard";

export default async function Page() {
    const session = await auth0.getSession();
    if (!session?.user?.sub) redirect("/auth/login");

    const user = await getUserByAuth0Id(session.user.sub);
    if (!user) redirect("/dashboard/settings");

    const tickets = await getUserTickets(session.user.sub);

    const firstName = user.full_name
        ? user.full_name.split(" ")[0]
        : user.email?.split("@")[0] ?? "there";

    const avatarUrl = user.avatar_url ?? null;

    return <DashboardPage userName={firstName} avatarUrl={avatarUrl} tickets={tickets} />;
}
