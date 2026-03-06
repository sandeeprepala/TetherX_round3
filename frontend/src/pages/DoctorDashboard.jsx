import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Calendar, User, Settings, LogOut,
    Activity, Check, Clock, AlertCircle, Loader2,
    ChevronRight, X, CalendarRange, Stethoscope,
    UserCheck, ClipboardList, Bell, TrendingUp,
    CheckCircle2, XCircle, Shield
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorApi } from '../api/doctor';

/* ─── Sidebar Nav Item ──────────────────────────────────── */
const SidebarItem = ({ icon: Icon, label, active, onClick, badge }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group text-left ${active ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
    >
        <Icon className="w-5 h-5 transition-transform group-hover:scale-110 shrink-0" />
        <span className="font-semibold text-sm flex-grow">{label}</span>
        {badge > 0 && (
            <span className="w-5 h-5 bg-amber-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white shrink-0">
                {badge > 9 ? '9+' : badge}
            </span>
        )}
    </button>
);

/* ─── Status Badge ──────────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const map = {
        pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        accepted: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
        completed: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${map[status] || map.pending}`}>
            {status}
        </span>
    );
};

/* ─── Stat Card ─────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, color, loading }) => (
    <div className="glass-card flex items-center justify-between group hover:border-teal-500/30 border border-white/5 transition-all">
        <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{label}</p>
            {loading
                ? <div className="h-8 w-12 bg-white/10 rounded-lg animate-pulse" />
                : <h3 className="text-3xl font-poppins font-bold text-white">{value}</h3>
            }
        </div>
        <div className={`p-4 rounded-2xl bg-${color}-500/10 group-hover:scale-110 transition-transform shrink-0`}>
            <Icon className={`w-8 h-8 text-${color}-400`} />
        </div>
    </div>
);

/* ─── Set Availability Modal ────────────────────────────── */
const AvailabilityModal = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState({ startDate: '', endDate: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        if (!form.startDate || !form.endDate) { setError('Both dates are required.'); return; }
        if (new Date(form.endDate) <= new Date(form.startDate)) {
            setError('End date must be after start date.'); return;
        }
        setLoading(true); setError('');
        try {
            await doctorApi.setAvailability({ startDate: form.startDate, endDate: form.endDate });
            onSuccess('Availability updated successfully!');
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
                className="glass-card border border-white/10 w-full max-w-md p-8 relative"
            >
                <button onClick={onClose} className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-poppins font-bold text-white mb-2 flex items-center gap-3">
                    <CalendarRange className="w-6 h-6 text-teal-400" /> Set Availability
                </h2>
                <p className="text-slate-500 text-sm mb-8">Define the date range during which patients can book appointments with you.</p>

                {error && (
                    <div className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold">
                        <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available From *</label>
                        <input
                            type="date" required value={form.startDate}
                            onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                            className="w-full bg-black/40 border border-white/5 focus:border-teal-500/50 outline-none rounded-xl py-4 px-4 text-white text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Until *</label>
                        <input
                            type="date" required value={form.endDate}
                            onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                            className="w-full bg-black/40 border border-white/5 focus:border-teal-500/50 outline-none rounded-xl py-4 px-4 text-white text-sm"
                        />
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-60"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (<><CalendarRange className="w-5 h-5" /> Save Availability</>)}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

/* ─── Appointment Card (Upcoming / Pending) ─────────────── */
const AppointmentCard = ({ appt, onAccept, accepting, isUpcoming }) => {
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
    const patient = appt.patientId;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 rounded-2xl border transition-all group relative overflow-hidden ${isUpcoming ? 'bg-teal-500/5 border-teal-500/20 hover:border-teal-500/40' : 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'}`}
        >
            {/* Glow orb */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-20 pointer-events-none ${isUpcoming ? 'bg-teal-500' : 'bg-amber-500'}`}></div>

            {/* Patient Avatar */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-bold text-xl text-white ${isUpcoming ? 'bg-gradient-to-br from-teal-500 to-cyan-500' : 'bg-gradient-to-br from-amber-500 to-orange-500'}`}>
                {patient?.fullName?.[0]?.toUpperCase() || 'P'}
            </div>

            {/* Info */}
            <div className="flex-grow min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="text-white font-bold font-poppins">
                        {patient?.fullName || `Patient #${String(appt.patientId).slice(-6)}`}
                    </h4>
                    <StatusBadge status={appt.status} />
                </div>
                <p className="text-slate-400 text-sm">{appt.specialization}</p>

                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-400" />
                        {formatDate(appt.startDate)} — {formatDate(appt.endDate)}
                    </span>
                    {patient?.age && <span>Age: {patient.age}</span>}
                    {patient?.gender && <span>{patient.gender}</span>}
                </div>

                {appt.symptoms?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {appt.symptoms.map(s => (
                            <span key={s} className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-slate-400 font-medium">{s}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* Action */}
            {!isUpcoming && (
                <button
                    onClick={() => onAccept(appt._id)}
                    disabled={accepting === appt._id}
                    className="flex items-center gap-2 px-5 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-400 hover:scale-105 transition-all shrink-0 disabled:opacity-60"
                >
                    {accepting === appt._id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <><Check className="w-4 h-4" /> Accept</>
                    }
                </button>
            )}
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════════════════
   DOCTOR DASHBOARD — Main Component
════════════════════════════════════════════════════════════ */
export const DoctorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const doctorId = user?.id;

    /* ── State ─────────────────────────────────────────────── */
    const [activeTab, setActiveTab] = useState('overview');
    const [upcoming, setUpcoming] = useState([]);       // accepted appointments
    const [pending, setPending] = useState([]);         // pending requests
    const [loadingData, setLoadingData] = useState(true);
    const [accepting, setAccepting] = useState(null);   // appointmentId being accepted
    const [showAvail, setShowAvail] = useState(false);
    const [toast, setToast] = useState(null);

    /* ── Fetch upcoming + pending appointments ─────────────── */
    const fetchData = async () => {
        if (!doctorId) { setLoadingData(false); return; }
        setLoadingData(true);
        try {
            const [up, pend] = await Promise.all([
                doctorApi.getUpcoming(doctorId),
                doctorApi.getPending(doctorId),
            ]);
            setUpcoming(Array.isArray(up) ? up : []);
            setPending(Array.isArray(pend) ? pend : []);
        } catch (err) {
            console.error('Failed to load doctor data:', err);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => { fetchData(); }, [doctorId]);

    /* ── Accept an appointment ─────────────────────────────── */
    const handleAccept = async (apptId) => {
        setAccepting(apptId);
        try {
            const res = await doctorApi.acceptAppointment(apptId);
            if (res?.msg) {
                showToast(res.msg, 'error');           // backend returned a conflict msg
            } else {
                showToast('Appointment accepted!', 'success');
                fetchData();
            }
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setAccepting(null);
        }
    };

    /* ── Helpers ────────────────────────────────────────────── */
    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    /* ── Derived stats ──────────────────────────────────────── */
    const todayStr = new Date().toDateString();
    const todayAppts = upcoming.filter(a => new Date(a.startDate).toDateString() === todayStr);
    const thisWeek = upcoming.filter(a => {
        const d = new Date(a.startDate);
        const now = new Date();
        const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
        return d >= now && d <= weekEnd;
    });

    /* ─────────────────────────────────────────────────────────
       RENDER
    ─────────────────────────────────────────────────────────── */
    return (
        <div className="min-h-screen bg-[#0a0c10] flex">

            {/* ── Sidebar ────────────────────────────────────────── */}
            <aside className="w-72 glass border-r border-white/5 fixed top-0 bottom-0 left-0 p-6 flex flex-col gap-8 z-20">
                <Link to="/" className="flex items-center gap-2 px-2">
                    <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-poppins font-bold text-white tracking-tight">MediFlow</span>
                </Link>

                <nav className="flex flex-col gap-1 flex-grow">
                    <SidebarItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <SidebarItem icon={ClipboardList} label="Pending Requests" active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} badge={pending.length} />
                    <SidebarItem icon={Calendar} label="Upcoming" active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')} />
                    <SidebarItem icon={CalendarRange} label="Set Availability" active={false} onClick={() => setShowAvail(true)} />
                    <SidebarItem icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                </nav>

                {/* Doctor Info */}
                {user && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
                            <Stethoscope className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-white font-bold text-sm truncate">Doctor</p>
                            <p className="text-slate-500 text-xs truncate">ID: …{user.id?.slice(-6)}</p>
                        </div>
                    </div>
                )}

                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-semibold text-sm">Logout</span>
                </button>
            </aside>

            {/* ── Main Content ──────────────────────────────────── */}
            <main className="flex-grow ml-72 p-10 relative">

                {/* Toast */}
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl border text-sm font-bold shadow-2xl ${toast.type === 'success' ? 'bg-teal-500/10 border-teal-500/40 text-teal-400' : 'bg-red-500/10 border-red-500/40 text-red-400'}`}
                        >
                            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                            {toast.msg}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                            <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse"></span>
                            Doctor Portal
                        </div>
                        <h1 className="text-4xl font-poppins font-bold text-white tracking-tight">Doctor Dashboard</h1>
                        <p className="text-slate-400 mt-2">
                            {user ? `Logged in · ID …${user.id?.slice(-6)}` : 'Welcome to MediFlow'}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setShowAvail(true)}
                            className="px-5 py-3 glass border border-teal-500/30 text-teal-400 rounded-xl font-bold flex items-center gap-2 hover:bg-teal-500/10 transition-all"
                        >
                            <CalendarRange className="w-5 h-5" /> Set Availability
                        </button>
                        <button
                            onClick={fetchData}
                            className="px-5 py-3 bg-teal-500 text-white rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-teal-500/20"
                        >
                            <Bell className="w-5 h-5" /> Refresh
                        </button>
                    </div>
                </header>

                {/* ══ OVERVIEW TAB ════════════════════════════════════════ */}
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                <StatCard label="Total Upcoming" value={upcoming.length} icon={Calendar} color="teal" loading={loadingData} />
                                <StatCard label="Today's Patients" value={todayAppts.length} icon={UserCheck} color="cyan" loading={loadingData} />
                                <StatCard label="This Week" value={thisWeek.length} icon={TrendingUp} color="teal" loading={loadingData} />
                                <StatCard label="Pending Requests" value={pending.length} icon={ClipboardList} color="amber" loading={loadingData} />
                            </div>

                            {/* Today's schedule */}
                            <section className="glass-card p-0 overflow-hidden border border-white/5 mb-8">
                                <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white font-poppins flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-teal-400" /> Today's Schedule
                                    </h2>
                                    <span className="text-teal-400 text-sm font-bold">{todayAppts.length} patient{todayAppts.length !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="p-6">
                                    {loadingData ? (
                                        <div className="space-y-4">{[1, 2].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)}</div>
                                    ) : todayAppts.length === 0 ? (
                                        <div className="text-center py-12 text-slate-500">
                                            <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                            <p className="font-semibold">No appointments scheduled today</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {todayAppts.map((appt, i) => <AppointmentCard key={appt._id} appt={appt} isUpcoming onAccept={handleAccept} accepting={accepting} />)}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Quick shortcuts */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {[
                                    { label: 'View Pending', icon: ClipboardList, color: 'amber', tab: 'pending', desc: 'Review & accept new requests' },
                                    { label: 'All Upcoming', icon: Calendar, color: 'teal', tab: 'upcoming', desc: 'See your confirmed schedule' },
                                    { label: 'Set Availability', icon: CalendarRange, color: 'cyan', tab: null, desc: 'Update your available dates' },
                                ].map(({ label, icon: Icon, color, tab, desc }) => (
                                    <button
                                        key={label}
                                        onClick={() => tab ? setActiveTab(tab) : setShowAvail(true)}
                                        className={`glass-card flex flex-col items-start gap-3 text-left hover:border-${color}-500/40 border border-white/5 group transition-all`}
                                    >
                                        <div className={`p-3 bg-${color}-500/10 rounded-2xl group-hover:bg-${color}-500/20`}>
                                            <Icon className={`w-6 h-6 text-${color}-400`} />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold">{label}</h3>
                                            <p className="text-slate-500 text-xs mt-1">{desc}</p>
                                        </div>
                                        <ChevronRight className={`w-5 h-5 text-slate-600 group-hover:text-${color}-400 transition-colors`} />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ══ UPCOMING TAB ═══════════════════════════════════════ */}
                    {activeTab === 'upcoming' && (
                        <motion.div key="upcoming" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-poppins font-bold text-white">Upcoming Appointments</h2>
                                <span className="px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold">{upcoming.length} accepted</span>
                            </div>

                            {loadingData ? (
                                <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />)}</div>
                            ) : upcoming.length === 0 ? (
                                <div className="text-center py-24 text-slate-500">
                                    <Calendar className="w-16 h-16 mx-auto mb-6 opacity-20" />
                                    <p className="text-xl font-bold text-white mb-2">No upcoming appointments</p>
                                    <p className="text-sm">Go to Pending Requests to accept patient bookings.</p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {upcoming.map((appt, i) => (
                                        <AppointmentCard key={appt._id} appt={appt} isUpcoming onAccept={handleAccept} accepting={accepting} />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ══ PENDING TAB ════════════════════════════════════════ */}
                    {activeTab === 'pending' && (
                        <motion.div key="pending" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-poppins font-bold text-white">Incoming Patient Requests</h2>
                                <div className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
                                    Pending: {pending.length}
                                </div>
                            </div>

                            {loadingData ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            ) : pending.length === 0 ? (
                                <div className="glass-card border border-amber-500/20 p-10 text-center">
                                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                        <Bell className="w-8 h-8 text-amber-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No pending requests</h3>
                                    <p className="text-slate-400 text-sm max-w-md mx-auto">
                                        When patients submit new appointment requests for your specialization, they will appear here for you to review and accept.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {pending.map(appt => (
                                        <AppointmentCard
                                            key={appt._id}
                                            appt={appt}
                                            isUpcoming={false}
                                            onAccept={handleAccept}
                                            accepting={accepting}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ══ PROFILE TAB ════════════════════════════════════════ */}
                    {activeTab === 'profile' && (
                        <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <h2 className="text-2xl font-poppins font-bold text-white mb-8">Doctor Profile</h2>

                            <div className="glass-card border border-white/5 max-w-2xl">
                                {/* Avatar */}
                                <div className="flex items-center gap-6 mb-10 p-2">
                                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-teal-500/20 shrink-0">
                                        <Stethoscope className="w-12 h-12 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-poppins font-bold text-white">Dr. {user?.id?.slice(-4).toUpperCase()}</h3>
                                        <p className="text-teal-400 font-bold text-sm uppercase tracking-widest mt-1">Verified Specialist</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Shield className="w-4 h-4 text-cyan-400" />
                                            <span className="text-slate-500 text-xs font-medium">MediFlow Certified Doctor</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5 pt-6 border-t border-white/5">
                                    {[
                                        { label: 'Doctor ID', value: user?.id },
                                        { label: 'Role', value: 'Doctor' },
                                        { label: 'Total Upcoming', value: `${upcoming.length} appointments` },
                                        { label: 'Today\'s Patients', value: `${todayAppts.length} scheduled` },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                                            <span className="text-slate-500 text-sm font-medium">{label}</span>
                                            <span className="text-white font-bold text-sm font-mono">{value}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <button
                                        onClick={() => setShowAvail(true)}
                                        className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                                    >
                                        <CalendarRange className="w-5 h-5" /> Update Availability
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* ── Availability Modal ─────────────────────────────── */}
            <AnimatePresence>
                {showAvail && (
                    <AvailabilityModal
                        onClose={() => setShowAvail(false)}
                        onSuccess={(msg) => {
                            setShowAvail(false);
                            showToast(msg, 'success');
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Background decor */}
            <div className="fixed top-0 right-0 w-1/2 h-full pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full"></div>
            </div>
        </div>
    );
};
