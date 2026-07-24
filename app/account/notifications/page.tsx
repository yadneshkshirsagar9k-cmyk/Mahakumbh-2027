'use client';

/**
 * @file Notifications Page
 * @description Official Simhastha notification registry with journey-aware dynamic alerts.
 */

import { useState, useEffect } from 'react';
import { Bell, ShieldAlert, CloudRain, HeartPulse, Sparkles, MessageSquare, Check, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useJourneyStore } from '@/store/journey-store';

interface NotificationItem {
  id: string;
  category: 'government' | 'bookings' | 'emergency' | 'weather' | 'health' | 'personal';
  title: string;
  body: string;
  date: string;
  unread: boolean;
}

const CATEGORIES = [
  { id: 'all', label: 'All Alerts' },
  { id: 'government', label: 'Announcements' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'weather', label: 'Weather' },
  { id: 'health', label: 'Health' },
  { id: 'personal', label: 'Personal' },
];

export default function NotificationsPage() {
  const { journey } = useJourneyStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Base static notifications
    const alerts: NotificationItem[] = [
      { id: 'nt-w1', category: 'weather', title: 'Heavy Rainfall Warning', body: 'Maharashtra Met Department forecasts intermittent heavy showers in Nashik district over next 24 hours. Carry umbrella.', date: '1 Hour Ago', unread: true },
      { id: 'nt-g1', category: 'government', title: 'SIMHASTHA 2027 Guidelines PDF', body: 'The Chief Minister has officially released the pilgrim welfare handbook containing all route codes.', date: '1 Day Ago', unread: false },
      { id: 'nt-h1', category: 'health', title: 'Cholera Vaccination Desk', body: 'Get mock clearances and vaccination checks at Medical Screening Camp.', date: '2 Days Ago', unread: false },
    ];

    // Inject Journey-aware alerts
    if (journey) {
      const today = new Date().toISOString().split('T')[0];
      const tomDate = new Date();
      tomDate.setDate(tomDate.getDate() + 1);
      const tomorrow = tomDate.toISOString().split('T')[0];

      // Arrival Tomorrow
      if (journey.startDate === tomorrow) {
        alerts.unshift({
          id: 'nt-timeline-arrival',
          category: 'government',
          title: 'Arrival Tomorrow',
          body: `Prepare your luggage, identity clearances and border passes. Your Mahakumbh Journey commences tomorrow on ${journey.startDate}.`,
          date: 'Just Now',
          unread: true
        });
      }

      // Snan Tomorrow
      const tomorrowSnan = journey.snanBookings.find((b) => b.date === tomorrow);
      if (tomorrowSnan) {
        alerts.unshift({
          id: 'nt-timeline-snan-tom',
          category: 'bookings',
          title: 'Snan Tomorrow',
          body: `Your scheduled ritual bath bath at ${tomorrowSnan.ghatName} takes place tomorrow at ${tomorrowSnan.timeSlot}.`,
          date: 'Just Now',
          unread: true
        });
      }

      // Darshan Today
      const todayDarshan = journey.darshanBookings.find((b) => b.date === today);
      if (todayDarshan) {
        alerts.unshift({
          id: 'nt-timeline-darshan-today',
          category: 'bookings',
          title: 'Darshan Today',
          body: `Your timed shrine queue access for ${todayDarshan.templeName} is active today. Slot: ${todayDarshan.timeSlot}.`,
          date: 'Just Now',
          unread: true
        });
      }

      // Departure Tomorrow
      if (journey.endDate === tomorrow) {
        alerts.unshift({
          id: 'nt-timeline-dep-tom',
          category: 'government',
          title: 'Departure Tomorrow',
          body: `Your pilgrimage permit expires tomorrow on ${journey.endDate}. Check out from accommodation campgrounds and prepare vehicle passes.`,
          date: 'Just Now',
          unread: true
        });
      }

      // Journey Completed
      if (journey.journeyStatus === 'Journey Completed' || today > journey.endDate) {
        alerts.unshift({
          id: 'nt-timeline-completed',
          category: 'personal',
          title: 'Journey Completed',
          body: 'Thank you for registering Nashik-Trimbakeshwar Mahakumbh. Please download final registration documents and archive your journey.',
          date: 'Just Now',
          unread: true
        });
      }

      if (journey.snanBookings && journey.snanBookings.length > 0) {
        alerts.unshift({
          id: 'nt-snan-1',
          category: 'bookings',
          title: 'Tomorrow is your Snan',
          body: `Your ritual bath slot at ${journey.snanBookings[0].ghatName} is scheduled on ${journey.snanBookings[0].date}. Biometric entry token: ${journey.snanBookings[0].bookingCode}.`,
          date: 'Just Now',
          unread: true
        });
      }

      if (journey.darshanBookings && journey.darshanBookings.length > 0) {
        alerts.unshift({
          id: 'nt-dar-1',
          category: 'bookings',
          title: 'Your Darshan begins in two hours',
          body: `Pre-allocation pass at ${journey.darshanBookings[0].templeName} starts at ${journey.darshanBookings[0].timeSlot}. Keep QR Gatepass active.`,
          date: '5 Mins Ago',
          unread: true
        });
      }

      if (journey.selectedGhats && journey.selectedGhats.includes('Ramkund')) {
        alerts.unshift({
          id: 'nt-em-1',
          category: 'emergency',
          title: 'Heavy crowd at Ramkund',
          body: 'Advisory: High crowd density reported at Ramkund main ghat holds. Alternative route available via Laxman Kund.',
          date: '15 Mins Ago',
          unread: true
        });
      }

      if (journey.vehicleInfo && journey.vehicleInfo.vehicleNumber) {

      }
    } else {
      alerts.unshift({
        id: 'nt-register-warning',
        category: 'emergency',
        title: 'Register Your Mahakumbh Journey',
        body: 'Alert: Identity verification will remain pending until your primary Mahakumbh travel path registration is submitted.',
        date: 'Just Now',
        unread: true
      });
    }

    setNotifications(alerts);
  }, [journey]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const filtered = notifications.filter((n) =>
    activeTab === 'all' ? true : n.category === activeTab
  );

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'emergency':
        return <ShieldAlert className="text-red-500" size={16} />;
      case 'weather':
        return <CloudRain className="text-blue-500" size={16} />;
      case 'bookings':
        return <Sparkles className="text-amber-500" size={16} />;
      case 'health':
        return <HeartPulse className="text-emerald-500" size={16} />;
      case 'government':
        return <Bell className="text-[#005BAC]" size={16} />;
      default:
        return <MessageSquare className="text-stone-500" size={16} />;
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#111827] font-[var(--font-heading)]">
            Notification Center
          </h1>
          <p className="text-xs text-[#6B7280]">
            View government announcements, emergency alerts, and slot updates.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#005BAC] hover:bg-[#0F4C81] text-white text-[11px] font-bold uppercase tracking-wider rounded select-none cursor-pointer border-none outline-none"
          >
            <Check size={12} />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-1.5 border-b border-[#E5E7EB] pb-2 text-xs">
        {CATEGORIES.map((tab) => {
          const tabUnread = notifications.filter((n) => n.category === tab.id && n.unread).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-3 py-1.5 rounded transition-all font-semibold select-none cursor-pointer relative border-none bg-transparent',
                activeTab === tab.id
                  ? 'bg-[#005BAC] text-white'
                  : 'text-[#374151] hover:bg-[#F5F7FA]'
              )}
            >
              <span>{tab.label}</span>
              {/* Badge count */}
              {tab.id === 'all' && unreadCount > 0 && (
                <span className="ml-1.5 px-1 bg-[#FF9933] text-white text-[9px] font-bold rounded-full">{unreadCount}</span>
              )}
              {tab.id !== 'all' && tabUnread > 0 && (
                <span className="ml-1.5 px-1 bg-[#FF9933] text-white text-[9px] font-bold rounded-full">{tabUnread}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* List items */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm text-center">
            <Bell size={24} className="text-[#B0B0B0] mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#8A8A8A]">You're all caught up.</p>
            <p className="text-[10px] text-stone-400">No notifications found in this category.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={cn(
                'bg-white border rounded-xl p-4 shadow-sm flex items-start gap-4 transition-all',
                item.unread
                  ? 'border-[#005BAC] bg-[#F5F7FA]'
                  : 'border-[#E5E7EB]'
              )}
            >
              <div className="w-8 h-8 rounded-full bg-[#FAFBFC] flex items-center justify-center shrink-0 border border-[#E5E7EB]">
                {getIcon(item.category)}
              </div>

              <div className="space-y-1 flex-grow">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-extrabold text-xs text-[#111827]">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-[#8A8A8A] shrink-0 font-medium">{item.date}</span>
                </div>
                <p className="text-xs text-[#374151] leading-relaxed font-semibold">
                  {item.body}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  {item.unread && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-[#005BAC] hover:text-[#0F4C81] transition-colors cursor-pointer border-none bg-transparent"
                    >
                      <Eye size={10} />
                      <span>Mark as read</span>
                    </button>
                  )}
                  {item.category === 'emergency' && (
                    <a href="/account/dashboard" className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer bg-red-50 hover:bg-red-100 px-2 py-1 rounded">
                      View Live Map
                    </a>
                  )}
                  {item.category === 'bookings' && (
                    <a href="/account/manage-tour" className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded">
                      Manage Booking
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
