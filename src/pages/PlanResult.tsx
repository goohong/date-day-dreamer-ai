
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, MapPin, Share2, Edit3, Heart, Star, Users, Calendar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface PlanItem {
  time: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  type: 'restaurant' | 'cafe' | 'activity' | 'culture' | 'shopping';
  rating?: number;
}

const PlanResult = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [formData] = useState(location.state?.formData || {});
  const [isGenerating, setIsGenerating] = useState(true);
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);

  // Mock AI plan generation
  useEffect(() => {
    const generatePlan = () => {
      setIsGenerating(true);
      
      setTimeout(() => {
        // Mock plan based on form data
        const mockPlan: PlanItem[] = [
          {
            time: "11:00",
            title: "브런치 카페",
            description: "홍대 감성이 가득한 브런치 카페에서 여유로운 시작",
            location: "서울시 마포구 홍익로",
            duration: "90분",
            type: "cafe",
            rating: 4.5
          },
          {
            time: "12:30",
            title: "홍대 거리 산책",
            description: "홍대의 독특한 벽화와 거리 예술을 감상하며 산책",
            location: "홍익대학교 주변",
            duration: "60분",
            type: "activity",
            rating: 4.2
          },
          {
            time: "14:00",
            title: "팝업스토어 구경",
            description: "최신 트렌드 팝업스토어에서 쇼핑과 구경",
            location: "홍대 AK플라자",
            duration: "90분",
            type: "shopping",
            rating: 4.3
          },
          {
            time: "16:00",
            title: "루프탑 카페",
            description: "분위기 좋은 루프탑에서 음료와 디저트 타임",
            location: "서울시 마포구 양화로",
            duration: "120분",
            type: "cafe",
            rating: 4.7
          },
          {
            time: "18:30",
            title: "홍대 맛집 저녁",
            description: "SNS에서 유명한 홍대 대표 맛집에서 저녁 식사",
            location: "서울시 마포구 어울마당로",
            duration: "90분",
            type: "restaurant",
            rating: 4.6
          },
        ];

        setPlanItems(mockPlan);
        setIsGenerating(false);
      }, 2000);
    };

    generatePlan();
  }, []);

  const getTypeColor = (type: string) => {
    const colors = {
      restaurant: "bg-red-100 text-red-700",
      cafe: "bg-amber-100 text-amber-700",
      activity: "bg-blue-100 text-blue-700",
      culture: "bg-purple-100 text-purple-700",
      shopping: "bg-green-100 text-green-700"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'restaurant': return '🍽️';
      case 'cafe': return '☕';
      case 'activity': return '🎯';
      case 'culture': return '🎭';
      case 'shopping': return '🛍️';
      default: return '📍';
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/shared/abc123`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "공유 링크가 복사되었습니다!",
      description: "친구들과 함께 일정을 확인해보세요.",
    });
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md mx-auto shadow-lg">
          <div className="animate-spin w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">AI가 완벽한 일정을 생성 중이에요</h3>
          <p className="text-gray-600">잠시만 기다려주세요...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-pink-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/create" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
            <span>다시 만들기</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>공유하기</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Plan Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-full mb-4">
            <Heart className="w-4 h-4" />
            <span className="font-medium">완벽한 데이트 코스가 완성되었어요!</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {formData.location === 'hongdae' ? '홍대' : formData.location} 데이트 일정
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{formData.people === '2' ? '2명 (커플)' : `${formData.people}명`}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formData.duration === 'half-day' ? '반나절' : formData.duration === 'full-day' ? '하루 종일' : '저녁 시간'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>총 5개 장소</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {planItems.map((item, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 border-pink-100">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {item.time.split(':')[0]}
                  </div>
                  {index < planItems.length - 1 && (
                    <div className="w-0.5 h-12 bg-gradient-to-b from-pink-300 to-orange-300 mx-auto mt-2"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      <Badge className={getTypeColor(item.type)}>
                        {getTypeIcon(item.type)} {item.type === 'restaurant' ? '맛집' : item.type === 'cafe' ? '카페' : item.type === 'activity' ? '활동' : item.type === 'culture' ? '문화' : '쇼핑'}
                      </Badge>
                      {item.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">{item.time}</div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>예상 소요시간: {item.duration}</span>
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Special Places Notice */}
        {formData.specialPlaces && (
          <Card className="mt-8 p-6 bg-gradient-to-r from-pink-50 to-orange-50 border-pink-200">
            <h4 className="font-semibold text-gray-800 mb-2">🎯 요청하신 장소가 포함되었어요!</h4>
            <p className="text-gray-600">{formData.specialPlaces}</p>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white flex-1"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            친구들과 공유하기
          </Button>
          <Link to="/create" className="flex-1">
            <Button size="lg" variant="outline" className="w-full">
              <Edit3 className="w-4 h-4 mr-2" />
              새로운 일정 만들기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlanResult;
