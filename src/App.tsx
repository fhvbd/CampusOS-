import React, { useState, useEffect } from 'react';
import { 
  TabType, 
  Course, 
  Notice, 
  Task, 
  UserProfile, 
  AppSettings 
} from './types';
import { CampusAPI } from './services/api';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeTab } from './components/HomeTab';
import { ScheduleTab } from './components/ScheduleTab';
import { NoticeTab } from './components/NoticeTab';
import { AIAssistantTab } from './components/AIAssistantTab';
import { ProfileTab } from './components/ProfileTab';
import { CourseModal } from './components/CourseModal';
import { NoticeDetailModal } from './components/NoticeDetailModal';
import { TaskModal } from './components/TaskModal';
import { SearchModal } from './components/SearchModal';
import { CheckCircle2 } from 'lucide-react';
import { INITIAL_USER, INITIAL_COURSES, INITIAL_NOTICES, INITIAL_TASKS, INITIAL_SETTINGS } from './mockData';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);

  // Modals state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial Load from API / Storage
  useEffect(() => {
    async function loadData() {
      const [userData, coursesData, noticesData, tasksData, settingsData] = await Promise.all([
        CampusAPI.getUserProfile(),
        CampusAPI.getCourses(),
        CampusAPI.getNotices(),
        CampusAPI.getTasks(),
        CampusAPI.getSettings(),
      ]);
      setUser(userData);
      setCourses(coursesData);
      setNotices(noticesData);
      setTasks(tasksData);
      setSettings(settingsData);
    }
    loadData();
  }, []);

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleRefreshSync = async () => {
    const now = new Date();
    const timeFormatted = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const updated = await CampusAPI.updateUserProfile({ last_sync_time: timeFormatted, cas_sync_status: 'synced' });
    setUser(updated);
    showToast('综合教务系统与校园数据已成功同步！');
  };

  const handleSaveCourse = async (course: Course) => {
    const updated = await CampusAPI.saveCourse(course);
    setCourses(updated);
    showToast(`课程《${course.course_name}》已成功保存`);
  };

  const handleDeleteCourse = async (courseId: string) => {
    const updated = await CampusAPI.deleteCourse(courseId);
    setCourses(updated);
    showToast('课程已删除');
  };

  const handleToggleNoticeStar = async (noticeId: string) => {
    const updated = await CampusAPI.toggleNoticeStar(noticeId);
    setNotices(updated);
    const n = updated.find(item => item.id === noticeId);
    showToast(n?.is_starred ? '已加入收藏列表' : '已取消收藏');
  };

  const handleToggleNoticeRead = async (noticeId: string) => {
    const updated = await CampusAPI.toggleNoticeRead(noticeId);
    setNotices(updated);
  };

  const handleConvertNoticeToTask = async (notice: Notice) => {
    const newTask: Task = {
      id: `t_${Date.now()}`,
      title: `【待办】${notice.title.slice(0, 30)}`,
      description: `来自通知《${notice.title}》：\n${notice.summary}`,
      category: notice.category === 'academic' ? 'homework' : 'campus',
      priority: notice.is_urgent ? 'high' : 'medium',
      deadline: notice.deadline || '2026-09-10 18:00',
      is_completed: false,
      created_at: new Date().toISOString().split('T')[0],
    };
    const updated = await CampusAPI.saveTask(newTask);
    setTasks(updated);
    showToast(`已将《${notice.title.slice(0, 15)}...》截止事项加入待办清单！`);
  };

  const handleToggleTask = async (taskId: string) => {
    const updated = await CampusAPI.toggleTaskCompleted(taskId);
    setTasks(updated);
    const t = updated.find(item => item.id === taskId);
    if (t?.is_completed) {
      showToast('🎉 恭喜完成一项待办任务！');
    }
  };

  const handleSaveTask = async (task: Task) => {
    const updated = await CampusAPI.saveTask(task);
    setTasks(updated);
    showToast('待办任务已保存');
  };

  const handleAddTaskFromAI = async (title: string, deadline?: string) => {
    const newTask: Task = {
      id: `t_${Date.now()}`,
      title: `【AI定制】${title}`,
      category: 'personal',
      priority: 'high',
      deadline: deadline || `${new Date().toISOString().split('T')[0]} 22:00`,
      is_completed: false,
      created_at: new Date().toISOString().split('T')[0],
    };
    const updated = await CampusAPI.saveTask(newTask);
    setTasks(updated);
    showToast('已由 AI 自动生成并加入待办清单！');
  };

  const handleUpdateUser = async (updatedFields: Partial<UserProfile>) => {
    const res = await CampusAPI.updateUserProfile(updatedFields);
    setUser(res);
    showToast('个人信息与校园卡已更新');
  };

  const handleUpdateSettings = async (updatedFields: Partial<AppSettings>) => {
    const res = await CampusAPI.saveSettings({ ...settings, ...updatedFields });
    setSettings(res);
    showToast('系统设置已更新');
  };

  const handleResetData = () => {
    CampusAPI.resetAllData();
    setUser(INITIAL_USER);
    setCourses(INITIAL_COURSES);
    setNotices(INITIAL_NOTICES);
    setTasks(INITIAL_TASKS);
    setSettings(INITIAL_SETTINGS);
    showToast('已恢复为官方初始演示数据集');
  };

  const unreadNoticeCount = notices.filter(n => !n.is_read).length;
  const pendingTaskCount = tasks.filter(t => !t.is_completed).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900 font-sans">
      
      {/* Top Header */}
      <Header
        user={user}
        settings={settings}
        unreadNoticeCount={unreadNoticeCount}
        pendingTaskCount={pendingTaskCount}
        onRefreshSync={handleRefreshSync}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenProfile={() => setCurrentTab('profile')}
        onOpenNotice={() => setCurrentTab('notice')}
      />

      {/* Main Navigation (Desktop Top Bar & Mobile Bottom) */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        unreadNoticeCount={unreadNoticeCount}
        pendingTaskCount={pendingTaskCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'home' && (
          <HomeTab
            user={user}
            settings={settings}
            courses={courses}
            notices={notices}
            tasks={tasks}
            onNavigateTab={setCurrentTab}
            onSelectCourse={c => {
              setSelectedCourse(c);
              setIsCourseModalOpen(true);
            }}
            onSelectNotice={n => {
              setSelectedNotice(n);
              setIsNoticeModalOpen(true);
            }}
            onToggleTask={handleToggleTask}
            onOpenAddTask={() => {
              setSelectedTask(null);
              setIsTaskModalOpen(true);
            }}
            onOpenAddCourse={() => {
              setSelectedCourse(null);
              setIsCourseModalOpen(true);
            }}
            onAskAI={prompt => {
              setCurrentTab('ai');
            }}
          />
        )}

        {currentTab === 'schedule' && (
          <ScheduleTab
            courses={courses}
            settings={settings}
            onSelectCourse={c => {
              setSelectedCourse(c);
              setIsCourseModalOpen(true);
            }}
            onOpenAddCourse={() => {
              setSelectedCourse(null);
              setIsCourseModalOpen(true);
            }}
            onAskAIForStudyPlan={() => {
              setCurrentTab('ai');
            }}
          />
        )}

        {currentTab === 'notice' && (
          <NoticeTab
            notices={notices}
            onSelectNotice={n => {
              setSelectedNotice(n);
              setIsNoticeModalOpen(true);
            }}
            onToggleStar={handleToggleNoticeStar}
            onToggleRead={handleToggleNoticeRead}
            onConvertNoticeToTask={handleConvertNoticeToTask}
          />
        )}

        {currentTab === 'ai' && (
          <AIAssistantTab
            courses={courses}
            onAddTaskFromAI={handleAddTaskFromAI}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileTab
            user={user}
            settings={settings}
            onUpdateUser={handleUpdateUser}
            onUpdateSettings={handleUpdateSettings}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Global Modals */}
      <CourseModal
        course={selectedCourse}
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSave={handleSaveCourse}
        onDelete={handleDeleteCourse}
      />

      <NoticeDetailModal
        notice={selectedNotice}
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        onToggleStar={handleToggleNoticeStar}
        onToggleRead={handleToggleNoticeRead}
        onConvertToTask={handleConvertNoticeToTask}
      />

      <TaskModal
        task={selectedTask}
        courses={courses}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        courses={courses}
        notices={notices}
        tasks={tasks}
        onSelectCourse={c => {
          setSelectedCourse(c);
          setIsCourseModalOpen(true);
        }}
        onSelectNotice={n => {
          setSelectedNotice(n);
          setIsNoticeModalOpen(true);
        }}
        onAskAI={query => {
          setCurrentTab('ai');
        }}
      />

      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

    </div>
  );
}
export default App;
