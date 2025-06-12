// ── src/utils/fetcher.js ───────────────────────────────────────────────────────

/**
 * fetcherWithToken(url, token):
 *   - Realiza un GET a la 'url' enviando Authorization = Bearer <token>.
 *   - Si res.ok === false, extrae el mensaje de error desde el JSON devuelto.
 *   - Si res.ok === true, parsea y devuelve el JSON.
 */
export async function fetcherWithToken(url, token) {
  const headers = token
    ? {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }
    : {
        'Content-Type': 'application/json',
      };

  const res = await fetch(url, { headers });
  if (!res.ok) {
    let mensaje = `Error en petición (status ${res.status})`;
    try {
      const cuerpo = await res.json();
      if (cuerpo.error) mensaje = cuerpo.error;
    } catch (_) {
      // Si no hay JSON, queda el mensaje genérico
    }
    throw new Error(mensaje);
  }
  return res.json();
}
