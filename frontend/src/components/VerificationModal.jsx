import React from 'react';
import { X, CheckCircle, ExternalLink, ShieldAlert, Globe } from 'lucide-react';

export default function VerificationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Independent Verification Procedure</h3>
              <p className="text-xs text-slate-400">Section 14 — How to Manually Verify Results</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="mt-5 space-y-4 text-sm text-slate-300">
          <p className="text-slate-400 text-xs">
            To satisfy the PBL requirement for independent verification, follow these steps to compare the inspector’s output with your browser:
          </p>

          <div className="space-y-3">
            {[
              {
                step: 1,
                title: "Open the Website in Browser",
                desc: "Open the exact same website (e.g., https://google.com) in Chrome, Firefox, or Safari."
              },
              {
                step: 2,
                title: "Inspect Security Details",
                desc: "Click the lock or tune icon in the browser address bar, click 'Connection is secure', and choose 'Certificate is valid'."
              },
              {
                step: 3,
                title: "Compare Certificate Issuer",
                desc: "Verify that the Organization (O) and Common Name (CN) match the 'Issuer' field shown in this tool (e.g. Google Trust Services / WE2)."
              },
              {
                step: 4,
                title: "Compare Validity Dates",
                desc: "Check the 'Issued On' (Valid From) and 'Expires On' (Valid Until) timestamps. Note that UTC time aligns with browser local time."
              },
              {
                step: 5,
                title: "Compare Subject / Hostname / SANs",
                desc: "Inspect the Subject Common Name and Subject Alternative Names (SAN) extension to verify the domain or wildcard covers the site."
              },
              {
                step: 6,
                title: "Confirm Trust & Root Authority",
                desc: "Confirm that the browser displays a green/secure padlock indicating the Certificate Authority is accepted by the operating system trust store."
              }
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start space-x-3 p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono text-xs flex items-center justify-center font-bold">
                  {step}
                </span>
                <div>
                  <h5 className="font-medium text-white text-sm">{title}</h5>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-lg text-xs text-cyan-300 flex items-center space-x-2">
            <Globe className="w-4 h-4 flex-shrink-0" />
            <span>
              This establishes that our Python backend retrieves identical real-world cryptographic credentials as your standard web browser.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium border border-slate-700 transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
