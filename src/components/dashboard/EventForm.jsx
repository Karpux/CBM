import { useState } from 'react'
import { Button } from '../common/Button'

export const EventForm = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!title.trim() || !eventDate) return
    setLoading(true)
    await onCreate({
      title: title.trim(),
      event_date: eventDate,
      location: location.trim(),
    })
    setTitle('')
    setEventDate('')
    setLocation('')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1.2fr_0.7fr_0.7fr_auto]">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Nuevo evento"
        className="w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink outline-none focus:border-brand"
      />
      <input
        type="date"
        value={eventDate}
        onChange={(event) => setEventDate(event.target.value)}
        className="w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink outline-none focus:border-brand"
      />
      <input
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        placeholder="Lugar"
        className="w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink outline-none focus:border-brand"
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Agregar'}
      </Button>
    </form>
  )
}
