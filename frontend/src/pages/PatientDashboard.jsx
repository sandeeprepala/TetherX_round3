import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, MessageSquare, Calendar, User, Settings,
    LogOut, Activity, Plus, ArrowUpRight, TrendingUp, Clock,
    Stethoscope, CheckCircle2, AlertCircle, Loader2, ChevronRight,
    X, Star
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { patientApi } from '../api/patient';

/* ─── Sidebar Nav Item ──────────────────────────────────── */
const SidebarItem = ({ icon: Icon, label, to }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
        }
    >
        <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span className="font-semibold text-sm">{label}</span>
    </NavLink>
);

/* ─── Stat Card ─────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, color, loading }) => (
    <div className="glass-card flex items-center justify-between group">
        <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
            {loading
                ? <div className="h-8 w-16 bg-white/10 rounded-lg animate-pulse"></div>
                : <h3 className="text-2xl font-poppins font-bold text-white">{value}</h3>
            }
        </div>
        <div className={`p-4 rounded-2xl bg-${color}-500/10 group-hover:scale-110 transition-transform shrink-0`}>
            <Icon className={`w-8 h-8 text-${color}-400`} />
        </div>
    </div>
);

/* ─── Status Badge ──────────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const map = {
        pending: { label: 'Pending', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
        accepted: { label: 'Accepted', cls: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
        completed: { label: 'Completed', cls: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
        cancelled: { label: 'Cancelled', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
    };
    const s = map[status] || map.pending;
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${s.cls}`}>
            {s.label}
        </span>
    );
};

/* ─── Book Appointment Modal ────────────────────────────── */
const SPECIALIZATIONS = [
    'Cardiology', 'Neurology', 'Dermatology', 'General Medicine',
    'Pediatrics', 'Orthopedics', 'Psychiatry', 'Dentistry',
];
const SYMPTOMS_LIST = [
    'Chest Pain', 'Breathing Issues', 'Fever', 'Headache',
    'Vomiting', 'Cough', 'Dizziness', 'Muscle Fatigue', 'Skin Rash',
];

