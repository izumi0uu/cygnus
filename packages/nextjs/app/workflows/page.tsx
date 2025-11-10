import Link from "next/link";
import WorkflowBuilder from "./_components/WorkflowBuilder";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import PageHeader from "~~/components/ui/PageHeader";

type WorkflowsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WorkflowsPage({ searchParams }: WorkflowsPageProps) {
  const params = await searchParams;
  const mode = (params?.mode as string) || "dashboard";

  if (mode === "create") return <WorkflowBuilder mode="create" />;

  return (
    <main className="min-h-screen">
      <PageHeader
        leftSlot={<h1 className="text-xl sm:text-2xl font-bold">Workflows</h1>}
        rightSlot={
          <Link href="/workflows?mode=create" className="btn btn-primary">
            <PlusCircleIcon className="h-4 w-4" /> Create Workflow
          </Link>
        }
      />

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="stat shadow-sm bg-base-100 border border-base-200">
          <div className="stat-title">Today triggers</div>
          <div className="stat-value">0</div>
          <div className="stat-desc">Compared to yesterday 0%</div>
        </div>

        <div className="stat shadow-sm bg-base-100 border border-base-200">
          <div className="stat-title">Success rate</div>
          <div className="stat-value">—</div>
          <div className="stat-desc">Last 24 hours</div>
        </div>

        <div className="stat shadow-sm bg-base-100 border border-base-200">
          <div className="stat-title">Average duration</div>
          <div className="stat-value">—</div>
          <div className="stat-desc">Last 24 hours</div>
        </div>
      </section>
    </main>
  );
}
