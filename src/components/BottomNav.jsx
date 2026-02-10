import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, FileText, MessageCircle, User } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/feeds", icon: FileText, label: "Feeds" },
  { path: "/messages", icon: MessageCircle, label: "Message" },
  { path: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{
      position: "absolute",
      bottom: 12,
      left: "50%",
      transform: "translateX(-50%)",
      width: "calc(100% - 32px)",
      maxWidth: 380,
      zIndex: 100,
    }}>
      {/* Liquid Glass navbar */}
      <div style={{
        position: "relative",
        borderRadius: 28,
        padding: "10px 6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        /* Glassmorphism */
        background: "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.35) 100%)",
        backdropFilter: "blur(40px) saturate(200%)",
        WebkitBackdropFilter: "blur(40px) saturate(200%)",
        /* Subtle light border for glass edge refraction */
        border: "1px solid rgba(255,255,255,0.55)",
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.08),
          0 2px 8px rgba(0,0,0,0.04),
          inset 0 1px 1px rgba(255,255,255,0.8),
          inset 0 -1px 1px rgba(0,0,0,0.03)
        `,
        overflow: "hidden",
      }}>
        {/* Top specular highlight — glass light reflection */}
        <div style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: "50%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)",
          borderRadius: "28px 28px 50% 50%",
          pointerEvents: "none",
        }} />

        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.88 }}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px 14px",
                borderRadius: 20,
                position: "relative",
                minWidth: 58,
                zIndex: 1,
              }}
            >
              {/* Active pill glow behind icon */}
              {isActive && (
                <motion.div
                  layoutId="liquidPill"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  style={{
                    position: "absolute",
                    inset: 2,
                    borderRadius: 18,
                    background: "linear-gradient(135deg, rgba(0,107,63,0.12) 0%, rgba(197,150,12,0.10) 100%)",
                    border: "1px solid rgba(0,107,63,0.15)",
                    boxShadow: "0 0 12px rgba(0,107,63,0.08)",
                  }}
                />
              )}
              <Icon
                size={21}
                color={isActive ? "#006B3F" : "rgba(0,0,0,0.35)"}
                strokeWidth={isActive ? 2.4 : 1.6}
                style={{ position: "relative", zIndex: 1 }}
              />
              <span style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#006B3F" : "rgba(0,0,0,0.35)",
                position: "relative",
                zIndex: 1,
                letterSpacing: isActive ? 0.2 : 0,
              }}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
