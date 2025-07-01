
import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface GoogleMapProps {
  locations: Location[];
  center?: { lat: number; lng: number };
}

const GoogleMap = ({ locations, center }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const initMap = async () => {
      // For demo purposes, we'll create a mock map since we don't have an API key
      // In production, you would use the Google Maps API key
      const mockCenter = center || { lat: 37.5519, lng: 126.9918 }; // 홍대 좌표
      
      if (!mapRef.current) return;

      // Create a simple mock map visualization
      mapRef.current.innerHTML = `
        <div class="w-full h-full bg-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300"></div>
          <div class="relative z-10 text-center">
            <div class="mb-4">
              <svg class="w-16 h-16 mx-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
            </div>
            <p class="text-blue-800 font-medium">코스 지도</p>
            <p class="text-blue-600 text-sm mt-1">${locations.length}개 장소</p>
          </div>
          ${locations.map((location, index) => `
            <div class="absolute bg-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-pink-600 border-2 border-pink-500" 
                 style="top: ${20 + index * 15}%; left: ${30 + index * 10}%;">
              ${index + 1}
            </div>
          `).join('')}
        </div>
      `;
    };

    initMap();
  }, [locations, center]);

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden shadow-md">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default GoogleMap;
