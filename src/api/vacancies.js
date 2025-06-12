import useSWR from 'swr';
import { useAuth } from '../context/AuthContext.jsx';

const fetcher = (url, token) =>
  fetch(url, {
    headers: { Authorization: 'Bearer ' + token }
  }).then(r => r.json());

// Todas las vacantes para CANDIDATE y RECRUITER (lista pública)
export function useVacancies() {
  const { token } = useAuth();
  const { data, error, isLoading, mutate } = useSWR(
    token ? [`${import.meta.env.VITE_API_URL}/api/vacancies`, token] : null,
    ([url, token]) => fetcher(url, token)
  );
  // Si data no es array, regresa []
  return {
    vacancies: Array.isArray(data) ? data : [],
    isLoading,
    isError: error,
    mutate
  };
}


// Solo las vacantes creadas por el recruiter logueado
export function useRecruiterVacancies() {
  const { token } = useAuth();
  const { data, error, isLoading } = useSWR(
    token ? [`${import.meta.env.VITE_API_URL}/api/vacancies/recruiter`, token] : null,
    ([url, token]) => fetcher(url, token)
  );
  return {
    vacancies: data || [],
    isLoading,
    isError: error
  };
}
