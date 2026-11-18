import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    q: "Why is asymmetric encryption used during the handshake, but symmetric encryption for data transfer?",
    a: "Asymmetric cryptography (e.g., ECDHE, RSA) is computationally intensive; it is used only to authenticate the server's identity and securely exchange shared secrets. Once shared secrets are derived, fast symmetric encryption (e.g., AES-GCM, ChaCha20-Poly1305) encrypts the high-throughput application data with minimal CPU overhead."
  },
  {
    q: "Why are Intermediate CAs used instead of issuing certificates directly from the Root CA?",
    a: "Root CAs are the ultimate anchors of trust and are kept in offline, air-gapped vaults to prevent private key compromise. Intermediate CAs are issued to handle daily signing operations. If an Intermediate CA is compromised, only its subtree is revoked without invalidating the global Root CA."
  },
  {
    q: "What is SNI (Server Name Indication) and why is it critical?",
    a: "In modern cloud and CDN architectures, hundreds of different domains share a single public IP address. SNI sends the target hostname in plaintext inside the initial ClientHello message so the server knows which specific domain certificate to present before establishing the encrypted tunnel."
  },
  {
    q: "Why are Subject Alternative Names (SANs) preferred over the Common Name (CN)?",
    a: "The legacy Common Name (CN) field supports only a single domain name and suffers from ambiguous parsing. The Subject Alternative Name (SAN) extension (RFC 5280 / RFC 6125) allows multiple domains, wildcards (*.domain.com), and IP addresses to be securely listed within one certificate."
  },
  {
    q: "How does Python determine if a certificate is trusted?",
    a: "Python's standard ssl module delegates verification to OpenSSL and the operating system's pre-installed certificate store (Windows CryptoAPI / macOS Keychain / Linux ca-certificates). It traces cryptographic digital signatures recursively up the chain until a trusted root certificate anchor is reached."
  }
];

export default function VivaFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm space-y-3">
      <div className="border-b border-slate-800 pb-3">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Viva &amp; Exam Review</span>
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-400" />
          <span>Core Cryptography &amp; Network Security Concepts</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Key theoretical questions often asked during laboratory evaluations and viva presentations.
        </p>
      </div>

      <div className="space-y-2 pt-1">
        {FAQS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden">
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-3 text-left flex items-center justify-between gap-3 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-900/50 transition"
              >
                <span>{item.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="p-3 pt-0 text-xs text-slate-400 border-t border-slate-900 leading-relaxed bg-slate-950/80">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
