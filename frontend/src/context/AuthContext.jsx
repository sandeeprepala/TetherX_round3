import React, { createContext, useContext, useState, useEffect } from 'react';

/* 
  The backend sets an httpOnly cookie named 'token'.
  Since it's httpOnly, JS cannot read it directly.
  We decode the payload by calling a /auth/me endpoint — 
  but as the backend doesn't have one, we instead store 
  the decoded user info in localStorage immediately after login/signup
  (we parse the JWT payload which is base64 — NOT for security, just for UX).
  The actual auth enforcement is done server-side via the cookie.
*/

const parseJwtPayload = (token) => {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('mf_user');
            return stored ? JSON.parse(stored) : null;
        } catch { return null; }
    });

    const loginFromCookie = (tokenValue) => {
        const payload = parseJwtPayload(tokenValue);
        if (payload) {
            setUser(payload);
            localStorage.setItem('mf_user', JSON.stringify(payload));
        }
    };

    const saveUser = (userData) => {
        setUser(userData);
        localStorage.setItem('mf_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mf_user');
        // Also clear the httpOnly cookie via the backend (if endpoint existed)
        // For now just clear local state.
    };

    return (
        <AuthContext.Provider value={{ user, saveUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
