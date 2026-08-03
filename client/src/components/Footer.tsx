import React from 'react';
import { Terminal, Shield, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-dark-800 bg-dark-950/90 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <Shield className="h-4 w-4 text-spider-500" />
          <span>Spidey Tracker Architecture © 2026. Production Monorepo Foundation.</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
            <Terminal className="h-3.5 w-3.5 text-spider-400" />
            <span>MERN Stack (Sprint 1)</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
            <Globe className="h-3.5 w-3.5 text-web-400" />
            <span>Generic Tracking Core</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
