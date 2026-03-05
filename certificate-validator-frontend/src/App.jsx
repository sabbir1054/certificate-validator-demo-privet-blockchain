import { useState } from "react";
import CreateCertificate from "./components/CreateCertificate";
import ViewCertificate from "./components/ViewCertificate";
import VerifyCertificate from "./components/VerifyCertificate";
import UpdateCertificate from "./components/UpdateCertificate";
import RevokeCertificate from "./components/RevokeCertificate";
import HowItWorks from "./components/HowItWorks";

const tabs = [
  { key: "how", label: "How It Works", icon: "\u{1F4A1}" },
  { key: "create", label: "Create", icon: "+" },
  { key: "view", label: "View", icon: "\u{1F50D}" },
  { key: "verify", label: "Verify", icon: "\u2713" },
  { key: "update", label: "Update", icon: "\u270E" },
  { key: "revoke", label: "Revoke", icon: "\u2716" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("how");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            <span className="text-indigo-400">&#9670;</span> Certificate Validator
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Blockchain-powered certificate management
          </p>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-indigo-400 text-indigo-400"
                    : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === "how" && <HowItWorks />}
        {activeTab === "create" && <CreateCertificate />}
        {activeTab === "view" && <ViewCertificate />}
        {activeTab === "verify" && <VerifyCertificate />}
        {activeTab === "update" && <UpdateCertificate />}
        {activeTab === "revoke" && <RevokeCertificate />}
      </main>
    </div>
  );
}
