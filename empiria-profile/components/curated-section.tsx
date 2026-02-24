import Image from "next/image";
import { ArrowRight, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const curatedEvents = [
    {
        title: "Global Business Expo",
        date: "Jan 15",
        location: "Chicago, IL",
        price: "$150",
        image: "/images/business-expo.jpg",
        favorited: true,
    },
    {
        title: "Modern Art Gallery",
        date: "Jan 20",
        location: "New York, NY",
        price: "Free",
        image: "/images/art-gallery.jpg",
        favorited: false,
    },
    {
        title: "Taste of Italy Workshop",
        date: "Feb 05",
        location: "Online",
        price: "$45",
        image: "/images/cooking-workshop.jpg",
        favorited: true,
    },
    {
        title: "Jazz Nights Special",
        date: "Feb 14",
        location: "New Orleans, LA",
        price: "$80",
        image: "/images/jazz-nights.jpg",
        favorited: true,
    },
];

interface CuratedSectionProps {
    searchQuery: string;
}

export function CuratedSection({ searchQuery }: CuratedSectionProps) {
    const query = searchQuery.toLowerCase();
    const filtered = curatedEvents.filter(
        (e) =>
            e.title.toLowerCase().includes(query) ||
            e.location.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        return (
            <section>
                <h2 className="text-xl font-bold text-foreground mb-5">Curated For You</h2>
                <p className="text-muted-foreground text-sm">No curated events match your search.</p>
            </section>
        );
    }

    return (
        <section>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-foreground">Curated For You</h2>
                <Button variant="link" className="text-empiria-orange p-0 h-auto text-sm gap-1">
                    View All
                    <ArrowRight className="size-3.5" />
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {filtered.map((event) => (
                    <div key={event.title} className="group">
                        <div className="relative mb-3 overflow-hidden rounded-xl aspect-square">
                            <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                            <button
                                className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm"
                                aria-label={event.favorited ? "Remove from favorites" : "Add to favorites"}
                            >
                                <Heart
                                    className={`size-3.5 ${event.favorited ? "fill-empiria-orange text-empiria-orange" : "text-muted-foreground"}`}
                                />
                            </button>
                        </div>
                        <h3 className="text-sm font-semibold text-foreground leading-snug">{event.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {event.date} &bull; {event.location}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                            <span
                                className={`text-sm font-semibold ${event.price === "Free" ? "text-empiria-green" : "text-empiria-orange"}`}
                            >
                                {event.price}
                            </span>
                            <button className="flex size-6 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-empiria-orange hover:text-empiria-orange transition-colors" aria-label={`Add ${event.title}`}>
                                <Plus className="size-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
