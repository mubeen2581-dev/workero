import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons (Leaflet issue with webpack)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LeafletMapProps {
  center: [number, number]; // [lat, lng]
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    title?: string;
    popup?: string;
  }>;
  polyline?: Array<[number, number]>; // Route polyline
  className?: string;
  style?: React.CSSProperties;
  onMapReady?: (map: L.Map) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom = 10,
  markers = [],
  polyline,
  className = '',
  style = { height: '500px', width: '100%' },
  onMapReady,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    onMapReady?.(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center and zoom
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach((marker) => {
      const leafletMarker = L.marker(marker.position).addTo(mapInstanceRef.current!);
      if (marker.title) {
        leafletMarker.bindTooltip(marker.title);
      }
      if (marker.popup) {
        leafletMarker.bindPopup(marker.popup);
      }
      markersRef.current.push(leafletMarker);
    });
  }, [markers]);

  // Update polyline
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing polyline
    if (polylineRef.current) {
      mapInstanceRef.current.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    // Add new polyline
    if (polyline && polyline.length > 0) {
      const polylineLayer = L.polyline(polyline, {
        color: '#3B82F6',
        weight: 4,
        opacity: 0.8,
      }).addTo(mapInstanceRef.current);
      polylineRef.current = polylineLayer;
      mapInstanceRef.current.fitBounds(polylineLayer.getBounds());
    }
  }, [polyline]);

  return <div ref={mapRef} className={className} style={style} />;
};

export default LeafletMap;

