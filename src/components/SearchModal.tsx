import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  Bell, 
  CheckSquare, 
  Sparkles, 
  ArrowRight,
  MapPin,
  Clock
} from 'lucide-react';
import { Course, Notice, Task } from '../types';
import { detectTaskAutoTag, getTaskTagIcon } from '../lib/taskTags';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  notices: Notice[];
  tasks: Task[];
  onSelectCourse: (course: Course) => void;
  onSelectNotice: (notice: Notice) => void;
  onAskAI: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  courses,
  notices,
  tasks,
  onSelectCourse,
  onSelectNotice,
  onAskAI,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();

  const matchingCourses = q
    ? courses.filter(
        c =>
          c.course_name.toLowerCase().includes(q) ||
          c.teacher.toLowerCase().includes(q) ||
          c.classroom.toLowerCase().includes(q)
      )
    : [];

  const matchingNotices = q
    ? notices.filter(
        n =>
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.source_department.toLowerCase().includes(q)
      )
    : [];

  const matchingTasks = q
    ? tasks.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          (t.course_name && t.course_name.toLowerCase().includes(q))
      )
    : [];

  const totalResults = matchingCourses.length + matchingNotices.length + matchingTasks.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="glass-panel rounded-3xl max-w-xl w-full shadow-2xl border border-white/80 backdrop-blur-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input */}
        <div className="p-4 sm:p-5 border-b border-white/60 bg-white/40 backdrop-blur-xl flex items-center gap-3">
          <Search className="h-5 w-5 text-blue-600 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索课程、教室、教师、通知公告、待办任务..."
            className="flex-1 text-sm bg-transparent border-none outline-hidden text-slate-900 placeholder-slate-400 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-white/60 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-500 hover:bg-white/80 cursor-pointer border border-white/60 transition-all"
          >
            Esc
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          
          {query && totalResults === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="text-slate-500 font-medium">未找到与 “{query}” 相关的校园项目</div>
              <button
                onClick={() => {
                  onAskAI(query);
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 text-white font-black hover:opacity-90 transition-all cursor-pointer shadow-md shadow-purple-500/25 border border-white/30 active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span>使用 AI 深度分析 “{query}”</span>
              </button>
            </div>
          ) : null}

          {/* Quick AI Search Trigger */}
          {query && (
            <div
              onClick={() => {
                onAskAI(query);
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] shadow-2xs"
            >
              <div className="flex items-center gap-2 text-purple-900 font-black">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>向 AI 提问并智能分析 “{query}”</span>
              </div>
              <ArrowRight className="h-4 w-4 text-purple-600" />
            </div>
          )}

          {/* Courses */}
          {matchingCourses.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                课程 ({matchingCourses.length})
              </div>
              {matchingCourses.map(course => (
                <div
                  key={course.id}
                  onClick={() => {
                    onSelectCourse(course);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl glass-panel-interactive flex items-center justify-between"
                >
                  <div>
                    <div className="font-black text-slate-900">{course.course_name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                      <span>{course.teacher}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3 text-rose-500" /> {course.classroom}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-blue-600 glass-pill px-2.5 py-1">查看</span>
                </div>
              ))}
            </div>
          )}

          {/* Notices */}
          {matchingNotices.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                通知公告 ({matchingNotices.length})
              </div>
              {matchingNotices.map(notice => (
                <div
                  key={notice.id}
                  onClick={() => {
                    onSelectNotice(notice);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl glass-panel-interactive space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-blue-500/15 text-blue-700 border border-blue-500/20 shadow-2xs">
                      {notice.category_name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{notice.publish_time}</span>
                  </div>
                  <div className="font-bold text-slate-900 line-clamp-1">{notice.title}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tasks */}
          {matchingTasks.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                待办事项 ({matchingTasks.length})
              </div>
              {matchingTasks.map(task => {
                const autoTag = detectTaskAutoTag(task.title, task.category);
                const TagIcon = getTaskTagIcon(task.auto_tag_icon || autoTag.iconName);
                const displayLabel = task.auto_tag_label || autoTag.label;

                return (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-2xl glass-panel flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-lg border shadow-2xs shrink-0 ${autoTag.badgeClass}`}>
                          <TagIcon className="h-3 w-3" />
                          <span>{displayLabel}</span>
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 truncate">{task.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-medium">截止：{task.deadline}</div>
                    </div>
                    <span className="text-[10px] font-black text-indigo-600 glass-pill px-2.5 py-1 shrink-0">
                      {task.is_completed ? '已完成' : '待处理'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {!query && (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <p className="font-medium">输入关键词快速定位全校课程、通知、考场与作业待办</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
