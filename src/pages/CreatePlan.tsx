
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, MapPin, Calendar, Plus, Sparkles, Clock, X, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreatePlan = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    people: "",
    location: "",
    planTypes: [] as string[],
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

  const handlePlanTypeAdd = (planType: string) => {
    if (!formData.planTypes.includes(planType)) {
      updateFormData('planTypes', [...formData.planTypes, planType]);
    }
  };

  const handlePlanTypeRemove = (planType: string) => {
    updateFormData('planTypes', formData.planTypes.filter(type => type !== planType));
  };

  const validateTimeRange = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return true;
    
    const start = parseInt(startTime.replace(':', ''));
    const end = parseInt(endTime.replace(':', ''));
    
    if (start >= end) {
      toast.error("시작 시간은 종료 시간보다 이전이어야 합니다.");
      return false;
    }
    return true;
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const newFormData = { ...formData, [field]: value };
    
    if (field === 'startTime' && newFormData.endTime) {
      if (!validateTimeRange(value, newFormData.endTime)) return;
    }
    if (field === 'endTime' && newFormData.startTime) {
      if (!validateTimeRange(newFormData.startTime, value)) return;
    }
    
    updateFormData(field, value);
  };

  const categoryOptions = {
    relaxed: ["카페", "공원", "쇼핑몰", "북카페", "산책로", "전망대"],
    foodie: ["한식", "양식", "일식", "중식", "디저트", "술집", "브런치"],
    active: ["볼링", "노래방", "게임", "스포츠", "체험활동", "워크숍"],
    culture: ["전시회", "박물관", "영화관", "공연", "갤러리", "문화센터"]
  };

  const planTypeLabels = {
    relaxed: "여유로운 휴식",
    foodie: "맛집 탐방", 
    active: "액티비티",
    culture: "문화생활"
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
                      <SelectItem value="홍대">홍대</SelectItem>
                      <SelectItem value="강남">강남</SelectItem>
                      <SelectItem value="명동">명동</SelectItem>
                      <SelectItem value="이태원">이태원</SelectItem>
                      <SelectItem value="잠실">잠실</SelectItem>
                      <SelectItem value="신촌">신촌</SelectItem>
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
                <p className="text-gray-600">원하는 일정 종류를 모두 선택해주세요</p>
              </div>

              <div className="space-y-6">
                {/* 선택된 일정 종류 표시 */}
                {formData.planTypes.length > 0 && (
                  <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <Label className="text-base font-medium mb-3 block">선택된 일정 종류</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.planTypes.map((type) => (
                        <Badge 
                          key={type} 
                          variant="secondary" 
                          className="px-3 py-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white"
                        >
                          {planTypeLabels[type as keyof typeof planTypeLabels]}
                          <button
                            onClick={() => handlePlanTypeRemove(type)}
                            className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-base font-medium mb-3 block">일정 종류 추가</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(planTypeLabels).map(([key, label]) => (
                      <Button
                        key={key}
                        variant={formData.planTypes.includes(key) ? "default" : "outline"}
                        onClick={() => handlePlanTypeAdd(key)}
                        disabled={formData.planTypes.includes(key)}
                        className="justify-start"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {formData.planTypes.length > 0 && (
                  <div>
                    <Label className="text-base font-medium mb-3 block">세부 카테고리 (선택사항)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {formData.planTypes.flatMap(planType => 
                        categoryOptions[planType as keyof typeof categoryOptions] || []
                      ).filter((category, index, array) => array.indexOf(category) === index)
                      .map((category) => (
                        <div key={category} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-pink-50">
                          <input
                            type="checkbox"
                            id={category}
                            checked={formData.detailedCategories.includes(category)}
                            onChange={(e) => handleCategoryChange(category, e.target.checked)}
                            className="rounded border-gray-300"
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
                      <Select value={formData.startTime} onValueChange={(value) => handleTimeChange('startTime', value)}>
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
                      <Select value={formData.endTime} onValueChange={(value) => handleTimeChange('endTime', value)}>
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
                  {formData.startTime && formData.endTime && 
                   parseInt(formData.startTime.replace(':', '')) >= parseInt(formData.endTime.replace(':', '')) && (
                    <div className="flex items-center space-x-2 mt-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">시작 시간은 종료 시간보다 이전이어야 합니다</span>
                    </div>
                  )}
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
                (step === 2 && (formData.planTypes.length === 0 || !formData.startTime || !formData.endTime ||
                 parseInt(formData.startTime.replace(':', '')) >= parseInt(formData.endTime.replace(':', ''))))
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
