/* ─── Query API Service ──────────────────────────────────────
   Handles medical queries between patients and doctors.
   All requests go through the Vite proxy → localhost:5000
──────────────────────────────────────────────────────────── */

const apiFetch = async (endpoint, method = 'GET', body) => {
  const res = await fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  if (text.trim()) {
    try { data = JSON.parse(text); } catch {
      if (!res.ok) throw new Error(`Server error (${res.status})`);
    }
  }
  if (!res.ok) throw new Error(data?.msg || data?.message || `Error ${res.status}`);
  return data;
};

export const queryApi = {
  /** POST /query — create a new query (patient only) */
  create: (body) =>
    apiFetch('/query', 'POST', body),

  /** GET /query/patient — list queries for current patient */
  listForPatient: () =>
    apiFetch('/query/patient'),

  /** GET /query/doctor — list queries visible to doctor */
  listForDoctor: () =>
    apiFetch('/query/doctor'),

  /** POST /query/:id/reply — doctor reply */
  reply: (id, body) =>
    apiFetch(`/query/${id}/reply`, 'POST', body),
};

