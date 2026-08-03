import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-slate-100 selection:bg-spider-500 selection:text-white">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
