import React, { useState } from 'react';
import Navbar from './components/Navbar';
import InspectSection from './components/InspectSection';
import LearnSection from './components/LearnSection';
import AiUsageModal from './components/AiUsageModal';
import VerificationModal from './components/VerificationModal';
import { Shield } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('inspect'); // 'inspect' | 'learn'
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenAiModal={() => setAiModalOpen(true)}
        onOpenVerifyModal={() => setVerifyModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeSection === 'inspect' ? (
          <InspectSection />
        ) : (
          <LearnSection
            onOpenAiModal={() => setAiModalOpen(true)}
            onOpenVerifyModal={() => setVerifyModalOpen(true)}
            onSwitchToInspect={() => setActiveSection('inspect')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-slate-300">
              HTTPS/TLS Certificate Inspector
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-400">Cryptography &amp; Network Security PBL</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <button
              onClick={() => setVerifyModalOpen(true)}
              className="hover:text-slate-200 transition"
            >
              Manual Verification
            </button>
            <span className="text-slate-700">&bull;</span>
            <button
              onClick={() => setAiModalOpen(true)}
              className="hover:text-slate-200 transition"
            >
              AI Disclosure
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AiUsageModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />
      <VerificationModal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
      />
    </div>
  );
}
