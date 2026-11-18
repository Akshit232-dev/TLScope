import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, RefreshCw, CheckCircle2, Shield } from 'lucide-react';
import { inspectDomain } from '../services/api';
import CertificateReport from './CertificateReport';

const SAMPLE_DOMAINS = [
  'google.com',
  'github.com',
  'cloudflare.com',
  'wikipedia.org',
  'python.org'
];

export default function InspectSection() {
  const [domainInput, setDomainInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleInspect = async (targetDomain) => {
    const domainToTest = targetDomain || domainInput;
    if (!domainToTest || !domainToTest.trim()) {
      setError({
        type: 'invalid_domain',
        message: 'Please enter a target domain or hostname (e.g., google.com)'
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await inspectDomain(domainToTest.trim());
      setReport(data);
      setDomainInput(data.domain || domainToTest.trim());
    } catch (err) {
      setReport(null);
      setError({
        type: err.errorType || 'unknown_error',
        message: err.message || 'Unable to inspect certificate. Please verify network access and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInspect();
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
    setDomainInput('');
  };

  return (
    <div className="space-y-6">
      {/* Inspection Form Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span>TLS Certificate Inspector</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter any public hostname to initiate a real-time TLS handshake on port 443 and verify its X.509 certificate.
              </p>
            </div>
            <span className="hidden sm:inline-block font-mono text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
              TCP :443
            </span>
          </div>
        </div>

        {/* Input & Action Button: Strictly Separated */}
        <div className="space-y-3">
          <label htmlFor="domain-input" className="block text-xs font-medium text-slate-300">
            Target Domain or Hostname
          </label>

          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Input Container */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs font-mono">
                https://
              </span>
              <input
                id="domain-input"
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="example.com"
                disabled={loading}
                autoComplete="off"
                spellCheck="false"
                className="w-full pl-20 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-60"
              />
            </div>

            {/* Distinct Button Outside the Input Box */}
            <button
              type="button"
              onClick={() => handleInspect()}
              disabled={loading || !domainInput.trim()}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-800 disabled:cursor-not-allowed text-white font-medium text-sm flex items-center justify-center gap-2 border border-blue-500/30 transition-all shadow-sm flex-shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Inspect Certificate</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Preset Domains */}
          <div className="flex items-center flex-wrap gap-1.5 pt-1 text-xs">
            <span className="text-slate-400 text-[11px] mr-1">Presets:</span>
            {SAMPLE_DOMAINS.map((domain) => (
              <button
                key={domain}
                type="button"
                onClick={() => {
                  setDomainInput(domain);
                  handleInspect(domain);
                }}
                disabled={loading}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-[11px] border border-slate-700/60 transition"
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State Indicator */}
      {loading && (
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-3 max-w-md mx-auto">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400 mx-auto" />
          <div>
            <h3 className="text-sm font-medium text-slate-200">Executing TLS Handshake</h3>
            <p className="text-xs text-slate-400 mt-1">
              Opening TCP socket to port 443 &bull; Exchanging cryptographic hello &bull; Parsing X.509 leaf certificate
            </p>
          </div>
        </div>
      )}

      {/* Error Alert Box */}
      {error && !loading && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs sm:text-sm">
            <h4 className="font-semibold text-red-300">Inspection Error</h4>
            <p className="mt-0.5 text-red-200/90">{error.message}</p>
            <p className="mt-1 font-mono text-[11px] text-red-400/80">Code: {error.type}</p>
          </div>
        </div>
      )}

      {/* Certificate Report Display */}
      {report && !loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              Report generated for {report.domain}:443
            </span>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear &amp; Inspect Another</span>
            </button>
          </div>
          <CertificateReport report={report} />
        </div>
      )}
    </div>
  );
}
