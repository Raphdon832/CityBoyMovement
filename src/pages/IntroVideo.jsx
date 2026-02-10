import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, SkipForward, Volume2, VolumeX, ChevronRight } from "lucide-react";
import TinubuInsignia, { InsigniaWatermark } from "../components/TinubuInsignia";

const IntroVideo = ({ onComplete }) => {
  const videoRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      setProgress((currentTime / duration) * 100);
      if (duration - currentTime <= 10) {
        setShowButton(true);
      }
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowOverlay(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        height: "100%",
        background: "linear-gradient(180deg, #001A0F 0%, #002E1A 30%, #004D2E 60%, #001A0F 100%)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0,107,63,0.3) 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, rgba(197,150,12,0.2) 0%, transparent 40%)`,
        zIndex: 0,
      }} />

      {/* Watermark insignias */}
      <InsigniaWatermark opacity={0.06} size={260} style={{ top: -40, right: -60 }} />
      <InsigniaWatermark opacity={0.04} size={180} style={{ bottom: 80, left: -40 }} />

      {/* Full-screen portrait video */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
      }}>
        <video
          ref={videoRef}
          muted={isMuted}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setShowButton(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          poster=""
        >
          <source src="/intro.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay gradient for readability */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: isPlaying && !showOverlay
            ? "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.7) 100%)"
            : "linear-gradient(180deg, rgba(0,30,15,0.85) 0%, rgba(0,45,26,0.6) 30%, rgba(0,45,26,0.6) 60%, rgba(0,20,10,0.95) 100%)",
          transition: "background 0.8s ease",
        }} />
      </div>

      {/* Content overlay */}
      <div style={{
        position: "relative",
        zIndex: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Top: Logo + Title */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            padding: "28px 20px 16px",
            textAlign: "center",
          }}
        >
          {/* Tinubu Insignia */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
            style={{ marginBottom: 12 }}
          >
            <TinubuInsignia size={80} color="#fff" secondaryColor="#C5960C" glow animated />
          </motion.div>

          <h1 style={{
            fontFamily: "'Poppins', sans-serif",
            color: "#FFFFFF",
            fontSize: 26,
            fontWeight: 800,
            lineHeight: 1.2,
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}>
            Renewed Hope
          </h1>
          <p style={{
            color: "rgba(197,150,12,0.9)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginTop: 6,
            fontFamily: "'Poppins', sans-serif",
          }}>
            Three Years of Progress
          </p>

          {/* City Boy Movement line */}
          <p style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 10,
            fontWeight: 400,
            marginTop: 8,
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: 1,
          }}>
            Presented by City Boy Movement
          </p>
        </motion.div>

        {/* Center: Play overlay */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AnimatePresence>
            {showOverlay && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={handlePlay}
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 9999,
                    background: "linear-gradient(135deg, #C5960C, #E8B830)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Play size={40} color="#fff" fill="#fff" style={{ marginLeft: 5 }} />
                </motion.div>
                <p style={{
                  color: "#fff",
                  fontSize: 15,
                  marginTop: 20,
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                  textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                }}>
                  Watch Achievement Highlights
                </p>
                <p style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 11,
                  marginTop: 6,
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  President Bola Ahmed Tinubu — 2023–2026
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Video controls when playing */}
        {isPlaying && !showOverlay && (
          <div style={{
            padding: "0 20px 8px",
          }}>
            {/* Progress bar */}
            <div style={{
              height: 3,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 9999,
              marginBottom: 10,
              overflow: "hidden",
            }}>
              <motion.div
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #C5960C, #E8B830)",
                  borderRadius: 9999,
                  width: `${progress}%`,
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={toggleMute}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: 9999,
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(10px)",
                }}
              >
                {isMuted ? <VolumeX size={16} color="#fff" /> : <Volume2 size={16} color="#fff" />}
              </button>
              <button
                onClick={onComplete}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: 9999,
                  padding: "8px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  backdropFilter: "blur(10px)",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <SkipForward size={14} /> Skip
              </button>
            </div>
          </div>
        )}

        {/* Bottom CTA section */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{
            padding: "12px 20px 36px",
            textAlign: "center",
          }}
        >
          <AnimatePresence>
            {showButton && (
              <motion.button
                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                onClick={onComplete}
                style={{
                  width: "100%",
                  padding: "16px 28px",
                  background: "linear-gradient(135deg, #C5960C 0%, #E8B830 100%)",
                  border: "none",
                  borderRadius: 9999,
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Explore Achievements
                <ChevronRight size={20} />
              </motion.button>
            )}
          </AnimatePresence>

          {!showButton && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <TinubuInsignia size={36} color="rgba(255,255,255,0.2)" secondaryColor="rgba(197,150,12,0.3)" />
              <p style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: 11,
                marginTop: 8,
                fontFamily: "'Poppins', sans-serif",
              }}>
                Continue button appears shortly...
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default IntroVideo;
