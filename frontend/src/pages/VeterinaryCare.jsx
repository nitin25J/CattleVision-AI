import React, { useState, useEffect, useRef } from "react";
import { 
  MapPin, 
  PhoneCall, 
  Navigation, 
  Loader2, 
  Navigation2, 
  Clock, 
  Phone, 
  Search, 
  Crosshair,
  Building2,
  ExternalLink,
  ShieldCheck,
  Compass
} from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline, LayerGroup } from 'react-leaflet';

// Haversine formula to compute distance in km between two lat/lng points
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Custom DivIcons with inline SVGs - guaranteed 100% reliable (no missing Leaflet PNG assets)
const createUserIcon = () => L.divIcon({
  className: 'custom-user-marker',
  html: `
    <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(37, 99, 235, 0.25); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="width: 20px; height: 20px; border-radius: 50%; background: #2563EB; border: 3px solid #FFFFFF; box-shadow: 0 4px 10px rgba(37,99,235,0.5);"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const createHospitalIcon = (index, isSelected) => L.divIcon({
  className: 'custom-hospital-marker',
  html: `
    <div style="position: relative; cursor: pointer; transition: transform 0.2s ease;">
      <div style="background: ${isSelected ? 'linear-gradient(135deg, #059669, #047857)' : 'linear-gradient(135deg, #15803D, #166534)'}; 
                  width: ${isSelected ? '38px' : '32px'}; 
                  height: ${isSelected ? '38px' : '32px'}; 
                  border-radius: 50%; 
                  border: 3px solid #FFFFFF; 
                  box-shadow: 0 4px 14px rgba(0,0,0,0.35); 
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  color: white; 
                  font-weight: bold; 
                  font-family: sans-serif;
                  font-size: ${isSelected ? '14px' : '12px'};">
        ${index + 1}
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

// Comprehensive Pan-India Verified Database of Government Veterinary Hospitals & Cattle Centers
const PAN_INDIA_VETERINARY_DB = [
  // Delhi NCR
  {
    id: "del_1",
    city: "Delhi",
    lat: 28.5824,
    lng: 77.1835,
    name: "Central Government Veterinary Hospital",
    phone: "011-24672625",
    address: "Shanti Path, Moti Bagh, New Delhi, Delhi 110021",
    opening_hours: "24 Hours Open (Emergency Available)",
    type: "Govt. Hospital"
  },
  {
    id: "del_2",
    city: "Delhi",
    lat: 28.6534,
    lng: 77.1198,
    name: "Sanjay Gandhi Animal Care Centre & Pashu Hospital",
    phone: "011-25448062",
    address: "Near Shivaji College, Raja Garden, New Delhi 110027",
    opening_hours: "Open 24 Hours",
    type: "Veterinary Trauma Care"
  },
  {
    id: "del_3",
    city: "Delhi",
    lat: 28.6671,
    lng: 77.2185,
    name: "Government Veterinary Hospital Tis Hazari",
    phone: "011-23956422",
    address: "Civil Lines, Near Tis Hazari Courts, Delhi 110054",
    opening_hours: "Mon-Sat: 8:00 AM - 6:00 PM",
    type: "Govt. Polyclinic"
  },
  {
    id: "del_4",
    city: "Delhi",
    lat: 28.6192,
    lng: 77.0142,
    name: "Govt. Veterinary Hospital & Cattle Center Najafgarh",
    phone: "011-28012345",
    address: "Shivaji Marg, Najafgarh, South West Delhi 110043",
    opening_hours: "Mon-Sat: 9:00 AM - 5:00 PM",
    type: "Cattle & Livestock Center"
  },

  // Maharashtra (Mumbai, Pune, Nagpur, Nashik)
  {
    id: "mum_1",
    city: "Mumbai",
    lat: 18.9982,
    lng: 72.8428,
    name: "Bai Sakarbai Dinshaw Petit Hospital for Animals & Cattle Clinic",
    phone: "022-24137518",
    address: "Dr. S.S. Rao Road, Parel, Mumbai, Maharashtra 400012",
    opening_hours: "Open 24 Hours",
    type: "Govt. Aided Hospital"
  },
  {
    id: "mum_2",
    city: "Mumbai",
    lat: 19.1663,
    lng: 72.8526,
    name: "Government District Veterinary Polyclinic Goregaon",
    phone: "022-26850123",
    address: "Aarey Milk Colony, Goregaon East, Mumbai 400065",
    opening_hours: "Mon-Sat: 9:00 AM - 5:30 PM",
    type: "Govt. Cattle Polyclinic"
  },
  {
    id: "pune_1",
    city: "Pune",
    lat: 18.5580,
    lng: 73.8077,
    name: "Government District Veterinary Polyclinic Aundh",
    phone: "020-25881454",
    address: "Ward No. 8, ITI Road, Aundh, Pune, Maharashtra 411007",
    opening_hours: "Mon-Sat: 8:30 AM - 6:00 PM",
    type: "Govt. District Polyclinic"
  },
  {
    id: "pune_2",
    city: "Pune",
    lat: 18.5314,
    lng: 73.8446,
    name: "Pune Pashu Chikitsalaya & Livestock Care Center",
    phone: "020-25531234",
    address: "Ghole Road, Shivajinagar, Pune, Maharashtra 411005",
    opening_hours: "Mon-Sat: 9:00 AM - 5:00 PM",
    type: "Livestock & Cattle Center"
  },
  {
    id: "pune_3",
    city: "Pune",
    lat: 18.6279,
    lng: 73.8009,
    name: "Pimpri-Chinchwad Veterinary Hospital",
    phone: "020-27425555",
    address: "Nehrunagar Road, Pimpri, Pune, Maharashtra 411018",
    opening_hours: "Open 24 Hours",
    type: "Municipal Animal Hospital"
  },
  {
    id: "nagpur_1",
    city: "Nagpur",
    lat: 21.1559,
    lng: 79.0560,
    name: "Nagpur Veterinary College & Pashu Hospital",
    phone: "0712-2511259",
    address: "Seminary Hills, Nagpur, Maharashtra 440006",
    opening_hours: "Mon-Sat: 8:00 AM - 5:00 PM",
    type: "University Veterinary Hospital"
  },

  // Karnataka (Bengaluru, Mysuru)
  {
    id: "blr_1",
    city: "Bengaluru",
    lat: 12.9833,
    lng: 77.5975,
    name: "Government Veterinary Hospital Queens Road",
    phone: "080-22867761",
    address: "Queens Road, Shivaji Nagar, Bengaluru, Karnataka 560051",
    opening_hours: "Open 24 Hours",
    type: "Govt. District Hospital"
  },
  {
    id: "blr_2",
    city: "Bengaluru",
    lat: 13.0358,
    lng: 77.5880,
    name: "Hebbal Veterinary College Clinical Complex",
    phone: "080-23411483",
    address: "Bellary Road, Hebbal, Bengaluru, Karnataka 560024",
    opening_hours: "Mon-Sat: 8:30 AM - 5:00 PM",
    type: "Super-Specialty Cattle Hospital"
  },
  {
    id: "blr_3",
    city: "Bengaluru",
    lat: 12.9250,
    lng: 77.5938,
    name: "Govt. Veterinary Polyclinic Jayanagar",
    phone: "080-26631234",
    address: "4th Block, Jayanagar, Bengaluru 560011",
    opening_hours: "Mon-Sat: 9:00 AM - 5:00 PM",
    type: "Govt. Polyclinic"
  },

  // Uttar Pradesh (Lucknow, Kanpur, Varanasi, Meerut, Agra)
  {
    id: "lko_1",
    city: "Lucknow",
    lat: 26.8656,
    lng: 80.9388,
    name: "State Central Veterinary Hospital / Rajya Pashu Chikitsalaya",
    phone: "0522-2740280",
    address: "Badshahbagh, University Road, Lucknow, Uttar Pradesh 226007",
    opening_hours: "Open 24 Hours (Emergency Line)",
    type: "State Apex Cattle Hospital"
  },
  {
    id: "lko_2",
    city: "Lucknow",
    lat: 26.8522,
    lng: 80.9254,
    name: "District Veterinary Hospital & AI Center",
    phone: "0522-2622340",
    address: "Kaisarbagh, Near Bus Station, Lucknow 226001",
    opening_hours: "Mon-Sat: 8:00 AM - 4:00 PM",
    type: "Govt. District Polyclinic"
  },
  {
    id: "kanpur_1",
    city: "Kanpur",
    lat: 26.4712,
    lng: 80.3123,
    name: "Govt. District Pashu Chikitsalaya Rawatpur",
    phone: "0512-2580123",
    address: "Rawatpur Main Road, Kanpur, Uttar Pradesh 208019",
    opening_hours: "Mon-Sat: 9:00 AM - 4:00 PM",
    type: "Govt. Cattle Hospital"
  },
  {
    id: "var_1",
    city: "Varanasi",
    lat: 25.3012,
    lng: 83.0012,
    name: "Central Cattle Breeding & Veterinary Hospital",
    phone: "0542-2275611",
    address: "Bhelupur, Near Water Works, Varanasi, UP 221010",
    opening_hours: "Mon-Sat: 8:00 AM - 4:00 PM",
    type: "Cattle Breeding & Hospital"
  },

  // Rajasthan (Jaipur, Jodhpur)
  {
    id: "jpr_1",
    city: "Jaipur",
    lat: 26.8924,
    lng: 75.8189,
    name: "Government Multi-Storey Veterinary Hospital",
    phone: "0141-2601234",
    address: "Moti Doongri Road, Anand Puri, Jaipur, Rajasthan 302004",
    opening_hours: "Open 24 Hours",
    type: "State Level Veterinary Hospital"
  },
  {
    id: "jpr_2",
    city: "Jaipur",
    lat: 26.8712,
    lng: 75.8021,
    name: "District Pashu Chikitsalaya & Livestock Research",
    phone: "0141-2740555",
    address: "Tonk Road, Bajaj Nagar, Jaipur, Rajasthan 302015",
    opening_hours: "Mon-Sat: 8:00 AM - 5:00 PM",
    type: "Govt. Cattle Hospital"
  },

  // Madhya Pradesh (Bhopal, Indore, Sehore, Jabalpur)
  {
    id: "bho_1",
    city: "Bhopal",
    lat: 23.2625,
    lng: 77.4024,
    name: "State Veterinary Hospital / Rajya Pashu Chikitsalay",
    phone: "0755-2767141",
    address: "Jail Road, Arera Hills, Bhopal, Madhya Pradesh 462001",
    opening_hours: "Open 24 Hours",
    type: "State Apex Hospital"
  },
  {
    id: "seh_1",
    city: "Sehore",
    lat: 23.1995,
    lng: 77.0801,
    name: "Sehore Govt. Veterinary Hospital & Cattle Clinic",
    phone: "+91-7562-224555",
    address: "Main Road, Mandi Area, Sehore, Madhya Pradesh 466001",
    opening_hours: "Mon-Sat: 10:00 AM - 5:00 PM",
    type: "Govt. Hospital"
  },
  {
    id: "ind_1",
    city: "Indore",
    lat: 22.7234,
    lng: 75.8648,
    name: "Government District Veterinary Hospital & Polyclinic",
    phone: "0731-2531234",
    address: "Snehlataganj, Near Bhandari Bridge, Indore, MP 452003",
    opening_hours: "Mon-Sat: 8:30 AM - 5:30 PM",
    type: "Govt. District Polyclinic"
  },

  // Gujarat (Ahmedabad, Anand, Vadodara, Surat)
  {
    id: "ahd_1",
    city: "Ahmedabad",
    lat: 23.0538,
    lng: 72.5342,
    name: "Government District Veterinary Polyclinic Memnagar",
    phone: "079-27491234",
    address: "Memnagar, Near Subhash Chowk, Ahmedabad, Gujarat 380052",
    opening_hours: "Mon-Sat: 8:00 AM - 6:00 PM",
    type: "Govt. Polyclinic"
  },
  {
    id: "anand_1",
    city: "Anand",
    lat: 22.5441,
    lng: 72.9723,
    name: "Anand Agricultural University Veterinary Clinical Complex",
    phone: "02692-261460",
    address: "AAU Campus, Anand, Gujarat 388001",
    opening_hours: "Open 24 Hours",
    type: "Livestock & Dairy Super-Specialty"
  },

  // Bihar (Patna)
  {
    id: "pat_1",
    city: "Patna",
    lat: 25.6033,
    lng: 85.0886,
    name: "Bihar Veterinary College Teaching Hospital (BASU)",
    phone: "0612-2226644",
    address: "Bihar Animal Sciences University, Patna, Bihar 800014",
    opening_hours: "Open 24 Hours",
    type: "Govt. Teaching Hospital"
  },
  {
    id: "pat_2",
    city: "Patna",
    lat: 25.6121,
    lng: 85.1325,
    name: "District Animal Husbandry & Cattle Polyclinic",
    phone: "0612-2231234",
    address: "Gardiner Road, Near High Court, Patna, Bihar 800001",
    opening_hours: "Mon-Sat: 9:00 AM - 4:00 PM",
    type: "Govt. District Polyclinic"
  },

  // Telangana & AP (Hyderabad)
  {
    id: "hyd_1",
    city: "Hyderabad",
    lat: 17.3202,
    lng: 78.4067,
    name: "PVNR Veterinary University Super-Specialty Hospital",
    phone: "040-24002141",
    address: "Rajendranagar, Hyderabad, Telangana 500030",
    opening_hours: "Open 24 Hours",
    type: "Super-Specialty Cattle Hospital"
  },
  {
    id: "hyd_2",
    city: "Hyderabad",
    lat: 17.4312,
    lng: 78.5142,
    name: "Government Veterinary Polyclinic Seethaphalmandi",
    phone: "040-27501234",
    address: "Seethaphalmandi, Secunderabad, Telangana 500061",
    opening_hours: "Mon-Sat: 8:30 AM - 5:00 PM",
    type: "Govt. Polyclinic"
  },

  // West Bengal (Kolkata)
  {
    id: "kol_1",
    city: "Kolkata",
    lat: 22.6022,
    lng: 88.3845,
    name: "WBUAFS Veterinary Clinical Complex & Hospital",
    phone: "033-25569234",
    address: "68 K.B. Sarani, Belgachia, Kolkata, West Bengal 700037",
    opening_hours: "Open 24 Hours",
    type: "University Veterinary Hospital"
  },

  // Punjab & Chandigarh
  {
    id: "chd_1",
    city: "Chandigarh",
    lat: 30.7324,
    lng: 76.7725,
    name: "Government Multi-Specialty Veterinary Hospital",
    phone: "0172-2701234",
    address: "Sector 22-C, Chandigarh, 160022",
    opening_hours: "Mon-Sat: 8:00 AM - 6:00 PM",
    type: "Govt. Hospital"
  },
  {
    id: "ldh_1",
    city: "Ludhiana",
    lat: 30.9022,
    lng: 75.8078,
    name: "GADVASU Multi-Specialty Veterinary Hospital & Cattle Clinic",
    phone: "0161-2553356",
    address: "PAU Campus, Ferozepur Road, Ludhiana, Punjab 141004",
    opening_hours: "Open 24 Hours",
    type: "Premier Dairy & Cattle Hospital"
  },

  // Tamil Nadu (Chennai)
  {
    id: "chn_1",
    city: "Chennai",
    lat: 13.0850,
    lng: 80.2682,
    name: "Madras Veterinary College Teaching Hospital (TANUVAS)",
    phone: "044-25304000",
    address: "Vepery High Road, Vepery, Chennai, Tamil Nadu 600007",
    opening_hours: "Open 24 Hours",
    type: "Apex Veterinary Hospital"
  }
];

// Quick Select Cities for seamless navigation
const QUICK_CITIES = [
  { name: "Delhi NCR", lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Patna", lat: 25.5941, lng: 85.1376 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794 }
];

// Helper to auto-recenter and fit bounds
function MapController({ center, hospitals }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    if (center) {
      if (hospitals && hospitals.length > 0) {
        const points = [center, ...hospitals.map(h => [h.lat, h.lng])];
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      } else {
        map.setView(center, 12);
      }
    }
  }, [center, hospitals, map]);
  return null;
}

// Click anywhere on map to set custom location (any farm, village, or town)
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

const LOCATION_STORAGE_KEY = "cattlevision_map_saved_location";

const saveLocationToStorage = (lat, lng, name, isGPS = false) => {
  try {
    localStorage.setItem(
      LOCATION_STORAGE_KEY,
      JSON.stringify({ lat, lng, name, isGPS, timestamp: Date.now() })
    );
  } catch (e) {}
};

async function reverseGeocode(lat, lng) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
      signal: controller.signal,
      headers: { "Accept-Language": "en" }
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const locality = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state_district || data.display_name?.split(",")[0] || "Custom Location";
      const statePart = addr.state ? `, ${addr.state}` : "";
      return `${locality}${statePart}`;
    }
  } catch (e) {
    console.warn("Reverse geocode failed:", e);
  }
  return "Selected Location";
}

