# Build a Full-Stack HTTPS/TLS Certificate Inspector

Create a small, polished, educational full-stack web application for my **Cryptography and Network Security Project-Based Learning (PBL)**.

## Project Topic

**HTTPS/TLS Certificate Inspection**

The purpose of the project is to demonstrate how HTTPS/TLS certificates are used for server authentication and secure communication.

The application should allow a user to enter a public website/domain, retrieve its real TLS certificate information through the backend, analyze a few important properties, and display the results clearly on the frontend.

so keep the implementation clean, understandable and limited to the required concepts. Do NOT turn it into a large cybersecurity scanner.

---

# 1. Technology Stack

Use:

**Frontend**
- React
- Vite
- Tailwind CSS
- Lucide icons

**Backend**
- Python
- FastAPI
- Python `ssl`
- Python `socket`
- Python `datetime`

Use the standard TLS/SSL capabilities provided by Python wherever possible.

Frontend and backend must be properly integrated through a REST API.

Do not use a database because the project does not require persistent data.

---

# 2. Application Structure

The application should have TWO clearly separated sections accessible from the frontend:

### Section A — Learn: How HTTPS/TLS Works

This section is educational and visual.

### Section B — Inspect: TLS Certificate Analyzer

This section contains the actual working implementation.

Do not mix the educational explanation with the actual certificate inspection results.

---

# 3. LEARN SECTION

Create a visually clean explanation of how HTTPS/TLS works.

Avoid large paragraphs.

Use diagrams, arrows, cards, icons and short explanations.

## Diagram 1 — HTTPS Communication

Visually show:

User / Browser

↓

HTTPS Request

↓

TLS Handshake

↓

Website Server

↓

Certificate sent to browser

↓

Certificate verified

↓

Secure encrypted connection established

Use a browser icon, server icon, certificate icon, lock icon and arrows.

---

# 4. TLS HANDSHAKE VISUALIZATION

Create a simplified TLS handshake diagram.

Show:

Browser → Server  
**Client Hello**

Server → Browser  
**Server Hello**

Server → Browser  
**TLS Certificate**

Browser  
**Verifies Certificate**

Browser ↔ Server  
**Secure Session Established**

Then:

Browser 🔒 ← Encrypted Application Data → 🔒 Server

Keep this deliberately simplified.

Do NOT attempt to explain every internal TLS 1.3 handshake message.

The goal is to help a student explain the basic process during a 5–7 minute presentation.

---

# 5. CERTIFICATE TRUST VISUALIZATION

Create another small diagram showing the idea of certificate trust:

Root Certificate Authority

↓

Intermediate CA

↓

Website Certificate

↓

Browser Verification

Briefly explain:

- Certificate Authority (CA)
- Website certificate
- Certificate validity
- Domain/hostname verification

Keep each explanation to approximately 1–2 sentences.

---

# 6. INSPECT SECTION — WORKING IMPLEMENTATION

Provide an input field:

**Enter Website / Domain**

Example:

`google.com`

Button:

**Inspect Certificate**

The frontend should send the domain to the FastAPI backend.

Example API:

`GET /api/inspect?domain=google.com`

The backend should establish a real TLS connection to:

`domain:443`

using Python `socket` and `ssl`.

Retrieve and return the TLS/certificate information.

---

# 7. INFORMATION TO DISPLAY

Only display useful information related to this PBL.

### Connection Information

Display:

- Domain
- Port (443)
- TLS version
- Cipher suite

### Certificate Information

Display:

- Subject / Common Name
- Certificate Issuer
- Valid From
- Valid Until
- Days Remaining
- Subject Alternative Names (SAN)

Do not dump the entire raw certificate.

---

# 8. SECURITY CHECKS

Perform the following checks:

### Certificate Trust

Determine whether Python's trusted CA store accepts the certificate.

Display:

**PASS — Certificate trusted**

or

**FAIL — Certificate verification failed**

---

### Expiration

Check whether the certificate is currently within its validity period.

Display:

**PASS — Certificate is currently valid**

or

**FAIL — Certificate expired/not yet valid**

---

### Hostname Verification

Verify that the certificate is valid for the requested hostname.

Display:

**PASS — Hostname matches certificate**

or

**FAIL — Hostname verification failed**

---

### TLS Version

Display the negotiated TLS version.

For example:

`TLSv1.3`

Do not invent an arbitrary overall "security score."

The purpose is certificate inspection and education, not claiming to provide a complete website security audit.

---

# 9. RESULTS UI

After inspection, present a clean result page.

Example structure:

--------------------------------

TLS Certificate Report

google.com

Connection Status: Successful

TLS Version  
TLSv1.3

