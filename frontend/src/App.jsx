import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Predict from "./pages/Predict";
import Result from "./pages/Result";
import Records from "./pages/Records";
import Dashboard from "./pages/Dashboard";
import BreedDetailsModal from "./components/BreedDetailsModal";
import { usePrediction } from "./hooks/usePrediction";

export default function App() {
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [detailsModal, setDetailsModal] = useState({ open: false, breed: "Gir", conf: "87%" });
  const predictionHook = usePrediction();

  const handleNavigate = (screen) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenDetails = (breed, conf) => {
    setDetailsModal({ open: true, breed, conf });
  };

  const handleCloseDetails = () => {
    setDetailsModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <div className="app">
      <Navbar activeScreen={activeScreen} setActiveScreen={handleNavigate} />
      <main className="main-wrap">
        {activeScreen === "dashboard" && <Home onNavigate={handleNavigate} />}
        {activeScreen === "identify" && (
          <Predict usePredictionHook={predictionHook} onNavigate={handleNavigate} />
        )}
        {activeScreen === "result" && (
          <Result
            usePredictionHook={predictionHook}
            onNavigate={handleNavigate}
            onOpenDetails={handleOpenDetails}
          />
        )}
        {activeScreen === "history" && <Records onNavigate={handleNavigate} />}
        {activeScreen === "profile" && <Dashboard />}
      </main>

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