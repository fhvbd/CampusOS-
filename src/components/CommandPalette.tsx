import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Command, 
  Search, 
  X, 
  PlusCircle, 
  RefreshCw, 
  Calendar, 
  LayoutDashboard, 
  Bell, 
  Bot, 
  User, 
  Download, 
  Upload, 
  Timer, 
  Sparkles, 
  RotateCcw, 
  BookOpen, 
  ArrowRight,
  Zap,
  CheckCircle2,
  Sliders,
  Flame,
  FileText,
  Monitor
} from 'lucide-react';
import { TabType } from '../types';

export interface CommandItem {
  id: string;
  title: string;
  category: 'navigation' | 'actions' | 'focus' | 'ai';
  categoryLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  keywords?: string[];
  description?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenNewTask: () => void;
  onOpenNewCourse: () => void;
  onOpenSearch: () => void;
  onOpenPwaModal?: () => void;
  onRefreshSync: () => void;
  onExportBackup: () => void;
  onOpenImport: () => void;
  onResetData: () => void;
  onTriggerAIPrompt: (prompt: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenNewTask,
  onOpenNewCourse,
  onOpenSearch,
  onOpenPwaModal,
  onRefreshSync,
  onExportBackup,
  onOpenImport,
  onResetData,
  onTriggerAIPrompt,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Define full command registry
  const allCommands: CommandItem[] = [
    // 1. Core Actions
    {
      id: 'action-new-task',
      title: '新建待办任务',
      category: 'actions',
      categoryLabel: '核心操作',
      icon: PlusCircle,
      shortcut: 'Alt + T',
      keywords: ['新建', '任务', 'todo', 'task', 'add', '创建待办', '作业', '备忘'],
      description: '快速创建新的作业、备考或研讨任务，支持AI自动打标',
      action: () => {
        onClose();
        onOpenNewTask();
      },
    },
    {
      id: 'action-sync-data',
      title: '同步校园与教务数据',
      category: 'actions',
      categoryLabel: '核心操作',
      icon: RefreshCw,
      shortcut: 'Alt + S',
      keywords: ['同步', '教务', '更新', 'sync', '刷新', '网关', 'cas'],
      description: '拉取最新教务课表、选课状态与一卡通消费数据',
      action: () => {
        onClose();
        onRefreshSync();
      },
    },
    {
      id: 'action-open-search',
      title: '全局语义搜索',
      category: 'actions',
      categoryLabel: '核心操作',
      icon: Search,
      shortcut: 'Ctrl + K',
      keywords: ['搜索', 'search', '查找', '课程', '通知', '待办'],
      description: '快速检索课程、通知公告与待办事项',
      action: () => {
        onClose();
        onOpenSearch();
      },
    },
    {
      id: 'action-new-course',
      title: '添加新课程',
      category: 'actions',
      categoryLabel: '核心操作',
      icon: BookOpen,
      keywords: ['新建课程', '添加课程', 'course', 'add course', '选课'],
      description: '手动将课程信息添加到智能周课表中',
      action: () => {
        onClose();
        onOpenNewCourse();
      },
    },
    {
      id: 'action-pwa-install',
      title: '添加到桌面 & PWA 沉浸配置',
      category: 'actions',
      categoryLabel: '核心操作',
      icon: Monitor,
      keywords: ['桌面', 'pwa', 'install', '添加到桌面', '桌面应用', '独立窗口', '安装'],
      description: '将 CampusOS 添加到电脑或手机桌面，导出轻量化 manifest.json 沉浸运行',
      action: () => {
        onClose();
        if (onOpenPwaModal) {
          onOpenPwaModal();
        }
      },
    },
    {
      id: 'action-export-backup',
      title: '备份与导出数据 (JSON)',
      category: 'actions',
      categoryLabel: '核心操作',
      icon: Download,
      keywords: ['备份', '导出', 'export', 'backup', 'json', '下载'],
      description: '将当前全部课表、待办与设置打包为本地JSON文件',
      action: () => {
        onClose();
        onExportBackup();
      },
    },
    {
      id: 'action-import-backup',
      title: '导入与恢复数据 (JSON)',
      category: 'actions',
      categoryLabel: '核心操作',
      icon: Upload,
      keywords: ['导入', '恢复', 'import', 'restore', 'json', '读取'],
      description: '解析并合并本地 JSON 备份文件至当前系统',
      action: () => {
        onClose();
        onOpenImport();
      },
    },
    {
      id: 'action-reset-demo',
      title: '重置为官方初始演示数据',
      category: 'actions',
      categoryLabel: '核心操作',
      icon: RotateCcw,
      keywords: ['重置', 'reset', '初始', '清空', 'demo'],
      description: '恢复全部演示课程、待办与通知初值',
      action: () => {
        onClose();
        if (confirm('确认恢复所有演示课表与通知数据吗？')) {
          onResetData();
        }
      },
    },

    // 2. Navigation
    {
      id: 'nav-home',
      title: '跳转至：概览大厅 (Home)',
      category: 'navigation',
      categoryLabel: '页面跳转',
      icon: LayoutDashboard,
      shortcut: '1',
      keywords: ['首页', '大厅', '概览', 'home', 'main', 'dashboard'],
      description: '今日课程时间线、待办任务与学习卡片',
      action: () => {
        onClose();
        onNavigateTab('home');
      },
    },
    {
      id: 'nav-schedule',
      title: '跳转至：智能课表 (Schedule)',
      category: 'navigation',
      categoryLabel: '页面跳转',
      icon: Calendar,
      shortcut: '2',
      keywords: ['课表', '课程', 'schedule', 'timetable', '日历', '周历'],
      description: '交互式周课表、单双周视图与课程详情',
      action: () => {
        onClose();
        onNavigateTab('schedule');
      },
    },
    {
      id: 'nav-notice',
      title: '跳转至：校园通知 (Notices)',
      category: 'navigation',
      categoryLabel: '页面跳转',
      icon: Bell,
      shortcut: '3',
      keywords: ['通知', '公告', 'notice', 'news', '消息', '重要'],
      description: '教务处、院系与讲座公告，支持一键转待办',
      action: () => {
        onClose();
        onNavigateTab('notice');
      },
    },
    {
      id: 'nav-ai',
      title: '跳转至：AI 学习助手 (AI Assistant)',
      category: 'navigation',
      categoryLabel: '页面跳转',
      icon: Bot,
      shortcut: '4',
      keywords: ['ai', '助手', 'assistant', '问答', '大模型', '总结'],
      description: '考点梳理、课件提炼与番茄钟专注',
      action: () => {
        onClose();
        onNavigateTab('ai');
      },
    },
    {
      id: 'nav-profile',
      title: '跳转至：个人与设置 (Profile)',
      category: 'navigation',
      categoryLabel: '页面跳转',
      icon: User,
      shortcut: '5',
      keywords: ['个人', '设置', 'profile', 'settings', '学籍', '一卡通', '偏好'],
      description: '学籍卡片、一卡通充值、外观偏好与数据备份',
      action: () => {
        onClose();
        onNavigateTab('profile');
      },
    },

    // 3. Focus / Pomodoro
    {
      id: 'focus-pomodoro-start',
      title: '启动 25 分钟番茄钟深度专注',
      category: 'focus',
      categoryLabel: '专注计时',
      icon: Timer,
      keywords: ['番茄钟', '专注', 'pomodoro', 'focus', '计时', '心流'],
      description: '进入 AI 助手番茄钟专注心流模式',
      action: () => {
        onClose();
        onNavigateTab('ai');
      },
    },

    // 4. AI Tool Prompts
    {
      id: 'ai-exam-prep',
      title: 'AI 指令：梳理高等数学/核心课期末考点',
      category: 'ai',
      categoryLabel: 'AI 智能指令',
      icon: Sparkles,
      keywords: ['考点', '期末', '复习', '高数', '考试', 'exam'],
      description: '让 AI 针对期末核心课程生成考点思维导图与冲刺清单',
      action: () => {
        onClose();
        onNavigateTab('ai');
        onTriggerAIPrompt('请帮我系统梳理当前学期核心课程的期末高频考点与复习突破策略。');
      },
    },
    {
      id: 'ai-paper-outline',
      title: 'AI 指令：学术论文开题与文献综述指导',
      category: 'ai',
      categoryLabel: 'AI 智能指令',
      icon: FileText,
      keywords: ['论文', '开题', '文献', 'paper', '综述', '写作'],
      description: '提供文献检索技巧、开题报告结构与答辩要点',
      action: () => {
        onClose();
        onNavigateTab('ai');
        onTriggerAIPrompt('我正在准备课程学术论文/开题报告，请提供文献检索思路与标准结构范式。');
      },
    },
    {
      id: 'ai-schedule-plan',
      title: 'AI 指令：根据当前课表自动生成今日学习计划',
      category: 'ai',
      categoryLabel: 'AI 智能指令',
      icon: Zap,
      keywords: ['计划', '日程', '今日', 'plan', '学习时间表'],
      description: '结合今日空闲时段与待办截止日期定制高效日程表',
      action: () => {
        onClose();
        onNavigateTab('ai');
        onTriggerAIPrompt('请结合我今天的课表与待办任务，帮我制定一份劳逸结合的今日全天学习作息表。');
      },
    },
  ];

  // Filtering
  const cleanQ = query.trim().toLowerCase();
  const filteredCommands = cleanQ
    ? allCommands.filter(cmd => {
        const titleMatch = cmd.title.toLowerCase().includes(cleanQ);
        const descMatch = cmd.description?.toLowerCase().includes(cleanQ);
        const categoryMatch = cmd.categoryLabel.toLowerCase().includes(cleanQ);
        const keywordMatch = cmd.keywords?.some(k => k.toLowerCase().includes(cleanQ));
        return titleMatch || descMatch || categoryMatch || keywordMatch;
      })
    : allCommands;

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation within the command palette
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-200">
      <div 
        className="glass-panel rounded-3xl max-w-2xl w-full shadow-2xl border border-white/80 backdrop-blur-2xl overflow-hidden flex flex-col max-h-[82vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header Search Bar */}
        <div className="p-4 sm:p-5 border-b border-white/60 bg-white/50 backdrop-blur-xl flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Command className="h-4.5 w-4.5" />
          </div>

          <div className="flex-1 flex items-center gap-2">
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="输入指令或操作，例如：新建任务、智能课表、同步数据、导出备份..."
              className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 text-sm sm:text-base font-semibold focus:outline-hidden"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-white/80 rounded-lg text-[11px] text-slate-500 font-mono border border-slate-200/80 shadow-2xs">
            <span>ESC</span>
          </kbd>
        </div>

        {/* Command List Area */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 min-h-[300px] max-h-[500px]">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-14 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="h-6 w-6" />
              </div>
              <p className="text-slate-600 font-bold text-sm">未找到与 &quot;{query}&quot; 相关的指令</p>
              <p className="text-slate-400 text-xs">尝试搜索关键词如“新建”、“课表”、“同步”、“AI”或“备份”</p>
            </div>
          ) : (
            filteredCommands.map((cmd, index) => {
              const isSelected = index === selectedIndex;
              const IconComp = cmd.icon;

              return (
                <div
                  key={cmd.id}
                  data-index={index}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-4 py-3 rounded-2xl flex items-center justify-between gap-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                      : 'hover:bg-white/60 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                        isSelected
                          ? 'bg-white/20 text-white border-white/30'
                          : 'bg-white/90 text-indigo-600 border-white/80 shadow-2xs'
                      }`}
                    >
                      <IconComp className="h-4.5 w-4.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-xs sm:text-sm tracking-tight truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {cmd.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white border-white/30'
                              : 'bg-slate-100/80 text-slate-600 border-slate-200/80'
                          }`}
                        >
                          {cmd.categoryLabel}
                        </span>
                      </div>
                      {cmd.description && (
                        <p className={`text-[11px] font-medium truncate mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                          {cmd.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.shortcut && (
                      <kbd
                        className={`hidden sm:inline-block px-2 py-0.5 rounded-lg text-[10px] font-mono border ${
                          isSelected
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-white/80 text-slate-500 border-slate-200/80 shadow-2xs'
                        }`}
                      >
                        {cmd.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className={`h-4 w-4 transition-transform ${isSelected ? 'translate-x-0.5 text-white' : 'text-slate-300'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 px-5 border-t border-white/60 bg-white/40 backdrop-blur-xl flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 text-[10px] font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 text-[10px] font-mono">↓</kbd>
              <span>导航</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 text-[10px] font-mono">↵</kbd>
              <span>执行</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 text-[10px] font-mono">Esc</kbd>
              <span>关闭</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <Command className="h-3 w-3 text-blue-600" />
            <span>CampusOS 指令面板 · <kbd className="font-mono text-slate-600 font-bold">Ctrl+P</kbd></span>
          </div>
        </div>

      </div>
    </div>
  );
};
