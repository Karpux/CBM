import { useState } from 'react'
import { Button } from '../common/Button'

export const TaskForm = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    await onCreate({
      title: title.trim(),
      due_date: dueDate || null,
      priority,
      status: 'pending',
    })
    setTitle('')
    setDueDate('')
    setPriority('medium')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1.2fr_0.6fr_0.6fr_auto]">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Nueva tarea"
        className="w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink outline-none focus:border-brand"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
        className="w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink outline-none focus:border-brand"
      />
      <select
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
        className="w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink outline-none focus:border-brand"
      >
        <option value="low">Baja</option>
        <option value="medium">Media</option>
        <option value="high">Alta</option>
      </select>
      <Button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Agregar'}
      </Button>
    </form>
  )
}
