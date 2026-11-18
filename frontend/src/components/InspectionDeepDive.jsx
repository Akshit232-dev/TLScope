import React from 'react';
import { Terminal, Shield, CheckCircle2, Cpu, Globe, Key } from 'lucide-react';

export default function InspectionDeepDive() {
  const steps = [
    {
      phase: "Phase 1",
      title: "TCP Socket Connection",
      code: "socket.create_connection((domain, 443), timeout=5)",
      explanation: "Establishes a raw, reliable TCP transport connection to port 443 on the target public server.",
    },
    {
      phase: "Phase 2",
      title: "TLS Context & SNI Injection",
      code: "context.wrap_socket(sock, server_hostname=domain)",
      explanation: "Applies the TLS state machine. Transmits Server Name Indication (SNI) in ClientHello so modern CDNs/multi-tenant servers return the correct domain certificate.",
    },
    {
      phase: "Phase 3",
      title: "X.509 Certificate Extraction",
      code: "ssock.getpeercert(binary_form=True)",
      explanation: "Retrieves the server's public cryptographic credential in binary DER format (RFC 5280 specification) directly from the completed handshake.",
    },
    {
      phase: "Phase 4",
      title: "Three-Point Verification",
      code: "x509.load_der_x509_certificate(cert_der)",
      explanation: "Parses ASN.1 structures to verify: (1) System CA signature chain, (2) notBefore / notAfter validity timestamps, and (3) Subject Alternative Name (SAN) matching.",
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="border-b border-slate-800 pb-3">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Technical Deep-Dive</span>
        <h3 className="text-base font-semibold text-slate-100">How Certificate Inspection Works Under the Hood</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          The exact 4-phase cryptographic sequence executed by our Python backend during an inspection.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {steps.map((s, idx) => (
          <div key={idx} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-blue-400 font-semibold">{s.phase}</span>
                <span className="text-[10px] text-slate-500 font-mono">Step 0{idx + 1}</span>
              </div>
              <h4 className="text-xs font-semibold text-slate-200 mb-1">{s.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{s.explanation}</p>
            </div>
            <code className="text-[10px] font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800/80 block break-all">
              {s.code}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}
