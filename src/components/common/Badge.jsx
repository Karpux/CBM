export const Badge = ({ children, tone = 'brand' }) => {
  const tones = {
    brand: 'bg-brand/15 text-brand',
    accent: 'bg-accent/20 text-accent',
    neutral: 'bg-ink/5 text-ink/80',
  }

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  )
}
