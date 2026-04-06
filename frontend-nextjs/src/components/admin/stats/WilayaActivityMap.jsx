'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations, useLocale } from 'next-intl';
import 'leaflet/dist/leaflet.css';

// Dynamic import for MapContainer and other Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import('react-leaflet').then((mod) => mod.GeoJSON),
  { ssr: false }
);

export const WilayaActivityMap = ({ data }) => {
  const t = useTranslations('admin.statistics');
  const locale = useLocale();
  const [geoData, setGeoData] = useState(null);
  const isRTL = locale === 'ar';

  useEffect(() => {
    // Load GeoJSON data safely on client
    import('@/data/maps/algeria_wilayas.json').then((mod) => {
      setGeoData(mod.default);
    });
  }, []);

  const onEachFeature = (feature, layer) => {
    const wilayaId = feature.properties.id;
    const stats = data.find((d) => d.id === wilayaId) || {
      requests_count: 0,
      artisans_count: 0,
      top_category: 'N/A'
    };

    const tooltipContent = `
      <div class="p-2 space-y-1 font-sans ${isRTL ? 'text-right' : 'text-left'}" dir="${isRTL ? 'rtl' : 'ltr'}">
        <strong class="text-primary-600 dark:text-primary-400 text-lg">${feature.properties.nom}</strong>
        <div class="flex items-center gap-2 text-sm">
          <span class="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>${t('map_requests', { count: stats.requests_count })}</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <span class="w-2 h-2 rounded-full bg-green-500"></span>
          <span>${t('map_artisans', { count: stats.artisans_count })}</span>
        </div>
        <div class="pt-1 mt-1 border-t border-gray-200 dark:border-gray-700 text-xs italic opacity-80">
          ${t('map_top_category', { name: stats.top_category })}
        </div>
      </div>
    `;

    layer.bindTooltip(tooltipContent, {
      sticky: true,
      className: 'custom-tooltip shadow-xl border-none rounded-lg dark:bg-slate-900 dark:text-white'
    });

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 3,
          color: '#ffffff',
          fillOpacity: 0.9,
        });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 1,
          color: '#ffffff',
          fillOpacity: 0.7,
        });
      }
    });
  };

  const geojsonStyle = (feature) => {
    const wilayaId = feature.properties.id;
    const stats = data.find((d) => d.id === wilayaId);
    const level = stats?.activity_level || 0;

    const colors = [
      '#e2e8f0', // None
      '#93c5fd', // Low
      '#3b82f6', // Med
      '#1d4ed8', // High
      '#1e3a8a'  // V High
    ];

    return {
      fillColor: colors[level],
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  if (!geoData) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse">
        <span className="text-gray-400">Chargement de la carte...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg relative z-0">
      <MapContainer
        center={[28.0339, 1.6596]}
        zoom={5}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <GeoJSON
          data={geoData}
          style={geojsonStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
};

export default WilayaActivityMap;
