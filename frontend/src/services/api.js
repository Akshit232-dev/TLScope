/**
 * API Service for communicating with the FastAPI backend
 */

// In development with Vite proxy, relative URL /api works directly.
// If VITE_API_URL is configured, prefer that.
const API_BASE = import.meta.env.VITE_API_URL || '';

export async function inspectDomain(domain) {
  const url = `${API_BASE}/api/inspect?domain=${encodeURIComponent(domain.trim())}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Inspection failed');
      error.errorType = data.error_type || 'unknown_error';
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const netError = new Error('Cannot connect to the backend API server. Please ensure FastAPI is running on port 8000.');
      netError.errorType = 'connection_failed';
      throw netError;
    }
    throw err;
  }
}
