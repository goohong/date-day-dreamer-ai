
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Clock, MapPin, Share2, Heart, Star, Sparkles, ArrowUp, ArrowDown, Edit } from "lucide-react";
import { toast } from "sonner";
import GoogleMap from "@/components/GoogleMap";

// Mock data generator for multiple plan options
const generatePlanOptions = (formData: any) => {
  const baseActivities = [
    { name: "블루보틀 커피", type: "카페", lat: 37.5519, lng: 126.9918 },
    { name: "홍대 걷고싶은거리", type: "쇼핑", lat: 37.5513, lng: 126.9922 },
    { name: "더현대 서울", type: "쇼핑몰", lat: 37.5258, lng: 127.0286 },
    { name: "한강공원 여의도", type: "공원", lat: 37.5285, lng: 126.9244 },
    { name: "63빌딩 전망대", type: "전망대", lat: 37.5197, lng: 126.9394 },
    { name: "홍대 볼링장", type: "볼링", lat: 37.5512, lng: 126.9915 },
    { name: "교촌치킨", type: "식당", lat: 37.5515, lng: 126.9920 },
    { name: "방탈출 카페", type: "게임", lat: 37.5517, lng: 126.9925 },
    { name: "망원한강공원", type: "공원", lat: 37.5502, lng: 126.8944 },
    { name: "테라로사 커피", type: "카페", lat: 37.5520, lng: 126.9930 }
  ];

  const getTransportTime = (transportation: string) => {
    return transportation === 'public' ? [15, 20, 25, 12, 18] : [8, 12, 15, 7, 10];
  };

  const transportTimes = getTransportTime(formData.transportation);

  const plans = [
    {
      id: 1,
      title: "추천 코스 A",
      description: "균형 잡힌 다양한 활동으로 구성된 코스",
      rating: 4.8,
      duration: `${formData.startTime || '10:00'} - ${formData.endTime || '18:00'}`,
      totalTime: "8시간",
      activities: [
        { time: formData.startTime || "10:00", place: "블루보틀 커피 홍대점", activity: "모닝 커피", duration: "1시간", location: baseActivities[0], travelTime: 0 },
        { time: "11:30", place: "홍대 걷고싶은거리", activity: "산책 및 쇼핑", duration: "2시간", location: baseActivities[1], travelTime: transportTimes[0] },
        { time: "13:30", place: "더현대 서울", activity: "점심 식사", duration: "1.5시간", location: baseActivities[2], travelTime: transportTimes[1] },
        { time: "15:30", place: "한강공원 여의도", activity: "피크닉", duration: "2시간", location: baseActivities[3], travelTime: transportTimes[2] },
        { time: "18:00", place: "63빌딩 전망대", activity: "석양 감상", duration: "1시간", location: baseActivities[4], travelTime: transportTimes[3] }
      ]
    },
    {
      id: 2,
      title: "추천 코스 B", 
      description: "특색 있는 장소들로 구성된 알찬 코스",
      rating: 4.6,
      duration: `${formData.startTime || '10:00'} - ${formData.endTime || '18:00'}`,
      totalTime: "8시간",
      activities: [
        { time: formData.startTime || "10:00", place: "홍대 볼링장", activity: "볼링", duration: "1.5시간", location: baseActivities[5], travelTime: 0 },
        { time: "12:00", place: "교촌치킨 홍대점", activity: "점심 식사", duration: "1시간", location: baseActivities[6], travelTime: transportTimes[0] },
        { time: "14:00", place: "홍대 방탈출 카페", activity: "방탈출 게임", duration: "1.5시간", location: baseActivities[7], travelTime: transportTimes[1] },
        { time: "16:00", place: "홍대 노래방", activity: "노래방", duration: "1.5시간", location: { name: "홍대 노래방", type: "노래방", lat: 37.5518, lng: 126.9928 }, travelTime: transportTimes[2] },
        { time: "18:00", place: "홍대 포차거리", activity: "저녁 식사", duration: "2시간", location: { name: "홍대 포차거리", type: "식당", lat: 37.5521, lng: 126.9932 }, travelTime: transportTimes[3] }
      ]
    },
    {
      id: 3,
      title: "추천 코스 C",
      description: "여유롭고 편안한 휴식 중심의 코스",
      rating: 4.7,
      duration: `${formData.startTime || '10:00'} - ${formData.endTime || '18:00'}`,
      totalTime: "8시간", 
      activities: [
        { time: formData.startTime || "10:00", place: "망원한강공원", activity: "아침 산책", duration: "1시간", location: baseActivities[8], travelTime: 0 },
        { time: "11:30", place: "테라로사 홍대점", activity: "브런치 & 커피", duration: "2시간", location: baseActivities[9], travelTime: transportTimes[0] },
        { time: "14:00", place: "홍대 독립서점", activity: "책 구경", duration: "1시간", location: { name: "홍대 독립서점", type: "서점", lat: 37.5522, lng: 126.9935 }, travelTime: transportTimes[1] },
        { time: "15:30", place: "홍대 스파", activity: "마사지 & 휴식", duration: "2시간", location: { name: "홍대 스파", type: "스파", lat: 37.5516, lng: 126.9924 }, travelTime: transportTimes[2] },
        { time: "18:00", place: "홍대 루프탑 바", activity: "선셋 드링크", duration: "1.5시간", location: { name: "홍대 루프탑 바", type: "바", lat: 37.5525, lng: 126.9938 }, travelTime: transportTimes[3] }
      ]
    }
  ];

  return plans;
};

