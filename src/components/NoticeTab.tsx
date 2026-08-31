import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Paperclip, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ExternalLink, 
  Sparkles, 
  Plus, 
  Bookmark, 
  ArrowUpDown,
  Building,
  GraduationCap,
  TrendingUp,
  Compass
} from 'lucide-react';
import { Notice, NoticeCategory } from '../types';
import { cn } from '../lib/utils';

interface NoticeTabProps {
  notices: Notice[];
  onSelectNotice: (notice: Notice) => void;
  onToggleStar: (noticeId: string) => void;
  onToggleRead: (noticeId: string) => void;
  onConvertNoticeToTask: (notice: Notice) => void;
}

export const NoticeTab: React.FC<NoticeTabProps> = ({
  notices,
  onSelectNotice,
  onToggleStar,
  onToggleRead,
  onConvertNoticeToTask,
}) => {
  const [activeCategory, setActiveCategory] = useState<NoticeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [onlyStarred, setOnlyStarred] = useState(false);

  const categories: { id: NoticeCategory; label: string; icon: any; count: number }[] = [
    { id: 'all', label: '全部通知', icon: Building, count: notices.length },
    { id: 'academic', label: '教务处', icon: GraduationCap, count: notices.filter(n => n.category === 'academic').length },
    { id: 'college', label: '学院公告', icon: Building, count: notices.filter(n => n.category === 'college').length },
    { id: 'scholarship', label: '奖学金雷达', icon: TrendingUp, count: notices.filter(n => n.category === 'scholarship').length },
    { id: 'internship', label: '实习就业雷达', icon: Compass, count: notices.filter(n => n.category === 'internship').length },
    { id: 'competition', label: '学科竞赛', icon: Star, count: notices.filter(n => n.category === 'competition').length },
  ];

  // Filtering
  const filteredNotices = notices.filter(n => {
    if (activeCategory !== 'all' && n.category !== activeCategory) return false;
    if (onlyUnread && n.is_read) return false;
    if (onlyStarred && !n.is_starred) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchSummary = n.summary.toLowerCase().includes(q);
      const matchSource = n.source_department.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchSource) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      
      {/* 1. Header & Search Bar (Liquid Glass Container) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h2 className="font-black text-xl sm:text-2xl text-slate-900 flex items-center gap-3">
              <span>校园通知与信息雷达</span>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-500/15 text-blue-700 border border-blue-500/25 backdrop-blur-xs">
                实时聚合中
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
              自动聚合学校综合教务系统、学工在线、各学院官网及就业指导中心信息。
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-88">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <input
              id="notice-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索通知标题、正文、发布部门..."
              className="w-full pl-11 pr-10 py-3 bg-white/70 backdrop-blur-md border border-white/90 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-3 border-t border-white/60">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`notice-cat-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex items-center gap-2.5 px-4.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95 shrink-0',
                  isActive
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 border border-white/30'
                    : 'glass-panel text-slate-600 hover:text-slate-900 hover:bg-white/90'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{cat.label}</span>
                <span
                  className={cn(
                    'text-[10px] px-2.5 py-0.5 rounded-full font-black',
                    isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-slate-600'
                  )}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Filter Toggles */}
        <div className="flex items-center gap-6 text-xs sm:text-sm text-slate-600 pt-1">
          <label className="flex items-center gap-2 cursor-pointer font-bold select-none hover:text-slate-900">
            <input
              type="checkbox"
              checked={onlyUnread}
              onChange={e => setOnlyUnread(e.target.checked)}
              className="rounded-md text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
            />
            <span>仅看未读 ({notices.filter(n => !n.is_read).length})</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-bold select-none hover:text-slate-900">
            <input
              type="checkbox"
              checked={onlyStarred}
              onChange={e => setOnlyStarred(e.target.checked)}
              className="rounded-md text-amber-500 focus:ring-amber-500 h-4 w-4 cursor-pointer"
            />
            <span>已收藏 ({notices.filter(n => n.is_starred).length})</span>
          </label>
        </div>

      </div>

      {/* 2. Notice Cards List */}
      <div className="space-y-4 sm:space-y-5">
        {filteredNotices.length === 0 ? (
          <div className="glass-panel rounded-3xl p-14 text-center space-y-4 shadow-2xs">
            <div className="h-14 w-14 rounded-2xl bg-slate-500/10 text-slate-500 flex items-center justify-center mx-auto backdrop-blur-xs">
              <Search className="h-7 w-7" />
            </div>
            <div className="font-black text-base text-slate-700">未找到匹配的通知公告</div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto font-medium">
              尝试清除搜索关键词或切换分类筛选。
            </p>
          </div>
        ) : (
          filteredNotices.map(notice => (
            <div
              key={notice.id}
              className={cn(
                'group glass-panel-interactive rounded-3xl p-6 sm:p-7 transition-all relative overflow-hidden shadow-xs',
                !notice.is_read && 'bg-blue-500/10 border-blue-400/40 shadow-blue-500/5'
              )}
            >
              {/* Unread dot indicator on top left corner */}
              {!notice.is_read && (
                <div className="absolute top-0 left-0 w-2.5 h-full bg-linear-to-b from-blue-500 to-indigo-600 shadow-sm" />
              )}

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                
                {/* Main Content */}
                <div
                  onClick={() => onSelectNotice(notice)}
                  className="flex-1 min-w-0 cursor-pointer space-y-3"
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[11px] font-black px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 border border-blue-500/20">
                      {notice.category_name}
                    </span>

                    {notice.is_urgent && (
                      <span className="text-[11px] font-black px-3 py-1 rounded-full bg-rose-500/15 text-rose-700 border border-rose-500/25 flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        紧急通知
                      </span>
                    )}

                    {notice.tags?.map(t => (
                      <span key={t} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/80 text-slate-600 border border-slate-200/80">
                        #{t}
                      </span>
                    ))}

                    <span className="text-xs text-slate-400 font-mono ml-auto sm:ml-0 font-medium">
                      {notice.publish_time}
                    </span>
                  </div>

                  <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-medium">
                    {notice.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1.5">
                    <span className="flex items-center gap-1.5 font-bold text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-lg">
                      <Building className="h-3.5 w-3.5 text-slate-400" />
                      {notice.source_department}
                    </span>

                    {notice.attachment_count ? (
                      <span className="flex items-center gap-1.5 text-blue-600 font-bold bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100">
                        <Paperclip className="h-3.5 w-3.5" />
                        {notice.attachment_count} 个附件
                      </span>
                    ) : null}

                    {notice.deadline && (
                      <span className="flex items-center gap-1.5 text-amber-800 font-bold bg-amber-500/15 border border-amber-500/25 px-3 py-1 rounded-lg">
                        <Calendar className="h-3.5 w-3.5 text-amber-600" />
                        截止时间：{notice.deadline}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-white/60">
                  <div className="flex items-center gap-2">
                    {/* Star toggle */}
                    <button
                      id={`notice-star-${notice.id}`}
                      onClick={() => onToggleStar(notice.id)}
                      className={cn(
                        'p-2.5 rounded-2xl transition-all cursor-pointer border active:scale-90 shadow-2xs',
                        notice.is_starred
                          ? 'text-amber-500 bg-amber-500/15 border-amber-500/30'
                          : 'text-slate-400 hover:text-amber-500 bg-white/70 border-white/80'
                      )}
                      title={notice.is_starred ? '取消收藏' : '收藏通知'}
                    >
                      <Star className={cn('h-4 w-4', notice.is_starred && 'fill-amber-500')} />
                    </button>

                    {/* Mark read toggle */}
                    <button
                      id={`notice-read-${notice.id}`}
                      onClick={() => onToggleRead(notice.id)}
                      className={cn(
                        'p-2.5 rounded-2xl transition-all cursor-pointer text-xs font-bold border active:scale-90 shadow-2xs',
                        notice.is_read
                          ? 'text-slate-400 hover:text-blue-600 bg-white/70 border-white/80'
                          : 'text-blue-600 bg-blue-500/15 border-blue-500/30'
                      )}
                      title={notice.is_read ? '标为未读' : '标为已读'}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Add to task action */}
                  <button
                    onClick={() => onConvertNoticeToTask(notice)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-500/20 border border-white/30 transition-all cursor-pointer active:scale-95"
                    title="将此通知的截止事项转为待办任务"
                  >
                    <Plus className="h-4 w-4" />
                    <span>转为待办</span>
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
