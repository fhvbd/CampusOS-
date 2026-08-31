import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  MapPin, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Download, 
  Sparkles,
  Layers,
  BookOpen
} from 'lucide-react';
import { Course, AppSettings } from '../types';
import { PERIOD_TIMES, COURSE_COLOR_MAP, getDayName, getFullDayName } from '../lib/utils';

interface ScheduleTabProps {
  courses: Course[];
  settings: AppSettings;
  onSelectCourse: (course: Course) => void;
  onOpenAddCourse: () => void;
  onAskAIForStudyPlan: () => void;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  courses,
  settings,
  onSelectCourse,
  onOpenAddCourse,
  onAskAIForStudyPlan,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(settings.current_week || 1);
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'exam'>('week');
  const [selectedDay, setSelectedDay] = useState<number>(1); // Monday = 1

  // Filter courses active in selected week
  const weekCourses = courses.filter(c => c.weeks.includes(selectedWeek));
  
  // Total credits
  const totalCredits = weekCourses.reduce((acc, curr) => acc + curr.credits, 0);

  // Exam list
  const examCourses = courses.filter(c => !!c.exam_date).sort((a, b) => {
    return (a.exam_date || '').localeCompare(b.exam_date || '');
  });

  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      
      {/* 1. Header Controls & Week Selector (Liquid Glass Container) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          
          {/* Week Selector */}
          <div className="flex flex-wrap items-center gap-3.5">
            <div className="flex items-center glass-pill rounded-2xl p-1 shadow-2xs">
              <button
                id="schedule-prev-week"
                onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
                disabled={selectedWeek <= 1}
                className="p-2 rounded-xl hover:bg-white/80 text-slate-700 disabled:opacity-30 cursor-pointer transition-all active:scale-95"
                title="上一周"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="px-4 py-1 text-sm font-black text-slate-900 min-w-32 text-center">
                第 {selectedWeek} 周
                {selectedWeek === settings.current_week && (
                  <span className="ml-1.5 text-[10px] font-black text-blue-700 bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 rounded-full">
                    本周
                  </span>
                )}
              </div>

