import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="h-20 w-20 rounded-2xl bg-spider-500/10 border border-spider-500/30 flex items-center justify-center text-spider-500 shadow-[0_0_30px_rgba(255,42,95,0.25)]">
        <AlertOctagon className="h-10 w-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="font-heading font-black text-4xl text-white">
          404 - Grid Sector Unreachable
        </h1>
        <p className="text-sm text-slate-400">
          The requested coordinate or sector is outside monitored grid coverage.
        </p>
      </div>

      <Link to="/">
        <Button variant="primary" size="md">
          <Home className="h-4 w-4 mr-2" />
          Return to Command Center
        </Button>
      </Link>
    </div>
  );
};
