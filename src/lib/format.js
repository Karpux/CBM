export const formatPercent = (value) => `${Math.round(value)}%`

export const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  })
}
