"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap,
  CircleMarker
} from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Star, MessageCircle, Phone, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

// Fix for Leaflet marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

function MapBoundsSetter({ artisans, userCoords }) {
  const map = useMap()
  
  React.useEffect(() => {
    const valid = artisans?.filter(a => a.latitude != null && a.longitude != null)
    if (!valid || valid.length === 0) return

    const bounds = L.latLngBounds(
      valid.map(a => [a.latitude, a.longitude])
    )

    if (userCoords) {
      bounds.extend([userCoords.lat, userCoords.lng])
    }

    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
  }, [artisans, userCoords, map])

  return null
}

export function ArtisanMap({ artisans, userCoords }) {
  const t = useTranslations("search")
  const locale = useLocale()
  
  // Algerian center fallback (Algiers)
  const defaultCenter = [36.7538, 3.0588]

  return (
    <div className="w-full h-full rounded-[40px] overflow-hidden border-4 border-white dark:border-white/5 shadow-2xl relative z-0">
      <MapContainer 
        center={userCoords ? [userCoords.lat, userCoords.lng] : defaultCenter} 
        zoom={11} 
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Pulsing Dot */}
        {userCoords && (
          <CircleMarker 
            center={[userCoords.lat, userCoords.lng]} 
            radius={8}
            pathOptions={{ fillColor: '#3b82f6', color: 'white', weight: 3, fillOpacity: 1 }}
          >
            <Popup className="custom-popup">
               <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Vous êtes ici</span>
            </Popup>
          </CircleMarker>
        )}

        {/* Artisan Markers */}
        {artisans
          .filter((artisan) => artisan.latitude != null && artisan.longitude != null)
          .map((artisan) => (
          <Marker 
            key={artisan.id} 
            position={[artisan.latitude, artisan.longitude]}
          >
            <Popup className="custom-popup" minWidth={260}>
               <div className="p-1 space-y-3">
                  <div className="flex items-center gap-3">
                     <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-slate-100 bg-slate-50 shrink-0">
                        <Image src={artisan.photo || "/images/placeholders/artisan.png"} alt="" fill unoptimized className="object-cover" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase leading-tight mb-0.5">{artisan.user.nomComplet}</h4>
                        <Badge className="bg-blue-600 text-white text-[8px] font-black px-2 py-0 uppercase tracking-widest">
                           {artisan.primary_categorie?.nom}
                        </Badge>
                     </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold border-y border-slate-50 py-2">
                     <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{artisan.average_rating}</span>
                     </div>
                     <div className="text-slate-400">
                         {artisan.primary_wilaya?.nom}
                     </div>
                  </div>

                  <div className="flex gap-2">
                     <Link href={`/${locale}/artisans/${artisan.slug}`} className="flex-1">
                        <Button className="w-full h-8 rounded-lg bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest gap-1">
                           Profil <ArrowUpRight className="w-3 h-3" />
                        </Button>
                     </Link>
                     <div className="flex gap-1 shrink-0">
                        <Button size="icon" className="w-8 h-8 rounded-lg bg-emerald-500 text-white shadow-lg">
                           <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button size="icon" className="w-8 h-8 rounded-lg bg-blue-600 text-white shadow-lg">
                           <Phone className="w-4 h-4" />
                        </Button>
                     </div>
                  </div>
               </div>
            </Popup>
          </Marker>
        ))}

        <MapBoundsSetter artisans={artisans} userCoords={userCoords} />
      </MapContainer>

      {/* Map Overlay info */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-1000 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-2 rounded-full border border-white dark:border-white/10 shadow-2xl flex items-center gap-2 pointer-events-none">
         <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Live Search Map</span>
      </div>
    </div>
  )
}
