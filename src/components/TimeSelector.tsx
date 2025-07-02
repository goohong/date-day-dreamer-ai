
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ value, onChange, placeholder = "시간 선택" }) => {
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const parseTime = (timeString: string) => {
    if (!timeString) return { period: '', hour: '', minute: '' };
    const match = timeString.match(/^(\d{2}):(\d{2})$/);
    if (!match) return { period: '', hour: '', minute: '' };
    
    const hour24 = parseInt(match[1]);
    const minute = match[2];
    const period = hour24 < 12 ? '오전' : '오후';
    const hour12 = hour24 === 0 ? '12' : hour24 > 12 ? (hour24 - 12).toString().padStart(2, '0') : hour24.toString().padStart(2, '0');
    
    return { period, hour: hour12, minute };
  };

  const formatTime = (period: string, hour: string, minute: string) => {
    if (!period || !hour || !minute) return '';
    const hour24 = period === '오전' 
      ? (hour === '12' ? '00' : hour)
      : (hour === '12' ? '12' : (parseInt(hour) + 12).toString().padStart(2, '0'));
    return `${hour24}:${minute}`;
  };

  const { period, hour, minute } = parseTime(value);

  const handlePeriodChange = (newPeriod: string) => {
    if (hour && minute) {
      onChange(formatTime(newPeriod, hour, minute));
    }
  };

  const handleHourChange = (newHour: string) => {
    if (period && minute) {
      onChange(formatTime(period, newHour, minute));
    }
  };

  const handleMinuteChange = (newMinute: string) => {
    if (period && hour) {
      onChange(formatTime(period, hour, newMinute));
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Select value={period} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-20 h-12 text-base font-bold bg-white border-2 border-gray-200 rounded-xl">
          <SelectValue placeholder="시간" />
        </SelectTrigger>
        <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-lg">
          <SelectItem value="오전" className="text-base font-bold py-3 hover:bg-blue-500 hover:text-white rounded-lg">오전</SelectItem>
          <SelectItem value="오후" className="text-base font-bold py-3 hover:bg-blue-500 hover:text-white rounded-lg">오후</SelectItem>
        </SelectContent>
      </Select>

      <Select value={hour} onValueChange={handleHourChange}>
        <SelectTrigger className="w-20 h-12 text-base font-bold bg-white border-2 border-gray-200 rounded-xl">
          <SelectValue placeholder="시" />
        </SelectTrigger>
        <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60">
          {hours.map(h => (
            <SelectItem key={h} value={h} className="text-base font-bold py-3 hover:bg-blue-500 hover:text-white rounded-lg">{h}시</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={minute} onValueChange={handleMinuteChange}>
        <SelectTrigger className="w-20 h-12 text-base font-bold bg-white border-2 border-gray-200 rounded-xl">
          <SelectValue placeholder="분" />
        </SelectTrigger>
        <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60">
          {minutes.map(m => (
            <SelectItem key={m} value={m} className="text-base font-bold py-3 hover:bg-blue-500 hover:text-white rounded-lg">{m}분</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSelector;
