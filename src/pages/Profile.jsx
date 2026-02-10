import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3, User, FileText, ChevronRight, ChevronLeft, X,
  Settings, HelpCircle, LogOut, Shield, Bell, Save,
  Loader2, Eye, EyeOff, Trash2, Info, MessageCircle,
  ExternalLink, Mail, Lock, Globe, Moon, Sun,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { db } from "../firebase";
import TinubuInsignia, { InsigniaWatermark } from "../components/TinubuInsignia";

/* ─── reusable slide-in panel ─── */
const Panel = ({ title, open, onClose, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "var(--off-white)", zIndex: 100,
          maxWidth: "var(--max-width)", margin: "0 auto",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{
          padding: "16px 20px", display: "flex", alignItems: "center",
          gap: 12, borderBottom: "1px solid var(--mid-gray)", background: "#fff",
        }}>
          <button onClick={onClose} style={{
            border: "none", background: "none", cursor: "pointer",
            display: "flex", padding: 4,
          }}>
            <ChevronLeft size={22} color="var(--primary-green)" />
          </button>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", flex: 1 }}>
            {title}
          </h2>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {children}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─── toggle switch ─── */
const Toggle = ({ value, onChange, disabled }) => (
  <button
    onClick={() => !disabled && onChange(!value)}
    style={{
      width: 48, height: 28, borderRadius: 14,
      background: value ? "var(--primary-green)" : "var(--mid-gray)",
      border: "none", cursor: disabled ? "default" : "pointer",
      position: "relative", transition: "background 0.2s", flexShrink: 0,
      opacity: disabled ? 0.5 : 1,
    }}
  >
    <div style={{
      width: 22, height: 22, borderRadius: "50%", background: "#fff",
      position: "absolute", top: 3,
      left: value ? 23 : 3, transition: "left 0.2s",
    }} />
  </button>
);

const Profile = () => {
  const {
    user, userProfile, isAuthenticated, isAdmin,
    loginGoogle, logout, loading,
  } = useAuth();

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  /* panel states */
  const [activePanel, setActivePanel] = useState(null);

  /* edit profile */
  const [editName, setEditName] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  /* notification prefs */
  const [notifPush, setNotifPush] = useState(true);
  const [notifReports, setNotifReports] = useState(true);
  const [notifChat, setNotifChat] = useState(true);

  /* privacy prefs */
  const [showOnline, setShowOnline] = useState(true);
  const [showEmail, setShowEmail] = useState(false);

  /* app settings */
  const [darkMode, setDarkMode] = useState(false);

  /* delete account */
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ── handlers ── */
  const handleGoogle = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      await loginGoogle();
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") setAuthError(err.message);
    }
    setAuthLoading(false);
  };

  const openPanel = (panel) => {
    if (panel === "account") setEditName(userProfile?.displayName || user?.displayName || "");
    setEditSuccess(false);
    setDeleteConfirm(false);
    setActivePanel(panel);
  };

  const saveDisplayName = async () => {
    if (!editName.trim() || !user) return;
    setEditSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { displayName: editName.trim() });
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 2000);
    } catch (err) {
      console.error("Update failed:", err);
    }
    setEditSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm || !user) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Please sign out and sign in again before deleting (re-authentication required).");
    }
    setDeleting(false);
    setActivePanel(null);
  };

  if (loading) {
    return (
      <div className="page-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={32} color="var(--primary-green)" style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const settingsItems = [
    { icon: User, label: "Account Information", desc: user?.email || "Manage your details", color: "var(--primary-green)", panel: "account" },
    { icon: Bell, label: "Notifications", desc: "Push & report alerts", color: "var(--info)", panel: "notifications" },
    { icon: Shield, label: "Privacy & Security", desc: "Data & visibility preferences", color: "var(--danger)", panel: "privacy" },
    { icon: Settings, label: "App Settings", desc: "Display preferences", color: "var(--text-secondary)", panel: "settings" },
    { icon: HelpCircle, label: "Help & Support", desc: "FAQs, contact, about", color: "#6A1B9A", panel: "help" },
  ];

  return (
    <motion.div
      className="page-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "relative" }}
    >
      <InsigniaWatermark opacity={0.03} size={180} style={{ top: 200, right: -30 }} />

      {/* Header */}
      <div style={{
        padding: "16px 20px", display: "flex",
        justifyContent: "space-between", alignItems: "center", background: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <TinubuInsignia size={28} color="var(--primary-green)" secondaryColor="var(--accent-gold)" />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--primary-green)" }}>Profile</h1>
        </div>
        {isAuthenticated && (
          <button onClick={() => openPanel("account")} style={{
            width: 40, height: 40, borderRadius: 9999, border: "none",
            background: "var(--light-gray)", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer",
          }}>
            <Edit3 size={18} color="var(--text-secondary)" />
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div style={{ padding: "0 20px 16px" }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card"
          style={{ textAlign: "center", padding: "24px 16px", background: "linear-gradient(180deg, #fff 0%, var(--off-white) 100%)" }}
        >
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: isAuthenticated ? "linear-gradient(135deg, #006B3F, #00894F)" : "linear-gradient(135deg, var(--mid-gray), var(--light-gray))",
            margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center",
            border: `3px solid ${isAuthenticated ? "rgba(197,150,12,0.4)" : "var(--mid-gray)"}`, overflow: "hidden",
          }}>
            {isAuthenticated && user?.photoURL ? (
              <img src={user.photoURL} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />
            ) : isAuthenticated ? (
              <TinubuInsignia size={44} color="#fff" secondaryColor="#E8B830" />
            ) : (
              <User size={36} color="var(--text-muted)" />
            )}
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>
            {isAuthenticated ? (userProfile?.displayName || user?.displayName || "Citizen") : "Guest User"}
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
            {isAdmin && (
              <span style={{
                fontSize: 10, fontWeight: 700, background: "linear-gradient(135deg, #006B3F, #00894F)",
                color: "#fff", padding: "3px 10px", borderRadius: 9999, display: "inline-flex", alignItems: "center", gap: 3,
              }}><Shield size={10} /> ADMIN</span>
            )}
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {isAuthenticated ? (user?.email || "Signed in with Google") : "Sign in to access all features"}
            </p>
          </div>

          {!isAuthenticated && (
            <div style={{ marginTop: 20 }}>
              <button onClick={handleGoogle} disabled={authLoading} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                padding: "14px 24px", borderRadius: 9999, border: "1px solid var(--mid-gray)",
                cursor: "pointer", background: "#fff", color: "var(--text-primary)", fontSize: 15,
                fontWeight: 600, width: "100%", maxWidth: 280, margin: "0 auto", opacity: authLoading ? 0.6 : 1,
              }}>
                {authLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {authLoading ? "Signing in..." : "Sign in with Google"}
              </button>
              {authError && <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 10 }}>{authError}</p>}
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12 }}>Sign in is optional — browse freely as a guest</p>
            </div>
          )}

          {isAuthenticated && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
              <div style={{ background: "var(--light-gray)", borderRadius: 14, padding: "14px 12px" }}>
                <Shield size={16} color="var(--primary-green)" style={{ marginBottom: 6 }} />
                <p style={{ fontSize: 18, fontWeight: 800, color: "var(--primary-green)" }}>{isAdmin ? "Admin" : "Citizen"}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Role</p>
              </div>
              <div style={{ background: "var(--light-gray)", borderRadius: 14, padding: "14px 12px" }}>
                <FileText size={16} color="var(--accent-gold)" style={{ marginBottom: 6 }} />
                <p style={{ fontSize: 18, fontWeight: 800, color: "var(--accent-gold)" }}>8</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Sectors</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Settings List */}
      {isAuthenticated && (
        <div style={{ padding: "0 20px" }}>
          <h4 className="section-title">Account Settings</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {settingsItems.map((item, i) => (
              <motion.button key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => openPanel(item.panel)}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 16px", background: "#fff", border: "none",
                  borderRadius: 14, cursor: "pointer", width: "100%", textAlign: "left",
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: "var(--light-gray)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <item.icon size={18} color={item.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.desc}</p>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </motion.button>
            ))}
          </div>

          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            onClick={async () => { await logout(); }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "14px", marginTop: 16, background: "#FFF5F5", border: "none",
              borderRadius: 9999, cursor: "pointer", width: "100%", color: "#C62828",
              fontSize: 14, fontWeight: 600,
            }}
          >
            <LogOut size={18} /> Sign Out
          </motion.button>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "24px 20px 16px" }}>
        <TinubuInsignia size={30} color="var(--primary-green)" secondaryColor="var(--accent-gold)" />
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>Renewed Hope Dashboard v1.0</p>
        <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
          Presented by <span style={{ fontWeight: 700, color: "var(--primary-green)" }}>City Boy Movement</span>
        </p>
        <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
          Developed by <span style={{ fontWeight: 700, color: "var(--accent-gold)" }}>RymeLabs</span>
        </p>
        <p style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 6 }}>&copy; 2026 Federal Republic of Nigeria</p>
      </div>
      <div style={{ height: 20 }} />

      {/* ═══════════════════════════════════════════════
          PANELS — Account, Notifications, Privacy, Settings, Help
          ═══════════════════════════════════════════════ */}

      {/* ── Account Information ── */}
      <Panel title="Account Information" open={activePanel === "account"} onClose={() => setActivePanel(null)}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", overflow: "hidden",
            margin: "0 auto 12px", border: "3px solid rgba(197,150,12,0.3)",
          }}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "var(--light-gray)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={32} color="var(--text-muted)" />
              </div>
            )}
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Photo synced from Google account</p>
        </div>

        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Display Name</label>
        <input value={editName} onChange={(e) => setEditName(e.target.value)} style={{
          width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid var(--mid-gray)",
          fontSize: 15, outline: "none", marginBottom: 8, fontFamily: "inherit",
        }} />

        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6, marginTop: 16 }}>Email</label>
        <div style={{
          padding: "12px 16px", borderRadius: 12, border: "1px solid var(--mid-gray)",
          background: "var(--light-gray)", fontSize: 14, color: "var(--text-muted)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Mail size={14} /> {user?.email || "—"}
          <Lock size={12} style={{ marginLeft: "auto", opacity: 0.4 }} />
        </div>
        <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>Email is managed by your Google account</p>

        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6, marginTop: 16 }}>Role</label>
        <div style={{
          padding: "12px 16px", borderRadius: 12, border: "1px solid var(--mid-gray)",
          background: "var(--light-gray)", fontSize: 14, color: "var(--text-muted)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Shield size={14} color="var(--primary-green)" />
          {isAdmin ? "Administrator" : "Citizen"}
        </div>

        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6, marginTop: 16 }}>User ID</label>
        <div style={{
          padding: "12px 16px", borderRadius: 12, border: "1px solid var(--mid-gray)",
          background: "var(--light-gray)", fontSize: 11, color: "var(--text-muted)",
          fontFamily: "monospace", wordBreak: "break-all",
        }}>
          {user?.uid}
        </div>

        <button onClick={saveDisplayName} disabled={editSaving || !editName.trim()}
          style={{
            width: "100%", padding: "14px", marginTop: 24, borderRadius: 9999,
            border: "none", background: editSuccess ? "var(--success)" : "var(--primary-green)",
            color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            opacity: editSaving ? 0.6 : 1, transition: "background 0.2s",
          }}
        >
          {editSaving ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> :
            editSuccess ? <><Save size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
        </button>
      </Panel>

      {/* ── Notifications ── */}
      <Panel title="Notifications" open={activePanel === "notifications"} onClose={() => setActivePanel(null)}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
          Control how you receive updates about sectors, reports, and community messages.
        </p>

        {[
          { label: "Push Notifications", desc: "Browser push alerts for important updates", value: notifPush, set: setNotifPush, icon: Bell },
          { label: "New Report Alerts", desc: "Get notified when admin posts a new report", value: notifReports, set: setNotifReports, icon: FileText },
          { label: "Chat Messages", desc: "Sound and badge for new community messages", value: notifChat, set: setNotifChat, icon: MessageCircle },
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "16px",
            background: "#fff", borderRadius: 14, marginBottom: 8,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: "var(--light-gray)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <item.icon size={18} color="var(--info)" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{item.label}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.desc}</p>
            </div>
            <Toggle value={item.value} onChange={item.set} />
          </div>
        ))}

        <div style={{
          marginTop: 16, padding: "14px 16px", background: "#FFFBEB",
          borderRadius: 12, display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <Info size={16} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Push notifications require browser permission. You may be prompted to allow them when enabled.
          </p>
        </div>
      </Panel>

      {/* ── Privacy & Security ── */}
      <Panel title="Privacy & Security" open={activePanel === "privacy"} onClose={() => setActivePanel(null)}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
          Control your visibility and manage your data.
        </p>

        {[
          { label: "Show Online Status", desc: "Let others see when you're active in chat", value: showOnline, set: setShowOnline, icon: Eye },
          { label: "Show Email to Others", desc: "Display your email address on your public profile", value: showEmail, set: setShowEmail, icon: Mail },
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "16px",
            background: "#fff", borderRadius: 14, marginBottom: 8,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: "var(--light-gray)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <item.icon size={18} color="var(--danger)" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{item.label}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.desc}</p>
            </div>
            <Toggle value={item.value} onChange={item.set} />
          </div>
        ))}

        <div style={{ marginTop: 24 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--danger)", marginBottom: 12 }}>Danger Zone</h4>
          {!deleteConfirm ? (
            <button onClick={() => setDeleteConfirm(true)} style={{
              width: "100%", padding: "14px", borderRadius: 14, border: "1px solid #FFCDD2",
              background: "#FFF5F5", color: "#C62828", fontSize: 14, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <Trash2 size={16} /> Delete My Account
            </button>
          ) : (
            <div style={{ background: "#FFF5F5", borderRadius: 14, padding: 16, border: "1px solid #FFCDD2" }}>
              <p style={{ fontSize: 13, color: "#C62828", fontWeight: 600, marginBottom: 8 }}>
                Are you sure? This action cannot be undone.
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.5 }}>
                All your data, messages, and profile will be permanently deleted.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setDeleteConfirm(false)} style={{
                  flex: 1, padding: "12px", borderRadius: 9999, border: "1px solid var(--mid-gray)",
                  background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "var(--text-primary)",
                }}>Cancel</button>
                <button onClick={handleDeleteAccount} disabled={deleting} style={{
                  flex: 1, padding: "12px", borderRadius: 9999, border: "none",
                  background: "#C62828", color: "#fff", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", opacity: deleting ? 0.6 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  {deleting ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={14} />}
                  Delete Forever
                </button>
              </div>
            </div>
          )}
        </div>
      </Panel>

      {/* ── App Settings ── */}
      <Panel title="App Settings" open={activePanel === "settings"} onClose={() => setActivePanel(null)}>
        <div style={{
          display: "flex", alignItems: "center", gap: 14, padding: "16px",
          background: "#fff", borderRadius: 14, marginBottom: 8,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: "var(--light-gray)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            {darkMode ? <Moon size={18} color="var(--text-secondary)" /> : <Sun size={18} color="var(--accent-gold)" />}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Dark Mode</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Switch between light and dark theme</p>
          </div>
          <Toggle value={darkMode} onChange={setDarkMode} disabled />
        </div>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 16, marginBottom: 20 }}>Coming soon</p>

        <div style={{
          display: "flex", alignItems: "center", gap: 14, padding: "16px",
          background: "#fff", borderRadius: 14, marginBottom: 8,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: "var(--light-gray)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Globe size={18} color="var(--primary-green)" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Language</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>English</p>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>

        <div style={{ marginTop: 24 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 12 }}>About This App</h4>
          <div style={{ background: "#fff", borderRadius: 14, padding: 16 }}>
            {[
              { label: "Version", value: "1.0.0" },
              { label: "Build", value: "2026.02.10" },
              { label: "Framework", value: "React + Vite" },
              { label: "Backend", value: "Firebase" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", padding: "8px 0",
                borderBottom: i < 3 ? "1px solid var(--light-gray)" : "none",
              }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* ── Help & Support ── */}
      <Panel title="Help & Support" open={activePanel === "help"} onClose={() => setActivePanel(null)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { q: "What is this app?", a: "The Renewed Hope Dashboard showcases President Tinubu's achievements across 8 key sectors in his first 3 years in office." },
            { q: "Who can post reports?", a: "Only administrators can publish sector reports. Citizens can browse all content and participate in community chat." },
            { q: "How do I become an admin?", a: "Admin roles are assigned by the system administrator through the Firebase console." },
            { q: "Is my data safe?", a: "Yes. Authentication is handled by Google, and all data is stored in Firebase with security rules. We do not sell or share your data." },
            { q: "Can I use this offline?", a: "The app works as a PWA (Progressive Web App). Once installed, you can browse previously loaded content offline." },
          ].map((item, i) => (
            <details key={i} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px" }}>
              <summary style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", cursor: "pointer", listStyle: "none", display: "flex", alignItems: "center", gap: 8 }}>
                <HelpCircle size={14} color="#6A1B9A" /> {item.q}
              </summary>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.6, paddingLeft: 22 }}>{item.a}</p>
            </details>
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 12 }}>Contact</h4>
          <div style={{ background: "#fff", borderRadius: 14, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Mail size={16} color="var(--primary-green)" />
              <span style={{ fontSize: 13, color: "var(--text-primary)" }}>support@rymelabs.com</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Globe size={16} color="var(--primary-green)" />
              <span style={{ fontSize: 13, color: "var(--text-primary)" }}>rymelabs.com</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <TinubuInsignia size={26} color="var(--primary-green)" secondaryColor="var(--accent-gold)" />
          <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>
            City Boy Movement &middot; RymeLabs &middot; &copy; 2026
          </p>
        </div>
      </Panel>
    </motion.div>
  );
};

export default Profile;
