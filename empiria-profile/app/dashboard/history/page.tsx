import { auth0 } from "@/lib/auth0";
import { getUserByAuth0Id, getUserTickets } from "@/lib/data";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Calendar, MapPin, Clock, Ticket } from "lucide-react";
import Link from "next/link";

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
}

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default async function HistoryPage() {
    const session = await auth0.getSession();
    if (!session?.user?.sub) redirect("/auth/login");

    const user = await getUserByAuth0Id(session.user.sub);
    if (!user) redirect("/dashboard/settings");

    const tickets = await getUserTickets(session.user.sub);

    // Past events only
    const past = tickets.filter((t: any) =>
        t.event?.start_at && new Date(t.event.start_at) < new Date()
    );

    return (
        <div className="min-h-screen bg-card">
            {/* Header */}
            <div className="border-b border-border px-8 py-6 bg-card">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Event History</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Your past attended events</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="text-sm text-empiria-orange hover:underline font-medium"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-8 py-8">
                {past.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
                        <Ticket className="mx-auto size-10 text-muted-foreground/40 mb-3" />
                        <p className="text-sm text-muted-foreground mb-4">No past events yet. Start exploring!</p>
                        <a
                            href={process.env.NEXT_PUBLIC_SHOP_URL ?? "https://shop.empiriaindia.com"}
                            className="inline-block rounded-full bg-empiria-orange px-5 py-2 text-sm font-semibold text-white hover:bg-empiria-orange/90 transition-colors"
                        >
                            Browse Events
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-2">{past.length} event{past.length !== 1 ? "s" : ""} attended</p>
                        {past.map((ticket: any) => {
                            const location = ticket.event?.location_type === "online"
                                ? "Online"
                                : [ticket.event?.venue_name, ticket.event?.city].filter(Boolean).join(", ");

                            return (
                                <div
                                    key={ticket.id}
                                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
                                >
                                    {/* Cover image */}
                                    {ticket.event?.cover_image_url ? (
                                        <img
                                            src={ticket.event.cover_image_url}
                                            alt=""
                                            className="h-16 w-24 shrink-0 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-muted">
                                            <Calendar className="size-6 text-muted-foreground/40" />
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-foreground truncate">{ticket.event?.title}</p>
                                        <div className="flex flex-wrap gap-x-4 mt-1 text-xs text-muted-foreground">
                                            {ticket.event?.start_at && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="size-3 text-empiria-orange" />
                                                    {formatDate(ticket.event.start_at)}
                                                </span>
                                            )}
                                            {ticket.event?.start_at && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="size-3 text-empiria-orange" />
                                                    {formatTime(ticket.event.start_at)}
                                                </span>
                                            )}
                                            {location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="size-3 text-empiria-orange" />
                                                    {location}
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {ticket.tier?.name}
                                            {ticket.tier?.price != null && (
                                                <> · {formatCurrency(ticket.tier.price, ticket.tier?.currency ?? "cad")}</>
                                            )}
                                        </p>
                                    </div>

                                    {/* Status badge */}
                                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold border ${ticket.status === "used"
                                            ? "text-empiria-green border-empiria-green"
                                            : ticket.status === "valid"
                                                ? "text-blue-500 border-blue-500"
                                                : "text-muted-foreground border-border"
                                        }`}>
                                        {ticket.status === "used" ? "Attended" : ticket.status}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
