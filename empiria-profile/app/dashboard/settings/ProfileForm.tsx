"use client";

import { useState } from "react";
import { updateProfile, updateSettings } from "@/lib/actions";
import { Save, Bell, BellOff, X } from "lucide-react";
import type { Database } from "@/lib/database.types";
import { getInitials } from "@/lib/utils";

type User = Database["public"]["Tables"]["users"]["Row"];

const SUGGESTED_INTERESTS = [
  "Music", "Technology", "Sports", "Art", "Food & Drink", "Networking",
  "Health & Wellness", "Business", "Film", "Photography", "Dance",
  "Comedy", "Gaming", "Fashion", "Science", "Education",
];

type UserSettings = { theme: string; notifications: boolean };

function parseSettings(raw: unknown): UserSettings {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>;
    return {
      theme: typeof obj.theme === "string" ? obj.theme : "light",
      notifications: typeof obj.notifications === "boolean" ? obj.notifications : true,
    };
  }
  return { theme: "light", notifications: true };
}

export default function ProfileForm({ user }: { user: User }) {
  const [saving, setSaving] = useState(false);
  const settings = parseSettings(user.settings);
  const [interests, setInterests] = useState<string[]>(user.interests ?? []);
  const [notifications, setNotifications] = useState(settings.notifications);
  const [message, setMessage] = useState("");
  const initials = getInitials(user.full_name || user.email);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setMessage("");
    try {
      // Inject interests into form data
      formData.set("interests", interests.join(","));
      await updateProfile(formData);

      // Update notification settings
      await updateSettings({ theme: settings.theme, notifications });

      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  function removeInterest(interest: string) {
    setInterests((prev) => prev.filter((i) => i !== interest));
  }

  return (
    <form action={handleSubmit} className="mt-8 space-y-8">
      {/* Avatar section */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold">Profile Picture</h2>
        <div className="mt-4 flex items-center gap-6">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name || "Avatar"}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
              {initials}
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">
              Your profile picture is synced from your login provider (Google, GitHub, etc.).
              To change it, update your avatar there.
            </p>
          </div>
        </div>
      </section>

      {/* Basic info */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold">Personal Information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              defaultValue={user.full_name ?? ""}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-400">Email is managed by your login provider.</p>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={user.phone ?? ""}
              placeholder="+1 (555) 000-0000"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Interests */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold">Interests</h2>
        <p className="mt-1 text-sm text-gray-500">
          Select your interests so we can recommend better events.
        </p>

        {/* Selected interests */}
        {interests.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-indigo-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Suggested interests */}
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTED_INTERESTS.filter((i) => !interests.includes(i)).map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
            >
              + {interest}
            </button>
          ))}
        </div>
      </section>

      {/* Notification settings */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold">Notifications</h2>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {notifications ? (
              <Bell className="h-5 w-5 text-indigo-600" />
            ) : (
              <BellOff className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive updates about your events and tickets.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNotifications(!notifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? "bg-indigo-600" : "bg-gray-300"
              }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${notifications ? "translate-x-6" : "translate-x-1"
                }`}
            />
          </button>
        </div>
      </section>

      {/* Payment info notice */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold">Payment Methods</h2>
        <p className="mt-2 text-sm text-gray-500">
          Payment is handled securely through Stripe Checkout at the time of purchase.
          Your payment details are never stored on our servers. You can manage your
          saved cards directly through Stripe during checkout.
        </p>
      </section>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {message && (
          <p
            className={`text-sm ${message.includes("success") ? "text-emerald-600" : "text-red-600"
              }`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
