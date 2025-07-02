
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

interface SelectedPlace {
  name: string;
  category: string;
  location: string;
  image: string;
  stayTime: { hours: number; minutes: number };
}

interface SelectedItineraryProps {
  selectedPlaces: string[];
  onRemovePlace: (placeName: string) => void;
}

const SelectedItinerary: React.FC<SelectedItineraryProps> = ({ selectedPlaces, onRemovePlace }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempStayTime, setTempStayTime] = useState({ hours: 2, minutes: 0 });

  const placesData: Record<string, SelectedPlace> = {
    '한끼맛있다': { name: '한끼맛있다', category: '식당', location: '홍대입구역 2번 출구', image: '/placeholder.svg', stayTime: { hours: 1, minutes: 30 } },
    '스타벅스 홍대점': { name: '스타벅스 홍대점', category: '카페', location: '홍대입구역 9번 출구', image: '/placeholder.svg', stayTime: { hours: 1, minutes: 0 } },
    '홍대 걷고싶은거리': { name: '홍대 걷고싶은거리', category: '명소', location: '홍익대학교 앞', image: '/placeholder.svg', stayTime: { hours: 2, minutes: 0 } },
    '더현대 서울': { name: '더현대 서울', category: '명소', location: '여의도역 3번 출구', image: '/placeholder.svg', stayTime: { hours: 3, minutes: 0 } },
    '롯데월드타워': { name: '롯데월드타워', category: '명소', location: '잠실역 1번 출구', image: '/placeholder.svg', stayTime: { hours: 2, minutes: 30 } },
    '블루보틀 커피': { name: '블루보틀 커피', category: '카페', location: '성수역 2번 출구', image: '/placeholder.svg', stayTime: { hours: 1, minutes: 0 } },
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '식당': return 'bg-orange-100 text-orange-700';
      case '카페': return 'bg-amber-100 text-amber-700';
      case '명소': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStayTimeEdit = (index: number) => {
    const place = placesData[selectedPlaces[index]];
    if (place) {
      setTempStayTime(place.stayTime);
      setEditingIndex(index);
    }
  };

  const handleStayTimeComplete = () => {
    setEditingIndex(null);
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
      <h3 className="font-bold text-lg text-gray-800 mb-4">선택한 장소</h3>
      
      {selectedPlaces.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>아직 선택한 장소가 없습니다</p>
        </div>
      ) : (
        <div className="space-y-4">
          {selectedPlaces.map((placeName, index) => {
            const place = placesData[placeName];
            if (!place) return null;

            return (
              <div key={placeName} className="flex items-center bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold mr-4">
                  {index + 1}
                </div>
                
                <img src={place.image} alt={place.name} className="w-12 h-12 rounded-lg object-cover mr-4" />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-800">{place.name}</h4>
                    <Badge className={`text-xs px-2 py-1 ${getCategoryColor(place.category)}`}>
                      {place.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{place.location}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStayTimeEdit(index)}
                  className="mr-2 px-3 py-1 text-sm bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  {place.stayTime.hours}시간 {place.stayTime.minutes}분
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemovePlace(placeName)}
                  className="w-8 h-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Time Editor */}
      {editingIndex !== null && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
          <h4 className="font-bold text-blue-800 mb-3">머무는 시간 설정</h4>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-700">시간:</span>
              <select 
                value={tempStayTime.hours}
                onChange={(e) => setTempStayTime(prev => ({ ...prev, hours: parseInt(e.target.value) }))}
                className="px-3 py-2 rounded-lg border-2 border-blue-200 bg-white text-sm font-bold"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>{i}시간</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-700">분:</span>
              <select 
                value={tempStayTime.minutes}
                onChange={(e) => setTempStayTime(prev => ({ ...prev, minutes: parseInt(e.target.value) }))}
                className="px-3 py-2 rounded-lg border-2 border-blue-200 bg-white text-sm font-bold"
              >
                {[0, 15, 30, 45].map(minute => (
                  <option key={minute} value={minute}>{minute}분</option>
                ))}
              </select>
            </div>
          </div>
          <Button 
            onClick={handleStayTimeComplete}
            className="w-full bg-blue-500 text-white hover:bg-blue-600 font-bold py-2 rounded-lg"
          >
            완료
          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectedItinerary;
