# HTTPS/TLS Certificate Inspector
> **Cryptography and Network Security — Project-Based Learning (PBL)**

> **Customization and maintenance: Akshit Arora**  
> Original project source: https://github.com/ganeshnikhil/TLScope

A polished, educational full-stack web application designed to demonstrate how **HTTPS/TLS certificates** are used for server authentication, cryptographic trust verification, and secure network communication.

---

## 1. Project Objective

The primary objective of this project is to provide a clean, interactive, and educational implementation of **Transport Layer Security (TLS)** certificate inspection. 

Rather than functioning as a commercial security scanner, this project focuses strictly on the foundational concepts of Network Security and Cryptography:
1. Establishing a live TCP connection to a public web server on port 443.
2. Initiating and completing a genuine TLS handshake using Python's standard `ssl` and `socket` libraries.
3. Extracting and parsing the server's **X.509 digital certificate**.
4. Performing core cryptographic security checks: **Certificate Trust**, **Validity Period (Expiration)**, and **Hostname Verification**.
5. Visually presenting the cryptographic mechanisms (HTTPS flow, simplified TLS handshake, CA hierarchy, and data architecture) for student viva and laboratory demonstrations.

---

## 2. Key Features

- **Real-World TLS Handshake**: Establishes genuine TLS connections to any public domain on `port 443` without using mock data or external third-party scanning APIs.
- **Connection Diagnostics**:
  - Target domain and port (`443`)
  - Negotiated TLS protocol version (e.g., `TLSv1.3`, `TLSv1.2`)
  - Active cryptographic cipher suite (e.g., `TLS_AES_256_GCM_SHA384`, `TLS_AES_128_GCM_SHA256`)
- **X.509 Certificate Field Extraction**:
  - **Subject / Common Name (CN)**: Identifies the primary entity to which the certificate is issued.
  - **Certificate Issuer**: Organization (O) and Common Name (CN) of the signing Certificate Authority.
  - **Validity Window**: Exact `Not Before` and `Not After` UTC timestamps.
  - **Days Remaining**: Real-time calculated lifespan with status alerts (Active, Expiring Soon, Expired).
  - **Subject Alternative Names (SAN)**: Comprehensive list of valid hostnames and wildcard subdomains covered by the certificate.
- **Three Core Cryptographic Verifications**:
  - **Certificate Trust**: Validates whether the certificate chains up to a trusted Root Certificate Authority in the operating system's trust store.
  - **Expiration Check**: Asserts whether the current system time falls within the certificate's validity bounds.
  - **Hostname Verification**: Asserts whether the queried domain matches the Subject Common Name or any SAN entry (including wildcard matching e.g. `*.google.com`).
- **Two Strictly Separated Application Sections**:
  - **Section A — Learn: How TLS Works**: Visual educational diagrams (HTTPS flow, TLS handshake, CA trust chain, and system architecture) avoiding text-heavy walls of text.
  - **Section B — Inspect: TLS Certificate Analyzer**: The working tool with domain input, quick-test sample pills, loading animations, and structured reports.
- **Built-in Security & SSRF Protection**:
  - Input sanitization (strips URL schemes, ports, and paths).
  - Rejection of localhost, loopback (`127.0.0.1`, `::1`), private IP ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), and internal domain names.
  - Strict DNS pre-resolution validation preventing internal network probing.
- **Academic Transparency & Verification**:
  - Built-in AI Usage and Academic Disclosure modal.
  - 6-step manual verification procedure comparing results directly against standard web browsers.

---

## 3. Technology Stack

### Frontend
- **React 18** — Component-driven user interface.
- **Vite** — Next-generation frontend build tool and dev server.
- **Tailwind CSS** — Modern utility-first styling with a dark cybersecurity color palette (`#0B1120`, navy slate, cyan accents, emerald pass, rose fail).
- **Lucide Icons** — Clean, scalable cryptographic, shield, and server icons.

### Backend
- **Python 3.12.2** — Core runtime (matching local `.python-version`).
- **FastAPI** — High-performance modern web framework for the REST API.
- **Uvicorn** — Lightning-fast ASGI server.
- **Standard Library `ssl` & `socket`** — Low-level TCP socket creation, TLS wrapping, and cipher negotiation.
- **Standard Library `datetime` & `ipaddress`** — Timestamps, expiration math, and IP range validation.
- **`cryptography` (X.509)** — Parsing X.509 DER certificate structures and extensions (SANs).

