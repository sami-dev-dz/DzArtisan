"use client"
import * as React from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

function FlyToCenter({ lat, lng }) {
  const map = useMap()
  React.useEffect(() => {
    map.setView([lat, lng], 14)
  }, [lat, lng, map])
  return null
}

function PinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

export function MiniMap({ lat, lng, label, address }) {
  const [isHovered, setIsHovered] = React.useState(false)
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`
  const formattedLat = lat.toFixed(4)
  const formattedLng = lng.toFixed(4)

  return (
    <div
      className={`
        group relative rounded-2xl overflow-hidden
        border border-slate-200/80 dark:border-white/8
        bg-white dark:bg-slate-900
        shadow-sm hover:shadow-lg
        transition-all duration-500 ease-out
        ${isHovered ? "scale-[1.005]" : "scale-100"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Bar */}
      <div className="
        flex items-center justify-between
        px-4 py-3
        bg-white/95 dark:bg-slate-900/95
        border-b border-slate-100 dark:border-white/6
        backdrop-blur-sm
        relative z-10
      ">
        <div className="flex items-center gap-2.5">
          {/* Pulsing indicator */}
          <div className="relative flex items-center justify-center w-6 h-6">
            <span className="
              absolute inline-flex h-full w-full rounded-full
              bg-blue-400/30 dark:bg-blue-500/20
              animate-ping
            " />
            <span className="
              relative inline-flex rounded-full w-2.5 h-2.5
              bg-blue-500 dark:bg-blue-400
            " />
          </div>

          <div className="flex flex-col leading-tight">
            {label && (
              <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                {label}
              </span>
            )}
            {address && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[200px]">
                {address}
              </span>
            )}
            {!label && !address && (
              <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                Location
              </span>
            )}
          </div>
        </div>

        {/* Coordinates badge + External link */}
        <div className="flex items-center gap-2">
          <div className="
            flex items-center gap-1.5
            px-2.5 py-1 rounded-lg
            bg-slate-50 dark:bg-slate-800
            border border-slate-200/70 dark:border-white/8
          ">
            <CompassIcon />
            <span className="
              text-[10px] font-mono font-medium
              text-slate-500 dark:text-slate-400
              tracking-wide
            ">
              {formattedLat}, {formattedLng}
            </span>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-1
              px-2.5 py-1 rounded-lg
              bg-blue-50 dark:bg-blue-950/60
              border border-blue-200/60 dark:border-blue-700/40
              text-blue-600 dark:text-blue-400
              text-[11px] font-medium
              hover:bg-blue-100 dark:hover:bg-blue-900/60
              transition-colors duration-200
              whitespace-nowrap
            "
          >
            <ExternalLinkIcon />
            <span>Open</span>
          </a>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-52 w-full">
        {/* Vignette overlay — top fade only */}
        <div className="
          absolute inset-x-0 top-0 h-8 z-10 pointer-events-none
          bg-gradient-to-b from-white/20 dark:from-slate-900/20 to-transparent
        " />

        <MapContainer
          center={[lat, lng]}
          zoom={14}
          scrollWheelZoom={false}
          dragging={false}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]} icon={icon} />
          <FlyToCenter lat={lat} lng={lng} />
        </MapContainer>
      </div>

      {/* Footer */}
      <div className="
        flex items-center justify-between
        px-4 py-2.5
        bg-slate-50/80 dark:bg-slate-900/80
        border-t border-slate-100 dark:border-white/6
        backdrop-blur-sm
      ">
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
          <PinIcon />
          <span className="text-[11px] font-medium tracking-wide">
            OpenStreetMap
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* Subtle zoom level indicator */}
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 dark:bg-green-500" />
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            Zoom 14
          </span>
        </div>
      </div>
    </div>
  )
}