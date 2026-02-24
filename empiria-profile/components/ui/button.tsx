import * as React from "react";
import { clsx } from "clsx";

type ButtonVariant = "default" | "ghost" | "link" | "outline" | "secondary" | "destructive";
type ButtonSize = "default" | "sm" | "lg" | "icon" | "icon-sm";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    default:
        "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost:
        "bg-transparent hover:bg-accent hover:text-accent-foreground",
    link:
        "bg-transparent underline-offset-4 hover:underline text-foreground",
    outline:
        "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
    secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

const sizeClasses: Record<ButtonSize, string> = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-9 w-9",
    "icon-sm": "h-7 w-7",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "default",
            size = "default",
            children,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                className={clsx(
                    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
