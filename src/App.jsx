// App.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// -----------------------------
// NAPSA Verification Manager Agent
// -----------------------------
// Ready-to-run single file (React + Framer Motion)
// Paste into CodeSandbox → add "framer-motion" dependency → Run.
// -----------------------------

const COLORS = ["#7c3aed", "#ef4444", "#06b6d4", "#10b981", "#f59e0b"];

function prettyDate(d) {
  return new Date(d).toLocaleString();
}

export default function NAPSAVerificationManagerAgentApp() {
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [suspicious, setSuspicious] = useState(false);
  const [atAgentLocation, setAtAgentLocation] = useState(false);
  const [kycStartedAt, setKycStartedAt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [customerAnswers, setCustomerAnswers] = useState({});
  const [forceFailure, setForceFailure] = useState(false);

  useEffect(() => {
    pushLog(
      "Agent: Ready — ask me to verify your annual KYC or issue your Life Certificate."
    );
  }, []);

  function pushLog(text) {
    setLogs((l) => [...l, { t: new Date().toLocaleTimeString(), text }]);
  }

  function startFlow() {
    setLogs([]);
    setRunning(true);
    setVerificationResult(null);
    setSuspicious(false);
    setQuestions([]);
    setCustomerAnswers({});
    pushLog("Agent: Hello! What would you like me to do?");
    setTimeout(() => pushLog("Customer: Verify my annual KYC and issue life certificate."), 700);
    setTimeout(
      () =>
        pushLog(
          "Agent: Do you want to proceed with Video KYC or Biometrics at agent location?"
        ),
      1400
    );
    setRunning(false);
  }

  function chooseMode(agentLocation) {
    setAtAgentLocation(agentLocation);
    pushLog(
      `Customer: I'll ${
        agentLocation ? "use biometrics at the agent location" : "do Video KYC (remote)"
      }.`
    );
    pushLog("Agent: Initiating verification sequence...");
    setKycStartedAt(new Date().toISOString());
    simulateKyc(agentLocation);
  }

  // 🧠 Updated simulateKyc() to respect forceFailure toggle
  function simulateKyc(agentLocation) {
    setRunning(true);
    setVerificationResult(null);
    setSuspicious(false);

    setTimeout(
      () => pushLog("Video KYC Agent: Capturing live video & facescan (simulated)..."),
      700
    );
    setTimeout(
      () => pushLog("Biometrics Agent: Reading fingerprint/IRIS if present (simulated)..."),
      1400
    );

    const baseChance = agentLocation ? 0.05 : 0.18;
    const isSuspicious = forceFailure ? true : Math.random() < baseChance;

    setTimeout(() => {
      if (!isSuspicious) {
        pushLog(
          "Agent: Verification successful. Updating iCARE platform and issuing life certificate..."
        );
        setVerificationResult({
          success: true,
          at: new Date().toISOString(),
          note: "Verified automatically"
        });
        setSuspicious(false);
      } else {
        pushLog(
          "Agent: Verification produced suspicious signals. Asking follow-up questions..."
        );
        setSuspicious(true);
        setQuestions([
          "Please confirm your full name as per ID:",
          "Please provide your last 3 employment locations:",
          "Do you recognize these recent transactions on your account? (yes/no)"
        ]);
      }
      setRunning(false);
    }, 2600);
  }

  function answerQuestion(idx, value) {
    setCustomerAnswers((c) => ({ ...c, [idx]: value }));
  }

  function submitAnswers() {
    pushLog("Customer: Submitted follow-up answers.");
    setRunning(true);
    setTimeout(() => pushLog("Agent: Re-running verification with additional inputs..."), 800);
    setTimeout(() => {
      const cleared = !forceFailure && Math.random() < 0.5; // half chance if not forced
      if (cleared) {
        pushLog(
          "Agent: Additional information cleared the suspicious flags. Verification successful. Updating iCARE."
        );
        setVerificationResult({
          success: true,
          at: new Date().toISOString(),
          note: "Cleared after follow-up"
        });
        setSuspicious(false);
      } else {
        pushLog(
          "Agent: Verification still unsuccessful. Please visit a NAPSA office for in-person verification. Notifying NAPSA staff..."
        );
        setVerificationResult({
          success: false,
          at: new Date().toISOString(),
          note: "Unresolved. In-person required"
        });
        setTimeout(() => pushLog("Notification: NAPSA staff alerted for manual follow-up."), 600);
      }
      setRunning(false);
    }, 2000);
  }

  function downloadCertificate() {
    if (!verificationResult || !verificationResult.success) return;
    const cert = {
      id: `LC-${Date.now()}`,
      issuedAt: new Date().toISOString(),
      note: verificationResult.note
    };
    const blob = new Blob([JSON.stringify(cert, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cert.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushLog("Agent: Life Certificate downloaded (JSON).");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#f8fafc,#eef2ff)",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: 24
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 1000, margin: "0 auto" }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background: COLORS[0],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 28
              }}
            >
              🛂
            </div>
            <div>
              <h1 style={{ margin: 0 }}>NAPSA Verification Manager Agent</h1>
              <div style={{ color: "#475569" }}>
                Annual KYC & Life Certificate — Video KYC + Biometrics simulation
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={startFlow}
              disabled={running}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "none",
                background: COLORS[2],
                color: "white",
                cursor: running ? "not-allowed" : "pointer",
                fontWeight: 600
              }}
            >
              {running ? "Working..." : "Start Verification"}
            </button>
          </div>
        </header>

        <main
          style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}
        >
          {/* Sidebar */}
          <aside
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 12,
              boxShadow: "0 6px 18px rgba(2,6,23,0.06)"
            }}
          >
            <h3 style={{ marginTop: 0 }}>Actions</h3>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ fontSize: 13, color: "#475569" }}>Mode</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => chooseMode(false)}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 10,
                    border: "none",
                    background: COLORS[1],
                    color: "white"
                  }}
                >
                  Video KYC (Remote)
                </button>
                <button
                  onClick={() => chooseMode(true)}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 10,
                    border: "none",
                    background: COLORS[3],
                    color: "white"
                  }}
                >
                  Biometrics (Agent Location)
                </button>
              </div>

              {/* 🔘 Force failure toggle */}
              <div style={{ marginTop: 10 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13
                  }}
                >
                  <input
                    type="checkbox"
                    checked={forceFailure}
                    onChange={(e) => setForceFailure(e.target.checked)}
                  />
                  Force Unsuccessful Case
                </label>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                  KYC started at
                </div>
                <div style={{ fontWeight: 700 }}>
                  {kycStartedAt ? prettyDate(kycStartedAt) : "—"}
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                  Verification Result
                </div>
                <div style={{ fontWeight: 700 }}>
                  {verificationResult
                    ? verificationResult.success
                      ? "Successful"
                      : "Unsuccessful"
                    : "Pending"}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <button
                  onClick={downloadCertificate}
                  disabled={!verificationResult || !verificationResult.success}
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    border: "none",
                    background:
                      verificationResult && verificationResult.success
                        ? COLORS[0]
                        : "#e2e8f0",
                    color: "white"
                  }}
                >
                  Download Life Certificate
                </button>
              </div>
            </div>
          </aside>

          {/* Main section */}
          <section
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 12,
              boxShadow: "0 6px 18px rgba(2,6,23,0.04)"
            }}
          >
            <h3 style={{ marginTop: 0 }}>Conversation & Verification Flow</h3>
            <div
              style={{
                height: 360,
                overflow: "auto",
                borderRadius: 10,
                padding: 12,
                border: "1px solid #eef2ff",
                background: "linear-gradient(180deg,#ffffff,#fbfdff)"
              }}
            >
              <AnimatePresence>
                {logs.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ color: "#94a3b8" }}
                  >
                    Agent ready. Click <strong>Start Verification</strong> to
                    begin.
                  </motion.div>
                )}
                {logs.map((l, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ marginBottom: 10 }}
                  >
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{l.t}</div>
                    <div>{l.text}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Suspicious follow-up */}
            {suspicious && (
              <div style={{ marginTop: 16 }}>
                <h4 style={{ marginBottom: 8 }}>Follow-up Questions</h4>
                <div style={{ display: "grid", gap: 8 }}>
                  {questions.map((q, idx) => (
                    <div key={idx} style={{ display: "grid", gap: 6 }}>
                      <div style={{ fontSize: 13 }}>{q}</div>
                      <input
                        value={customerAnswers[idx] ?? ""}
                        onChange={(e) => answerQuestion(idx, e.target.value)}
                        placeholder="Type your answer"
                        style={{
                          padding: 8,
                          borderRadius: 8,
                          border: "1px solid #e6eef8"
                        }}
                      />
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={submitAnswers}
                      style={{
                        padding: 10,
                        borderRadius: 10,
                        border: "none",
                        background: COLORS[0],
                        color: "white"
                      }}
                    >
                      Submit Answers
                    </button>
                    <button
                      onClick={() => {
                        pushLog(
                          "Customer: I will visit a NAPSA office for in-person verification."
                        );
                        setVerificationResult({
                          success: false,
                          at: new Date().toISOString(),
                          note: "User opted for in-person"
                        });
                        pushLog("Agent: NAPSA offices notified for follow-up.");
                      }}
                      style={{
                        padding: 10,
                        borderRadius: 10,
                        border: "1px solid #e2e8f0",
                        background: "white"
                      }}
                    >
                      Schedule Visit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Result Display */}
            {verificationResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  marginTop: 16,
                  padding: 12,
                  borderRadius: 8,
                  background: verificationResult.success
                    ? "#ecfeff"
                    : "#fff1f2",
                  border: verificationResult.success
                    ? "1px solid #c7f9f9"
                    : "1px solid #fee2e2"
                }}
              >
                <div style={{ fontWeight: 700 }}>
                  {verificationResult.success
                    ? "Verification Successful"
                    : "Verification Unsuccessful"}
                </div>
                <div style={{ color: "#475569", marginTop: 6 }}>
                  Note: {verificationResult.note}
                </div>
                <div style={{ color: "#94a3b8", marginTop: 6 }}>
                  Timestamp: {prettyDate(verificationResult.at)}
                </div>
              </motion.div>
            )}
          </section>
        </main>

        <footer
          style={{ marginTop: 24, textAlign: "center", color: "#94a3b8" }}
        >
          NAPSA Verification Manager Agent • React + Framer Motion •
          CodeSandbox Ready
        </footer>
      </motion.div>
    </div>
  );
}
