import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Save, Edit3 } from "lucide-react";
import { InsigniaSpinner } from "./TinubuInsignia";

const overlayStyle = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
  zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center",
};
const panelStyle = {
  background: "#fff", borderRadius: "24px 24px 0 0", width: "100%",
  maxWidth: 430, maxHeight: "90vh", overflow: "hidden",
  display: "flex", flexDirection: "column",
};
const headerStyle = {
  padding: "16px 20px", display: "flex", alignItems: "center",
  justifyContent: "space-between", borderBottom: "1px solid var(--light-gray)",
};
const bodyStyle = {
  padding: "16px 20px", overflowY: "auto", flex: 1,
};
const inputStyle = {
  width: "100%", padding: "10px 14px", border: "1px solid var(--mid-gray)",
  borderRadius: 12, fontSize: 14, fontFamily: "Poppins, sans-serif",
  outline: "none", background: "#fff", boxSizing: "border-box",
};
const labelStyle = {
  fontSize: 12, fontWeight: 600, color: "var(--text-secondary)",
  marginBottom: 6, display: "block",
};
const btnPrimary = {
  padding: "12px 24px", background: "var(--primary-green)", color: "#fff",
  border: "none", borderRadius: 9999, fontSize: 14, fontWeight: 600,
  cursor: "pointer", fontFamily: "Poppins, sans-serif",
  display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
};
const btnSecondary = {
  padding: "8px 16px", background: "var(--light-gray)", color: "var(--text-primary)",
  border: "none", borderRadius: 9999, fontSize: 13, fontWeight: 500,
  cursor: "pointer", fontFamily: "Poppins, sans-serif",
  display: "flex", alignItems: "center", gap: 6,
};
const btnDanger = {
  padding: "6px 12px", background: "#FFEBEE", color: "#C62828",
  border: "none", borderRadius: 9999, fontSize: 12, fontWeight: 500,
  cursor: "pointer", fontFamily: "Poppins, sans-serif",
  display: "flex", alignItems: "center", gap: 4,
};

// Available icons for milestones
const ICON_OPTIONS = [
  "Route", "Factory", "BookOpen", "Fuel", "TrendingUp", "Building2",
  "Shield", "GraduationCap", "HeartPulse", "Wheat", "Zap", "Laptop",
  "BarChart3", "Landmark", "Train", "Target", "Users", "Globe",
  "Activity", "DollarSign", "Baby", "Heart", "PieChart", "Wifi",
  "Battery", "Coins", "Home",
];

/* ========================================================
 *  MilestoneEditor — edit a single milestone
 * ======================================================== */
export const MilestoneEditor = ({ milestone, onSave, onClose, isNew = false }) => {
  const [form, setForm] = useState({
    icon: milestone?.icon || "Route",
    title: milestone?.title || "",
    desc: milestone?.desc || "",
    color: milestone?.color || "#006B3F",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        style={overlayStyle}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          style={panelStyle}
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={headerStyle}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>
              {isNew ? "Add Milestone" : "Edit Milestone"}
            </h3>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={20} />
            </button>
          </div>
          <div style={bodyStyle}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Title</label>
              <input style={inputStyle} value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Milestone title..." />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Description</label>
              <input style={inputStyle} value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                placeholder="Brief description..." />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Border / Accent Color</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="color" value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  style={{ width: 44, height: 44, border: "none", cursor: "pointer", borderRadius: 10 }} />
                <input style={{ ...inputStyle, flex: 1 }} value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })} />
                {/* Color preview */}
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  border: `3px solid ${form.color}`,
                  background: `${form.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: form.color,
                }}>
                  Aa
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Icon</label>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6,
                maxHeight: 180, overflowY: "auto", padding: 4,
              }}>
                {ICON_OPTIONS.map((iconName) => (
                  <button
                    key={iconName}
                    onClick={() => setForm({ ...form, icon: iconName })}
                    style={{
                      padding: "8px 4px", borderRadius: 10, border: "none",
                      background: form.icon === iconName ? form.color : "var(--light-gray)",
                      color: form.icon === iconName ? "#fff" : "var(--text-secondary)",
                      cursor: "pointer", fontSize: 9, fontWeight: 600,
                      fontFamily: "Poppins, sans-serif", textAlign: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    {iconName}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ padding: "12px 20px", borderTop: "1px solid var(--light-gray)" }}>
            <button style={{ ...btnPrimary, width: "100%" }} onClick={handleSave} disabled={saving}>
              {saving ? <InsigniaSpinner size={18} /> : <Save size={16} />}
              {saving ? "Saving..." : isNew ? "Add Milestone" : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ========================================================
 *  MilestonesManager — list milestones with add/edit/delete
 * ======================================================== */
export const MilestonesManager = ({
  milestones, onAdd, onUpdate, onDelete, onClose,
}) => {
  const [editingMs, setEditingMs] = useState(null); // milestone to edit
  const [showAdd, setShowAdd] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await onDelete(id);
    } catch (e) {
      console.error(e);
    }
    setDeleting(null);
  };

  if (editingMs) {
    return (
      <MilestoneEditor
        milestone={editingMs}
        onSave={async (data) => {
          await onUpdate(editingMs.id, data);
          setEditingMs(null);
        }}
        onClose={() => setEditingMs(null)}
      />
    );
  }

  if (showAdd) {
    return (
      <MilestoneEditor
        milestone={null}
        isNew
        onSave={async (data) => {
          await onAdd(data);
          setShowAdd(false);
        }}
        onClose={() => setShowAdd(false)}
      />
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        style={overlayStyle}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          style={panelStyle}
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={headerStyle}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Manage Milestones</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={20} />
            </button>
          </div>
          <div style={bodyStyle}>
            {milestones.map((ms, i) => (
              <div
                key={ms.id}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 14px", marginBottom: 8,
                  borderRadius: 14, border: `2px solid ${ms.color}`,
                  background: `${ms.color}08`,
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: `${ms.color}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: ms.color, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                    {ms.title}
                  </p>
                  <p style={{
                    fontSize: 11, color: "var(--text-muted)", marginTop: 2,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {ms.desc}
                  </p>
                </div>
                <button
                  onClick={() => setEditingMs(ms)}
                  style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: "var(--light-gray)", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0,
                  }}
                >
                  <Edit3 size={13} color="var(--text-secondary)" />
                </button>
                <button
                  onClick={() => handleDelete(ms.id)}
                  disabled={deleting === ms.id}
                  style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: "#FFEBEE", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0,
                  }}
                >
                  {deleting === ms.id
                    ? <InsigniaSpinner size={13} />
                    : <Trash2 size={13} color="#C62828" />}
                </button>
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 20px", borderTop: "1px solid var(--light-gray)" }}>
            <button style={{ ...btnPrimary, width: "100%" }} onClick={() => setShowAdd(true)}>
              <Plus size={16} /> Add New Milestone
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
