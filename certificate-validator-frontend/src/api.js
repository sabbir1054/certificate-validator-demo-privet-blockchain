const API_BASE = "http://localhost:8001";

/**
 * Generic request handler
 */
async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

/**
 * Create a new certificate on the blockchain
 */
export function createCertificate(data) {
  return request("/api/certificate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get all certificates
 */
export function getAllCertificates() {
  return request("/api/certificate");
}

/**
 * Get a single certificate by ID
 */
export function getCertificate(id) {
  return request(`/api/certificate/${encodeURIComponent(id)}`);
}

/**
 * Verify certificate by providing data (generates hash and checks blockchain)
 */
export async function verifyCertificate(data) {
  // Generate hash on frontend to verify
  const hashData = `${data.certificateID}${data.studentName}${data.university}${data.department}${data.course}${data.cgpa}${data.issueDate}`;

  // Use SubtleCrypto API to generate SHA-256 hash
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(hashData);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Get certificate from blockchain and compare
  try {
    const result = await getCertificate(data.certificateID);
    const cert = result.data;

    // Check if certificate exists and hash matches
    const isValid = cert && cert.hash === hash && cert.status === 'valid';

    return {
      success: true,
      verified: isValid,
      certificate: cert
    };
  } catch (error) {
    return {
      success: true,
      verified: false,
      error: error.message
    };
  }
}

/**
 * Verify certificate using image upload (OCR-based)
 */
export async function verifyCertificateWithImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/certificate/verify`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Verification failed");
  return data;
}

/**
 * Update a certificate
 */
export function updateCertificate(id, data) {
  return request(`/api/certificate/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Revoke a certificate
 */
export function revokeCertificate(id) {
  return request(`/api/certificate/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
