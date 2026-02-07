import { useState } from 'react'
import { Button } from '../common/Button'

export const MetricsForm = ({ onCreate }) => {
  const [metricDate, setMetricDate] = useState('')
  const [attendance, setAttendance] = useState('')
  const [visitors, setVisitors] = useState('')
  const [activeCells, setActiveCells] = useState('')
  const [followups, setFollowups] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!metricDate) return
    setLoading(true)
    await onCreate({
      metric_date: metricDate,
      attendance: Number(attendance || 0),
      visitors: Number(visitors || 0),
      active_cells: Number(activeCells || 0),
      followups: Number(followups || 0),
    })
    setMetricDate('')
    setAttendance('')
    setVisitors('')
    setActiveCells('')
    setFollowups('')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 lg:grid-cols-[1fr_0.7fr_0.7fr_0.7fr_0.7fr_auto]">
      <input
        type="date"
        value={metricDate}
        onChange={(event) => setMetricDate(event.target.value)}
        className="w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink outline-none focus:border-brand"
      />
      <input
        type="number"
        value={attendance}
        onChange={(event) => setAttendance(event.target.value)}
        placeholder="Asistencia"
        className="w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink outline-none focus:border-brand"
      />
      <input
        type="number"
        value={visitors}
        onChange={(event) => setVisitors(event.target.value)}
        placeholder="Visitantes"
        className="w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink outline-none focus:border-brand"
      />
      <input
        type="number"
        value={activeCells}
        onChange={(event) => setActiveCells(event.target.value)}
        placeholder="Células"
        className="w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink outline-none focus:border-brand"
      />
      <input
        type="number"
        value={followups}
        onChange={(event) => setFollowups(event.target.value)}
        placeholder="Seguimientos"
        className="w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink outline-none focus:border-brand"
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Agregar'}
      </Button>
    </form>
  )
}
