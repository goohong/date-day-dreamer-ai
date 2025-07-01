
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Users, MapPin, Calendar, Plus, Sparkles, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CreatePlan = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    people: "",
    location: "",
    planType: "",
    detailedCategories: [] as string[],
    customActivities: "",
    startTime: "",
    endTime: "",
    specialPlaces: "",
    preferences: ""
  });
  
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Generate plan
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

  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = formData.detailedCategories;
    if (checked) {
      updateFormData('detailedCategories', [...currentCategories, category]);
    } else {
      updateFormData('detailedCategories', currentCategories.filter(c => c !== category));
    }
  };

  const categoryOptions = {
    relaxed: ["카페", "공원", "쇼핑몰", "북카페", "산책로", "전망대"],
    foodie: ["한식", "양식", "일식", "중식", "디저트", "술집", "브런치"],
    active: ["볼링", "노래방", "게임", "스포츠", "체험활동", "워크숍"],
    culture: ["전시회", "박물관", "영화관", "공연", "갤러리", "문화센터"]
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

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

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">진행률</span>
            <span className="text-sm font-medium text-gray-600">{step}/3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="p-8 shadow-lg border-pink-100">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">기본 정보를 입력해주세요</h2>
                <p className="text-gray-600">인원수와 지역 정보가 필요해요</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">몇 명과 함께 하시나요?</Label>
                  <RadioGroup value={formData.people} onValueChange={(value) => updateFormData('people', value)}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-pink-50 transition-colors">
                      <RadioGroupItem value="2" id="people-2" />
                      <Label htmlFor="people-2">2명 (커플)</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-pink-50 transition-colors">
                      <RadioGroupItem value="3-4" id="people-3-4" />
                      <Label htmlFor="people-3-4">3-4명 (소그룹)</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-pink-50 transition-colors">
                      <RadioGroupItem value="5+" id="people-5" />
                      <Label htmlFor="people-5">5명 이상 (단체)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="location" className="text-base font-medium mb-3 block">어느 지역에서 만나시나요?</Label>
                  <Select value={formData.location} onValueChange={(value) => updateFormData('location', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="지역을 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hongdae">홍대</SelectItem>
                      <SelectItem value="gangnam">강남</SelectItem>
                      <SelectItem value="myeongdong">명동</SelectItem>
                      <SelectItem value="itaewon">이태원</SelectItem>
                      <SelectItem value="jamsil">잠실</SelectItem>
                      <SelectItem value="sinchon">신촌</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">어떤 일정을 원하시나요?</h2>
                <p className="text-gray-600">취향에 맞는 코스를 추천해드릴게요</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">일정 종류 (대분류)</Label>
                  <RadioGroup value={formData.planType} onValueChange={(value) => updateFormData('planType', value)}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-pink-50 transition-colors">
                      <RadioGroupItem value="relaxed" id="relaxed" />
                      <Label htmlFor="relaxed">여유로운 휴식</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-pink-50 transition-colors">
                      <RadioGroupItem value="foodie" id="foodie" />
                      <Label htmlFor="foodie">맛집 탐방</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-pink-50 transition-colors">
                      <RadioGroupItem value="active" id="active" />
                      <Label htmlFor="active">액티비티</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-pink-50 transition-colors">
                      <RadioGroupItem value="culture" id="culture" />
                      <Label htmlFor="culture">문화생활</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.planType && (
                  <div>
                    <Label className="text-base font-medium mb-3 block">세부 카테고리 (선택사항)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {categoryOptions[formData.planType as keyof typeof categoryOptions]?.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={formData.detailedCategories.includes(category)}
                            onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                          />
                          <Label htmlFor={category} className="text-sm">{category}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="custom-activities" className="text-base font-medium mb-3 block">
                    원하는 활동이나 메뉴 (자유 입력)
                  </Label>
                  <Input
                    id="custom-activities"
                    placeholder="예: 치킨, 피자, 레이저태그, 방탈출"
                    value={formData.customActivities}
                    onChange={(e) => updateFormData('customActivities', e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">여러 항목은 쉼표(,)로 구분해주세요</p>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    <Clock className="w-4 h-4 inline mr-2" />
                    일정 시간대
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-time" className="text-sm text-gray-600 mb-1 block">시작 시간</Label>
                      <Select value={formData.startTime} onValueChange={(value) => updateFormData('startTime', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="시작 시간" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="end-time" className="text-sm text-gray-600 mb-1 block">종료 시간</Label>
                      <Select value={formData.endTime} onValueChange={(value) => updateFormData('endTime', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="종료 시간" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">특별한 요청이 있나요?</h2>
                <p className="text-gray-600">꼭 가고 싶은 장소나 특별한 요청을 알려주세요</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="special-places" className="text-base font-medium mb-3 block">
                    꼭 가고 싶은 장소 (선택사항)
                  </Label>
                  <Input
                    id="special-places"
                    placeholder="예: 스타벅스 홍대점, 롯데월드타워 전망대"
                    value={formData.specialPlaces}
                    onChange={(e) => updateFormData('specialPlaces', e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">여러 장소는 쉼표(,)로 구분해주세요</p>
                </div>

                <div>
                  <Label htmlFor="preferences" className="text-base font-medium mb-3 block">
                    추가 요청사항 (선택사항)
                  </Label>
                  <Textarea
                    id="preferences"
                    placeholder="예: 인스타 사진 찍기 좋은 곳, 조용한 분위기, 애완동물 동반 가능한 곳"
                    value={formData.preferences}
                    onChange={(e) => updateFormData('preferences', e.target.value)}
                    className="h-24"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="px-6"
            >
              이전
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && (!formData.people || !formData.location)) ||
                (step === 2 && (!formData.planType || !formData.startTime || !formData.endTime))
              }
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-6"
            >
              {step === 3 ? (
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
    </div>
  );
};

export default CreatePlan;
