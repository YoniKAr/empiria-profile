import { auth0 } from "@/lib/auth0";
import { getUserTickets } from "@/lib/data";
import { formatDate, formatCurrency } from "@/lib/utils";
import { generateQRCodeDataURL } from "@/lib/qrcode";
import { redirect } from "next/navigation";
import { Ticket, Calendar, MapPin } from "lucide-react";

const statusStyles: Record<string, { bg: string; label: string }> = {
  valid: { bg: "bg-emerald-50 text-emerald-700", label: "Valid" },
  used: { bg: "bg-gray-100 text-gray-600", label: "Used" },
  cancelled: { bg: "bg-red-50 text-red-600", label: "Cancelled" },
  expired: { bg: "bg-amber-50 text-amber-700", label: "Expired" },
};

function isUpcoming(ticket: any): boolean {
  const occ = ticket.occurrence;
  if (!occ) return false;
  const now = new Date();
  if (occ.ends_at) return new Date(occ.ends_at) > now;
  if (occ.starts_at) return new Date(occ.starts_at) > now;
  return false;
}

export default async function TicketsPage() {
  const session = await auth0.getSession();
  if (!session?.user?.sub) redirect("/auth/login?screen_hint=signup");

  const tickets = await getUserTickets(session.user.sub);

  const upcoming = tickets.filter((t: any) => isUpcoming(t));
  const past = tickets.filter((t: any) => !isUpcoming(t));

  // Generate QR codes for all tickets in parallel
  const qrCodes = new Map<string, string>();
  await Promise.all(
    tickets.map(async (ticket: any) => {
      if (ticket.qr_code_secret) {
        const qr = await generateQRCodeDataURL(ticket.qr_code_secret, {
          width: 160,
          margin: 1,
        });
        qrCodes.set(ticket.id, qr);
      }
    })
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">My Tickets</h1>
      <p className="mt-1 text-gray-500">
        {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"}
      </p>

      {tickets.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <Ticket className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-gray-500">You don&apos;t have any tickets yet.</p>
          <a
            href={process.env.NEXT_PUBLIC_SHOP_URL ?? "https://shop.empiriaindia.com"}
            className="mt-3 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Browse Events
          </a>
        </div>
      ) : (
        <>
          {/* Upcoming Tickets */}
          {upcoming.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold">Upcoming</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {upcoming.map((ticket: any) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    qrDataUrl={qrCodes.get(ticket.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Past Tickets */}
          {past.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold">Past</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {past.map((ticket: any) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    qrDataUrl={qrCodes.get(ticket.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function TicketCard({
  ticket,
  qrDataUrl,
}: {
  ticket: any;
  qrDataUrl?: string;
}) {
  const event = ticket.event;
  const tier = ticket.tier;
  const status = statusStyles[ticket.status] ?? {
    bg: "bg-gray-100 text-gray-600",
    label: ticket.status,
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {/* Event image + info */}
      <div className="flex gap-4">
        {event?.cover_image_url ? (
          <img
            src={event.cover_image_url}
            alt=""
            className="h-20 w-28 flex-shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-20 w-28 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold leading-tight">
            {event?.title ?? "Unknown Event"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {ticket.occurrence?.starts_at ? formatDate(ticket.occurrence.starts_at) : "TBA"}
          </p>
          {event?.venue_name && (
            <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-400">
              <MapPin className="h-3.5 w-3.5" />
              {event.venue_name}
              {event.city ? `, ${event.city}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Ticket details row */}
      <div className="mt-4 flex items-center gap-3 text-sm">
        {tier?.name && (
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {tier.name}
          </span>
        )}
        {ticket.seat_label && (
          <span className="text-xs text-gray-500">
            Seat: {ticket.seat_label}
          </span>
        )}
        <span
          className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg}`}
        >
          {status.label}
        </span>
      </div>

      {/* QR Code */}
      {qrDataUrl && (
        <div className="mt-4 flex justify-center">
          <img
            src={qrDataUrl}
            alt="Ticket QR Code"
            className="h-32 w-32 rounded-lg"
          />
        </div>
      )}

      {/* Wallet buttons */}
      <div className="mt-3 flex gap-2">
        <a
          href={`/api/wallet/apple/${ticket.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-3.5 w-3.5"
          >
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Apple Wallet
        </a>
        <a
          href={`/api/wallet/google/${ticket.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#4285f4] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3367d6] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-3.5 w-3.5"
          >
            <path d="M21.35 11.1h-9.18v2.73h5.51c-.24 1.27-.98 2.34-2.09 3.06v2.54h3.39c1.98-1.82 3.12-4.5 3.12-7.58 0-.52-.05-1.02-.13-1.5-.02-.08-.04-.17-.07-.25h-.55z" fill="#4285F4" />
            <path d="M12.17 21.5c2.83 0 5.2-.94 6.93-2.54l-3.39-2.54c-.94.63-2.14 1-3.54 1-2.73 0-5.04-1.84-5.86-4.32H2.8v2.62c1.73 3.44 5.28 5.78 9.37 5.78z" fill="#34A853" />
            <path d="M6.31 13.1a5.58 5.58 0 010-3.52V6.96H2.8a9.5 9.5 0 000 8.76l3.51-2.62z" fill="#FBBC05" />
            <path d="M12.17 5.26c1.54 0 2.92.53 4.01 1.57l3.01-3.01C17.36 2.09 14.99 1.18 12.17 1.18 8.08 1.18 4.53 3.52 2.8 6.96l3.51 2.62c.82-2.48 3.13-4.32 5.86-4.32z" fill="#EA4335" />
          </svg>
          Google Wallet
        </a>
      </div>
    </div>
  );
}
