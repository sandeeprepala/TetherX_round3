import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquare, Clock, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

const queries = [
    {
        id: 'Q-8492',
        date: 'Oct 12, 2024',
        symptoms: 'Fever, Cough, Muscle Fatigue',
        severity: 'Moderate',
        status: 'Responded',
        doctorNotes: 'Please hydrate well. Based on your symptoms, I have prescribed paracetamol and a cough syrup. If symptoms persist for more than 3 days, please book an appointment.',
    },
    {
        id: 'Q-8114',
        date: 'Sep 05, 2024',
        symptoms: 'Chest Pain, Dizziness',
        severity: 'Severe',
        status: 'Under Review',
        doctorNotes: null,
    },
    {
        id: 'Q-7921',
        date: 'Aug 24, 2024',
        symptoms: 'Headache',
        severity: 'Mild',
        status: 'Responded',
        doctorNotes: 'Looks like a tension headache. Rest your eyes from screens and ensure adequate sleep.',
    }
];

export const QueriesPage = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#0a0c10] overflow-hidden">
            <Navbar />

            {/* Background Decor */}
            <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-cyan-500/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-4xl">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link to="/dashboard" className="p-2 glass rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-4xl font-poppins font-bold text-white tracking-tight">My Queries</h1>
                        </div>
                        <p className="text-slate-400 mt-2 font-medium ml-12">Track your past medical consultations and doctor responses.</p>
                    </div>

                    <Link to="/query" className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-xl glow-cyan hover:scale-105 transition-transform flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> New Query
                    </Link>
                </div>

                <div className="space-y-6">
                    {queries.map((q, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={q.id}
                            className="glass-card p-8 border border-white/5 relative overflow-hidden group hover:border-cyan-500/30"
                        >
                            {/* Status Glow */}
                            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-20 -z-10 transition-colors ${q.status === 'Responded' ? 'bg-cyan-500' : 'bg-amber-500'}`}></div>

                            <div className="flex items-start justify-between mb-8">
                                <div className="flex gap-4">
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl glow-cyan hidden sm:block h-fit">
                                        <MessageSquare className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-bold text-white">{q.symptoms}</h3>
                                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${q.severity === 'Severe' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : q.severity === 'Moderate' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'}`}>
                                                {q.severity}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-500">{q.id} • Submitted on {q.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {q.status === 'Responded' ? (
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

                            {q.doctorNotes ? (
                                <div className="p-5 rounded-xl bg-black/40 border-l-2 border-cyan-500 relative">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        Doctor's Note
                                    </p>
                                    <p className="text-slate-300 text-sm leading-relaxed">{q.doctorNotes}</p>
                                </div>
                            ) : (
                                <div className="pt-6 border-t border-white/5 text-center">
                                    <p className="text-slate-500 text-sm">A specialist is currently reviewing your symptoms. Please wait for a response.</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
