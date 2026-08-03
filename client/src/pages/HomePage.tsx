import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Radio, Layers, Cpu, Boxes, Zap, Globe2, CheckCircle } from 'lucide-react';
import { HealthStatusCard } from '../features/health/components/HealthStatusCard';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export const HomePage: React.FC = () => {
  const whiteLabelTargets = [
    { title: 'SignalScout', desc: 'Generic signal & entity telemetry', icon: Radio },
    {
      title: 'Disaster Tracker',
      desc: 'Civil protection & incident hazard zones',
      icon: ShieldAlert,
    },
    { title: 'Wildlife Tracker', desc: 'Geospatial fauna observation logs', icon: Globe2 },
    { title: 'Lost Pet Tracker', desc: 'Community sighting network', icon: Boxes },
    { title: 'Emergency Response', desc: 'First-responder dispatch coordinates', icon: Zap },
  ];

  const architecturePillars = [
    {
      title: 'Decoupled Core',
      desc: 'Zero Spider-Man logic in the backend. 100% reusable across any tracking domain.',
      icon: Layers,
    },
    {
      title: 'Strict Type Safety',
      desc: 'Full-stack TypeScript with strict compiler options and zero any usage.',
      icon: Cpu,
    },
    {
      title: 'Clean Architecture',
      desc: 'Layered separation: Controllers -> Services -> Repositories -> Models.',
      icon: Boxes,
    },
    {
      title: 'Real-Time Telemetry',
      desc: 'Socket.IO bidirectional event bus ready for live sighting broadcasts.',
      icon: Radio,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden glass-card p-8 md:p-12 border border-dark-700/80 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-spider-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-web-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="primary" size="md">
              <span className="flex h-2 w-2 rounded-full bg-spider-500 animate-ping-slow mr-1" />
              Sprint 1 Active
            </Badge>
            <Badge variant="cyber" size="md">
              Project Foundation Ready
            </Badge>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none">
            Real-Time Sighting & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-spider-400 via-spider-500 to-web-400">
              Incident Telemetry Network
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            A production-grade, highly scalable incident tracking monorepo. Built with a strictly
            domain-agnostic backend engine powering an immersive, cyberpunk-inspired Spider-Man
            sighting dashboard.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-dark-950/80 px-3.5 py-2 rounded-lg border border-dark-800">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>Full-Stack Monorepo Initialized</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-dark-950/80 px-3.5 py-2 rounded-lg border border-dark-800">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>TypeScript Strict Mode Verified</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Live Health & Telemetry Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <HealthStatusCard />
      </motion.section>

      {/* Backend White-Label Domain Compatibility */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-heading font-bold text-2xl text-white">
              Domain-Agnostic Backend Core
            </h2>
            <p className="text-sm text-slate-400">
              The backend architecture is completely decoupled and ready to power multiple tracking
              verticals.
            </p>
          </div>
          <Badge variant="secondary">Modular Architecture</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {whiteLabelTargets.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="p-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-spider-500/10 border border-spider-500/20 flex items-center justify-center text-spider-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-heading font-semibold text-sm text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-snug">{item.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </motion.section>

      {/* Architectural Pillars */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        <div>
          <h2 className="font-heading font-bold text-2xl text-white">
            Engineering Quality Pillars
          </h2>
          <p className="text-sm text-slate-400">
            Adheres to Tier-1 engineering standards (Stripe / GitHub / Linear benchmark).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {architecturePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card key={idx} className="p-5 flex flex-col justify-between space-y-3">
                <div className="h-10 w-10 rounded-lg bg-web-500/10 border border-web-500/20 flex items-center justify-center text-web-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-base text-white">{pillar.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
};
