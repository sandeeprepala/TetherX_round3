import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Activity, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth';

/* ── tiny reusable field ─────────────────────────────────── */
const Field = ({ label, type = 'text', placeholder, value, onChange, icon: Icon, rightEl }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">{label}</label>
        <div className="relative group">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none z-10" />
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
                className="w-full bg-black/40 border border-white/5 focus:border-cyan-500/50 outline-none rounded-xl py-4 pl-12 pr-12 text-white text-sm transition-all focus:ring-4 focus:ring-cyan-500/10 placeholder:text-slate-600"
            />
            {rightEl && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightEl}</div>
            )}
        </div>
    </div>
);

/* ── Toast notification ──────────────────────────────────── */
const Toast = ({ msg, type }) => (
    <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        className={`flex items-center gap-3 px-5 py-4 rounded-xl border text-sm font-semibold mb-6 ${type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}
    >
        {type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
        {msg}
    </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   LOGIN PAGE
════════════════════════════════════════════════════════════ */
export const LoginPage = () => {
    const navigate = useNavigate();
    const { saveUser } = useAuth();

    const [form, setForm] = useState({ email: '', password: '', role: 'patient' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setToast(null);
        try {
            const { jwtPayload } = await authApi.login({ email: form.email, password: form.password });
            // Use JWT payload {id, role} if available (Vite proxy exposes Set-Cookie header)
            // Otherwise fall back to the role chosen in the UI toggle
            saveUser({
                id: jwtPayload?.id ?? null,
                role: jwtPayload?.role ?? form.role,
                email: form.email,
            });
            setToast({ msg: 'Login successful! Redirecting…', type: 'success' });
            setTimeout(() => navigate('/dashboard'), 1200);
        } catch (err) {
            setToast({ msg: err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 bg-[#0a0c10] overflow-hidden">
            {/* Ambient orbs */}
            <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/8 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-teal-500/8 blur-[150px] rounded-full pointer-events-none"></div>

            {/* Back link */}
            <Link to="/" className="absolute top-8 left-8 p-3 glass rounded-full hover:bg-white/10 transition-all text-white flex items-center gap-2 group z-10">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-semibold hidden sm:inline">Back to Home</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-10 border border-white/5">
                    {/* Logo */}
                    <div className="flex flex-col items-center gap-4 mb-10">
                        <div className="p-4 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl glow-cyan ring-4 ring-cyan-500/20">
                            <Activity className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-3xl font-poppins font-bold text-white tracking-tight">Welcome Back</h1>
                            <p className="text-slate-500 text-sm mt-1">Sign in to your MediFlow account</p>
                        </div>
                    </div>

                    {/* Toast */}
                    <AnimatePresence>
                        {toast && <Toast {...toast} />}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Role selector */}
                        <div className="flex p-1.5 glass bg-black/40 rounded-2xl">
                            <button type="button" onClick={() => setForm(p => ({ ...p, role: 'patient' }))} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${form.role === 'patient' ? 'bg-cyan-500 text-white' : 'text-slate-500 hover:text-white'}`}>Patient</button>
                            <button type="button" onClick={() => setForm(p => ({ ...p, role: 'doctor' }))} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${form.role === 'doctor' ? 'bg-teal-500 text-white' : 'text-slate-500 hover:text-white'}`}>Doctor</button>
                        </div>

                        <Field
                            label="Email Address"
                            type="email"
                            placeholder="name@example.com"
                            value={form.email}
                            onChange={set('email')}
                            icon={Mail}
                        />

                        <Field
                            label="Password"
                            type={showPw ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={form.password}
                            onChange={set('password')}
                            icon={Lock}
                            rightEl={
                                <button type="button" onClick={() => setShowPw((v) => !v)} className="text-slate-500 hover:text-cyan-400 transition-colors">
                                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            }
                        />

                        <div className="flex justify-end">
                            <Link to="/" className="text-xs font-bold text-cyan-400 hover:text-cyan-300">Forgot Password?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl text-white font-bold glow-cyan shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    Sign In
                                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-cyan-400 font-bold hover:text-cyan-300 ml-1">Create Account</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
