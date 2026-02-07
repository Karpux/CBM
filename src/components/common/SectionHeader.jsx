export const SectionHeader = ({ eyebrow, title, description }) => (
  <div className="max-w-2xl">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
    <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{title}</h2>
    <p className="mt-3 text-sm text-muted sm:text-base">{description}</p>
  </div>
)
