import React from 'react';
import { 
  Home, 
  CalendarDays, 
  Bell, 
  Sparkles, 
  User, 
  CheckSquare
} from 'lucide-react';
import { TabType } from '../types';
import { cn } from '../lib/utils';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unreadNoticeCount: number;
  pendingTaskCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  unreadNoticeCount,
  pendingTaskCount,
}) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: '首页',
      icon: Home,
      badge: pendingTaskCount > 0 ? pendingTaskCount : null,
      badgeColor: 'bg-blue-500',
    },
    {
      id: 'schedule' as TabType,
      label: '课表',
      icon: CalendarDays,
      badge: null,
    },
    {
      id: 'notice' as TabType,
      label: '通知',
      icon: Bell,
      badge: unreadNoticeCount > 0 ? unreadNoticeCount : null,
      badgeColor: 'bg-rose-500',
    },
    {
      id: 'ai' as TabType,
      label: 'AI助手',
      icon: Sparkles,
      badge: 'PRO',
      badgeColor: 'bg-purple-600',
    },
    {
      id: 'profile' as TabType,
      label: '我的',
      icon: User,
      badge: null,
    },
  ];

  return (
    <>
      {/* Desktop Top Sub-Navbar (Liquid Glass Dock) */}
      <div className="hidden md:block sticky top-[61px] z-20 py-2">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="glass-panel rounded-2xl px-2 py-1.5 flex items-center justify-between shadow-xs">
            <nav className="flex space-x-1" aria-label="Main Navigation">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`nav-desktop-${tab.id}`}
                    onClick={() => onSelectTab(tab.id)}
                    className={cn(
                      'relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none',
                      isActive
                        ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 border border-white/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    )}
                  >
                    <Icon className={cn('h-4 w-4 transition-transform', isActive ? 'text-white scale-105' : 'text-slate-500')} />
                    <span>{tab.label}</span>

                    {tab.badge !== null && (
                      <span
                        className={cn(
                          'ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none border',
                          isActive 
                            ? 'bg-white/25 text-white border-white/40' 
                            : cn(tab.badgeColor || 'bg-slate-400', 'text-white border-transparent')
                        )}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right side quick indicator */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 pr-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>CampusOS 液态玻璃引擎活跃中</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Fixed Tab Bar (Liquid Glass Dock) */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-40">
        <div className="glass-dark rounded-2xl shadow-2xl p-1.5 border border-white/20 backdrop-blur-2xl">
          <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-mobile-${tab.id}`}
                  onClick={() => onSelectTab(tab.id)}
                  className={cn(
                    'flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer relative',
                    isActive 
                      ? 'bg-white/20 text-white font-bold shadow-xs border border-white/30' 
                      : 'text-slate-300 hover:text-white'
                  )}
                >
                  <div className="relative">
                    <Icon className={cn('h-4.5 w-4.5 transition-transform', isActive && 'scale-110 text-blue-300')} />
                    {tab.badge !== null && (
                      <span
                        className={cn(
                          'absolute -top-1.5 -right-2.5 px-1 py-0.2 rounded-full text-[9px] font-black text-white leading-tight min-w-3.5 text-center shadow-xs border border-slate-900',
                          tab.badgeColor || 'bg-slate-500'
                        )}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
