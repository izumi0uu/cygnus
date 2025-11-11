"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Breadcrumb } from "~~/types/path";
import cn from "~~/utils/cn";
import { buildBreadcrumbs } from "~~/utils/path";

export type PageHeaderProps = {
  autoBreadcrumbs?: boolean;
  breadcrumbs?: Breadcrumb[];
  title?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
  containerClassName?: string;
};

export default function PageHeader({
  autoBreadcrumbs = false,
  breadcrumbs: breadcrumbsProp,
  leftSlot,
  rightSlot,
  className,
  containerClassName,
}: PageHeaderProps) {
  const pathname = usePathname();

  const { breadcrumbs: autoBreadcrumbsValue } = React.useMemo(() => buildBreadcrumbs(pathname ?? "/"), [pathname]);

  const breadcrumbs = breadcrumbsProp ?? (autoBreadcrumbs ? autoBreadcrumbsValue : undefined);

  const hasBreadcrumbs = breadcrumbs && breadcrumbs.length > 0;

  return (
    <header
      className={cn("navbar bg-base-100 border-b border-base-200", "min-h-16", className)}
      data-slot="page-header"
    >
      <div className={cn("w-full max-w-7xl mx-auto", "flex items-center justify-between gap-3", containerClassName)}>
        <div className="flex items-center gap-3 min-w-0">
          {hasBreadcrumbs ? (
            <nav className="breadcrumbs text-sm min-w-0" aria-label="Breadcrumb">
              <ul className="flex-nowrap">
                {breadcrumbs.map((item, index) => {
                  const isLast = index === breadcrumbs.length - 1;

                  if (!isLast && item.href) {
                    return (
                      <li key={`${item.label}-${index}`} className="truncate">
                        <Link href={item.href} className="link-hover truncate">
                          {item.label}
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={`${item.label}-${index}`} className="truncate">
                      <span className="truncate">{item.label}</span>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : null}
          {leftSlot}
        </div>
        <div className="flex items-center gap-3 shrink-0">{rightSlot}</div>
      </div>
    </header>
  );
}
