import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell, Search, TrendingUp, Building2, Shield,
  GraduationCap, HeartPulse, Wheat, Zap, Laptop,
  BarChart3, Fuel, Landmark, Factory, Route, BookOpen,
  Edit3, Settings,
} from "lucide-react";
import { useSectorData } from "../hooks/useSectorData";
import { useMilestones } from "../hooks/useMilestones";
import { useAuth } from "../contexts/AuthContext";
import TinubuInsignia, { InsigniaWatermark, InsigniaBadge } from "../components/TinubuInsignia";
import { AdminEditButton, SectorInfoEditor } from "../components/AdminSectorEditor";
import { MilestonesManager } from "../components/AdminMilestoneEditor";

const iconMap = {
  TrendingUp, Building2, Shield, GraduationCap, HeartPulse, Wheat, Zap, Laptop,
  Route, Factory, BookOpen, Fuel, BarChart3, Landmark,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

const Home = ({ onShowIntro }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { sectors, updateSector } = useSectorData();
  const { milestones, addMilestone, updateMilestone, deleteMilestone } = useMilestones();
  const hours = new Date().getHours();
  const greeting = hours < 12 ? "Good morning" : hours < 17 ? "Good afternoon" : "Good evening";

  // Admin editing state
  const [editingSector, setEditingSector] = useState(null);
  const [showMilestonesManager, setShowMilestonesManager] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const q = searchQuery.trim().toLowerCase();

  // Filter sectors & milestones based on search
  const filteredSectors = q
    ? sectors.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.tagline.toLowerCase().includes(q) ||
          (s.summary && s.summary.toLowerCase().includes(q))
      )
    : sectors;

  const filteredMilestones = q
    ? milestones.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q)
      )
    : milestones;

  const sectorPairs = [];
  for (let i = 0; i < filteredSectors.length; i += 2) {
    sectorPairs.push(filteredSectors.slice(i, i + 2));
  }

  return (
    <motion.div
      className="page-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "relative" }}
    >
      {/* Watermark insignia in background */}
      <InsigniaWatermark opacity={0.03} size={220} style={{ top: 200, right: -50 }} />
      <InsigniaWatermark opacity={0.025} size={160} style={{ bottom: 300, left: -30 }} />

      {/* Header */}
      <div style={{
        padding: "16px 20px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 10,
        borderBottom: "1px solid var(--light-gray)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Clickable insignia — returns to intro video */}
          <motion.button
            onClick={onShowIntro}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(197,150,12,0.4)",
                "0 0 0 8px rgba(197,150,12,0)",
              ],
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 9999,
              background: "linear-gradient(135deg, #006B3F, #00894F)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(197,150,12,0.4)",
              cursor: "pointer",
              padding: 0,
              outline: "none",
            }}
            aria-label="Replay intro video"
          >
            <TinubuInsignia size={30} color="#fff" secondaryColor="#E8B830" />
          </motion.button>
          <div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{greeting}</p>
            <h2 style={{
              fontSize: 17,
              fontWeight: 700,
              color: "var(--text-primary)",
            }}>
              Fellow Nigerian
            </h2>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => navigate("/notifications")}
            style={{
              width: 40, height: 40, borderRadius: 9999, border: "none",
              background: "var(--light-gray)", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer", position: "relative",
            }}
          >
            <Bell size={18} color="var(--text-secondary)" />
            <span style={{
              position: "absolute", top: 6, right: 6, width: 8, height: 8,
              borderRadius: 9999, background: "#C62828", border: "2px solid #fff",
            }} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "0 20px 12px", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#fff", borderRadius: 9999, padding: "10px 18px",
          border: `1px solid ${q ? "var(--primary-green)" : "var(--mid-gray)"}`,
          transition: "border-color 0.2s",
        }}>
          <Search size={18} color={q ? "var(--primary-green)" : "var(--text-muted)"} />
          <input
            placeholder="Search sectors, milestones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: "none", outline: "none", flex: 1,
              fontSize: 14, color: "var(--text-primary)",
              background: "transparent",
              fontFamily: "Poppins, sans-serif",
            }}
          />
          {q && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: 2, display: "flex",
              }}
            >
              <span style={{ fontSize: 16, color: "var(--text-muted)", fontWeight: 700 }}>×</span>
            </button>
          )}
        </div>
        {q && (
          <p style={{
            fontSize: 11, color: "var(--text-muted)", marginTop: 6, paddingLeft: 4,
          }}>
            {filteredSectors.length} sector{filteredSectors.length !== 1 ? "s" : ""} · {filteredMilestones.length} milestone{filteredMilestones.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Quick Stats Banner */}
      <div style={{ padding: "0 20px 16px", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: "linear-gradient(135deg, #006B3F 0%, #004D2E 100%)",
            borderRadius: 20,
            padding: "20px",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative infinity watermark */}
          <div style={{ position: "absolute", top: -8, right: -12, opacity: 0.08 }}>
            <TinubuInsignia size={110} color="#fff" secondaryColor="#fff" />
          </div>

          {/* Top row: title + period */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 16, position: "relative", zIndex: 1,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TinubuInsignia size={24} color="#fff" secondaryColor="#E8B830" />
              <h3 style={{ fontSize: 15, fontWeight: 700, letterSpacing: 0.2 }}>
                Renewed Hope Scorecard
              </h3>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 600, opacity: 0.8,
              background: "rgba(255,255,255,0.15)",
              padding: "4px 10px", borderRadius: 9999,
            }}>
              3 Years
            </span>
          </div>

          {/* Divider */}
          <div style={{
            height: 1, background: "rgba(255,255,255,0.15)",
            marginBottom: 16, position: "relative", zIndex: 1,
          }} />

          {/* Stats row */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8,
            position: "relative", zIndex: 1,
          }}>
            {[
              { label: "GDP Growth", value: "3.46", unit: "%", Icon: TrendingUp },
              { label: "Oil Output", value: "1.8", unit: "Mbpd", Icon: Fuel },
              { label: "Reserves", value: "$49", unit: "B", Icon: Landmark },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.1 }}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  padding: "14px 10px",
                  textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <stat.Icon size={18} color="rgba(255,255,255,0.8)" />
                <p style={{ fontSize: 22, fontWeight: 800, marginTop: 4, lineHeight: 1 }}>
                  {stat.value}
                  <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }}>{stat.unit}</span>
                </p>
                <p style={{ fontSize: 9, opacity: 0.6, marginTop: 6, fontWeight: 500, letterSpacing: 0.3, textTransform: "uppercase" }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Bottom period */}
          <p style={{
            fontSize: 10, opacity: 0.5, marginTop: 14,
            textAlign: "center", fontWeight: 500, letterSpacing: 0.5,
            position: "relative", zIndex: 1,
          }}>
            May 2023 — February 2026
          </p>
        </motion.div>
      </div>

      {/* Sectors Grid */}
      <div style={{ padding: "0 20px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 className="section-title" style={{ margin: 0 }}>Sector Performance</h3>
          {isAdmin && (
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>
              Tap card to edit
            </span>
          )}
        </div>
        <div style={{ height: 12 }} />
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}
        >
          {sectorPairs.map((pair, pairIdx) => (
            <div key={pairIdx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {pair.map((sector) => {
                const Icon = iconMap[sector.icon];
                return (
                  <motion.div
                    key={sector.id}
                    variants={item}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate(`/sector/${sector.id}`)}
                    style={{
                      background: sector.bgColor,
                      borderRadius: 18,
                      padding: "18px 14px",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      border: `1px solid ${sector.color}15`,
                      minHeight: 120,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Admin edit button */}
                    {isAdmin && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingSector(sector); }}
                        style={{
                          position: "absolute", top: 8, right: 8, zIndex: 2,
                          width: 26, height: 26, borderRadius: 8,
                          background: sector.color, border: "none",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Edit3 size={12} color="#fff" />
                      </button>
                    )}
                    {/* Faint insignia in card */}
                    <div style={{ position: "absolute", bottom: -5, right: -10, opacity: 0.06 }}>
                      <TinubuInsignia size={50} color={sector.color} secondaryColor={sector.color} />
                    </div>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: sector.color,
                      display: "flex", alignItems: "center",
                      justifyContent: "center", marginBottom: 10,
                    }}>
                      {Icon && <Icon size={20} color="#fff" />}
                    </div>
                    <div>
                      <h4 style={{
                        fontSize: 13, fontWeight: 700,
                        color: sector.color, lineHeight: 1.2,
                      }}>
                        {sector.name}
                      </h4>
                      <p style={{
                        fontSize: 10, color: "var(--text-muted)",
                        marginTop: 4, lineHeight: 1.3,
                      }}>
                        {sector.tagline}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </motion.div>
        {q && filteredSectors.length === 0 && (
          <p style={{
            textAlign: "center", color: "var(--text-muted)", fontSize: 13,
            padding: "20px 0",
          }}>
            No sectors match "{searchQuery}"
          </p>
        )}
      </div>

      {/* Featured Achievements */}
      <div style={{ padding: "0 20px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 className="section-title" style={{ margin: 0 }}>Key Milestones</h3>
          {isAdmin && (
            <button
              onClick={() => setShowMilestonesManager(true)}
              style={{
                padding: "6px 14px", borderRadius: 9999,
                background: "var(--primary-green)", color: "#fff",
                border: "none", fontSize: 11, fontWeight: 600,
                cursor: "pointer", fontFamily: "Poppins, sans-serif",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <Settings size={12} /> Manage
            </button>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredMilestones.map((milestone, i) => {
            const MsIcon = iconMap[milestone.icon] || Route;
            return (
              <motion.div
                key={milestone.id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="card"
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  border: `2px solid ${milestone.color}`,
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: `${milestone.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <MsIcon size={20} color={milestone.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                    {milestone.title}
                  </h4>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    {milestone.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Presented By Footer */}
      <div style={{
        textAlign: "center",
        padding: "8px 20px 16px",
        position: "relative",
        zIndex: 1,
      }}>
        <TinubuInsignia size={30} color="var(--primary-green)" secondaryColor="var(--accent-gold)" />
        <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
          Presented by <span style={{ fontWeight: 700, color: "var(--primary-green)" }}>City Boy Movement</span>
        </p>
      </div>

      <div style={{ height: 20 }} />

      {/* Admin Modals */}
      {editingSector && (
        <SectorInfoEditor
          sector={editingSector}
          onSave={(data) => updateSector(editingSector.id, data)}
          onClose={() => setEditingSector(null)}
        />
      )}
      {showMilestonesManager && (
        <MilestonesManager
          milestones={milestones}
          onAdd={addMilestone}
          onUpdate={updateMilestone}
          onDelete={deleteMilestone}
          onClose={() => setShowMilestonesManager(false)}
        />
      )}
    </motion.div>
  );
};

export default Home;
