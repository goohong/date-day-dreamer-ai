import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface GoogleMapProps {
  places: Array<{
    name: string;
    lat: number;
    lng: number;
  }>;
  className?: string;
}

// 지도 bounds를 마커에 맞게 fitBounds
const FitBounds: React.FC<{ places: GoogleMapProps['places'] }> = ({ places }) => {
  const map = useMap();
  useEffect(() => {
    if (places.length === 0) return;
    const bounds = L.latLngBounds(places.map(p => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [places, map]);
  return null;
};

const GoogleMap: React.FC<GoogleMapProps> = ({ places, className }) => {
  // Polyline 좌표
  const polylinePositions = places.map(p => [p.lat, p.lng]) as [number, number][];

  // 숫자 라벨 마커 옵션
  const createNumberIcon = (num: number) => L.divIcon({
    html: `<div style="background: #fff; border: 2px solid #f472b6; color: #e11d48; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 15px; box-shadow: 0 2px 6px #0001;">${num}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  // 기본 중심: 서울
  const center = places.length > 0
    ? [places[0].lat, places[0].lng]
    : [37.5665, 126.9780];

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '256px', width: '100%', borderRadius: '0.5rem' }}
      className={className}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <FitBounds places={places} />
      {/* 순서대로 선 연결 */}
      {places.length > 1 && (
        <Polyline positions={polylinePositions} color="#f472b6" weight={4} opacity={0.7} dashArray="6 8" />
      )}
      {/* 숫자 라벨 마커 */}
      {places.map((place, idx) => (
        <Marker key={idx} position={[place.lat, place.lng]} icon={createNumberIcon(idx + 1)}>
          <Popup>{place.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default GoogleMap;
