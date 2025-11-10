import WorkflowBuilder from "./_components/WorkflowBuilder";

type WorkflowsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WorkflowsPage({ searchParams }: WorkflowsPageProps) {
  const params = await searchParams;
  const mode = (params?.mode as string) || "view";

  if (mode === "create") return <WorkflowBuilder mode="create" />;

  return (
    <main className="min-h-screen">
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
