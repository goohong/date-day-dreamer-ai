
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, MapPin, Share2, Heart, Star, Sparkles } from "lucide-react";
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

  const plans = [
    {
      id: 1,
      title: "추천 코스 A",
      description: "균형 잡힌 다양한 활동으로 구성된 코스",
      rating: 4.8,
      duration: `${formData.startTime || '10:00'} - ${formData.endTime || '18:00'}`,
      totalTime: "8시간",
      activities: [
        { time: formData.startTime || "10:00", place: "블루보틀 커피 홍대점", activity: "모닝 커피", duration: "1시간", location: baseActivities[0] },
        { time: "11:30", place: "홍대 걷고싶은거리", activity: "산책 및 쇼핑", duration: "2시간", location: baseActivities[1] },
        { time: "13:30", place: "더현대 서울", activity: "점심 식사", duration: "1.5시간", location: baseActivities[2] },
        { time: "15:30", place: "한강공원 여의도", activity: "피크닉", duration: "2시간", location: baseActivities[3] },
        { time: "18:00", place: "63빌딩 전망대", activity: "석양 감상", duration: "1시간", location: baseActivities[4] }
      ]
    },
    {
      id: 2,
      title: "추천 코스 B",
      description: "활동적이고 재미있는 체험 중심의 코스",
      rating: 4.6,
      duration: `${formData.startTime || '10:00'} - ${formData.endTime || '18:00'}`,
      totalTime: "8시간",
      activities: [
        { time: formData.startTime || "10:00", place: "홍대 볼링장", activity: "볼링", duration: "1.5시간", location: baseActivities[5] },
        { time: "12:00", place: "교촌치킨 홍대점", activity: "점심 식사", duration: "1시간", location: baseActivities[6] },
        { time: "14:00", place: "홍대 방탈출 카페", activity: "방탈출 게임", duration: "1.5시간", location: baseActivities[7] },
        { time: "16:00", place: "홍대 노래방", activity: "노래방", duration: "1.5시간", location: { name: "홍대 노래방", type: "노래방", lat: 37.5518, lng: 126.9928 } },
        { time: "18:00", place: "홍대 포차거리", activity: "저녁 식사", duration: "2시간", location: { name: "홍대 포차거리", type: "식당", lat: 37.5521, lng: 126.9932 } }
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
        { time: formData.startTime || "10:00", place: "망원한강공원", activity: "아침 산책", duration: "1시간", location: baseActivities[8] },
        { time: "11:30", place: "테라로사 홍대점", activity: "브런치 & 커피", duration: "2시간", location: baseActivities[9] },
        { time: "14:00", place: "홍대 독립서점", activity: "책 구경", duration: "1시간", location: { name: "홍대 독립서점", type: "서점", lat: 37.5522, lng: 126.9935 } },
        { time: "15:30", place: "홍대 스파", activity: "마사지 & 휴식", duration: "2시간", location: { name: "홍대 스파", type: "스파", lat: 37.5516, lng: 126.9924 } },
        { time: "18:00", place: "홍대 루프탑 바", activity: "선셋 드링크", duration: "1.5시간", location: { name: "홍대 루프탑 바", type: "바", lat: 37.5525, lng: 126.9938 } }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-pink-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/create" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
            <span>다시 만들기</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              DatePlanner AI
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎉 AI가 추천하는 완벽한 일정
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {formData.people}명 • {formData.location} • {formData.planTypes?.join(', ') || '맞춤형 일정'}
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              {formData.startTime || '10:00'} - {formData.endTime || '18:00'}
            </Badge>
            {formData.detailedCategories?.length > 0 && (
              <Badge variant="outline" className="px-4 py-2">
                {formData.detailedCategories.join(', ')}
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
                className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedPlan === plan.id 
                    ? 'ring-2 ring-pink-500 bg-pink-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{plan.title}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{plan.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
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
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">{activity.place}</div>
                        <div className="text-xs text-gray-500">{activity.time} • {activity.activity}</div>
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
                    <Badge className="bg-pink-500 text-white">선택됨</Badge>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Plan Details with Map */}
        {selectedPlan && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                선택한 일정: {planOptions.find(p => p.id === selectedPlan)?.title}
              </h2>
              <Button onClick={handleShare} variant="outline" className="flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>공유하기</span>
              </Button>
            </div>

            {/* Map Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">코스 지도</h3>
              <GoogleMap locations={getSelectedPlanLocations()} />
            </div>

            <div className="space-y-6">
              {planOptions.find(p => p.id === selectedPlan)?.activities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{activity.place}</h3>
                      <Badge variant="outline">{activity.time}</Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{activity.activity}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{activity.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>위치 보기</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
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
            className="px-8"
          >
            <Link to="/create">새로운 일정 만들기</Link>
          </Button>
          {selectedPlan && (
            <Button 
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8"
              onClick={handleShare}
            >
              선택한 일정 공유하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanResult;
