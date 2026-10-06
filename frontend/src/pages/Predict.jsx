import React, { useState, useRef, useEffect } from "react";
import { uploadAndIdentify, getImageUrl } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { UploadCloud, CheckCircle, Camera, Image as ImageIcon, AlertCircle } from "lucide-react";

const analyzingSteps = [
  "Detecting animal & isolating subject…",
  "Extracting morphological markers & horn profile…",
  "Matching with 18 ICAR-NBAGR indigenous breeds…",
  "Calibrating PyTorch confidence distribution…",
  "Identification complete! Preparing result…"
];

export default function Predict({ usePredictionHook, onNavigate }) {
  const { imagePreview, setImagePreview, setPrediction } = usePredictionHook;
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stepFade, setStepFade] = useState(false);

  const fileInputRef = useRef(null);
  const intervalRef = useRef(null);
  const exitTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
  }, []);

  const startAnalysis = async (currentImg, fileToUpload) => {
    const imgToAnalyze = currentImg || imagePreview;
    const targetFile = fileToUpload || selectedFile;

    if (!imgToAnalyze || !targetFile) {
      setError(true);
      setErrorMessage("Please choose a valid animal photo first.");
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);

    setError(false);
    setErrorMessage("");
    setIsAnalyzing(true);
    setIsExiting(false);
    setProgress(0);
    setStepIndex(0);

    let apiResult = null;
    let apiError = null;

    // Start API request in parallel
    const apiPromise = uploadAndIdentify(targetFile)
      .then((res) => {
        apiResult = res;
      })
      .catch((err) => {
        apiError = err?.response?.data?.detail || err.message || "Prediction request failed.";
      });

    // Realistic visual processing delay (Sped up from 2.2s to 1.2s for snappier premium feel)
    const total = 1200;
    const stepDuration = total / (analyzingSteps.length - 1);
    let elapsed = 0;

    intervalRef.current = setInterval(async () => {
      elapsed += 40;
      const pct = Math.min((elapsed / total) * 100, 95);
      setProgress(pct);

      const targetStep = Math.min(Math.floor(elapsed / stepDuration), analyzingSteps.length - 2);
      setStepIndex((prev) => {
        if (targetStep !== prev) {
          setStepFade(true);
          setTimeout(() => setStepFade(false), 120);
          return targetStep;
        }
        return prev;
      });

      if (elapsed >= total) {
        // Wait for API promise if not done yet
        await apiPromise;

        clearInterval(intervalRef.current);
        intervalRef.current = null;

        if (apiError || !apiResult) {
          setIsAnalyzing(false);
          setError(true);
          setErrorMessage(apiError || "Animal breed identification failed. Please try again.");
          return;
        }

        setProgress(100);
        setStepIndex(analyzingSteps.length - 1);
        setPrediction(apiResult);
        if (apiResult.image_url) {
          setImagePreview(getImageUrl(apiResult.image_url));
        }

        // Smooth cross-fade transition: fade out loading, then navigate to result
        setIsExiting(true);
        exitTimeoutRef.current = setTimeout(() => {
          setIsAnalyzing(false);
          setIsExiting(false);
          onNavigate("result");
        }, 340);
      }
    }, 40);
  };

  const handleCancelAnalysis = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
    setIsAnalyzing(false);
    setIsExiting(false);
    setProgress(0);
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError(true);
      setErrorMessage("Please choose a valid image file.");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setImagePreview(dataUrl);
      setError(false);
      setErrorMessage("");
      // Immediately start the realistic loading/analyzing state after upload
      startAnalysis(dataUrl, file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto anim-hero-entrance">
      <div className="text-center mb-10">
        <p className="text-[var(--forest-mid)] font-semibold tracking-widest uppercase text-xs mb-3">Identify</p>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--forest-deep)] mb-4">Identify a breed</h1>
        <p className="text-[var(--charcoal)] opacity-80 text-lg max-w-xl mx-auto">Upload a clear image of cattle or buffalo to analyze its visual characteristics.</p>
      </div>

      {error && (
        <div className="glass-strong text-red-200 p-4 rounded-xl flex items-center gap-3 mb-8 anim-stagger-1">
          <AlertCircle size={20} />
          <span className="font-medium">{errorMessage || "Please choose a valid animal photo first."}</span>
        </div>
      )}

      {isAnalyzing ? (
        <LoadingSpinner
          imageSrc={imagePreview}
          progress={progress}
          stepIndex={stepIndex}
          stepFade={stepFade}
          statusMessage={analyzingSteps[stepIndex]}
          isExiting={isExiting}
          onCancel={handleCancelAnalysis}
        />
      ) : (
        <div className="space-y-6 anim-stagger-2">
          {/* Upload Zone */}
          <div
            className="glass glass-hover p-12 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed border-[var(--sage)]/50 hover:border-[var(--forest-mid)]/60 transition-all"
            onDragEnter={(e) => e.preventDefault()}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={(e) => {
              if (e.target.closest("button")) return;
              fileInputRef.current?.click();
            }}
          >
            <div className="w-20 h-20 rounded-full bg-white/40 flex items-center justify-center mb-6 shadow-inner text-[var(--forest-mid)]">
              <UploadCloud size={36} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-[var(--forest-deep)] mb-2">Drop image here</h3>
            <p className="text-[var(--charcoal)] opacity-70 mb-8">or choose from your device</p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                className="glass-strong text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-[var(--forest)] transition-colors shadow-lg"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Camera size={18} />
                Take photo
              </button>
              <button
                className="glass text-[var(--forest-deep)] px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-white/40 transition-colors"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <ImageIcon size={18} />
                Choose from gallery
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
          </div>

          {/* Preview Card */}
          {imagePreview && (
            <div className="grid md:grid-cols-2 gap-6 anim-stagger-3">
              <div className="glass p-4 rounded-3xl">
                <div className="w-full h-64 md:h-full rounded-2xl overflow-hidden relative shadow-inner">
                  <img src={imagePreview} alt="Uploaded preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    <span className="glass-pill px-3 py-1.5 text-xs font-semibold text-[var(--forest-deep)] flex items-center gap-1.5 shadow-sm">
                      <CheckCircle size={14} className="text-[var(--forest-mid)]" /> Image ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Photo Quality Card */}
              <div className="glass p-8 rounded-3xl flex flex-col justify-center">
                <h4 className="text-xl font-bold text-[var(--forest-deep)] mb-6">Photo quality checklist</h4>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-center gap-3 text-[var(--charcoal)]">
                    <CheckCircle size={20} className="text-[var(--forest-mid)]" />
                    Animal clearly visible
                  </li>
                  <li className="flex items-center gap-3 text-[var(--charcoal)]">
                    <CheckCircle size={20} className="text-[var(--forest-mid)]" />
                    Good framing
                  </li>
                </ul>
                <p className="text-sm text-[var(--charcoal)] opacity-70 mb-8 bg-white/20 p-4 rounded-xl">
                  Better photos usually produce better predictions. Make sure the face and body are well-lit.
                </p>
                <button 
                  className="glass-strong text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 w-full shadow-lg hover:scale-[1.02] transition-transform"
                  onClick={() => startAnalysis(imagePreview)}
                >
                  <Camera size={20} />
                  Analyze breed
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}