*Note: No database is used, as persistent storage is intentionally not required for this educational inspection project.*

---

## 4. System Architecture

The data pipeline connects the browser frontend to the remote server via a decoupled REST API:

```
+-------------------------------------------------------------+
|                React Frontend (Port 5173)                   |
|   - Inspect Section (Domain input, presets, report cards)   |
|   - Learn Section (Visual diagrams & trust explanations)    |
+-------------------------------------------------------------+
                              |
                     REST API Request
             GET /api/inspect?domain=google.com
                              |
                              v
+-------------------------------------------------------------+
|                FastAPI Backend (Port 8000)                  |
|   - Input sanitization & SSRF / private IP filter           |
|   - Python socket + ssl context manager                     |
+-------------------------------------------------------------+
                              |
                     Raw TCP Connection
                   & TLS 1.3 / 1.2 Handshake
                              |
                              v
+-------------------------------------------------------------+
|             Remote Public Web Server (Port 443)             |
|   - Responds to Client Hello with Server Hello & Cert       |
|   - Sends leaf X.509 public certificate                     |
+-------------------------------------------------------------+
                              |
                   Certificate Extraction
                     & Verification Logic
                              |
                              v
+-------------------------------------------------------------+
|                JSON Response to Frontend                    |
|   - Connection: Protocol, cipher suite, status              |
|   - Certificate: Subject, issuer, dates, SANs               |
|   - Security Checks: Trust, expiration, hostname status     |
+-------------------------------------------------------------+
```

---

## 5. Project Directory Structure

```
cyber/
├── backend/
│   ├── main.py              # FastAPI application & REST endpoint routing
│   ├── inspector.py         # Socket connection, TLS handshake & cert analysis
│   ├── requirements.txt     # Python backend dependencies
│   └── venv/                # Python virtual environment (ignored in git)
├── frontend/
│   ├── index.html           # HTML entry point with dark theme
│   ├── package.json         # Node.js dependencies & scripts
│   ├── vite.config.js       # Vite config with backend API proxy (/api -> :8000)
│   ├── tailwind.config.js   # Tailwind theme customizations
│   ├── postcss.config.js    # PostCSS pipeline
│   └── src/
│       ├── main.jsx         # React application root
│       ├── App.jsx          # Top-level state & section layout
│       ├── index.css        # Base Tailwind styles & custom scrollbars
│       ├── services/
│       │   └── api.js       # Fetch client communicating with /api/inspect
│       └── components/
│           ├── Navbar.jsx               # Header & tab switcher
│           ├── InspectSection.jsx       # Section B: Domain input & report view
│           ├── CertificateReport.jsx     # Structured cards (Connection, Cert, Checks)
│           ├── LearnSection.jsx         # Section A: Educational visual module
│           ├── HttpsFlowDiagram.jsx     # Diagram 1: Full HTTPS request flow
│           ├── HandshakeDiagram.jsx     # Diagram 2: Simplified 5-step TLS handshake
│           ├── TrustChainDiagram.jsx    # Diagram 3: Root CA -> Intermediate -> Leaf
│           ├── ArchitectureDiagram.jsx  # Diagram 4: Project architecture flow
│           ├── AiUsageModal.jsx         # Academic AI assistance disclosure modal
│           └── VerificationModal.jsx   # 6-step manual verification guide
├── implimention.md          # Project specification and PBL guidelines
└── README.md                # Comprehensive documentation (this file)
```

---

## 6. Installation & Setup

### Prerequisites
- **Python 3.12.2** (configured in `.python-version` and initialized in `backend/venv`)
- **Node.js 18+** and **npm**

---

### Step 1: Clone or Navigate to the Project

```bash
cd TLScope-main
```

---

### Step 2: Backend Setup

1. Create a Python virtual environment:
   ```bash
   python3 -m venv backend/venv
   ```

2. Activate the virtual environment:
   - **macOS / Linux:**
     ```bash
     source backend/venv/bin/activate
     ```
   - **Windows:**
     ```cmd
     backend\venv\Scripts\activate
     ```

3. Install backend dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

---

### Step 3: Frontend Setup

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

---

## 7. Running the Application Locally

### Option A — One-Click Quick Launch Scripts

- **macOS / Linux:**
  ```bash
  ./start.sh
  ```
- **Windows:**
  Double-click `start.bat` or run in terminal:
  ```cmd
  start.bat
  ```
*(These scripts automatically verify Python/Node, set up the virtual environment, install missing packages, and launch both servers.)*

