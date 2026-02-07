export const EmptyState = ({ title, subtitle }) => (
  <div className="rounded-2xl border border-dashed border-border bg-surface p-6 text-center">
    <p className="text-sm font-semibold text-ink">{title}</p>
    <p className="mt-2 text-xs text-muted">{subtitle}</p>
  </div>
)
