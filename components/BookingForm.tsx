'use client';
import { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, MapPin, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface BookingFormProps {
  motorId: string;
}

export default function BookingForm({ motorId }: BookingFormProps) {
  const [location, setLocation] = useState('Cabang Malang');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  const [showCalendar, setShowCalendar] = useState<'start' | 'end' | null>(null);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Options for location
  const locationOptions = [
    { value: "Cabang Malang", label: "Cabang Malang", desc: "Gratis" },
    { value: "Cabang Stasiun Malang", label: "Cabang Stasiun Malang", desc: "+Rp 10.000" },
    { value: "Antar Hotel", label: "Antar ke Hotel/Alamat", desc: "+Rp 25.000" }
  ];

  // Close popups when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(null);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    selectedDate.setHours(12, 0, 0, 0); // Avoid timezone issues

    if (showCalendar === 'start') {
      setStartDate(selectedDate);
      // If end date is before new start date, clear it
      if (endDate && selectedDate > endDate) {
        setEndDate(null);
      }
      setShowCalendar('end'); // Auto-switch to end date
    } else if (showCalendar === 'end') {
      if (startDate && selectedDate < startDate) {
        alert("Tanggal selesai tidak boleh sebelum tanggal mulai");
        return;
      }
      setEndDate(selectedDate);
      setShowCalendar(null);
    }
  };

  const isSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    date.setHours(12,0,0,0);
    
    if (showCalendar === 'start' && startDate) {
      return startDate.getTime() === date.getTime();
    }
    if (showCalendar === 'end' && endDate) {
      return endDate.getTime() === date.getTime();
    }
    
    // Highlight range visually if both selected
    if (startDate && endDate) {
      if (date >= startDate && date <= endDate) return true;
    }
    
    return false;
  };

  const isRangeMiddle = (day: number) => {
    if (!startDate || !endDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    date.setHours(12,0,0,0);
    return date > startDate && date < endDate;
  };

  const isPast = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0,0,0,0);
    return date < today;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Pilih Tanggal';
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  const toYYYYMMDD = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <form action="/checkout" method="GET" className="space-y-5 relative">
      <input type="hidden" name="motor_id" value={motorId} />
      <input type="hidden" name="start_date" value={toYYYYMMDD(startDate)} />
      <input type="hidden" name="end_date" value={toYYYYMMDD(endDate)} />
      <input type="hidden" name="location" value={location} />
      
      <div ref={locationRef} className="relative">
        <label className="text-sm font-medium mb-2 block">Lokasi Pengambilan & Pengembalian</label>
        <div 
          onClick={() => {
            setShowLocationDropdown(!showLocationDropdown);
            setShowCalendar(null); // Close calendar if open
          }}
          className={`flex items-center bg-surface rounded-xl px-4 py-3 border transition-colors cursor-pointer ${showLocationDropdown ? 'border-primary' : 'border-border-color hover:border-primary/50'}`}
        >
          <MapPin className={location ? "text-primary mr-3" : "text-text-muted mr-3"} size={18} />
          <span className="text-text-main flex-1">
            {locationOptions.find(opt => opt.value === location)?.label || location}
          </span>
          <span className="text-xs text-text-muted">
            {locationOptions.find(opt => opt.value === location)?.desc}
          </span>
        </div>

        {/* Custom Location Dropdown */}
        {showLocationDropdown && (
          <div className="absolute z-50 mt-2 w-full glass-card rounded-2xl p-2 border border-border-color shadow-2xl animate-fade-in">
            {locationOptions.map((opt) => (
              <div 
                key={opt.value}
                onClick={() => {
                  setLocation(opt.value);
                  setShowLocationDropdown(false);
                }}
                className={`px-4 py-3 rounded-xl cursor-pointer transition-colors flex justify-between items-center ${location === opt.value ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-surface-hover text-text-main'}`}
              >
                <span>{opt.label}</span>
                <span className={`text-xs ${location === opt.value ? 'text-primary' : 'text-text-muted'}`}>{opt.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 relative">
        <div>
          <label className="text-sm font-medium mb-2 block">Tanggal Mulai</label>
          <div 
            onClick={() => {
              setShowCalendar(showCalendar === 'start' ? null : 'start');
              setShowLocationDropdown(false); // Close location dropdown if open
            }}
            className={`flex items-center bg-surface rounded-xl px-4 py-3 border transition-colors cursor-pointer ${showCalendar === 'start' ? 'border-primary' : 'border-border-color hover:border-primary/50'}`}
          >
            <CalendarIcon className={startDate ? "text-primary mr-3" : "text-text-muted mr-3"} size={18} />
            <span className={startDate ? "text-text-main" : "text-text-muted"}>
              {formatDate(startDate)}
            </span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Tanggal Selesai</label>
          <div 
            onClick={() => {
              setShowCalendar(showCalendar === 'end' ? null : 'end');
              setShowLocationDropdown(false); // Close location dropdown if open
            }}
            className={`flex items-center bg-surface rounded-xl px-4 py-3 border transition-colors cursor-pointer ${showCalendar === 'end' ? 'border-primary' : 'border-border-color hover:border-primary/50'}`}
          >
            <CalendarIcon className={endDate ? "text-primary mr-3" : "text-text-muted mr-3"} size={18} />
            <span className={endDate ? "text-text-main" : "text-text-muted"}>
              {formatDate(endDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Custom Calendar Popup */}
      {showCalendar && (
        <div ref={calendarRef} className="absolute z-50 mt-2 w-full glass-card rounded-2xl p-4 border border-border-color shadow-2xl animate-fade-in top-20">
          <div className="flex justify-between items-center mb-4">
            <button type="button" onClick={prevMonth} className="p-2 hover:bg-surface rounded-lg transition-colors text-text-muted hover:text-text-main">
              <ChevronLeft size={20} />
            </button>
            <span className="font-bold">
              {currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </span>
            <button type="button" onClick={nextMonth} className="p-2 hover:bg-surface rounded-lg transition-colors text-text-muted hover:text-text-main">
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
              <span key={day} className="text-xs font-semibold text-text-muted">{day}</span>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const disabled = isPast(day) && (!startDate || showCalendar === 'start');
              const selected = isSelected(day);
              const inRange = isRangeMiddle(day);
              
              return (
                <button
                  type="button"
                  key={day}
                  disabled={disabled}
                  onClick={() => handleDateSelect(day)}
                  className={`w-full aspect-square flex items-center justify-center rounded-lg text-sm transition-all
                    ${disabled ? 'opacity-20 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary'}
                    ${selected ? 'bg-primary text-white font-bold shadow-lg shadow-primary/30' : ''}
                    ${inRange && !selected ? 'bg-primary/10 text-primary font-medium' : ''}
                    ${!selected && !inRange && !disabled ? 'text-text-main bg-surface/30' : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-border-color text-xs text-center text-text-muted">
            Memilih: <span className="font-bold text-primary">{showCalendar === 'start' ? 'Tanggal Mulai' : 'Tanggal Selesai'}</span>
          </div>
        </div>
      )}

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-3 mt-4">
        <AlertCircle className="text-primary mt-0.5 shrink-0" size={18} />
        <p className="text-sm text-text-muted">Sistem akan mengecek ketersediaan secara real-time. Jika tersedia, Anda akan diarahkan ke form kelengkapan data.</p>
      </div>

      <button 
        type="submit" 
        onClick={(e) => {
          if (!startDate || !endDate) {
            e.preventDefault();
            alert("Harap pilih tanggal mulai dan selesai terlebih dahulu.");
          }
        }}
        className="btn-primary w-full py-4 rounded-xl text-center font-bold text-lg block mt-6"
      >
        Cek Ketersediaan & Lanjut
      </button>
    </form>
  );
}
