import React from 'react';
import { Link } from 'react-router-dom';
import { Repeat, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
        <Repeat className="w-8 h-8 text-emerald-500" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 tracking-tight">
        404 — Page Not Found
      </h1>
      <p className="text-slate-500 text-sm max-w-sm">
        The community page or item you are looking for has been moved or does not exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-emerald-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to BorrowBuddy Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