const PlanResult = () => {
  const location = useLocation();
  const formData = location.state?.formData || {};
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [planOptions] = useState(() => generatePlanOptions(formData));
  const [editingTime, setEditingTime] = useState<{planId: number, activityIndex: number} | null>(null);
  const [editingTravel, setEditingTravel] = useState<{planId: number, activityIndex: number} | null>(null);

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? '오후' : '오전';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${period} ${displayHour}:${minute || '00'}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("링크가 복사되었습니다!");
  };

  const handleSelectPlan = (planId: number) => {
    setSelectedPlan(planId);
    toast.success("일정이 선택되었습니다!");
  };

  const getSelectedPlanLocations = () => {
    const selected = planOptions.find(p => p.id === selectedPlan);
    if (!selected) return [];
    
    return selected.activities.map(activity => ({
      name: activity.place,
      lat: activity.location.lat,
      lng: activity.location.lng
    }));
  };

  const updateTravelTime = (planId: number, activityIndex: number, newTime: number) => {
    // 실제로는 상태 업데이트 로직이 들어가야 하지만, 데모를 위해 단순화
    toast.success(`이동 시간이 ${newTime}분으로 변경되었습니다`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-rose-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/create" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">다시 만들기</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              DatePlanner AI
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            ✨ 맞춤형 여행 일정이 완성되었어요
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {formData.people}명 • {formData.location} • {formData.transportation === 'public' ? '대중교통' : '자동차'} 이용
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="px-4 py-2 bg-rose-100 text-rose-700 rounded-full">
              <Clock className="w-4 h-4 mr-2" />
              {formData.startTime || '10:00'} - {formData.endTime || '18:00'}
            </Badge>
            {formData.selectedPlaces?.length > 0 && (
              <Badge variant="outline" className="px-4 py-2 border-pink-200 text-pink-700 rounded-full">
                선택 장소 {formData.selectedPlaces.length}개
              </Badge>
            )}
          </div>
        </div>

        {/* Plan Options */}
        <div className="grid gap-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            3가지 추천 코스 중 선택해보세요
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {planOptions.map((plan) => (
              <Card 
                key={plan.id} 
                className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-xl rounded-2xl border-2 ${
                  selectedPlan === plan.id 
                    ? 'ring-2 ring-pink-400 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-300 shadow-lg' 
                    : 'hover:shadow-md border-gray-200 bg-white'
                }`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{plan.title}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-sm font-medium">{plan.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">{plan.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{plan.duration}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    총 {plan.activities.length}개 장소
                  </div>
                </div>

                <div className="space-y-3">
                  {plan.activities.slice(0, 3).map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800">{activity.place}</div>
                        <div className="text-xs text-gray-500">{formatTime(activity.time)} • {activity.activity}</div>
                      </div>
                    </div>
                  ))}
                  {plan.activities.length > 3 && (
                    <div className="text-xs text-gray-400 text-center">
                      +{plan.activities.length - 3}개 더 보기
                    </div>
                  )}
                </div>

                {selectedPlan === plan.id && (
                  <div className="mt-4 pt-4 border-t border-pink-200">
                    <Badge className="bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full">✓ 선택됨</Badge>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Plan Details with Map */}
        {selectedPlan && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                {planOptions.find(p => p.id === selectedPlan)?.title}
              </h2>
              <Button onClick={handleShare} variant="outline" className="flex items-center space-x-2 rounded-full hover:bg-pink-50 border-pink-200">
                <Share2 className="w-4 h-4" />
                <span>공유하기</span>
              </Button>
            </div>

            {/* Map Section */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-pink-500" />
                코스 지도
              </h3>
              <GoogleMap locations={getSelectedPlanLocations()} />
            </div>

            {/* Schedule Timeline */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-pink-500" />
                세부 일정
              </h3>
              
              {planOptions.find(p => p.id === selectedPlan)?.activities.map((activity, index) => (
                <div key={index} className="relative">
                  {/* Main Activity Card */}
                  <div className="flex items-start space-x-6 p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-pink-50 border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-800">{activity.place}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-pink-100 text-pink-700 rounded-full px-3 py-1 font-medium">
                            {formatTime(activity.time)}
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-pink-500">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3 text-lg">{activity.activity}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{activity.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>위치 보기</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="text-pink-400 hover:text-pink-600 hover:bg-pink-50">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Travel Time Card */}
                  {index < planOptions.find(p => p.id === selectedPlan)!.activities.length - 1 && (
                    <div className="flex justify-center my-4">
                      <div className="bg-white border-2 border-pink-200 rounded-full px-6 py-3 flex items-center space-x-3 shadow-sm">
                        <span className="text-gray-600 font-medium">이동 시간</span>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-6 h-6 p-0 text-pink-500 hover:bg-pink-50"
                            onClick={() => updateTravelTime(selectedPlan, index, activity.travelTime - 5)}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                          <span className="font-bold text-pink-600 min-w-[3rem] text-center">
                            {activity.travelTime}분
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-6 h-6 p-0 text-pink-500 hover:bg-pink-50"
                            onClick={() => updateTravelTime(selectedPlan, index, activity.travelTime + 5)}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formData.transportation === 'public' ? '🚌 대중교통' : '🚗 자동차'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="px-8 rounded-full border-pink-200 hover:bg-pink-50"
          >
            <Link to="/create">새로운 일정 만들기</Link>
          </Button>
          {selectedPlan && (
            <Button 
              size="lg"
              className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleShare}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              선택한 일정 공유하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanResult;