Cipher Suite  
TLS_AES_256_GCM_SHA384

--------------------------------

Certificate

Subject  
*.google.com

Issuer  
Google Trust Services

Valid From  
...

Valid Until  
...

Days Remaining  
...

--------------------------------

Verification

✓ Certificate Trusted

✓ Certificate Valid

✓ Hostname Verified

--------------------------------

Use green indicators for successful checks and red indicators for failures.

The interface should be easy to understand while presenting it in class.

---

# 10. ERROR HANDLING

Handle common errors gracefully.

Examples:

### Invalid domain

Display:

"Unable to resolve the specified domain."

### Connection failure

Display:

"Unable to establish a connection to the server."

### TLS verification failure

Display the certificate verification failure clearly without crashing the application.

### Timeout

Use a reasonable connection timeout and display:

"Connection timed out."

Never expose a Python stack trace to the frontend.

---

# 11. IMPORTANT BACKEND SECURITY

Because the backend accepts a hostname and makes a network connection, implement basic input protection.

Only accept valid public domain/hostname input.

Reject obvious localhost/private/internal targets such as:

- localhost
- 127.0.0.1
- ::1
- private/local IP address ranges

Do not build a general URL-fetching proxy.

The backend should only perform the TLS certificate inspection required by this project.

---

# 12. FRONTEND DESIGN

Create a professional cybersecurity-themed interface.

Prefer:

- dark/navy background
- clean typography
- subtle blue/cyan accents
- green for successful verification
- red for failures
- certificate, shield, server, browser and lock icons

Keep animations subtle.

The UI should look like an educational cybersecurity project rather than a commercial security product.

Make it responsive for laptop screens because it will be demonstrated during a presentation.

---

# 13. AI USAGE SECTION

Because the assignment requires AI usage disclosure, add a small section:

**AI Assistance & Verification**

Explain:

AI was used to assist with:
- project structure
- code generation
- UI design
- explanations of TLS concepts

Student verification:
- Executed the application independently
- Compared certificate information with browser certificate details
- Verified issuer and validity dates
- Tested multiple domains
- Reviewed and understood the generated code

Do NOT claim that AI independently verified the results.

---

# 14. INDEPENDENT VERIFICATION

Add a small frontend explanation showing how results can be verified manually:

1. Open the same HTTPS website in a browser.
2. Inspect its certificate/security information.
3. Compare the certificate issuer.
4. Compare validity dates.
5. Compare hostname/domain information.
6. Confirm that the browser also accepts the certificate.

This directly addresses the PBL requirement for independent verification.

---

# 15. PROJECT ARCHITECTURE

Keep the architecture simple:

Browser / React Frontend

↓

REST API

↓

FastAPI Backend

↓

Python SSL + Socket

↓

HTTPS Website : Port 443

↓

TLS Certificate

↓

FastAPI processes certificate

↓

JSON Response

↓

React displays certificate report

Show this architecture visually in the Learn section as well.

---

# 16. PROJECT FILE STRUCTURE

Keep the source code organized approximately as:

tls-certificate-inspector/

frontend/
- React application
- components/
- pages/
- services/

backend/
- main.py
- TLS inspection logic
- requirements.txt

README.md

Avoid unnecessary abstraction and excessive numbers of files.

The code should be understandable by a university student during viva.

---

# 17. README

Create a README containing:

- Project title
- Objective
- Features
- Architecture
- Technology stack
- Installation
- Running backend
- Running frontend
- Example usage
- Testing procedure
- Independent verification procedure
- AI usage disclosure
- Limitations

---

# 18. LIMITATIONS

Clearly state that this project:

- Inspects TLS certificate and connection information.
- Does not determine whether the website itself is malicious.
- Does not scan the website for vulnerabilities.
- Does not perform penetration testing.
- Does not test SSRF, SQL injection, XSS or other unrelated vulnerabilities.
- Is an educational TLS inspection tool.

---

# 19. MOST IMPORTANT REQUIREMENT

Do not overengineer this project.

Do NOT add:

- Login/signup
- Database
- User accounts
- Admin dashboard
- Machine learning
- AI API
- Vulnerability scanner
- Port scanner
- SSRF scanner
- SQL injection scanner
- XSS scanner
- Website reputation system
- Complex certificate-chain analysis
- Certificate transparency monitoring
- Background jobs
- Docker/Kubernetes unless required for basic execution

The project needs to demonstrate only:

**TLS connection → certificate retrieval → certificate inspection → verification → visual explanation.**

The final application must be easy enough that three students can completely understand and explain every important component during a viva.

After implementation, provide clear instructions for running both the FastAPI backend and React frontend locally.