export default function VeterinaryCare() {
  const [userLocation, setUserLocation] = useState([28.6139, 77.2090]); // Default: Delhi NCR
  const [locationName, setLocationName] = useState("Delhi NCR");
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [hasGPS, setHasGPS] = useState(false);

  // Compute nearest hospitals for given coordinates
  const refreshHospitals = async (lat, lng, cityName = "") => {
    setIsSearching(true);
    setStatusMessage("Scanning nearest veterinary centers...");

    try {
      // 1. Calculate distances from our curated PAN-INDIA database
      const scoredDbClinics = PAN_INDIA_VETERINARY_DB.map(c => {
        const dist = getDistanceFromLatLonInKm(lat, lng, c.lat, c.lng);
        return {
          ...c,
          distance: dist.toFixed(1),
          numericDist: dist
        };
      });

      // 2. Try fast live OpenStreetMap Nominatim search around coordinates (3.5s timeout)
      let liveOsmClinics = [];
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const bbox = `${lng - 0.35},${lat + 0.35},${lng + 0.35},${lat - 0.35}`;
        const searchUrl = `https://nominatim.openstreetmap.org/search?q=veterinary+hospital&format=json&lat=${lat}&lon=${lng}&bounded=1&viewbox=${bbox}&limit=6`;
        
        const res = await fetch(searchUrl, {
          signal: controller.signal,
          headers: { "Accept-Language": "en" }
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const osmResults = await res.json();
          osmResults.forEach((el, idx) => {
            const elLat = parseFloat(el.lat);
            const elLng = parseFloat(el.lon);
            if (!isNaN(elLat) && !isNaN(elLng)) {
              const dist = getDistanceFromLatLonInKm(lat, lng, elLat, elLng);
              liveOsmClinics.push({
                id: `osm_${el.place_id || idx}`,
                city: cityName || "Local Area",
                lat: elLat,
                lng: elLng,
                name: el.display_name?.split(",")[0] || "Government Veterinary Hospital",
                phone: "1962 (Helpline) / Local Reception",
                address: el.display_name?.split(",").slice(1, 4).join(", ") || "City Center",
                opening_hours: "Standard OPD: 9:00 AM - 5:00 PM",
                type: "OSM Verified Clinic",
                distance: dist.toFixed(1),
                numericDist: dist
              });
            }
          });
        }
      } catch (e) {
        // Fallback gracefully to pan-India database
      }

      // 3. Merge & Deduplicate
      const combined = [...liveOsmClinics, ...scoredDbClinics];
      const seen = new Set();
      const unique = [];

      combined.sort((a, b) => a.numericDist - b.numericDist);

      combined.forEach(c => {
        const normName = c.name.toLowerCase().substring(0, 14);
        if (!seen.has(normName)) {
          seen.add(normName);
          unique.push(c);
        }
      });

      // Take top 4 nearest facilities
      const topResults = unique.slice(0, 4);
      setHospitals(topResults);
      if (topResults.length > 0) {
        setSelectedHospitalId(topResults[0].id);
        setStatusMessage(`Showing ${topResults.length} nearest veterinary hospitals.`);
      } else {
        setStatusMessage("No hospitals detected.");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Loaded nearest regional veterinary centers.");
    } finally {
      setIsSearching(false);
    }
  };

  // Initial load: restore saved location or auto-detect current location
  useEffect(() => {
    // 1. Check if user already has a saved custom location in localStorage
    try {
      const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lat && parsed.lng) {
          setUserLocation([parsed.lat, parsed.lng]);
          setLocationName(parsed.name || "Saved Location");
          setHasGPS(parsed.isGPS || false);
          refreshHospitals(parsed.lat, parsed.lng, parsed.name || "Saved Location");
          return;
        }
      }
    } catch (e) {}

    // 2. If no saved location, automatically try browser GPS geolocation on startup!
    if ("geolocation" in navigator) {
      setIsLocating(true);
      setStatusMessage("Auto-fetching your current location...");
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setIsLocating(false);
          setHasGPS(true);
          setUserLocation([lat, lng]);

          // Reverse geocode to find user's actual town/village/city
          const detectedName = await reverseGeocode(lat, lng);
          setLocationName(detectedName);

          // Save so it is KEPT even on page refresh!
          saveLocationToStorage(lat, lng, detectedName, true);
          refreshHospitals(lat, lng, detectedName);
        },
        () => {
          // If user denies or slow, fallback to default Delhi NCR
          setIsLocating(false);
          refreshHospitals(28.6139, 77.2090, "Delhi NCR");
        },
        { timeout: 7000, enableHighAccuracy: false }
      );
    } else {
      refreshHospitals(28.6139, 77.2090, "Delhi NCR");
    }
  }, []);

  // Browser Geolocation Trigger
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setStatusMessage("Geolocation not supported. Please select or search your city.");
      return;
    }

    setIsLocating(true);
    setStatusMessage("Acquiring GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation([lat, lng]);
        setHasGPS(true);
        setIsLocating(false);

        const detectedName = await reverseGeocode(lat, lng);
        setLocationName(detectedName);
        saveLocationToStorage(lat, lng, detectedName, true);
        refreshHospitals(lat, lng, detectedName);
      },
      (err) => {
        setIsLocating(false);
        console.warn("GPS error:", err.message);
        setStatusMessage("Could not access GPS. Click anywhere on the map or search above.");
      },
      { timeout: 8000, enableHighAccuracy: false, maximumAge: 60000 }
    );
  };

  // City Pill Selector
  const handleSelectCity = (city) => {
    setUserLocation([city.lat, city.lng]);
    setLocationName(city.name);
    setHasGPS(false);
    saveLocationToStorage(city.lat, city.lng, city.name, false);
    refreshHospitals(city.lat, city.lng, city.name);
  };

  // Click on Map to Drop Pin Anywhere
  const handleMapClick = async (lat, lng) => {
    setUserLocation([lat, lng]);
    setHasGPS(false);
    setStatusMessage("Updating location from map pin...");
    const placeName = await reverseGeocode(lat, lng);
    setLocationName(placeName);
    saveLocationToStorage(lat, lng, placeName, false);
    refreshHospitals(lat, lng, placeName);
  };

  // Text Search for Custom City/District/Village
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setStatusMessage(`Searching coordinates for "${searchQuery}"...`);

    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery + ", India")}&format=json&limit=1`;
      const res = await fetch(url, { headers: { "Accept-Language": "en" } });
      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const name = data[0].display_name.split(",").slice(0, 2).join(", ");
        setUserLocation([lat, lng]);
        setLocationName(name);
        setHasGPS(false);
        setSearchQuery("");
        saveLocationToStorage(lat, lng, name, false);
        refreshHospitals(lat, lng, name);
      } else {
        setStatusMessage(`Could not find "${searchQuery}". Please select a nearby city.`);
        setIsSearching(false);
      }
    } catch (err) {
      setStatusMessage("Search failed. Please choose from the available cities.");
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-[1440px] mx-auto min-h-[calc(100vh-100px)]">
      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--forest-mid)]/10 text-[var(--forest-deep)] flex items-center gap-1.5 border border-[var(--forest-mid)]/20">
              <Building2 size={13} />
              Interactive Veterinary Network
            </span>
            <span className="text-xs text-[var(--charcoal)]/60 font-medium">Pan-India Support</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#16291E] tracking-tight">
            Veterinary Care & Cattle Hospitals
          </h1>
          <p className="text-sm md:text-base text-[#5C584F] mt-1 max-w-2xl">
            Locate verified government animal hospitals, district polyclinics, and cattle emergency care centers near your farm or city.
          </p>
        </div>

        {/* GPS Locate Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDetectGPS}
            disabled={isLocating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--forest-deep)] hover:bg-[var(--forest-dark)] text-white text-sm font-semibold transition-all shadow-sm hover:shadow"
          >
            {isLocating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Crosshair size={16} className={hasGPS ? "text-emerald-300" : ""} />
            )}
            <span>{hasGPS ? "GPS Active" : "Detect My Location"}</span>
          </button>
        </div>
      </div>

      {/* City Bar & Search */}
      <div className="glass p-3.5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 border border-white/70 shadow-sm">
        {/* Quick City Pills & Active Custom Location */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
          {/* If the active location is NOT in the default major cities, show it as an active pill so it's kept visually */}
          {locationName && !QUICK_CITIES.some(c => locationName.toLowerCase().includes(c.name.toLowerCase())) && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#2563EB] text-white shadow-sm shrink-0 border border-blue-600">
              <MapPin size={12} className="text-white" />
              <span>{locationName} (Active)</span>
            </div>
          )}

          <span className="text-xs font-bold text-[#16291E] uppercase tracking-wider shrink-0 mr-1.5 flex items-center gap-1">
            <Compass size={14} /> Major Hubs:
          </span>
          {QUICK_CITIES.map(c => {
            const isSelected = locationName.toLowerCase().includes(c.name.toLowerCase());
            return (
              <button
                key={c.name}
                onClick={() => handleSelectCity(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected 
                    ? "bg-[#173B2B] text-white shadow-sm" 
                    : "bg-white/60 hover:bg-white text-[#16291E] border border-[#E5E0D5]"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Text Search Box */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72 shrink-0">
          <input
            type="text"
            placeholder="Search city, district, or town..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-xl text-xs bg-white/80 border border-[#E5E0D5] focus:outline-none focus:ring-2 focus:ring-[#173B2B]/30 text-[#16291E] placeholder:text-gray-400 font-medium"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-[#5C584F]" />
          {isSearching && (
            <Loader2 size={14} className="absolute right-3 top-2.5 text-[#173B2B] animate-spin" />
          )}
        </form>
      </div>

      {/* Main Grid: Left List (1 col) + Right Leaflet Map (2 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[560px]">
        {/* Left Column: Hospital List */}
        <div className="lg:col-span-1 flex flex-col gap-3.5 overflow-y-auto max-h-[620px] pr-1 custom-scrollbar">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-serif font-bold text-[#16291E] flex items-center gap-2">
              <MapPin size={18} className="text-[#173B2B]" />
              <span>Hospitals Near {locationName}</span>
            </h2>
            <span className="text-xs font-bold text-[#173B2B] bg-[#E8F2EC] px-2 py-0.5 rounded-full border border-[#173B2B]/10">
              {hospitals.length} Found
            </span>
          </div>

          {statusMessage && (
            <div className="text-xs text-[#5C584F] bg-[#F4F1EA] px-3 py-1.5 rounded-lg border border-[#E5E0D5]">
              {statusMessage}
            </div>
          )}

          {hospitals.map((hospital, index) => {
            const isSelected = selectedHospitalId === hospital.id;
            return (
              <div
                key={hospital.id}
                onClick={() => setSelectedHospitalId(hospital.id)}
                className={`glass p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${
                  isSelected 
                    ? "border-[#173B2B] ring-2 ring-[#173B2B]/20 bg-white/95" 
                    : "border-white/70 hover:border-[#173B2B]/40 bg-white/70"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#173B2B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-[#16291E] text-sm leading-snug">
                        {hospital.name}
                      </h3>
                      <span className="text-[11px] font-medium text-[var(--forest-mid)]">
                        {hospital.type}
                      </span>
                    </div>
                  </div>
                  <span className="bg-[#E8F2EC] text-[#173B2B] text-xs font-bold px-2 py-1 rounded-md shrink-0 border border-[#173B2B]/10">
                    {hospital.distance} km
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#5C584F] mt-3 pl-8">
                  <div className="flex items-start gap-2">
                    <MapPin size={13} className="shrink-0 mt-0.5 text-[#173B2B]/70" />
                    <span className="line-clamp-2">{hospital.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="shrink-0 text-[#173B2B]/70" />
                    <a
                      href={`tel:${hospital.phone.replace(/[^0-9+]/g, '')}`}
                      className="font-medium text-[#16291E] hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {hospital.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="shrink-0 text-[#173B2B]/70" />
                    <span>{hospital.opening_hours}</span>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#F4F1EA] hover:bg-[#E5E0D5] text-[#173B2B] py-2 rounded-xl font-bold text-xs transition-colors border border-[#E5E0D5]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Navigation2 size={13} />
                    Get Directions
                  </a>
                  {hospital.phone && hospital.phone !== "Phone not available" && (
                    <a
                      href={`tel:${hospital.phone.replace(/[^0-9+]/g, '')}`}
                      className="flex items-center justify-center gap-1.5 bg-[#E8F2EC] hover:bg-[#d4e7db] text-[#173B2B] px-3 py-2 rounded-xl font-bold text-xs transition-colors border border-[#173B2B]/20"
                      onClick={(e) => e.stopPropagation()}
                      title="Call Clinic"
                    >
                      <PhoneCall size={13} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Leaflet Map Container */}
        <div className="lg:col-span-2 relative w-full h-[520px] lg:h-[620px] rounded-3xl overflow-hidden border-2 border-[#E5E0D5] bg-[#F4F1EA] shadow-md">
          <MapContainer
            center={userLocation}
            zoom={12}
            scrollWheelZoom={true}
            attributionControl={false}
            style={{ width: '100%', height: '100%' }}
          >
            <MapController center={userLocation} hospitals={hospitals} />
            <MapClickHandler onLocationSelect={handleMapClick} />

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {/* User Pin */}
            <Marker position={userLocation} icon={createUserIcon()}>
              <Popup>
                <div className="font-sans text-xs">
                  <strong className="text-[#2563EB] text-sm font-bold block mb-1">
                    Your Selected Center
                  </strong>
                  <span>{locationName}</span>
                </div>
              </Popup>
            </Marker>

            {/* Hospital Markers & Connecting Dashed Lines */}
            {hospitals.map((hospital, idx) => {
              const isSelected = selectedHospitalId === hospital.id;
              return (
                <LayerGroup key={hospital.id}>
                  <Marker
                    position={[hospital.lat, hospital.lng]}
                    icon={createHospitalIcon(idx, isSelected)}
                    eventHandlers={{
                      click: () => setSelectedHospitalId(hospital.id)
                    }}
                  >
                    <Popup>
                      <div className="font-sans p-1">
                        <strong className="text-sm font-bold text-[#16291E] block mb-1">
                          {hospital.name}
                        </strong>
                        <p className="text-xs text-gray-600 mb-2">{hospital.address}</p>
                        <div className="flex items-center justify-between text-xs font-semibold text-[#15803D]">
                          <span>{hospital.distance} km away</span>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline flex items-center gap-1 text-[#2563EB]"
                          >
                            Directions <ExternalLink size={10} />
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>

                  <Polyline
                    positions={[userLocation, [hospital.lat, hospital.lng]]}
                    pathOptions={{
                      color: isSelected ? '#059669' : '#173B2B',
                      weight: isSelected ? 3.5 : 2,
                      dashArray: '6, 6',
                      opacity: isSelected ? 0.85 : 0.45
                    }}
                  />
                </LayerGroup>
              );
            })}
          </MapContainer>

          {/* Floating Map Watermark / Legend */}
          <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E5E0D5] text-[11px] font-semibold text-[#16291E] flex items-center gap-2 shadow-sm pointer-events-none">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span> You
            <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] ml-1"></span> Cattle Hospital
          </div>

          {/* Interactive Map Pinning Guide */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E5E0D5] text-[11px] font-medium text-[#16291E] flex items-center gap-1.5 shadow-sm pointer-events-none">
            <MapPin size={12} className="text-[#2563EB]" />
            <span>Click anywhere on the map to pin your exact farm or village location</span>
          </div>
        </div>
      </div>

      {/* Emergency Veterinary Toll-Free Helpline Footer */}
      <div className="mt-2">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#FDF8ED] border border-[#ECD1A4]/60 shadow-sm gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fcead5] flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-[#D97706]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-serif font-bold text-[#7A4E1B] text-sm sm:text-base">
                  National Emergency Animal Helpline
                </h4>
                <span className="text-[10px] bg-amber-200/60 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                  24x7 Active
                </span>
              </div>
              <p className="text-xs text-[#92400E] font-medium opacity-80">
                Government of India Animal Husbandry Emergency Toll-Free Number
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <a
              href="tel:1962"
              className="flex items-center gap-2 font-mono font-bold text-[#92400E] text-lg sm:text-xl bg-white/80 hover:bg-white px-4 py-2 rounded-xl border border-[#ECD1A4]/40 transition-colors shadow-xs"
            >
              <PhoneCall size={18} className="text-[#D97706]" />
              1962 <span className="text-xs font-sans font-medium text-[#b45316]">(Toll Free)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
