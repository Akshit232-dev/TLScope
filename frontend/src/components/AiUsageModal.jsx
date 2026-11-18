import React from 'react';
import { X, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AiUsageModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Assistance &amp; Verification Disclosure</h3>
              <p className="text-xs text-slate-400">PBL Academic Transparency Requirement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-5 text-sm text-slate-300">
          <div>
            <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              1. AI Was Used To Assist With:
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
              <li>Project structure and scaffolding (FastAPI + React Vite architecture)</li>
              <li>Python socket and TLS connection code generation</li>
              <li>Cybersecurity-themed UI design and responsive component layout</li>
              <li>Educational TLS handshake and certificate chain explanations</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              2. Student Verification &amp; Ownership:
            </h4>
            <div className="space-y-2 bg-emerald-950/20 border border-emerald-500/20 p-3.5 rounded-lg text-slate-300">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Executed the application independently on a local machine.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Compared certificate information directly against browser certificate details (Chrome &amp; Firefox).</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Verified issuer names, serial numbers, and validity dates match real-world observations.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Tested multiple live public domains (e.g. google.com, github.com, cloudflare.com).</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Thoroughly reviewed, tested, and understood every line of backend and frontend code for viva presentation.</span>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Academic Integrity Notice:</strong> AI was used as an engineering assistant. All live inspection results are obtained via real Python socket/TLS connections to port 443, and verified independently by students. AI does not verify or fabricate results.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium border border-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
