import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    User,
    Calendar,
    AlertTriangle,
    FileText,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Stethoscope,
    Activity
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { queryApi } from '../api/query';

const symptomsList = [
    'Chest Pain', 'Breathing Issues', 'Fever', 'Headache',
    'Vomiting', 'Cough', 'Dizziness', 'Muscle Fatigue',
    'Skin Rash', 'Loss of Appetite', 'Joint Pain', 'Sore Throat'
];

export const QueryForm = () => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'male',
        symptoms: [],
        severity: 'mild',
        duration: '1 day',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const toggleSymptom = (s) => {
        setFormData(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(s)
                ? prev.symptoms.filter(item => item !== s)
                : [...prev.symptoms, s]
        }));
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.id) {
            setError('You must be logged in as a patient to submit a query.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            await queryApi.create({
                name: formData.name,
                age: formData.age,
                gender: formData.gender,
                symptoms: formData.symptoms,
                severity: formData.severity,
                duration: formData.duration,
                notes: formData.notes,
            });
            setStep(4);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#0a0c10] overflow-hidden">
            <Navbar />

            {/* Background Orbs */}
            <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[150px] rounded-full -z-10"></div>
            <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-teal-500/5 blur-[150px] rounded-full -z-10"></div>

            <div className="container mx-auto px-6 max-w-4xl">
                <div className="flex flex-col items-center gap-4 text-center mb-16">
                    <div className="p-4 bg-cyan-500 rounded-2xl glow-cyan animate-pulse">
                        <Stethoscope className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-poppins font-bold text-white tracking-tight">AI Medical Query</h1>
                    <p className="text-slate-400 max-w-lg mt-2 font-medium">Provide detailed symptoms and medical context for our AI triage engine to analyze.</p>
                </div>

                {/* Progress Stepper */}
                <div className="flex items-center justify-between mb-12 relative px-4">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -translate-y-1/2 -z-10"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-500 ${step >= s ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg glow-cyan scale-110' : 'bg-black/40 border-white/5 text-slate-600'}`}>
                            {s < step ? <CheckCircle2 className="w-6 h-6" /> : s}
                        </div>
                    ))}
                </div>

                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-10 border border-white/5 relative z-10 min-h-[500px] flex flex-col"
                >
                    <AnimatePresence mode="wait">
                        {error && (
                            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col gap-8">
                                <h3 className="text-2xl font-bold text-white font-poppins flex items-center gap-3">
                                    <User className="text-cyan-400" /> Basic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-black/40 border border-white/5 focus:border-cyan-500/50 outline-none rounded-xl p-4 text-white transition-all placeholder:text-slate-700 font-medium"
                                            placeholder="Enter patient name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Age</label>
                                        <input
                                            type="number"
                                            className="w-full bg-black/40 border border-white/5 focus:border-cyan-500/50 outline-none rounded-xl p-4 text-white transition-all placeholder:text-slate-700 font-medium"
                                            placeholder="Years"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Gender</label>
                                        <div className="flex gap-4">
                                            {['male', 'female', 'other'].map(g => (
                                                <button key={g} onClick={() => setFormData({ ...formData, gender: g })} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${formData.gender === g ? 'bg-cyan-500 text-white shadow-lg glow-cyan border-cyan-400' : 'bg-black/20 border border-white/5 text-slate-500 hover:text-white'}`}>
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={nextStep} className="mt-auto px-8 py-4 bg-cyan-500 rounded-xl text-white font-bold ml-auto flex items-center gap-3 group glow-cyan hover:scale-105 transition-all shadow-xl shadow-cyan-500/10">
                                    Next Step
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col gap-10">
                                <h3 className="text-2xl font-bold text-white font-poppins flex items-center gap-3">
                                    <Activity className="text-teal-400" /> Symptoms & Severity
                                </h3>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Select Symptoms</label>
                                    <div className="flex flex-wrap gap-2">
                                        {symptomsList.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => toggleSymptom(s)}
                                                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${formData.symptoms.includes(s) ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg glow-cyan scale-105' : 'bg-white/5 border-white/10 text-slate-400 hover:border-cyan-500 hover:text-white'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-amber-500" /> Severity Level
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['mild', 'moderate', 'severe'].map(v => (
                                                <button key={v} onClick={() => setFormData({ ...formData, severity: v })} className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${formData.severity === v ? 'bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-500/20' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                                                    {v}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-cyan-400" /> Duration
                                        </label>
                                        <select
                                            className="w-full bg-black/40 border border-white/5 focus:border-cyan-500/50 outline-none rounded-xl p-4 text-white transition-all font-medium appearance-none"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        >
                                            <option>Few hours</option>
                                            <option>1 day</option>
                                            <option>3 days</option>
                                            <option>More than a week</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <button onClick={prevStep} className="px-6 py-4 flex items-center gap-2 text-slate-500 font-bold hover:text-white transition-all group">
                                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                        Back
                                    </button>
                                    <button onClick={nextStep} className="px-8 py-4 bg-teal-500 rounded-xl text-white font-bold flex items-center gap-3 group shadow-xl shadow-teal-500/10 hover:scale-105 transition-all">
                                        Final Review
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col gap-10">
                                <h3 className="text-2xl font-bold text-white font-poppins flex items-center gap-3">
                                    <FileText className="text-cyan-400" /> Final Review & Notes
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Patient Details</p>
                                        <p className="text-white font-bold">{formData.name || 'N/A'} • {formData.age || 'N/A'} yrs • {formData.gender}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Symptoms</p>
                                        <p className="text-cyan-400 font-bold text-xs">{formData.symptoms.join(', ') || 'None selected'}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Additional Notes</label>
                                    <textarea
                                        className="w-full bg-black/40 border border-white/5 focus:border-cyan-500/50 outline-none rounded-xl p-6 text-white transition-all placeholder:text-slate-700 font-medium min-h-[150px] resize-none"
                                        placeholder="Provide any other details like past medical history, allergies, or recent travel..."
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <button onClick={prevStep} className="px-6 py-4 flex items-center gap-2 text-slate-500 font-bold hover:text-white transition-all group">
                                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                        Back
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="px-10 py-4 bg-cyan-500 rounded-xl text-white font-bold flex items-center gap-3 group glow-cyan shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all disabled:opacity-60"
                                    >
                                        {submitting ? 'Submitting…' : 'Submit Medical Query'}
                                        {!submitting && <CheckCircle2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-grow flex flex-col items-center justify-center text-center gap-8 py-10">
                                <div className="w-24 h-24 bg-cyan-500 rounded-full flex items-center justify-center glow-cyan shadow-2xl relative">
                                    <CheckCircle2 className="w-12 h-12 text-white" />
                                    <div className="absolute top-0 left-0 w-full h-full rounded-full ring-8 ring-cyan-500/20 scale-125 animate-pulse"></div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-poppins font-bold text-white tracking-tight">Query Submitted!</h2>
                                    <p className="text-slate-400 font-medium max-w-sm mx-auto">Your medical query has been sent to our doctors for review. You'll receive a notification within 2-4 hours.</p>
                                </div>
                                <div className="flex gap-4">
                                    <Link to="/dashboard" className="px-8 py-4 glass rounded-xl text-white font-bold hover:bg-white/10 transition-all border border-white/10">Go to Dashboard</Link>
                                    <Link to="/appointments" className="px-8 py-4 bg-cyan-500 rounded-xl text-white font-bold glow-cyan hover:scale-105 transition-all">Book Appointment</Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};
