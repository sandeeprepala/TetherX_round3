import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    User, Mail, Lock, Activity, ArrowLeft, Eye, EyeOff,
    AlertCircle, CheckCircle2, Stethoscope, Building2, Briefcase
} from 'lucide-react';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';

/* ── Specializations list ─────────────────────────────────── */
const SPECIALIZATIONS = [
    'Cardiology', 'Neurology', 'Dermatology', 'General Medicine',
    'Pediatrics', 'Orthopedics', 'Psychiatry', 'Dentistry',
    'Gynecology', 'Ophthalmology', 'ENT', 'Oncology',
];

/* ── Reusable field ───────────────────────────────────────── */
const Field = ({ label, type = 'text', placeholder, value, onChange, icon: Icon, rightEl, required = true }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">{label}</label>
        <div className="relative group">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none z-10" />
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full bg-black/40 border border-white/5 focus:border-cyan-500/50 outline-none rounded-xl py-4 pl-12 pr-12 text-white text-sm transition-all focus:ring-4 focus:ring-cyan-500/10 placeholder:text-slate-600"
            />
            {rightEl && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightEl}</div>}
        </div>
    </div>
);

/* ── Toast ────────────────────────────────────────────────── */
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

/* ── Role Tab ─────────────────────────────────────────────── */
const RoleTab = ({ role, active, onClick, icon: Icon, label }) => (
    <button
        type="button"
        onClick={() => onClick(role)}
        className={`flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all ${active === role ? 'bg-cyan-500 text-white shadow-lg glow-cyan' : 'text-slate-500 hover:text-white'}`}
    >
        <Icon className="w-4 h-4" />
        {label}
    </button>
);

