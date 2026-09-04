import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export const getImageUrl = (urlPath) => {
  if (!urlPath) return null;
  if (urlPath.startsWith("http://") || urlPath.startsWith("https://") || urlPath.startsWith("data:")) {
    return urlPath;
  }
  return `${API_BASE_URL}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
};

export const uploadAndIdentify = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axios.post(`${API_BASE_URL}/api/identify`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const fetchHistory = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/history`);
  return response.data;
};

export const fetchDashboardStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/dashboard/stats`);
  return response.data;
};

export const fetchBreeds = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/breeds`);
  return response.data;
};

export const fetchBreedDetail = async (breedName) => {
  const response = await axios.get(`${API_BASE_URL}/api/breeds/${encodeURIComponent(breedName)}`);
  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/users/me`);
  return response.data;
};

export const predictionData = {
  high: {
    breed: "Gir",
    species: "Cattle",
    confidence: 87,
    alternatives: [
      { breed: "Gir", species: "Cattle", confidence: 87 },
      { breed: "Sahiwal", species: "Cattle", confidence: 8 },
      { breed: "Red Sindhi", species: "Cattle", confidence: 5 }
    ]
  },
  low: {
    breed: "Gir",
    species: "Cattle",
    confidence: 42,
    alternatives: [
      { breed: "Gir", species: "Cattle", confidence: 42 },
      { breed: "Sahiwal", species: "Cattle", confidence: 31 },
      { breed: "Red Sindhi", species: "Cattle", confidence: 18 }
    ]
  }
};

export const breedLibrary = {
  Gir: {
    species: "Cattle",
    about: "An Indian cattle breed known for its distinctive reddish coat and strong presence in dairy production across Gujarat.",
    characteristics: ["Reddish coat", "Curved horns", "Long ears", "Distinctive forehead"],
    color: "#B4772E"
  },
  Sahiwal: {
    species: "Cattle",
    about: "A hardy dairy breed originating from Punjab, valued for heat tolerance and steady milk yield in warm climates.",
    characteristics: ["Reddish-brown coat", "Loose skin", "Short horns", "Heat tolerant"],
    color: "#8A6A3E"
  },
  "Red Sindhi": {
    species: "Cattle",
    about: "A compact, deep-red dairy breed known for disease resistance and reliable milk production in tropical regions.",
    characteristics: ["Deep red coat", "Compact build", "Short horns", "Disease resistant"],
    color: "#A15A3A"
  },
  Murrah: {
    species: "Buffalo",
    about: "A leading buffalo breed prized for high milk fat content, with a jet-black coat and tightly curled horns.",
    characteristics: ["Jet-black coat", "Curled horns", "Short tail", "High milk fat"],
    color: "#3C4A42"
  }
};

export const initialHistoryEntries = [
  { breed: "Gir", species: "Cattle", confidence: 87, date: "Today" },
  { breed: "Murrah", species: "Buffalo", confidence: 92, date: "Yesterday" },
  { breed: "Sahiwal", species: "Cattle", confidence: 79, date: "Yesterday" }
];

export const weeklyConfidence = [
  { day: "Mon", value: 78 },
  { day: "Tue", value: 88 },
  { day: "Wed", value: 71 },
  { day: "Thu", value: 94 },
  { day: "Fri", value: 87 }
];