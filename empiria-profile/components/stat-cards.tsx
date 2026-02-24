import { Calendar, CheckCircle2, Star } from "lucide-react";

const stats = [
    {
        label: "Upcoming",
        value: "3",
        icon: Calendar,
        iconColor: "text-empiria-orange",
    },
    {
        label: "Attended",
        value: "12",
        icon: CheckCircle2,
        iconColor: "text-empiria-green",
    },
    {
        label: "Points",
        value: "850",
        icon: Star,
        iconColor: "text-blue-500",
    },
];

export function StatCards() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-5"
                >
                    <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <stat.icon className={`size-6 ${stat.iconColor}`} />
                </div>
            ))}
        </div>
    );
}
