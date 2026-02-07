export const Panel = ({ title, description, children }) => (
  <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
    <div className="flex items-center justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        {description ? <p className="mt-1 text-xs text-muted">{description}</p> : null}
      </div>
    </div>
    <div className="mt-4 space-y-3">{children}</div>
  </div>
)
