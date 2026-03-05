import { useState } from "react";
import { verifyCertificate } from "../api";

const initialForm = {
  certificateID: "",
  studentName: "",
  university: "",
  department: "",
  course: "",
  cgpa: "",
  issueDate: "",
};

export default function VerifyCertificate() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const data = { ...form, cgpa: parseFloat(form.cgpa) };
      const res = await verifyCertificate(data);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Verify Certificate</h2>
      <p className="text-sm text-gray-400 mb-6">
        Enter the exact certificate data to verify its authenticity on the blockchain.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Certificate ID" name="certificateID" value={form.certificateID} onChange={handleChange} placeholder="e.g. CERT-2024-001" />
          <Field label="Student Name" name="studentName" value={form.studentName} onChange={handleChange} placeholder="e.g. John Doe" />
          <Field label="University" name="university" value={form.university} onChange={handleChange} placeholder="e.g. MIT" />
          <Field label="Department" name="department" value={form.department} onChange={handleChange} placeholder="e.g. Computer Science" />
          <Field label="Course" name="course" value={form.course} onChange={handleChange} placeholder="e.g. Blockchain Fundamentals" />
          <Field label="CGPA" name="cgpa" value={form.cgpa} onChange={handleChange} placeholder="e.g. 3.85" type="number" step="0.01" min="0" max="4" />
          <Field label="Issue Date" name="issueDate" value={form.issueDate} onChange={handleChange} type="date" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          {loading ? "Verifying..." : "Verify Certificate"}
        </button>
      </form>

      {result && (
        <div
          className={`mt-6 rounded-lg p-6 text-center border ${
            result.verified
              ? "bg-green-900/30 border-green-700"
              : "bg-red-900/30 border-red-700"
          }`}
        >
          <div className="text-4xl mb-2">{result.verified ? "\u2713" : "\u2716"}</div>
          <p className={`text-lg font-semibold ${result.verified ? "text-green-400" : "text-red-400"}`}>
            {result.verified ? "Certificate is Valid" : "Verification Failed"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {result.verified
              ? "The certificate data matches the blockchain record."
              : "The data does not match or the certificate has been revoked."}
          </p>
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

function Field({ label, name, value, onChange, placeholder, type = "text", ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        {...props}
      />
    </div>
  );
}
