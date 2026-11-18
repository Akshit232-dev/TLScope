import React from 'react';
import { Monitor, Server, ArrowRight, ArrowLeft, ArrowLeftRight, Lock, CheckCircle2 } from 'lucide-react';

export default function HandshakeDiagram() {
  const steps = [
    {
      id: 1,
      sender: "Browser",
      receiver: "Server",
      direction: "right",
      label: "Client Hello",
      description: "Advertises supported TLS versions (TLS 1.3/1.2), supported cipher suites, and SNI extension.",
    },
    {
      id: 2,
      sender: "Server",
      receiver: "Browser",
      direction: "left",
      label: "Server Hello",
      description: "Server selects negotiated TLS version and cipher suite (e.g., TLS_AES_256_GCM_SHA384).",
    },
    {
      id: 3,
      sender: "Server",
      receiver: "Browser",
      direction: "left",
      label: "TLS Certificate Delivery",
      description: "Server delivers its X.509 certificate chain including public key and CA signatures.",
    },
    {
      id: 4,
      sender: "Browser",
      receiver: "Browser",
      direction: "local",
      label: "Browser Verifies Certificate",
      description: "Client validates signature chain to root CA, checks validity period, and verifies hostname match.",
    },
    {
      id: 5,
      sender: "Browser",
      receiver: "Server",
      direction: "bidirectional",
      label: "Secure Session Established",
      description: "ECDHE key exchange completes; symmetric session keys derived on both endpoints.",
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="border-b border-slate-800 pb-3 mb-5">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Diagram 2</span>
        <h3 className="text-base font-semibold text-slate-100">Simplified TLS Handshake</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Key message exchanges during connection negotiation (suitable for 5–7 minute viva presentation).
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Endpoints Bar */}
        <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 p-2.5 rounded bg-slate-950 border border-slate-800">
            <Monitor className="w-4 h-4 text-blue-400" />
            <div>
              <span className="font-semibold text-slate-200 block">Browser / Client</span>
              <span className="text-[10px] text-slate-500 font-mono">Initiator</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 p-2.5 rounded bg-slate-950 border border-slate-800 text-right">
            <div>
              <span className="font-semibold text-slate-200 block">Server (:443)</span>
              <span className="text-[10px] text-slate-500 font-mono">Target Host</span>
            </div>
            <Server className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Handshake Messages */}
        <div className="space-y-2.5">
          {steps.map((item) => {
            if (item.direction === "local") {
              return (
                <div key={item.id} className="p-3 rounded-lg bg-slate-950 border border-emerald-900/60 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-semibold">
                        Step 4 &bull; Client Action
                      </span>
                      <h5 className="font-semibold text-xs text-slate-200">{item.label}</h5>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                  </div>
                </div>
              );
            }

            if (item.direction === "bidirectional") {
              return (
                <div key={item.id} className="p-3 rounded-lg bg-slate-950 border border-blue-900/60 flex items-start gap-3">
                  <ArrowLeftRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 font-semibold">
                        Step 5 &bull; Handshake Complete
                      </span>
                      <h5 className="font-semibold text-xs text-slate-200">{item.label}</h5>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                  </div>
                </div>
              );
            }

            const isRight = item.direction === "right";

            return (
              <div key={item.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="p-1 rounded bg-slate-900 text-slate-400 border border-slate-800 flex-shrink-0 mt-0.5">
                  {isRight ? <ArrowRight className="w-3.5 h-3.5 text-blue-400" /> : <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      Step {item.id} &bull; {isRight ? 'Client &rarr; Server' : 'Server &rarr; Client'}
                    </span>
                    <h5 className="font-semibold text-xs text-slate-200">{item.label}</h5>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Encrypted Data Channel */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-mono text-emerald-400 text-[11px]">
            <Lock className="w-3.5 h-3.5" />
            <span>Browser</span>
          </div>

          <div className="text-center font-mono text-[11px] text-slate-400">
            &larr; Encrypted Application Data (HTTPS) &rarr;
          </div>

          <div className="flex items-center gap-1.5 font-mono text-emerald-400 text-[11px]">
            <span>Server</span>
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