              <button
                id="schedule-next-week"
                onClick={() => setSelectedWeek(Math.min(20, selectedWeek + 1))}
                disabled={selectedWeek >= 20}
                className="p-2 rounded-xl hover:bg-white/80 text-slate-700 disabled:opacity-30 cursor-pointer transition-all active:scale-95"
                title="下一周"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => setSelectedWeek(settings.current_week)}
              className="px-3.5 py-2 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 text-xs font-bold border border-blue-500/20 transition-all cursor-pointer backdrop-blur-xs active:scale-95"
            >
              回到本周
            </button>

            <span className="hidden sm:inline text-xs text-slate-500 font-semibold ml-1">
              共 {weekCourses.length} 门课程 · {totalCredits.toFixed(1)} 学分
            </span>
          </div>

          {/* View Mode Switcher & Add Course */}
          <div className="flex items-center gap-3">
            <div className="flex glass-pill p-1 rounded-2xl text-xs font-bold shadow-2xs">
              <button
                id="schedule-view-week"
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-xl cursor-pointer transition-all ${
                  viewMode === 'week' ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 font-black border border-white/30' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                周课表
              </button>
              <button
                id="schedule-view-day"
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded-xl cursor-pointer transition-all ${
                  viewMode === 'day' ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 font-black border border-white/30' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                日视图
              </button>
              <button
                id="schedule-view-exam"
                onClick={() => setViewMode('exam')}
                className={`px-4 py-2 rounded-xl cursor-pointer transition-all ${
                  viewMode === 'exam' ? 'bg-linear-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-500/25 font-black border border-white/30' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                考试安排 ({examCourses.length})
              </button>
            </div>

            <button
              id="schedule-add-course"
              onClick={onOpenAddCourse}
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-blue-500/25 border border-white/30 transition-all cursor-pointer shrink-0 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>添加课程</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Timetable Matrix View (Liquid Frosted Glass Grid) */}
      {viewMode === 'week' && (
        <div className="glass-panel rounded-3xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              
              {/* Day Headers (Mon - Sun) */}
              <div className="grid grid-cols-8 border-b border-white/70 bg-white/50 backdrop-blur-md text-xs font-extrabold text-slate-700">
                <div className="p-3.5 text-center text-slate-400 font-bold border-r border-white/60">
                  节次 / 时间
                </div>
                {days.map(dayIndex => {
                  const isToday = new Date().getDay() === (dayIndex === 7 ? 0 : dayIndex);
                  return (
                    <div
                      key={dayIndex}
                      className={`p-3.5 text-center border-r border-white/60 last:border-r-0 ${
                        isToday ? 'bg-blue-500/15 text-blue-700 font-black' : ''
                      }`}
                    >
                      <div className="tracking-wide">{getDayName(dayIndex)}</div>
                      {isToday && (
                        <div className="text-[10px] text-blue-700 font-black mt-0.5 bg-blue-500/20 px-2 py-0.2 rounded-full inline-block">
                          今日
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Grid Body: 10 Periods */}
              <div className="divide-y divide-white/60">
                {PERIOD_TIMES.map(periodInfo => {
                  const period = periodInfo.period;
                  return (
                    <div key={period} className="grid grid-cols-8 min-h-[76px]">
                      
                      {/* Period Label Col */}
                      <div className="p-2 border-r border-white/60 bg-white/30 backdrop-blur-xs text-center flex flex-col justify-center">
                        <span className="text-xs font-black text-slate-800">
                          {period}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-medium">
                          {periodInfo.start}
                        </span>
                      </div>

                      {/* Days Col 1-7 */}
                      {days.map(dayIndex => {
                        // Find course starting at this period and day
                        const courseStartingHere = weekCourses.find(
                          c => c.day_of_week === dayIndex && c.start_period === period
                        );

                        // Find if covered by a multi-period course that started earlier
                        const isCoveredByPrevious = weekCourses.some(
                          c => c.day_of_week === dayIndex &&
                               c.start_period < period &&
                               c.start_period + c.period_count > period
                        );

                        if (isCoveredByPrevious) {
                          // This cell is visually merged into the starting card
                          return null;
                        }

                        if (courseStartingHere) {
                          const colorConfig = COURSE_COLOR_MAP[courseStartingHere.color] || COURSE_COLOR_MAP.blue;
                          return (
                            <div
                              key={dayIndex}
                              onClick={() => onSelectCourse(courseStartingHere)}
                              style={{ gridRow: `span ${courseStartingHere.period_count}` }}
                              className={`m-1.5 p-3 rounded-2xl border transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-98 flex flex-col justify-between backdrop-blur-md ${colorConfig.lightBg} shadow-xs`}
                            >
                              <div className="space-y-1.5">
                                <div className="text-xs font-black leading-tight line-clamp-2 drop-shadow-2xs">
                                  {courseStartingHere.course_name}
                                </div>
                                <div className="text-[11px] opacity-90 flex items-center gap-1 font-bold">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  <span className="truncate">{courseStartingHere.classroom}</span>
                                </div>
                              </div>

                              <div className="mt-2 pt-1.5 border-t border-black/5 text-[10px] font-bold opacity-80 flex items-center justify-between">
                                <span>{courseStartingHere.teacher}</span>
                                <span>{courseStartingHere.credits}学分</span>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={dayIndex}
                            className="p-1 border-r border-white/50 last:border-r-0 hover:bg-blue-500/10 transition-colors"
                          />
                        );
                      })}

                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. Day View Mode */}
      {viewMode === 'day' && (
        <div className="space-y-6">
          <div className="flex gap-2.5 overflow-x-auto pb-2">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold cursor-pointer transition-all shrink-0 ${
                  selectedDay === day
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 border border-white/30'
                    : 'glass-panel text-slate-700 hover:bg-white/90'
                }`}
              >
                {getFullDayName(day)}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {weekCourses.filter(c => c.day_of_week === selectedDay).length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center text-slate-400 text-xs font-medium">
                {getFullDayName(selectedDay)} 没有安排课程 🌴
              </div>
            ) : (
              weekCourses
                .filter(c => c.day_of_week === selectedDay)
                .sort((a, b) => a.start_period - b.start_period)
                .map(course => {
                  const colorConfig = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.blue;
                  return (
                    <div
                      key={course.id}
                      onClick={() => onSelectCourse(course)}
                      className="glass-panel-interactive rounded-3xl p-6 cursor-pointer flex items-center justify-between gap-5"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`h-16 w-16 rounded-2xl flex flex-col items-center justify-center font-bold shrink-0 shadow-xs border border-white/60 backdrop-blur-md ${colorConfig.badge}`}>
                          <span className="text-base font-black">{course.start_period}-{course.start_period + course.period_count - 1}</span>
                          <span className="text-[10px] opacity-80 font-bold">节</span>
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="font-black text-base sm:text-lg text-slate-900">{course.course_name}</h3>
                          <div className="flex flex-wrap items-center gap-3.5 text-xs text-slate-600">
                            <span className="flex items-center gap-1 font-mono font-medium">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              {course.start_time} - {course.end_time}
                            </span>
                            <span className="flex items-center gap-1 font-bold text-slate-800 bg-rose-50/90 px-2.5 py-0.5 rounded-lg border border-rose-100">
                              <MapPin className="h-3.5 w-3.5 text-rose-500" />
                              {course.classroom}
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <User className="h-3.5 w-3.5 text-slate-400" />
                              {course.teacher}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-blue-600 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl shrink-0 backdrop-blur-xs shadow-2xs">
                        查看详情
                      </span>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* 4. Exam Schedule View */}
      {viewMode === 'exam' && (
        <div className="space-y-6">
          <div className="glass-panel bg-amber-500/10 border-amber-500/25 rounded-3xl p-5 sm:p-6 flex items-center gap-4 text-xs text-amber-900 backdrop-blur-md">
            <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
            <span className="font-medium leading-relaxed">
              期末考试安排已与教务处 CAS 综合教务系统实时同步，请携带有效身份证件与学生证提前15分钟到达考场。
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {examCourses.map(course => (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="glass-panel-interactive rounded-3xl p-6 cursor-pointer space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-500/15 text-rose-700 border border-rose-500/25">
                    期末考试
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100/90 px-2.5 py-1 rounded-lg">
                    {course.credits} 学分
                  </span>
                </div>

                <h3 className="font-black text-lg text-slate-900">{course.course_name}</h3>

                <div className="space-y-2.5 text-xs text-slate-700 bg-white/60 p-4 rounded-2xl border border-white/80">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">考试日期：</span>
                    <span className="font-bold text-slate-800 font-mono">{course.exam_date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">考试时间：</span>
                    <span className="font-bold text-slate-800 font-mono">{course.exam_time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">考场及座次：</span>
                    <span className="font-bold text-blue-700">{course.exam_location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. AI Study Plan Generator Banner (Liquid Glass Holographic with Breathing Room) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-purple-300/60 bg-linear-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 shadow-md shadow-purple-500/5">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="h-14 w-14 rounded-2xl bg-linear-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/25 border border-white/30 shrink-0">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <h4 className="font-black text-base text-slate-900">智能课表空闲分析与复习规划</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              根据您的周课表空档（如周二下午、周四上午），由 AI 自动生成最优备考自习计划。
            </p>
          </div>
        </div>
        <button
          onClick={onAskAIForStudyPlan}
          className="px-6 py-3 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black transition-all cursor-pointer shrink-0 shadow-md shadow-purple-500/25 border border-white/30 flex items-center gap-2 active:scale-95"
        >
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>一键生成学习作息</span>
        </button>
      </div>

    </div>
  );
};
