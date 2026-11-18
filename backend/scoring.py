"""Transparent TLScope scoring based only on observed TLS connection data.

This is not a general website, CMS, HTTP-header, malware, or reputation score.
"""
from typing import Any, Dict, List


def calculate_tls_security_score(*, certificate_trusted: bool, certificate_valid: bool,
                                  days_remaining: int, hostname_matches: bool,
                                  tls_version: str, cipher_suite: str = "Unknown") -> Dict[str, Any]:
    checks: List[Dict[str, Any]] = []

    def add(name: str, earned: int, maximum: int, passed: bool, detail: str) -> None:
        checks.append({"name": name, "earned": earned, "maximum": maximum,
                       "passed": passed, "detail": detail})

    # 100-point baseline distributed across checks that this inspector actually measures.
    trust = 30 if certificate_trusted else 0
    add("Certificate trust", trust, 30, certificate_trusted,
        "Certificate chain is trusted by the local CA store." if certificate_trusted else
        "Certificate chain failed local trust verification.")

    if not certificate_valid:
        validity, validity_detail = 0, "Certificate is expired or not yet valid."
    elif days_remaining <= 7:
        validity, validity_detail = 10, f"Valid, but expires in {days_remaining} day(s)."
    elif days_remaining <= 30:
        validity, validity_detail = 18, f"Valid, but expires soon ({days_remaining} days remaining)."
    else:
        validity, validity_detail = 25, f"Valid with {days_remaining} days remaining."
    add("Certificate validity and lifetime", validity, 25, certificate_valid and days_remaining > 30, validity_detail)

    hostname = 25 if hostname_matches else 0
    add("Hostname identity", hostname, 25, hostname_matches,
        "Certificate identity matches the requested hostname." if hostname_matches else
        "Certificate identity does not match the requested hostname.")

    version = (tls_version or "").upper().replace(" ", "")
    protocol_points = {"TLSV1.3": 10, "TLSV1.2": 8, "TLSV1.1": 3, "TLSV1.0": 1, "TLSV1": 1}.get(version, 0)
    protocol_ok = version in {"TLSV1.3", "TLSV1.2"}
    add("Negotiated TLS protocol", protocol_points, 10, protocol_ok,
        f"{tls_version} is a modern TLS version." if protocol_ok else
        f"{tls_version or 'Unknown'} is obsolete, weak, or could not be identified.")

    cipher = (cipher_suite or "").upper()
    # Conservative heuristic based on negotiated cipher name; this is not a full cryptographic audit.
    if any(x in cipher for x in ("_NULL_", "_RC4_", "_3DES_", "_DES_", "_EXPORT_", "_MD5")):
        cipher_points, cipher_ok = 0, False
        cipher_detail = f"Weak or obsolete cipher indicated by {cipher_suite}."
    elif any(x in cipher for x in ("AES_128_GCM", "AES_256_GCM", "CHACHA20_POLY1305", "AES_128_CCM")):
        cipher_points, cipher_ok = 10, True
        cipher_detail = f"Modern authenticated-encryption cipher: {cipher_suite}."
    elif cipher and cipher != "UNKNOWN":
        cipher_points, cipher_ok = 6, False
        cipher_detail = f"Cipher identified ({cipher_suite}); strength is not fully classified by this heuristic."
    else:
        cipher_points, cipher_ok = 0, False
        cipher_detail = "Cipher suite could not be identified."
    add("Negotiated cipher suite", cipher_points, 10, cipher_ok, cipher_detail)

    score = max(0, min(100, sum(c["earned"] for c in checks)))
    if score >= 90: grade, risk, label = "A", "Low", "Strong TLS configuration"
    elif score >= 80: grade, risk, label = "A-", "Low", "Good TLS configuration"
    elif score >= 70: grade, risk, label = "B+", "Low", "Generally good TLS configuration"
    elif score >= 60: grade, risk, label = "B", "Moderate", "TLS configuration could be improved"
    elif score >= 50: grade, risk, label = "B-", "Moderate", "TLS configuration needs improvement"
    elif score >= 35: grade, risk, label = "C+", "High", "Weak TLS configuration"
    elif score >= 20: grade, risk, label = "C", "High", "Poor TLS configuration"
    else: grade, risk, label = "F", "High", "Very weak TLS configuration"

    return {"score": score, "maximum": 100, "grade": grade, "risk_level": risk,
            "label": label, "checks": checks,
            "scope": "TLS certificate, negotiated protocol and cipher only. Does not assess CMS, JavaScript libraries, HTTP methods, cookies, security headers, page content, malware, phishing, or website legitimacy."}
