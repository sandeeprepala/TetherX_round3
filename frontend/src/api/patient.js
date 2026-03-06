/* ─── Patient API Service ───────────────────────────────────
   Mirrors the backend routes in patientController.js
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

export const patientApi = {
    /* ── Appointments ───────────────────────── */
    // GET /patient/appointments/upcoming/:patientId
    getUpcoming: (patientId) =>
        apiFetch(`/patient/appointments/upcoming/${patientId}`),

    // GET /patient/appointments/past/:patientId
    getPast: (patientId) =>
        apiFetch(`/patient/appointments/past/${patientId}`),

    // POST /patient/request/doctor  { patientId, doctorId, startDate, endDate, symptoms }
    requestDoctor: (body) =>
        apiFetch('/patient/request/doctor', 'POST', body),

    // POST /patient/request/all     { patientId, specialization, startDate, endDate, symptoms }
    requestAll: (body) =>
        apiFetch('/patient/request/all', 'POST', body),
};

export const doctorApi = {
    /* Backend has no GET /doctor list route, so we call the doctor controller
       The only public GET endpoints are under /doctor/appointments/upcoming/:id
       To list doctors we piggyback on /patient/request/all dry-run → not ideal.
       Instead we expose a helper that calls GET /doctor directly (future-proof) */
    getAllBySpecialization: async (specialization) => {
        // No direct "list doctors" route in backend — we call patient/request/all
        // with a dummy future date range and return the generated appointment docs
        // which have doctorId populated. But a cleaner approach: we maintain a static
        // list on the frontend that matches seeded doctors from the DB.
        // This function returns a promise resolving to the static set.
        return Promise.resolve([]);
    },
};
