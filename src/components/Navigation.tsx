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
      {/* Desktop Top Sub-Navbar */}
      <div className="hidden md:block bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          <nav className="flex space-x-1 py-1.5" aria-label="Main Navigation">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-desktop-${tab.id}`}
                  onClick={() => onSelectTab(tab.id)}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer select-none',
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  <Icon className={cn('h-4 w-4 transition-transform', isActive && 'text-blue-600 scale-110')} />
                  <span>{tab.label}</span>

                  {tab.badge !== null && (
                    <span
                      className={cn(
                        'ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white leading-none',
                        tab.badgeColor || 'bg-slate-400'
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}

                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Fixed Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg px-2 py-1.5">
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
                  'flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative',
                  isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                )}
              >
                <div className="relative">
                  <Icon className={cn('h-5 w-5 transition-transform', isActive && 'scale-115 text-blue-600')} />
                  {tab.badge !== null && (
                    <span
                      className={cn(
                        'absolute -top-1.5 -right-2.5 px-1 py-0.2 rounded-full text-[9px] font-extrabold text-white leading-tight min-w-3.5 text-center',
                        tab.badgeColor || 'bg-slate-400'
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
