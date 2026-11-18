"""
HTTPS/TLS Certificate Inspector - Core Inspection Logic
Cryptography & Network Security PBL
Cross-platform compatible: Windows, macOS, Linux
"""

import socket
import ssl
import ipaddress
import re
from datetime import datetime, timezone
from typing import Dict, Any, List

from cryptography import x509
from cryptography.x509.oid import NameOID, ExtensionOID
from scoring import calculate_tls_security_score

# Try importing certifi as a fallback CA bundle for environments with minimal OS trust stores
try:
    import certifi
    DEFAULT_CA_FILE = certifi.where()
except ImportError:
    DEFAULT_CA_FILE = None


class InspectionError(Exception):
    """Custom exception for TLS inspection failures with a clean user-facing message."""
    def __init__(self, error_type: str, message: str):
        super().__init__(message)
        self.error_type = error_type
        self.message = message


def create_verified_context() -> ssl.SSLContext:
    """
    Create a verified SSL context across Windows, macOS, and Linux.
    Falls back to certifi CA bundle if system trust store is empty or unavailable.
    """
    try:
        ctx = ssl.create_default_context()
        return ctx
    except Exception:
        if DEFAULT_CA_FILE:
            return ssl.create_default_context(cafile=DEFAULT_CA_FILE)
        raise


def clean_and_validate_hostname(raw_input: str) -> str:
    """
    Sanitize and validate user-supplied hostname.
    Enforces security checks to prevent SSRF, internal network scanning,
    or inspection of localhost/private IP ranges across all platforms.
    """
    if not raw_input or not isinstance(raw_input, str):
        raise InspectionError("invalid_domain", "Domain cannot be empty.")

    cleaned = raw_input.strip().lower()

    # Strip protocol prefix if provided (e.g. https://, http://)
    cleaned = re.sub(r'^[a-zA-Z]+://', '', cleaned)

    # Strip path, query parameters, fragments
    cleaned = cleaned.split('/')[0].split('?')[0].split('#')[0]

    # Strip explicit port if user specified (e.g., domain.com:443)
    if ':' in cleaned and not cleaned.startswith('['):
        cleaned = cleaned.split(':')[0]

    # Strip trailing periods
    cleaned = cleaned.strip('.')

    if not cleaned:
        raise InspectionError("invalid_domain", "Unable to resolve the specified domain.")

    # Reject localhost and local identifiers
    blocked_hosts = {
        "localhost", "localhost.localdomain", "127.0.0.1", "::1", "0.0.0.0",
        "ip6-localhost", "ip6-loopback"
    }
    if cleaned in blocked_hosts:
        raise InspectionError("forbidden_target", "Inspection of localhost or loopback addresses is not permitted.")

    # Reject private domain extensions
    blocked_suffixes = (
        ".local", ".internal", ".localhost", ".test", ".example", ".invalid", ".corp", ".home"
    )
    if any(cleaned.endswith(suffix) for suffix in blocked_suffixes):
        raise InspectionError("forbidden_target", "Inspection of internal or private domain names is not permitted.")

    # Check if raw input is an IP address
    try:
        ip = ipaddress.ip_address(cleaned)
        if (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_multicast
            or ip.is_reserved
            or ip.is_unspecified
        ):
            raise InspectionError("forbidden_target", f"Target IP address {cleaned} is private or non-public.")
        return str(ip)
    except ValueError:
        # Not a raw IP address; continue with hostname validation
        pass

    # Hostname syntax validation (RFC 1123 compliant)
    hostname_regex = r'^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$'
    if not re.match(hostname_regex, cleaned):
        raise InspectionError("invalid_domain", "Invalid domain format. Please enter a valid public hostname (e.g., google.com).")

    # Resolve hostname to verify DNS and guard against SSRF to private/internal IPs
    try:
        addrinfo = socket.getaddrinfo(cleaned, 443, socket.AF_UNSPEC, socket.SOCK_STREAM)
        for _, _, _, _, sockaddr in addrinfo:
            ip_str = sockaddr[0]
            try:
                ip_obj = ipaddress.ip_address(ip_str)
                if (
                    ip_obj.is_private
                    or ip_obj.is_loopback
                    or ip_obj.is_link_local
                    or ip_obj.is_multicast
                    or ip_obj.is_reserved
                    or ip_obj.is_unspecified
                ):
                    raise InspectionError(
                        "forbidden_target",
                        f"Domain resolves to private or restricted IP ({ip_str}), inspection rejected."
                    )
            except ValueError:
                continue
    except socket.gaierror:
        raise InspectionError("invalid_domain", "Unable to resolve the specified domain.")
    except Exception:
        raise InspectionError("invalid_domain", "Unable to resolve the specified domain.")

    return cleaned


