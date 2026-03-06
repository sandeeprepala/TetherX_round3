import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquare, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { queryApi } from '../api/query';

const severityBadge = (severity) => {
    if (severity === 'Severe') {
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
    }
    if (severity === 'Moderate') {
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    }
    return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
};

const statusGlow = (status) =>
    status === 'Responded' ? 'bg-cyan-500' : 'bg-amber-500';

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export const QueriesPage = () => {
    const { user } = useAuth();
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [replyDrafts, setReplyDrafts] = useState({});

    const isDoctor = user?.role === 'doctor';

    useEffect(() => {
        let cancelled = false;

        const fetchQueries = async () => {
            if (!user?.id) { if (!cancelled) setLoading(false); return; }
            if (!cancelled) {
                setLoading(true);
                setError('');
            }
            try {
                const data = isDoctor
                    ? await queryApi.listForDoctor()
                    : await queryApi.listForPatient();
                if (!cancelled) {
                    setQueries(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        // Initial load
        fetchQueries();

        // Poll every 10 seconds for near-realtime updates
        const interval = setInterval(fetchQueries, 10000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [user, isDoctor]);

    const handleReplyChange = (id, text) => {
        setReplyDrafts(prev => ({ ...prev, [id]: text }));
    };

    const handleSendReply = async (id) => {
        const text = (replyDrafts[id] || '').trim();
        if (!text) return;
        try {
            const updated = await queryApi.reply(id, { text });
            setReplyDrafts(prev => ({ ...prev, [id]: '' }));
            setQueries(prev => {
                const idx = prev.findIndex(q => q._id === updated._id);
                if (idx === -1) return [updated, ...prev];
                const copy = [...prev];
                copy[idx] = updated;
                return copy;
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const title = isDoctor ? 'Patient Queries' : 'My Queries';
    const subtitle = isDoctor
        ? 'Review and respond to patient medical questions in realtime.'
        : 'Track your past medical consultations and doctor responses.';

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#0a0c10] overflow-hidden">
            <Navbar />

            {/* Background Decor */}
            <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-cyan-500/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link to="/dashboard" className="p-2 glass rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-4xl font-poppins font-bold text-white tracking-tight">{title}</h1>
                        </div>
                        <p className="text-slate-400 mt-2 font-medium ml-12">{subtitle}</p>
                    </div>

                    {!isDoctor && (
                        <Link to="/query" className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-xl glow-cyan hover:scale-105 transition-transform flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> New Query
                        </Link>
                    )}
                </div>

                {error && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : queries.length === 0 ? (
                    <div className="glass-card p-10 border border-white/5 text-center">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <MessageSquare className="w-7 h-7 text-cyan-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">
                            {isDoctor ? 'No queries yet' : 'No queries submitted yet'}
                        </h2>
                        <p className="text-slate-400 text-sm max-w-md mx-auto">
                            {isDoctor
                                ? 'You will see new patient queries here as soon as they are submitted.'
                                : 'Submit a new medical query to get started.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {queries.map((q, idx) => {
                            const idShort = q._id?.slice(-4) || '----';
                            const displayId = `Q-${idShort.toUpperCase()}`;
                            const dateStr = formatDate(q.createdAt);
                            const symptoms = Array.isArray(q.symptoms) ? q.symptoms.join(', ') : '';
                            const lastDoctorMsg = (q.messages || [])
                                .filter(m => m.senderRole === 'doctor')
                                .slice(-1)[0]?.text;
                            const status = q.status || (lastDoctorMsg ? 'Responded' : 'Under Review');

                            const patientName = q.patientSnapshot?.name || q.patientId?.fullName;

                            return (
                                <motion.div
                                    key={q._id || idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="glass-card p-8 border border-white/5 relative overflow-hidden group hover:border-cyan-500/30"
                                >
                                    {/* Status Glow */}
                                    <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-20 -z-10 transition-colors ${statusGlow(status)}`}></div>

                                    <div className="flex items-start justify-between mb-6 gap-4">
                                        <div className="flex gap-4">
                                            <div className="p-3 bg-white/5 border border-white/10 rounded-xl glow-cyan hidden sm:block h-fit">
                                                <MessageSquare className="w-6 h-6 text-cyan-400" />
                                            </div>
                                            <div>
                                                {isDoctor && (
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                                                        {patientName || 'Patient'} • {q.patientSnapshot?.age || 'N/A'} yrs • {q.patientSnapshot?.gender || 'N/A'}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                    <h3 className="text-xl font-bold text-white">
                                                        {symptoms || 'General Query'}
                                                    </h3>
                                                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${severityBadge(q.severity)}`}>
                                                        {q.severity || 'Mild'}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-slate-500">
                                                    {displayId} • Submitted on {dateStr}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {status === 'Responded' ? (
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest">
                                                    <CheckCircle2 className="w-4 h-4" /> Responded
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                                                    <Clock className="w-4 h-4" /> Under Review
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {q.notes && (
                                        <div className="p-5 rounded-xl bg-black/30 border border-white/10 mb-4">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                                Patient Description
                                            </p>
                                            <p className="text-slate-300 text-sm leading-relaxed">{q.notes}</p>
                                        </div>
                                    )}

                                    {lastDoctorMsg ? (
                                        <div className="p-5 rounded-xl bg-black/40 border-l-2 border-cyan-500 relative mb-4">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                                Doctor&apos;s Note
                                            </p>
                                            <p className="text-slate-300 text-sm leading-relaxed">{lastDoctorMsg}</p>
                                        </div>
                                    ) : (
                                        !isDoctor && (
                                            <div className="pt-4 border-t border-white/5 text-center mb-2">
                                                <p className="text-slate-500 text-sm">
                                                    A specialist is currently reviewing your symptoms. Please wait for a response.
                                                </p>
                                            </div>
                                        )
                                    )}

                                    {isDoctor && (
                                        <div className="mt-4 pt-4 border-t border-white/5">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                                Reply to patient
                                            </p>
                                            <div className="flex flex-col md:flex-row gap-3">
                                                <textarea
                                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500/50 outline-none resize-none min-h-[60px]"
                                                    placeholder="Type your response..."
                                                    value={replyDrafts[q._id] || ''}
                                                    onChange={(e) => handleReplyChange(q._id, e.target.value)}
                                                />
                                                <button
                                                    onClick={() => handleSendReply(q._id)}
                                                    className="px-5 py-3 bg-cyan-500 text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform self-start"
                                                >
                                                    Send Reply
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
