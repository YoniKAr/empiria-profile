import * as React from "react";
import { clsx } from "clsx";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-current bg-transparent text-foreground",
};

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
    return (
        <span
            className={clsx(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
