"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useTopControls } from "~~/components/providers/TopControlsProvider";

export default function HeaderRightSlot() {
  const { controls } = useTopControls();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!pathname) {
    return null;
  }

  if (controls) return <>{controls}</>;

  if (pathname === "/workflows") {
    const mode = searchParams?.get("mode");
    if (mode === "create") return null;

    return (
      <Link href="/workflows?mode=create" className="btn btn-primary">
        <PlusCircleIcon className="h-4 w-4" /> Create Workflow
      </Link>
    );
  }

  return null;
}
