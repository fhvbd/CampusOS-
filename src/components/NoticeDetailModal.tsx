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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="space-y-2 pr-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                {notice.category_name}
              </span>
              {notice.is_urgent && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  重要紧急
                </span>
              )}
              <span className="text-xs text-slate-400">
                发布时间：{notice.publish_time}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
              {notice.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Building className="h-3.5 w-3.5 text-blue-600" />
                {notice.source_department}
              </span>
              {notice.deadline && (
                <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
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
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 space-y-1">
            <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <span>💡 智能提要与关键指引</span>
            </div>
            <p className="text-xs text-blue-950 font-medium leading-relaxed">
              {notice.summary}
            </p>
          </div>

          {/* Full Content */}
          <div className="whitespace-pre-line text-slate-800 space-y-3 font-normal">
            {notice.content}
          </div>

          {/* Attachments Section */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Paperclip className="h-4 w-4 text-slate-500" />
                <span>相关附件与申报模板 ({notice.attachments.length})</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {notice.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-800 truncate">
                        {att.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {att.size}
                      </div>
                    </div>

                    <a
                      href={att.url}
                      onClick={e => {
                        e.preventDefault();
                        alert(`已模拟下载附件：${att.name}`);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg shrink-0 transition-colors cursor-pointer"
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
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-[11px] text-slate-400 font-medium">标签：</span>
              {notice.tags.map(t => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleStar(notice.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                notice.is_starred
                  ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${notice.is_starred ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{notice.is_starred ? '已收藏' : '收藏'}</span>
            </button>

            <button
              onClick={() => onToggleRead(notice.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                notice.is_read
                  ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
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
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>转为待办任务</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              关闭
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
