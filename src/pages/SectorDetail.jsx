import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Play, Pause, CheckCircle, TrendingUp, BarChart3,
  FileText, Video, ChevronDown, ChevronUp, Volume2, VolumeX,
  Globe, TrendingDown, Coins, Route, Home as HomeIcon, Train,
  Shield, Target, GraduationCap, PieChart as PieChartIcon,
  Heart, Building, Baby, Wheat, DollarSign, Zap, Battery,
  Fuel, Wifi, Laptop, Users, Activity,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  ComposedChart,
} from "recharts";
import { sectors } from "../data/sectors";
import { InsigniaWatermark } from "../components/TinubuInsignia";

const CHART_COLORS = ["#006B3F", "#C5960C", "#1565C0", "#C62828", "#6A1B9A", "#E65100", "#00695C", "#F57F17"];

const AnimatedNumber = ({ value, suffix = "", prefix = "", duration = 2000 }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{prefix}{typeof value === 'number' && value % 1 !== 0 ? display.toFixed(1) : Math.round(display)}{suffix}</span>;
};

const SectorDetail = () => {
  const { sectorId } = useParams();
  const navigate = useNavigate();
  const sector = sectors.find((s) => s.id === sectorId);
  const [viewMode, setViewMode] = useState("video"); // video | text
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [expandedAchievement, setExpandedAchievement] = useState(null);
  const [chartsVisible, setChartsVisible] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setChartsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!sector) {
    return (
      <div className="page-content" style={{ padding: 40, textAlign: "center" }}>
        <p>Sector not found</p>
        <button onClick={() => navigate("/")} style={{
          marginTop: 16, padding: "10px 20px", background: "var(--primary-green)",
          color: "#fff", border: "none", borderRadius: 9999, cursor: "pointer",
        }}>Go Home</button>
      </div>
    );
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const renderEconomyCharts = () => (
    <>
      {/* GDP Growth */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>
          GDP Growth Rate (%)
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={sector.charts.gdpGrowth}>
            <defs>
              <linearGradient id="gdpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#006B3F" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#006B3F" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[0, 5]} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "none", }} />
            <Area type="monotone" dataKey="value" stroke="#006B3F" strokeWidth={3} fill="url(#gdpGrad)" animationDuration={2000} dot={{ r: 5, fill: "#006B3F" }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* FDI Inflows */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>FDI Inflows ($B)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sector.charts.fdi}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "none", }} />
            <Bar dataKey="value" fill="#C5960C" radius={[6, 6, 0, 0]} animationDuration={2000}>
              {sector.charts.fdi.map((_, i) => (
                <Cell key={i} fill={i === sector.charts.fdi.length - 1 ? "#006B3F" : "#C5960C"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Inflation Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Inflation Trend (%)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={sector.charts.inflation}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[15, 40]} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "none", }} />
            <Line type="monotone" dataKey="value" stroke="#C62828" strokeWidth={3} dot={{ r: 5, fill: "#C62828" }} animationDuration={2000} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Revenue Sources */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Revenue Sources (₦ Trillion)</h4>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={sector.charts.revenue} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" nameKey="source" animationDuration={2000} label={({ source, value }) => `${source}: ₦${value}T`} labelLine={{ stroke: "#999" }}>
              {sector.charts.revenue.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </>
  );

  const renderInfrastructureCharts = () => (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Road Construction Progress (km)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={sector.charts.roadConstruction}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} />
            <Bar dataKey="completed" fill="#006B3F" radius={[6, 6, 0, 0]} name="Completed" animationDuration={2000} />
            <Line type="monotone" dataKey="target" stroke="#C5960C" strokeWidth={2} strokeDasharray="5 5" name="Target" dot={{ r: 4 }} />
            <Legend />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Housing Delivery by Region</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sector.charts.housingDelivery} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="state" type="category" tick={{ fontSize: 11 }} width={60} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} />
            <Bar dataKey="units" fill="#E65100" radius={[0, 6, 6, 0]} animationDuration={2000}>
              {sector.charts.housingDelivery.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Railway Expansion (% Complete)</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sector.charts.railwayExpansion.map((route, i) => (
            <motion.div key={route.route} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{route.route}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{route.km}km · {route.status}%</span>
              </div>
              <div style={{ height: 10, background: "var(--light-gray)", borderRadius: 5, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${route.status}%` }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 1.2, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    background: route.status === 100 ? "#006B3F" : `linear-gradient(90deg, #C5960C, #E8B830)`,
                    borderRadius: 5,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );

  const renderSecurityCharts = () => (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Security Incident Reduction</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sector.charts.incidentReduction}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} />
            <Legend />
            <Bar dataKey="before" fill="#C62828" name="Before (2023)" radius={[4, 4, 0, 0]} animationDuration={1500} />
            <Bar dataKey="after" fill="#006B3F" name="After (2025)" radius={[4, 4, 0, 0]} animationDuration={2000} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Equipment Procured</h4>
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart data={sector.charts.equipmentProcured}>
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis dataKey="type" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis tick={{ fontSize: 9 }} />
            <Radar name="Units" dataKey="count" stroke="#1565C0" fill="#1565C0" fillOpacity={0.25} animationDuration={2000} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </>
  );

  const renderEducationCharts = () => (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Student Enrollment (Millions)</h4>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={sector.charts.enrollment}>
            <defs>
              <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6A1B9A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6A1B9A" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="secGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#006B3F" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#006B3F" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} />
            <Legend />
            <Area type="monotone" dataKey="primary" stroke="#6A1B9A" fill="url(#primaryGrad)" name="Primary" strokeWidth={2} animationDuration={2000} />
            <Area type="monotone" dataKey="secondary" stroke="#006B3F" fill="url(#secGrad)" name="Secondary" strokeWidth={2} animationDuration={2000} />
            <Area type="monotone" dataKey="tertiary" stroke="#C5960C" fill="none" name="Tertiary" strokeWidth={2} animationDuration={2000} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Budget Allocation (%)</h4>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={sector.charts.budgetAllocation} cx="50%" cy="50%" outerRadius={85} innerRadius={45} dataKey="value" nameKey="category" animationDuration={2000} label={({ category, value }) => `${value}%`}>
              {sector.charts.budgetAllocation.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </>
  );

  const renderHealthCharts = () => (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Insurance Coverage (Millions)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={sector.charts.insuranceCoverage}>
            <defs>
              <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C62828" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#C62828" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} />
            <Area type="monotone" dataKey="covered" stroke="#C62828" strokeWidth={3} fill="url(#healthGrad)" animationDuration={2000} dot={{ r: 5, fill: "#C62828" }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Health Facilities</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sector.charts.healthFacilities}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="type" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={2000}>
              {sector.charts.healthFacilities.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Maternal Mortality Rate (per 100k)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={sector.charts.maternalMortality}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[300, 550]} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} />
            <Line type="monotone" dataKey="rate" stroke="#C62828" strokeWidth={3} dot={{ r: 5, fill: "#C62828" }} animationDuration={2000} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </>
  );

  const renderAgricultureCharts = () => (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Food Production (Million Tonnes)</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sector.charts.foodProduction}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="crop" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} />
            <Legend />
            <Bar dataKey="y2022" fill="#C5960C" name="2022" radius={[4, 4, 0, 0]} animationDuration={1500} />
            <Bar dataKey="y2025" fill="#006B3F" name="2025" radius={[4, 4, 0, 0]} animationDuration={2000} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Agricultural Export Earnings ($B)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={sector.charts.exportEarnings}>
            <defs>
              <linearGradient id="agriGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#33691E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#33691E" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} />
            <Area type="monotone" dataKey="value" stroke="#33691E" strokeWidth={3} fill="url(#agriGrad)" animationDuration={2000} dot={{ r: 5, fill: "#33691E" }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </>
  );

  const renderEnergyCharts = () => (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Power Generation Capacity (MW)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={sector.charts.powerGeneration}>
            <defs>
              <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F57F17" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F57F17" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[3000, 8000]} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} />
            <Area type="monotone" dataKey="capacity" stroke="#F57F17" strokeWidth={3} fill="url(#powerGrad)" animationDuration={2000} dot={{ r: 5, fill: "#F57F17" }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Energy Mix (%)</h4>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={sector.charts.energyMix} cx="50%" cy="50%" outerRadius={85} innerRadius={45} dataKey="value" nameKey="source" animationDuration={2000} label={({ source, value }) => `${source}: ${value}%`}>
              {sector.charts.energyMix.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Oil Production (M Barrels/Day)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={sector.charts.oilProduction}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[1, 2]} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} />
            <Line type="monotone" dataKey="barrels" stroke="#006B3F" strokeWidth={3} dot={{ r: 5, fill: "#006B3F" }} animationDuration={2000} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </>
  );

  const renderDigitalCharts = () => (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Broadband Penetration (%)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={sector.charts.broadbandGrowth}>
            <defs>
              <linearGradient id="bbGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00695C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00695C" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[30, 70]} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} />
            <Area type="monotone" dataKey="penetration" stroke="#00695C" strokeWidth={3} fill="url(#bbGrad)" animationDuration={2000} dot={{ r: 5, fill: "#00695C" }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Tech VC Investment ($B)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sector.charts.techInvestment}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]} animationDuration={2000}>
              {sector.charts.techInvestment.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={chartsVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} className="card" style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Digital Skills Training</h4>
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart data={sector.charts.digitalSkills}>
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis dataKey="category" tick={{ fontSize: 9 }} />
            <PolarRadiusAxis tick={{ fontSize: 9 }} />
            <Radar name="Trained" dataKey="trained" stroke="#00695C" fill="#00695C" fillOpacity={0.25} animationDuration={2000} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </>
  );

  const renderCharts = () => {
    switch (sectorId) {
      case "economy": return renderEconomyCharts();
      case "infrastructure": return renderInfrastructureCharts();
      case "security": return renderSecurityCharts();
      case "education": return renderEducationCharts();
      case "health": return renderHealthCharts();
      case "agriculture": return renderAgricultureCharts();
      case "energy": return renderEnergyCharts();
      case "digital": return renderDigitalCharts();
      default: return renderEconomyCharts();
    }
  };

  return (
    <motion.div
      className="page-content"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      style={{ position: "relative" }}
    >
      {/* Watermark */}
      <InsigniaWatermark opacity={0.025} size={200} style={{ top: 400, right: -40 }} />

      {/* Header */}
      <div style={{
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#fff",
        borderBottom: "1px solid var(--light-gray)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <button
          onClick={() => navigate("/")}
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
          <h2 style={{
            fontSize: 16, fontWeight: 700,
            color: sector.color,
          }}>
            {sector.name}
          </h2>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{sector.tagline}</p>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: sector.bgColor,
          display: "flex", alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${sector.color}20`,
        }}>
          <BarChart3 size={18} color={sector.color} />
        </div>
      </div>

      {/* View Mode Toggle */}
      <div style={{ padding: "12px 20px" }}>
        <div className="tabs">
          <button
            className={`tab ${viewMode === "video" ? "active" : ""}`}
            onClick={() => setViewMode("video")}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
              <Video size={14} /> Video Summary
            </span>
          </button>
          <button
            className={`tab ${viewMode === "text" ? "active" : ""}`}
            onClick={() => setViewMode("text")}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
              <FileText size={14} /> Detailed Report
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "video" ? (
          <motion.div
            key="video"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ padding: "0 20px" }}
          >
            {/* Video Player */}
            <div style={{
              borderRadius: 18, overflow: "hidden",
              position: "relative", background: "#000",
              marginBottom: 16, aspectRatio: "16/9",
              border: `2px solid ${sector.color}20`,
            }}>
              <video
                ref={videoRef}
                muted={isMuted}
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              >
                <source src={sector.videoUrl} type="video/mp4" />
              </video>
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center",
                justifyContent: "center",
                background: isPlaying ? "transparent" : "rgba(0,0,0,0.4)",
                transition: "background 0.3s",
              }}>
                {!isPlaying && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    style={{
                      width: 56, height: 56, borderRadius: "50%",
                      background: sector.color, border: "none",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", cursor: "pointer",
                    }}
                  >
                    <Play size={24} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
                  </motion.button>
                )}
              </div>
              {isPlaying && (
                <div style={{
                  position: "absolute", bottom: 8, left: 8, right: 8,
                  display: "flex", gap: 6,
                }}>
                  <button onClick={togglePlay} style={{
                    background: "rgba(0,0,0,0.5)", border: "none",
                    borderRadius: 8, padding: "6px 10px", cursor: "pointer",
                  }}>
                    <Pause size={14} color="#fff" />
                  </button>
                  <button onClick={() => { setIsMuted(!isMuted); if (videoRef.current) videoRef.current.muted = !isMuted; }} style={{
                    background: "rgba(0,0,0,0.5)", border: "none",
                    borderRadius: 8, padding: "6px 10px", cursor: "pointer",
                  }}>
                    {isMuted ? <VolumeX size={14} color="#fff" /> : <Volume2 size={14} color="#fff" />}
                  </button>
                </div>
              )}
            </div>

            <p style={{
              fontSize: 12, color: "var(--text-muted)",
              textAlign: "center", marginBottom: 16,
            }}>
              Sector highlight video — switch to "Detailed Report" for full analysis
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ padding: "0 20px" }}
          >
            {/* Summary */}
            <div className="card" style={{ marginBottom: 16, borderLeft: `4px solid ${sector.color}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: sector.color }}>
                Executive Summary
              </h4>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
                {sector.summary}
              </p>
            </div>

            {/* Achievements */}
            <h4 className="section-title" style={{ fontSize: 15 }}>Key Achievements</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {sector.achievements.map((achievement, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => setExpandedAchievement(expandedAchievement === i ? null : i)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 14px",
                    background: expandedAchievement === i ? sector.bgColor : "#fff",
                    borderRadius: 12, cursor: "pointer",
                    border: `1px solid ${expandedAchievement === i ? sector.color + "30" : "var(--mid-gray)"}`,
                    transition: "all 0.2s",
                  }}
                >
                  <CheckCircle size={18} color={sector.color} style={{ flexShrink: 0 }} />
                  <span style={{
                    fontSize: 13, color: "var(--text-primary)",
                    fontWeight: expandedAchievement === i ? 600 : 400,
                    flex: 1,
                  }}>
                    {achievement}
                  </span>
                  <TrendingUp size={14} color={sector.color} style={{ opacity: 0.5, flexShrink: 0 }} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charts Section - always visible */}
      <div style={{ padding: "0 20px 24px" }}>
        <h4 className="section-title" style={{ fontSize: 15 }}>
          Performance Analytics
        </h4>
        {renderCharts()}
      </div>

      <div style={{ height: 20 }} />
    </motion.div>
  );
};

export default SectorDetail;
