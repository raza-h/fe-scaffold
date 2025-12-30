"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardIcon, PersonIcon, GearIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/profile", label: "Profile", icon: PersonIcon },
  { href: "/settings", label: "Settings", icon: GearIcon },
];

interface SidebarProps {
  visible?: boolean;
}

export function Sidebar({ visible = true }: SidebarProps) {
  const pathname = usePathname();

  if (!visible) {
    return null;
  }

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight">Scaffold</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export const sidebarNavItems = navItems;
