"use client";

import { useState, useRef, useEffect, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Bell, X, ArrowRight, Calendar, MapPin, User, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ---- searchable items ---- */
interface SearchItem {
    label: string;
    description: string;
    href: string;
    icon: ReactNode;
    category: "page" | "event";
}

const searchItems: SearchItem[] = [
    { label: "Profile Settings", description: "Navigate to Profile", href: "/dashboard/settings", icon: <User className="size-4" />, category: "page" },
    { label: "Dashboard", description: "Navigate to Dashboard", href: "/dashboard", icon: <LayoutDashboard className="size-4" />, category: "page" },
    { label: "My Bookings", description: "Navigate to My Bookings", href: "/dashboard", icon: <Calendar className="size-4" />, category: "page" },
    { label: "Innovate Tech Summit 2023", description: "Grand Convention Center, NY", href: "/dashboard", icon: <MapPin className="size-4" />, category: "event" },
    { label: "Symphony Under Stars", description: "Central Park Amphitheater", href: "/dashboard", icon: <MapPin className="size-4" />, category: "event" },
    { label: "Digital Marketing Masterclass", description: "Online (Zoom)", href: "/dashboard", icon: <MapPin className="size-4" />, category: "event" },
    { label: "Global Business Expo", description: "Chicago, IL", href: "/dashboard", icon: <MapPin className="size-4" />, category: "event" },
    { label: "Modern Art Gallery", description: "New York, NY", href: "/dashboard", icon: <MapPin className="size-4" />, category: "event" },
    { label: "Taste of Italy Workshop", description: "Online", href: "/dashboard", icon: <MapPin className="size-4" />, category: "event" },
    { label: "Jazz Nights Special", description: "New Orleans, LA", href: "/dashboard", icon: <MapPin className="size-4" />, category: "event" },
];

/* ---- highlight helper ---- */
function highlightMatch(text: string, query: string) {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + query.length);
    const after = text.slice(idx + query.length);
    return (
        <>
            {before}
            <span className="text-empiria-orange font-semibold">{match}</span>
            {after}
        </>
    );
}

/* ---- component ---- */
interface DashboardNavbarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    avatarUrl: string | null;
}

export function DashboardNavbar({ searchQuery, onSearchChange, avatarUrl }: DashboardNavbarProps) {
    const router = useRouter();
    const [searchOpen, setSearchOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (searchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [searchOpen]);

    /* close on click outside */
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                handleClose();
            }
        }
        if (searchOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    });

    const handleClose = () => {
        setSearchOpen(false);
        onSearchChange("");
        setActiveIndex(-1);
    };

    const filtered = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase();
        return searchItems.filter(
            (item) =>
                item.label.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    const handleSelect = (item: SearchItem) => {
        onSearchChange(item.category === "event" ? item.label : "");
        setSearchOpen(false);
        setActiveIndex(-1);
        router.push(item.href);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => (i < filtered.length - 1 ? i + 1 : 0));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => (i > 0 ? i - 1 : filtered.length - 1));
        } else if (e.key === "Enter" && activeIndex >= 0 && filtered[activeIndex]) {
            e.preventDefault();
            handleSelect(filtered[activeIndex]);
        } else if (e.key === "Escape") {
            handleClose();
        }
    };

    const pages = filtered.filter((i) => i.category === "page");
    const events = filtered.filter((i) => i.category === "event");
    const showDropdown = searchQuery.trim().length > 0;

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
            <div className="flex items-center gap-8">
                <Link href="/dashboard" className="flex items-center">
                    <Image
                        src="/images/empiria-logo.png"
                        alt="Empiria Events"
                        width={130}
                        height={40}
                        className="h-9 w-auto"
                        priority
                    />
                </Link>
                <nav className="hidden items-center gap-6 md:flex">
                    <Link
                        href="/dashboard"
                        className="text-sm font-semibold text-foreground underline underline-offset-4 decoration-empiria-orange decoration-2"
                    >
                        My Bookings
                    </Link>
                    <Link href="https://shop.empiriaindia.com/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Discover
                    </Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        History
                    </Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Help
                    </Link>
                </nav>
            </div>

            <div className="flex items-center gap-3">
                {searchOpen ? (
                    <div ref={wrapperRef} className="relative">
                        <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 transition-all">
                            <Search className="size-4 text-muted-foreground shrink-0" />
                            <Input
                                ref={inputRef}
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    onSearchChange(e.target.value);
                                    setActiveIndex(-1);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Search pages, events..."
                                className="h-7 w-56 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
                            />
                            <button onClick={handleClose} className="shrink-0 text-muted-foreground hover:text-foreground" aria-label="Close search">
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Dropdown */}
                        {showDropdown && (
                            <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                                {filtered.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                                        No results for &ldquo;{searchQuery}&rdquo;
                                    </div>
                                ) : (
                                    <div className="max-h-80 overflow-y-auto py-1">
                                        {pages.length > 0 && (
                                            <>
                                                <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Pages</p>
                                                {pages.map((item) => {
                                                    const globalIdx = filtered.indexOf(item);
                                                    return (
                                                        <button
                                                            key={item.label}
                                                            onClick={() => handleSelect(item)}
                                                            className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-secondary ${globalIdx === activeIndex ? "bg-secondary" : ""}`}
                                                        >
                                                            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                                                {item.icon}
                                                            </span>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="truncate text-sm font-medium text-foreground">
                                                                    {highlightMatch(item.label, searchQuery)}
                                                                </p>
                                                                <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                                                            </div>
                                                            <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                                                        </button>
                                                    );
                                                })}
                                            </>
                                        )}
                                        {events.length > 0 && (
                                            <>
                                                <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Events</p>
                                                {events.map((item) => {
                                                    const globalIdx = filtered.indexOf(item);
                                                    return (
                                                        <button
                                                            key={item.label}
                                                            onClick={() => handleSelect(item)}
                                                            className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-secondary ${globalIdx === activeIndex ? "bg-secondary" : ""}`}
                                                        >
                                                            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                                                {item.icon}
                                                            </span>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="truncate text-sm font-medium text-foreground">
                                                                    {highlightMatch(item.label, searchQuery)}
                                                                </p>
                                                                <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                                                            </div>
                                                            <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                                                        </button>
                                                    );
                                                })}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => setSearchOpen(true)}>
                        <Search className="size-5" />
                        <span className="sr-only">Search</span>
                    </Button>
                )}
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="size-5" />
                    <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-empiria-orange" />
                    <span className="sr-only">Notifications</span>
                </Button>
                <Link href="/dashboard/settings">
                    <Avatar className="size-9 cursor-pointer ring-2 ring-border">
                        {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile" />}
                        <AvatarFallback>Me</AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </header>
    );
}
