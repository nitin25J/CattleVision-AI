import { useState } from "react";
import { predictionData } from "../services/api";

export const usePrediction = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(predictionData.high);
  const [activeMode, setActiveMode] = useState("high");

  const resetPrediction = () => {
    setImagePreview(null);
    setPrediction(predictionData.high);
    setActiveMode("high");
  };

  return {
    imagePreview,
    setImagePreview,
    prediction,
    setPrediction,
    activeMode,
    setActiveMode,
    resetPrediction
  };
};