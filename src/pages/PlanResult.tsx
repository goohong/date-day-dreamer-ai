import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Clock, MapPin, Share2, Heart, Star, Sparkles, ArrowUp, ArrowDown, Edit } from "lucide-react";
import { toast } from "sonner";
import GoogleMap from "@/components/GoogleMap";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Mock data generator for multiple plan options
type Activity = {
  id: string;
  time: string;
  place: string;
  activity: string;
  duration: number;
  location: { name: string; type: string; lat: number; lng: number };
  travelTime: number;
};
type Plan = {
  id: number;
  title: string;
  description: string;
  rating: number;
  duration: string;
  totalTime: string;
  activities: Activity[];
};

const generatePlanOptions = (formData: any): Plan[] => {
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
        { id: `블루보틀커피-10:00`, time: formData.startTime || "10:00", place: "블루보틀 커피 홍대점", activity: "모닝 커피", duration: 60, location: baseActivities[0], travelTime: 0 },
        { id: `홍대걷고싶은거리-11:30`, time: "11:30", place: "홍대 걷고싶은거리", activity: "산책 및 쇼핑", duration: 120, location: baseActivities[1], travelTime: transportTimes[0] },
        { id: `더현대서울-13:30`, time: "13:30", place: "더현대 서울", activity: "점심 식사", duration: 90, location: baseActivities[2], travelTime: transportTimes[1] },
        { id: `한강공원여의도-15:30`, time: "15:30", place: "한강공원 여의도", activity: "피크닉", duration: 120, location: baseActivities[3], travelTime: transportTimes[2] },
        { id: `63빌딩전망대-18:00`, time: "18:00", place: "63빌딩 전망대", activity: "석양 감상", duration: 60, location: baseActivities[4], travelTime: transportTimes[3] }
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
        { id: `홍대볼링장-10:00`, time: formData.startTime || "10:00", place: "홍대 볼링장", activity: "볼링", duration: 90, location: baseActivities[5], travelTime: 0 },
        { id: `교촌치킨홍대점-12:00`, time: "12:00", place: "교촌치킨 홍대점", activity: "점심 식사", duration: 60, location: baseActivities[6], travelTime: transportTimes[0] },
        { id: `홍대방탈출카페-14:00`, time: "14:00", place: "홍대 방탈출 카페", activity: "방탈출 게임", duration: 90, location: baseActivities[7], travelTime: transportTimes[1] },
        { id: `홍대노래방-16:00`, time: "16:00", place: "홍대 노래방", activity: "노래방", duration: 90, location: { name: "홍대 노래방", type: "노래방", lat: 37.5518, lng: 126.9928 }, travelTime: transportTimes[2] },
        { id: `홍대포차거리-18:00`, time: "18:00", place: "홍대 포차거리", activity: "저녁 식사", duration: 120, location: { name: "홍대 포차거리", type: "식당", lat: 37.5521, lng: 126.9932 }, travelTime: transportTimes[3] }
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
        { id: `망원한강공원-10:00`, time: formData.startTime || "10:00", place: "망원한강공원", activity: "아침 산책", duration: 60, location: baseActivities[8], travelTime: 0 },
        { id: `테라로사홍대점-11:30`, time: "11:30", place: "테라로사 홍대점", activity: "브런치 & 커피", duration: 120, location: baseActivities[9], travelTime: transportTimes[0] },
        { id: `홍대독립서점-14:00`, time: "14:00", place: "홍대 독립서점", activity: "책 구경", duration: 60, location: { name: "홍대 독립서점", type: "서점", lat: 37.5522, lng: 126.9935 }, travelTime: transportTimes[1] },
        { id: `홍대스파-15:30`, time: "15:30", place: "홍대 스파", activity: "마사지 & 휴식", duration: 120, location: { name: "홍대 스파", type: "스파", lat: 37.5516, lng: 126.9924 }, travelTime: transportTimes[2] },
        { id: `홍대루프탑바-18:00`, time: "18:00", place: "홍대 루프탑 바", activity: "선셋 드링크", duration: 90, location: { name: "홍대 루프탑 바", type: "바", lat: 37.5525, lng: 126.9938 }, travelTime: transportTimes[3] }
      ]
    }
  ];

  return plans;
};

