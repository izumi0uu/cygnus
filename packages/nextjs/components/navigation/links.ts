import type { ComponentType, SVGProps } from "react";
import { BugAntIcon, HomeIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

export type NavigationLink = {
  label: string;
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

export const navigationLinks: NavigationLink[] = [
  {
    label: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: BugAntIcon,
  },
  {
    label: "Workflows",
    href: "/workflows",
    icon: Squares2X2Icon,
  },
];
