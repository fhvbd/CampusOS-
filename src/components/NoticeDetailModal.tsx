import React from 'react';
import { 
  X, 
  Calendar, 
  Building, 
  Paperclip, 
  Download, 
  Star, 
  CheckCircle2, 
  Plus, 
  ExternalLink,
  Share2,
  AlertCircle
} from 'lucide-react';
import { Notice } from '../types';

interface NoticeDetailModalProps {
  notice: Notice | null;
  isOpen?: boolean;
  onClose: () => void;
  onToggleStar: (id: string) => void;
  onToggleRead: (id: string) => void;
  onConvertToTask: (notice: Notice) => void;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({
  notice,
  isOpen = true,
  onClose,
  onToggleStar,
  onToggleRead,
  onConvertToTask,
}) => {
  if (!isOpen || !notice) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="glass-panel rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-white/80 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/60 bg-white/40 backdrop-blur-xl relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-all cursor-pointer active:scale-95"
          >
            <X className="h-4.5 w-4.5" />
          </button>

          <div className="space-y-2.5 pr-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/25 text-blue-700 shadow-2xs">
                {notice.category_name}
              </span>
              {notice.is_urgent && (
                <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-700 border border-rose-500/25 flex items-center gap-1 shadow-2xs">
                  <AlertCircle className="h-3 w-3" />
                  重要紧急
                </span>
              )}
              <span className="text-xs text-slate-400 font-medium">
                发布时间：{notice.publish_time}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {notice.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5 font-bold text-slate-700 glass-pill px-3 py-1">
                <Building className="h-3.5 w-3.5 text-blue-600" />
                {notice.source_department}
              </span>
              {notice.deadline && (
                <span className="flex items-center gap-1.5 font-black text-amber-800 bg-amber-500/15 border border-amber-500/25 px-3 py-1 rounded-xl shadow-2xs">
                  <Calendar className="h-3.5 w-3.5 text-amber-600" />
                  截止日期：{notice.deadline}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          {/* Executive Summary Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 space-y-1.5 backdrop-blur-xs shadow-2xs">
            <div className="text-xs font-black text-blue-900 flex items-center gap-1.5">
              <span>💡 智能提要与关键指引</span>
            </div>
            <p className="text-xs text-blue-950 font-medium leading-relaxed">
              {notice.summary}
            </p>
          </div>

          {/* Full Content */}
          <div className="whitespace-pre-line text-slate-800 space-y-3 font-normal leading-relaxed">
            {notice.content}
          </div>

          {/* Attachments Section */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div className="pt-4 border-t border-white/60 space-y-3">
              <h4 className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                <Paperclip className="h-4 w-4 text-slate-500" />
                <span>相关附件与申报模板 ({notice.attachments.length})</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {notice.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl glass-panel-interactive flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-800 truncate">
                        {att.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {att.size}
                      </div>
                    </div>

                    <a
                      href={att.url}
                      onClick={e => {
                        e.preventDefault();
                        alert(`已模拟下载附件：${att.name}`);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-500/15 rounded-xl shrink-0 transition-all cursor-pointer active:scale-95 shadow-2xs"
                      title="下载附件"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {notice.tags && notice.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[11px] text-slate-400 font-medium">标签：</span>
              {notice.tags.map(t => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 rounded-lg glass-pill text-slate-600 text-[11px] font-bold"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/60 bg-white/40 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleStar(notice.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border active:scale-95 ${
                notice.is_starred
                  ? 'bg-amber-500/20 text-amber-700 border-amber-500/30 hover:bg-amber-500/30'
                  : 'bg-white/70 text-slate-600 border-white/90 hover:bg-white'
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${notice.is_starred ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{notice.is_starred ? '已收藏' : '收藏'}</span>
            </button>

            <button
              onClick={() => onToggleRead(notice.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border active:scale-95 ${
                notice.is_read
                  ? 'bg-white/70 text-slate-600 border-white/90 hover:bg-white'
                  : 'bg-blue-500/20 text-blue-700 border-blue-500/30 hover:bg-blue-500/30'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{notice.is_read ? '标为未读' : '标为已读'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onConvertToTask(notice);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md shadow-indigo-500/25 border border-white/30 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>转为待办任务</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-slate-600 hover:bg-white/80 font-bold text-xs transition-colors cursor-pointer"
            >
              关闭
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
