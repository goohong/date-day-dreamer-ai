
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Heart, Star, Trash2 } from "lucide-react";

interface Place {
  id: string;
  name: string;
  category: string;
  location: string;
  image: string;
  badge?: string;
  likes?: number;
  rating?: number;
}

interface PlaceSearchProps {
  selectedPlaces: string[];
  onPlaceToggle: (placeName: string) => void;
}

const PlaceSearch: React.FC<PlaceSearchProps> = ({ selectedPlaces, onPlaceToggle }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("추천 장소");

  const allPlaces: Place[] = [
    { id: '1', name: '한끼맛있다', category: '식당', location: '홍대입구역 2번 출구', image: '/placeholder.svg', badge: '이벤트', likes: 128, rating: 4.5 },
    { id: '2', name: '스타벅스 홍대점', category: '카페', location: '홍대입구역 9번 출구', image: '/placeholder.svg', likes: 89, rating: 4.2 },
    { id: '3', name: '홍대 걷고싶은거리', category: '명소', location: '홍익대학교 앞', image: '/placeholder.svg', likes: 234, rating: 4.7 },
    { id: '4', name: '더현대 서울', category: '명소', location: '여의도역 3번 출구', image: '/placeholder.svg', likes: 156, rating: 4.6 },
    { id: '5', name: '롯데월드타워', category: '명소', location: '잠실역 1번 출구', image: '/placeholder.svg', badge: '인기', likes: 445, rating: 4.8 },
    { id: '6', name: '블루보틀 커피', category: '카페', location: '성수역 2번 출구', image: '/placeholder.svg', likes: 67, rating: 4.3 },
  ];

  const categories = ['추천 장소', '명소', '식당', '카페'];

  const filteredPlaces = allPlaces.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '추천 장소' || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="select" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1">
          <TabsTrigger value="select" className="rounded-lg font-bold text-gray-700 data-[state=active]:bg-white data-[state=active]:text-blue-600">장소 선택</TabsTrigger>
          <TabsTrigger value="register" className="rounded-lg font-bold text-gray-700 data-[state=active]:bg-white data-[state=active]:text-blue-600">신규 장소 등록</TabsTrigger>
        </TabsList>

        <TabsContent value="select" className="space-y-4 mt-6">
          {/* Search Input */}
          <div className="relative">
            <Input
              placeholder="상호명 또는 주소를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-12 h-12 text-base border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-0"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  selectedCategory === category 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Results */}
          {filteredPlaces.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>검색 결과 총 0건</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPlaces.map(place => (
                <div key={place.id} className="flex items-center bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-colors">
                  <div className="relative">
                    <img src={place.image} alt={place.name} className="w-16 h-16 rounded-lg object-cover" />
                    {place.badge && (
                      <Badge variant="destructive" className="absolute -top-2 -left-2 text-xs px-2 py-1 bg-red-500 text-white">
                        {place.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 ml-4">
                    <h3 className="font-bold text-lg text-gray-800">{place.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{place.location}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-gray-600">{place.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-600">{place.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant={selectedPlaces.includes(place.name) ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPlaceToggle(place.name)}
                    className={`w-10 h-10 rounded-full ${
                      selectedPlaces.includes(place.name)
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'border-2 border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="register" className="mt-6">
          <div className="text-center py-8 text-gray-500">
            <p>신규 장소 등록 기능은 준비 중입니다.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlaceSearch;
