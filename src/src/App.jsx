import React, { useState, useEffect, useRef } from "react";
import { Mail, ArrowRight, Sun, Sparkles, Droplets, Shield, Wind, Moon, Check, X, RefreshCw, ChevronLeft, Heart } from "lucide-react";

// ---------------------------------------------
// AURA — skin & self-care concern advisor
// ---------------------------------------------
// NOTE: Real email delivery requires a backend (this environment
// has no server / SMTP access). The OTP below is generated
// client-side and revealed in a "dev peek" banner so the full
// flow can be tested. Swap generateAndShowOtp() for a real API
// call (Firebase Auth / Supabase / SendGrid) in production.

const CONCERNS = [
  {
    id: "tan",
    label: "Tan removal",
    icon: Sun,
    color: "#C97B4A",
    tagline: "Even things out, gently",
    products: [
      { name: "Vitamin C brightening serum", note: "Mornings, under sunscreen — fades uneven tone over 4–6 weeks." },
      { name: "AHA/BHA exfoliating toner", note: "2–3x a week to clear dead, sun-dulled skin cells." },
      { name: "Mineral SPF 50 sunscreen", note: "Non-negotiable. Reapply every 3 hours outdoors." },
      { name: "De-tan clay mask", note: "Weekly, on damp skin, 10 minutes — great for arms & neck too." },
    ],
    routine: ["Cleanse", "Vitamin C serum (AM)", "SPF 50", "PM: exfoliate 2–3x/week", "Weekly clay mask"],
  },
  {
    id: "glow",
    label: "Glow up",
    icon: Sparkles,
    color: "#D9A85C",
    tagline: "Radiance, from the inside out",
    products: [
      { name: "Hyaluronic acid serum", note: "Damp skin, morning & night — plumps and hydrates instantly." },
      { name: "Vitamin E facial oil", note: "Lock in moisture at night for a natural sheen." },
      { name: "Gentle enzyme peel", note: "Weekly — smooths texture without irritation." },
      { name: "Rosewater face mist", note: "Midday refresh, sets makeup and revives dull skin." },
    ],
    routine: ["Double cleanse (PM)", "Hyaluronic serum", "Moisturizer", "Facial oil (PM)", "Weekly enzyme peel"],
  },
  {
    id: "hygiene",
    label: "Hygiene",
    icon: Droplets,
    color: "#7C9885",
    tagline: "Fresh, clean, consistent",
    products: [
      { name: "pH-balanced body wash", note: "Sulfate-free — keeps skin's natural barrier intact." },
      { name: "Antibacterial hand gel", note: "Carry-size, use after commute or public transit." },
      { name: "Charcoal deodorant stick", note: "Aluminum-free option, reapply after workouts." },
      { name: "Tea tree scalp scrub", note: "Weekly — controls oil and odor at the roots." },
    ],
    routine: ["Shower AM & after workouts", "Deodorant daily", "Scalp scrub weekly", "Fresh clothing daily"],
  },
  {
    id: "acne",
    label: "Acne & breakouts",
    icon: Shield,
    color: "#B3654A",
    tagline: "Calm, clear, controlled",
    products: [
      { name: "Salicylic acid cleanser", note: "AM & PM — unclogs pores without over-drying." },
      { name: "Niacinamide serum", note: "Reduces redness and oil production over time." },
      { name: "Spot treatment gel", note: "Benzoyl peroxide, dab directly on active breakouts." },
      { name: "Oil-free moisturizer", note: "Non-comedogenic, essential even for oily skin." },
    ],
    routine: ["Salicylic cleanser", "Niacinamide serum", "Spot treat as needed", "Oil-free moisturizer", "SPF daily"],
  },
  {
    id: "hair",
    label: "Hair care",
    icon: Wind,
    color: "#8B7BAB",
    tagline: "Strength and shine",
    products: [
      { name: "Sulfate-free shampoo", note: "2–3x weekly to avoid stripping natural oils." },
      { name: "Argan oil hair mask", note: "Weekly deep condition for dryness & frizz." },
      { name: "Scalp massage serum", note: "Nightly, boosts circulation for growth." },
      { name: "Heat protectant spray", note: "Always before styling tools." },
    ],
    routine: ["Wash 2–3x/week", "Weekly hair mask", "Nightly scalp serum", "Heat protectant before styling"],
  },
  {
    id: "sleep",
    label: "Under-eye & rest",
    icon: Moon,
    color: "#5B6FA8",
    tagline: "Recover while you rest",
    products: [
      { name: "Caffeine eye cream", note: "AM & PM, gently pat — reduces puffiness." },
      { name: "Silk pillowcase", note: "Reduces friction lines and hair breakage overnight." },
      { name: "Cooling gel eye patches", note: "10 minutes before bed for tired eyes." },
      { name: "Magnesium sleep spray", note: "On pillow — supports deeper, uninterrupted sleep." },
    ],
    routine: ["Eye cream AM & PM", "Gel patches 2x/week", "Consistent sleep schedule", "Silk pillowcase"],
  },
];

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function AuraApp() {
  const [stage, setStage] = useState("email"); // email | otp | home | concern
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [realOtp, setRealOtp] = useState("");
  const [error, setError] = useState("");
  const [selectedConcern, setSelectedConcern] = useState(null);
  const [savedRoutines, setSavedRoutines] = useState([]);
  const [toast, setToast] = useState("");
  const otpRefs = useRef([]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 2200);
      return () => clearTimeout(t);
    }
  }, [toast]);

  function isValidEmail(v) {
    return /^[^\s@]+@(gmail\.com)$/i.test(v.trim());
  }

  function handleSendCode(e) {
    e.preventDefault();
    setError("");
    if (!isValidEmail(email)) {
      setError("Enter a valid Gmail address to continue.");
      return;
    }
    const code = generateOtp();
    setRealOtp(code);
    setOtpInput("");
    setStage("otp");
  }

  function handleVerify(e) {
    e.preventDefault();
    if (otpInput.trim() === realOtp) {
      setError("");
      setStage("home");
    } else {
      setError("That code doesn't match. Check the dev peek banner and try again.");
    }
  }

  function toggleSaveRoutine(concernId) {
    setSavedRoutines((prev) => {
      const has = prev.includes(concernId);
      const next = has ? prev.filter((c) => c !== concernId) : [...prev, concernId];
      setToast(has ? "Removed from your routines" : "Saved to your routines");
      return next;
    });
  }

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .aura-input:focus { outline: 2px solid #D9A85C; outline-offset: 2px; }
        .aura-btn:focus-visible { outline: 2px solid #F5EDE4; outline-offset: 2px; }
        .concern-card:focus-visible { outline: 2px solid #D9A85C; outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes orbPulse { 0%,100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.06); opacity: 1; } }
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>

      {toast && <div style={styles.toast}>{toast}</div>}

      {stage === "email" && (
        <div style={styles.centerScreen}>
          <div style={{ ...styles.card, animation: "fadeUp 0.5s ease" }}>
            <div style={styles.brandRow}>
              <div style={styles.orb} />
              <span style={styles.brandName}>AURA</span>
            </div>
            <h1 style={styles.h1}>Know what your skin needs.</h1>
            <p style={styles.subtext}>
              Sign in with your Gmail to get product picks tuned to your concerns — tan, glow, hygiene, and more.
            </p>

            <form onSubmit={handleSendCode} style={{ marginTop: 28 }}>
              <label style={styles.label} htmlFor="email">Gmail address</label>
              <div style={styles.inputWrap}>
                <Mail size={18} color="#A8949E" style={{ flexShrink: 0 }} />
                <input
                  id="email"
                  className="aura-input"
                  type="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  autoComplete="email"
                />
              </div>
              {error && <div style={styles.errorText}>{error}</div>}
              <button type="submit" className="aura-btn" style={styles.primaryBtn}>
                Send code <ArrowRight size={16} />
              </button>
            </form>
            <p style={styles.finePrint}>Only Gmail addresses are accepted for sign-in.</p>
          </div>
        </div>
      )}

      {stage === "otp" && (
        <div style={styles.centerScreen}>
          <div style={{ ...styles.card, animation: "fadeUp 0.5s ease" }}>
            <button
              onClick={() => setStage("email")}
              className="aura-btn"
              style={styles.backBtn}
              aria-label="Back to email"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <div style={styles.brandRow}>
              <div style={styles.orb} />
              <span style={styles.brandName}>AURA</span>
            </div>
            <h1 style={styles.h1}>Enter your code</h1>
            <p style={styles.subtext}>We sent a 6-digit code to <b style={{ color: "#F5EDE4" }}>{email}</b>.</p>

            <div style={styles.devBanner}>
              <span style={{ opacity: 0.8 }}>Dev peek (no real email was sent):</span>
              <span style={styles.devCode}>{realOtp}</span>
            </div>

            <form onSubmit={handleVerify} style={{ marginTop: 20 }}>
              <label style={styles.label} htmlFor="otp">6-digit code</label>
              <input
                id="otp"
                className="aura-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••••"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                style={{ ...styles.input, ...styles.otpBox, width: "100%" }}
              />
              {error && <div style={styles.errorText}>{error}</div>}
              <button type="submit" className="aura-btn" style={styles.primaryBtn}>
                Verify & continue <Check size={16} />
              </button>
              <button
                type="button"
                className="aura-btn"
                style={styles.ghostBtn}
                onClick={() => {
                  const code = generateOtp();
                  setRealOtp(code);
                  setToast("New code sent");
                }}
              >
                <RefreshCw size={14} /> Resend code
              </button>
            </form>
          </div>
        </div>
      )}

      {(stage === "home" || stage === "concern") && (
        <div style={styles.appShell}>
          <header style={styles.header}>
            <div style={styles.brandRow}>
              <div style={styles.orb} />
              <span style={styles.brandName}>AURA</span>
            </div>
            <div style={styles.userChip}>
              <div style={styles.avatar}>{email.charAt(0).toUpperCase()}</div>
              <span style={styles.userEmail}>{email}</span>
            </div>
          </header>

          {stage === "home" && (
            <main style={styles.main}>
              <h1 style={styles.homeTitle}>What are we working on today?</h1>
              <p style={styles.subtext}>Pick a concern — I'll line up a routine and products for it.</p>

              <div style={styles.dialGrid}>
                {CONCERNS.map((c) => {
                  const Icon = c.icon;
                  const saved = savedRoutines.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      className="concern-card"
                      style={{ ...styles.concernCard, borderColor: c.color + "55" }}
                      onClick={() => {
                        setSelectedConcern(c);
                        setStage("concern");
                      }}
                    >
                      <div style={{ ...styles.concernIconWrap, background: c.color + "22" }}>
                        <Icon size={22} color={c.color} />
                      </div>
                      <div style={{ flex: 1, textAlign: "left" }}>
                        <div style={styles.concernLabel}>{c.label}</div>
                        <div style={styles.concernTagline}>{c.tagline}</div>
                      </div>
                      {saved && <Heart size={16} color={c.color} fill={c.color} />}
                    </button>
                  );
                })}
              </div>

              {savedRoutines.length > 0 && (
                <div style={{ marginTop: 36 }}>
                  <h2 style={styles.sectionTitle}>Your saved routines</h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                    {savedRoutines.map((id) => {
                      const c = CONCERNS.find((x) => x.id === id);
                      return (
                        <span key={id} style={{ ...styles.savedPill, borderColor: c.color + "66", color: c.color }}>
                          {c.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </main>
          )}

          {stage === "concern" && selectedConcern && (
            <main style={styles.main}>
              <button className="aura-btn" style={styles.backBtn} onClick={() => setStage("home")}>
                <ChevronLeft size={16} /> All concerns
              </button>

              <div style={styles.concernHero}>
                <div style={{ ...styles.concernIconWrap, background: selectedConcern.color + "22", width: 52, height: 52 }}>
                  <selectedConcern.icon size={26} color={selectedConcern.color} />
                </div>
                <div>
                  <h1 style={{ ...styles.homeTitle, marginBottom: 2 }}>{selectedConcern.label}</h1>
                  <p style={{ ...styles.subtext, margin: 0 }}>{selectedConcern.tagline}</p>
                </div>
                <button
                  onClick={() => toggleSaveRoutine(selectedConcern.id)}
                  className="aura-btn"
                  style={{ ...styles.saveBtn, marginLeft: "auto", borderColor: selectedConcern.color }}
                  aria-label="Save routine"
                >
                  <Heart
                    size={18}
                    color={selectedConcern.color}
                    fill={savedRoutines.includes(selectedConcern.id) ? selectedConcern.color : "none"}
                  />
                </button>
              </div>

              <h2 style={styles.sectionTitle}>Recommended products</h2>
              <div style={styles.productList}>
                {selectedConcern.products.map((p, i) => (
                  <div key={i} style={styles.productRow}>
                    <div style={{ ...styles.productDot, background: selectedConcern.color }} />
                    <div>
                      <div style={styles.productName}>{p.name}</div>
                      <div style={styles.productNote}>{p.note}</div>
                    </div>
                  </div>
                ))}
              </div>

              <h2 style={styles.sectionTitle}>Daily routine</h2>
              <ol style={styles.routineList}>
                {selectedConcern.routine.map((step, i) => (
                  <li key={i} style={styles.routineStep}>
                    <span style={{ ...styles.routineIndex, color: selectedConcern.color }}>{String(i + 1).padStart(2, "0")}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </main>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    width: "100%",
    background: "#1B1420",
    color: "#F5EDE4",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
  },
  centerScreen: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#241A2C",
    border: "1px solid #3A2C42",
    borderRadius: 20,
    padding: "32px 28px",
    position: "relative",
  },
  brandRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 22 },
  orb: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "radial-gradient(circle at 30% 30%, #F2C9B0, #D9A85C 45%, #C97B4A 100%)",
    boxShadow: "0 0 14px 2px rgba(217,168,92,0.55)",
    animation: "orbPulse 3s ease-in-out infinite",
  },
  brandName: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 18, letterSpacing: 2 },
  h1: { fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 26, lineHeight: 1.25, margin: "0 0 10px" },
  subtext: { color: "#A8949E", fontSize: 14.5, lineHeight: 1.55, margin: 0 },
  label: { display: "block", fontSize: 12.5, color: "#A8949E", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.6 },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#1B1420",
    border: "1px solid #3A2C42",
    borderRadius: 12,
    padding: "12px 14px",
  },
  input: { flex: 1, background: "transparent", border: "none", color: "#F5EDE4", fontSize: 15, fontFamily: "'Inter', sans-serif" },
  otpBox: { fontFamily: "'JetBrains Mono', monospace", fontSize: 22, letterSpacing: 10, textAlign: "center", padding: "14px 14px", background: "#1B1420", border: "1px solid #3A2C42", borderRadius: 12 },
  errorText: { color: "#E38B7A", fontSize: 13, marginTop: 10 },
  primaryBtn: {
    width: "100%",
    marginTop: 18,
    padding: "13px 18px",
    background: "linear-gradient(120deg, #D9A85C, #C97B4A)",
    border: "none",
    borderRadius: 12,
    color: "#1B1420",
    fontWeight: 600,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
  },
  ghostBtn: {
    width: "100%",
    marginTop: 10,
    padding: "11px 18px",
    background: "transparent",
    border: "1px solid #3A2C42",
    borderRadius: 12,
    color: "#A8949E",
    fontSize: 13.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    cursor: "pointer",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "transparent",
    border: "none",
    color: "#A8949E",
    fontSize: 13.5,
    cursor: "pointer",
    marginBottom: 16,
    padding: 0,
  },
  finePrint: { fontSize: 12, color: "#6E5E77", marginTop: 16, textAlign: "center" },
  devBanner: {
    marginTop: 18,
    background: "#2E2138",
    border: "1px dashed #6B5B7B",
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 12.5,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    color: "#C9B8D1",
  },
  devCode: { fontFamily: "'JetBrains Mono', monospace", fontSize: 20, letterSpacing: 6, color: "#F5EDE4" },
  appShell: { maxWidth: 720, margin: "0 auto", padding: "0 20px 60px" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0" },
  userChip: { display: "flex", alignItems: "center", gap: 8 },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "#3A2C42",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace",
  },
  userEmail: { fontSize: 13, color: "#A8949E" },
  main: { animation: "fadeUp 0.4s ease" },
  homeTitle: { fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 26, margin: "0 0 6px" },
  dialGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 26 },
  concernCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#241A2C",
    border: "1px solid",
    borderRadius: 16,
    padding: "16px 14px",
    cursor: "pointer",
    textAlign: "left",
  },
  concernIconWrap: { width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  concernLabel: { fontSize: 14.5, fontWeight: 600, color: "#F5EDE4" },
  concernTagline: { fontSize: 12, color: "#A8949E", marginTop: 2 },
  sectionTitle: { fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 500, marginTop: 32, marginBottom: 4 },
  savedPill: { fontSize: 12.5, border: "1px solid", borderRadius: 999, padding: "6px 12px" },
  concernHero: { display: "flex", alignItems: "center", gap: 14, marginTop: 6, marginBottom: 8 },
  saveBtn: { width: 42, height: 42, borderRadius: 12, background: "transparent", border: "1px solid", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  productList: { display: "flex", flexDirection: "column", gap: 14, marginTop: 14 },
  productRow: { display: "flex", gap: 12, alignItems: "flex-start" },
  productDot: { width: 8, height: 8, borderRadius: "50%", marginTop: 6, flexShrink: 0 },
  productName: { fontSize: 14.5, fontWeight: 600 },
  productNote: { fontSize: 13, color: "#A8949E", marginTop: 2, lineHeight: 1.45 },
  routineList: { listStyle: "none", padding: 0, margin: "14px 0 0", display: "flex", flexDirection: "column", gap: 10 },
  routineStep: { display: "flex", alignItems: "center", gap: 12, fontSize: 14, background: "#241A2C", border: "1px solid #3A2C42", borderRadius: 12, padding: "12px 14px" },
  routineIndex: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, fontWeight: 600 },
  toast: {
    position: "fixed",
    bottom: 24,
    left: "50%",
    background: "#F5EDE4",
    color: "#1B1420",
    padding: "10px 18px",
    borderRadius: 999,
    fontSize: 13.5,
    fontWeight: 600,
    zIndex: 50,
    animation: "toastIn 0.25s ease",
  },
};
