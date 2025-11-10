"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationLinks } from "~~/components/navigation/links";

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-base-200 bg-base-100">
      <div className="h-full flex flex-col gap-6 py-6 px-4">
        <nav>
          <ul className="menu menu-vertical gap-1 w-full">
            {navigationLinks.map(({ label, href, icon }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              const Icon = icon;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive ? "bg-primary text-primary-content" : "hover:bg-base-200"
                    }`}
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                    <span className="truncate">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
