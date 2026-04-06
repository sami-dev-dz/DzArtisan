"use client"

import * as React from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix Leaflet default icon in Next.js
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

export function MiniMap({ lat, lng }) {
  return (
    <div className="h-48 rounded-[24px] overflow-hidden border border-slate-100 dark:border-white/5">
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
  )
}
