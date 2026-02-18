import { auth0 } from "@/lib/auth0";
import { getUserByAuth0Id, getUserTickets, getUserOrders } from "@/lib/data";
import { formatDate, formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Ticket, Receipt, Calendar, Star } from "lucide-react";
import Link from "next/link";

export default async function DashboardOverview() {
  const session = await auth0.getSession();
  if (!session?.user?.sub) redirect("/auth/login");

  const [user, tickets, orders] = await Promise.all([
    getUserByAuth0Id(session.user.sub),
    getUserTickets(session.user.sub),
    getUserOrders(session.user.sub),
  ]);

  if (!user) redirect("https://empiriaindia.com");

  const activeTickets = tickets.filter((t: any) => t.status === "valid");
  const upcomingTickets = activeTickets.filter(
    (t: any) => t.event && new Date(t.event.start_at) > new Date()
  );
  const completedOrders = orders.filter((o: any) => o.status === "completed");
  const totalSpent = completedOrders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0);

  const stats = [
    { label: "Active Tickets", value: activeTickets.length, icon: Ticket, color: "bg-indigo-50 text-indigo-600" },
    { label: "Upcoming Events", value: upcomingTickets.length, icon: Calendar, color: "bg-emerald-50 text-emerald-600" },
    { label: "Total Orders", value: completedOrders.length, icon: Receipt, color: "bg-amber-50 text-amber-600" },
    { label: "Total Spent", value: formatCurrency(totalSpent, user.default_currency ?? "cad"), icon: Star, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Welcome back{user.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}!
      </h1>
      <p className="mt-1 text-gray-500">Here&apos;s a snapshot of your activity.</p>

      {/* Stats grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className={`inline-flex rounded-lg p-2 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming events */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <Link href="/dashboard/tickets" className="text-sm text-indigo-600 hover:underline">
            View all tickets →
          </Link>
        </div>

        {upcomingTickets.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <Calendar className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">No upcoming events yet.</p>
            <a
              href={process.env.NEXT_PUBLIC_SHOP_URL ?? "https://shop.empiriaindia.com"}
              className="mt-3 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Browse Events
            </a>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {upcomingTickets.slice(0, 5).map((ticket: any) => (
              <div
                key={ticket.id}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                {ticket.event?.cover_image_url ? (
                  <img
                    src={ticket.event.cover_image_url}
                    alt=""
                    className="h-16 w-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-gray-100">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{ticket.event?.title}</p>
                  <p className="text-sm text-gray-500">
                    {ticket.event?.start_at ? formatDate(ticket.event.start_at) : "TBA"}
                    {ticket.event?.venue_name ? ` · ${ticket.event.venue_name}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {ticket.tier?.name} · {ticket.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
