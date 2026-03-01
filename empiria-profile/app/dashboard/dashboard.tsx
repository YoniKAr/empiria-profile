"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { StatCards } from "@/components/stat-cards";
import { ScheduleSection } from "@/components/schedule-section";
import { CuratedSection } from "@/components/curated-section";
import { DashboardFooter } from "@/components/dashboard-footer";

interface DashboardPageProps {
    userName: string;
    avatarUrl: string | null;
}

export default function DashboardPage({ userName, avatarUrl }: DashboardPageProps) {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-card">
            <DashboardNavbar searchQuery={searchQuery} onSearchChange={setSearchQuery} avatarUrl={avatarUrl} />

            <main className="px-8 py-8 space-y-10 max-w-7xl mx-auto">
                {/* Welcome Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-empiria-orange">
                            Welcome back, {userName}
                        </p>
                        <h1 className="text-3xl font-bold text-foreground text-balance">
                            Your Upcoming Experiences
                        </h1>
                    </div>
                    <Button className="bg-[#F98C1F] text-primary-foreground hover:bg-primary/90 rounded-full px-5 gap-1.5 self-start">
                        <Plus className="size-4" />
                        Browse Events
                    </Button>
                </div>

                <StatCards />
                <ScheduleSection searchQuery={searchQuery} />
                <CuratedSection searchQuery={searchQuery} />
            </main>

            <DashboardFooter />
        </div>
    );
}
