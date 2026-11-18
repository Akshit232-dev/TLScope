import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Server, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Globe 
} from 'lucide-react';

export default function CertificateReport({ report }) {
  const [copied, setCopied] = useState(false);
  const [showAllSans, setShowAllSans] = useState(false);

  if (!report) return null;

  const { domain, port, connection, certificate, security_checks } = report;
  const scoreReport = report.tls_security_score;
  const scoreTone = !scoreReport ? "slate" : scoreReport.score >= 90 ? "emerald" : scoreReport.score >= 75 ? "blue" : scoreReport.score >= 50 ? "amber" : "red";
  const scoreStyles = {
    emerald: { text: "text-emerald-400", bar: "bg-emerald-500", border: "border-emerald-900/60", panel: "bg-emerald-950/20" },
    blue: { text: "text-blue-400", bar: "bg-blue-500", border: "border-blue-900/60", panel: "bg-blue-950/20" },
    amber: { text: "text-amber-400", bar: "bg-amber-500", border: "border-amber-900/60", panel: "bg-amber-950/20" },
    red: { text: "text-red-400", bar: "bg-red-500", border: "border-red-900/60", panel: "bg-red-950/20" },
    slate: { text: "text-slate-300", bar: "bg-slate-500", border: "border-slate-800", panel: "bg-slate-950/30" },
  };
  const scoreStyle = scoreStyles[scoreTone];

  const handleCopyReport = () => {
    const summary = `TLS Certificate Report for ${domain}:${port}
---------------------------------
Status: ${connection.status}
TLS Security Score: ${scoreReport ? `${scoreReport.score}/100 (${scoreReport.risk_level} risk)` : "Not available"}
TLS Version: ${connection.tls_version}
Cipher Suite: ${connection.cipher_suite}

Certificate Details:
Subject (CN): ${certificate.subject}
Issuer: ${certificate.issuer}
Valid From: ${certificate.valid_from}
Valid Until: ${certificate.valid_until}
Days Remaining: ${certificate.days_remaining}

Security Checks:
- Trust: ${security_checks.certificate_trust.status_text}
- Expiration: ${security_checks.expiration.status_text}
- Hostname: ${security_checks.hostname_verification.status_text}
- TLS Version: ${security_checks.tls_version.status_text}
`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(summary)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
    }
  };

  const sans = certificate.subject_alt_names || [];
  const displaySans = showAllSans ? sans : sans.slice(0, 10);

  return (
    <div className="space-y-5">
      {/* Report Header Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
              <span>REPORT</span>
              <span>/</span>
              <span>PORT {port}</span>
              <span>/</span>
              <span>TLS HANDSHAKE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              <span>{domain}</span>
            </h3>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Connection: {connection.status}
            </span>

            <button
              onClick={handleCopyReport}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
              title="Copy Summary to Clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transparent TLS Security Score */}
      {scoreReport && (
        <section className={`rounded-xl border ${scoreStyle.border} ${scoreStyle.panel} p-5 shadow-sm space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-4 h-4 ${scoreStyle.text}`} />
                <h4 className="text-sm font-semibold text-slate-100">TLS Security Score</h4>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">Beta</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{scoreReport.label} · Grade {scoreReport.grade} · {scoreReport.risk_level} risk</p>
            </div>
            <div className="flex items-end gap-2">
              <span className={`text-4xl font-bold font-mono ${scoreStyle.text}`}>{scoreReport.score}</span>
              <span className="text-sm text-slate-500 mb-1">/ 100</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className={`h-full rounded-full ${scoreStyle.bar} transition-all`} style={{ width: `${scoreReport.score}%` }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {scoreReport.checks.map((item) => (
              <div key={item.name} className="rounded-lg bg-slate-950/60 border border-slate-800 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-200">{item.name}</span>
                  <span className={`text-xs font-mono ${item.passed ? "text-emerald-400" : "text-amber-400"}`}>{item.earned}/{item.maximum}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400 mt-1">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500 border-t border-slate-800 pt-3">
            Scope: {scoreReport.scope} A high TLS score does not prove that a website is legitimate or safe from phishing.
          </p>
        </section>
      )}

      {/* Security Verifications (Section 8: PASS/FAIL checks) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Cryptographic Verifications</span>
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">PBL Security Checks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Check 1: Trust */}
          <div className={`p-3.5 rounded-lg border text-xs ${
            security_checks.certificate_trust.passed 
              ? 'bg-slate-950/60 border-emerald-900/60' 
              : 'bg-red-950/20 border-red-900/60'
          }`}>
            <div className="flex items-start gap-2.5">
              {security_checks.certificate_trust.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] block">
                  1. Certificate Trust
                </span>
                <p className={`font-semibold text-sm mt-0.5 ${
                  security_checks.certificate_trust.passed ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {security_checks.certificate_trust.status_text}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  {security_checks.certificate_trust.message}
                </p>
              </div>
            </div>
          </div>

          {/* Check 2: Expiration */}
          <div className={`p-3.5 rounded-lg border text-xs ${
            security_checks.expiration.passed 
              ? 'bg-slate-950/60 border-emerald-900/60' 
              : 'bg-red-950/20 border-red-900/60'
          }`}>
            <div className="flex items-start gap-2.5">
              {security_checks.expiration.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] block">
                  2. Certificate Validity
                </span>
                <p className={`font-semibold text-sm mt-0.5 ${
                  security_checks.expiration.passed ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {security_checks.expiration.status_text}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  {security_checks.expiration.message}
                </p>
              </div>
            </div>
          </div>

          {/* Check 3: Hostname */}
          <div className={`p-3.5 rounded-lg border text-xs ${
            security_checks.hostname_verification.passed 
              ? 'bg-slate-950/60 border-emerald-900/60' 
              : 'bg-red-950/20 border-red-900/60'
          }`}>
            <div className="flex items-start gap-2.5">
              {security_checks.hostname_verification.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] block">
                  3. Hostname Verification
                </span>
                <p className={`font-semibold text-sm mt-0.5 ${
                  security_checks.hostname_verification.passed ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {security_checks.hostname_verification.status_text}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  {security_checks.hostname_verification.message}
                </p>
              </div>
            </div>
          </div>

          {/* Check 4: TLS Version */}
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] block">
                  4. Protocol Security
                </span>
                <p className="font-semibold text-sm text-blue-300 mt-0.5 font-mono">
                  {connection.tls_version} Negotiated
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Established using Python socket &amp; OpenSSL cryptographic backend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Connection Parameters & Certificate Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Card: Connection Information */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Server className="w-4 h-4 text-slate-400" />
            <h4 className="text-sm font-semibold text-slate-200">Connection Details</h4>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Host Target</span>
              <span className="font-mono text-slate-200 font-medium">{domain}</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Port</span>
              <span className="font-mono text-slate-200">{port}</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">TLS Protocol</span>
              <span className="font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                {connection.tls_version}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Cipher Suite</span>
              <span className="font-mono text-[11px] text-slate-300 bg-slate-950 p-2 rounded border border-slate-800 block break-all">
                {connection.cipher_suite}
              </span>
            </div>
          </div>
        </div>

        {/* Card: Certificate Details (X.509) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Lock className="w-4 h-4 text-slate-400" />
            <h4 className="text-sm font-semibold text-slate-200">Certificate (X.509)</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Subject / Common Name (CN)</span>
              <div className="font-mono text-blue-300 bg-slate-950 p-2.5 rounded border border-slate-800">
                {certificate.subject}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Certificate Issuer</span>
              <div className="font-mono text-slate-200 bg-slate-950 p-2.5 rounded border border-slate-800">
                {certificate.issuer}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Valid From</span>
              </span>
              <div className="font-mono text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800">
                {certificate.valid_from}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Valid Until</span>
              </span>
              <div className="font-mono text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800">
                {certificate.valid_until}
              </div>
            </div>
          </div>

          {/* Days Remaining Banner */}
          <div className="pt-2">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Validity Remaining:</span>
                <strong className="text-slate-200 font-mono text-sm">{certificate.days_remaining} Days</strong>
              </span>

              <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                certificate.days_remaining > 30 
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80' 
                  : certificate.days_remaining > 0 
                    ? 'bg-amber-950 text-amber-400 border border-amber-800/80' 
                    : 'bg-red-950 text-red-400 border border-red-800/80'
              }`}>
                {certificate.days_remaining > 30 ? 'Active & Valid' : certificate.days_remaining > 0 ? 'Expiring Soon' : 'Expired'}
              </span>
            </div>
          </div>

          {/* SAN List */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Subject Alternative Names ({sans.length})</span>
              </span>

              {sans.length > 10 && (
                <button
                  type="button"
                  onClick={() => setShowAllSans(!showAllSans)}
                  className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
                >
                  <span>{showAllSans ? 'Show Fewer' : `View All ${sans.length}`}</span>
                  {showAllSans ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {sans.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No Subject Alternative Names present.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2.5 rounded bg-slate-950 border border-slate-800">
                {displaySans.map((san, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono text-[11px] border border-slate-800"
                  >
                    {san}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
