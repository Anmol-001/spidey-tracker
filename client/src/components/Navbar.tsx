import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Radio, Activity, Compass } from 'lucide-react';
import { Badge } from './ui/Badge';
import { useHealthStatus } from '../features/health/hooks/useHealthStatus';
import { StatusIndicator } from './ui/StatusIndicator';

export const Navbar: React.FC = () => {
  const { data: health, isLoading, isError } = useHealthStatus();

  const getSystemStatus = () => {
    if (isLoading) return { status: 'loading' as const, label: 'Connecting Telemetry...' };
    if (isError || !health?.success) return { status: 'offline' as const, label: 'Grid Offline' };
    return { status: 'online' as const, label: 'Grid Online (v1.0)' };
  };

  const sysStatus = getSystemStatus();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-700/80 bg-dark-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-spider-500/10 border border-spider-500/30 flex items-center justify-center text-spider-500 group-hover:scale-105 group-hover:border-spider-500/60 transition-all duration-300 shadow-[0_0_15px_rgba(255,42,95,0.2)]">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg text-white tracking-wide">
                SPIDEY<span className="text-spider-500">TRACKER</span>
              </span>
              <Badge variant="cyber" size="sm">
                BETA
              </Badge>
            </div>
            <span className="text-[10px] font-mono text-slate-400 -mt-1 tracking-wider uppercase">
              Incident & Sighting Network
            </span>
          </div>
        </Link>

        {/* Navigation Actions & Live Health Telemetry */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 bg-dark-900/90 border border-dark-700/80 rounded-lg px-3 py-1.5">
            <Radio className="h-3.5 w-3.5 text-web-400 animate-pulse" />
            <StatusIndicator status={sysStatus.status} label={sysStatus.label} />
          </div>

          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-dark-800 transition-colors"
            >
              <Activity className="h-3.5 w-3.5 text-spider-400" />
              <span>Dashboard</span>
            </Link>
            <a
              href="#telemetry"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-dark-800 transition-colors"
            >
              <Compass className="h-3.5 w-3.5 text-web-400" />
              <span>Grid Telemetry</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
