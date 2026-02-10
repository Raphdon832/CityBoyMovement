import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell, AlertTriangle, Search, TrendingUp, Building2, Shield,
  GraduationCap, HeartPulse, Wheat, Zap, Laptop,
  BarChart3, Fuel, Landmark, Factory, Route, BookOpen,
} from "lucide-react";
import { sectors } from "../data/sectors";
import TinubuInsignia, { InsigniaWatermark, InsigniaBadge } from "../components/TinubuInsignia";

const iconMap = {
  TrendingUp, Building2, Shield, GraduationCap, HeartPulse, Wheat, Zap, Laptop,
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

const Home = () => {
  const navigate = useNavigate();
  const hours = new Date().getHours();
  const greeting = hours < 12 ? "Good morning" : hours < 17 ? "Good afternoon" : "Good evening";

  const sectorPairs = [];
  for (let i = 0; i < sectors.length; i += 2) {
    sectorPairs.push(sectors.slice(i, i + 2));
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
        background: "linear-gradient(180deg, #fff 0%, var(--off-white) 100%)",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Replace emoji with Tinubu insignia in a circle */}
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 9999,
            background: "linear-gradient(135deg, #006B3F, #00894F)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid rgba(197,150,12,0.4)",
          }}>
            <TinubuInsignia size={30} color="#fff" secondaryColor="#E8B830" />
          </div>
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
          <button style={{
            width: 40, height: 40, borderRadius: 9999, border: "none",
            background: "var(--light-gray)", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", position: "relative",
          }}>
            <Bell size={18} color="var(--text-secondary)" />
            <span style={{
              position: "absolute", top: 6, right: 6, width: 8, height: 8,
              borderRadius: 9999, background: "#C62828", border: "2px solid #fff",
            }} />
          </button>
          <button style={{
            width: 40, height: 40, borderRadius: 9999, border: "none",
            background: "linear-gradient(135deg, #C5960C, #E8B830)", display: "flex",
            alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <AlertTriangle size={18} color="#fff" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "0 20px 12px", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#fff", borderRadius: 9999, padding: "10px 18px",
          border: "1px solid var(--mid-gray)",
        }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            placeholder="Search sectors, reports..."
            style={{
              border: "none", outline: "none", flex: 1,
              fontSize: 14, color: "var(--text-primary)",
              background: "transparent",
            }}
          />
        </div>
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
        <h3 className="section-title">Sector Performance</h3>
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
      </div>

      {/* Featured Achievements */}
      <div style={{ padding: "0 20px 24px", position: "relative", zIndex: 1 }}>
        <h3 className="section-title">Key Milestones</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { Icon: Route, title: "Lagos–Calabar Highway", desc: "700km coastal highway flagged off March 2024", color: "#E65100" },
            { Icon: Factory, title: "Dangote Refinery", desc: "650,000 bpd — producing petrol domestically", color: "#F57F17" },
            { Icon: BookOpen, title: "NELFUND Student Loans", desc: "900,000+ students funded across 238 institutions", color: "#6A1B9A" },
            { Icon: Fuel, title: "Pi-CNG Initiative", desc: "100+ CNG conversion centres to cut fuel costs", color: "#33691E" },
          ].map((milestone, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="card"
              style={{
                display: "flex", alignItems: "center", gap: 14,
                borderLeft: `4px solid ${milestone.color}`,
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `${milestone.color}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <milestone.Icon size={20} color={milestone.color} />
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
          ))}
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
    </motion.div>
  );
};

export default Home;
