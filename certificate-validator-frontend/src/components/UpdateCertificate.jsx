import { useState } from "react";
import { getCertificate, updateCertificate } from "../api";

export default function UpdateCertificate() {
  const [searchId, setSearchId] = useState("");
  const [form, setForm] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setError("");
    setForm(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await getCertificate(searchId.trim());
      const data = res.data;
      setForm({
        studentName: data.studentName,
        department: data.department,
        course: data.course,
        cgpa: String(data.cgpa),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setUpdating(true);
    try {
      const data = {
        ...form,
        cgpa: form.cgpa ? parseFloat(form.cgpa) : undefined,
      };
      const res = await updateCertificate(searchId.trim(), data);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Update Certificate</h2>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter Certificate ID to load"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          {loading ? "..." : "Load"}
        </button>
      </form>

      {form && (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Student Name</label>
              <input
                type="text"
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Course</label>
              <input
                type="text"
                name="course"
                value={form.course}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">CGPA</label>
              <input
                type="number"
                name="cgpa"
                value={form.cgpa}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="4"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            {updating ? "Updating..." : "Update Certificate"}
          </button>
        </form>
      )}

      {result && (
        <div className="mt-6 bg-green-900/30 border border-green-700 rounded-lg p-4">
          <p className="text-green-400 font-medium">{result.message || "Certificate updated successfully!"}</p>
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
