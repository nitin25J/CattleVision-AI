import React, { useState, useEffect } from "react";
import { predictionData } from "../services/api";
import { CheckCircle, AlertCircle, Info, RefreshCw } from "lucide-react";

export default function Result({ usePredictionHook, onNavigate, onOpenDetails }) {
  const { prediction, setPrediction, imagePreview, activeMode, setActiveMode } = usePredictionHook;
  const currentData = prediction || predictionData.high;
  const isHigh = currentData.confidence >= 50;

  const [displayedConf, setDisplayedConf] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    // Animate confidence number
    const target = currentData.confidence;
    const duration = 900;
    const start = performance.now();
    let frameId;

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedConf(Math.round(target * eased));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setDisplayedConf(target);
      }
    };
    frameId = requestAnimationFrame(step);

    const timer = setTimeout(() => {
      setBarWidth(target);
    }, 300);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, [currentData]);

  const handleToggleMode = (mode) => {
    setActiveMode(mode);
    const data = predictionData[mode];
    setPrediction(data);
    setBarWidth(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto anim-hero-entrance space-y-6 pb-20">
      <div className="text-center mb-8">
        <p className="text-[var(--forest-mid)] font-semibold tracking-widest uppercase text-xs mb-3">Result</p>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--forest-deep)] mb-4">Identification result</h1>
        <p className="text-[var(--charcoal)] opacity-80 text-lg">Based on the visual characteristics in your photo.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Image & Confidence */}
        <div className="lg:col-span-5 space-y-6">
          {imagePreview && (
            <div className="glass p-3 rounded-[32px] anim-stagger-1 relative overflow-hidden group">
              <div className="w-full h-80 rounded-[24px] overflow-hidden relative shadow-inner">
                <img src={imagePreview} alt="Identified animal" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)]/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <span className="glass-pill px-4 py-2 text-sm font-semibold text-white flex items-center gap-2 border-white/20">
                    <CheckCircle size={16} /> AI analysis complete
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Confidence Interpretation Card */}
          <div className="glass p-6 rounded-3xl anim-stagger-3">
            <h3 className="text-xl font-bold text-[var(--forest-deep)] mb-4">Confidence Interpretation</h3>
            <div className={`p-4 rounded-2xl flex items-start gap-4 ${isHigh ? 'bg-white/40' : 'bg-[var(--amber)]/10'}`}>
              <div className={`mt-1 ${isHigh ? 'text-[var(--forest-mid)]' : 'text-[var(--amber-deep)]'}`}>
                {isHigh ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
              </div>
              <div>
                <div className="font-bold text-[var(--charcoal)] text-lg mb-1">
                  {isHigh ? "High confidence" : "Low confidence"} ({currentData.confidence}%)
                </div>
                <p className="text-[var(--charcoal)] opacity-80 text-sm leading-relaxed">
                  {isHigh
                    ? "The image contains visual characteristics that strongly match the predicted breed."
                    : "The prediction is uncertain. Try a clearer image for a more reliable result."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results & Actions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Result Card */}
          <div className="glass-strong p-8 rounded-[32px] text-white anim-stagger-2 relative overflow-hidden shadow-xl">
            {/* Ambient glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 blur-[60px] rounded-full"></div>
            
            <div className="uppercase tracking-widest text-xs font-semibold text-white/60 mb-6">Most likely breed</div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">{currentData.breed}</h2>
                <p className="text-lg text-white/70 font-medium">{currentData.species}</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold tracking-tight">
                  {displayedConf}<span className="text-2xl text-white/50">%</span>
                </div>
                <p className="text-sm text-white/60 mt-1 uppercase tracking-wider">Match Score</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-4 w-full bg-black/20 rounded-full overflow-hidden shadow-inner mb-6 relative z-10 p-0.5">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                style={{
                  width: `${barWidth}%`,
                  background: isHigh
                    ? "linear-gradient(90deg, var(--sage), #fff)"
                    : "linear-gradient(90deg, var(--amber-soft), var(--amber))"
                }}
              ></div>
            </div>
            
            <div className="flex flex-wrap gap-4 relative z-10">
              {isHigh ? (
                <>
                  <button
                    className="bg-white text-[var(--forest-deep)] px-6 py-3.5 rounded-xl font-bold flex-1 text-center hover:bg-[var(--sage-soft)] transition-colors shadow-lg"
                    onClick={() => onOpenDetails(currentData.breed, `${currentData.confidence}%`)}
                  >
                    View breed details
                  </button>
                  <button 
                    className="bg-white/10 border border-white/20 text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                    onClick={() => onNavigate("identify")}
                  >
                    <RefreshCw size={18} />
                    Identify another
                  </button>
                </>
              ) : (
                <button 
                  className="bg-[var(--amber)] text-white px-6 py-3.5 rounded-xl font-bold w-full flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
                  onClick={() => onNavigate("identify")}
                >
                  <Camera size={18} />
                  Try another photo
                </button>
              )}
            </div>
          </div>

          {/* Top 3 Alternatives */}
          <div className="glass p-8 rounded-[32px] anim-stagger-3">
            <h3 className="text-xl font-bold text-[var(--forest-deep)] mb-6 flex items-center gap-2">
              <Info size={20} className="text-[var(--forest-mid)]" />
              Alternative matches
            </h3>
            <div className="space-y-4">
              {currentData.alternatives.map((alt, i) => (
                <div key={i} className="bg-white/30 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-[var(--forest-deep)] font-bold text-sm shadow-sm">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-[var(--charcoal)] text-lg">{alt.breed}</span>
                      <span className="font-bold text-[var(--forest-mid)]">{alt.confidence}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/40 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[var(--sage)] to-[var(--forest-mid)] rounded-full" style={{ width: `${alt.confidence}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dev Toggle for Judges */}
      <div className="fixed bottom-6 right-6 glass p-2 rounded-2xl flex gap-2 shadow-xl z-50">
        <button
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeMode === "high" ? "bg-[var(--forest-deep)] text-white shadow-md" : "text-[var(--charcoal)] hover:bg-white/40"}`}
          onClick={() => handleToggleMode("high")}
        >
          High conf
        </button>
        <button
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeMode === "low" ? "bg-[var(--forest-deep)] text-white shadow-md" : "text-[var(--charcoal)] hover:bg-white/40"}`}
          onClick={() => handleToggleMode("low")}
        >
          Low conf
        </button>
      </div>
    </div>
  );
}