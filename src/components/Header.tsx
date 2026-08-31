import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  RefreshCw, 
  Search, 
  Bell, 
  CheckCircle2, 
  Sparkles,
  Wifi
} from 'lucide-react';
import { UserProfile, AppSettings } from '../types';
import { getFullDayName } from '../lib/utils';

interface HeaderProps {
  user: UserProfile;
  settings: AppSettings;
  unreadNoticeCount: number;
  pendingTaskCount: number;
  onRefreshSync: () => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  onOpenNotice: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  settings,
  unreadNoticeCount,
  pendingTaskCount,
  onRefreshSync,
  onOpenSearch,
  onOpenProfile,
  onOpenNotice,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    onRefreshSync();
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const today = new Date();
  const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
  const dateFormatted = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 lg:px-8 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand & University Info */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm ring-1 ring-blue-500/20 shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
                CampusOS
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                  AI v1.0
                </span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              {user.university} · {user.college}
            </p>
          </div>
        </div>

        {/* Center: Semester Week & Clock Widget */}
        <div className="hidden md:flex items-center gap-4 bg-slate-50 border border-slate-200/80 rounded-full px-4 py-1.5 text-xs text-slate-700 shadow-2xs">
          <div className="flex items-center gap-1.5 font-semibold text-blue-700">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            <span>第 {settings.current_week} 周</span>
            <span className="text-slate-300">|</span>
            <span>{getFullDayName(dayOfWeek)}</span>
          </div>

          <span className="text-slate-300">·</span>

          <div className="flex items-center gap-1.5 text-slate-600">
            <span>{dateFormatted}</span>
          </div>

          <span className="text-slate-300">·</span>

          <div className="flex items-center gap-1 font-mono text-slate-800 font-medium">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{timeStr || '08:00:00'}</span>
          </div>
        </div>

        {/* Right: Quick Search, System Status, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search Button */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs font-medium transition-colors cursor-pointer border border-slate-200/60"
            title="快捷搜索课程、通知、待办"
          >
            <Search className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">全局搜索</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-white rounded text-[10px] text-slate-400 border border-slate-200 font-mono">
              Ctrl+K
            </kbd>
          </button>

          {/* Sync Trigger */}
          <button
            id="header-sync-btn"
            onClick={handleSync}
            disabled={isSyncing}
            className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 cursor-pointer"
            title="同步教务与校园数据"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Notifications Trigger */}
          <button
            id="header-notice-btn"
            onClick={onOpenNotice}
            className="relative p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 cursor-pointer"
            title="通知中心"
          >
            <Bell className="h-4 w-4" />
            {unreadNoticeCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                {unreadNoticeCount > 9 ? '9+' : unreadNoticeCount}
              </span>
            )}
          </button>

          {/* User Profile Mini Badge */}
          <button
            id="header-profile-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/70 transition-all cursor-pointer group"
          >
            <div className="text-right hidden sm:block leading-tight">
              <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                {user.username}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {user.student_id}
              </div>
            </div>
            <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              {user.username.slice(0, 1)}
            </div>
          </button>

        </div>
      </div>
    </header>
  );
};
