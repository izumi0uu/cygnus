"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { navigationLinks } from "~~/components/navigation/links";
import { useSideNavCollasped } from "~~/hooks/useSideNavCollasped";

export default function SideNav() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSideNavCollasped();

  return (
    <aside
      className={`${
        collapsed ? "w-18" : "w-64"
      } border-r border-base-200 bg-base-100 transition-all duration-200 ease-in-out`}
    >
      <div className="h-full flex flex-col gap-4 py-4 px-2">
        <button
          type="button"
          className="btn btn-ghost btn-sm w-full justify-start"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="h-6 w-6" /> : <PanelLeftClose className="h-6 w-6" />}
          {!collapsed && <span className="text-sm">Menu</span>}
        </button>
        <nav className="mt-1">
          <ul className="menu menu-vertical gap-1 w-full">
            {navigationLinks.map(({ label, href, icon }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              const Icon = icon;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    title={label}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive ? "bg-primary text-primary-content" : "hover:bg-base-200"
                    }`}
                  >
                    {Icon ? <Icon className="h-6 w-6" /> : null}
                    {!collapsed && <span className="truncate">{label}</span>}
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
