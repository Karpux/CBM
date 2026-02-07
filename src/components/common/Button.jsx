import clsx from 'clsx'

const styles = {
  base: 'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300',
  primary: 'bg-brand text-white shadow-glow hover:-translate-y-0.5 hover:brightness-110',
  ghost: 'bg-transparent text-ink/80 hover:text-ink',
  outline: 'border border-border bg-transparent text-ink hover:border-brand/60',
  soft: 'bg-brand/10 text-brand hover:bg-brand/15',
}

export const Button = ({ variant = 'primary', className, ...props }) => (
  <button className={clsx(styles.base, styles[variant], className)} {...props} />
)