---

### Option B — Manual Two-Terminal Launch

You will need **two terminal tabs** running concurrently (one for the backend, one for the frontend).

### Terminal 1 — Start the FastAPI Backend

- **macOS / Linux:**
  ```bash
  cd backend
  source venv/bin/activate
  python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
  ```

- **Windows (Command Prompt / PowerShell):**
  ```cmd
  cd backend
  venv\Scripts\activate
  python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
  ```

*The backend API will be available at `http://127.0.0.1:8000`.*
*Interactive OpenAPI documentation is available at `http://127.0.0.1:8000/docs`.*

### Terminal 2 — Start the React Frontend

- **All Platforms (macOS, Windows, Linux):**
  ```bash
  cd frontend
  npm run dev
  ```
*The React UI will launch at `http://localhost:5173`.*

Open your web browser and navigate to:
```
http://localhost:5173
```

---

## 8. Example Usage

1. Open `http://localhost:5173` in your browser.
2. In the **Inspect Certificate** section, type any public domain (e.g., `google.com`) or click one of the quick test pills (`Google`, `GitHub`, `Cloudflare`, `Wikipedia`, `Python`).
3. Click **Inspect Certificate**.
4. The system will display the **TLS Certificate Report**:
   - **Connection Status**: Successful
   - **Negotiated Protocol**: `TLSv1.3`
   - **Cipher Suite**: `TLS_AES_256_GCM_SHA384`
   - **Subject / Common Name**: `*.google.com`
   - **Issuer**: `Google Trust Services / WE2`
   - **Valid From**: `2026-11-03 08:26:50 UTC`
   - **Valid Until**: `2027-01-26 08:26:49 UTC`
   - **Days Remaining**: `70 Days (Active & Healthy)`
   - **Security Checks**:
     - `✓ PASS — Certificate trusted`
     - `✓ PASS — Certificate is currently valid`

     - `✓ PASS — Hostname matches certificate`
     - `✓ TLSv1.3 Negotiated`

---

## 9. Testing & Error Handling Procedure

The application implements defensive input validation and returns user-friendly error messages without exposing Python stack traces:

| Test Scenario | Example Input | Expected Result / Status |
| :--- | :--- | :--- |
| **Standard Valid Domain** | `google.com` | `200 OK` — All checks PASS, full certificate displayed |
| **Alternate Public Domain** | `github.com` | `200 OK` — Issuer: Sectigo Limited, all checks PASS |
| **URL with Prefix & Path** | `https://cloudflare.com:443/cdn-cgi/trace` | Automatically sanitizes to `cloudflare.com` and inspects |
| **Localhost Target (SSRF)** | `localhost` or `127.0.0.1` | `400 Bad Request` — *"Inspection of localhost or loopback addresses is not permitted."* |
| **Private IP Range** | `192.168.1.1` or `10.0.0.1` | `400 Bad Request` — *"Target IP address is private or non-public."* |
| **Invalid Domain Name** | `nonexistent-xyz-987123.org` | `400 Bad Request` — *"Unable to resolve the specified domain."* |
| **Malformed Input** | `invalid..domain` | `400 Bad Request` — *"Invalid domain format. Please enter a valid public hostname."* |

---

## 10. Independent Verification Procedure (Section 14)

To satisfy the academic requirement for independent validation, students can verify the inspector's results directly against their web browser:

1. **Open the Website**: In Google Chrome, Firefox, or Safari, navigate to `https://google.com`.
2. **Open Security Details**: Click the lock or security icon to the left of the URL address bar.
3. **View Certificate**: Click **Connection is secure** &rarr; **Certificate is valid**.
4. **Compare Issuer**: Verify that the Certificate Authority organization and CN in the browser match the `Issuer` field reported by the inspector.
5. **Compare Validity Dates**: Verify that the `Issued On` (Valid From) and `Expires On` (Valid Until) timestamps match the inspector's output (accounting for UTC vs. local timezone offsets).
6. **Compare Subject & SANs**: Verify that the domain or wildcard covers the visited address and matches the Subject Alternative Names list.

---

## 11. AI Usage & Academic Disclosure (Section 13)

### AI Assistance
Artificial Intelligence was used as an engineering assistant for:
- Initial project scaffolding and modular file structure.
- Python `socket` and `ssl` boilerplate implementation.
- UI styling with Tailwind CSS and responsive layout design.
- Formulation of concise descriptions for the educational diagrams.

