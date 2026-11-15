import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans selection:bg-emerald-500 selection:text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0B192C',
            color: '#fff',
            borderRadius: '16px',
            fontSize: '13px',
            padding: '12px 18px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
