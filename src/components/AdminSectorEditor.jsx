import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, Trash2, Save, Edit3, BarChart3, ChevronDown, ChevronUp,
  GripVertical,
} from "lucide-react";
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
const textareaStyle = {
  ...inputStyle, minHeight: 80, resize: "vertical",
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

/* ========================================================
 *  SectorInfoEditor — edit name, tagline, color, summary
 * ======================================================== */
export const SectorInfoEditor = ({ sector, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: sector.name || "",
    tagline: sector.tagline || "",
    color: sector.color || "#006B3F",
    bgColor: sector.bgColor || "#E8F5E9",
    summary: sector.summary || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
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
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Edit Sector Info</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={20} />
            </button>
          </div>
          <div style={bodyStyle}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Sector Name</label>
              <input style={inputStyle} value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Tagline</label>
              <input style={inputStyle} value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Accent Color</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="color" value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    style={{ width: 40, height: 40, border: "none", cursor: "pointer", borderRadius: 8 }} />
                  <input style={{ ...inputStyle, flex: 1 }} value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Background Color</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="color" value={form.bgColor}
                    onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                    style={{ width: 40, height: 40, border: "none", cursor: "pointer", borderRadius: 8 }} />
                  <input style={{ ...inputStyle, flex: 1 }} value={form.bgColor}
                    onChange={(e) => setForm({ ...form, bgColor: e.target.value })} />
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Summary</label>
              <textarea style={textareaStyle} value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </div>
          </div>
          <div style={{ padding: "12px 20px", borderTop: "1px solid var(--light-gray)" }}>
            <button style={{ ...btnPrimary, width: "100%" }} onClick={handleSave} disabled={saving}>
              {saving ? <InsigniaSpinner size={18} /> : <Save size={16} />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ========================================================
 *  AchievementsEditor — add/remove/edit achievements list
 * ======================================================== */
export const AchievementsEditor = ({ sector, onSave, onClose }) => {
  const [items, setItems] = useState([...(sector.achievements || [])]);
  const [saving, setSaving] = useState(false);

  const addItem = () => setItems([...items, ""]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, val) => {
    const copy = [...items];
    copy[i] = val;
    setItems(copy);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ achievements: items.filter((a) => a.trim()) });
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
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Edit Achievements</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={20} />
            </button>
          </div>
          <div style={bodyStyle}>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, minWidth: 20 }}>{i + 1}</span>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={item}
                  onChange={(e) => updateItem(i, e.target.value)}
                  placeholder="Achievement description..."
                />
                <button onClick={() => removeItem(i)} style={{ ...btnDanger, padding: "8px" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button onClick={addItem} style={{ ...btnSecondary, marginTop: 8 }}>
              <Plus size={14} /> Add Achievement
            </button>
          </div>
          <div style={{ padding: "12px 20px", borderTop: "1px solid var(--light-gray)" }}>
            <button style={{ ...btnPrimary, width: "100%" }} onClick={handleSave} disabled={saving}>
              {saving ? <InsigniaSpinner size={18} /> : <Save size={16} />}
              {saving ? "Saving..." : "Save Achievements"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ========================================================
 *  ChartDataEditor — edit chart data points, add/remove rows
 * ======================================================== */
export const ChartDataEditor = ({ sector, onSave, onClose }) => {
  // Build editable charts from sector.charts
  const chartKeys = Object.keys(sector.charts || {});
  const [charts, setCharts] = useState(() => {
    const c = {};
    chartKeys.forEach((key) => {
      c[key] = JSON.parse(JSON.stringify(sector.charts[key]));
    });
    return c;
  });
  const [expandedChart, setExpandedChart] = useState(chartKeys[0] || null);
  const [saving, setSaving] = useState(false);

  const getColumns = (chartKey) => {
    if (!charts[chartKey] || charts[chartKey].length === 0) return [];
    return Object.keys(charts[chartKey][0]);
  };

  const updateCell = (chartKey, rowIdx, colKey, value) => {
    const copy = { ...charts };
    const parsed = isNaN(value) ? value : Number(value);
    copy[chartKey] = [...copy[chartKey]];
    copy[chartKey][rowIdx] = { ...copy[chartKey][rowIdx], [colKey]: parsed };
    setCharts(copy);
  };

  const addRow = (chartKey) => {
    const copy = { ...charts };
    const cols = getColumns(chartKey);
    const newRow = {};
    cols.forEach((col) => {
      const sample = charts[chartKey][0]?.[col];
      newRow[col] = typeof sample === "number" ? 0 : "";
    });
    copy[chartKey] = [...copy[chartKey], newRow];
    setCharts(copy);
  };

  const removeRow = (chartKey, rowIdx) => {
    const copy = { ...charts };
    copy[chartKey] = copy[chartKey].filter((_, i) => i !== rowIdx);
    setCharts(copy);
  };

  const formatChartName = (key) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ charts });
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
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Edit Chart Data</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={20} />
            </button>
          </div>
          <div style={bodyStyle}>
            {chartKeys.map((chartKey) => {
              const cols = getColumns(chartKey);
              const isExpanded = expandedChart === chartKey;
              return (
                <div key={chartKey} style={{ marginBottom: 16 }}>
                  <button
                    onClick={() => setExpandedChart(isExpanded ? null : chartKey)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      justifyContent: "space-between", padding: "12px 14px",
                      background: isExpanded ? sector.bgColor : "var(--light-gray)",
                      border: `1px solid ${isExpanded ? sector.color + "30" : "var(--mid-gray)"}`,
                      borderRadius: isExpanded ? "12px 12px 0 0" : 12,
                      cursor: "pointer", fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 600, color: sector.color }}>
                      <BarChart3 size={14} style={{ marginRight: 8, verticalAlign: "middle" }} />
                      {formatChartName(chartKey)}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {charts[chartKey]?.length || 0} rows
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>
                  {isExpanded && (
                    <div style={{
                      border: `1px solid ${sector.color}20`,
                      borderTop: "none", borderRadius: "0 0 12px 12px",
                      padding: 12, background: "#fff",
                    }}>
                      {/* Column headers */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${cols.length}, 1fr) 36px`,
                        gap: 6, marginBottom: 6,
                      }}>
                        {cols.map((col) => (
                          <span key={col} style={{
                            fontSize: 10, fontWeight: 700, color: "var(--text-muted)",
                            textTransform: "uppercase", letterSpacing: 0.5,
                          }}>
                            {col}
                          </span>
                        ))}
                        <span />
                      </div>
                      {/* Data rows */}
                      {(charts[chartKey] || []).map((row, rowIdx) => (
                        <div key={rowIdx} style={{
                          display: "grid",
                          gridTemplateColumns: `repeat(${cols.length}, 1fr) 36px`,
                          gap: 6, marginBottom: 6,
                        }}>
                          {cols.map((col) => (
                            <input
                              key={col}
                              style={{
                                ...inputStyle, padding: "6px 8px", fontSize: 12,
                                borderRadius: 8,
                              }}
                              value={row[col] ?? ""}
                              onChange={(e) => updateCell(chartKey, rowIdx, col, e.target.value)}
                            />
                          ))}
                          <button
                            onClick={() => removeRow(chartKey, rowIdx)}
                            style={{
                              background: "#FFEBEE", border: "none", borderRadius: 8,
                              cursor: "pointer", display: "flex",
                              alignItems: "center", justifyContent: "center",
                            }}
                          >
                            <Trash2 size={12} color="#C62828" />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => addRow(chartKey)} style={{ ...btnSecondary, marginTop: 4 }}>
                        <Plus size={13} /> Add Data Point
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ padding: "12px 20px", borderTop: "1px solid var(--light-gray)" }}>
            <button style={{ ...btnPrimary, width: "100%" }} onClick={handleSave} disabled={saving}>
              {saving ? <InsigniaSpinner size={18} /> : <Save size={16} />}
              {saving ? "Saving..." : "Save Chart Data"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ========================================================
 *  Admin edit button (small floating pencil)
 * ======================================================== */
export const AdminEditButton = ({ onClick, label, style: extraStyle = {} }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    title={label}
    style={{
      width: 32, height: 32, borderRadius: 9999,
      background: "var(--primary-green)", border: "none",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", color: "#fff",
      ...extraStyle,
    }}
  >
    <Edit3 size={14} />
  </motion.button>
);