### Student Verification & Ownership
- The application was set up, executed, and tested independently in the student's local development environment.
- All live inspection outputs were cross-referenced and validated against real browser certificate viewers (Google Chrome & Mozilla Firefox).
- Issuer names, serial numbers, cryptographic cipher suites, and timestamps were verified against real-world network traffic.
- Multiple domains (`google.com`, `github.com`, `cloudflare.com`, `wikipedia.org`) were tested across valid and edge-case inputs.
- All code logic was reviewed and understood by the student to explain during viva presentation.
- *Notice: AI was not used to fabricate or mock certificate results; all data is retrieved via live network connections on port 443.*

---

## 12. Limitations (Section 18)

This software is strictly an **educational TLS inspection tool** for a Cryptography and Network Security PBL course:
- **Inspects Only TLS/SSL Certificates**: Gathers and evaluates public connection parameters and X.509 certificate fields.
- **Does Not Detect Malicious Content**: An authentic, valid HTTPS certificate does not guarantee that a website is free of phishing, malware, or fraudulent intent.
- **Not a Vulnerability Scanner**: Does not scan for server-side flaws, missing HTTP security headers, outdated software libraries, or weak cipher deprecation.
- **Not a Penetration Testing Tool**: Does not perform fuzzing, port scanning, or intrusion testing.
- **Does Not Test Application Vulnerabilities**: Does not test for SQL Injection (SQLi), Cross-Site Scripting (XSS), or web application exploits.

---

## 13. License & Academic Attribution

Created for **Cryptography & Network Security Project-Based Learning (PBL)**.
Available for academic demonstration, peer review, and viva evaluation.


## TLScope Security Scoring Methodology

TLScope starts each assessment with a **100-point maximum**. Points are awarded for secure TLS configuration; points are withheld when a measured check fails or cannot be established. The final score is clamped between **0 and 100**. This is deliberately a TLS-focused adaptation of broader website-security scoring approaches: it only scores evidence that this project currently collects during a TLS handshake and X.509 certificate inspection.

### Scoring breakdown

| Check | Maximum | Scoring approach |
| :--- | ---: | :--- |
| Certificate trust | 30 | 30 if the certificate chain passes local CA trust verification; otherwise 0. |
| Certificate validity and lifetime | 25 | 25 if valid with more than 30 days remaining; 18 if valid with 8–30 days; 10 if valid with 1–7 days; 0 if expired or not yet valid. |
| Hostname identity | 25 | 25 if the certificate identity matches the requested hostname; otherwise 0. |
| Negotiated TLS protocol | 10 | TLS 1.3: 10; TLS 1.2: 8; TLS 1.1: 3; TLS 1.0: 1; unknown/unsupported: 0. |
| Negotiated cipher suite | 10 | 10 for recognized modern AEAD suites (AES-GCM, ChaCha20-Poly1305, AES-CCM); 6 when identified but not classified by the simple heuristic; 0 for weak/obsolete indicators or unknown suites. |
| **Total** | **100** | **Score is capped at 100 and floored at 0.** |

The cipher-suite classification is a conservative name-based heuristic, not a complete cryptographic review. The protocol and cipher points are based on the negotiated connection, not every protocol or cipher the server might support.

### Grade scale

| Grade | Score |
| :--- | :--- |
| A | 90–100 |
| A- | 80–89 |
| B+ | 70–79 |
| B | 60–69 |
| B- | 50–59 |
| C+ | 35–49 |
| C | 20–34 |
| F | Below 20 |

The A+ band (above 100) from some broader scoring schemes is intentionally omitted because TLScope caps its score at 100.

### Scope: included and excluded checks

The supplied reference methodology also describes WAF detection, CMS and CMS-component patch levels, JavaScript-library versions, HTTP methods, cookies, HTTP security headers/CSP, directory listing, third-party resources, malicious scripts/domains, and HTTP response codes. Those checks are **not included in the current TLScope score** because the current application does not collect or verify that evidence. They must not be represented as tested or passed. In particular:

- No CMS, JavaScript component, WAF, cookie, HTTP method, CSP, or HTTP-header score is calculated.
- No malware, phishing, malicious-domain, or page-content detection is performed. A score of zero is therefore **not** assigned based on suspected malicious page content.
- No server port/HTTP status grade is issued by this TLS certificate inspection flow.
- A valid certificate or high TLS score does **not** prove that a website is genuine, trustworthy, or free of malware.

The report displays each measured check, earned points, maximum points, and supporting evidence so the result is explainable.
