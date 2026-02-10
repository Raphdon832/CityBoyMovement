import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ThumbsUp, MessageCircle, CheckCircle, Clock, Eye,
  Plus, X, Send,
} from "lucide-react";
import {
  collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, increment,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import TinubuInsignia, { InsigniaWatermark, InsigniaSpinner } from "../components/TinubuInsignia";

// Fallback data when Firestore is empty or unavailable
const fallbackFeeds = [
  {
    id: "local-1",
    author: "National Bureau of Statistics",
    handle: "@NaborStats",
    title: "Nigeria's GDP Grows 3.46% in Q3 2025",
    description:
      "Nigeria's real GDP grew by 3.46% year-on-year in Q3 2025, driven by the services and agriculture sectors. The non-oil sector contributed 94.3% of total GDP.",
    upvotes: 2450,
    comments: 312,
    status: "Published",
    isOfficial: true,
    createdAt: new Date("2026-02-10T09:00:00Z").toISOString(),
  },
  {
    id: "local-2",
    author: "Federal Ministry of Works",
    handle: "@FMWH_NG",
    title: "Lagos-Calabar Highway: Section 1 Progress Update",
    description:
      "Construction on Section 1 (Lagos-Epe) of the Lagos-Calabar Coastal Highway is progressing. Over 8,000 workers are engaged on this 700km national project.",
    upvotes: 1890,
    comments: 245,
    status: "Published",
    isOfficial: true,
    createdAt: new Date("2026-02-10T07:00:00Z").toISOString(),
  },
  {
    id: "local-3",
    author: "NELFUND",
    handle: "@NELFUND_NG",
    title: "900,000+ Students Have Received Loans",
    description:
      "The Nigerian Education Loan Fund (NELFUND) has disbursed student loans to over 900,000 beneficiaries across 238 accredited institutions nationwide.",
    upvotes: 3100,
    comments: 428,
    status: "Published",
    isOfficial: true,
    createdAt: new Date("2026-02-09T12:00:00Z").toISOString(),
  },
  {
    id: "local-4",
    author: "Dangote Group",
    handle: "@DangoteGroup",
    title: "Dangote Refinery Now Producing PMS Domestically",
    description:
      "The 650,000 bpd Dangote Refinery in Lagos commenced petrol production, reducing Nigeria's dependency on imported refined petroleum products.",
    upvotes: 4200,
    comments: 589,
    status: "Verified",
    isOfficial: false,
    createdAt: new Date("2026-02-08T15:00:00Z").toISOString(),
  },
];

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const Feeds = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [feeds, setFeeds] = useState([]);
  const [fbLoading, setFbLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const [form, setForm] = useState({
    author: "", handle: "", title: "", description: "", isOfficial: true,
  });

  // Real-time Firestore listener with fallback
  useEffect(() => {
    const q = query(collection(db, "feeds"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setFeeds(data.length > 0 ? data : fallbackFeeds);
        setFbLoading(false);
      },
      (err) => {
        console.warn("Firestore feeds unavailable, using fallback:", err.message);
        setFeeds(fallbackFeeds);
        setFbLoading(false);
      }
    );
    return unsub;
  }, []);

  const filteredFeeds =
    activeTab === "official"
      ? feeds.filter((f) => f.isOfficial)
      : activeTab === "citizen"
      ? feeds.filter((f) => !f.isOfficial)
      : feeds;

  const handlePost = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setPosting(true);
    try {
      await addDoc(collection(db, "feeds"), {
        ...form,
        author: form.author || "Admin",
        handle: form.handle || "@admin",
        upvotes: 0,
        comments: 0,
        status: "Published",
        createdAt: new Date().toISOString(),
      });
      setForm({ author: "", handle: "", title: "", description: "", isOfficial: true });
      setShowForm(false);
    } catch (err) {
      console.error("Post error:", err);
    }
    setPosting(false);
  };

  const handleUpvote = async (feedId) => {
    if (String(feedId).startsWith("local-")) return;
    try {
      await updateDoc(doc(db, "feeds", feedId), { upvotes: increment(1) });
    } catch (err) {
      console.error("Upvote error:", err);
    }
  };

  return (
    <motion.div
      className="page-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "relative" }}
    >
      <InsigniaWatermark opacity={0.03} size={180} style={{ top: 100, right: -40 }} />

      {/* Header */}
      <div style={{
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <TinubuInsignia size={28} color="var(--primary-green)" secondaryColor="var(--accent-gold)" />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--primary-green)" }}>
            Report Feeds
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                width: 40, height: 40, borderRadius: 9999,
                border: "none",
                background: showForm
                  ? "var(--danger)"
                  : "linear-gradient(135deg, var(--primary-green), var(--accent-gold))",
                display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer",
              }}
            >
              {showForm ? <X size={18} color="#fff" /> : <Plus size={18} color="#fff" />}
            </button>
          )}
          <button style={{
            width: 40, height: 40, borderRadius: 9999,
            border: "none", background: "var(--light-gray)",
            display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer",
          }}>
            <Search size={18} color="var(--text-secondary)" />
          </button>
        </div>
      </div>

      {/* Admin New Post Form */}
      <AnimatePresence>
        {showForm && isAdmin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              margin: "0 20px 12px",
              padding: 16,
              background: "#fff",
              borderRadius: 16,
              border: "1px solid rgba(0,107,63,0.1)",
            }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "var(--primary-green)" }}>
                New Report Feed
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    placeholder="Author name"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    placeholder="@handle"
                    value={form.handle}
                    onChange={(e) => setForm({ ...form, handle: e.target.value })}
                    style={{ ...inputStyle, maxWidth: 130 }}
                  />
                </div>
                <input
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={inputStyle}
                />
                <textarea
                  placeholder="Description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 70 }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                    <input
                      type="checkbox"
                      checked={form.isOfficial}
                      onChange={(e) => setForm({ ...form, isOfficial: e.target.checked })}
                      style={{ accentColor: "var(--primary-green)" }}
                    />
                    Official Report
                  </label>
                  <button
                    onClick={handlePost}
                    disabled={posting || !form.title.trim()}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "10px 20px", borderRadius: 9999,
                      border: "none", cursor: "pointer",
                      background: "linear-gradient(135deg, var(--primary-green), #00894F)",
                      color: "#fff", fontSize: 13, fontWeight: 700,
                      opacity: posting || !form.title.trim() ? 0.5 : 1,
                    }}
                  >
                    {posting ? <InsigniaSpinner size={16} /> : <Send size={14} />}
                    {posting ? "Posting..." : "Publish"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div style={{ padding: "0 20px" }}>
        <div className="tabs">
          {[
            { key: "all", label: "All Reports" },
            { key: "official", label: "Official" },
            { key: "citizen", label: "Citizens" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {fbLoading && (
        <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
          <InsigniaSpinner size={48} />
          <p style={{ fontSize: 13, marginTop: 8 }}>Loading feeds...</p>
        </div>
      )}

      {/* Feed Cards */}
      {!fbLoading && (
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredFeeds.map((feed, index) => (
            <motion.div
              key={feed.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="card"
              style={{ padding: "16px" }}
            >
              {/* Author row */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", marginBottom: 10,
              }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: feed.isOfficial
                      ? "linear-gradient(135deg, #006B3F, #00894F)"
                      : "linear-gradient(135deg, #C5960C, #E8B830)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>
                      {feed.author?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                        {feed.author}
                      </span>
                      {feed.isOfficial && <CheckCircle size={14} color="#006B3F" />}
                    </div>
                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {feed.handle} · {timeAgo(feed.createdAt)}
                    </p>
                  </div>
                </div>
                <span className={`badge ${feed.isOfficial ? "badge-success" : "badge-warning"}`}>
                  <Clock size={10} />
                  {feed.status}
                </span>
              </div>

              {/* Content */}
              <h4 style={{
                fontSize: 14, fontWeight: 700, color: "var(--text-primary)",
                marginBottom: 6, lineHeight: 1.4,
              }}>
                {feed.title}
              </h4>
              <p style={{
                fontSize: 12, color: "var(--text-secondary)",
                lineHeight: 1.5, marginBottom: 14,
              }}>
                {feed.description}
              </p>

              {/* Actions */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", paddingTop: 10,
                borderTop: "1px solid var(--light-gray)",
              }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <button
                    onClick={() => handleUpvote(feed.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 12, color: "var(--primary-green)", fontWeight: 600,
                    }}
                  >
                    <ThumbsUp size={14} /> {(feed.upvotes || 0).toLocaleString()}
                  </button>
                  <button style={{
                    display: "flex", alignItems: "center", gap: 4,
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 12, color: "var(--text-muted)", fontWeight: 500,
                  }}>
                    <MessageCircle size={14} /> {feed.comments || 0}
                  </button>
                </div>
                <button style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "var(--light-gray)", border: "none",
                  borderRadius: 9999, padding: "6px 12px",
                  cursor: "pointer", fontSize: 12,
                  color: "var(--primary-green)", fontWeight: 600,
                }}>
                  <Eye size={14} /> View details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div style={{ height: 24 }} />
    </motion.div>
  );
};

const inputStyle = {
  flex: 1,
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid var(--mid-gray)",
  fontSize: 13,
  fontFamily: "var(--font)",
  outline: "none",
  background: "var(--off-white)",
};

export default Feeds;
