import { motion } from "framer-motion";

/**
 * Tinubu's official insignia logo — from TinubuCap.svg.
 * Recolored to match the app's green & gold branding.
 */
const TinubuInsignia = ({
  size = 40,
  color = "#006B3F",
  secondaryColor = "#C5960C",
  animated = false,
  style = {},
  className = "",
}) => {
  const Wrapper = animated ? motion.svg : "svg";
  const animProps = animated
    ? {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.6, type: "spring" },
      }
    : {};

  const uid = `ins-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <Wrapper
      viewBox="0 0 219 122"
      width={size}
      height={size * (122 / 219)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      {...animProps}
    >
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" y1="61" x2="219" y2="61" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} />
          <stop offset="50%" stopColor={secondaryColor} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <path d="M16 0L0.5 17L31 45L46 32.5L142.5 121.5H179L208.5 96.5L186 69L166.5 84L71.5 0H16Z" fill={`url(#${uid}-g)`} />
      <path d="M0 95V26L54 83L74.5 70L104.5 97.5L95 120.5H26L0 95Z" fill={`url(#${uid}-g)`} />
      <path d="M219 25.5L215 92.5L165 37.5L146.5 51.5L108.5 22L124 0H193L219 25.5Z" fill={`url(#${uid}-g)`} />
    </Wrapper>
  );
};

/**
 * Watermark version — very faint, used as background decoration
 */
export const InsigniaWatermark = ({ opacity = 0.04, size = 200, style = {} }) => (
  <div
    style={{
      position: "absolute",
      pointerEvents: "none",
      zIndex: 0,
      opacity,
      ...style,
    }}
  >
    <TinubuInsignia size={size} color="#006B3F" secondaryColor="#C5960C" />
  </div>
);

/**
 * Small inline badge version
 */
export const InsigniaBadge = ({ size = 24, style = {} }) => (
  <span style={{ display: "inline-flex", alignItems: "center", ...style }}>
    <TinubuInsignia size={size} color="#006B3F" secondaryColor="#C5960C" />
  </span>
);

/**
 * Animated loading spinner — Tinubu insignia with colors looping around the SVG paths.
 */
export const InsigniaSpinner = ({ size = 32, style = {} }) => {
  const uid = `spin-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <svg
        viewBox="0 0 219 122"
        width={size}
        height={size * (122 / 219)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`${uid}-g1`} x1="0" y1="0" x2="219" y2="122" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#006B3F">
              <animate attributeName="stop-color" values="#006B3F;#C5960C;#E8B830;#006B3F" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#C5960C">
              <animate attributeName="stop-color" values="#C5960C;#E8B830;#006B3F;#C5960C" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#E8B830">
              <animate attributeName="stop-color" values="#E8B830;#006B3F;#C5960C;#E8B830" dur="2s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
        <path d="M16 0L0.5 17L31 45L46 32.5L142.5 121.5H179L208.5 96.5L186 69L166.5 84L71.5 0H16Z" fill={`url(#${uid}-g1)`}>
          <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M0 95V26L54 83L74.5 70L104.5 97.5L95 120.5H26L0 95Z" fill={`url(#${uid}-g1)`}>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M219 25.5L215 92.5L165 37.5L146.5 51.5L108.5 22L124 0H193L219 25.5Z" fill={`url(#${uid}-g1)`}>
          <animate attributeName="opacity" values="0.7;0.4;1;0.7" dur="1.5s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  );
};

export default TinubuInsignia;
