
import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapProps {
  places: Array<{
    name: string;
    lat: number;
    lng: number;
  }>;
  className?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({ places, className }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'demo-key',
        version: 'weekly',
      });

      try {
        await loader.load();
        
        if (!mapRef.current) return;

        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 37.5665, lng: 126.9780 }, // Seoul center
          zoom: 12,
        });

        // Add markers for each place
        places.forEach((place, index) => {
          new window.google.maps.Marker({
            position: { lat: place.lat, lng: place.lng },
            map: map,
            title: place.name,
            label: (index + 1).toString(),
          });
        });

        // Fit map to show all markers
        if (places.length > 0) {
          const bounds = new window.google.maps.LatLngBounds();
          places.forEach(place => {
            bounds.extend({ lat: place.lat, lng: place.lng });
          });
          map.fitBounds(bounds);
        }
      } catch (error) {
        console.error('Google Maps loading error:', error);
        // Show fallback content
        if (mapRef.current) {
          mapRef.current.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">지도를 불러올 수 없습니다</div>';
        }
      }
    };

    initMap();
  }, [places]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-64 bg-gray-100 rounded-lg ${className}`}
    />
  );
};

export default GoogleMap;
