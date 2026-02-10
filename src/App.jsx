import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./contexts/AuthContext";
import IntroVideo from "./pages/IntroVideo";
import Home from "./pages/Home";
import Feeds from "./pages/Feeds";
import Messages from "./pages/Messages";
import SectorDetail from "./pages/SectorDetail";
import Profile from "./pages/Profile";
import BottomNav from "./components/BottomNav";

function App() {
  const [introComplete, setIntroComplete] = useState(false);

  if (!introComplete) {
    return (
      <div className="app-container">
        <IntroVideo onComplete={() => setIntroComplete(true)} />
      </div>
    );
  }

  return (
    <AuthProvider>
      <div className="app-container">
        <div className="flag-stripe" />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feeds" element={<Feeds />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/sector/:sectorId" element={<SectorDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
        <BottomNav />
      </div>
    </AuthProvider>
  );
}

export default App;
