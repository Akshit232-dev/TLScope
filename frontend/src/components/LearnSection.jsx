import React, { useState } from 'react';
import HttpsFlowDiagram from './HttpsFlowDiagram';
import HandshakeDiagram from './HandshakeDiagram';
import TrustChainDiagram from './TrustChainDiagram';
import ArchitectureDiagram from './ArchitectureDiagram';
import InspectionDeepDive from './InspectionDeepDive';
import VivaFaq from './VivaFaq';
import { CheckCircle2, Cpu, ArrowUpRight, Filter } from 'lucide-react';

const TOPICS = [
  { id: 'all', label: 'All Modules' },
  { id: 'flow', label: '1. HTTPS Flow' },
  { id: 'handshake', label: '2. TLS Handshake' },
  { id: 'trust', label: '3. Trust Hierarchy' },
  { id: 'architecture', label: '4. Data Pipeline' },
  { id: 'deepdive', label: '5. Inspection Mechanism' },
  { id: 'viva', label: '6. Viva Q&A' },
];

export default function LearnSection({ onOpenAiModal, onOpenVerifyModal, onSwitchToInspect }) {
  const [activeTopic, setActiveTopic] = useState('all');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Intro Header & Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="border-b border-slate-800 pb-3 mb-4">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Section A &bull; Theoretical Foundation &amp; Inspection Concepts
          </span>
          <h2 className="text-xl font-bold text-white mt-1">
            How HTTPS &amp; TLS Work
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Concise cryptographic models, handshake message sequences, and X.509 trust hierarchy designed for your Cryptography &amp; Network Security laboratory presentation.
          </p>
        </div>

        {/* Quick Topic Filter */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px]">Filter by topic:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTopic(t.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  activeTopic === t.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={onSwitchToInspect}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 font-medium text-xs border border-slate-700 transition"
          >
            Switch to Live Inspector &rarr;
          </button>
          <button
            onClick={onOpenVerifyModal}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition"
          >
            Manual Verification Guide
          </button>
          <button
            onClick={onOpenAiModal}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition"
          >
            AI Assistance Disclosure
          </button>
        </div>
      </div>

      {/* Diagram 1: HTTPS Communication Flow */}
      {(activeTopic === 'all' || activeTopic === 'flow') && (
        <HttpsFlowDiagram />
      )}

      {/* Diagram 2: Handshake Diagram */}
      {(activeTopic === 'all' || activeTopic === 'handshake') && (
        <HandshakeDiagram />
      )}

      {/* Diagram 3: Certificate Trust Chain */}
      {(activeTopic === 'all' || activeTopic === 'trust') && (
        <TrustChainDiagram />
      )}

      {/* Diagram 4: Project Architecture */}
      {(activeTopic === 'all' || activeTopic === 'architecture') && (
        <ArchitectureDiagram />
      )}

      {/* Technical Deep Dive: Exact Python Inspection Sequence */}
      {(activeTopic === 'all' || activeTopic === 'deepdive') && (
        <InspectionDeepDive />
      )}

      {/* Viva & Exam Review FAQ Accordion */}
      {(activeTopic === 'all' || activeTopic === 'viva') && (
        <VivaFaq />
      )}

      {/* Verification & AI Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Verification Summary Card */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Independent Verification (Section 14)</span>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Every inspection result can be verified independently against browser security viewers:
            </p>
            <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
              <li>Compare Issuer (Organization &amp; CN)</li>
              <li>Verify Not Before &amp; Not After timestamps</li>
              <li>Confirm Subject Alternative Names (SANs)</li>
              <li>Confirm root CA acceptance in operating system</li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={onOpenVerifyModal}
              className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
            >
              <span>Read 6-Step Verification Procedure</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* AI Usage Disclosure Card */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs mb-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>AI Usage &amp; Verification (Section 13)</span>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Academic disclosure: AI assisted with boilerplate structure, component layout, and diagram explanations.
            </p>
            <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
              <li>Executed independently on Python 3.12.2</li>
              <li>Handshake and socket operations run locally on port 443</li>
              <li>Verified manually against browser certificate viewers</li>
              <li>All code understood and explained by students</li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={onOpenAiModal}
              className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
            >
              <span>Read Academic AI Disclosure</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
