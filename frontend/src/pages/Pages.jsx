import React from 'react';

const DummyPage = ({ title }) => (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-20">
        <div className="glass-card text-center p-20">
            <h1 className="text-4xl font-poppins font-bold text-white mb-6 uppercase tracking-wider">{title}</h1>
            <p className="text-slate-400">This module is under development to meet premium MediFlow standards. Stay tuned for the future of healthcare.</p>
        </div>
    </div>
);

export const LoginPage = () => <DummyPage title="Login" />;
export const SignupPage = () => <DummyPage title="Signup" />;
export const DashboardPage = () => <DummyPage title="Patient Dashboard" />;
export const QueryPage = () => <DummyPage title="Medical Query Submission" />;
export const AppointmentsPage = () => <DummyPage title="Appointment Booking" />;
export const ProfilePage = () => <DummyPage title="Patient Profile" />; 
