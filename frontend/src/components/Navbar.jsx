import React from 'react';
import { ShieldCheck, BookOpen, Search, Info, HelpCircle } from 'lucide-react';

export default function Navbar({ activeSection, setActiveSection, onOpenAiModal, onOpenVerifyModal }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 border-b border-slate-800 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Course Info */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection('inspect')}>
            <div className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm sm:text-base text-white tracking-tight">TLS Inspector</span>
                <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">
                  PBL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Cryptography &amp; Network Security
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveSection('inspect')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                activeSection === 'inspect'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Inspect Certificate</span>
            </button>

            <button
              onClick={() => setActiveSection('learn')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                activeSection === 'learn'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>How TLS Works</span>
            </button>
          </nav>

          {/* Action Modals */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenVerifyModal}
              title="Manual Verification Guide"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Verify</span>
            </button>

            <button
              onClick={onOpenAiModal}
              title="AI Usage Disclosure"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">AI Disclosure</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
