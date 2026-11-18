import React from 'react';
import { Monitor, ArrowRight, Code2, Cpu, Globe, FileCode2, Eye } from 'lucide-react';

export default function ArchitectureDiagram() {
  const steps = [
    { title: "React Frontend", desc: "User inputs domain; dispatches REST call", icon: Monitor },
    { title: "REST API", desc: "GET /api/inspect?domain={host}", icon: Code2 },
    { title: "FastAPI Backend", desc: "Sanitizes input & executes inspector logic", icon: Cpu },
    { title: "Python SSL + Socket", desc: "Creates raw TCP socket & wraps with TLS context", icon: Code2 },
    { title: "Website (:443)", desc: "Remote server returns X.509 certificate", icon: Globe },
    { title: "Verification Engine", desc: "Checks trust, expiration & hostname matching", icon: FileCode2 },
    { title: "JSON Response", desc: "Returns structured diagnostics payload", icon: Code2 },
    { title: "Report View", desc: "Displays verification status & certificate data", icon: Eye },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="border-b border-slate-800 pb-3">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Diagram 4</span>
        <h3 className="text-base font-semibold text-slate-100">Project Architecture &amp; Data Pipeline</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          End-to-end data pipeline connecting the React user interface to low-level Python socket networking.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((s, index) => {
          const Icon = s.icon;
          return (
            <div key={index} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded bg-slate-900 text-slate-400 border border-slate-850">
                    <Icon className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 font-bold">0{index + 1}</span>
                </div>
                <h5 className="font-semibold text-slate-200 text-xs">{s.title}</h5>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
