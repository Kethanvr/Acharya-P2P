'use client';

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { Site } from "@/types";

interface MapProps {
  sites: Site[];
  onSiteClick?: (id: string) => void;
}

const defaultCenter: [number, number] = [12.9716, 77.5946];

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
});

export default function Map({ sites, onSiteClick }: MapProps) {
  useEffect(() => {
    // Fix Leaflet default icon path for Next.js
    (L.Marker.prototype.options.icon as L.Icon) = markerIcon;
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <MapContainer
        center={defaultCenter}
        zoom={7}
        style={{ height: "360px", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sites.map((site) => (
          <Marker
            key={site.id}
            position={[site.lat, site.lon]}
            eventHandlers={{
              click: () => onSiteClick?.(site.id),
            }}
          >
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold text-slate-900">{site.name}</div>
                <div className="text-xs uppercase text-slate-500">{site.district}</div>
                <div className="text-xs text-slate-600">{site.capacity_kw} kW</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