def match_wildcard_hostname(pattern: str, hostname: str) -> bool:
    """
    Check if a hostname matches a certificate pattern (supporting standard wildcard '*.domain.com').
    """
    pattern = pattern.strip().lower()
    hostname = hostname.strip().lower()

    if pattern == hostname:
        return True

    if pattern.startswith("*."):
        suffix = pattern[2:]
        # Wildcard matches only a single subdomain level (e.g., sub.example.com, not sub.sub.example.com)
        parts = hostname.split(".", 1)
        if len(parts) == 2 and parts[1] == suffix:
            return True

    return False


def inspect_tls_certificate(raw_domain: str, port: int = 443, timeout: float = 5.0) -> Dict[str, Any]:
    """
    Perform a live TLS connection to domain:443 using Python socket and ssl.
    Extracts certificate information and performs key security verification checks.
    Fully cross-platform across Windows, macOS, and Linux.
    """
    # 1. Clean and validate hostname
    domain = clean_and_validate_hostname(raw_domain)

    trust_passed = False
    trust_message = ""
    tls_version = None
    cipher_suite = None
    cert_der = None

    # 2. Attempt standard verified TLS connection
    try:
        context = create_verified_context()
        with socket.create_connection((domain, port), timeout=timeout) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                tls_version = ssock.version()
                cipher_info = ssock.cipher()
                cipher_suite = cipher_info[0] if cipher_info else "Unknown"
                cert_der = ssock.getpeercert(binary_form=True)
                trust_passed = True
                trust_message = "PASS — Certificate trusted"
    except ssl.SSLCertVerificationError as e:
        trust_passed = False
        reason = getattr(e, "verify_message", None) or getattr(e, "reason", "Untrusted or self-signed certificate")
        trust_message = f"FAIL — Certificate verification failed: {reason}"
    except (socket.timeout, TimeoutError):
        raise InspectionError("timeout", "Connection timed out.")
    except socket.gaierror:
        raise InspectionError("invalid_domain", "Unable to resolve the specified domain.")
    except (ConnectionRefusedError, socket.error, OSError):
        raise InspectionError("connection_failed", "Unable to establish a connection to the server.")

    # 3. If standard verification failed or cert_der was not captured, connect with unverified context
    # so we can still extract and inspect certificate details (dates, issuer, SANs) for educational analysis.
    if cert_der is None:
        try:
            unverified_ctx = ssl._create_unverified_context()
            with socket.create_connection((domain, port), timeout=timeout) as sock:
                with unverified_ctx.wrap_socket(sock, server_hostname=domain) as ssock:
                    if tls_version is None:
                        tls_version = ssock.version()
                    if cipher_suite is None:
                        cipher_info = ssock.cipher()
                        cipher_suite = cipher_info[0] if cipher_info else "Unknown"
                    cert_der = ssock.getpeercert(binary_form=True)
        except (socket.timeout, TimeoutError):
            raise InspectionError("timeout", "Connection timed out.")
        except Exception:
            raise InspectionError("connection_failed", "Unable to establish a connection to the server.")

    if not cert_der:
        raise InspectionError("connection_failed", "No certificate was returned by the remote server.")

    # 4. Parse the X.509 certificate
    try:
        cert = x509.load_der_x509_certificate(cert_der)
    except Exception:
        raise InspectionError("invalid_cert", "Failed to parse the remote TLS certificate.")

    # Subject Common Name
    subject_cn = "Unknown"
    subject_cn_attrs = cert.subject.get_attributes_for_oid(NameOID.COMMON_NAME)
    if subject_cn_attrs:
        subject_cn = str(subject_cn_attrs[0].value)

    # Issuer (Organization + Common Name)
    issuer_o_attrs = cert.issuer.get_attributes_for_oid(NameOID.ORGANIZATION_NAME)
    issuer_cn_attrs = cert.issuer.get_attributes_for_oid(NameOID.COMMON_NAME)
    issuer_parts = []
    if issuer_o_attrs:
        issuer_parts.append(str(issuer_o_attrs[0].value))
    if issuer_cn_attrs:
        issuer_parts.append(str(issuer_cn_attrs[0].value))
    issuer_display = " / ".join(issuer_parts) if issuer_parts else cert.issuer.rfc4514_string()

    # Certificate Validity Dates
    valid_from_utc = cert.not_valid_before_utc
    valid_until_utc = cert.not_valid_after_utc
    now_utc = datetime.now(timezone.utc)

    # Expiration Check (using platform-independent integer math and standard strftime)
    days_remaining = (valid_until_utc - now_utc).days
    if valid_from_utc <= now_utc <= valid_until_utc:
        expiration_passed = True
        expiration_message = f"PASS — Certificate is currently valid ({days_remaining} days remaining)"
    else:
        expiration_passed = False
        if now_utc > valid_until_utc:
            days_ago = abs(days_remaining)
            expiration_message = f"FAIL — Certificate expired {days_ago} days ago"
        else:
            expiration_message = "FAIL — Certificate not yet valid (future validity date)"

    # Subject Alternative Names (SAN)
    sans: List[str] = []
    try:
        san_ext = cert.extensions.get_extension_for_oid(ExtensionOID.SUBJECT_ALTERNATIVE_NAME)
        sans = san_ext.value.get_values_for_type(x509.DNSName)
    except Exception:
        sans = []

    # Hostname Verification Check
    candidate_names = sans if sans else ([subject_cn] if subject_cn != "Unknown" else [])
    hostname_matched = False
    for candidate in candidate_names:
        if match_wildcard_hostname(candidate, domain):
            hostname_matched = True
            break

    if hostname_matched:
        hostname_message = "PASS — Hostname matches certificate"
    else:
        hostname_message = f"FAIL — Hostname verification failed (Domain '{domain}' does not match certificate)"

    result = {
        "status": "success",
        "domain": domain,
        "port": port,
        "connection": {
            "status": "Successful",
            "tls_version": tls_version or "Unknown",
            "cipher_suite": cipher_suite or "Unknown",
        },
        "certificate": {
            "subject": subject_cn,
            "issuer": issuer_display,
            "valid_from": valid_from_utc.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "valid_until": valid_until_utc.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "days_remaining": days_remaining,
            "subject_alt_names": sans,
        },
        "security_checks": {
            "certificate_trust": {
                "passed": trust_passed,
                "status_text": "PASS — Certificate trusted" if trust_passed else "FAIL — Certificate verification failed",
                "message": trust_message,
            },
            "expiration": {
                "passed": expiration_passed,
                "status_text": "PASS — Certificate is currently valid" if expiration_passed else "FAIL — Certificate expired/not yet valid",
                "message": expiration_message,
                "days_remaining": days_remaining,
            },
            "hostname_verification": {
                "passed": hostname_matched,
                "status_text": "PASS — Hostname matches certificate" if hostname_matched else "FAIL — Hostname verification failed",
                "message": hostname_message,
            },
            "tls_version": {
                "passed": True,
                "status_text": tls_version or "Unknown",
                "version": tls_version or "Unknown",
            }
        }
    }

    result["tls_security_score"] = calculate_tls_security_score(
        certificate_trusted=trust_passed,
        certificate_valid=expiration_passed,
        days_remaining=days_remaining,
        hostname_matches=hostname_matched,
        tls_version=tls_version or "Unknown",
        cipher_suite=cipher_suite or "Unknown",
    )
    return result
