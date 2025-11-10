import { PATH_LABELS, SEGMENT_LABELS } from "~~/contants/path";
import type { Breadcrumb } from "~~/types/path";

const toTitleCase = (value: string) =>
  value
    .split(/[-_]/g)
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const buildBreadcrumbs = (pathname: string): { breadcrumbs: Breadcrumb[]; pageTitle: string } => {
  const cleanedPath = pathname.split("?")[0]?.split("#")[0] ?? "/";
  if (cleanedPath === "/" || cleanedPath === "") {
    return { breadcrumbs: [{ label: "Home" }], pageTitle: "Home" };
  }

  const segments = cleanedPath.replace(/^\/+|\/+$/g, "").split("/");
  const breadcrumbs: Breadcrumb[] = [{ label: "Home", href: "/" }];
  let cumulativePath = "";

  const pathLabels = PATH_LABELS ?? {};
  const segmentLabels = SEGMENT_LABELS ?? {};

  segments.forEach((segment, index) => {
    cumulativePath += `/${segment}`;
    const label = pathLabels[cumulativePath] ?? segmentLabels[segment] ?? toTitleCase(segment);
    const isLast = index === segments.length - 1;
    breadcrumbs.push({ label, href: isLast ? undefined : cumulativePath });
  });

  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label ?? "Home";
  return { breadcrumbs, pageTitle };
};

export { toTitleCase, buildBreadcrumbs };
