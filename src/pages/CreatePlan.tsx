import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, User, UserPlus, UserCheck, MapPin, Calendar, Plus, Sparkles, Clock, X, AlertCircle } from "lucide-react";
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
  
  const [addedPlans, setAddedPlans] = useState<{type: string, details: string[]}[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedDetails, setSelectedDetails] = useState<string[]>([]);
  const [showCustomDetailInput, setShowCustomDetailInput] = useState(false);
  const [customDetailInput, setCustomDetailInput] = useState("");

  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 2) {
      if (addedPlans.length === 0) {
        toast.error("일정 종류를 1개 이상 추가해주세요");
        return;
      }
      updateFormData('planTypes', addedPlans.map(p => p.type));
      updateFormData('detailedCategories', Array.from(new Set(addedPlans.flatMap(p => p.details))));
    }
    if (step < 3) {
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

  const handleAddPlan = () => {
    if (!selectedType) {
      toast.error("일정 종류를 선택해주세요");
      return;
    }
    setAddedPlans(prev => [...prev, { type: selectedType, details: selectedDetails }]);
    setSelectedType("");
    setSelectedDetails([]);
  };

  const handleRemoveAddedPlan = (idx: number) => {
    setAddedPlans(prev => prev.filter((_, i) => i !== idx));
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

  const peopleLabels = {
    "1": "1명",
    "2": "2명",
    "3-4": "3-4명",
    "5+": "5명 이상"
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
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <Card
                      className={`flex flex-col items-center justify-center p-6 cursor-pointer border-2 transition-all duration-200 ${formData.people === "1" ? "border-pink-500 bg-pink-50 shadow-lg" : "border-gray-200 hover:border-pink-300"}`}
                      onClick={() => updateFormData('people', '1')}
                      tabIndex={0}
                      role="button"
                      aria-pressed={formData.people === "1"}
                    >
                      <User className="w-8 h-8 mb-2 text-pink-500" />
                      <span className="font-semibold text-lg">1명</span>
                      <span className="text-sm text-gray-500">혼자</span>
                    </Card>
                    <Card
                      className={`flex flex-col items-center justify-center p-6 cursor-pointer border-2 transition-all duration-200 ${formData.people === "2" ? "border-pink-500 bg-pink-50 shadow-lg" : "border-gray-200 hover:border-pink-300"}`}
                      onClick={() => updateFormData('people', '2')}
                      tabIndex={0}
                      role="button"
                      aria-pressed={formData.people === "2"}
                    >
                      <Users className="w-8 h-8 mb-2 text-pink-500" />
                      <span className="font-semibold text-lg">2명</span>
                      <span className="text-sm text-gray-500">커플</span>
                    </Card>
                    <Card
                      className={`flex flex-col items-center justify-center p-6 cursor-pointer border-2 transition-all duration-200 ${formData.people === "3-4" ? "border-pink-500 bg-pink-50 shadow-lg" : "border-gray-200 hover:border-pink-300"}`}
                      onClick={() => updateFormData('people', '3-4')}
                      tabIndex={0}
                      role="button"
                      aria-pressed={formData.people === "3-4"}
                    >
                      <UserPlus className="w-8 h-8 mb-2 text-pink-500" />
                      <span className="font-semibold text-lg">3-4명</span>
                      <span className="text-sm text-gray-500">소그룹</span>
                    </Card>
                    <Card
                      className={`flex flex-col items-center justify-center p-6 cursor-pointer border-2 transition-all duration-200 ${formData.people === "5+" ? "border-pink-500 bg-pink-50 shadow-lg" : "border-gray-200 hover:border-pink-300"}`}
                      onClick={() => updateFormData('people', '5+')}
                      tabIndex={0}
                      role="button"
                      aria-pressed={formData.people === "5+"}
                    >
                      <UserCheck className="w-8 h-8 mb-2 text-pink-500" />
                      <span className="font-semibold text-lg">5명 이상</span>
                      <span className="text-sm text-gray-500">단체</span>
                    </Card>
                  </div>
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">일정 종류를 추가해보세요</h2>
                <p className="text-gray-600">여러 개의 일정 종류를 추가할 수 있어요</p>
                {/* 인원/장소 요약 안내 */}
                {formData.people && formData.location && (
                  <div className="mt-4 text-lg font-semibold text-pink-600">
                    {peopleLabels[formData.people]}, {formData.location}에서 어떤 일정을 추가해볼까요?
                  </div>
                )}
              </div>

              {/* 상단: 추가된 일정들 */}
              {addedPlans.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {addedPlans.map((plan, idx) => (
                    <div key={idx} className="flex items-center bg-pink-100 border border-pink-300 rounded-full px-4 py-2 text-sm text-pink-700">
                      <span className="font-semibold mr-2">{planTypeLabels[plan.type as keyof typeof planTypeLabels]}</span>
                      {plan.details.length > 0 && <span className="mr-2">[{plan.details.join(', ')}]</span>}
                      <button onClick={() => handleRemoveAddedPlan(idx)} className="ml-1 text-pink-500 hover:text-pink-700"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}

              {/* 큰 카테고리 선택 */}
              <div>
                <Label className="text-base font-medium mb-3 block">일정 종류(카테고리) <span className="text-pink-500">*</span></Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(planTypeLabels).map(([key, label]) => (
                    <Card
                      key={key}
                      className={`flex flex-col items-center justify-center p-6 cursor-pointer border-2 transition-all duration-200 ${selectedType === key ? "border-pink-500 bg-pink-50 shadow-lg" : "border-gray-200 hover:border-pink-300"}`}
                      onClick={() => setSelectedType(key)}
                      tabIndex={0}
                      role="button"
                      aria-pressed={selectedType === key}
                    >
                      <span className="font-semibold text-lg mb-1">{label}</span>
                      <span className="text-xs text-gray-500">{key}</span>
                      {selectedType === key && (
                        <span className="mt-2 text-pink-500 font-bold">선택됨</span>
                      )}
                    </Card>
                  ))}
                </div>
              </div>

              {/* 세부 카테고리(선택적) */}
              {selectedType && (
                <div>
                  <Label className="text-base font-medium mb-3 block">세부 카테고리 (선택)</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(categoryOptions[selectedType as keyof typeof categoryOptions] || []).map((category) => (
                      <button
                        key={category}
                        type="button"
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${selectedDetails.includes(category) ? "bg-pink-500 text-white border-pink-500" : "bg-white text-pink-600 border-pink-200 hover:bg-pink-50"}`}
                        onClick={() => setSelectedDetails(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category])}
                        aria-pressed={selectedDetails.includes(category)}
                      >
                        {category}
                      </button>
                    ))}
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${showCustomDetailInput ? "bg-orange-100 border-orange-400 text-orange-700" : "bg-white text-orange-600 border-orange-200 hover:bg-orange-50"}`}
                      onClick={() => setShowCustomDetailInput(v => !v)}
                    >
                      기타(직접 입력)
                    </button>
                  </div>
                  {/* 선택된 커스텀 세부 카테고리 Chip */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedDetails.filter(d => !(categoryOptions[selectedType as keyof typeof categoryOptions] || []).includes(d)).map((custom, idx) => (
                      <span key={custom + idx} className="flex items-center bg-orange-100 border border-orange-300 rounded-full px-3 py-1 text-xs text-orange-700">
                        {custom}
                        <button onClick={() => setSelectedDetails(prev => prev.filter(c => c !== custom))} className="ml-1 text-orange-500 hover:text-orange-700"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  {showCustomDetailInput && (
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        value={customDetailInput}
                        onChange={e => setCustomDetailInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && customDetailInput.trim()) {
                            setSelectedDetails(prev => prev.includes(customDetailInput.trim()) ? prev : [...prev, customDetailInput.trim()]);
                            setCustomDetailInput("");
                            setShowCustomDetailInput(false);
                          }
                        }}
                        placeholder="직접 입력 후 Enter"
                        className="w-48"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          if (customDetailInput.trim()) {
                            setSelectedDetails(prev => prev.includes(customDetailInput.trim()) ? prev : [...prev, customDetailInput.trim()]);
                            setCustomDetailInput("");
                            setShowCustomDetailInput(false);
                          }
                        }}
                        className="bg-orange-400 hover:bg-orange-500 text-white"
                      >
                        추가
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* 추가 버튼 */}
              <div className="flex justify-end mb-6">
                <Button
                  onClick={handleAddPlan}
                  disabled={!selectedType}
                  className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-6"
                >
                  <Plus className="w-4 h-4 mr-2" /> 추가
                </Button>
              </div>

              {/* 전체 일정 시작/종료 시간 선택 */}
              <div className="mb-2">
                <Label className="text-base font-medium mb-2 block">전체 일정 시간</Label>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-medium text-gray-700">
                    <Clock className="w-4 h-4 text-pink-500" /> 시작
                  </span>
                  <Select value={formData.startTime} onValueChange={value => updateFormData('startTime', value)}>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="시작" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map(time => (
                        <SelectItem
                          key={time}
                          value={time}
                          disabled={!!formData.endTime && time >= formData.endTime}
                        >
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="mx-2 text-gray-400 font-bold">~</span>
                  <span className="flex items-center gap-1 font-medium text-gray-700">종료</span>
                  <Select value={formData.endTime} onValueChange={value => updateFormData('endTime', value)}>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="종료" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map(time => (
                        <SelectItem
                          key={time}
                          value={time}
                          disabled={!!formData.startTime && time <= formData.startTime}
                        >
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-gray-500 mt-1">시작 시간 이후의 시간만 종료로 선택할 수 있어요</p>
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
                <p className="text-pink-600 font-semibold text-lg mb-2">다 왔어요!</p>
                <p className="text-gray-600">꼭 가고 싶은 장소나 특별한 요청을 알려주세요</p>
              </div>
              <div className="space-y-6">
                <Card className="p-6 border-pink-200 bg-pink-50">
                  <Label htmlFor="special-places" className="text-base font-medium mb-3 block">꼭 가고 싶은 장소 (선택)</Label>
                  <Input
                    id="special-places"
                    placeholder="예: 스타벅스 홍대점, 롯데월드타워 전망대"
                    value={formData.specialPlaces}
                    onChange={(e) => updateFormData('specialPlaces', e.target.value)}
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
                    className="h-24"
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
              className="px-6"
            >
              이전
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && (!formData.people || !formData.location)) ||
                (step === 2 && addedPlans.length === 0)
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