/* ═══════════════════════════════════════════════════════════
   SIGNUP PAGE
════════════════════════════════════════════════════════════ */
export const SignupPage = () => {
    const navigate = useNavigate();
    const { saveUser } = useAuth();

    const [role, setRole] = useState('patient');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    /* ── Form state (superset of patient + doctor fields) ─── */
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        // Doctor-only
        specialization: '',
        qualification: '',
        experienceYears: '',
        hospitalName: '',
        city: '',
    });

    const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

    /* ── Password strength bar ───────────────────────────── */
    const strength = (() => {
        const p = form.password;
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s; // 0–4
    })();

    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
    const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-cyan-500'][strength];

    /* ── Submit ──────────────────────────────────────────── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setToast(null);

        if (form.password !== form.confirmPassword) {
            setToast({ msg: 'Passwords do not match.', type: 'error' });
            return;
        }
        if (form.password.length < 6) {
            setToast({ msg: 'Password must be at least 6 characters.', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            let result;
            if (role === 'patient') {
                result = await authApi.registerPatient({
                    fullName: form.fullName,
                    email: form.email,
                    password: form.password,
                });
            } else {
                if (!form.specialization) {
                    setToast({ msg: 'Please select your specialization.', type: 'error' });
                    setLoading(false);
                    return;
                }
                result = await authApi.registerDoctor({
                    fullName: form.fullName,
                    email: form.email,
                    password: form.password,
                    specialization: form.specialization,
                });
            }

            const { data, jwtPayload } = result;
            const fromBody = data?.user || {};
            const fromJwt = jwtPayload || {};

            const id = fromBody.id ?? fromJwt.id ?? null;
            const resolvedRole = fromBody.role ?? fromJwt.role ?? role;
            const email = fromBody.email ?? form.email;

            if (!id) {
                throw new Error('Signup succeeded but user id was not returned by server.');
            }

            saveUser({
                id,
                role: resolvedRole,
                email,
            });

            setToast({ msg: 'Account created! Taking you to dashboard…', type: 'success' });
            setTimeout(() => navigate('/dashboard'), 1200);
        } catch (err) {
            setToast({ msg: err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center py-16 px-6 bg-[#0a0c10] overflow-hidden">
            {/* Ambient */}
            <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/8 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/8 blur-[150px] rounded-full pointer-events-none"></div>

            <Link to="/" className="absolute top-8 left-8 p-3 glass rounded-full hover:bg-white/10 transition-all text-white flex items-center gap-2 group z-10">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-semibold hidden sm:inline">Back to Home</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl relative z-10"
            >
                <div className="glass-card p-10 border border-white/5">
                    {/* Logo */}
                    <div className="flex flex-col items-center gap-4 mb-10">
                        <div className="p-4 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl glow-cyan ring-4 ring-teal-500/20">
                            <Activity className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-3xl font-poppins font-bold text-white tracking-tight">Create Your Account</h1>
                            <p className="text-slate-500 text-sm mt-1">Join 2.5 million people on MediFlow</p>
                        </div>
                    </div>

                    {/* Role Toggle */}
                    <div className="flex p-1.5 glass bg-black/40 rounded-2xl mb-8">
                        <RoleTab role="patient" active={role} onClick={setRole} icon={User} label="I'm a Patient" />
                        <RoleTab role="doctor" active={role} onClick={setRole} icon={Stethoscope} label="I'm a Doctor" />
                    </div>

                    {/* Toast */}
                    <AnimatePresence>
                        {toast && <Toast {...toast} />}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Common fields */}
                        <Field label="Full Name" placeholder="John Doe" value={form.fullName} onChange={set('fullName')} icon={User} />
                        <Field label="Email Address" type="email" placeholder="name@example.com" value={form.email} onChange={set('email')} icon={Mail} />

                        {/* Doctor-only fields – animated in/out */}
                        <AnimatePresence>
                            {role === 'doctor' && (
                                <motion.div
                                    key="doctor-fields"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-5 overflow-hidden"
                                >
                                    {/* Specialization */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Specialization</label>
                                        <div className="relative group">
                                            <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none z-10" />
                                            <select
                                                value={form.specialization}
                                                onChange={set('specialization')}
                                                className="w-full bg-black/40 border border-white/5 focus:border-cyan-500/50 outline-none rounded-xl py-4 pl-12 pr-4 text-white text-sm transition-all focus:ring-4 focus:ring-cyan-500/10 appearance-none"
                                            >
                                                <option value="" className="bg-[#0f1117]">Select your specialization…</option>
                                                {SPECIALIZATIONS.map((s) => (
                                                    <option key={s} value={s} className="bg-[#0f1117]">{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Qualification (optional)" placeholder="e.g. MBBS, MD" value={form.qualification} onChange={set('qualification')} icon={Briefcase} required={false} />
                                        <Field label="Experience (years)" type="number" placeholder="e.g. 5" value={form.experienceYears} onChange={set('experienceYears')} icon={Briefcase} required={false} />
                                    </div>

                                    <Field label="Hospital / Clinic Name (optional)" placeholder="e.g. Apollo Hospital" value={form.hospitalName} onChange={set('hospitalName')} icon={Building2} required={false} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Password */}
                        <Field
                            label="Password"
                            type={showPw ? 'text' : 'password'}
                            placeholder="Min. 6 characters"
                            value={form.password}
                            onChange={set('password')}
                            icon={Lock}
                            rightEl={
                                <button type="button" onClick={() => setShowPw((v) => !v)} className="text-slate-500 hover:text-cyan-400 transition-colors">
                                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            }
                        />

                        {/* Strength bar */}
                        {form.password.length > 0 && (
                            <div className="space-y-1.5 -mt-2">
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-white/10'}`}></div>
                                    ))}
                                </div>
                                <p className={`text-xs font-bold transition-colors ${strengthColor.replace('bg-', 'text-')}`}>{strengthLabel}</p>
                            </div>
                        )}

                        <Field
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={set('confirmPassword')}
                            icon={Lock}
                        />

                        {/* Confirm match hint */}
                        {form.confirmPassword.length > 0 && (
                            <p className={`text-xs font-bold flex items-center gap-1 -mt-2 ${form.password === form.confirmPassword ? 'text-cyan-400' : 'text-red-400'}`}>
                                {form.password === form.confirmPassword
                                    ? <><CheckCircle2 className="w-3.5 h-3.5" /> Passwords match</>
                                    : <><AlertCircle className="w-3.5 h-3.5" /> Passwords do not match</>}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-white font-bold glow-cyan shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                `Create ${role === 'patient' ? 'Patient' : 'Doctor'} Account`
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Already a member?{' '}
                        <Link to="/login" className="text-cyan-400 font-bold hover:text-cyan-300 ml-1">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
