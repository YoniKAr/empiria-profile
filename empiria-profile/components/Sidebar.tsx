"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  Receipt,
  Settings,
  HelpCircle,
  LogOut,
  Store,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/tickets", label: "My Tickets", icon: Ticket },
  { href: "/dashboard/orders", label: "Order History", icon: Receipt },
  { href: "/dashboard/settings", label: "Profile & Settings", icon: Settings },
  { href: "/dashboard/support", label: "Support", icon: HelpCircle },
];

interface SidebarProps {
  userName: string;
  avatarUrl: string | null;
  initials: string;
}

export default function Sidebar({ userName, avatarUrl, initials }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
          E
        </div>
        <span className="text-lg font-semibold">Empiria</span>
      </div>

      {/* User summary */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{userName}</p>
          <p className="text-xs text-gray-500">Attendee</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-indigo-50 font-medium text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer links */}
      <div className="border-t border-gray-200 px-3 py-4 space-y-1">
        <a
          href={process.env.NEXT_PUBLIC_SHOP_URL ?? "https://shop.empiriaindia.com"}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <Store className="h-5 w-5" />
          Browse Events
        </a>
        <a
          href="/api/auth/logout"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </a>
      </div>
    </aside>
  );
}
