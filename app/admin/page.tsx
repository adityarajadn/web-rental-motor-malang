"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle,
  AlertTriangle,
  Key,
  DollarSign,
  Calendar,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookingsToday: 0,
    awaitingVerification: 0,
    activeMotors: 0,
    totalRevenue: 0,
  });
  
  const [verifications, setVerifications] = useState<any[]>([]);
  const [handovers, setHandovers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 1. Bookings today
      const { data: todayBookings } = await supabase
        .from('bookings')
        .select('id')
        .gte('created_at', today.toISOString());
      
      // 2. Awaiting verification
      const { data: awaitings } = await supabase
        .from('bookings')
        .select(`id, booking_code, users(name)`)
        .eq('status', 'awaiting_verification');

      // 3. Active motors
      const { data: actives } = await supabase
        .from('bookings')
        .select('id')
        .eq('status', 'active');
      
      // 4. Revenue (simple calculation from completed/active/confirmed)
      const { data: allRevenue } = await supabase
        .from('bookings')
        .select('total_price')
        .in('status', ['confirmed', 'active', 'completed']);
      
      const totalRev = allRevenue?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0;

      setStats({
        totalBookingsToday: todayBookings?.length || 0,
        awaitingVerification: awaitings?.length || 0,
        activeMotors: actives?.length || 0,
        totalRevenue: totalRev
      });

      if (awaitings) {
        setVerifications(awaitings.slice(0, 5));
      }

      // 5. Handovers (mocking schedule based on confirmed/active)
      const { data: scheds } = await supabase
        .from('bookings')
        .select(`id, booking_code, pickup_location, dropoff_location, start_date, end_date, motors(name, license_plate), users(name)`)
        .in('status', ['confirmed', 'active'])
        .limit(5);
        
      if (scheds) {
        setHandovers(scheds);
      }
      
      setLoading(false);
    }
    
    fetchData();
  }, []);

  const handleVerifikasi = async (idToProcess: string, action: 'approve'|'reject') => {
    if (action === 'approve') {
      await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', idToProcess);
    } else {
      await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', idToProcess);
    }
    setVerifications((prev) => prev.filter((v) => v.id !== idToProcess));
    setStats(prev => ({...prev, awaitingVerification: prev.awaitingVerification - 1}));
  };

  const formatRupiah = (num: number) => {
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)}Jt`;
    if (num >= 1000) return `Rp ${(num / 1000).toFixed(0)}K`;
    return `Rp ${num}`;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">Dashboard</h1>
          <p className="text-text-muted">
            Ringkasan aktivitas rental hari ini.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card rounded-2xl p-6 border border-border-color">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-text-muted text-sm font-medium">
                Total Booking Hari Ini
              </p>
              <h3 className="text-3xl font-bold mt-1">{stats.totalBookingsToday}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
              <Calendar size={20} />
            </div>
          </div>
          <p className="text-accent text-sm flex items-center gap-1 font-medium">
            <CheckCircle size={14} /> +3 dari kemarin
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-border-color">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-text-muted text-sm font-medium">
                Menunggu Verifikasi
              </p>
              <h3 className="text-3xl font-bold mt-1 text-secondary">
                {stats.awaitingVerification}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="text-text-muted text-sm font-medium">
            Perlu tindakan segera
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-border-color">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-text-muted text-sm font-medium">
                Motor Keluar
              </p>
              <h3 className="text-3xl font-bold mt-1">{stats.activeMotors}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center">
              <Key size={20} />
            </div>
          </div>
          <p className="text-text-muted text-sm font-medium">
            Dari total 45 armada
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-border-color">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-text-muted text-sm font-medium">
                Pendapatan (Bulan Ini)
              </p>
              <h3 className="text-3xl font-bold mt-1">{formatRupiah(stats.totalRevenue)}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-accent text-sm flex items-center gap-1 font-medium">
            <CheckCircle size={14} /> +12% dari bulan lalu
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Jadwal Pengambilan/Pengembalian (Step 8 & 9) */}
        <div className="glass-card rounded-3xl p-6 border border-border-color">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-heading">
              Jadwal Serah Terima Hari Ini
            </h2>
            <Link
              href="/admin/handovers"
              className="text-primary text-sm font-medium hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="space-y-4">
            {handovers.length > 0 ? handovers.map((h, i) => (
              <div key={h.id} className="bg-surface rounded-xl p-4 border border-border-color flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-12 ${i % 2 === 0 ? 'bg-accent' : 'bg-secondary'} rounded-full`}></div>
                  <div>
                    <h4 className="font-bold">{h.motors?.name} ({h.motors?.license_plate})</h4>
                    <p className="text-sm text-text-muted">
                      {h.users?.name} • {i % 2 === 0 ? `Ambil di ${h.pickup_location}` : `Kembali di ${h.dropoff_location}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`${i % 2 === 0 ? 'bg-accent/20 text-accent' : 'bg-secondary/20 text-secondary'} px-3 py-1 rounded-full text-xs font-bold inline-block mb-2`}>
                    {i % 2 === 0 ? 'PENGAMBILAN' : 'PENGEMBALIAN'}
                  </span>
                  <p className="text-sm font-bold">{new Date(h.start_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} • 09:00 WIB</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-6 text-text-muted">Tidak ada jadwal serah terima.</div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}
