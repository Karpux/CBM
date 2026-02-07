import { useEffect, useState } from 'react'
import { fetchDashboardSnapshot } from '../lib/api'

export const useDashboardData = () => {
  const [data, setData] = useState({
    metrics: null,
    tasks: [],
    events: [],
    visits: [],
    prayer: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async (active) => {
    try {
      const snapshot = await fetchDashboardSnapshot()
      if (active) {
        setData(snapshot)
        setError('')
      }
    } catch (err) {
      if (active) setError(err.message)
    } finally {
      if (active) setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    load(active)
    return () => {
      active = false
    }
  }, [])

  const refresh = async () => {
    setLoading(true)
    await load(true)
  }

  return { ...data, loading, error, refresh }
}
