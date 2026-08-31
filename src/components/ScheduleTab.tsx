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
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Controls & Week Selector */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Week Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button
                id="schedule-prev-week"
                onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
                disabled={selectedWeek <= 1}
                className="p-1.5 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer transition-all"
                title="上一周"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="px-3 py-1 text-sm font-extrabold text-slate-900 min-w-24 text-center">
                第 {selectedWeek} 周
                {selectedWeek === settings.current_week && (
                  <span className="ml-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                    本周
                  </span>
                )}
              </div>

              <button
                id="schedule-next-week"
                onClick={() => setSelectedWeek(Math.min(20, selectedWeek + 1))}
                disabled={selectedWeek >= 20}
                className="p-1.5 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer transition-all"
                title="下一周"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => setSelectedWeek(settings.current_week)}
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
            >
              回到本周
            </button>

            <span className="hidden sm:inline text-xs text-slate-400 font-medium">
              共 {weekCourses.length} 门课程 · {totalCredits.toFixed(1)} 学分
            </span>
          </div>

          {/* View Mode Switcher & Add Course */}
          <div className="flex items-center gap-2.5">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                id="schedule-view-week"
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  viewMode === 'week' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                周课表
              </button>
              <button
                id="schedule-view-day"
                onClick={() => setViewMode('day')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  viewMode === 'day' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                日视图
              </button>
              <button
                id="schedule-view-exam"
                onClick={() => setViewMode('exam')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  viewMode === 'exam' ? 'bg-white text-rose-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                考试安排 ({examCourses.length})
              </button>
            </div>

            <button
              id="schedule-add-course"
              onClick={onOpenAddCourse}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>添加课程</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Timetable Matrix View */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              
              {/* Day Headers (Mon - Sun) */}
              <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-700">
                <div className="p-3 text-center text-slate-400 font-semibold border-r border-slate-200">
                  节次 / 时间
                </div>
                {days.map(dayIndex => {
                  const isToday = new Date().getDay() === (dayIndex === 7 ? 0 : dayIndex);
                  return (
                    <div
                      key={dayIndex}
                      className={`p-3 text-center border-r border-slate-200 last:border-r-0 ${
                        isToday ? 'bg-blue-50/80 text-blue-700 font-extrabold' : ''
                      }`}
                    >
                      <div>{getDayName(dayIndex)}</div>
                      {isToday && (
                        <div className="text-[10px] text-blue-600 font-medium">今日</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Grid Body: 10 Periods */}
              <div className="divide-y divide-slate-100">
                {PERIOD_TIMES.map(periodInfo => {
                  const period = periodInfo.period;
                  return (
                    <div key={period} className="grid grid-cols-8 min-h-[72px]">
                      
                      {/* Period Label Col */}
                      <div className="p-2 border-r border-slate-200 bg-slate-50/40 text-center flex flex-col justify-center">
                        <span className="text-xs font-extrabold text-slate-800">
                          {period}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
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
                              className={`m-1 p-2.5 rounded-xl border transition-all cursor-pointer hover:shadow-md hover:scale-[1.01] flex flex-col justify-between ${colorConfig.lightBg}`}
                            >
                              <div className="space-y-1">
                                <div className="text-xs font-bold leading-tight line-clamp-2">
                                  {courseStartingHere.course_name}
                                </div>
                                <div className="text-[11px] opacity-85 flex items-center gap-1 font-medium">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  <span className="truncate">{courseStartingHere.classroom}</span>
                                </div>
                              </div>

                              <div className="mt-1 pt-1 border-t border-black/5 text-[10px] opacity-75 flex items-center justify-between">
                                <span>{courseStartingHere.teacher}</span>
                                <span>{courseStartingHere.credits}学分</span>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={dayIndex}
                            className="p-1 border-r border-slate-100 last:border-r-0 hover:bg-blue-50/20 transition-colors"
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
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all shrink-0 ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {getFullDayName(day)}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {weekCourses.filter(c => c.day_of_week === selectedDay).length === 0 ? (
              <div className="bg-white rounded-xl p-8 border border-slate-200 text-center text-slate-400 text-xs">
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
                      className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-14 w-14 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 ${colorConfig.badge}`}>
                          <span className="text-sm font-extrabold">{course.start_period}-{course.start_period + course.period_count - 1}</span>
                          <span className="text-[10px] opacity-75">节</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-900">{course.course_name}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              {course.start_time} - {course.end_time}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-slate-700">
                              <MapPin className="h-3.5 w-3.5 text-rose-500" />
                              {course.classroom}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5 text-slate-400" />
                              {course.teacher}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg shrink-0">
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
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-xs text-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              期末考试安排已与教务处 CAS 综合教务系统实时同步，请携带有效身份证件与学生证提前15分钟到达考场。
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examCourses.map(course => (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    期末考试
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {course.credits} 学分
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900">{course.course_name}</h3>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">考试日期：</span>
                    <span className="font-semibold text-slate-800 font-mono">{course.exam_date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">考试时间：</span>
                    <span className="font-semibold text-slate-800 font-mono">{course.exam_time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">考场及座次：</span>
                    <span className="font-semibold text-blue-700 font-medium">{course.exam_location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. AI Study Plan Generator Banner */}
      <div className="rounded-xl bg-linear-to-r from-purple-50 to-indigo-50 border border-purple-200/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">智能课表空闲分析与复习规划</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              根据您的周课表空档（如周二下午、周四上午），由 AI 自动生成最优备考自习计划。
            </p>
          </div>
        </div>
        <button
          onClick={onAskAIForStudyPlan}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs flex items-center gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>一键生成学习作息</span>
        </button>
      </div>

    </div>
  );
};
