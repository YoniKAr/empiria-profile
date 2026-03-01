"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateProfile, changePassword } from "@/lib/actions";
import type { Database } from "@/lib/database.types";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

interface ProfileFormProps {
    user: UserRow;
    isGoogleUser: boolean;
}

export default function ProfileForm({ user, isGoogleUser }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition();
    const [pwPending, startPwTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [pwMessage, setPwMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setMessage(null);
        startTransition(async () => {
            try {
                await updateProfile(formData);
                setMessage({ type: "success", text: "Profile updated successfully!" });
            } catch (err) {
                setMessage({ type: "error", text: err instanceof Error ? err.message : "Something went wrong." });
            }
        });
    }

    async function handlePasswordReset() {
        setPwMessage(null);
        startPwTransition(async () => {
            try {
                await changePassword();
                setPwMessage({ type: "success", text: "Password reset email sent! Check your inbox." });
            } catch (err) {
                setPwMessage({ type: "error", text: err instanceof Error ? err.message : "Something went wrong." });
            }
        });
    }

    return (
        <div className="max-w-2xl space-y-10">
            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-5">
                    {user.avatar_url ? (
                        <Image
                            src={user.avatar_url}
                            alt={user.full_name ?? "Avatar"}
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex size-20 items-center justify-center rounded-full bg-muted text-xl font-bold text-muted-foreground uppercase">
                            {user.full_name?.charAt(0) ?? user.email.charAt(0)}
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-semibold text-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">Avatar is managed via your login provider.</p>
                    </div>
                </div>

                {/* Full Name — editable */}
                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-foreground mb-1">
                        Full Name
                    </label>
                    <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        defaultValue={user.full_name ?? ""}
                        placeholder="Your full name"
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-empiria-orange"
                    />
                </div>

                {/* Email — read-only */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={user.email}
                        readOnly
                        disabled
                        className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed here.</p>
                </div>

                {/* Status message */}
                {message && (
                    <p className={`text-sm font-medium ${message.type === "success" ? "text-empiria-green" : "text-red-500"}`}>
                        {message.text}
                    </p>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-full bg-empiria-orange px-6 py-2 text-sm font-semibold text-white hover:bg-empiria-orange/90 transition-colors disabled:opacity-60"
                >
                    {isPending ? "Saving…" : "Save Changes"}
                </button>
            </form>

            {/* Password Change — only for non-Google users */}
            {!isGoogleUser && (
                <div className="rounded-xl border border-border bg-card p-6 space-y-3">
                    <h2 className="text-base font-semibold text-foreground">Change Password</h2>
                    <p className="text-sm text-muted-foreground">
                        We&apos;ll send a password reset link to <span className="font-medium text-foreground">{user.email}</span>.
                    </p>

                    {pwMessage && (
                        <p className={`text-sm font-medium ${pwMessage.type === "success" ? "text-empiria-green" : "text-red-500"}`}>
                            {pwMessage.text}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={handlePasswordReset}
                        disabled={pwPending}
                        className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-60"
                    >
                        {pwPending ? "Sending…" : "Send Password Reset Email"}
                    </button>
                </div>
            )}

            {/* Google users — informational note */}
            {isGoogleUser && (
                <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="text-base font-semibold text-foreground">Password</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        You signed in with Google. Your password is managed by Google and cannot be changed here.
                    </p>
                </div>
            )}
        </div>
    );
}
