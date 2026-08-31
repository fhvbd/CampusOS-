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
import { CommandPalette } from './components/CommandPalette';
import { PwaModal } from './components/PwaModal';
import { CheckCircle2 } from 'lucide-react';
import { INITIAL_USER, INITIAL_COURSES, INITIAL_NOTICES, INITIAL_TASKS, INITIAL_SETTINGS } from './mockData';
import { detectTaskAutoTag } from './lib/taskTags';

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
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Listen for browser PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

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

  // Keyboard shortcut Ctrl+K for search, Ctrl+P for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
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
    const title = `【待办】${notice.title.slice(0, 30)}`;
    const initialCategory = notice.category === 'academic' ? 'homework' : 'campus';
    const autoTag = detectTaskAutoTag(title, initialCategory);

    const newTask: Task = {
      id: `t_${Date.now()}`,
      title,
      description: `来自通知《${notice.title}》：\n${notice.summary}`,
      category: autoTag.category || initialCategory,
      priority: notice.is_urgent ? 'high' : 'medium',
      deadline: notice.deadline || '2026-09-10 18:00',
      is_completed: false,
      created_at: new Date().toISOString().split('T')[0],
      auto_tag_label: autoTag.label,
      auto_tag_icon: autoTag.iconName,
    };
    const updated = await CampusAPI.saveTask(newTask);
    setTasks(updated);
    showToast(`已将《${notice.title.slice(0, 15)}...》截止事项加入待办清单！`);
  };

  const handlePromptInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          showToast('感谢安装 CampusOS！已添加到系统桌面');
          setDeferredPrompt(null);
          setIsPwaModalOpen(false);
        }
      } catch (err) {
        console.error(err);
      }
    }
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
    const finalTitle = `【AI定制】${title}`;
    const autoTag = detectTaskAutoTag(finalTitle, 'personal');

    const newTask: Task = {
      id: `t_${Date.now()}`,
      title: finalTitle,
      category: autoTag.category || 'personal',
      priority: 'high',
      deadline: deadline || `${new Date().toISOString().split('T')[0]} 22:00`,
      is_completed: false,
      created_at: new Date().toISOString().split('T')[0],
      auto_tag_label: autoTag.label,
      auto_tag_icon: autoTag.iconName,
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

  const handleImportData = async (backupData: any) => {
    const res = await CampusAPI.importAndMergeData(backupData);
    setUser(res.user);
    setSettings(res.settings);
    setCourses(res.courses);
    setTasks(res.tasks);
    setNotices(res.notices);
    showToast('本地配置数据已成功解析并合并！');
    return res;
  };

  const handleExportBackupDirectly = () => {
    const backup = {
      version: '1.0.0',
      exported_at: new Date().toISOString(),
      user,
      settings,
      courses,
      tasks,
      notices,
      stats: {
        total_courses: courses.length,
        total_tasks: tasks.length,
        total_notices: notices.length,
      }
    };
    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const fileName = `CampusOS_Backup_${user.student_id}_${new Date().toISOString().split('T')[0]}.json`;
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`已成功导出 ${courses.length} 门课程、${tasks.length} 项待办至 ${fileName}`);
  };

  const unreadNoticeCount = notices.filter(n => !n.is_read).length;
  const pendingTaskCount = tasks.filter(t => !t.is_completed).length;

  return (
    <div className="relative min-h-screen bg-slate-100/80 text-slate-900 flex flex-col selection:bg-blue-500/20 selection:text-blue-900 font-sans overflow-x-hidden">
      
      {/* Background Liquid Ambient Mesh Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Orb 1: Indigo-Blue Top Left */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-linear-to-br from-blue-400/30 via-indigo-400/25 to-transparent blur-3xl animate-orb-1" />
        {/* Orb 2: Violet-Purple Center Right */}
        <div className="absolute top-1/4 -right-24 w-[32rem] h-[32rem] rounded-full bg-linear-to-bl from-purple-400/25 via-indigo-300/20 to-transparent blur-3xl animate-orb-2" />
        {/* Orb 3: Cyan-Teal Bottom Left */}
        <div className="absolute bottom-12 -left-20 w-[28rem] h-[28rem] rounded-full bg-linear-to-tr from-cyan-400/20 via-sky-300/20 to-transparent blur-3xl animate-orb-3" />
        {/* Orb 4: Rose-Pink Bottom Center */}
        <div className="absolute -bottom-20 right-1/3 w-80 h-80 rounded-full bg-linear-to-t from-rose-300/15 via-purple-300/15 to-transparent blur-3xl" />
      </div>

      {/* Top Header */}
      <Header
        user={user}
        settings={settings}
        unreadNoticeCount={unreadNoticeCount}
        pendingTaskCount={pendingTaskCount}
        onRefreshSync={handleRefreshSync}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
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

      {/* Main Content Area - Generous Breathing Room */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
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
            courses={courses}
            tasks={tasks}
            notices={notices}
            onUpdateUser={handleUpdateUser}
            onUpdateSettings={handleUpdateSettings}
            onResetData={handleResetData}
            onImportData={handleImportData}
            onOpenPwaModal={() => setIsPwaModalOpen(true)}
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

      {/* Global Command Palette (Ctrl+P / Cmd+P) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={tab => setCurrentTab(tab)}
        onOpenNewTask={() => {
          setSelectedTask(null);
          setIsTaskModalOpen(true);
        }}
        onOpenNewCourse={() => {
          setSelectedCourse(null);
          setIsCourseModalOpen(true);
        }}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
        onRefreshSync={handleRefreshSync}
        onExportBackup={handleExportBackupDirectly}
        onOpenImport={() => {
          setCurrentTab('profile');
          setTimeout(() => {
            const btn = document.getElementById('profile-import-data-btn');
            if (btn) btn.click();
          }, 300);
        }}
        onResetData={handleResetData}
        onTriggerAIPrompt={prompt => {
          setCurrentTab('ai');
        }}
      />

      {/* PWA Immersion & Desktop Installation Modal */}
      <PwaModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
        user={user}
        settings={settings}
        deferredPrompt={deferredPrompt}
        onPromptInstall={handlePromptInstall}
        onShowToast={showToast}
      />

      {/* Toast Alert Banner (Liquid Glass) */}
      {toastMessage && (
        <div className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 glass-dark text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-white/20 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

    </div>
  );
}
export default App;
