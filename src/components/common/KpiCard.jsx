import { motion } from 'framer-motion'

export const KpiCard = ({ label, value, trend, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
  >
    <p className="text-xs font-semibold uppercase text-muted">{label}</p>
    <p className="mt-3 text-3xl font-semibold text-ink">{value}</p>
    <p className="mt-2 text-xs text-brand">{trend}</p>
  </motion.div>
)
