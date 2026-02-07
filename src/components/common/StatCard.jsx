export const StatCard = ({ label, value, hint }) => (
  <div className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-soft">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
    <p className="mt-3 text-3xl font-semibold text-ink">{value}</p>
    <p className="mt-2 text-xs text-muted">{hint}</p>
  </div>
)