const BookingModal = ({ patientId, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        specialization: '', startDate: '', endDate: '', symptoms: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const toggle = (s) => setForm(p => ({
        ...p,
        symptoms: p.symptoms.includes(s) ? p.symptoms.filter(x => x !== s) : [...p.symptoms, s],
    }));

    const submit = async (e) => {
        e.preventDefault();
        if (!patientId) { setError('You must be logged in. Please login again.'); return; }
        if (!form.specialization || !form.startDate || !form.endDate) {
            setError('Please fill all required fields.'); return;
        }
        setLoading(true); setError('');
        try {
            const res = await patientApi.requestAll({
                patientId,
                specialization: form.specialization,
                startDate: form.startDate,
                endDate: form.endDate,
                symptoms: form.symptoms,
            });
            onSuccess(`Request created in ${form.specialization}. A doctor from this department can now accept it.`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card border border-white/10 w-full max-w-lg relative p-8"
            >
                <button onClick={onClose} className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-poppins font-bold text-white mb-8 flex items-center gap-3">
                    <Stethoscope className="w-6 h-6 text-cyan-400" /> Book Appointment
                </h2>

                {error && (
                    <div className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold">
                        <AlertCircle className="w-5 h-5 shrink-0" />{error}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Specialization *</label>
                        <div className="relative">
                            <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            <select
                                required
                                value={form.specialization}
                                onChange={e => setForm(p => ({ ...p, specialization: e.target.value }))}
                                className="w-full bg-black/40 border border-white/5 focus:border-cyan-500/50 outline-none rounded-xl py-4 pl-10 pr-4 text-white text-sm appearance-none"
                            >
                                <option value="">Select department…</option>
                                {SPECIALIZATIONS.map(s => <option key={s} value={s} className="bg-[#0f1117]">{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Start Date *</label>
                            <input type="date" required value={form.startDate}
                                onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                                className="w-full bg-black/40 border border-white/5 focus:border-cyan-500/50 outline-none rounded-xl py-4 px-4 text-white text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">End Date *</label>
                            <input type="date" required value={form.endDate}
                                onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                                className="w-full bg-black/40 border border-white/5 focus:border-cyan-500/50 outline-none rounded-xl py-4 px-4 text-white text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Symptoms (optional)</label>
                        <div className="flex flex-wrap gap-2">
                            {SYMPTOMS_LIST.map(s => (
                                <button key={s} type="button" onClick={() => toggle(s)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${form.symptoms.includes(s) ? 'bg-cyan-500 border-cyan-400 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-cyan-500 hover:text-white'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-60 glow-cyan"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Booking Request'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════
   PATIENT DASHBOARD
════════════════════════════════════════════════════════════ */
export const PatientDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [upcoming, setUpcoming] = useState([]);
    const [past, setPast] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [showBooking, setShowBooking] = useState(false);
    const [toast, setToast] = useState(null);

    const patientId = user?.id;

    /* ── Fetch appointments ──────────────────────────────── */
    const fetchData = async () => {
        if (!patientId) { setLoadingData(false); return; }
        setLoadingData(true);
        try {
            const [up, past_] = await Promise.all([
                patientApi.getUpcoming(patientId),
                patientApi.getPast(patientId),
            ]);
            setUpcoming(Array.isArray(up) ? up : []);
            setPast(Array.isArray(past_) ? past_ : []);
        } catch (err) {
            console.error('Failed to fetch appointments:', err);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => { fetchData(); }, [patientId]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleBookingSuccess = (msg) => {
        setShowBooking(false);
        setToast({ msg, type: 'success' });
        fetchData(); // refresh
        setTimeout(() => setToast(null), 4000);
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    return (
        <div className="min-h-screen bg-[#0a0c10] flex">

            {/* ── Sidebar ──────────────────────────────────────── */}
            <aside className="w-72 glass border-r border-white/5 fixed top-0 bottom-0 left-0 p-6 flex flex-col gap-8 z-20">
                <Link to="/" className="flex items-center gap-2 px-2">
                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-poppins font-bold text-white tracking-tight">MediFlow</span>
                </Link>

                <nav className="flex flex-col gap-1 flex-grow">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
                    <SidebarItem icon={MessageSquare} label="Submit Query" to="/query" />
                    <SidebarItem icon={Calendar} label="Appointments" to="/appointments" />
                    {/* <SidebarItem icon={User} label="My Queries" to="/queries" /> */}
                    <SidebarItem icon={Settings} label="Settings" to="/settings" />
                </nav>

                {/* User info */}
                {user && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {user?.id?.slice(0, 2)?.toUpperCase() || 'P'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-white font-bold text-sm truncate">{user?.role === 'patient' ? 'Patient' : 'Doctor'}</p>
                            <p className="text-slate-500 text-xs truncate">ID: {user?.id?.slice(-6)}</p>
                        </div>
                    </div>
                )}

                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-semibold text-sm">Logout</span>
                </button>
            </aside>

            {/* ── Main Content ─────────────────────────────────── */}
            <main className="flex-grow ml-72 p-10">

                {/* Toast */}
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl border text-sm font-bold shadow-2xl ${toast.type === 'success' ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' : 'bg-red-500/10 border-red-500/40 text-red-400'}`}
                        >
                            <CheckCircle2 className="w-5 h-5 shrink-0" />{toast.msg}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-poppins font-bold text-white tracking-tight">Patient Dashboard</h1>
                        <p className="text-slate-400 mt-2">
                            {user ? `Logged in as ${user.role} · ID …${user.id?.slice(-6)}` : 'Welcome to MediFlow'}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowBooking(true)}
                        className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all glow-cyan shadow-xl shadow-cyan-500/20"
                    >
                        <Plus className="w-5 h-5" /> Book Appointment
                    </button>
                </header>

                {/* ── Stats ──────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard label="Upcoming Appointments" value={upcoming.length} icon={Calendar} color="cyan" loading={loadingData} />
                    <StatCard label="Past Appointments" value={past.length} icon={TrendingUp} color="teal" loading={loadingData} />
                    <StatCard label="Total Appointments" value={upcoming.length + past.length} icon={Activity} color="cyan" loading={loadingData} />
                </div>

                {/* ── Upcoming Appointments ────────────────────── */}
                <section className="glass-card p-0 overflow-hidden border border-white/5 mb-8">
                    <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white font-poppins">Upcoming Appointments</h2>
                        <button onClick={() => setShowBooking(true)} className="text-cyan-400 text-sm font-bold flex items-center gap-1 hover:text-cyan-300">
                            <Plus className="w-4 h-4" /> Book New
                        </button>
                    </div>
                    <div className="p-6">
                        {loadingData ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse"></div>)}
                            </div>
                        ) : upcoming.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                <p className="font-semibold">No upcoming appointments</p>
                                <button onClick={() => setShowBooking(true)} className="mt-4 text-cyan-400 text-sm font-bold hover:underline">Book one now →</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcoming.map((appt, i) => (
                                    <motion.div
                                        key={appt._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl bg-teal-500/5 border border-teal-500/20 hover:border-teal-500/40 transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 blur-3xl group-hover:bg-teal-500/10 transition-all pointer-events-none"></div>

                                        {/* Doctor avatar */}
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shrink-0">
                                            <Stethoscope className="w-7 h-7 text-white" />
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h4 className="text-white font-bold font-poppins">
                                                    {appt.doctorId?.fullName || 'Doctor Name'}
                                                </h4>
                                                <StatusBadge status={appt.status} />
                                            </div>
                                            <p className="text-slate-400 text-sm font-medium">{appt.specialization}</p>
                                            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-xs text-slate-500 font-medium">
                                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-teal-400" /> {formatDate(appt.startDate)} — {formatDate(appt.endDate)}</span>
                                                {appt.symptoms?.length > 0 && (
                                                    <span className="text-cyan-400">Symptoms: {appt.symptoms.slice(0, 3).join(', ')}{appt.symptoms.length > 3 ? '…' : ''}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-xs font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1 shrink-0">
                                            <Clock className="w-3.5 h-3.5" /> Confirmed
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ── Past Appointments ────────────────────────── */}
                <section className="glass-card p-0 overflow-hidden border border-white/5">
                    <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white font-poppins">Past Appointments</h2>
                        <Link to="/queries" className="text-slate-400 text-sm font-bold flex items-center gap-1 hover:text-cyan-400">
                            View Queries <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="p-6">
                        {loadingData ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse"></div>)}
                            </div>
                        ) : past.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                <p className="font-semibold">No past appointments yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {past.map((appt, i) => (
                                    <div key={appt._id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                                        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10">
                                            <Calendar className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="text-white font-bold text-sm truncate">
                                                {appt.doctorId?.fullName || 'Doctor'} — {appt.specialization}
                                            </h4>
                                            <p className="text-slate-500 text-xs mt-0.5">{formatDate(appt.startDate)} → {formatDate(appt.endDate)}</p>
                                        </div>
                                        <StatusBadge status={appt.status} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Quick Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                    <Link to="/query" className="glass-card flex items-center gap-4 hover:border-cyan-500/40 border border-white/5 group transition-all">
                        <div className="p-4 bg-cyan-500/10 rounded-2xl group-hover:bg-cyan-500/20">
                            <MessageSquare className="w-7 h-7 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">Submit Medical Query</h3>
                            <p className="text-slate-500 text-xs mt-1">Describe symptoms for AI pre-triage</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 ml-auto" />
                    </Link>

                    <Link to="/queries" className="glass-card flex items-center gap-4 hover:border-teal-500/40 border border-white/5 group transition-all">
                        <div className="p-4 bg-teal-500/10 rounded-2xl group-hover:bg-teal-500/20">
                            <TrendingUp className="w-7 h-7 text-teal-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">My Query History</h3>
                            <p className="text-slate-500 text-xs mt-1">Track all submitted queries & doctor replies</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-teal-400 ml-auto" />
                    </Link>
                </div>
            </main>

            {/* ── Booking Modal ─────────────────────────────── */}
            <AnimatePresence>
                {showBooking && (
                    <BookingModal
                        patientId={patientId}
                        onClose={() => setShowBooking(false)}
                        onSuccess={handleBookingSuccess}
                    />
                )}
            </AnimatePresence>

            {/* Background decor */}
            <div className="fixed top-0 right-0 w-1/2 h-full pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full"></div>
            </div>
        </div>
    );
};
