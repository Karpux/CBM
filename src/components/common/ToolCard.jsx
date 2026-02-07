export const ToolCard = ({ icon: Icon, title, description, tags }) => (
  <div className="group rounded-2xl border border-border bg-surface p-6 shadow-soft transition hover:-translate-y-1">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
      <Icon size={20} />
    </div>
    <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
    <p className="mt-2 text-sm text-muted">{description}</p>
    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-brand">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full bg-brand/10 px-3 py-1">
          {tag}
        </span>
      ))}
    </div>
  </div>
)
