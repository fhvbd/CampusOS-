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
  ArrowUpRight,
  Tag as TagIcon,
  Flame,
  Target
} from 'lucide-react';
import { Course, Notice, Task, UserProfile, AppSettings, TabType } from '../types';
import { COURSE_COLOR_MAP, getFullDayName } from '../lib/utils';
import { detectTaskAutoTag, getTaskTagIcon, TASK_TAG_RULES } from '../lib/taskTags';

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
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  // Calculate today's courses (day_of_week 1-7)
  const today = new Date();
  const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // 1 = Monday
  const todayCourses = courses
    .filter(c => c.day_of_week === dayOfWeek && c.weeks.includes(settings.current_week))
    .sort((a, b) => a.start_period - b.start_period);

  // Filter tasks by completion and tag filter
  const filteredTasks = tasks.filter(t => {
    if (!showCompletedTasks && t.is_completed) return false;
    if (showCompletedTasks && !t.is_completed) return false;
    if (selectedTagFilter === 'all') return true;
    const tag = detectTaskAutoTag(t.title, t.category);
    return tag.id === selectedTagFilter || tag.label === selectedTagFilter;
  });

  const pendingTasksCount = tasks.filter(t => !t.is_completed).length;
  const recentNotices = notices.slice(0, 4);

  // Determine next course
  const nextCourse = todayCourses.length > 0 ? todayCourses[0] : null;

  // Helper to determine if a deadline is today (matches today's YYYY-MM-DD or demo date 2026-08-31)
  const now = new Date();
  const currentFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const isTodayDeadline = (deadlineStr: string) => {
    if (!deadlineStr) return false;
    const datePart = deadlineStr.split(' ')[0];
    return datePart === currentFormatted || datePart === '2026-08-31';
  };

  // Aggregated High-Priority Tasks due today
  const todayHighPriorityTasks = tasks.filter(t => 
    t.priority === 'high' && isTodayDeadline(t.deadline)
  );
  const completedTodayHighCount = todayHighPriorityTasks.filter(t => t.is_completed).length;
  const pendingTodayHighCount = todayHighPriorityTasks.filter(t => !t.is_completed).length;

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      
      {/* 1. Welcome & Greeting Hero Banner (Holographic Liquid Glass) */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600/90 via-indigo-600/90 to-purple-700/90 text-white p-7 sm:p-9 shadow-xl shadow-indigo-500/15 border border-white/30 backdrop-blur-2xl">
        {/* Specular Liquid Highlights */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-56 h-56 rounded-full bg-cyan-400/25 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-xl text-xs font-bold text-white border border-white/30 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
              <span>CampusOS 智能校园操作系统 · 液态玻璃版</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-xs">
              你好，{user.username}同学 👋
            </h1>
            <p className="text-sm sm:text-base text-blue-50/95 max-w-2xl font-medium leading-relaxed">
              今天是 {new Date().getFullYear()}年{new Date().getMonth() + 1}月{new Date().getDate()}日 · 第 {settings.current_week} 周 {getFullDayName(dayOfWeek)}。今日共安排 <span className="font-bold text-white bg-white/20 px-2.5 py-0.5 rounded-lg backdrop-blur-xs">{todayCourses.length}</span> 门课程，<span className="font-bold text-white bg-white/20 px-2.5 py-0.5 rounded-lg backdrop-blur-xs">{pendingTasksCount}</span> 项待办。
            </p>
          </div>

          {/* Quick Academic Mini Stats (Frosted Glass Cubes) */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-white/15 hover:bg-white/20 transition-all backdrop-blur-xl rounded-2xl p-5 border border-white/30 text-center min-w-32 shadow-lg shadow-black/5">
              <div className="text-[11px] text-blue-100 font-semibold uppercase tracking-wider">当前绩点 GPA</div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1.5 font-mono tracking-tight">{user.gpa.toFixed(2)}</div>
            </div>
            <div className="bg-white/15 hover:bg-white/20 transition-all backdrop-blur-xl rounded-2xl p-5 border border-white/30 text-center min-w-32 shadow-lg shadow-black/5">
              <div className="text-[11px] text-blue-100 font-semibold uppercase tracking-wider">一卡通余额</div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1.5 font-mono tracking-tight">¥{user.campus_card_balance.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* AI Insight & Next Class Radar Pill (Liquid Glass Ribbon) */}
        <div className="mt-8 pt-6 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-white/90">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-medium leading-relaxed">
              💡 <strong>AI 建议</strong>：本周国家奖学金申报开放中；工程制图大作业将于明晚截止，建议优先安排。
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('ai')}
            className="inline-flex items-center gap-2 font-bold text-white bg-white/25 hover:bg-white/35 active:scale-95 transition-all px-4 py-2 rounded-xl border border-white/40 shadow-xs cursor-pointer self-start sm:self-auto backdrop-blur-md shrink-0"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>智能学习问答</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Today's Overview Card: Aggregated High-Priority Tasks Due Today */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-5 border border-white/80 shadow-md shadow-slate-900/5 relative overflow-hidden">
        {/* Decorative subtle accent ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-bl from-rose-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-linear-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/20 shrink-0">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-black text-lg sm:text-xl text-slate-900">今日概览</h2>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 border border-rose-500/25">
                  🔥 今日高优先任务 ({pendingTodayHighCount} 项待完成)
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                自动聚合截止日期为今日的高优先级作业、备考与学术研讨任务，支持直接勾选完成
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {todayHighPriorityTasks.length > 0 && (
              <div className="text-right hidden md:block">
                <div className="text-[11px] font-black text-slate-500">今日高优达成率</div>
                <div className="text-xs font-mono font-bold text-slate-800">
                  {completedTodayHighCount} / {todayHighPriorityTasks.length} ({todayHighPriorityTasks.length > 0 ? Math.round((completedTodayHighCount / todayHighPriorityTasks.length) * 100) : 100}%)
                </div>
              </div>
            )}
            <button
              onClick={onOpenAddTask}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>新建待办</span>
            </button>
          </div>
        </div>

        {/* Progress Bar when there are today high priority tasks */}
        {todayHighPriorityTasks.length > 0 && (
          <div className="w-full bg-slate-100/80 rounded-full h-2 overflow-hidden border border-slate-200/50">
            <div 
              className="bg-linear-to-r from-rose-500 via-amber-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{
                width: `${todayHighPriorityTasks.length > 0 ? (completedTodayHighCount / todayHighPriorityTasks.length) * 100 : 0}%`
              }}
            />
          </div>
        )}

        {/* Today's High Priority Task Items */}
        {todayHighPriorityTasks.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white/50 border border-white/80 text-center space-y-2">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-2xl bg-emerald-500/15 text-emerald-600 mb-1">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="text-sm font-bold text-slate-800">今日暂无高优先期待处理事项 🎉</div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              当前没有截止日期为今天的高优先级任务，今日学业节奏掌控自如！
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 relative z-10">
            {todayHighPriorityTasks.map(task => {
              const autoTag = detectTaskAutoTag(task.title, task.category);
              const TagIcon = getTaskTagIcon(task.auto_tag_icon || autoTag.iconName);
              const displayLabel = task.auto_tag_label || autoTag.label;

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 group shadow-2xs hover:shadow-xs ${
                    task.is_completed
                      ? 'bg-white/40 border-slate-200/60 opacity-70'
                      : 'bg-white/80 hover:bg-white border-white/90 ring-1 ring-rose-500/10'
                  }`}
                >
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 cursor-pointer shrink-0 transition-colors"
                    title={task.is_completed ? '点击标记为未完成' : '点击直接勾选完成'}
                  >
                    {task.is_completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 animate-in zoom-in-50 duration-150" />
                    ) : (
                      <Circle className="h-5 w-5 hover:text-indigo-600 text-rose-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-lg border shadow-2xs shrink-0 ${autoTag.badgeClass}`}>
                        <TagIcon className="h-3 w-3" />
                        <span>{displayLabel}</span>
                      </span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-700 border border-rose-500/20">
                        🔥 紧急高优
                      </span>
                      {task.course_name && (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100 truncate max-w-32">
                          {task.course_name}
                        </span>
                      )}
                    </div>

                    <div className={`text-xs sm:text-sm font-bold text-slate-800 leading-snug break-words group-hover:text-indigo-600 transition-colors ${task.is_completed ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-1">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-slate-500">
                      <Clock className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <span className="font-bold text-rose-600">
                        今日 {task.deadline.includes(' ') ? task.deadline.split(' ')[1] : ''} 截止
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Main 2-Column Grid: Today's Courses & Tasks (Expanded Gaps) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
        
        {/* Left 2 Cols: Today's Schedule Timeline & Shortcuts (Distinct Separation) */}
        <div className="lg:col-span-2 space-y-8 sm:space-y-10">
          
          {/* Module 2.1: Today's Courses */}
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-blue-500/15 border border-blue-500/25 text-blue-700 flex items-center justify-center font-bold backdrop-blur-md shadow-2xs">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <h2 className="font-black text-xl text-slate-900">今日课程</h2>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-500/15 text-blue-700 border border-blue-500/25 backdrop-blur-xs shadow-2xs">
                  {todayCourses.length} 门课
                </span>
              </div>
              <button
                id="home-view-all-schedule"
                onClick={() => onNavigateTab('schedule')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors px-3 py-1.5 rounded-xl hover:bg-blue-50/50"
              >
                查看全周课表
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {todayCourses.length === 0 ? (
              <div className="glass-panel rounded-3xl p-10 text-center space-y-4">
                <div className="h-16 w-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 flex items-center justify-center mx-auto shadow-xs backdrop-blur-md">
                  <CalendarCheck className="h-8 w-8" />
                </div>
                <div className="font-black text-slate-800 text-lg">今天没有课程安排</div>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  享受自由的学习或自习时光！可以前往 AI 学习助手进行课前预习或完成待办任务。
                </p>
                <button
                  onClick={onOpenAddCourse}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-md shadow-blue-500/25 cursor-pointer active:scale-95 border border-white/30"
                >
                  <Plus className="h-4 w-4" />
                  添加自定义课程
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {todayCourses.map((course, idx) => {
                  const colorConfig = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.blue;
                  return (
                    <div
                      key={course.id}
                      onClick={() => onSelectCourse(course)}
                      className="group relative glass-panel-interactive rounded-3xl p-5 sm:p-6 cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        
                        {/* Left: Time & Period Indicator */}
                        <div className="flex items-center gap-4 sm:gap-5">
                          <div className={`h-14 w-14 rounded-2xl flex flex-col items-center justify-center font-bold shrink-0 shadow-sm border border-white/60 backdrop-blur-md ${colorConfig.badge}`}>
                            <span className="text-xs font-black leading-none">第{course.start_period}-{course.start_period + course.period_count - 1}</span>
                            <span className="text-[10px] opacity-80 mt-1 font-bold">节</span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2.5">
                              <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                                {course.course_name}
                              </h3>
                              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-100/90 text-slate-700 border border-slate-200/80">
                                {course.credits} 学分
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600">
                              <span className="flex items-center gap-1.5 font-mono font-medium">
                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                {course.start_time} - {course.end_time}
                              </span>
                              <span className="flex items-center gap-1.5 font-bold text-slate-800 bg-rose-50/80 px-2.5 py-0.5 rounded-lg border border-rose-100">
                                <MapPin className="h-3.5 w-3.5 text-rose-500" />
                                {course.classroom} ({course.building})
                              </span>
                              <span className="flex items-center gap-1.5 font-medium">
                                <User className="h-3.5 w-3.5 text-slate-400" />
                                {course.teacher}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <span className="text-xs font-black text-blue-600 group-hover:translate-x-1 transition-transform flex items-center bg-blue-50/80 px-3 py-1.5 rounded-xl border border-blue-100 shadow-2xs">
                            详情
                            <ChevronRight className="h-4 w-4 ml-0.5" />
                          </span>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Module 2.2: Quick Shortcuts Matrix (Liquid Glass Panel with Distinct Margin) */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm">
            <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
              校园快捷工作流
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                onClick={() => onNavigateTab('ai')}
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/70 hover:bg-white/95 border border-white/90 shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer group active:scale-98"
              >
                <div className="h-10 w-10 rounded-2xl bg-purple-500/15 border border-purple-500/25 text-purple-700 flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 group-hover:text-purple-700">AI 考点速成</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">一键提炼重点</div>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('notice')}
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/70 hover:bg-white/95 border border-white/90 shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer group active:scale-98"
              >
                <div className="h-10 w-10 rounded-2xl bg-amber-500/15 border border-amber-500/25 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 group-hover:text-amber-700">奖学金雷达</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">国奖/选优申报</div>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('notice')}
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/70 hover:bg-white/95 border border-white/90 shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer group active:scale-98"
              >
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 group-hover:text-emerald-700">实习直通车</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">名企秋招双选</div>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('profile')}
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/70 hover:bg-white/95 border border-white/90 shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer group active:scale-98"
              >
                <div className="h-10 w-10 rounded-2xl bg-blue-500/15 border border-blue-500/25 text-blue-700 flex items-center justify-center shrink-0 shadow-xs">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 group-hover:text-blue-700">校园一卡通</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">充值与门禁</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Urgent Tasks & Recent Notices (Comfortably Spaced) */}
        <div className="space-y-8 sm:space-y-10">
          
          {/* Module 2.3: Tasks Card (Liquid Glass Panel) */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-700 flex items-center justify-center font-bold shadow-2xs">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                </div>
                <h2 className="font-black text-lg text-slate-900">待办任务清单</h2>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-700 border border-indigo-500/20">
                  {pendingTasksCount}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setShowCompletedTasks(false)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    !showCompletedTasks
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  未完成
                </button>
                <button
                  onClick={() => setShowCompletedTasks(true)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    showCompletedTasks
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  已完成
                </button>
              </div>
            </div>

            {/* Auto-Tag Quick Filter Carousel/Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              <button
                onClick={() => setSelectedTagFilter('all')}
                className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedTagFilter === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white/60 hover:bg-white/90 text-slate-600 border-white/80'
                }`}
              >
                全部
              </button>
              {TASK_TAG_RULES.map(rule => {
                const isSelected = selectedTagFilter === rule.id;
                const RuleIcon = getTaskTagIcon(rule.iconName);
                return (
                  <button
                    key={rule.id}
                    onClick={() => setSelectedTagFilter(isSelected ? 'all' : rule.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? `${rule.bgClass} ${rule.textClass} ${rule.borderClass} ring-1 ring-indigo-400 shadow-2xs`
                        : 'bg-white/60 hover:bg-white/90 text-slate-600 border-white/80'
                    }`}
                  >
                    <RuleIcon className="h-3 w-3" />
                    <span>{rule.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Add Task Field */}
            <div>
              <button
                onClick={onOpenAddTask}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-indigo-500/25 border border-white/30 active:scale-98"
              >
                <Plus className="h-4 w-4" />
                新建学习/作业待办 (支持关键词自动分类)
              </button>
            </div>

            {/* Task Item List */}
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-0.5">
              {filteredTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-medium">
                  {showCompletedTasks ? '暂无已完成的待办事项 ✨' : '当前分类下无待处理事项 🚀'}
                </div>
              ) : (
                filteredTasks.map(task => {
                  const autoTag = detectTaskAutoTag(task.title, task.category);
                  const TagIcon = getTaskTagIcon(task.auto_tag_icon || autoTag.iconName);
                  const displayLabel = task.auto_tag_label || autoTag.label;

                  return (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/60 hover:bg-white/95 border border-white/80 transition-all group shadow-2xs hover:shadow-xs"
                    >
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-indigo-600 cursor-pointer shrink-0 transition-colors"
                        title={task.is_completed ? '标记为未完成' : '标记为已完成'}
                      >
                        {task.is_completed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        {/* Title & Tag */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          {/* Auto Tag Badge with Icon */}
                          <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-lg border shadow-2xs shrink-0 ${autoTag.badgeClass}`}>
                            <TagIcon className="h-3 w-3" />
                            <span>{displayLabel}</span>
                          </span>

                          {task.priority === 'high' && (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-700 border border-rose-500/20">
                              🔥 紧急
                            </span>
                          )}
                        </div>

                        <div className={`text-xs font-bold text-slate-800 leading-snug break-words group-hover:text-indigo-600 transition-colors ${task.is_completed ? 'line-through opacity-60' : ''}`}>
                          {task.title}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-slate-500 font-medium">
                          {task.course_name && (
                            <span className="text-indigo-600 font-bold truncate max-w-32 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                              {task.course_name}
                            </span>
                          )}
                          <span className="font-mono text-slate-400">截止: {task.deadline.split(' ')[0]}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Module 2.4: Latest Campus Notices Card (Liquid Glass Panel) */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-2xl bg-amber-500/15 border border-amber-500/25 text-amber-700 flex items-center justify-center font-bold shadow-2xs">
                  <Bell className="h-4.5 w-4.5" />
                </div>
                <h2 className="font-black text-lg text-slate-900">最新通知</h2>
              </div>
              <button
                id="home-view-all-notices"
                onClick={() => onNavigateTab('notice')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-0.5 cursor-pointer"
              >
                通知中心
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              {recentNotices.map(notice => (
                <div
                  key={notice.id}
                  onClick={() => onSelectNotice(notice)}
                  className="p-4 rounded-2xl bg-white/60 hover:bg-white/95 border border-white/80 transition-all cursor-pointer group shadow-2xs hover:shadow-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 border border-blue-500/20">
                      {notice.category_name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-medium">{notice.publish_time.split(' ')[0]}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-relaxed">
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
