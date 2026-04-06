"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons in Leaflet with Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Draggable Marker Component
function DraggableMarker({ position, onPositionChange }) {
  const markerRef = useRef(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          const { lat, lng } = marker.getLatLng()
          onPositionChange(lat, lng)
        }
      },
    }),
    [onPositionChange],
  )

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      icon={customIcon}
      ref={markerRef}
    />
  )
}

// Map Click Handler Component
function MapClickHandler({ onPositionChange }) {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// Map Updater Component to center map when position changes (auto-geo)
function MapCenterer({ position }) {
  const map = useMap()
  useEffect(() => {
    map.setView(position, map.getZoom())
  }, [position, map])
  return null
}

export default function WizardMap({ lat, lng, onPositionChange }) {
  const position = [lat, lng]

  // Attempt to auto-locate on mount if requested
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onPositionChange(pos.coords.latitude, pos.coords.longitude)
        },
        (err) => {
          console.warn("Geolocation access denied or failed", err)
        }
      )
    }
  }, [])

  return (
    <div className="relative w-full h-full z-0">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        className="rounded-[28px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker position={position} onPositionChange={onPositionChange} />
        <MapClickHandler onPositionChange={onPositionChange} />
        <MapCenterer position={position} />
      </MapContainer>
      
      {/* Search Overlay Hint (Mobile optimized) */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-tight text-blue-600">
         Cliquez ou déplacez le marqueur
      </div>
    </div>
  )
}
