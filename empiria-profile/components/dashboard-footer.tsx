import Link from "next/link";
import Image from "next/image";

export function DashboardFooter() {
    return (
        <footer className="flex items-center justify-between px-6 py-5 border-t border-border text-sm text-muted-foreground">
            <div className="flex items-center gap-2">

                <span>{'© 2026 Empiria Events'}</span>
            </div>
            <div className="flex items-center gap-5">
                <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                </Link>
                <Link href="#" className="hover:text-foreground transition-colors">
                    Terms
                </Link>
                <Link href="#" className="hover:text-foreground transition-colors">
                    Support
                </Link>
            </div>
        </footer>
    );
}
