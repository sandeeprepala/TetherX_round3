import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    MapPin,
    Stethoscope,
    Clock,
    User,
    Search,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    Star
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Link } from 'react-router-dom';

const departments = [
    'Cardiology', 'Neurology', 'Dermatology', 'General Medicine',
    'Pediatrics', 'Orthopedics', 'Psychiatry', 'Dentistry'
];

const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', dept: 'Cardiology', rating: 4.9, reviews: 124, img: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c77e?auto=format&fit=crop&q=80&w=2070' },
    { id: 2, name: 'Dr. Michael Chen', dept: 'Neurology', rating: 4.8, reviews: 98, img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=2070' },
    { id: 3, name: 'Dr. Emily Brown', dept: 'Dermatology', rating: 4.7, reviews: 85, img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=2070' },
    { id: 4, name: 'Dr. David Wilson', dept: 'General Medicine', rating: 4.9, reviews: 156, img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=2070' }
];

const slots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'];

export const AppointmentBooking = () => {
    const [step, setStep] = useState(1);
    const [booking, setBooking] = useState({
        dept: '',
        doctor: null,
        date: '',
        slot: ''
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#0a0c10] overflow-hidden">
            <Navbar />

            {/* Background Microinteractions */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[30%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-teal-500/5 blur-[150px] rounded-full animate-float"></div>
            </div>

            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex flex-col gap-4 mb-16">
                    <h1 className="text-5xl font-poppins font-bold text-white tracking-tight">Book Appointment</h1>
                    <p className="text-slate-400 font-medium max-w-2xl text-lg">Connect with elite medical specialists instantly. Premium healthcare tailored for you.</p>
                </div>

                {/* Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Stepper Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        {[
                            { s: 1, l: 'Select Department', icon: Stethoscope },
                            { s: 2, l: 'Choose Specialist', icon: User },
                            { s: 3, l: 'Schedule Visit', icon: Calendar },
                            { s: 4, l: 'Confirmation', icon: CheckCircle2 }
                        ].map((it) => (
                            <div key={it.s} className={`p-5 rounded-2xl flex items-center gap-4 border transition-all duration-500 ${step === it.s ? 'glass border-cyan-500/50 glow-cyan scale-105 shadow-xl shadow-cyan-500/10' : 'border-white/5 opacity-50'}`}>
                                <div className={`p-3 rounded-xl transition-colors ${step === it.s ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-500'}`}>
                                    <it.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${step === it.s ? 'text-cyan-400' : 'text-slate-600'}`}>Step 0{it.s}</p>
                                    <p className={`text-sm font-bold font-poppins mt-0.5 ${step === it.s ? 'text-white' : 'text-slate-500'}`}>{it.l}</p>
                                </div>
                                {step > it.s && <CheckCircle2 className="w-5 h-5 text-cyan-400 ml-auto" />}
                            </div>
                        ))}
                    </div>

                    {/* Main Booking Panel */}
                    <div className="lg:col-span-3">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-10 min-h-[600px] flex flex-col"
                        >
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col">
                                        <div className="flex items-center justify-between mb-10">
                                            <h2 className="text-3xl font-poppins font-bold text-white tracking-tight">Medical Departments</h2>
                                            <div className="relative group">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400" />
                                                <input type="text" placeholder="Search department..." className="bg-white/5 border border-white/5 rounded-full py-2.5 pl-10 pr-6 text-sm text-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all placeholder:text-slate-600" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                                            {departments.map(d => (
                                                <button
                                                    key={d}
                                                    onClick={() => { setBooking({ ...booking, dept: d }); nextStep(); }}
                                                    className={`p-6 rounded-2xl border bg-black/20 hover:border-cyan-500/50 hover:bg-cyan-500/5 hover:scale-105 transition-all text-left flex flex-col gap-4 group ${booking.dept === d ? 'border-cyan-500 bg-cyan-500/10 glow-cyan' : 'border-white/5'}`}
                                                >
                                                    <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all">
                                                        <Stethoscope className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                                                    </div>
                                                    <p className="font-bold text-white font-poppins tracking-tight mt-1">{d}</p>
                                                    <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-cyan-400 mt-2 transition-colors ml-auto" />
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col gap-10">
                                        <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-widest text-[10px]">
                                            <span className="p-1 px-2 border border-cyan-400/30 bg-cyan-400/10 rounded">{booking.dept}</span> Specialists
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {doctors.filter(dr => dr.dept === booking.dept || booking.dept === 'General Medicine' || true).map(dr => (
                                                <button key={dr.id} onClick={() => { setBooking({ ...booking, doctor: dr }); nextStep(); }} className="flex flex-col p-6 rounded-2xl border border-white/5 bg-white/5 hover:border-cyan-500/50 transition-all text-left group gap-6 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-4">
                                                        <div className="flex items-center gap-1 px-2 py-1 glass border-white/10 rounded text-amber-400 text-[10px] font-bold">
                                                            <Star className="w-3 h-3 fill-amber-400" /> {dr.rating}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-16 h-16 rounded-2xl border border-white/5 overflow-hidden ring-4 ring-cyan-500/0 group-hover:ring-cyan-500/30 transition-all">
                                                            <img src={dr.img} alt={dr.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-bold text-lg font-poppins">{dr.name}</h4>
                                                            <p className="text-slate-500 text-sm font-medium">{dr.dept}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 pt-4 border-t border-white/5 mt-auto">
                                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> MedFlow Clinic, Block A</span>
                                                        <span className="ml-auto flex items-center gap-1 group-hover:text-white transition-colors">Book Profile <ChevronRight className="w-4 h-4" /></span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        <button onClick={prevStep} className="mt-auto px-6 py-4 flex items-center gap-2 text-slate-500 font-bold hover:text-white group w-fit transition-all">
                                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back
                                        </button>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col gap-10">
                                        <h3 className="text-3xl font-bold font-poppins text-white">Select Availability</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-6">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Select Date</label>
                                                <input type="date" className="w-full bg-white/5 border border-white/5 rounded-xl p-5 text-white focus:border-cyan-500 outline-none transition-all appearance-none font-bold" value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value })} />

                                                <p className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 text-sm font-medium flex items-start gap-3">
                                                    <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                                                    Most patients choose early afternoon slots for {booking.doctor?.name}.
                                                </p>
                                            </div>
                                            <div className="space-y-6">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Time Slots</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {slots.map(s => (
                                                        <button key={s} onClick={() => setBooking({ ...booking, slot: s })} className={`py-4 rounded-xl text-xs font-bold transition-all border ${booking.slot === s ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg glow-cyan' : 'bg-white/5 border-white/10 text-slate-500 hover:border-cyan-400 hover:text-white'}`}>
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto pt-10 border-t border-white/5">
                                            <button onClick={prevStep} className="px-6 py-4 flex items-center gap-2 text-slate-500 font-bold hover:text-white group transition-all">
                                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back
                                            </button>
                                            <button
                                                onClick={() => { if (booking.slot && booking.date) nextStep(); }}
                                                className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl text-white font-bold glow-cyan shadow-xl shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
                                            >
                                                Confirm Booking
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-grow flex flex-col items-center justify-center text-center gap-10">
                                        <div className="w-32 h-32 bg-cyan-500 rounded-full flex items-center justify-center relative shadow-2xl glow-cyan">
                                            <CheckCircle2 className="w-16 h-16 text-white" />
                                            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 2, opacity: 0 }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-cyan-500 rounded-full"></motion.div>
                                        </div>

                                        <div className="space-y-4">
                                            <h2 className="text-4xl font-poppins font-bold text-white tracking-tight">Booking Confirmed!</h2>
                                            <div className="glass-card bg-white/5 border border-white/10 p-8 max-w-sm mx-auto text-left flex flex-col gap-4 relative">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden border border-white/10">
                                                        <img src={booking.doctor?.img} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-bold">{booking.doctor?.name}</h4>
                                                        <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest">{booking.doctor?.dept}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Date</span>
                                                        <span className="text-sm font-bold text-slate-100">{booking.date}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1 items-end">
                                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Slot</span>
                                                        <span className="text-sm font-bold text-slate-100">{booking.slot}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-6 mt-4">
                                            <Link to="/dashboard" className="px-8 py-5 glass border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2 group">
                                                Go to Dashboard
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                            <Link to="/" className="px-8 py-5 bg-cyan-500 rounded-2xl text-white font-bold shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all glow-cyan">
                                                Finish
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};
