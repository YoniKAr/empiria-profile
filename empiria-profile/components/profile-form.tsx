"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateProfile } from "@/lib/actions";
import type { Database } from "@/lib/database.types";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

interface ProfileFormProps {
    user: UserRow;
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-2xl">
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
                    <div className="flex size-20 items-center justify-center rounded-full bg-gray-200 text-xl font-bold text-gray-500 uppercase">
                        {user.full_name?.charAt(0) ?? user.email.charAt(0)}
                    </div>
                )}
                <div>
                    <p className="text-sm font-semibold text-gray-700">{user.email}</p>
                    <p className="text-xs text-gray-400">Avatar is managed via your login provider.</p>
                </div>
            </div>

            {/* Full Name */}
            <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                </label>
                <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    defaultValue={user.full_name ?? ""}
                    placeholder="Your full name"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
            </div>

            {/* Phone */}
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                </label>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={user.phone ?? ""}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
            </div>

            {/* Interests */}
            <div>
                <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
                    Interests <span className="text-gray-400 font-normal">(comma-separated)</span>
                </label>
                <input
                    id="interests"
                    name="interests"
                    type="text"
                    defaultValue={(user.interests ?? []).join(", ")}
                    placeholder="e.g. Music, Technology, Art"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
            </div>

            {/* Role badge */}
            <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Role</p>
                <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 capitalize">
                    {user.role}
                </span>
            </div>

            {/* Status message */}
            {message && (
                <p className={`text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-500"}`}>
                    {message.text}
                </p>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={isPending}
                className="rounded-full bg-orange-500 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors disabled:opacity-60"
            >
                {isPending ? "Saving…" : "Save Changes"}
            </button>
        </form>
    );
}
