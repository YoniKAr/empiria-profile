import * as React from "react";
import { clsx } from "clsx";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> { }

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> { }

const AvatarContext = React.createContext<{ imageError: boolean; setImageError: (v: boolean) => void }>({
    imageError: false,
    setImageError: () => { },
});

export function Avatar({ className, children, ...props }: AvatarProps) {
    const [imageError, setImageError] = React.useState(false);
    return (
        <AvatarContext.Provider value={{ imageError, setImageError }}>
            <div
                className={clsx(
                    "relative flex shrink-0 overflow-hidden rounded-full",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </AvatarContext.Provider>
    );
}

export function AvatarImage({ className, src, alt, ...props }: AvatarImageProps) {
    const { imageError, setImageError } = React.useContext(AvatarContext);
    if (imageError) return null;
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            className={clsx("aspect-square h-full w-full object-cover", className)}
            onError={() => setImageError(true)}
            {...props}
        />
    );
}

export function AvatarFallback({ className, children, ...props }: AvatarFallbackProps) {
    const { imageError } = React.useContext(AvatarContext);
    if (!imageError) return null;
    return (
        <span
            className={clsx(
                "flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium uppercase text-muted-foreground",
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
