
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Users, Share2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-pink-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              DatePlanner AI
            </h1>
          </div>
          <Button variant="outline" className="hidden md:flex">
            로그인
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
              완벽한 데이트 코스를
              <br />
              AI가 자동으로 계획해드려요
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              인원수, 지역, 취향만 알려주세요. 분 단위로 최적화된 일정을 만들어드릴게요.
              더 이상 계획 스트레스 받지 마세요!
            </p>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link to="/create">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                데이트 일정 만들기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            왜 DatePlanner AI를 선택해야 할까요?
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300 border-pink-100">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2 text-gray-800">분 단위 계획</h4>
              <p className="text-gray-600 text-sm">
                AI가 이동시간과 체류시간을 고려해 완벽한 스케줄을 만들어드려요
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300 border-pink-100">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2 text-gray-800">맞춤형 추천</h4>
              <p className="text-gray-600 text-sm">
                꼭 가고 싶은 장소를 추가하면 자동으로 최적 시간에 배치해드려요
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300 border-pink-100">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2 text-gray-800">쉬운 공유</h4>
              <p className="text-gray-600 text-sm">
                링크 하나로 연인, 친구들과 일정을 공유하고 함께 수정하세요
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300 border-pink-100">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2 text-gray-800">그룹 맞춤</h4>
              <p className="text-gray-600 text-sm">
                커플부터 친구 그룹까지, 인원수에 맞는 장소를 추천해드려요
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-pink-500 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">
            지금 바로 완벽한 데이트를 계획해보세요
          </h3>
          <p className="text-lg mb-8 opacity-90">
            김민수씨처럼 바쁜 일상 속에서도 특별한 추억을 만들어보세요
          </p>
          <Link to="/create">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-pink-600 hover:bg-gray-50 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>&copy; 2024 DatePlanner AI. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
