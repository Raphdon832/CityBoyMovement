import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { Send, MessageCircle, LogIn, ChevronDown, Check, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── tiny notification sound (base64, ~50ms blip) ─── */
const playBlip = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch (_) {}
};

/* ─── date separator helper ─── */
const formatDateLabel = (ts) => {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
};

const formatTime = (ts) => {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

/* ─── online presence dot ─── */
const ONLINE_TIMEOUT = 60_000; // 1 min

export default function Messages() {
  const { user, userProfile, isAuthenticated, loginGoogle } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [inputRows, setInputRows] = useState(1);

  const bottomRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const prevCountRef = useRef(0);
  const isAtBottomRef = useRef(true);

  /* ─── real-time messages (WebSocket via Firestore) ─── */
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc"),
      limit(500)
    );
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(docs);

      // Play sound for new incoming messages (not own)
      if (
        prevCountRef.current > 0 &&
        docs.length > prevCountRef.current &&
        user &&
        docs[docs.length - 1]?.uid !== user.uid
      ) {
        playBlip();
      }
      prevCountRef.current = docs.length;
    });
    return unsub;
  }, [user]);

  /* ─── presence: heartbeat every 30s ─── */
  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "presence", user.uid);
    const beat = () =>
      setDoc(ref, {
        uid: user.uid,
        displayName: user.displayName || "Citizen",
        lastSeen: Timestamp.now(),
      }, { merge: true }).catch(() => {});

    beat();
    const iv = setInterval(beat, 30_000);
    return () => clearInterval(iv);
  }, [user]);

  /* ─── count online users ─── */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "presence"), (snap) => {
      const now = Date.now();
      const count = snap.docs.filter((d) => {
        const ls = d.data().lastSeen;
        if (!ls) return false;
        return now - ls.toMillis() < ONLINE_TIMEOUT;
      }).length;
      setOnlineCount(count);
    });
    return unsub;
  }, []);

  /* ─── auto-scroll when at bottom ─── */
  useEffect(() => {
    if (isAtBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  /* ─── scroll detection ─── */
  const handleScroll = useCallback(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isAtBottomRef.current = distFromBottom < 80;
    setShowScrollBtn(distFromBottom > 300);
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ─── optimistic send ─── */
  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text || !isAuthenticated || sending) return;

    // Optimistic: show message immediately with a temp id
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      text,
      uid: user.uid,
      displayName: user.displayName || "Citizen",
      photoURL: user.photoURL || null,
      createdAt: Timestamp.now(),
      _pending: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    setNewMessage("");
    setInputRows(1);
    isAtBottomRef.current = true;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    setSending(true);
    try {
      await addDoc(collection(db, "messages"), {
        text,
        uid: user.uid,
        displayName: user.displayName || "Citizen",
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
      });
      // Remove optimistic msg — real one arrives via onSnapshot
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } catch (err) {
      console.error("Send failed:", err);
      // Mark as failed
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, _failed: true, _pending: false } : m))
      );
    }
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ─── auto-expand textarea ─── */
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    const lines = e.target.value.split("\n").length;
    setInputRows(Math.min(lines, 4));
  };

  /* ─── group messages by date ─── */
  const groupedMessages = useMemo(() => {
    const groups = [];
    let lastDate = "";
    messages.forEach((msg) => {
      const label = formatDateLabel(msg.createdAt);
      if (label !== lastDate) {
        groups.push({ type: "date", label, id: `date-${label}-${msg.id}` });
        lastDate = label;
      }
      groups.push({ type: "msg", ...msg });
    });
    return groups;
  }, [messages]);

  /* ─── render ─── */
  return (
    <div
      className="page-content"
      style={{
        padding: 0,
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        position: "relative",
      }}
    >
      {/* header */}
      <div
        style={{
          padding: "16px 20px 12px",
          borderBottom: "1px solid #e5e7eb",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #006B3F, #009B5A)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageCircle size={18} color="#fff" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111" }}>
                Community Chat
              </h2>
              <p style={{ margin: 0, fontSize: 11, color: "#006B3F", fontWeight: 500 }}>
                {onlineCount > 0 ? (
                  <>
                    <span
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#22c55e",
                        marginRight: 4,
                        verticalAlign: "middle",
                      }}
                    />
                    {onlineCount} online now
                  </>
                ) : (
                  "Connecting..."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* messages area */}
      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 12px 8px",
          background: "#f0f2f5",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 80, color: "#aaa" }}>
            <MessageCircle size={44} style={{ opacity: 0.2, marginBottom: 12 }} />
            <p style={{ fontSize: 14, margin: 0 }}>No messages yet</p>
            <p style={{ fontSize: 12, margin: "4px 0 0" }}>Start the conversation!</p>
          </div>
        )}

        {groupedMessages.map((item) => {
          if (item.type === "date") {
            return (
              <div key={item.id} style={{ textAlign: "center", margin: "16px 0 10px" }}>
                <span
                  style={{
                    display: "inline-block",
                    background: "#fff",
                    color: "#666",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "4px 14px",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          }

          const msg = item;
          const isOwn = user && msg.uid === user.uid;

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                display: "flex",
                justifyContent: isOwn ? "flex-end" : "flex-start",
                marginBottom: 3,
              }}
            >
              {/* avatar for others */}
              {!isOwn && (
                <div style={{ marginRight: 6, alignSelf: "flex-end", flexShrink: 0 }}>
                  {msg.photoURL ? (
                    <img
                      src={msg.photoURL}
                      alt=""
                      style={{ width: 26, height: 26, borderRadius: "50%" }}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "#ddd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#888",
                      }}
                    >
                      {(msg.displayName || "C")[0].toUpperCase()}
                    </div>
                  )}
                </div>
              )}

              <div
                style={{
                  maxWidth: "76%",
                  background: isOwn ? "#006B3F" : "#fff",
                  color: isOwn ? "#fff" : "#111",
                  borderRadius: 12,
                  borderBottomRightRadius: isOwn ? 2 : 12,
                  borderBottomLeftRadius: isOwn ? 12 : 2,
                  padding: "7px 11px 5px",
                  position: "relative",
                  opacity: msg._pending ? 0.7 : 1,
                  border: isOwn ? "none" : "1px solid #e8e8e8",
                }}
              >
                {/* sender name for others */}
                {!isOwn && (
                  <p
                    style={{
                      margin: "0 0 2px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#C5960C",
                      lineHeight: 1.2,
                    }}
                  >
                    {msg.displayName}
                  </p>
                )}

                {/* message text */}
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </p>

                {/* time + ticks */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 3,
                    marginTop: 2,
                  }}
                >
                  <span style={{ fontSize: 10, opacity: 0.55 }}>
                    {formatTime(msg.createdAt)}
                  </span>
                  {isOwn && (
                    msg._pending ? (
                      <Check size={12} style={{ opacity: 0.4 }} />
                    ) : msg._failed ? (
                      <span style={{ fontSize: 10, color: "#ff4444" }}>!</span>
                    ) : (
                      <CheckCheck size={13} style={{ opacity: 0.7 }} />
                    )
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* scroll-to-bottom FAB */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={scrollToBottom}
            style={{
              position: "absolute",
              bottom: 110,
              right: 16,
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "#fff",
              border: "1px solid #e5e7eb",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
            }}
          >
            <ChevronDown size={20} color="#666" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* input / sign-in prompt */}
      <div
        style={{
          padding: "8px 10px 90px",
          borderTop: "1px solid #e5e7eb",
          background: "#f0f2f5",
        }}
      >
        {isAuthenticated ? (
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-end",
              background: "#fff",
              borderRadius: 24,
              padding: "6px 6px 6px 16px",
              border: "1px solid #e5e7eb",
            }}
          >
            <textarea
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              rows={inputRows}
              style={{
                flex: 1,
                resize: "none",
                border: "none",
                padding: "6px 0",
                fontSize: 15,
                outline: "none",
                fontFamily: "inherit",
                lineHeight: 1.4,
                background: "transparent",
                maxHeight: 100,
              }}
            />
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleSend}
              disabled={!newMessage.trim()}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "none",
                background: newMessage.trim() ? "#006B3F" : "#ccc",
                color: "#fff",
                cursor: newMessage.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
            >
              <Send size={17} style={{ marginLeft: 2 }} />
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={loginGoogle}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 9999,
              border: "none",
              background: "linear-gradient(135deg, #006B3F, #009B5A)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <LogIn size={18} />
            Sign in with Google to chat
          </motion.button>
        )}
      </div>
    </div>
  );
}
