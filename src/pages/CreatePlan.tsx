
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Users, User, UserPlus, UserCheck, MapPin, Calendar, Plus, Sparkles, Clock, Car, Bus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import TimeSelector from "@/components/TimeSelector";
import PlaceSearch from "@/components/PlaceSearch";
import SelectedItinerary from "@/components/SelectedItinerary";

const CreatePlan = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    people: "",
    location: "",
    selectedPlaces: [] as string[],
    startTime: "",
    endTime: "",
    transportation: "",
    specialPlaces: "",
    preferences: ""
  });

  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 2 && formData.selectedPlaces.length === 0) {
      toast.error("장소를 1개 이상 선택해주세요");
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    } else {
      navigate('/plan-result', { state: { formData } });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePlace = (place: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPlaces: prev.selectedPlaces.includes(place)
        ? prev.selectedPlaces.filter(p => p !== place)
        : [...prev.selectedPlaces, place]
    }));
  };

  const removePlace = (place: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPlaces: prev.selectedPlaces.filter(p => p !== place)
    }));
  };

  const peopleLabels = {
    "1": "1명",
    "2": "2명", 
    "3-4": "3-4명",
    "5+": "5명 이상"
  };

  // Validate time selection
  const isValidTimeSelection = () => {
    if (!formData.startTime || !formData.endTime) return false;
    return formData.startTime < formData.endTime;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-pink-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
            <span>돌아가기</span>
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
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">진행률</span>
            <span className="text-sm font-medium text-gray-600">{step}/4</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className={step === 2 ? "grid grid-cols-1 lg:grid-cols-3 gap-8" : ""}>
          {/* Main Content */}
          <div className={step === 2 ? "lg:col-span-2" : ""}>
            <Card className="p-8 shadow-lg border-pink-100">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">기본 정보를 입력해주세요</h2>
                    <p className="text-gray-600">인원수와 지역, 시간 정보가 필요해요</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium mb-3 block">몇 명과 함께 하시나요?</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        {Object.entries(peopleLabels).map(([key, label]) => (
                          <Card
                            key={key}
                            className={`flex flex-col items-center justify-center p-6 cursor-pointer border-2 transition-all duration-200 ${formData.people === key ? "border-pink-500 bg-pink-50 shadow-lg" : "border-gray-200 hover:border-pink-300"}`}
                            onClick={() => updateFormData('people', key)}
                          >
                            {key === "1" && <User className="w-8 h-8 mb-2 text-pink-500" />}
                            {key === "2" && <Users className="w-8 h-8 mb-2 text-pink-500" />}
                            {key === "3-4" && <UserPlus className="w-8 h-8 mb-2 text-pink-500" />}
                            {key === "5+" && <UserCheck className="w-8 h-8 mb-2 text-pink-500" />}
                            <span className="font-semibold text-lg">{label}</span>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-base font-medium mb-3 block">어느 지역에서 만나시나요?</Label>
                      <Select value={formData.location} onValueChange={(value) => updateFormData('location', value)}>
                        <SelectTrigger className="w-full h-12 text-base border-2 border-gray-200 rounded-xl">
                          <SelectValue placeholder="지역을 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-lg">
                          <SelectItem value="홍대">홍대</SelectItem>
                          <SelectItem value="강남">강남</SelectItem>
                          <SelectItem value="명동">명동</SelectItem>
                          <SelectItem value="이태원">이태원</SelectItem>
                          <SelectItem value="잠실">잠실</SelectItem>
                          <SelectItem value="신촌">신촌</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">전체 일정 시간</Label>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 font-medium text-gray-700">
                            <Clock className="w-4 h-4 text-pink-500" /> 시작
                          </span>
                          <TimeSelector
                            value={formData.startTime}
                            onChange={(value) => updateFormData('startTime', value)}
                            placeholder="시작 시간"
                          />
                        </div>
                        <span className="mx-2 text-gray-400 font-bold">~</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">종료</span>
                          <TimeSelector
                            value={formData.endTime}
                            onChange={(value) => updateFormData('endTime', value)}
                            placeholder="종료 시간"
                          />
                        </div>
                      </div>
                      {formData.startTime && formData.endTime && !isValidTimeSelection() && (
                        <p className="text-red-500 text-sm mt-2">시작 시간이 종료 시간보다 늦을 수 없습니다</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">가고 싶은 장소를 선택해주세요</h2>
                    <p className="text-gray-600">원하는 장소들을 여러 개 선택할 수 있어요</p>
                  </div>

                  <PlaceSearch
                    selectedPlaces={formData.selectedPlaces}
                    onPlaceToggle={togglePlace}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Car className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">이동수단을 선택해주세요</h2>
                    <p className="text-gray-600">이동 시간 계산을 위해 필요해요</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card
                        className={`flex flex-col items-center justify-center p-8 cursor-pointer border-2 transition-all duration-200 ${formData.transportation === "public" ? "border-pink-500 bg-pink-50 shadow-lg" : "border-gray-200 hover:border-pink-300"}`}
                        onClick={() => updateFormData('transportation', 'public')}
                      >
                        <Bus className="w-12 h-12 mb-4 text-pink-500" />
                        <span className="font-semibold text-xl mb-2">대중교통</span>
                        <span className="text-sm text-gray-500 text-center">지하철, 버스를 이용한<br/>친환경적인 이동</span>
                      </Card>
                      
                      <Card
                        className={`flex flex-col items-center justify-center p-8 cursor-pointer border-2 transition-all duration-200 ${formData.transportation === "car" ? "border-pink-500 bg-pink-50 shadow-lg" : "border-gray-200 hover:border-pink-300"}`}
                        onClick={() => updateFormData('transportation', 'car')}
                      >
                        <Car className="w-12 h-12 mb-4 text-pink-500" />
                        <span className="font-semibold text-xl mb-2">자동차</span>
                        <span className="text-sm text-gray-500 text-center">편리하고 빠른<br/>개인 차량 이용</span>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">특별한 요청이 있나요?</h2>
                    <p className="text-pink-600 font-semibold text-lg mb-2">다 왔어요!</p>
                    <p className="text-gray-600">추가 요청사항을 알려주세요</p>
                  </div>
                  <div className="space-y-6">
                    <Card className="p-6 border-pink-200 bg-pink-50">
                      <Label htmlFor="special-places" className="text-base font-medium mb-3 block">꼭 가고 싶은 추가 장소 (선택)</Label>
                      <Input
                        id="special-places"
                        placeholder="예: 스타벅스 홍대점, 롯데월드타워 전망대"
                        value={formData.specialPlaces}
                        onChange={(e) => updateFormData('specialPlaces', e.target.value)}
                        className="h-12 text-base border-2 border-pink-200 rounded-xl"
                      />
                      <p className="text-sm text-gray-500 mt-1">여러 장소는 쉼표(,)로 구분</p>
                    </Card>
                    <Card className="p-6 border-pink-200 bg-pink-50">
                      <Label htmlFor="preferences" className="text-base font-medium mb-3 block">추가 요청사항 (선택)</Label>
                      <Textarea
                        id="preferences"
                        placeholder="예: 인스타 사진 찍기 좋은 곳, 조용한 분위기, 애완동물 동반 가능"
                        value={formData.preferences}
                        onChange={(e) => updateFormData('preferences', e.target.value)}
                        className="h-24 text-base border-2 border-pink-200 rounded-xl"
                      />
                    </Card>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="px-6 h-12 text-base border-2 border-gray-200 rounded-xl"
                >
                  이전
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && (!formData.people || !formData.location || !isValidTimeSelection())) ||
                    (step === 2 && formData.selectedPlaces.length === 0) ||
                    (step === 3 && !formData.transportation)
                  }
                  className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-6 h-12 text-base rounded-xl"
                >
                  {step === 4 ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI 일정 생성하기
                    </>
                  ) : (
                    '다음'
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Selected Itinerary Sidebar (only shown on step 2) */}
          {step === 2 && (
            <div className="lg:col-span-1">
              <SelectedItinerary
                selectedPlaces={formData.selectedPlaces}
                onRemovePlace={removePlace}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePlan;
