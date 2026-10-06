import React, { useState } from "react";
import Navbar from "./components/Navbar";
import TopBar from "./components/TopBar";
import ScanFAB from "./components/ScanFAB";
import Home from "./pages/Home";
import Predict from "./pages/Predict";
import Result from "./pages/Result";
import Records from "./pages/Records";
import Dashboard from "./pages/Dashboard";
import BreedDetailsModal from "./components/BreedDetailsModal";
import { usePrediction } from "./hooks/usePrediction";

export default function App() {
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsModal, setDetailsModal] = useState({ open: false, breed: "Gir", conf: "87%" });
  const predictionHook = usePrediction();

  const handleNavigate = (screen) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenDetails = (breed, conf) => {
    setDetailsModal({ open: true, breed: breed || "Gir", conf: conf || "87%" });
  };

  const handleCloseDetails = () => {
    setDetailsModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <div className="min-h-screen bg-[#FBF8F1] text-[#2A281F] flex flex-col font-sans selection:bg-[#C5D8BE] selection:text-[#16291E]">
      {/* ── Top Bar with Sync Status & User Avatar ── */}
      <TopBar
        onOpenDrawer={() => setDrawerOpen(true)}
        onSyncClick={() => {
          // Toast or sync feedback
        }}
      />

      {/* ── Slide-Out Drawer Navigation ── */}
      <Navbar
        activeScreen={activeScreen}
        setActiveScreen={handleNavigate}
        isOpen={drawerOpen}
        setIsOpen={setDrawerOpen}
      />

      {/* ── Main Application Screen Content ── */}
      <main className="flex-1 w-full">
        {activeScreen === "dashboard" && (
          <Home
            onNavigate={handleNavigate}
            onOpenDetails={handleOpenDetails}
          />
        )}
        {activeScreen === "identify" && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Predict usePredictionHook={predictionHook} onNavigate={handleNavigate} />
          </div>
        )}
        {activeScreen === "result" && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Result
              usePredictionHook={predictionHook}
              onNavigate={handleNavigate}
              onOpenDetails={handleOpenDetails}
            />
          </div>
        )}
        {activeScreen === "history" && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Records onNavigate={handleNavigate} />
          </div>
        )}
        {activeScreen === "profile" && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Dashboard />
          </div>
        )}
      </main>

      {/* ── Floating Action Button (Quick Mobile Scanner) ── */}
      <ScanFAB onClick={() => handleNavigate("identify")} />

      {/* ── Detail Modal ── */}
      {detailsModal.open && (
        <BreedDetailsModal
          breedName={detailsModal.breed}
          confText={detailsModal.conf}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}