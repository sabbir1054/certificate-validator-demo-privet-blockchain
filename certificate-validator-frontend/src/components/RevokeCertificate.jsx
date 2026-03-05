import { useState } from "react";
import { getCertificate, revokeCertificate } from "../api";

export default function RevokeCertificate() {
  const [id, setId] = useState("");
  const [cert, setCert] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!id.trim()) return;
    setError("");
    setCert(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await getCertificate(id.trim());
      setCert(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    setError("");
    setResult(null);
    setRevoking(true);
    try {
      const res = await revokeCertificate(id.trim());
      setResult(res);
      setCert((prev) => ({ ...prev, status: "revoked" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Revoke Certificate</h2>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter Certificate ID"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          {loading ? "..." : "Search"}
        </button>
      </form>

      {cert && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-lg">{cert.certificateID}</p>
              <p className="text-sm text-gray-400">{cert.studentName} &mdash; {cert.university}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                cert.status === "valid"
                  ? "bg-green-900/50 text-green-400 border border-green-700"
                  : "bg-red-900/50 text-red-400 border border-red-700"
              }`}
            >
              {cert.status}
            </span>
          </div>

          {cert.status === "valid" && !result && (
            <div className="bg-red-950/30 border border-red-900 rounded-lg p-4 mt-4">
              <p className="text-red-300 text-sm mb-3">
                This action is irreversible. The certificate will be permanently marked as revoked on the blockchain.
              </p>
              <button
                onClick={handleRevoke}
                disabled={revoking}
                className="bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                {revoking ? "Revoking..." : "Confirm Revocation"}
              </button>
            </div>
          )}

          {cert.status === "revoked" && !result && (
            <p className="text-gray-400 text-sm mt-2">This certificate is already revoked.</p>
          )}
        </div>
      )}

      {result && (
        <div className="mt-6 bg-green-900/30 border border-green-700 rounded-lg p-4">
          <p className="text-green-400 font-medium">{result.message || "Certificate revoked successfully."}</p>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-900/30 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
