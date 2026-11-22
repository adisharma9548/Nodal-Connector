import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useAuth } from '../../hooks/useAuth';
import { Bell, Check, Trash2, ExternalLink, Calendar, Briefcase, Award, ShieldAlert, Sparkles, CheckCheck } from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { notifications, fetchNotifications, markAsRead, markAllAsRead, clearAll, isLoading } = useNotificationStore();
  const [filter, setFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const isAdmin = user?.role === 'admin';

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'application': return Briefcase;
      case 'mentorship': return Calendar;
      case 'match': return Award;
      case 'alert': return ShieldAlert;
      case 'achievement': return Sparkles;
      default: return isAdmin ? Sparkles : ShieldAlert;
    }
  };

  const tabs = isAdmin
    ? [
        { key: 'all', label: `All Alerts (${notifications.length})` },
        { key: 'unread', label: `Unread (${notifications.filter((n) => !n.read).length})` },
        { key: 'alert', label: 'Accreditation Actions' },
        { key: 'system', label: 'System & MoUs' },
        { key: 'achievement', label: 'Scholar Rosters' },
      ]
    : [
        { key: 'all', label: `All Updates (${notifications.length})` },
        { key: 'unread', label: `Unread (${notifications.filter((n) => !n.read).length})` },
        { key: 'application', label: 'Applications' },
        { key: 'match', label: 'Skill Matches' },
        { key: 'mentorship', label: 'Mentorship' },
        { key: 'system', label: 'System' },
      ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isAdmin ? 'Administrative Alerts & System Oversight' : 'Notification Center'}
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAdmin
              ? 'Real-time administrative oversight regarding employer accreditations, MoU proposals, scholar registries, and platform security'
              : 'Real-time updates regarding your applications, interview invites, and skill recommendations'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => markAllAsRead()}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Mark All as Read</span>
          </button>
          <button
            type="button"
            onClick={() => clearAll()}
            className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto p-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              filter === tab.key
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading notifications...</p>
          </div>
        ) : filteredNotifs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Notifications</h3>
            <p className="text-xs text-slate-400 mt-1">You are completely up to date.</p>
          </div>
        ) : (
          filteredNotifs.map((n) => {
            const Icon = getIcon(n.type);
            return (
              <div
                key={n.id}
                className={`p-5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-start justify-between gap-4 ${
                  !n.read
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/20'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    !n.read
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      )}
                      <Badge variant="slate" size="sm">
                        {n.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[11px] text-slate-400 mt-2 block">{n.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {n.link && (
                    <button
                      onClick={() => {
                        markAsRead(n.id);
                        navigate(n.link!);
                      }}
                      className="p-2 text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="p-2 text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                      title="Mark as Read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
