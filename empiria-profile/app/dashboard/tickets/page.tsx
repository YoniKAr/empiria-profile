import { auth0 } from "@/lib/auth0";
import { getUserTickets } from "@/lib/data";
import { formatDate, formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Ticket as TicketIcon, Calendar, MapPin, QrCode } from "lucide-react";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  valid: "bg-emerald-50 text-emerald-700",
  used: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-50 text-red-600",
  expired: "bg-amber-50 text-amber-700",
};

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth0.getSession();
  if (!session?.user?.sub) redirect("/auth/login");

  const params = await searchParams;
  const tickets = await getUserTickets(session.user.sub);

  const filterStatus = params.status;
  const filtered = filterStatus
    ? tickets.filter((t: any) => t.status === filterStatus)
    : tickets;

  const statuses = ["all", "valid", "used", "cancelled", "expired"];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Tickets</h1>
          <p className="mt-1 text-gray-500">{tickets.length} total tickets</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="mt-6 flex gap-2">
        {statuses.map((s) => {
          const isActive = (s === "all" && !filterStatus) || filterStatus === s;
          return (
            <Link
              key={s}
              href={s === "all" ? "/dashboard/tickets" : `/dashboard/tickets?status=${s}`}
              className={`rounded-full px-4 py-1.5 text-sm capitalize transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s}
            </Link>
          );
        })}
      </div>

      {/* Ticket cards */}
      {filtered.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <TicketIcon className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-gray-500">No tickets found.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((ticket: any) => (
            <div
              key={ticket.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start gap-4">
                {ticket.event?.cover_image_url ? (
                  <img
                    src={ticket.event.cover_image_url}
                    alt=""
                    className="h-20 w-32 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-32 items-center justify-center rounded-lg bg-gray-100">
                    <Calendar className="h-8 w-8 text-gray-300" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{ticket.event?.title ?? "Unknown Event"}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {ticket.tier?.name}
                        {ticket.tier?.price
                          ? ` · ${formatCurrency(ticket.tier.price, ticket.tier.currency)}`
                          : " · Free"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        statusStyles[ticket.status] ?? "bg-gray-100"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {ticket.event?.start_at ? formatDate(ticket.event.start_at) : "TBA"}
                    </span>
                    {ticket.event?.venue_name && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {ticket.event.venue_name}
                        {ticket.event.city ? `, ${ticket.event.city}` : ""}
                      </span>
                    )}
                    {ticket.seat_label && (
                      <span className="flex items-center gap-1">
                        <TicketIcon className="h-4 w-4" />
                        Seat: {ticket.seat_label}
                      </span>
                    )}
                  </div>

                  {ticket.status === "valid" && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                      <QrCode className="h-4 w-4" />
                      QR Code: {ticket.qr_code_secret.slice(0, 8)}…
                      <span className="text-gray-400">(Show at venue for entry)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
