import React from 'react';
import { motion } from 'framer-motion';
import { MedicalModel } from '../components/MedicalModel';
import { Navbar } from '../components/Navbar';
import {
    ArrowRight, Shield, Clock, Brain, UserPlus, Activity,
    Star, CheckCircle2, MessageSquare, Calendar, ChevronRight,
    Stethoscope, Zap, Lock, HeartPulse, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Reusable Sub-components ─────────────────────────────── */

const FeatureCard = ({ icon: Icon, title, description }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="glass-card flex flex-col items-start gap-4 p-8 group overflow-hidden relative"
    >
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>
        <div className="p-4 bg-cyan-500/10 rounded-2xl group-hover:bg-cyan-500/20 transition-colors">
            <Icon className="w-8 h-8 text-cyan-400" />
        </div>
        <h3 className="text-xl font-bold font-poppins text-white">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
);

const SectionHeader = ({ tag, title, subtitle }) => (
    <div className="flex flex-col gap-4 text-center items-center mb-16">
        <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest">
            {tag}
        </span>
        <h2 className="text-4xl lg:text-5xl font-poppins font-bold text-white tracking-tight">{title}</h2>
        <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
        <p className="text-slate-400 max-w-2xl text-lg mt-2">{subtitle}</p>
    </div>
);

const doctors = [
    {
        name: 'Dr. Sarah Johnson', dept: 'Cardiologist', rating: 4.9, patients: '2.1k',
        img: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c77e?q=80&w=400&auto=format&fit=crop'
    },
    {
        name: 'Dr. Michael Chen', dept: 'Neurologist', rating: 4.8, patients: '1.8k',
        img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop'
    },
    {
        name: 'Dr. Emily Brown', dept: 'Dermatologist', rating: 4.7, patients: '1.4k',
        img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400&auto=format&fit=crop'
    },
    {
        name: 'Dr. David Wilson', dept: 'General Medicine', rating: 4.9, patients: '3.2k',
        img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop'
    },
];

const testimonials = [
    {
        name: 'Anaya Kapoor', role: 'Patient — Mumbai',
        text: 'MediFlow helped me get a cardiologist appointment in under 5 minutes. The AI query feature is brilliant — it almost felt like talking to a real doctor.',
        avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&auto=format&fit=crop',
        rating: 5,
    },
    {
        name: 'Rohan Mehra', role: 'Patient — Delhi',
        text: 'The dashboard design is incredibly intuitive. I could track all my queries and upcoming appointments in one place. Nothing like this existed before.',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
        rating: 5,
    },
    {
        name: 'Dr. Priya Nair', role: 'Cardiologist — Chennai',
        text: 'As a doctor, MediFlow has streamlined my consultation process. The symptom pre-triage saves me valuable time and lets me focus on critical cases.',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop',
        rating: 5,
    },
];

const steps = [
    { step: '01', icon: Search, title: 'Create Your Account', desc: 'Sign up for free in under 60 seconds. No credit card required.' },
    { step: '02', icon: MessageSquare, title: 'Submit a Medical Query', desc: 'Describe your symptoms using our guided AI-assisted query form.' },
    { step: '03', icon: Stethoscope, title: 'Get Doctor Matched', desc: 'Our system instantly connects you with the best specialist for your condition.' },
    { step: '04', icon: Calendar, title: 'Book & Attend', desc: 'Select your preferred time slot and attend your appointment seamlessly.' },
];

/* ─── Main Landing Page ────────────────────────────────────── */

export const LandingPage = () => {
    return (
        <div className="bg-[#0a0c10] overflow-x-hidden">
            <Navbar />

            {/* ── Hero ───────────────────────────────────────── */}
            <section className="pt-32 pb-10 relative">
                <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col gap-6 z-10"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/5 text-cyan-400 text-xs font-bold tracking-widest uppercase w-fit">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            Future of Healthcare
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-poppins font-extrabold text-white leading-[1.1]">
                            Smart Healthcare <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500">
                                Access for Everyone
                            </span>
                        </h1>

                        <p className="text-slate-400 text-xl max-w-xl leading-relaxed">
                            MediFlow lets patients submit medical queries and book doctor appointments instantly — powered by AI triage and 3D-driven visualizations.
                        </p>

                        <div className="flex flex-wrap items-center gap-5 mt-4">
                            <Link to="/query" className="px-8 py-4 bg-cyan-500 rounded-full text-white font-bold glow-cyan hover:scale-105 transition-all flex items-center gap-3 group shadow-xl shadow-cyan-500/20">
                                Submit Medical Query
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/appointments" className="px-8 py-4 glass rounded-full text-white font-bold hover:bg-white/10 transition-all flex items-center gap-3 border border-white/10">
                                Book Appointment
                            </Link>
                        </div>

                        <div className="flex items-center gap-6 mt-4 pt-6 border-t border-white/5">
                            <div className="flex -space-x-3">
                                {doctors.slice(0, 3).map((d, i) => (
                                    <img key={i} src={d.img} alt={d.name} className="w-9 h-9 rounded-full border-2 border-[#0a0c10] object-cover" />
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                                </div>
                                <p className="text-slate-500 text-xs mt-0.5"><span className="text-white font-bold">10,000+</span> certified specialists on the platform</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Spline 3D Model */}
                    <div className="h-[580px] relative">
                        <MedicalModel />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
                    </div>
                </div>
                {/* Hero bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0c10] to-transparent pointer-events-none"></div>
            </section>

            {/* ── Features ───────────────────────────────────── */}
            <section className="py-32 container mx-auto px-6 lg:px-20">
                <SectionHeader
                    tag="Core Features"
                    title="Revolutionizing Patient Care"
                    subtitle="Experience the next generation of healthcare with our deeply integrated medical ecosystem."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard icon={Brain} title="AI Assisted Query" description="Our advanced AI triage identifies symptoms and provides instant suggestions before your consultation." />
                    <FeatureCard icon={Zap} title="Instant Booking" description="Say goodbye to waiting rooms. Book appointments in seconds with top-tier healthcare professionals." />
                    <FeatureCard icon={Lock} title="Secure Medical Data" description="Your records are end-to-end encrypted and accessible only to you and your authorized physicians." />
                    <FeatureCard icon={HeartPulse} title="Smart Suggestions" description="Receive personalized department and doctor recommendations based on your unique health profile." />
                </div>
            </section>

            {/* ── Stats ──────────────────────────────────────── */}
            <section className="border-y border-white/5 bg-black/30 py-20">
                <div className="container mx-auto px-6 lg:px-20">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {[
                            { val: '2.5M+', label: 'Active Patients' },
                            { val: '10k+', label: 'Expert Doctors' },
                            { val: '4.9/5', label: 'User Rating' },
                            { val: '24/7', label: 'AI Support' },
                        ].map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="space-y-2"
                            >
                                <h3 className="text-4xl lg:text-5xl font-poppins font-bold text-white tracking-tight">{s.val}</h3>
                                <p className="text-cyan-400 font-bold text-sm uppercase tracking-widest">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ───────────────────────────────── */}
            <section className="py-32 container mx-auto px-6 lg:px-20">
                <SectionHeader
                    tag="How It Works"
                    title="From Signup to Specialist in Minutes"
                    subtitle="Four simple steps separate you from world-class healthcare. No paperwork, no queues."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* connecting line */}
                    <div className="absolute top-10 left-12 right-12 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent hidden lg:block pointer-events-none"></div>
                    {steps.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="flex flex-col items-center text-center gap-5 p-8 glass-card border border-white/5 group hover:border-cyan-500/30 transition-all"
                        >
                            <div className="relative">
                                <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors border border-cyan-500/20">
                                    <s.icon className="w-9 h-9 text-cyan-400" />
                                </div>
                                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-cyan-500 text-white text-[10px] font-bold flex items-center justify-center glow-cyan">
                                    {s.step}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold font-poppins text-white">{s.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Featured Doctors ───────────────────────────── */}
            <section className="py-32 bg-black/30">
                <div className="container mx-auto px-6 lg:px-20">
                    <SectionHeader
                        tag="Our Specialists"
                        title="Meet the Experts Behind MediFlow"
                        subtitle="Board-certified physicians, each verified and rated by thousands of patients globally."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {doctors.map((doc, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="glass-card p-0 overflow-hidden border border-white/5 group hover:border-cyan-500/30 flex flex-col"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={doc.img}
                                        alt={doc.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/20 to-transparent"></div>
                                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-black/60 rounded-full border border-white/10 backdrop-blur-sm">
                                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                        <span className="text-white text-xs font-bold">{doc.rating}</span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col gap-4 flex-grow">
                                    <div>
                                        <h3 className="text-white font-bold text-lg font-poppins">{doc.name}</h3>
                                        <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mt-1">{doc.dept}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-4 border-t border-white/5 mt-auto">
                                        <span>{doc.patients} patients</span>
                                        <Link to="/appointments" className="flex items-center gap-1 text-cyan-400 font-bold hover:text-white transition-colors group">
                                            Book Now <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/appointments" className="inline-flex items-center gap-2 px-8 py-4 glass border border-white/10 rounded-full text-white font-bold hover:bg-white/10 transition-all">
                            Browse All Specialists <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ───────────────────────────────── */}
            <section className="py-32 container mx-auto px-6 lg:px-20">
                <SectionHeader
                    tag="Patient Stories"
                    title="Trusted by Millions Worldwide"
                    subtitle="Real people, real results. See what our community has to say about MediFlow."
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="glass-card border border-white/5 p-8 flex flex-col gap-6 group hover:border-cyan-500/30 transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-2xl group-hover:bg-cyan-500/10 transition-all pointer-events-none"></div>
                            <div className="flex gap-1">
                                {[...Array(t.rating)].map((_, j) => (
                                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                            <p className="text-slate-300 leading-relaxed text-sm flex-grow">"{t.text}"</p>
                            <div className="flex items-center gap-4 pt-4 border-t border-white/5 mt-auto">
                                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/30" />
                                <div>
                                    <p className="text-white font-bold text-sm">{t.name}</p>
                                    <p className="text-slate-500 text-xs mt-0.5">{t.role}</p>
                                </div>
                                <CheckCircle2 className="w-5 h-5 text-cyan-400 ml-auto shrink-0" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ─────────────────────────────────── */}
            <section className="pb-32 container mx-auto px-6 lg:px-20">
                <div className="glass-card border border-cyan-500/30 p-12 lg:p-20 text-center relative overflow-hidden flex flex-col items-center group rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10 group-hover:opacity-70 transition-opacity duration-700"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                    <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 relative z-10">
                        Get Started Today
                    </span>
                    <h2 className="text-3xl lg:text-5xl font-poppins font-bold text-white tracking-tight mb-6 relative z-10">
                        Ready to step into the future of health?
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mb-10 relative z-10">
                        Join over 2.5 million patients who trust MediFlow for intelligent, fast, and secure healthcare access — completely free to get started.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center relative z-10">
                        <Link to="/signup" className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full text-white font-bold glow-cyan shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all text-lg">
                            Join MediFlow Free
                        </Link>
                        <Link to="/dashboard" className="px-10 py-5 glass border border-white/10 rounded-full text-white font-bold hover:bg-white/10 transition-all text-lg">
                            View Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────── */}
            <footer className="border-t border-white/5 pt-20 pb-10 bg-black/60">
                <div className="container mx-auto px-6 lg:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        {/* Brand */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg glow-cyan">
                                    <Activity className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-poppins font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
                                    MediFlow
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Next-generation medical platform integrating AI triage, 3D visualization, and precise appointment scheduling to streamline patient care globally.
                            </p>
                            <div className="flex items-center gap-3">
                                {['T', 'in', 'Gh'].map((s, i) => (
                                    <a key={i} href="#" className="w-9 h-9 glass border border-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all text-xs font-bold">
                                        {s}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Patients */}
                        <div className="space-y-6">
                            <h4 className="text-white font-bold uppercase tracking-widest text-sm font-poppins">Patients</h4>
                            <ul className="space-y-4">
                                {[
                                    { label: 'Submit Query', to: '/query' },
                                    { label: 'Book a Doctor', to: '/appointments' },
                                    { label: 'My Dashboard', to: '/dashboard' },
                                    { label: 'Pricing', to: '/' },
                                ].map(l => (
                                    <li key={l.label}>
                                        <Link to={l.to} className="text-slate-500 hover:text-cyan-400 transition-colors text-sm font-medium">{l.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Doctors */}
                        <div className="space-y-6">
                            <h4 className="text-white font-bold uppercase tracking-widest text-sm font-poppins">Doctors</h4>
                            <ul className="space-y-4">
                                {['Join Network', 'Clinic Solutions', 'Dashboard Docs', 'API Integrations'].map(l => (
                                    <li key={l}><Link to="/" className="text-slate-500 hover:text-cyan-400 transition-colors text-sm font-medium">{l}</Link></li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div className="space-y-6">
                            <h4 className="text-white font-bold uppercase tracking-widest text-sm font-poppins">Company & Legal</h4>
                            <ul className="space-y-4">
                                {['About Us', 'Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Contact Us'].map(l => (
                                    <li key={l}><Link to="/" className="text-slate-500 hover:text-cyan-400 transition-colors text-sm font-medium">{l}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-slate-600 text-sm">© 2024 MediFlow Technologies Inc. All rights reserved.</p>
                        <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                            All systems operational
                        </div>
                    </div>
                </div>
            </footer>

            {/* ── Background ambient lights ──────────────────── */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-20 overflow-hidden">
                <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/4 blur-[150px] rounded-full animate-float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-teal-500/4 blur-[150px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            </div>
        </div>
    );
};
