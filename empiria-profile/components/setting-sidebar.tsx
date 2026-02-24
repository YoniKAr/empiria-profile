import Link from "next/link";
import Image from "next/image";
import { LayoutGrid } from "lucide-react";

export function SettingsSidebar() {
    return (
        <aside className="relative hidden w-[380px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-l-2xl lg:flex">
            {/* Warm gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-orange-50/60 to-amber-100/80" />
            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-stone-200/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-32 opacity-40">
                <svg viewBox="0 0 380 130" className="w-full h-full text-amber-200/60">
                    <path d="M0,50 Q95,10 190,50 T380,50 L380,130 L0,130 Z" fill="currentColor" />
                    <path d="M0,70 Q95,30 190,70 T380,70 L380,130 L0,130 Z" fill="currentColor" opacity="0.5" />
                </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center px-10 text-center">
                {/* Logo */}
                <div className="mb-8">
                    <Image
                        src="/images/empiria-logo.png"
                        alt="Empiria Events"
                        width={150}
                        height={48}
                        className="h-12 w-auto"
                    />
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">Your Creative Space</h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
                    Manage your identity and preferences in an environment designed for clarity and inspiration.
                </p>

                <Link
                    href="/dashboard"
                    className="mt-10 flex items-center gap-2 text-sm font-medium text-foreground hover:text-empiria-orange transition-colors"
                >
                    <LayoutGrid className="size-4" />
                    Back to Dashboard
                </Link>
            </div>
        </aside>
    );
}
