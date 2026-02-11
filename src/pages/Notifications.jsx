import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Bell, BellOff, CheckCircle, Trash2,
  TrendingUp, FileText, Milestone, Megaphone,
  ChevronRight, Clock,
} from "lucide-react";
import {
  collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc,
  where, writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import TinubuInsignia, { InsigniaWatermark, InsigniaSpinner } from "../components/TinubuInsignia";

const typeConfig = {
  feed: { icon: FileText, color: "#006B3F", label: "New Report" },
  milestone: { icon: Milestone, color: "#C5960C", label: "Milestone Update" },
  sector: { icon: TrendingUp, color: "#1565C0", label: "Sector Update" },
  system: { icon: Megaphone, color: "#C62828", label: "System" },
  welcome: { icon: Bell, color: "#6A1B9A", label: "Welcome" },
};

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
};

/* ───────── Default notifications (shown when Firestore is empty) ───────── */
const defaultNotifications = [
  {
    id: "default-1",
    type: "welcome",
    title: "Welcome to Renewed Hope Dashboard",
    body: "Explore President Tinubu's achievements across 8 key sectors. Stay updated with the latest reports and milestones.",
    read: false,
    createdAt: new Date().toISOString(),
    link: "/",
  },
  {
    id: "default-2",
    type: "feed",
    title: "Nigeria's GDP Grows 3.46% in Q3 2025",
    body: "The National Bureau of Statistics released Q3 2025 GDP figures showing sustained growth driven by services and agriculture.",
    read: false,
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    link: "/feeds",
  },
  {
    id: "default-3",
    type: "milestone",
    title: "NELFUND Reaches 900,000 Students",
    body: "The Nigerian Education Loan Fund has now disbursed loans to over 900,000 students across 238 institutions.",
    read: false,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    link: "/sector/education",
  },
  {
    id: "default-4",
    type: "sector",
    title: "Dangote Refinery Producing PMS",
    body: "The 650,000 bpd Dangote Refinery has commenced domestic petrol production, a landmark achievement for Nigeria's energy security.",
    read: false,
    createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    link: "/sector/energy",
  },
];

const Notifications = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | unread

  // Load notifications from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (snap.empty) {
          setNotifications(defaultNotifications);
        } else {
          setNotifications(
            snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          );
        }
        setLoading(false);
      },
      () => {
        setNotifications(defaultNotifications);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const displayed =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const markRead = async (notifId) => {
    if (String(notifId).startsWith("default-")) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
      return;
    }
    try {
      await updateDoc(doc(db, "notifications", notifId), { read: true });
    } catch (e) {
      console.error(e);
    }
  };

  const markAllRead = async () => {
    // Local defaults
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    // Firestore
    try {
      const batch = writeBatch(db);
      notifications.forEach((n) => {
        if (!n.read && !String(n.id).startsWith("default-")) {
          batch.update(doc(db, "notifications", n.id), { read: true });
        }
      });
      await batch.commit();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNotif = async (notifId) => {
    if (String(notifId).startsWith("default-")) {
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
      return;
    }
    try {
      await deleteDoc(doc(db, "notifications", notifId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleTap = (notif) => {
    markRead(notif.id);
    if (notif.link) navigate(notif.link);
  };

  return (
    <motion.div
      className="page-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "relative" }}
    >
      <InsigniaWatermark opacity={0.025} size={180} style={{ top: 200, right: -40 }} />

      {/* Header */}
      <div style={{
        padding: "14px 20px",
        display: "flex", alignItems: "center", gap: 12,
        background: "#fff",
        borderBottom: "1px solid var(--light-gray)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 36, height: 36, borderRadius: 9999,
            border: "none", background: "var(--light-gray)",
            display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer",
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
            Notifications
          </h2>
          {unreadCount > 0 && (
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {unreadCount} unread
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{
              padding: "6px 14px", borderRadius: 9999,
              background: "var(--primary-green)", color: "#fff",
              border: "none", fontSize: 11, fontWeight: 600,
              cursor: "pointer", fontFamily: "Poppins, sans-serif",
              display: "flex", alignItems: "center", gap: 4,
            }}
          >
            <CheckCircle size={12} /> Read All
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ padding: "12px 20px 0" }}>
        <div className="tabs">
          {[
            { key: "all", label: `All (${notifications.length})` },
            { key: "unread", label: `Unread (${unreadCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`tab ${filter === tab.key ? "active" : ""}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <InsigniaSpinner size={40} />
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>
            Loading notifications...
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && displayed.length === 0 && (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          color: "var(--text-muted)",
        }}>
          <BellOff size={48} color="var(--mid-gray)" style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 15, fontWeight: 600 }}>
            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
          </p>
          <p style={{ fontSize: 12, marginTop: 4 }}>
            {filter === "unread" ? "You're all caught up!" : "Notifications will appear here when there are updates."}
          </p>
        </div>
      )}

      {/* Notification List */}
      {!loading && displayed.length > 0 && (
        <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
          {displayed.map((notif, i) => {
            const cfg = typeConfig[notif.type] || typeConfig.system;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleTap(notif)}
                style={{
                  padding: "14px 16px",
                  background: notif.read ? "#fff" : `${cfg.color}06`,
                  borderRadius: 16,
                  border: `1px solid ${notif.read ? "var(--mid-gray)" : cfg.color + "25"}`,
                  cursor: "pointer",
                  display: "flex", gap: 12, alignItems: "flex-start",
                  position: "relative",
                  transition: "all 0.2s",
                }}
              >
                {/* Unread dot */}
                {!notif.read && (
                  <div style={{
                    position: "absolute", top: 8, right: 8,
                    width: 8, height: 8, borderRadius: 9999,
                    background: cfg.color,
                  }} />
                )}

                {/* Icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: `${cfg.color}12`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon size={18} color={cfg.color} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                      color: cfg.color, letterSpacing: 0.5,
                    }}>
                      {cfg.label}
                    </span>
                  </div>
                  <h4 style={{
                    fontSize: 13, fontWeight: notif.read ? 500 : 700,
                    color: "var(--text-primary)", lineHeight: 1.3,
                    marginBottom: 3,
                  }}>
                    {notif.title}
                  </h4>
                  <p style={{
                    fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4,
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {notif.body}
                  </p>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    marginTop: 6,
                  }}>
                    <Clock size={10} color="var(--text-muted)" />
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                  style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "transparent", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0, marginTop: 2,
                  }}
                >
                  <Trash2 size={13} color="var(--text-muted)" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      <div style={{ height: 100 }} />
    </motion.div>
  );
};

export default Notifications;
