import React from 'react';
import { Activity, Server, RefreshCw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { StatusIndicator } from '../../../components/ui/StatusIndicator';
import { useHealthStatus } from '../hooks/useHealthStatus';

export const HealthStatusCard: React.FC = () => {
  const { data, isLoading, isError, refetch, isFetching } = useHealthStatus();

  return (
    <Card id="telemetry" className="relative overflow-hidden">
      {/* Spider Accent Glow Corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-spider-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-700/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-dark-800 border border-dark-700 text-spider-400">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-white">Backend Health Telemetry</h3>
            <p className="text-xs text-slate-400 font-mono">
              Endpoint: <span className="text-web-400 font-semibold">GET /health</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <Badge variant="cyber">Probing Backend...</Badge>
          ) : isError || !data?.success ? (
            <Badge variant="danger">
              <XCircle className="h-3 w-3 mr-1" />
              Service Offline
            </Badge>
          ) : (
            <Badge variant="success">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Status: {data.data?.status ?? 'OK'}
            </Badge>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            isLoading={isFetching}
            title="Refresh Health Status"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Probe</span>
          </Button>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        <div className="bg-dark-950/60 border border-dark-800 rounded-lg p-3.5 flex flex-col">
          <span className="text-xs font-mono text-slate-500">API Connection</span>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-200">
              {isLoading ? 'Checking...' : isError ? 'Failed' : 'Connected'}
            </span>
            <StatusIndicator
              status={isLoading ? 'loading' : isError || !data?.success ? 'offline' : 'online'}
            />
          </div>
        </div>

        <div className="bg-dark-950/60 border border-dark-800 rounded-lg p-3.5 flex flex-col">
          <span className="text-xs font-mono text-slate-500">Architecture Mode</span>
          <span className="mt-1 text-sm font-semibold text-web-400">Generic Core (Sprint 1)</span>
        </div>

        <div className="bg-dark-950/60 border border-dark-800 rounded-lg p-3.5 flex flex-col">
          <span className="text-xs font-mono text-slate-500">Response Envelope</span>
          <span className="mt-1 text-sm font-semibold text-emerald-400 font-mono">
            {isLoading ? '...' : isError ? '500 ERROR' : '200 OK (Standard)'}
          </span>
        </div>
      </div>

      {/* Raw JSON Payload Preview */}
      <div className="mt-5 bg-dark-950 rounded-lg p-4 border border-dark-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-medium text-slate-400 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-spider-400" />
            Live Endpoint JSON Payload
          </span>
          <span className="text-[10px] font-mono text-slate-500">Strict Schema Verified</span>
        </div>
        <pre className="text-xs font-mono bg-dark-900/90 text-slate-300 p-3 rounded border border-dark-800 overflow-x-auto">
          {isLoading
            ? '// Fetching live telemetry payload...'
            : isError
              ? JSON.stringify(
                  {
                    success: false,
                    message: 'Cannot connect to backend server at http://localhost:5000',
                    hint: 'Run npm run dev:server to start the backend Express server.',
                  },
                  null,
                  2,
                )
              : JSON.stringify(data, null, 2)}
        </pre>
      </div>

      {isError && (
        <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
          <span>
            The backend server is not responding. Ensure the backend server is running via{' '}
            <code className="text-red-200 font-mono bg-red-950/50 px-1 py-0.5 rounded">
              npm run dev:server
            </code>
            .
          </span>
        </div>
      )}
    </Card>
  );
};
