import { useState, useEffect } from "react";

// SHA-256 hash using Web Crypto API
async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── Section Wrapper ─────────────────────────────────────────────────
function Section({ number, title, children }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
          {number}
        </span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Architecture Diagram ───────────────────────────────────────────
function ArchitectureDiagram() {
  const layers = [
    {
      label: "Frontend",
      tech: "React + Vite",
      color: "border-cyan-700 bg-cyan-950/20",
      textColor: "text-cyan-400",
      items: ["Create", "View", "Verify", "Update", "Revoke"],
    },
    {
      label: "Backend API",
      tech: "Node.js + Express",
      color: "border-green-700 bg-green-950/20",
      textColor: "text-green-400",
      items: ["REST API", "SHA-256 Hashing", "OCR (Tesseract.js)", "Fabric Gateway SDK"],
    },
    {
      label: "Blockchain Network",
      tech: "Hyperledger Fabric",
      color: "border-indigo-700 bg-indigo-950/20",
      textColor: "text-indigo-400",
      items: ["Peers (Org1, Org2)", "Orderer", "CertificateContract Chaincode", "World State Ledger"],
    },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
      {layers.map((layer, i) => (
        <div key={i}>
          <div className={`border rounded-lg p-4 ${layer.color}`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm font-semibold ${layer.textColor}`}>{layer.label}</p>
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{layer.tech}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {layer.items.map((item, j) => (
                <span key={j} className="text-xs text-gray-300 bg-gray-800/60 px-2 py-1 rounded">
                  {item}
                </span>
              ))}
            </div>
          </div>
          {i < layers.length - 1 && (
            <div className="flex justify-center text-gray-600 text-lg py-1">
              {i === 0 ? "REST API (HTTP)" : "gRPC (TLS)"}
              <span className="ml-2">&#x2193;</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Flow Diagram ────────────────────────────────────────────────────
function FlowDiagram() {
  const steps = [
    { icon: "\u{1F4DD}", label: "Certificate Data", desc: "Name, University, CGPA..." },
    { icon: "\u{1F504}", label: "SHA-256 Hash", desc: "Cryptographic fingerprint" },
    { icon: "\u{1F512}", label: "Unique Hash", desc: "a7b3f9...c2d1" },
    { icon: "\u26D3", label: "Fabric Ledger", desc: "Stored on-chain" },
    { icon: "\u2705", label: "Verifiable", desc: "Authorized parties verify" },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[600px]">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center">
            <div className="text-center w-28">
              <div className="text-3xl mb-2">{step.icon}</div>
              <p className="text-sm font-medium text-white">{step.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="text-gray-600 text-xl mx-2">&rarr;</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Live Hash Demo ──────────────────────────────────────────────────
function LiveHashDemo() {
  const [input, setInput] = useState("CERT-001John DoeMIT UniversityComputer ScienceBlockchain3.852024-01-15");
  const [hash, setHash] = useState("");

  useEffect(() => {
    sha256(input).then(setHash);
  }, [input]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <p className="text-sm text-gray-400 mb-4">
        This is how the system generates a certificate fingerprint. The input below mimics the concatenated certificate fields. Even a tiny change produces a completely different hash.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Input Data (CertID + Name + University + Dept + Course + CGPA + Date)</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl animate-pulse">&#x2193;</div>
            <p className="text-xs text-gray-500">SHA-256</p>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Output Hash (64 hex characters)</label>
          <div className="bg-gray-800 border border-indigo-700 rounded-lg px-3 py-2.5 font-mono text-sm text-indigo-400 break-all">
            {hash || "computing..."}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tamper Detection Demo ───────────────────────────────────────────
function TamperDemo() {
  const original = { name: "John Doe", university: "MIT University", cgpa: "3.85" };
  const [tampered, setTampered] = useState({ ...original });
  const [originalHash, setOriginalHash] = useState("");
  const [tamperedHash, setTamperedHash] = useState("");

  useEffect(() => {
    sha256(JSON.stringify(original)).then(setOriginalHash);
  }, []);

  useEffect(() => {
    sha256(JSON.stringify(tampered)).then(setTamperedHash);
  }, [tampered]);

  const isMatch = originalHash && tamperedHash && originalHash === tamperedHash;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <p className="text-sm text-gray-400 mb-4">
        Try modifying any field below. The chaincode detects even the smallest change because the SHA-256 hash won't match the one stored on the Fabric ledger.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
            Original (on Fabric ledger)
          </p>
          <div className="space-y-2 bg-gray-800/50 rounded-lg p-3">
            <Row label="Name" value={original.name} />
            <Row label="University" value={original.university} />
            <Row label="CGPA" value={original.cgpa} />
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Stored Hash</p>
            <p className="font-mono text-xs text-green-400 break-all bg-gray-800/50 rounded p-2">{originalHash || "..."}</p>
          </div>
        </div>

        {/* Tampered */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full inline-block ${isMatch ? "bg-green-500" : "bg-red-500"}`}></span>
            Submitted for Verification (editable)
          </p>
          <div className="space-y-2">
            <EditRow label="Name" value={tampered.name} onChange={(v) => setTampered({ ...tampered, name: v })} />
            <EditRow label="University" value={tampered.university} onChange={(v) => setTampered({ ...tampered, university: v })} />
            <EditRow label="CGPA" value={tampered.cgpa} onChange={(v) => setTampered({ ...tampered, cgpa: v })} />
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Regenerated Hash</p>
            <p className={`font-mono text-xs break-all rounded p-2 bg-gray-800/50 ${isMatch ? "text-green-400" : "text-red-400"}`}>
              {tamperedHash || "..."}
            </p>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className={`mt-6 rounded-lg p-4 text-center border ${isMatch ? "bg-green-900/20 border-green-800" : "bg-red-900/20 border-red-800"}`}>
        <p className={`text-lg font-semibold ${isMatch ? "text-green-400" : "text-red-400"}`}>
          {isMatch ? "\u2713 Hashes Match — Certificate is Valid" : "\u2716 Hashes Don't Match — Tampering Detected!"}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          {isMatch
            ? "The submitted data produces the same hash as the Fabric ledger record."
            : "Even a small change completely changes the hash, making fraud impossible to hide."}
        </p>
      </div>

      <button
        onClick={() => setTampered({ ...original })}
        className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        &#x21BA; Reset to original
      </button>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm px-2">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-200">{value}</span>
    </div>
  );
}

function EditRow({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 w-20">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  );
}

// ─── Fabric Network Visualization ───────────────────────────────────
function FabricNetworkVisualization() {
  const nodes = [
    {
      label: "Orderer",
      desc: "Orders transactions into blocks",
      color: "border-amber-700 bg-amber-950/20",
      textColor: "text-amber-400",
    },
    {
      label: "Peer0 - Org1",
      desc: "Endorses & commits transactions",
      color: "border-indigo-700 bg-indigo-950/20",
      textColor: "text-indigo-400",
    },
    {
      label: "Peer0 - Org2",
      desc: "Endorses & commits transactions",
      color: "border-indigo-700 bg-indigo-950/20",
      textColor: "text-indigo-400",
    },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="text-center mb-4">
        <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">Channel: mychannel</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {nodes.map((node, i) => (
          <div key={i} className={`border rounded-lg p-4 text-center ${node.color}`}>
            <p className={`text-sm font-semibold ${node.textColor}`}>{node.label}</p>
            <p className="text-xs text-gray-400 mt-1">{node.desc}</p>
          </div>
        ))}
      </div>
      <div className="border border-green-800 bg-green-950/10 rounded-lg p-4 text-center">
        <p className="text-sm font-semibold text-green-400">CertificateContract Chaincode</p>
        <p className="text-xs text-gray-400 mt-1">Deployed on both peers | Manages certificate lifecycle</p>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {["CreateCertificate", "ReadCertificate", "UpdateCertificate", "VerifyCertificate", "RevokeCertificate", "GetAllCertificates"].map((fn) => (
            <span key={fn} className="text-xs font-mono text-green-300 bg-gray-800 px-2 py-0.5 rounded">{fn}()</span>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Both organizations must endorse transactions. The orderer sequences them into blocks on the shared ledger.
      </p>
    </div>
  );
}

// ─── Step-by-Step Process ────────────────────────────────────────────
function StepByStep() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "University Submits Certificate Data",
      desc: "An authorized university enters the student's certificate information through the frontend: Certificate ID, student name, university, department, course, CGPA, and issue date.",
      visual: (
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-1.5 text-sm">
          <p><span className="text-gray-500">Certificate ID:</span> <span className="text-gray-200">CERT-2024-001</span></p>
          <p><span className="text-gray-500">Name:</span> <span className="text-gray-200">John Doe</span></p>
          <p><span className="text-gray-500">University:</span> <span className="text-gray-200">MIT University</span></p>
          <p><span className="text-gray-500">Department:</span> <span className="text-gray-200">Computer Science</span></p>
          <p><span className="text-gray-500">Course:</span> <span className="text-gray-200">Blockchain Fundamentals</span></p>
          <p><span className="text-gray-500">CGPA:</span> <span className="text-gray-200">3.85</span></p>
          <p><span className="text-gray-500">Issue Date:</span> <span className="text-gray-200">2024-01-15</span></p>
        </div>
      ),
    },
    {
      title: "SHA-256 Hash is Generated",
      desc: "The backend concatenates all certificate fields and passes them through the SHA-256 hash function. This creates a unique 64-character hexadecimal fingerprint for the certificate.",
      visual: (
        <div className="text-center space-y-3">
          <div className="bg-gray-800/50 rounded-lg p-3 text-sm text-gray-300 font-mono text-xs">
            "CERT-2024-001" + "John Doe" + "MIT University" + "Computer Science" + "Blockchain Fundamentals" + "3.85" + "2024-01-15"
          </div>
          <div className="text-indigo-400 text-xl">&#x2193; SHA-256</div>
          <div className="bg-indigo-950/50 border border-indigo-800 rounded-lg p-3 font-mono text-xs text-indigo-400 break-all">
            a7b3f9c2d1e4f5a6b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1
          </div>
        </div>
      ),
    },
    {
      title: "Transaction Submitted to Fabric Network",
      desc: "The Express backend sends the certificate data and hash to the Hyperledger Fabric network via gRPC. The transaction goes through the endorsement process — both Org1 and Org2 peers validate and sign it.",
      visual: (
        <div className="bg-gray-800/50 rounded-lg p-4 text-sm space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">&#9889;</span>
            <span className="text-gray-300">Proposal sent to endorsing peers...</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">&#x2713;</span>
            <span className="text-gray-300">Peer0.Org1 endorsed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">&#x2713;</span>
            <span className="text-gray-300">Peer0.Org2 endorsed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">&#x2713;</span>
            <span className="text-gray-300">Orderer committed to ledger</span>
          </div>
        </div>
      ),
    },
    {
      title: "Data Stored on Fabric Ledger",
      desc: "The CertificateContract chaincode stores the certificate in the world state with status 'valid'. The transaction is recorded in the immutable blockchain ledger. Unlike public blockchains, there are no gas fees.",
      visual: (
        <div className="bg-gray-800/50 rounded-lg p-4 text-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">World State (CouchDB)</p>
          <div className="font-mono text-xs space-y-1 text-gray-400">
            <p>{"{"}</p>
            <p className="pl-4">"certificateID": "CERT-2024-001",</p>
            <p className="pl-4">"studentName": "John Doe",</p>
            <p className="pl-4">"university": "MIT University",</p>
            <p className="pl-4">"hash": "a7b3f9...f0a1",</p>
            <p className="pl-4">"status": <span className="text-green-400">"valid"</span></p>
            <p>{"}"}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Verification via Data or OCR",
      desc: "To verify, users can either enter the certificate data manually (the system regenerates the hash and compares it) or upload a certificate image — Tesseract.js extracts the text via OCR, generates the hash, and the chaincode checks it against the ledger.",
      visual: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-center">
              <p className="text-gray-500 mb-1">Method 1: Manual Entry</p>
              <p className="text-gray-300">Enter certificate fields</p>
              <p className="font-mono text-indigo-400 mt-1">&#x2192; SHA-256 &#x2192; compare</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-center">
              <p className="text-gray-500 mb-1">Method 2: Image Upload</p>
              <p className="text-gray-300">OCR extracts text</p>
              <p className="font-mono text-indigo-400 mt-1">&#x2192; SHA-256 &#x2192; compare</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-green-950/30 border border-green-800 rounded-lg p-3 text-center">
              <p className="text-gray-500 mb-1">Stored Hash (Ledger)</p>
              <p className="font-mono text-green-400">a7b3f9...f0a1</p>
            </div>
            <div className="bg-green-950/30 border border-green-800 rounded-lg p-3 text-center">
              <p className="text-gray-500 mb-1">Regenerated Hash</p>
              <p className="font-mono text-green-400">a7b3f9...f0a1</p>
            </div>
          </div>
          <div className="text-center text-green-400 font-semibold">&#x2713; Match + Status "valid" = Certificate Authentic</div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      {/* Progress bar */}
      <div className="flex gap-1 mb-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors cursor-pointer ${
              i <= step ? "bg-indigo-500" : "bg-gray-700"
            }`}
            onClick={() => setStep(i)}
          />
        ))}
      </div>

      <div className="min-h-[280px]">
        <p className="text-xs text-indigo-400 uppercase tracking-wider mb-1">Step {step + 1} of {steps.length}</p>
        <h4 className="text-white font-semibold mb-2">{steps[step].title}</h4>
        <p className="text-sm text-gray-400 mb-4">{steps[step].desc}</p>
        {steps[step].visual}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="text-sm text-gray-400 hover:text-white disabled:text-gray-700 disabled:cursor-not-allowed transition-colors"
        >
          &larr; Previous
        </button>
        <button
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
          className="text-sm text-indigo-400 hover:text-indigo-300 disabled:text-gray-700 disabled:cursor-not-allowed transition-colors"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}

// ─── Traditional vs Blockchain Comparison ────────────────────────────
function Comparison() {
  const rows = [
    { aspect: "Storage", traditional: "University database (single server)", blockchain: "Distributed across organization peers" },
    { aspect: "Tampering", traditional: "Admin can modify records", blockchain: "Immutable — no one can alter stored data" },
    { aspect: "Verification", traditional: "Contact university, wait days", blockchain: "Instant hash-based verification" },
    { aspect: "Single Point of Failure", traditional: "Server crash = data lost", blockchain: "Replicated across multiple peers" },
    { aspect: "Trust", traditional: "Trust the university alone", blockchain: "Multi-org consensus (Org1 + Org2)" },
    { aspect: "Cost", traditional: "Maintenance & infrastructure", blockchain: "No gas fees (permissioned network)" },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="grid grid-cols-3 text-xs uppercase tracking-wider font-semibold border-b border-gray-800">
        <div className="p-3 text-gray-500"></div>
        <div className="p-3 text-red-400 text-center bg-red-950/10">Traditional</div>
        <div className="p-3 text-green-400 text-center bg-green-950/10">Hyperledger Fabric</div>
      </div>
      {rows.map((row, i) => (
        <div key={i} className={`grid grid-cols-3 text-sm ${i < rows.length - 1 ? "border-b border-gray-800/50" : ""}`}>
          <div className="p-3 text-gray-400 font-medium">{row.aspect}</div>
          <div className="p-3 text-gray-400 text-center bg-red-950/5">{row.traditional}</div>
          <div className="p-3 text-gray-300 text-center bg-green-950/5">{row.blockchain}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function HowItWorks() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">How It Works</h2>
      <p className="text-sm text-gray-400 mb-8">
        An interactive guide to how this system uses Hyperledger Fabric (private blockchain) and SHA-256 hashing to make certificates tamper-proof and verifiable.
      </p>

      <Section number={1} title="System Architecture">
        <ArchitectureDiagram />
      </Section>

      <Section number={2} title="The Verification Flow">
        <FlowDiagram />
      </Section>

      <Section number={3} title="Step-by-Step: Certificate Lifecycle">
        <StepByStep />
      </Section>

      <Section number={4} title="Try It: Live SHA-256 Hash Generation">
        <LiveHashDemo />
      </Section>

      <Section number={5} title="Try It: Tamper Detection">
        <TamperDemo />
      </Section>

      <Section number={6} title="Fabric Network Structure">
        <FabricNetworkVisualization />
      </Section>

      <Section number={7} title="Why Blockchain? Traditional vs Fabric">
        <Comparison />
      </Section>

      {/* Key Concepts */}
      <Section number={8} title="Key Concepts">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Concept
            icon="&#x1F9E9;"
            title="SHA-256 Hash Function"
            desc="A cryptographic function that converts any data into a fixed 64-character hex string. The same input always produces the same output, but you can't reverse it to get the original data."
          />
          <Concept
            icon="&#x1F4DC;"
            title="Chaincode (Smart Contract)"
            desc="A program deployed on Hyperledger Fabric peers. Our CertificateContract chaincode handles creating, reading, updating, verifying, and revoking certificates automatically."
          />
          <Concept
            icon="&#x26D3;"
            title="Immutable Ledger"
            desc="Once a transaction is committed to the Fabric ledger, it cannot be changed or deleted. Every certificate action is permanently recorded, making tampering detectable."
          />
          <Concept
            icon="&#x1F3E2;"
            title="Permissioned Network"
            desc="Unlike public blockchains, Hyperledger Fabric is a private network. Only authorized organizations (Org1, Org2) can participate, endorse transactions, and access the ledger."
          />
        </div>
      </Section>
    </div>
  );
}

function Concept({ icon, title, desc }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <p className="text-xl mb-2">{icon}</p>
      <p className="font-medium text-white text-sm mb-1">{title}</p>
      <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
