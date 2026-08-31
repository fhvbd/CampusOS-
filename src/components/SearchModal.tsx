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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
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
              className="text-xs text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-md text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          
          {query && totalResults === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="text-slate-400">未找到与 “{query}” 相关的校园项目</div>
              <button
                onClick={() => {
                  onAskAI(query);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 text-purple-700 font-bold hover:bg-purple-100 transition-colors cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>使用 AI 搜索并解答 “{query}”</span>
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
              className="p-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/80 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2 text-purple-900 font-bold">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>向 AI 提问并分析 “{query}”</span>
              </div>
              <ArrowRight className="h-4 w-4 text-purple-600" />
            </div>
          )}

          {/* Courses */}
          {matchingCourses.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                课程 ({matchingCourses.length})
              </div>
              {matchingCourses.map(course => (
                <div
                  key={course.id}
                  onClick={() => {
                    onSelectCourse(course);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900">{course.course_name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{course.teacher}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3 text-rose-500" /> {course.classroom}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600">查看</span>
                </div>
              ))}
            </div>
          )}

          {/* Notices */}
          {matchingNotices.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                通知公告 ({matchingNotices.length})
              </div>
              {matchingNotices.map(notice => (
                <div
                  key={notice.id}
                  onClick={() => {
                    onSelectNotice(notice);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-300 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-200">
                      {notice.category_name}
                    </span>
                    <span className="text-[10px] text-slate-400">{notice.publish_time}</span>
                  </div>
                  <div className="font-bold text-slate-900 line-clamp-1">{notice.title}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tasks */}
          {matchingTasks.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                待办事项 ({matchingTasks.length})
              </div>
              {matchingTasks.map(task => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900">{task.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">截止：{task.deadline}</div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600">{task.is_completed ? '已完成' : '待处理'}</span>
                </div>
              ))}
            </div>
          )}

          {!query && (
            <div className="py-6 text-center text-slate-400 space-y-2">
              <p>输入关键词快速定位全校课程、通知、考场与作业待办</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
