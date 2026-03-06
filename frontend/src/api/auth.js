/* ─── Auth API Service ──────────────────────────────────────
   Calls /auth/* backend routes.
   The backend sets an httpOnly JWT cookie after login/register.
   We also decode the JWT payload (id + role) from the response
   headers' Set-Cookie so we can store the user's MongoDB _id
   in localStorage for API calls that need it in the URL/body.
──────────────────────────────────────────────────────────── */

/** Decode a JWT payload without verifying the signature (UX only). */
const decodeJwt = (token) => {
    try {
        const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(b64));
    } catch {
        return null;
    }
};

/**
 * Extract the JWT value from a Set-Cookie header string.
 * e.g. "token=eyJ...; HttpOnly; ..."  → "eyJ..."
 */
const extractTokenFromCookieHeader = (cookieHeader) => {
    if (!cookieHeader) return null;
    const match = cookieHeader.match(/token=([^;]+)/);
    return match ? match[1] : null;
};

/**
 * Safe fetch wrapper.
 * Returns { data, jwtPayload } so callers can persist the user ID.
 */
const apiFetch = async (endpoint, method = 'POST', body) => {
    const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
    });

    // Try to extract JWT from Set-Cookie header (works in Vite dev proxy)
    const rawCookie = res.headers.get('set-cookie');
    const tokenStr = extractTokenFromCookieHeader(rawCookie);
    const jwtPayload = tokenStr ? decodeJwt(tokenStr) : null;

    const text = await res.text();
    let data = null;
    if (text.trim()) {
        try { data = JSON.parse(text); } catch {
            if (!res.ok) throw new Error(`Server error (${res.status})`);
        }
    }
    if (!res.ok) {
        throw new Error(data?.msg || data?.message || `Error ${res.status}`);
    }
    return { data, jwtPayload };
};

export const authApi = {
    /** POST /auth/patient/register — returns { data, jwtPayload } */
    registerPatient: (body) => apiFetch('/auth/patient/register', 'POST', body),

    /** POST /auth/doctor/register — returns { data, jwtPayload } */
    registerDoctor: (body) => apiFetch('/auth/doctor/register', 'POST', body),

    /** POST /auth/login — returns { data, jwtPayload } */
    login: (body) => apiFetch('/auth/login', 'POST', body),
};
