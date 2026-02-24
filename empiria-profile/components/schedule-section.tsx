"use client";

import Image from "next/image";
import { Clock, MapPin, MoreHorizontal, LayoutGrid, List, Monitor, Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ScheduleSectionProps {
    searchQuery: string;
}

const scheduledEvents = [
    {
        id: "tech-summit",
        title: "Innovate Tech Summit 2023",
        description: "Join industry leaders for a day of inspiring talks and networking opportunities in the heart of New York.",
        time: "09:00 AM - 05:00 PM",
        location: "Grand Convention Center, NY",
        month: "NOV",
        day: "15",
        category: "Technology",
        image: "/images/tech-summit.jpg",
        attendees: 42,
        featured: true,
    },
    {
        id: "symphony",
        title: "Symphony Under Stars",
        time: "07:30 PM - 10:00 PM",
        location: "Central Park Amphitheater",
        month: "DEC",
        day: "02",
        category: "Music",
        image: "/images/symphony.jpg",
        extra: "VIP Access",
        status: "Confirmed",
        statusColor: "text-empiria-green border-empiria-green",
        action: "View Ticket",
        featured: false,
    },
    {
        id: "marketing",
        title: "Digital Marketing Masterclass",
        time: "10:00 AM - 04:00 PM",
        location: "Online (Zoom)",
        month: "DEC",
        day: "10",
        category: "Workshop",
        image: "/images/marketing-workshop.jpg",
        extra: "150+ Attendees",
        status: "Registered",
        statusColor: "text-blue-500 border-blue-500",
        action: "Join Link",
        featured: false,
    },
];

export function ScheduleSection({ searchQuery }: ScheduleSectionProps) {
    const query = searchQuery.toLowerCase();
    const filtered = scheduledEvents.filter(
        (e) =>
            e.title.toLowerCase().includes(query) ||
            e.location.toLowerCase().includes(query) ||
            e.category.toLowerCase().includes(query)
    );

    const featured = filtered.find((e) => e.featured);
    const smaller = filtered.filter((e) => !e.featured);

    if (filtered.length === 0) {
        return (
            <section>
                <h2 className="text-xl font-bold text-foreground mb-5">My Schedule</h2>
                <p className="text-muted-foreground text-sm">No scheduled events match your search.</p>
            </section>
        );
    }

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
            {featured && (
                <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card">
                    <div className="flex flex-col lg:flex-row">
                        <div className="relative h-64 w-full lg:h-auto lg:w-[380px] shrink-0">
                            <Image src={featured.image} alt={featured.title} fill className="object-cover" priority />
                            <div className="absolute top-4 left-4 flex flex-col items-center rounded-lg bg-card/90 px-2.5 py-1.5 backdrop-blur-sm">
                                <span className="text-[10px] font-bold uppercase text-empiria-orange">{featured.month}</span>
                                <span className="text-lg font-bold leading-tight text-foreground">{featured.day}</span>
                            </div>
                            <Badge className="absolute bottom-4 left-4 bg-primary text-primary-foreground text-xs">
                                {featured.category}
                            </Badge>
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-6">
                            <div>
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-xl font-bold text-foreground">{featured.title}</h3>
                                    <Button variant="ghost" size="icon-sm" className="text-muted-foreground shrink-0">
                                        <MoreHorizontal className="size-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{featured.description}</p>
                                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="size-4 text-empiria-orange" />
                                        {featured.time}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="size-4 text-empiria-orange" />
                                        {featured.location}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                                <div className="flex items-center -space-x-2">
                                    <Avatar className="size-7 ring-2 ring-card">
                                        <AvatarImage src="/images/avatar.jpg" alt="Attendee" />
                                        <AvatarFallback>A1</AvatarFallback>
                                    </Avatar>
                                    <Avatar className="size-7 ring-2 ring-card">
                                        <AvatarImage src="/images/avatar.jpg" alt="Attendee" />
                                        <AvatarFallback>A2</AvatarFallback>
                                    </Avatar>
                                    <Avatar className="size-7 ring-2 ring-card">
                                        <AvatarImage src="/images/avatar.jpg" alt="Attendee" />
                                        <AvatarFallback>A3</AvatarFallback>
                                    </Avatar>
                                    <span className="ml-3 text-xs text-muted-foreground">+{featured.attendees}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground">Manage</Button>
                                    <Button size="sm" className="bg-empiria-orange text-white hover:bg-empiria-orange/90 rounded-full px-5">View Ticket</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Smaller Events */}
            {smaller.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {smaller.map((event) => (
                        <div key={event.id} className="overflow-hidden rounded-xl border border-border bg-card">
                            <div className="relative h-44">
                                <Image src={event.image} alt={event.title} fill className="object-cover" />
                                <div className="absolute top-4 left-4 flex flex-col items-center rounded-lg bg-card/90 px-2.5 py-1.5 backdrop-blur-sm">
                                    <span className="text-[10px] font-bold uppercase text-empiria-orange">{event.month}</span>
                                    <span className="text-lg font-bold leading-tight text-foreground">{event.day}</span>
                                </div>
                                <Badge className="absolute bottom-4 left-4 bg-empiria-orange text-white text-xs">
                                    {event.category}
                                </Badge>
                                <h3 className="absolute bottom-4 right-4 text-lg font-bold text-white drop-shadow-md">
                                    {event.title}
                                </h3>
                            </div>
                            <div className="p-4 space-y-2">
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Clock className="size-3.5 text-empiria-orange" />
                                    {event.time}
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <MapPin className="size-3.5 text-empiria-orange" />
                                    {event.location}
                                </div>
                                {event.extra && (
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Monitor className="size-3.5 text-empiria-orange" />
                                        {event.extra}
                                    </div>
                                )}
                                <div className="flex items-center justify-between pt-2">
                                    <Badge variant="outline" className={`${event.statusColor} text-xs`}>
                                        {event.status}
                                    </Badge>
                                    <Button variant="link" className="text-empiria-orange p-0 h-auto text-sm">
                                        {event.action}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
