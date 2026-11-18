"""
HTTPS/TLS Certificate Inspector - FastAPI Backend
Cryptography & Network Security Project-Based Learning (PBL)
Cross-platform compatible: Windows, macOS, Linux
"""

import sys
import logging
from pathlib import Path
from fastapi import FastAPI, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Ensure backend directory is in sys.path regardless of execution CWD or OS
CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from inspector import inspect_tls_certificate, InspectionError

# Configure clean logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("tls_inspector")

app = FastAPI(
    title="HTTPS/TLS Certificate Inspector API",
    description="Educational backend for inspecting live TLS certificates, handshake parameters, and transparent TLS security scoring.",
    version="1.1.0"
)

# Enable CORS for frontend integration across any local port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Root health check and service information."""
    return {
        "service": "HTTPS/TLS Certificate Inspector API",
        "pbl_course": "Cryptography and Network Security",
        "status": "online",
        "endpoints": {
            "inspect": "/api/inspect?domain={website_domain}"
        }
    }


@app.get("/api/inspect")
def inspect_endpoint(
    domain: str = Query(..., description="Target website domain (e.g., google.com)")
):
    """
    Inspect the TLS certificate of a given public domain on port 443.
    Returns connection details, certificate fields, and core security checks.
    """
    logger.info("Received inspection request for domain: %s", domain)

    try:
        result = inspect_tls_certificate(domain)
        logger.info("Successfully inspected certificate for: %s", result.get("domain"))
        return result
    except InspectionError as e:
        logger.warning("Inspection error for domain '%s': [%s] %s", domain, e.error_type, e.message)
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": "error",
                "error_type": e.error_type,
                "message": e.message,
            }
        )
    except Exception as exc:
        # Never expose Python stack traces to the frontend
        logger.error("Unexpected exception inspecting domain '%s': %s", domain, str(exc), exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": "error",
                "error_type": "internal_error",
                "message": "Unable to complete TLS certificate inspection. Please verify the domain and try again."
            }
        )


if __name__ == "__main__":
    import uvicorn
    # 127.0.0.1 is standard across Windows, macOS, and Linux
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
