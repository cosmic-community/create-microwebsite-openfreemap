'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { Device, MapLocation, SiteSettings } from '@/types';
import { getMetafieldValue } from '@/lib/cosmic';

interface MapViewProps {
  devices: Device[];
  locations: MapLocation[];
  settings: SiteSettings | null;
}

export default function MapView({ devices, locations, settings }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const defaultLat = settings?.metadata?.default_latitude ?? 20;
    const defaultLng = settings?.metadata?.default_longitude ?? 0;
    const defaultZoom = settings?.metadata?.default_zoom ?? 2;
    const styleUrl =
      getMetafieldValue(settings?.metadata?.map_style_url) ||
      'https://tiles.openfreemap.org/styles/liberty';

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [defaultLng, defaultLat],
      zoom: defaultZoom,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    mapRef.current = map;

    map.on('load', () => {
      devices.forEach((device) => {
        const lat = device.metadata?.latitude;
        const lng = device.metadata?.longitude;
        if (lat === undefined || lng === undefined) return;

        const status = getMetafieldValue(device.metadata?.status).toLowerCase();
        const color = status === 'online' ? '#22c55e' : '#64748b';

        const el = document.createElement('div');
        el.style.cssText = `
          width: 24px;
          height: 24px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 0 2px ${color}55, 0 4px 12px rgba(0,0,0,0.3);
          cursor: pointer;
        `;

        const popupHtml = `
          <div style="min-width: 180px;">
            <div style="font-weight:600;margin-bottom:4px;">${device.title}</div>
            <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
              ${getMetafieldValue(device.metadata?.device_type)}
            </div>
            <a href="/devices/${device.slug}" style="color:#3b82f6;font-size:12px;text-decoration:none;">
              Open device →
            </a>
          </div>
        `;

        new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(new maplibregl.Popup({ offset: 16 }).setHTML(popupHtml))
          .addTo(map);
      });

      locations.forEach((loc) => {
        const lat = loc.metadata?.latitude;
        const lng = loc.metadata?.longitude;
        if (lat === undefined || lng === undefined) return;

        const el = document.createElement('div');
        el.style.cssText = `
          width: 20px;
          height: 20px;
          background: #a855f7;
          border: 2px solid white;
          border-radius: 3px;
          transform: rotate(45deg);
          box-shadow: 0 0 0 2px #a855f755, 0 4px 12px rgba(0,0,0,0.3);
          cursor: pointer;
        `;

        const popupHtml = `
          <div style="min-width: 180px;">
            <div style="font-weight:600;margin-bottom:4px;">${loc.title}</div>
            <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;">
              ${getMetafieldValue(loc.metadata?.category)}
            </div>
            <a href="/locations/${loc.slug}" style="color:#3b82f6;font-size:12px;text-decoration:none;">
              View location →
            </a>
          </div>
        `;

        new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(new maplibregl.Popup({ offset: 16 }).setHTML(popupHtml))
          .addTo(map);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [devices, locations, settings]);

  return (
    <div className="absolute inset-0">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md rounded-lg p-3 border border-slate-700 shadow-xl">
        <div className="text-xs text-slate-400 mb-2 font-semibold uppercase">Legend</div>
        <div className="flex items-center gap-2 text-xs text-white mb-1">
          <span className="w-3 h-3 rounded-full bg-green-500 border border-white"></span>
          Online Device
        </div>
        <div className="flex items-center gap-2 text-xs text-white mb-1">
          <span className="w-3 h-3 rounded-full bg-slate-500 border border-white"></span>
          Offline Device
        </div>
        <div className="flex items-center gap-2 text-xs text-white">
          <span className="w-3 h-3 bg-purple-500 border border-white" style={{ transform: 'rotate(45deg)' }}></span>
          Location
        </div>
      </div>
    </div>
  );
}