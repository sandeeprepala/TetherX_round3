/* ─── Doctor API Service ────────────────────────────────────
   Mirrors doctorController.js backend routes exactly.
   All requests go through the Vite proxy → localhost:5000
──────────────────────────────────────────────────────────── */

const apiFetch = async (endpoint, method = 'GET', body) => {
    const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',   // sends the httpOnly JWT cookie
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

export const doctorApi = {
    /* PUT /doctor/availability   { startDate, endDate }
       Requires: auth cookie (JWT with doctor role)             */
    setAvailability: (body) =>
        apiFetch('/doctor/availability', 'PUT', body),

    /* POST /doctor/accept/:appointmentId
       Accepts a pending appointment request                    */
    acceptAppointment: (appointmentId) =>
        apiFetch(`/doctor/accept/${appointmentId}`, 'POST'),

    /* GET /doctor/appointments/upcoming/:doctorId
       Returns accepted upcoming appointments with patientId populated */
    getUpcoming: (doctorId) =>
        apiFetch(`/doctor/appointments/upcoming/${doctorId}`),
};
