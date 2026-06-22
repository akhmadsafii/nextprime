export default function Page() {
  const metrics = [
    { label: "Total revenue", value: "$24,780", change: "+12.5%" },
    { label: "Active projects", value: "36", change: "+8 this month" },
    { label: "Team members", value: "128", change: "+14.2%" },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-8 lg:px-7.5">
      <section className="rounded-xl border border-border bg-accent/30 p-6 lg:p-8">
        <p className="text-sm font-medium text-primary">Overview</p>
        <h2 className="mt-2 text-2xl font-semibold text-mono">
          Your team is making steady progress.
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Keep the work visible, review priorities, and make the next decision
          with confidence.
        </p>
      </section>

      <section
        aria-label="Key metrics"
        className="mt-5 grid gap-5 md:grid-cols-3"
      >
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-3 text-2xl font-semibold text-mono">
              {metric.value}
            </p>
            <p className="mt-2 text-sm font-medium text-success">
              {metric.change}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-5 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-mono">Current focus</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Three items need attention before the weekly review.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            3 open
          </span>
        </div>
        <ul className="mt-5 divide-y divide-border">
          {[
            "Approve onboarding flow",
            "Review analytics baseline",
            "Prepare release notes",
          ].map((item) => (
            <li key={item} className="py-3 text-sm text-secondary-foreground">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
