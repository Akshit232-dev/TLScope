import React from 'react';
import { Monitor, ArrowDown, Key, Server, FileCheck, ShieldCheck, Lock } from 'lucide-react';

export default function HttpsFlowDiagram() {
  const steps = [
    {
      id: 1,
      title: "User / Browser",
      desc: "Client initiates connection to https://domain.com",
      icon: Monitor,
    },
    {
      id: 2,
      title: "HTTPS Request",
      desc: "Client dispatches HTTPS request targeting port 443",
      icon: Key,
    },
    {
      id: 3,
      title: "TLS Handshake",
      desc: "Initiates cryptographic protocol negotiation",
      icon: ShieldCheck,
    },
    {
      id: 4,
      title: "Website Server",
      desc: "Remote host receives connection and prepares certificate response",
      icon: Server,
    },
    {
      id: 5,
      title: "Certificate Sent to Browser",
      desc: "Server presents its X.509 digital certificate and public key",
      icon: FileCheck,
    },
    {
      id: 6,
      title: "Certificate Verified",
      desc: "Browser checks root CA trust, validity period, and domain name",
      icon: ShieldCheck,
    },
    {
      id: 7,
      title: "Secure Session Established",
      desc: "Symmetric session keys derived; encrypted data transmission begins",
      icon: Lock,
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="border-b border-slate-800 pb-3 mb-5">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Diagram 1</span>
        <h3 className="text-base font-semibold text-slate-100">HTTPS Communication Flow</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Step-by-step connection lifecycle from user request to encrypted application channel.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-2">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          const isLast = index === steps.length - 1;
          return (
            <React.Fragment key={step.id}>
              <div className={`p-3.5 rounded-lg border flex items-center gap-3.5 transition-colors ${
                isLast 
                  ? 'bg-slate-950 border-emerald-800/80' 
                  : 'bg-slate-950 border-slate-800'
              }`}>
                <div className={`p-2 rounded bg-slate-900 border border-slate-800 flex-shrink-0 ${
                  isLast ? 'text-emerald-400' : 'text-blue-400'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      Step {step.id}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-200">{step.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                </div>
              </div>

              {!isLast && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown className="w-3.5 h-3.5 text-slate-600" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
