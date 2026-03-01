"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { updateProfile, changePassword, uploadAvatar } from "@/lib/actions";
import type { Database } from "@/lib/database.types";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

interface ProfileFormProps {
    user: UserRow;
    isGoogleUser: boolean;
}

export default function ProfileForm({ user, isGoogleUser }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition();
    const [pwPending, startPwTransition] = useTransition();
    const [avatarPending, startAvatarTransition] = useTransition();

    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [pwMessage, setPwMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [avatarMessage, setAvatarMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Local preview of the selected avatar before upload
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar_url ?? null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file));
    }

    async function handleAvatarUpload(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setAvatarMessage(null);
        startAvatarTransition(async () => {
            try {
                await uploadAvatar(formData);
                setAvatarMessage({ type: "success", text: "Profile picture updated!" });
            } catch (err) {
                setAvatarMessage({ type: "error", text: err instanceof Error ? err.message : "Upload failed." });
            }
        });
    }

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

            {/* Avatar Upload */}
            <form onSubmit={handleAvatarUpload} className="space-y-4">
                <h2 className="text-base font-semibold text-foreground">Profile Picture</h2>
                <div className="flex items-center gap-5">
                    {/* Preview */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="relative group shrink-0"
                        title="Click to change photo"
                    >
                        {avatarPreview ? (
                            <Image
                                src={avatarPreview}
                                alt="Profile"
                                width={80}
                                height={80}
                                className="rounded-full object-cover size-20"
                                unoptimized
                            />
                        ) : (
                            <div className="flex size-20 items-center justify-center rounded-full bg-muted text-xl font-bold text-muted-foreground uppercase">
                                {user.full_name?.charAt(0) ?? user.email.charAt(0)}
                            </div>
                        )}
                        {/* Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-semibold text-white leading-tight text-center">Change<br />Photo</span>
                        </div>
                    </button>

                    <div className="space-y-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            Choose Photo
                        </button>
                        <p className="text-xs text-muted-foreground">JPG, PNG or WebP. Max 5MB.</p>
                    </div>
                </div>

                {avatarMessage && (
                    <p className={`text-sm font-medium ${avatarMessage.type === "success" ? "text-empiria-green" : "text-red-500"}`}>
                        {avatarMessage.text}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={avatarPending}
                    className="rounded-full bg-empiria-orange px-5 py-1.5 text-sm font-semibold text-white hover:bg-empiria-orange/90 transition-colors disabled:opacity-60"
                >
                    {avatarPending ? "Uploading…" : "Upload Photo"}
                </button>
            </form>

            <hr className="border-border" />

            {/* Profile Info Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-base font-semibold text-foreground">Personal Information</h2>

                {/* Email below avatar for reference */}
                <div className="text-sm text-muted-foreground">
                    Signed in as <span className="font-medium text-foreground">{user.email}</span>
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

                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-full bg-empiria-orange px-6 py-2 text-sm font-semibold text-white hover:bg-empiria-orange/90 transition-colors disabled:opacity-60"
                >
                    {isPending ? "Saving…" : "Save Changes"}
                </button>
            </form>

            <hr className="border-border" />

            {/* Password Change — only for non-Google users */}
            {!isGoogleUser ? (
                <div className="space-y-3">
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
            ) : (
                <div className="space-y-1">
                    <h2 className="text-base font-semibold text-foreground">Password</h2>
                    <p className="text-sm text-muted-foreground">
                        You signed in with Google. Your password is managed by Google and cannot be changed here.
                    </p>
                </div>
            )}
        </div>
    );
}
