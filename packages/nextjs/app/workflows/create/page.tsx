import { redirect } from "next/navigation";

export default function RedirectToCreatePanel() {
  redirect("/workflows?mode=create");
}
