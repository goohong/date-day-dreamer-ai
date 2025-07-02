import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SelectedPlace {
  name: string;
  category: string;
  location: string;
  image: string;
  stayTime: { hours: number; minutes: number };
}

interface SelectedItineraryProps {
  selectedPlaces: SelectedPlace[];
  onRemovePlace: (placeName: string) => void;
  onUpdateStayTime?: (placeName: string, stayTime: { hours: number; minutes: number }) => void;
}

const SelectedItinerary: React.FC<SelectedItineraryProps> = ({ selectedPlaces, onRemovePlace, onUpdateStayTime }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempStayTime, setTempStayTime] = useState({ hours: 2, minutes: 0 });
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const timeBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '식당': return 'bg-orange-100 text-orange-700';
      case '카페': return 'bg-amber-100 text-amber-700';
      case '명소': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStayTimeEdit = (index: number) => {
    const place = selectedPlaces[index];
    if (place) {
      setTempStayTime(place.stayTime);
      setEditingIndex(index);
    }
  };

  const handleStayTimeComplete = () => {
    if (editingIndex !== null && onUpdateStayTime) {
      onUpdateStayTime(selectedPlaces[editingIndex].name, tempStayTime);
    }
    setEditingIndex(null);
    setPopoverPos(null);
  };

  // 팝오버 바깥 클릭 시 닫기
  React.useEffect(() => {
    if (editingIndex === null) return;
    const handleClick = (e: MouseEvent) => {
      if (popoverPos) {
        const popover = document.getElementById('staytime-popover');
        if (popover && !popover.contains(e.target as Node)) {
          setEditingIndex(null);
          setPopoverPos(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [editingIndex, popoverPos]);

  function formatStayTime(stayTime: { hours: number; minutes: number }) {
    // 0~23:00 형식으로 변환 (ex: 1시간 30분 -> 01:30)
    const h = String(stayTime.hours).padStart(2, '0');
    const m = String(stayTime.minutes).padStart(2, '0');
    return `${h}:${m}`;
  }

  function parseStayTime(time: string) {
    // 'HH:mm' -> { hours, minutes }
    const [h, m] = time.split(':');
    return { hours: Number(h), minutes: Number(m) };
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
      <h3 className="font-bold text-lg text-gray-800 mb-4">선택한 장소</h3>
      {selectedPlaces.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>아직 선택한 장소가 없습니다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {selectedPlaces.map((place, index) => {
            if (!place) return null;
            const isEditing = editingIndex === index;
            return (
              <div key={place.name} className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative flex flex-col items-center text-center">
                <img src={place.image} alt={place.name} className="w-14 h-14 rounded-lg object-cover mb-2" />
                <span className="font-bold text-gray-800 text-base mb-1">{place.name}</span>
                <span className={`text-xs font-medium mb-1 ${getCategoryColor(place.category)}`}>{place.category}</span>
                <span className="text-xs text-gray-500 mb-1">{place.location}</span>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {isEditing ? (
                    <>
                      <Input
                        type="number"
                        min={0}
                        value={tempStayTime.hours}
                        onChange={e => setTempStayTime(prev => ({ ...prev, hours: Number(e.target.value) }))}
                        className="w-16 h-8 text-sm px-2"
                        autoFocus
                      />
                      <span className="text-gray-500 text-xs">시간</span>
                      <Input
                        type="number"
                        min={0}
                        max={59}
                        value={tempStayTime.minutes}
                        onChange={e => setTempStayTime(prev => ({ ...prev, minutes: Number(e.target.value) }))}
                        className="w-16 h-8 text-sm px-2"
                      />
                      <span className="text-gray-500 text-xs">분</span>
                      <Button size="sm" className="ml-1 px-2 py-1 bg-blue-500 text-white text-xs" onClick={handleStayTimeComplete}>저장</Button>
                      <Button size="sm" variant="ghost" className="px-2 py-1 text-xs" onClick={() => setEditingIndex(null)}>취소</Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTempStayTime(place.stayTime);
                        setEditingIndex(index);
                      }}
                      className="px-2 py-1 text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 min-w-[70px]"
                    >
                      {place.stayTime.hours}시간 {place.stayTime.minutes}분
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemovePlace(place.name)}
                    className="w-7 h-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SelectedItinerary;
