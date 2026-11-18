import React from 'react';
import { Award, Layers, ShieldCheck, CheckSquare, ArrowDown } from 'lucide-react';

export default function TrustChainDiagram() {
  const chainNodes = [
    {
      level: "Root CA",
      title: "Root Certificate Authority",
      desc: "Pre-installed in the browser / operating system trusted root store. Self-signed anchor for all trust verification.",
      icon: Award,
    },
    {
      level: "Intermediate CA",
      title: "Intermediate Certificate Authority",
      desc: "Signed directly by the Root CA. Issues leaf certificates to minimize exposure of the root private key.",
      icon: Layers,
    },
    {
      level: "Website Cert",
      title: "Website Certificate (Leaf)",
      desc: "Issued to a specific domain (e.g., google.com). Contains public key, Subject Common Name, validity dates, and SANs.",
      icon: ShieldCheck,
    },
    {
      level: "Verification",
      title: "Browser Trust Verification",
      desc: "Client verifies cryptographic signatures upwards from leaf to root, confirming authentic issuance.",
      icon: CheckSquare,
    }
  ];

  const concepts = [
    {
      title: "Certificate Authority (CA)",
      explanation: "A trusted entity (such as Let's Encrypt or Google Trust Services) that validates domain ownership and signs certificates."
    },
    {
      title: "Website Certificate",
      explanation: "A digital credential binding an encryption public key to a specific domain name using X.509 format specifications."
    },
    {
      title: "Certificate Validity",
      explanation: "Bounded lifespan between 'Not Before' and 'Not After' dates; certificates outside this window are rejected as invalid."
    },
    {
      title: "Hostname Verification",
      explanation: "Asserts that the queried domain strictly matches the Subject Common Name or Subject Alternative Names recorded in the certificate."
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
      <div className="border-b border-slate-800 pb-3">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Diagram 3</span>
        <h3 className="text-base font-semibold text-slate-100">Certificate Trust Hierarchy</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          How trust propagates hierarchically from trusted root stores down to individual website certificates.
        </p>
      </div>

      {/* Visual Chain */}
      <div className="max-w-lg mx-auto space-y-2">
        {chainNodes.map((node, index) => {
          const Icon = node.icon;
          const isLast = index === chainNodes.length - 1;
          return (
            <React.Fragment key={node.level}>
              <div className={`p-3.5 rounded-lg border bg-slate-950 flex items-start gap-3 ${
                isLast ? 'border-emerald-800/80' : 'border-slate-800'
              }`}>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-blue-400 flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-semibold text-xs text-slate-200">{node.title}</h5>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {node.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{node.desc}</p>
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

      {/* Key Concepts (1-2 sentences each) */}
      <div className="pt-4 border-t border-slate-800">
        <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Core Cryptographic Concepts
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {concepts.map((c, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <h6 className="font-semibold text-slate-200 text-xs mb-1">
                {c.title}
              </h6>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {c.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
