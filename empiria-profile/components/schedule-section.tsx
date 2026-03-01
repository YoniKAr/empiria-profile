"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, MoreHorizontal, LayoutGrid, List, Calendar } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Ticket {
    id: string;
    status: string;
    event?: {
        id: string;
        title: string;
        cover_image_url?: string | null;
        start_at?: string | null;
        end_at?: string | null;
        venue_name?: string | null;
        city?: string | null;
        location_type?: string | null;
    } | null;
    tier?: {
        name: string;
        price: number;
        currency: string;
    } | null;
}

interface ScheduleSectionProps {
    searchQuery: string;
    tickets: Ticket[];
}

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatMonthDay(dateStr: string) {
    const d = new Date(dateStr);
    return {
        month: d.toLocaleString("default", { month: "short" }).toUpperCase(),
        day: String(d.getDate()),
    };
}

export function ScheduleSection({ searchQuery, tickets }: ScheduleSectionProps) {
    const query = searchQuery.toLowerCase();

    const upcoming = tickets.filter((t) => {
        if (!t.event?.start_at) return false;
        return new Date(t.event.start_at) >= new Date();
    });

    const filtered = upcoming.filter((t) => {
        const title = t.event?.title?.toLowerCase() ?? "";
        const location = (t.event?.venue_name ?? t.event?.city ?? "").toLowerCase();
        return title.includes(query) || location.includes(query);
    });

    if (filtered.length === 0) {
        return (
            <section>
                <h2 className="text-xl font-bold text-foreground mb-5">My Schedule</h2>
                {searchQuery ? (
                    <p className="text-muted-foreground text-sm">No scheduled events match your search.</p>
                ) : (
                    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
                        <Calendar className="mx-auto size-10 text-muted-foreground/40 mb-3" />
                        <p className="text-sm text-muted-foreground mb-4">No upcoming events. Browse and get tickets!</p>
                        <a
                            href={process.env.NEXT_PUBLIC_SHOP_URL ?? "https://shop.empiriaindia.com"}
                            className="inline-block rounded-full bg-empiria-orange px-5 py-2 text-sm font-semibold text-white hover:bg-empiria-orange/90 transition-colors"
                        >
                            Browse Events
                        </a>
                    </div>
                )}
            </section>
        );
    }

    const [featured, ...smaller] = filtered;

    const featuredDate = featured.event?.start_at ? formatMonthDay(featured.event.start_at) : null;
    const featuredLocation = featured.event?.location_type === "online"
        ? "Online"
        : [featured.event?.venue_name, featured.event?.city].filter(Boolean).join(", ");
    const featuredTime = featured.event?.start_at ? formatTime(featured.event.start_at) : null;

    return (
        <section>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-foreground">My Schedule</h2>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
                        <LayoutGrid className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
                        <List className="size-4" />
                    </Button>
                </div>
            </div>

            {/* Featured Event */}
            <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex flex-col lg:flex-row">
                    <div className="relative h-64 w-full lg:h-auto lg:w-[380px] shrink-0">
                        {featured.event?.cover_image_url ? (
                            <Image src={featured.event.cover_image_url} alt={featured.event.title ?? ""} fill className="object-cover" priority />
                        ) : (
                            <div className="flex h-full min-h-[200px] w-full items-center justify-center bg-muted">
                                <Calendar className="size-12 text-muted-foreground/40" />
                            </div>
                        )}
                        {featuredDate && (
                            <div className="absolute top-4 left-4 flex flex-col items-center rounded-lg bg-card/90 px-2.5 py-1.5 backdrop-blur-sm">
                                <span className="text-[10px] font-bold uppercase text-empiria-orange">{featuredDate.month}</span>
                                <span className="text-lg font-bold leading-tight text-foreground">{featuredDate.day}</span>
                            </div>
                        )}
                        <Badge className="absolute bottom-4 left-4 bg-primary text-primary-foreground text-xs">
                            {featured.tier?.name ?? "Ticket"}
                        </Badge>
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                        <div>
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-bold text-foreground">{featured.event?.title}</h3>
                                <Button variant="ghost" size="icon-sm" className="text-muted-foreground shrink-0">
                                    <MoreHorizontal className="size-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-muted-foreground mt-4">
                                {featuredTime && (
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="size-4 text-empiria-orange" />
                                        {featuredTime}
                                    </span>
                                )}
                                {featuredLocation && (
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="size-4 text-empiria-orange" />
                                        {featuredLocation}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={
                                    featured.status === "valid"
                                        ? "text-empiria-green border-empiria-green"
                                        : "text-muted-foreground"
                                }>
                                    {featured.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link href="/dashboard/tickets">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground">Manage</Button>
                                </Link>
                                <Link href="/dashboard/tickets">
                                    <Button size="sm" className="bg-empiria-orange text-white hover:bg-empiria-orange/90 rounded-full px-5">View Ticket</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smaller Events */}
            {smaller.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {smaller.map((ticket) => {
                        const date = ticket.event?.start_at ? formatMonthDay(ticket.event.start_at) : null;
                        const location = ticket.event?.location_type === "online"
                            ? "Online"
                            : [ticket.event?.venue_name, ticket.event?.city].filter(Boolean).join(", ");
                        const time = ticket.event?.start_at ? formatTime(ticket.event.start_at) : null;

                        return (
                            <div key={ticket.id} className="overflow-hidden rounded-xl border border-border bg-card">
                                <div className="relative h-44">
                                    {ticket.event?.cover_image_url ? (
                                        <Image src={ticket.event.cover_image_url} alt={ticket.event.title ?? ""} fill className="object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-muted">
                                            <Calendar className="size-8 text-muted-foreground/40" />
                                        </div>
                                    )}
                                    {date && (
                                        <div className="absolute top-4 left-4 flex flex-col items-center rounded-lg bg-card/90 px-2.5 py-1.5 backdrop-blur-sm">
                                            <span className="text-[10px] font-bold uppercase text-empiria-orange">{date.month}</span>
                                            <span className="text-lg font-bold leading-tight text-foreground">{date.day}</span>
                                        </div>
                                    )}
                                    <Badge className="absolute bottom-4 left-4 bg-empiria-orange text-white text-xs">
                                        {ticket.tier?.name ?? "Ticket"}
                                    </Badge>
                                    <h3 className="absolute bottom-4 right-4 text-sm font-bold text-white drop-shadow-md max-w-[120px] text-right leading-snug">
                                        {ticket.event?.title}
                                    </h3>
                                </div>
                                <div className="p-4 space-y-2">
                                    {time && (
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Clock className="size-3.5 text-empiria-orange" />
                                            {time}
                                        </div>
                                    )}
                                    {location && (
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <MapPin className="size-3.5 text-empiria-orange" />
                                            {location}
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between pt-2">
                                        <Badge variant="outline" className={
                                            ticket.status === "valid"
                                                ? "text-empiria-green border-empiria-green text-xs"
                                                : "text-muted-foreground text-xs"
                                        }>
                                            {ticket.status}
                                        </Badge>
                                        <Link href="/dashboard/tickets">
                                            <Button variant="link" className="text-empiria-orange p-0 h-auto text-sm">View Ticket</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
