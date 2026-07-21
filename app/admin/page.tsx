"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Bike,
  PieChart,
  Users,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeRentals: 0,
    fleetUtilization: 0,
    newCustomers: 0,
    totalBikes: 0,
    rentedBikes: 0,
    availableBikes: 0,
    maintenanceBikes: 0,
  });

  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // 1. Total Revenue
      const { data: allRevenue } = await supabase
        .from('bookings')
        .select('total_price')
        .in('status', ['confirmed', 'active', 'completed']);
      
      const totalRev = allRevenue?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0;

      // 2 & 3. Fleet Status & Active Rentals
      const { data: allMotors } = await supabase.from('motors').select('id, status');
      const totalBikes = allMotors?.length || 0;
      const rentedBikes = allMotors?.filter(m => m.status === 'rented').length || 0;
      const availableBikes = allMotors?.filter(m => m.status === 'available').length || 0;
      const maintenanceBikes = allMotors?.filter(m => m.status === 'maintenance').length || 0;
      
      const fleetUtilization = totalBikes > 0 ? Math.round((rentedBikes / totalBikes) * 100) : 0;

      // 4. New Customers (Last 7d)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: recentUsers } = await supabase
        .from('users')
        .select('id')
        .gte('created_at', sevenDaysAgo.toISOString())
        .eq('role', 'customer');
      
      const newCustomers = recentUsers?.length || 0;

      // 5. Recent Bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, booking_code, status, total_price, users(name), motors(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalRevenue: totalRev,
        activeRentals: rentedBikes,
        fleetUtilization,
        newCustomers,
        totalBikes,
        rentedBikes,
        availableBikes,
        maintenanceBikes,
      });

      if (bookings) {
        setRecentBookings(bookings);
      }
      
      setLoading(false);
    }
    
    fetchData();
  }, []);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const getInitials = (name: string) => {
    if (!name) return 'UN';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-[#e6e8ff] text-[#4648d4] px-3 py-1 rounded-full text-xs font-bold">Active</span>;
      case 'completed':
        return <span className="bg-[#e0f7fa] text-[#00838f] px-3 py-1 rounded-full text-xs font-bold">Completed</span>;
      case 'pending_payment':
      case 'awaiting_verification':
        return <span className="bg-[#fce4ec] text-[#c2185b] px-3 py-1 rounded-full text-xs font-bold">Pending</span>;
      case 'confirmed':
        return <span className="bg-[#e8f5e9] text-[#2e7d32] px-3 py-1 rounded-full text-xs font-bold">Confirmed</span>;
      default:
        return <span className="bg-surface text-text-muted border border-border-color px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  // Calculate SVG circle properties for donut chart
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate dash arrays
  const rentedPercent = stats.totalBikes > 0 ? stats.rentedBikes / stats.totalBikes : 0;
  const availablePercent = stats.totalBikes > 0 ? stats.availableBikes / stats.totalBikes : 0;
  const maintenancePercent = stats.totalBikes > 0 ? stats.maintenanceBikes / stats.totalBikes : 0;

  const rentedDash = rentedPercent * circumference;
  const availableDash = availablePercent * circumference;
  const maintenanceDash = maintenancePercent * circumference;

  const rentedOffset = 0;
  const availableOffset = -rentedDash;
  const maintenanceOffset = -(rentedDash + availableDash);

  return (
    <div className="p-8">
      {/* 4 Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Revenue */}
        <div className="glass-card rounded-3xl p-6 border border-border-color bg-white flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-[#e0f7fa] text-[#00838f] flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <div className="bg-[#f3e5f5] text-[#8e24aa] px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
              <TrendingUp size={12} /> +12%
            </div>
          </div>
          <div>
            <p className="text-text-muted text-xs font-medium tracking-wide">Total Revenue</p>
            <h3 className="text-2xl font-bold mt-1 text-primary">{formatRupiah(stats.totalRevenue)}</h3>
          </div>
        </div>

        {/* Active Rentals */}
        <div className="glass-card rounded-3xl p-6 border border-border-color bg-white flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-[#e8eaf6] text-[#3f51b5] flex items-center justify-center">
              <Bike size={20} />
            </div>
            <p className="text-text-muted text-xs font-medium">Current</p>
          </div>
          <div>
            <p className="text-text-muted text-xs font-medium tracking-wide">Active Rentals</p>
            <h3 className="text-2xl font-bold mt-1 text-primary">
              {stats.activeRentals} <span className="text-sm font-medium text-text-muted normal-case">bikes</span>
            </h3>
          </div>
        </div>

        {/* Fleet Utilization */}
        <div className="glass-card rounded-3xl p-6 border border-border-color bg-white flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-[#fce4ec] text-[#c2185b] flex items-center justify-center">
              <PieChart size={20} />
            </div>
            <div className="w-8 h-1 bg-[#00677f] rounded-full mt-2"></div>
          </div>
          <div>
            <p className="text-text-muted text-xs font-medium tracking-wide">Fleet Utilization</p>
            <h3 className="text-2xl font-bold mt-1 text-primary">{stats.fleetUtilization}%</h3>
          </div>
        </div>

        {/* New Customers */}
        <div className="glass-card rounded-3xl p-6 border border-border-color bg-white flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-[#e0f2f1] text-[#00695c] flex items-center justify-center">
              <Users size={20} />
            </div>
            <p className="text-text-muted text-xs font-medium">Last 7d</p>
          </div>
          <div>
            <p className="text-text-muted text-xs font-medium tracking-wide">New Customers</p>
            <h3 className="text-2xl font-bold mt-1 text-primary">{stats.newCustomers}</h3>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Recent Bookings Table */}
        <div className="xl:col-span-2 glass-card rounded-3xl p-8 border border-border-color bg-white">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-primary font-heading">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-sm font-bold text-[#00838f] hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-color/50 text-text-muted text-sm font-medium">
                  <th className="pb-4">Order ID</th>
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Bike Model</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color/30">
                {recentBookings.length > 0 ? recentBookings.map((b) => (
                  <tr key={b.id} className="group">
                    <td className="py-5 font-mono text-sm text-[#00838f] font-medium">#{b.booking_code}</td>
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#e8eaf6] text-[#3f51b5] flex items-center justify-center text-xs font-bold shrink-0">
                          {getInitials(b.users?.name || 'Unknown')}
                        </div>
                        <span className="font-medium text-primary text-sm whitespace-nowrap">{b.users?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-5 text-sm text-text-muted">{b.motors?.name}</td>
                    <td className="py-5">{getStatusBadge(b.status)}</td>
                    <td className="py-5 text-right font-bold text-primary text-sm whitespace-nowrap">{formatRupiah(b.total_price)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-text-muted">No recent bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fleet Status Donut Chart */}
        <div className="glass-card rounded-3xl p-8 border border-border-color bg-white flex flex-col items-center justify-between">
          <h2 className="text-2xl font-bold text-primary font-heading w-full text-left mb-4">Fleet Status</h2>
          
          <div className="relative w-48 h-48 mb-6">
            <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
              <circle
                cx="80" cy="80" r="60"
                fill="none"
                stroke="#e8eaf6"
                strokeWidth="16"
              />
              {/* Rented */}
              {stats.rentedBikes > 0 && (
                <circle
                  cx="80" cy="80" r="60"
                  fill="none"
                  stroke="#4648d4"
                  strokeWidth="16"
                  strokeDasharray={`${rentedDash} ${circumference}`}
                  strokeDashoffset={rentedOffset}
                  className="transition-all duration-1000 ease-out"
                />
              )}
              {/* Available */}
              {stats.availableBikes > 0 && (
                <circle
                  cx="80" cy="80" r="60"
                  fill="none"
                  stroke="#00677f"
                  strokeWidth="16"
                  strokeDasharray={`${availableDash} ${circumference}`}
                  strokeDashoffset={availableOffset}
                  className="transition-all duration-1000 ease-out"
                />
              )}
              {/* Maintenance */}
              {stats.maintenanceBikes > 0 && (
                <circle
                  cx="80" cy="80" r="60"
                  fill="none"
                  stroke="#cfdaf2"
                  strokeWidth="16"
                  strokeDasharray={`${maintenanceDash} ${circumference}`}
                  strokeDashoffset={maintenanceOffset}
                  className="transition-all duration-1000 ease-out"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-primary font-heading">{stats.totalBikes}</span>
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Total Bikes</span>
            </div>
          </div>

          <div className="w-full space-y-4 mb-8">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#4648d4]"></div>
                <span className="font-medium text-text-muted">Rented</span>
              </div>
              <span className="font-bold text-primary">{stats.rentedBikes}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#00677f]"></div>
                <span className="font-medium text-text-muted">Available</span>
              </div>
              <span className="font-bold text-primary">{stats.availableBikes}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#cfdaf2]"></div>
                <span className="font-medium text-text-muted">Maintenance</span>
              </div>
              <span className="font-bold text-primary">{stats.maintenanceBikes}</span>
            </div>
          </div>

          <Link href="/admin/fleet" className="w-full mt-auto">
            <button className="w-full py-3 rounded-full border border-border-color text-[#00677f] font-bold hover:bg-surface-hover transition-colors text-sm">
              Manage Inventory
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
