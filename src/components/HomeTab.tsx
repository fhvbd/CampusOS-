import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  Circle, 
  Plus, 
  ChevronRight, 
  Sparkles, 
  AlertCircle, 
  Bell, 
  GraduationCap, 
  CreditCard, 
  Compass, 
  CalendarCheck,
  TrendingUp,
  Bookmark,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Course, Notice, Task, UserProfile, AppSettings, TabType } from '../types';
import { COURSE_COLOR_MAP, getFullDayName } from '../lib/utils';

interface HomeTabProps {
  user: UserProfile;
  settings: AppSettings;
  courses: Course[];
  notices: Notice[];
  tasks: Task[];
  onNavigateTab: (tab: TabType) => void;
  onSelectCourse: (course: Course) => void;
  onSelectNotice: (notice: Notice) => void;
  onToggleTask: (taskId: string) => void;
  onOpenAddTask: () => void;
  onOpenAddCourse: () => void;
  onAskAI: (prompt: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  user,
  settings,
  courses,
  notices,
  tasks,
  onNavigateTab,
  onSelectCourse,
  onSelectNotice,
  onToggleTask,
  onOpenAddTask,
  onOpenAddCourse,
  onAskAI,
}) => {
  const [quickTaskInput, setQuickTaskInput] = useState('');

  // Calculate today's courses (day_of_week 1-7)
  const today = new Date();
  const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // 1 = Monday
  const todayCourses = courses
    .filter(c => c.day_of_week === dayOfWeek && c.weeks.includes(settings.current_week))
    .sort((a, b) => a.start_period - b.start_period);

  const pendingTasks = tasks.filter(t => !t.is_completed).slice(0, 4);
  const recentNotices = notices.slice(0, 4);

  // Determine next course
  const nextCourse = todayCourses.length > 0 ? todayCourses[0] : null;

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Welcome & Greeting Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-indigo-800 text-white p-6 sm:p-8 shadow-md">
        {/* Decorative background ambient circles */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 rounded-full bg-blue-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/20">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>CampusOS 智能校园操作系统</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              你好，{user.username}同学 👋
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 max-w-xl">
              今天是 {new Date().getFullYear()}年{new Date().getMonth() + 1}月{new Date().getDate()}日 · 第 {settings.current_week} 周 {getFullDayName(dayOfWeek)}。今日共安排 <span className="font-bold text-white underline underline-offset-4">{todayCourses.length}</span> 门课程，<span className="font-bold text-white underline underline-offset-4">{pendingTasks.length}</span> 项待办。
            </p>
          </div>

          {/* Quick Academic Mini Stats */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 text-center min-w-24">
              <div className="text-xs text-blue-200 font-medium">当前绩点 GPA</div>
              <div className="text-xl font-extrabold text-white mt-0.5 font-mono">{user.gpa.toFixed(2)}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 text-center min-w-24">
              <div className="text-xs text-blue-200 font-medium">一卡通余额</div>
              <div className="text-xl font-extrabold text-white mt-0.5 font-mono">¥{user.campus_card_balance.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* AI Insight & Next Class Radar Pill */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-blue-100">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">
              💡 <strong>AI 建议</strong>：本周国家奖学金申报开放中；工程制图大作业将于明晚截止，建议优先安排。
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('ai')}
            className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-blue-200 transition-colors cursor-pointer self-start sm:self-auto bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg"
          >
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span>智能学习问答</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Main 2-Column Grid: Today's Courses & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Today's Schedule Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Clock className="h-4 w-4" />
              </div>
              <h2 className="font-bold text-lg text-slate-900">今日课程</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {todayCourses.length} 门课
              </span>
            </div>
            <button
              id="home-view-all-schedule"
              onClick={() => onNavigateTab('schedule')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              查看全周课表
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {todayCourses.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-slate-200 text-center space-y-3 shadow-2xs">
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <div className="font-semibold text-slate-800">今天没有课程安排</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                享受自由的学习或自习时光！可以前往 AI 学习助手进行课前预习或完成待办任务。
              </p>
              <button
                onClick={onOpenAddCourse}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                添加自定义课程
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayCourses.map((course, idx) => {
                const colorConfig = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.blue;
                return (
                  <div
                    key={course.id}
                    onClick={() => onSelectCourse(course)}
                    className="group relative bg-white rounded-xl p-4 sm:p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Left: Time & Period Indicator */}
                      <div className="flex items-center gap-3.5">
                        <div className={`h-12 w-12 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 ${colorConfig.badge}`}>
                          <span className="text-xs font-extrabold leading-none">第{course.start_period}-{course.start_period + course.period_count - 1}</span>
                          <span className="text-[10px] opacity-80 mt-0.5">节</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                              {course.course_name}
                            </h3>
                            <span className="text-[11px] font-medium px-2 py-0.2 rounded-md bg-slate-100 text-slate-600">
                              {course.credits} 学分
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-slate-400" />
                              {course.start_time} - {course.end_time}
                            </span>
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <MapPin className="h-3 w-3 text-rose-500" />
                              {course.classroom} ({course.building})
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3 text-slate-400" />
                              {course.teacher}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center">
                          详情
                          <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Shortcuts Matrix */}
          <div className="bg-slate-100/70 rounded-xl p-4 border border-slate-200/80">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
              校园快捷工作流
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => onNavigateTab('ai')}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-xs transition-all text-left cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700">AI 考点速成</div>
                  <div className="text-[10px] text-slate-500">一键提炼重点</div>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('notice')}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-white border border-slate-200/80 hover:border-amber-300 hover:shadow-xs transition-all text-left cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700">奖学金雷达</div>
                  <div className="text-[10px] text-slate-500">国奖/选优申报</div>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('notice')}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-xs transition-all text-left cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Compass className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">实习直通车</div>
                  <div className="text-[10px] text-slate-500">名企秋招双选</div>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('profile')}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all text-left cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">校园一卡通</div>
                  <div className="text-[10px] text-slate-500">充值与门禁</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Urgent Tasks & Recent Notices */}
        <div className="space-y-6">
          
          {/* Tasks Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <h2 className="font-bold text-base text-slate-900">待办清单</h2>
                <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700">
                  {pendingTasks.length}
                </span>
              </div>
              <button
                id="home-view-all-tasks"
                onClick={() => onNavigateTab('home')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                全部
              </button>
            </div>

            {/* Quick Add Task Field */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAddTask}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer border border-indigo-200/60"
              >
                <Plus className="h-3.5 w-3.5" />
                新建学习/作业待办
              </button>
            </div>

            {/* Task Item List */}
            <div className="space-y-2.5">
              {pendingTasks.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  暂无未完成待办事项 🚀
                </div>
              ) : (
                pendingTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors group"
                  >
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-indigo-600 cursor-pointer shrink-0 transition-colors"
                    >
                      {task.is_completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-800 leading-snug truncate group-hover:text-indigo-600 transition-colors">
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        {task.course_name && (
                          <span className="text-indigo-600 font-medium truncate max-w-28">
                            {task.course_name}
                          </span>
                        )}
                        <span>截止: {task.deadline.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Latest Campus Notices Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Bell className="h-3.5 w-3.5" />
                </div>
                <h2 className="font-bold text-base text-slate-900">最新通知</h2>
              </div>
              <button
                id="home-view-all-notices"
                onClick={() => onNavigateTab('notice')}
                className="text-xs font-semibold text-amber-600 hover:text-amber-800 flex items-center gap-0.5 cursor-pointer"
              >
                通知中心
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-3">
              {recentNotices.map(notice => (
                <div
                  key={notice.id}
                  onClick={() => onSelectNotice(notice)}
                  className="p-3 rounded-lg bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/60 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-200">
                      {notice.category_name}
                    </span>
                    <span className="text-[10px] text-slate-400">{notice.publish_time.split(' ')[0]}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {notice.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