// Helper to add minutes to a time string (HH:mm)
function addMinutes(time: string, minutes: number) {
  let [h, m] = time.split(":").map(Number);
  m += minutes;
  while (m >= 60) { h++; m -= 60; }
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

const PlanResult = () => {
  const location = useLocation();
  const formData = location.state?.formData || {};
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [planOptionsState, setPlanOptionsState] = useState<Plan[]>(() => generatePlanOptions(formData));
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editFields, setEditFields] = useState<Activity | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // DnD-kit state
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  );

  // Scroll to details when a plan is selected
  useEffect(() => {
    if (selectedPlan && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedPlan]);

  // Helper: recalculate times after reorder or travel time edit
  function recalcTimes(activities: any[], startTime: string) {
    let current = startTime;
    return activities.map((act, idx) => {
      if (idx > 0) {
        current = addMinutes(current, Number(activities[idx - 1].travelTime || 0));
      }
      const durationMin = Number(act.duration || 60);
      const newAct = { ...act, time: current };
      current = addMinutes(current, durationMin);
      return newAct;
    });
  }

  // dnd-kit: activities를 직접 관리
  const selectedPlanObj = planOptionsState.find(p => p.id === selectedPlan);

  // dnd-kit: 드래그 핸들러
  function handleDragEnd(event: any) {
    if (!selectedPlanObj) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const planIdx = planOptionsState.findIndex(p => p.id === selectedPlan);
    if (planIdx === -1) return;
    const oldIndex = selectedPlanObj.activities.findIndex(a => a.id === active.id);
    const newIndex = selectedPlanObj.activities.findIndex(a => a.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newActs = arrayMove(selectedPlanObj.activities, oldIndex, newIndex);
    const recalc = recalcTimes(newActs, formData.startTime || '09:00');
    const newPlans = planOptionsState.map((p, i) =>
      i === planIdx ? { ...p, activities: recalc } : p
    );
    setPlanOptionsState(newPlans);
  }

  // dnd-kit: SortableItem 컴포넌트
  function SortableItem({ activity, index, arr }: { activity: Activity, index: number, arr: Activity[] }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: activity.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 20 : undefined,
      opacity: isDragging ? 0.5 : 1
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes}>
        <div
          className={`flex flex-col md:flex-row items-center md:items-stretch gap-4 p-6 rounded-2xl border transition-all duration-300 bg-gradient-to-r from-gray-50 to-pink-50 border-gray-200 hover:shadow-md relative`}
        >
          {/* 드래그 핸들 (점 6개) */}
          <button
            className="flex flex-col items-center justify-center mr-2 cursor-grab active:cursor-grabbing select-none"
            style={{ minWidth: 24 }}
            type="button"
            aria-label="순서 옮기기"
            {...listeners}
          >
            <span className="block text-gray-400 text-2xl leading-none" style={{ letterSpacing: '-2px', lineHeight: 1 }}>
              •••
            </span>
            <span className="block text-gray-400 text-2xl leading-none" style={{ letterSpacing: '-2px', lineHeight: 1 }}>
              •••
            </span>
          </button>
          <div className="flex flex-col items-center justify-center mr-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg mb-2 bg-gradient-to-r from-pink-400 to-rose-400">
              {index + 1}
            </div>
          </div>
          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1 min-w-0">
              <div className="font-bold text-lg text-gray-800 truncate max-w-[180px]">{activity.place}</div>
              <span className="bg-pink-100 text-pink-700 rounded-full px-3 py-1 text-xs font-semibold border border-pink-200">{activity.location?.type || '명소'}</span>
              <span className="text-blue-500 font-semibold text-sm">{activity.time}~{addMinutes(activity.time, Number(activity.duration))}</span>
              {/* Duration inline edit */}
              {editingIdx === index && editFields ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={1}
                    value={editFields.duration ?? ''}
                    onChange={e => handleEditField('duration', e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-20 h-8 text-sm px-2"
                    autoFocus
                  />
                  <span className="text-gray-500 text-xs">분</span>
                  <Button size="sm" className="ml-1 px-2 py-1 bg-pink-500 text-white text-xs" onClick={handleEditApply}>저장</Button>
                  <Button size="sm" variant="ghost" className="px-2 py-1 text-xs" onClick={handleEditCancel}>취소</Button>
                </div>
              ) : (
                <button
                  className="ml-2 px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded-full text-sm font-semibold hover:bg-blue-50 transition"
                  onClick={() => { setEditingIdx(index); setEditFields({ ...activity }); }}
                >
                  {activity.duration}분
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end min-w-[80px]">
            <Button variant="ghost" size="sm" className="text-pink-400 hover:text-pink-600 hover:bg-pink-50">
              <Heart className="w-5 h-5" />
            </Button>
          </div>
          {activity.activity && (
            <div className="pt-2 text-gray-600 text-sm break-words w-full md:w-auto">{activity.activity}</div>
          )}
        </div>
      </div>
    );
  }

  // Handle travel time edit
  const handleTravelTimeChange = (idx: number, value: number) => {
    if (selectedPlan == null) return;
    const planIdx = planOptionsState.findIndex(p => p.id === selectedPlan);
    const plan = planOptionsState[planIdx];
    const acts = plan.activities.map((a, i) => i === idx ? { ...a, travelTime: value } : a);
    const newActs = recalcTimes(acts, formData.startTime || '09:00');
    const newPlans = planOptionsState.map((p, i) => i === planIdx ? { ...p, activities: newActs } : p);
    setPlanOptionsState(newPlans);
  };

  // Handle edit
  const handleEdit = (idx: number) => {
    if (selectedPlan == null) return;
    const planIdx = planOptionsState.findIndex(p => p.id === selectedPlan);
    const act = planOptionsState[planIdx].activities[idx];
    setEditingIdx(idx);
    setEditFields({ ...act });
  };
  const handleEditField = (field: string, value: string) => {
    setEditFields((prev: any) => prev ? { ...prev, [field]: value } : prev);
  };
  const handleEditApply = () => {
    if (selectedPlan == null || editingIdx == null || !editFields) return;
    const planIdx = planOptionsState.findIndex(p => p.id === selectedPlan);
    const acts = planOptionsState[planIdx].activities.map((a, i) => i === editingIdx ? { ...editFields } : a);
    const newActs = recalcTimes(acts, formData.startTime || '09:00');
    const newPlans = planOptionsState.map((p, i) => i === planIdx ? { ...p, activities: newActs } : p);
    setPlanOptionsState(newPlans);
    setEditingIdx(null);
    setEditFields(null);
    toast.success('일정이 수정되었습니다!');
  };
  const handleEditCancel = () => {
    setEditingIdx(null);
    setEditFields(null);
  };

  const formatTime = (time: string) => {
    if (!time || typeof time !== 'string' || !time.includes(':')) return '';
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
    const selected = planOptionsState.find(p => p.id === selectedPlan);
    if (!selected || !selected.activities) return [];
    return selected.activities.map(activity => ({
      name: activity.place,
      lat: activity.location?.lat ?? 0,
      lng: activity.location?.lng ?? 0
    }));
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
              Planmate
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
          {/* Selected Places Chip List */}
          {formData.selectedPlaces?.length > 0 && (
            <div className="flex items-center justify-center mt-3">
              <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent py-1 px-2 max-w-full">
                {formData.selectedPlaces.map((place: any, idx: number) => (
                  <span
                    key={place.name + idx}
                    className="whitespace-nowrap bg-pink-100 text-pink-700 rounded-full px-4 py-1 text-sm font-medium border border-pink-200 shadow-sm hover:bg-pink-200 transition-colors duration-150"
                  >
                    {place.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Plan Options */}
        <div className="grid gap-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            3가지 추천 코스 중 선택해보세요
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {planOptionsState.map((plan) => (
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
                    <div key={activity.id} className="flex items-start space-x-3">
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
        {selectedPlanObj && (
          <div ref={detailsRef} className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                {selectedPlanObj.title}
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
              <GoogleMap places={getSelectedPlanLocations()} />
            </div>

            {/* Schedule Timeline */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-pink-500" />
                세부 일정
              </h3>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={selectedPlanObj?.activities.map(a => a.id) || []}
                  strategy={verticalListSortingStrategy}
                >
                  {selectedPlanObj?.activities.map((activity, index, arr) => (
                    <div key={activity.id + '-wrapper'}>
                      <SortableItem activity={activity} index={index} arr={arr} />
                      {/* 이동시간/사이 공간은 기존처럼 렌더링 (드롭존은 dnd-kit가 관리) */}
                      {index < arr.length - 1 && (
                        <div className="transition-all duration-200 flex flex-col items-center justify-center select-none w-full min-h-[32px] my-4">
                          <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/80 border border-pink-100 text-xs text-gray-500 shadow-sm min-h-[28px]">
                            <span>이동 {activity.travelTime}분</span>
                            <input
                              type="number"
                              min={0}
                              value={activity.travelTime}
                              onChange={e => handleTravelTimeChange(index, Number(e.target.value))}
                              className="w-10 px-1 py-0.5 border border-pink-100 rounded text-center text-pink-600 text-xs focus:outline-none focus:ring-1 focus:ring-pink-300"
                              style={{ height: 22 }}
                            />
                            <span className="text-pink-400">분</span>
                            <span className="text-[10px]">{formData.transportation === 'public' ? '🚌' : '🚗'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </SortableContext>
              </DndContext>
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
