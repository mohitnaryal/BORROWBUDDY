import React from 'react';
import { Link } from 'react-router-dom';
import { Repeat, ShieldCheck, Heart, MapPin, Mail, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Repeat className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Borrow<span className="text-emerald-400">Buddy</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Borrow More. Buy Less. A trusted community platform connecting people nearby
              to discover, borrow, and lend occasionally used items safely with verifiable
              Borrowing Passports.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-2 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Verifiable Item Provenance & Community Trust Engine</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/explore" className="hover:text-emerald-400 transition-colors">
                  All Items
                </Link>
              </li>
              <li>
                <Link to="/explore?priceType=free" className="hover:text-emerald-400 transition-colors">
                  Free Community Items
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Tools" className="hover:text-emerald-400 transition-colors">
                  Tools & DIY
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Electronics" className="hover:text-emerald-400 transition-colors">
                  Electronics & Projectors
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Travel+%26+Camping" className="hover:text-emerald-400 transition-colors">
                  Tents & Camping Gear
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Locations */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
              Active Hubs
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Phagwara (LPU Area)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Jalandhar (Model Town)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Ludhiana (Sarabha Nagar)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Kangra (Dharamshala Rd)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Chandigarh (PU / Sec 17)</span>
              </li>
            </ul>
          </div>

          {/* Trust & Community */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
              Community & Safety
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                  How Borrowing Works
                </a>
              </li>
              <li>
                <span className="text-slate-400">Borrowing Passport System</span>
              </li>
              <li>
                <span className="text-slate-400">Two-Way Ratings</span>
              </li>
              <li>
                <span className="text-slate-400">Deposit Protections</span>
              </li>
              <li className="pt-2">
                <span className="text-xs text-slate-500">Contact: support@borrowbuddy.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BorrowBuddy. All rights reserved. Built for community circular economies.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for campus & local neighborhoods
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
