// ── src/api/applications.js ────────────────────────────────────────────────────
import useSWR from 'swr'
import { useAuth } from '../context/AuthContext.jsx'
import { fetcherWithToken } from '../utils/fetcher.js'

export function useApplications() {
  const { token } = useAuth()
  const endpoint = `${import.meta.env.VITE_API_URL}/api/applications`

  // Si no hay token, SWR no dispara la petición
  const shouldFetch = token ? endpoint : null

  const { data, error, mutate } = useSWR(
    shouldFetch,
    () => fetcherWithToken(endpoint, token)
  )

  return {
    applications: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}
