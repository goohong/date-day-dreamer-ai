import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const periods = ['오전', '오후'];

function parseTime(timeString: string) {
  if (!timeString) return { period: '', hour: '', minute: '' };
  const match = timeString.match(/^(\d{2}):(\d{2})$/);
  if (!match) return { period: '', hour: '', minute: '' };
  const hour24 = parseInt(match[1]);
  const minute = match[2];
  const period = hour24 < 12 ? '오전' : '오후';
  const hour12 = hour24 === 0 ? '12' : hour24 > 12 ? (hour24 - 12).toString().padStart(2, '0') : hour24.toString().padStart(2, '0');
  return { period, hour: hour12, minute };
}

function formatTime(period: string, hour: string, minute: string) {
  if (!period || !hour || !minute) return '';
  const hour24 = period === '오전'
    ? (hour === '12' ? '00' : hour)
    : (hour === '12' ? '12' : (parseInt(hour) + 12).toString().padStart(2, '0'));
  return `${hour24}:${minute}`;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ value, onChange, placeholder = "시간 선택" }) => {
  const { period, hour, minute } = parseTime(value);
  const [open, setOpen] = useState(false);
  const [tempPeriod, setTempPeriod] = useState(period || '오전');
  const [tempHour, setTempHour] = useState(hour || '10');
  const [tempMinute, setTempMinute] = useState(minute || '00');

  // Reset temp values when opening
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      const parsed = parseTime(value);
      setTempPeriod(parsed.period || '오전');
      setTempHour(parsed.hour || '10');
      setTempMinute(parsed.minute || '00');
    }
  };

  const handleConfirm = () => {
    onChange(formatTime(tempPeriod, tempHour, tempMinute));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-12 w-32 flex items-center justify-between px-4 text-base font-semibold border-2 border-gray-200 rounded-xl bg-white shadow-sm hover:border-pink-400 focus:ring-2 focus:ring-pink-300"
        >
          <span>{value ? `${parseTime(value).period} ${parseTime(value).hour}:${parseTime(value).minute}` : placeholder}</span>
          <Clock className="w-5 h-5 ml-2 text-pink-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} className="p-0 bg-transparent border-none shadow-none w-auto min-w-[320px] max-w-md">
        <Card className="p-6 rounded-2xl shadow-xl w-full max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-gray-800">시간 선택</span>
            <Clock className="w-6 h-6 text-pink-500" />
          </div>
          <div className="flex gap-2 justify-center mb-6">
            {/* Period */}
            <div className="flex flex-col items-center">
              <div className="flex gap-2 mb-2">
                {periods.map(p => (
                  <button
                    key={p}
                    className={`px-4 py-2 rounded-lg font-bold text-base border-2 transition-all duration-150 ${tempPeriod === p ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50'}`}
                    onClick={() => setTempPeriod(p)}
                    type="button"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            {/* Hour */}
            <div className="flex flex-col items-center">
              <div className="flex gap-1 mb-2">
                <span className="text-sm text-gray-500">시</span>
              </div>
              <div className="h-48 overflow-y-auto w-16 bg-white rounded-lg border-2 border-gray-100 shadow-inner flex flex-col items-center">
                {hours.map(h => (
                  <button
                    key={h}
                    className={`w-full py-2 text-base font-bold rounded-lg transition-all duration-100 ${tempHour === h ? 'bg-blue-500 text-white' : 'hover:bg-blue-50 text-gray-700'}`}
                    onClick={() => setTempHour(h)}
                    type="button"
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
            {/* Minute */}
            <div className="flex flex-col items-center">
              <div className="flex gap-1 mb-2">
                <span className="text-sm text-gray-500">분</span>
              </div>
              <div className="h-48 overflow-y-auto w-16 bg-white rounded-lg border-2 border-gray-100 shadow-inner flex flex-col items-center">
                {minutes.map(m => (
                  <button
                    key={m}
                    className={`w-full py-2 text-base font-bold rounded-lg transition-all duration-100 ${tempMinute === m ? 'bg-blue-500 text-white' : 'hover:bg-blue-50 text-gray-700'}`}
                    onClick={() => setTempMinute(m)}
                    type="button"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" className="h-10 px-6 rounded-lg text-base" onClick={() => setOpen(false)} type="button">취소</Button>
            <Button className="h-10 px-6 rounded-lg text-base bg-blue-500 hover:bg-blue-600 text-white" onClick={handleConfirm} type="button">확인</Button>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default TimeSelector;
