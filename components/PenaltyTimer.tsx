"use client";

import { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { PENALTY, APP_CONFIG } from "@/constants";

export default function PenaltyTimer({ endDateStr }: { endDateStr: string }) {
  const [timeLeft, setTimeLeft] = useState<{ isLate: boolean, days: number, hours: number, minutes: number, seconds: number, penalty: number } | null>(null);

  useEffect(() => {
    // Deadline is strictly from config on the end_date
    const datePart = endDateStr.split('T')[0];
    const deadline = new Date(`${datePart}T${APP_CONFIG.DEADLINE_HOUR}`).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      let diff = deadline - now;
      let isLate = false;
      let penalty = 0;

      if (diff < 0) {
        isLate = true;
        diff = Math.abs(diff);
        const minutesLate = Math.floor(diff / (1000 * 60));
        penalty = Math.floor(minutesLate / PENALTY.INTERVAL_MINUTES) * PENALTY.LATE_FEE_PER_INTERVAL;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ isLate, days, hours, minutes, seconds, penalty });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000); // update every 1 second
    return () => clearInterval(interval);
  }, [endDateStr]);

  if (!timeLeft) return null;

  if (timeLeft.isLate) {
    return (
      <div className="flex flex-col gap-1 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 w-full animate-fade-in">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertTriangle size={16} />
          <span>Waktu Pengembalian Terlewat!</span>
        </div>
        <p className="text-xs">
          Terlambat: {timeLeft.days > 0 ? `${timeLeft.days} hari ` : ''}{timeLeft.hours} jam {timeLeft.minutes} menit {timeLeft.seconds} detik
        </p>
        <p className="text-sm font-bold mt-1 text-red-700">Estimasi Denda: Rp {timeLeft.penalty.toLocaleString('id-ID')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 w-full animate-fade-in">
      <div className="flex items-center gap-2 font-bold text-sm">
        <Clock size={16} />
        <span>Sisa Waktu Sewa</span>
      </div>
      <p className="text-xs">
        {timeLeft.days > 0 ? `${timeLeft.days} hari ` : ''}{timeLeft.hours} jam {timeLeft.minutes} menit {timeLeft.seconds} detik menuju deadline (09:00 WIB)
      </p>
    </div>
  );
}
