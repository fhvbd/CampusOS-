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
    <div className="space-y-6 pb-12">
      
      {/* 1. Header & Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-extrabold text-xl text-slate-900 flex items-center gap-2">
              <span>校园通知与信息雷达</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                实时聚合中
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              自动聚合学校综合教务系统、学工在线、各学院官网及就业指导中心信息。
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="notice-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索通知标题、正文、发布部门..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`notice-cat-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all',
                  isActive
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-extrabold',
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                  )}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Filter Toggles */}
        <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
          <label className="flex items-center gap-1.5 cursor-pointer font-medium select-none hover:text-slate-900">
            <input
              type="checkbox"
              checked={onlyUnread}
              onChange={e => setOnlyUnread(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
            />
            <span>仅看未读 ({notices.filter(n => !n.is_read).length})</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer font-medium select-none hover:text-slate-900">
            <input
              type="checkbox"
              checked={onlyStarred}
              onChange={e => setOnlyStarred(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-500 h-3.5 w-3.5"
            />
            <span>已收藏 ({notices.filter(n => n.is_starred).length})</span>
          </label>
        </div>

      </div>

      {/* 2. Notice Cards List */}
      <div className="space-y-3">
        {filteredNotices.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3 shadow-2xs">
            <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="h-6 w-6" />
            </div>
            <div className="font-bold text-slate-700">未找到匹配的通知公告</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              尝试清除搜索关键词或切换分类筛选。
            </p>
          </div>
        ) : (
          filteredNotices.map(notice => (
            <div
              key={notice.id}
              className={cn(
                'group bg-white rounded-2xl p-5 border transition-all hover:shadow-md relative overflow-hidden',
                notice.is_read ? 'border-slate-200' : 'border-blue-200/90 shadow-2xs bg-blue-50/20'
              )}
            >
              {/* Unread dot indicator on top left corner */}
              {!notice.is_read && (
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
              )}

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                
                {/* Main Content */}
                <div
                  onClick={() => onSelectNotice(notice)}
                  className="flex-1 min-w-0 cursor-pointer space-y-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {notice.category_name}
                    </span>

                    {notice.is_urgent && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        紧急通知
                      </span>
                    )}

                    {notice.tags?.map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-50 text-slate-500 border border-slate-200">
                        #{t}
                      </span>
                    ))}

                    <span className="text-xs text-slate-400 ml-auto sm:ml-0">
                      {notice.publish_time}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {notice.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Building className="h-3 w-3 text-slate-400" />
                      {notice.source_department}
                    </span>

                    {notice.attachment_count ? (
                      <span className="flex items-center gap-1 text-blue-600 font-medium">
                        <Paperclip className="h-3 w-3" />
                        {notice.attachment_count} 个附件
                      </span>
                    ) : null}

                    {notice.deadline && (
                      <span className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                        <Calendar className="h-3 w-3 text-amber-600" />
                        截止时间：{notice.deadline}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {/* Star toggle */}
                    <button
                      id={`notice-star-${notice.id}`}
                      onClick={() => onToggleStar(notice.id)}
                      className={cn(
                        'p-2 rounded-lg transition-colors cursor-pointer',
                        notice.is_starred
                          ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                          : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
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
                        'p-2 rounded-lg transition-colors cursor-pointer text-xs font-semibold',
                        notice.is_read
                          ? 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
                          : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                      )}
                      title={notice.is_read ? '标为未读' : '标为已读'}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Add to task action */}
                  <button
                    onClick={() => onConvertNoticeToTask(notice)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer"
                    title="将此通知的截止事项转为待办任务"
                  >
                    <Plus className="h-3.5 w-3.5" />
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
