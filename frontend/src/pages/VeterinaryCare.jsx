import React, { useState, useEffect } from "react";
import { MapPin, ExternalLink, PhoneCall, MapPinned, Navigation, Loader2, Navigation2, Clock, Phone } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, LayerGroup } from 'react-leaflet';

// Fix for default Leaflet markers in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Distance calculation helper (Haversine Formula)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Helper component to auto-recenter map when location changes
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 12);
    }
  }, [center, map]);
  return null;
}

export default function VeterinaryCare() {
  const [hasRequested, setHasRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [locationError, setLocationError] = useState("");
  const [fetchMessage, setFetchMessage] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const handleRequestLocation = () => {
    setHasRequested(true);
    setIsLoading(true);
    setLocationError("");
    setFetchMessage("");
    setSearchStatus("Requesting location access...");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation([lat, lng]);

          try {
            // Progressive Search with OpenStreetMap and Local Fallback
            const fetchHospitals = async (radiusMeters) => {
              let results = [];

              // 1. BROAD-NET OPENSTREETMAP API
              try {
                // Highly aggressive query catching translations and non-standard Indian mapping tags
                const query = `[out:json];
(
  nwr(around:${radiusMeters},${lat},${lng})["amenity"="veterinary"];
  nwr(around:${radiusMeters},${lat},${lng})["healthcare"="veterinary"];
  nwr(around:${radiusMeters},${lat},${lng})["name"~"veterinary",i];
  nwr(around:${radiusMeters},${lat},${lng})["name"~"animal hospital",i];
  nwr(around:${radiusMeters},${lat},${lng})["name"~"pashu",i];
  nwr(around:${radiusMeters},${lat},${lng})["name"~"vet",i];
);
out center;`;
                const encodedQuery = encodeURIComponent(query);
                const endpoints = [
                  `https://overpass-api.de/api/interpreter?data=${encodedQuery}`,
                  `https://lz4.overpass-api.de/api/interpreter?data=${encodedQuery}`,
                  `https://overpass.kumi.systems/api/interpreter?data=${encodedQuery}`
                ];

                for (const url of endpoints) {
                  try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 12000); 
                    const response = await fetch(url, { signal: controller.signal });
                    clearTimeout(timeoutId);
                    
                    if (response.ok) {
                      const osmData = await response.json();
                      if (osmData.elements) {
                        osmData.elements.forEach(el => {
                          const elLat = el.lat || el.center?.lat;
                          const elLon = el.lon || el.center?.lon;
                          if (elLat && elLon) {
                            results.push({
                              id: el.id,
                              lat: elLat,
                              lng: elLon,
                              name: el.tags?.name || "Veterinary Clinic",
                              phone: el.tags?.phone || el.tags?.["contact:phone"] || "Phone not available",
                              address: el.tags?.["addr:full"] || el.tags?.["addr:street"] || "Address not provided",
                              opening_hours: el.tags?.opening_hours || "Hours not specified"
                            });
                          }
                        });
                      }
                      break; // Successfully fetched from a mirror, exit loop
                    }
                  } catch (e) {
                    console.warn("OSM Mirror failed or timed out:", url);
                  }
                }
              } catch (e) {
                console.warn("OSM pipeline failed:", e);
              }

              // 3. BULLETPROOF LOCAL FALLBACK DATABASE (Option 4)
              // If both APIs fail or return 0 results (very common in rural India), use this hardcoded list.
              const LOCAL_CLINICS_DB = [
                {
                  id: "loc1",
                  lat: 23.1995,
                  lng: 77.0801,
                  name: "Sehore Govt. Veterinary Hospital",
                  phone: "+91 7562 224 555",
                  address: "Main Road, Sehore, Madhya Pradesh",
                  opening_hours: "Mon-Sat 10:00 AM - 5:00 PM"
                },
                {
                  id: "loc2",
                  lat: 23.2625,
                  lng: 77.4024,
                  name: "State Veterinary Hospital / Rajya Pashu Chikitsalay",
                  phone: "0755 276 7141",
                  address: "Jail Rd, Bhopal, Madhya Pradesh",
                  opening_hours: "Open 24 hours"
                },
                {
                  id: "loc3",
                  lat: 23.1932,
                  lng: 77.4334,
                  name: "Pet Spectrum Veterinary Clinic And Surgery Center",
                  phone: "Phone not available",
                  address: "A61, SAKSHI BUNGLOW, GULMOHAR, near AURA MALL, Bhopal",
                  opening_hours: "Open 24 hours"
                }
              ];

              if (results.length === 0) {
                // Manually inject local clinics that are within the radius
                LOCAL_CLINICS_DB.forEach(clinic => {
                  const dist = getDistanceFromLatLonInKm(lat, lng, clinic.lat, clinic.lng) * 1000;
                  if (dist <= radiusMeters) {
                    results.push(clinic);
                  }
                });
              }

              return results;
            };

            setSearchStatus("Scanning 40 km radius for veterinary hospitals...");
            let allClinics = await fetchHospitals(40000);

            if (allClinics.length < 3) {
              setSearchStatus("Scanning 60 km radius for veterinary hospitals...");
              allClinics = await fetchHospitals(60000);
            }

            if (allClinics.length < 3) {
              setSearchStatus("Scanning 100 km radius for veterinary hospitals...");
              allClinics = await fetchHospitals(100000);
            }

            if (allClinics.length > 0) {
              const uniqueClinics = [];
              const seenNames = new Set();
              
              allClinics.forEach(c => {
                const distance = getDistanceFromLatLonInKm(lat, lng, c.lat, c.lng);
                c.distance = distance.toFixed(1);
                
                // Deduplicate by name + approximate distance to merge OSM and Foursquare overlapping results
                const dedupKey = `${c.name.toLowerCase().substring(0, 10)}_${Math.round(distance)}`;
                if (!seenNames.has(dedupKey)) {
                  seenNames.add(dedupKey);
                  uniqueClinics.push(c);
                }
              });

              const nearestClinics = uniqueClinics.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)).slice(0, 3);
              setHospitals(nearestClinics);
            } else {
              setHospitals([]);
              setFetchMessage("No hospital within this distance.");
            }
          } catch (error) {
            // Live OpenStreetMap API was blocked, timed out, or failed.
            // DO NOT GENERATE DUMMY DATA.
            setHospitals([]);
            setFetchMessage("No hospital within this distance.");
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error(error);
          setLocationError("Location permission was denied. Please allow location access in your browser to find nearby clinics.");
          setIsLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full max-w-[1400px] mx-auto min-h-[calc(100vh-120px)]">
      <div className="mb-2">
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-serif font-bold text-[#16291E] tracking-tight leading-tight">
          Veterinary Care
        </h1>
        <p className="text-sm sm:text-base text-[#79746A] mt-1.5 font-sans max-w-2xl">
          Locate nearest animal hospitals, clinics, and emergency veterinary services based on your current location.
        </p>
      </div>

      {!hasRequested ? (
        <div className="glass p-10 flex flex-col items-center justify-center text-center min-h-[60vh] rounded-2xl flex-1">
          <div className="w-20 h-20 bg-[#E8F2EC] text-[#173B2B] rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#173B2B]/10">
            <MapPin className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#16291E] mb-3">Find Nearby Veterinary Care</h2>
          <p className="text-[#79746A] font-sans max-w-md mb-8 text-base">
            We need access to your location to accurately find the nearest and most relevant veterinary clinics and hospitals for your cattle.
          </p>
          <button
            onClick={handleRequestLocation}
            className="flex items-center gap-2.5 bg-[#173B2B] hover:bg-[#204d39] text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Navigation className="w-5 h-5" />
            Enable Location
          </button>
        </div>
      ) : isLoading ? (
        <div className="glass p-10 flex flex-col items-center justify-center text-center min-h-[60vh] rounded-2xl flex-1">
          <Loader2 className="w-12 h-12 text-[#173B2B] animate-spin mb-6" />
          <h2 className="text-xl font-serif font-semibold text-[#16291E]">Finding nearby veterinary care...</h2>
          <p className="text-[#79746A] font-sans mt-3 text-base animate-pulse">{searchStatus}</p>
        </div>
      ) : locationError ? (
        <div className="glass p-10 flex flex-col items-center justify-center text-center min-h-[60vh] rounded-2xl flex-1">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100">
            <MapPinned className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#16291E] mb-3">Location Access Denied</h2>
          <p className="text-[#79746A] font-sans max-w-md mb-8 text-base">{locationError}</p>
          <button
            onClick={handleRequestLocation}
            className="flex items-center gap-2.5 bg-[#E5E0D5] hover:bg-[#d6d0c4] text-[#16291E] px-8 py-3.5 rounded-xl font-semibold transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* List of Hospitals */}
          <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
            <h3 className="text-xl font-serif font-bold text-[#16291E] mb-2 px-1">
              Nearest Facilities
            </h3>

            {fetchMessage && (
              <div className="glass p-4 rounded-xl border border-[#D97706]/30 bg-[#FDF8ED] text-sm text-[#7A4E1B] font-medium text-center">
                {fetchMessage}
              </div>
            )}

            {hospitals.map((hospital, index) => (
              <div key={hospital.id} className="glass p-5 rounded-2xl border border-white/60 hover:border-[#173B2B]/30 transition-colors shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-[#16291E] text-[17px] leading-tight pr-4">{hospital.name}</h4>
                  <span className="bg-[#E8F2EC] text-[#173B2B] text-xs font-bold px-2.5 py-1.5 rounded-md shrink-0 shadow-sm border border-[#173B2B]/10">
                    {hospital.distance} km
                  </span>
                </div>

                <div className="flex flex-col gap-3 mt-4 text-sm text-[#5C584F]">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#173B2B]/70" />
                    <span className="leading-snug">{hospital.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 shrink-0 text-[#173B2B]/70" />
                    <span className="font-medium text-[#16291E]">{hospital.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 shrink-0 text-[#173B2B]/70" />
                    <span>{hospital.opening_hours}</span>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-[#F4F1EA] hover:bg-[#E5E0D5] text-[#173B2B] py-3 rounded-xl font-bold transition-colors text-sm border border-[#E5E0D5]"
                >
                  <Navigation2 className="w-4 h-4" />
                  Get Directions
                </a>
              </div>
            ))}
          </div>

          {/* Map View */}
          <div className="lg:col-span-2 relative w-full h-[600px] rounded-3xl overflow-hidden border-2 border-[#E5E0D5] bg-[#F4F1EA] shadow-inner">
            {userLocation && (
              <MapContainer
                center={userLocation}
                zoom={12}
                scrollWheelZoom={true}
                attributionControl={false}
                style={{ width: '100%', height: '100%' }}
              >
                <RecenterMap center={userLocation} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User Location */}
                <Marker position={userLocation}>
                  <Popup><strong className="text-[#173B2B] text-base">You are here</strong></Popup>
                </Marker>

                {/* Hospitals and connecting lines */}
                {hospitals.map(hospital => (
                  <LayerGroup key={hospital.id}>
                    <Marker position={[hospital.lat, hospital.lng]}>
                      <Popup>
                        <div className="font-sans">
                          <strong className="text-[15px]">{hospital.name}</strong><br />
                          <span className="text-[#15803D] font-medium">{hospital.distance} km away</span>
                        </div>
                      </Popup>
                    </Marker>
                    <Polyline
                      positions={[userLocation, [hospital.lat, hospital.lng]]}
                      pathOptions={{ color: '#173B2B', weight: 3, dashArray: '8, 8', opacity: 0.6 }}
                    />
                  </LayerGroup>
                ))}
              </MapContainer>
            )}
          </div>
        </div>
      )}

      {/* Global Emergency Help */}
      <div className="mt-auto pt-4 pb-2">
        <div className="flex items-center justify-between p-5 rounded-2xl bg-[#FDF8ED] border border-[#ECD1A4]/60 shadow-sm w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fcead5] flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-[#D97706]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#7A4E1B] text-base">Emergency Animal Helpline</h4>
              <p className="text-xs text-[#92400E] font-medium opacity-80">Available 24/7 across India</p>
            </div>
          </div>
          <span className="font-mono font-bold text-[#92400E] text-xl bg-white/50 px-4 py-2 rounded-xl border border-[#ECD1A4]/40">
            1962 <span className="text-sm font-sans font-medium text-[#b45316] ml-1">(Toll Free)</span>
          </span>
        </div>
      </div>
    </div>
  );
}
