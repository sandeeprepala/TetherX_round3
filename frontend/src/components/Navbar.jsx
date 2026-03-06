import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, User, LogIn } from 'lucide-react';

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between glass border-b border-white/5 bg-black/40">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-cyan-500 rounded-lg glow-cyan">
                    <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-poppins font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
                    MediFlow
                </span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                <NavLink to="/" className={({ isActive }) => `hover:text-cyan-400 transition-colors ${isActive ? 'text-cyan-400' : ''}`}>
                    Home
                </NavLink>
                <NavLink to="/dashboard" className={({ isActive }) => `hover:text-cyan-400 transition-colors ${isActive ? 'text-cyan-400' : ''}`}>
                    Dashboard
                </NavLink>
                <NavLink to="/appointments" className={({ isActive }) => `hover:text-cyan-400 transition-colors ${isActive ? 'text-cyan-400' : ''}`}>
                    Booking
                </NavLink>
                <NavLink to="/query" className={({ isActive }) => `hover:text-cyan-400 transition-colors ${isActive ? 'text-cyan-400' : ''}`}>
                    Submit Query
                </NavLink>
            </div>

            <div className="flex items-center gap-4">
                <NavLink to="/login" className="px-5 py-2 text-sm font-semibold hover:text-cyan-400 transition-colors">
                    Login
                </NavLink>
                <NavLink
                    to="/signup"
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full text-white text-sm font-bold glow-cyan hover:scale-105 transition-transform"
                >
                    Get Started
                </NavLink>
            </div>
        </nav>
    );
};
