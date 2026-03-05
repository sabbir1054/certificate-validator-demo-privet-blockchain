import { useState } from "react";
import { getCertificate } from "../api";

export default function ViewCertificate() {
  const [id, setId] = useState("");
  const [cert, setCert] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!id.trim()) return;
    setError("");
    setCert(null);
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">View Certificate</h2>

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
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          {loading ? "..." : "Search"}
        </button>
      </form>

      {cert && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h3 className="font-semibold text-lg">{cert.certificateID}</h3>
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
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Student Name" value={cert.studentName} />
            <InfoRow label="University" value={cert.university} />
            <InfoRow label="Department" value={cert.department} />
            <InfoRow label="Course" value={cert.course} />
            <InfoRow label="CGPA" value={cert.cgpa} />
            <InfoRow label="Issue Date" value={cert.issueDate} />
            <div className="md:col-span-2">
              <InfoRow label="Hash" value={cert.hash} mono />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-gray-200 ${mono ? "text-xs break-all font-mono" : ""}`}>{value}</p>
    </div>
  );
}
