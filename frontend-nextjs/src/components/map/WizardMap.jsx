"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── Custom Marker Icon ─────────────────────────────────────────────────────
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// ─── Draggable Marker ───────────────────────────────────────────────────────
function DraggableMarker({ position, onPositionChange }) {
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          onPositionChange(lat, lng);
        }
      },
    }),
    [onPositionChange],
  );
  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      icon={customIcon}
      ref={markerRef}
    />
  );
}

// ─── Map Click Handler ──────────────────────────────────────────────────────
function MapClickHandler({ onPositionChange }) {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// ─── Map Centerer ───────────────────────────────────────────────────────────
function MapCenterer({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
}

// ─── Coordinate Badge ───────────────────────────────────────────────────────
function CoordinateBadge({ lat, lng }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl
        bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
        border border-slate-200/80 dark:border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        transition-all duration-200 hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)]
        hover:border-blue-400/50 dark:hover:border-blue-500/40
        active:scale-[0.98]"
      title="Copier les coordonnées"
    >
      {/* Pin icon */}
      <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/20">
        <svg
          className="w-3 h-3 text-blue-600 dark:text-blue-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      </span>

      {/* Coordinates */}
      <div className="flex flex-col leading-none">
        <span className="text-[9px] font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-0.5">
          Coordonnées
        </span>
        <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200 tabular-nums">
          {lat.toFixed(5)}°, {lng.toFixed(5)}°
        </span>
      </div>

      {/* Copy icon / check */}
      <span className="shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {copied ? (
          <svg
            className="w-3.5 h-3.5 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-3.5 h-3.5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
      </span>
    </button>
  );
}

// ─── Locate Button ──────────────────────────────────────────────────────────
function LocateButton({ onLocate, isLocating }) {
  return (
    <button
      onClick={onLocate}
      disabled={isLocating}
      className="group flex items-center justify-center w-10 h-10 rounded-2xl
        bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
        border border-slate-200/80 dark:border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        transition-all duration-200 hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)]
        hover:border-blue-400/50 dark:hover:border-blue-500/40
        active:scale-[0.96] disabled:opacity-60 disabled:cursor-not-allowed"
      title="Ma position"
    >
      {isLocating ? (
        <svg
          className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      )}
    </button>
  );
}

// ─── Hint Chip ──────────────────────────────────────────────────────────────
function HintChip({ visible }) {
  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl
        bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
        border border-slate-200/80 dark:border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        transition-all duration-500
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
    >
      {/* Animated dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
      </span>
      <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-600 dark:text-slate-300 whitespace-nowrap">
        Cliquez ou déplacez le marqueur
      </span>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function WizardMap({ lat, lng, onPositionChange }) {
  const [isLocating, setIsLocating] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const position = [lat, lng];

  // Hide hint after interaction
  const handlePositionChange = (newLat, newLng) => {
    onPositionChange(newLat, newLng);
    setHintVisible(false);
  };

  // Auto-locate on mount
  useEffect(() => {
    let mounted = true;
    if (navigator.geolocation) {
      setTimeout(() => {
        if (mounted) setIsLocating(true);
      }, 0);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (mounted) {
            onPositionChange(pos.coords.latitude, pos.coords.longitude);
            setIsLocating(false);
          }
        },
        (err) => {
          console.warn("Geolocation failed", err);
          if (mounted) setIsLocating(false);
        },
      );
    }
    // Fade in map
    const t = setTimeout(() => {
      if (mounted) setMapReady(true);
    }, 100);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onPositionChange(pos.coords.latitude, pos.coords.longitude);
        setIsLocating(false);
      },
      (err) => {
        console.warn("Geolocation failed", err);
        setIsLocating(false);
      },
    );
  };

  return (
    <div
      className={`relative w-full h-full z-0 transition-opacity duration-700 ${mapReady ? "opacity-100" : "opacity-0"}`}
    >
      {/* ── Map ── */}
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        className="rounded-[28px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker
          position={position}
          onPositionChange={handlePositionChange}
        />
        <MapClickHandler onPositionChange={handlePositionChange} />
        <MapCenterer position={position} />
      </MapContainer>

      {/* ── Inset border/glow ring ── */}
      <div
        className="absolute inset-0 rounded-[28px] pointer-events-none z-999
          ring-1 ring-inset ring-black/6 dark:ring-white/8
          shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_24px_64px_rgba(0,0,0,0.12)]
          dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_24px_64px_rgba(0,0,0,0.6)]"
      />

      {/* ── Top-left: Hint chip ── */}
      <div className="absolute top-4 left-4 z-1000">
        <HintChip visible={hintVisible} />
      </div>

      {/* ── Top-right: Locate button ── */}
      <div className="absolute top-4 right-4 z-1000">
        <LocateButton onLocate={handleLocate} isLocating={isLocating} />
      </div>

      {/* ── Bottom-left: Coordinate badge ── */}
      <div className="absolute bottom-4 left-4 z-1000">
        <CoordinateBadge lat={lat} lng={lng} />
      </div>

      {/* ── Bottom-right: Attribution badge ── */}
      <div className="absolute bottom-4 right-4 z-1000">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
            bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
            border border-slate-200/80 dark:border-white/10
            shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
        >
          <svg
            className="w-3 h-3 text-emerald-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-[9px] font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">
            OpenStreetMap
          </span>
        </div>
      </div>
    </div>
  );
}
