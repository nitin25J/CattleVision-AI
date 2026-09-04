import React, { useState, useRef, useEffect } from "react";
import { uploadAndIdentify, getImageUrl } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

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

    // Realistic visual processing delay of ~2.2 seconds
    const total = 2200;
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
    e.currentTarget.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };


  return (
    <section className="screen active" id="screen-identify">
      <p className="eyebrow">Identify</p>
      <h1 className="page-title">Identify a breed</h1>
      <p className="page-subtitle">Upload a clear image of cattle or buffalo.</p>

      {error && (
        <div className="error-inline show" id="uploadError">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16h.01" />
          </svg>
          {errorMessage || "Please choose a valid animal photo first."}
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
        <>
          {/* Upload Zone */}
          <div
            className="upload-zone"
            id="uploadZone"
            onDragEnter={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("dragover");
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("dragover");
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("dragover");
            }}
            onDrop={handleDrop}
            onClick={(e) => {
              if (e.target.closest("button")) return;
              fileInputRef.current?.click();
            }}
          >
            <div className="upload-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
                <path d="M7 9l5-5 5 5" />
                <path d="M12 4v12" />
              </svg>
            </div>
            <div className="upload-title">Drop image here</div>
            <div className="upload-sub">or choose from your device</div>
            <div className="upload-actions">
              <button
                className="btn btn-primary btn-sm"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="6" width="18" height="14" rx="2.5" />
                  <circle cx="12" cy="13" r="3.5" />
                </svg>
                Take photo
              </button>
              <button
                className="btn btn-outline btn-sm"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Choose from gallery
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              id="fileInput"
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
            <>
              <div className="preview-card show" id="previewCard">
                <div className="preview-img-wrap">
                  <img id="previewImg" src={imagePreview} alt="Uploaded animal photo preview" />
                </div>
                <div className="preview-meta-row">
                  <span className="meta-chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Image ready
                  </span>
                  <span className="meta-chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Animal visible
                  </span>
                </div>
              </div>

              {/* Photo Quality Card */}
              <div className="quality-card show" id="qualityCard">
                <div className="quality-title">Photo quality</div>
                <div className="quality-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Animal clearly visible
                </div>
                <div className="quality-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Good framing
                </div>
                <div className="quality-note">Better photos usually produce better predictions.</div>
              </div>

              <button className="btn btn-primary btn-block" onClick={() => startAnalysis(imagePreview)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
                </svg>
                Analyze breed
              </button>
            </>
          )}
        </>
      )}
    </section>
  );
}