import React, { useState, useRef } from 'react';
import { 
  User, 
  CreditCard, 
  BookOpen, 
  Wifi, 
  Building, 
  Settings, 
  RefreshCw, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck, 
  Info, 
  Moon, 
  Sun, 
  Volume2, 
  Bell, 
  Award,
  Sparkles,
  ExternalLink,
  Monitor
} from 'lucide-react';
import { UserProfile, AppSettings, Course, Task, Notice } from '../types';

interface ProfileTabProps {
  user: UserProfile;
  settings: AppSettings;
  courses?: Course[];
  tasks?: Task[];
  notices?: Notice[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onUpdateSettings: (updated: Partial<AppSettings>) => void;
  onResetData: () => void;
  onImportData?: (backupData: any) => Promise<any>;
  onOpenPwaModal?: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  settings,
  courses = [],
  tasks = [],
  notices = [],
  onUpdateUser,
  onUpdateSettings,
  onResetData,
  onImportData,
  onOpenPwaModal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user.username);
  const [tempMajor, setTempMajor] = useState(user.major);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('50');
  const [backupSuccessInfo, setBackupSuccessInfo] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSaveProfile = () => {
    onUpdateUser({
      username: tempName,
      major: tempMajor,
    });
    setIsEditing(false);
  };

  const handleRecharge = () => {
    const val = parseFloat(rechargeAmount) || 0;
    if (val > 0) {
      onUpdateUser({
        campus_card_balance: user.campus_card_balance + val,
      });
      setShowRechargeModal(false);
    }
  };

  const handleExportData = () => {
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

    setBackupSuccessInfo(`已成功导出 ${courses.length} 门课程、${tasks.length} 项待办、${notices.length} 条通知到 ${fileName}`);
    setTimeout(() => {
      setBackupSuccessInfo(null);
    }, 5000);
  };

  const handleImportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error('选取的不是合法的 JSON 格式文件');
      }

      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('JSON 根节点必须为配置对象');
      }

      if (onImportData) {
        const result = await onImportData(parsed);
        const stats = result?.stats;
        let details = '';
        if (stats) {
          details = `（课程+${stats.addedCourses}更新${stats.updatedCourses}，待办+${stats.addedTasks}更新${stats.updatedTasks}，通知+${stats.addedNotices}）`;
        }
        setImportStatus({
          type: 'success',
          message: `🎉 已成功导入并合并备份文件 [${file.name}] ${details}`,
        });
      }
    } catch (err: any) {
      console.error('[CampusOS] Import failed:', err);
      setImportStatus({
        type: 'error',
        message: `导入失败：${err.message || '文件解析错误，请确保使用 CampusOS 导出的 JSON 备份文件。'}`,
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => {
        setImportStatus(null);
      }, 6000);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      
      {/* 1. Student Identity Card (Liquid Dark Glass Obsidian Card) */}
      <div className="relative overflow-hidden rounded-3xl glass-dark text-white p-7 sm:p-9 shadow-2xl border border-white/20 backdrop-blur-2xl">
        {/* Specular Ambient Liquid Orbs inside card */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/4 w-56 h-56 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Avatar & Student Info */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-3xl bg-linear-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-500/30 border-2 border-white/40 backdrop-blur-md">
                {user.username.slice(0, 1)}
              </div>
              <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center shadow-xs" title="在线认证中">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-xs">
                  {user.username}
                </h2>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-500/25 text-blue-300 border border-blue-400/40 backdrop-blur-xs">
                  {user.grade}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-300 font-mono font-medium">
                学号：{user.student_id} · {user.class_name}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">
                {user.university} · {user.college} · {user.major}
              </div>
            </div>
          </div>

          {/* Quick Edit Trigger */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="self-start md:self-auto px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs sm:text-sm font-black backdrop-blur-xl border border-white/30 transition-all cursor-pointer shadow-md"
          >
            {isEditing ? '取消编辑' : '编辑个人资料'}
          </button>
        </div>

        {/* Edit profile drawer if active */}
        {isEditing && (
          <div className="mt-8 pt-8 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-2">姓名</label>
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-2">专业方向</label>
              <input
                type="text"
                value={tempMajor}
                onChange={e => setTempMajor(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-black rounded-2xl cursor-pointer shadow-md shadow-blue-500/30 transition-all active:scale-95"
              >
                保存变更
              </button>
            </div>
          </div>
        )}

        {/* Academic Stats Strip (Liquid Glass Cubes) */}
        <div className="mt-8 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white/10 hover:bg-white/15 transition-all backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-md">
            <div className="text-xs text-slate-300 font-semibold">当前学分绩点 GPA</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono mt-1.5 drop-shadow-xs">{user.gpa.toFixed(2)}</div>
          </div>
          <div className="bg-white/10 hover:bg-white/15 transition-all backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-md">
            <div className="text-xs text-slate-300 font-semibold">已修学分 / 毕业要求</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1.5 drop-shadow-xs">{user.credits_earned} / {user.credits_total}</div>
          </div>
          <div className="bg-white/10 hover:bg-white/15 transition-all backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-md">
            <div className="text-xs text-slate-300 font-semibold">一卡通账户余额</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1.5 drop-shadow-xs">¥{user.campus_card_balance.toFixed(2)}</div>
          </div>
          <div className="bg-white/10 hover:bg-white/15 transition-all backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-md">
            <div className="text-xs text-slate-300 font-semibold">图书馆在借图书</div>
            <div className="text-2xl sm:text-3xl font-black text-blue-300 font-mono mt-1.5 drop-shadow-xs">{user.library_books_borrowed} 本</div>
          </div>
        </div>
      </div>

      {/* 2. Integrated Campus Systems Matrix (Liquid Glass Container) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg sm:text-xl text-slate-900 flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-700 flex items-center justify-center font-bold">
              <Building className="h-4.5 w-4.5" />
            </div>
            <span>校园系统集成与绑定状态</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono font-medium">
            最后同步：{user.last_sync_time}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* CAS Academic */}
          <div className="p-5 rounded-2xl glass-panel-interactive flex flex-col justify-between space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-700 flex items-center justify-center font-bold shadow-2xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/25">
                已同步
              </span>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-900">综合教务系统 (CAS)</div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">课表/成绩/缓补考自动更新</div>
            </div>
          </div>

          {/* Campus Card */}
          <div className="p-5 rounded-2xl glass-panel-interactive flex flex-col justify-between space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-700 flex items-center justify-center font-bold shadow-2xs">
                <CreditCard className="h-5 w-5" />
              </div>
              <button
                onClick={() => setShowRechargeModal(true)}
                className="text-[10px] font-black text-blue-600 hover:text-blue-800 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                快捷充值
              </button>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-900">一卡通与消费码</div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">余额 ¥{user.campus_card_balance.toFixed(2)}</div>
            </div>
          </div>

          {/* Library */}
          <div className="p-5 rounded-2xl glass-panel-interactive flex flex-col justify-between space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-purple-500/15 border border-purple-500/25 text-purple-700 flex items-center justify-center font-bold shadow-2xs">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black text-purple-700 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                在借 3 本
              </span>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-900">大学图书馆借阅</div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">《算法导论》等将于9月20日到期</div>
            </div>
          </div>

          {/* Dorm & Network */}
          <div className="p-5 rounded-2xl glass-panel-interactive flex flex-col justify-between space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-700 flex items-center justify-center font-bold shadow-2xs">
                <Wifi className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 border border-cyan-500/20">
                网络在线
              </span>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-900">宿舍与校园网</div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">{user.dormitory_room}</div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. System Preferences & Settings (Liquid Glass Container) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="font-black text-lg sm:text-xl text-slate-900 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-slate-500/15 border border-slate-500/25 text-slate-700 flex items-center justify-center font-bold">
            <Settings className="h-4.5 w-4.5" />
          </div>
          <span>系统与偏好设置</span>
        </h3>

        <div className="divide-y divide-white/60 text-xs sm:text-sm">
          
          {/* Current Semester */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-slate-800">学期与开学周次</div>
              <div className="text-slate-500 text-[11px] sm:text-xs font-medium mt-0.5">当前处于：{settings.semester_name}</div>
            </div>
            <select
              value={settings.current_week}
              onChange={e => onUpdateSettings({ current_week: parseInt(e.target.value, 10) })}
              className="px-4 py-2.5 rounded-xl border border-white/80 bg-white/70 backdrop-blur-md font-bold text-slate-800 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map(w => (
                <option key={w} value={w}>
                  第 {w} 周
                </option>
              ))}
            </select>
          </div>

          {/* Auto CAS sync */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-slate-800">自动同步教务数据</div>
              <div className="text-slate-500 text-[11px] sm:text-xs font-medium mt-0.5">每次启动时自动检查课表变更与考试更新</div>
            </div>
            <input
              type="checkbox"
              checked={settings.auto_sync_cas}
              onChange={e => onUpdateSettings({ auto_sync_cas: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500 h-4.5 w-4.5 cursor-pointer"
            />
          </div>

          {/* Notification alerts */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-slate-800">考勤与待办提醒</div>
              <div className="text-slate-500 text-[11px] sm:text-xs font-medium mt-0.5">上课前20分钟及作业截止前推送桌面提醒</div>
            </div>
            <input
              type="checkbox"
              checked={settings.notification_alert}
              onChange={e => onUpdateSettings({ notification_alert: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500 h-4.5 w-4.5 cursor-pointer"
            />
          </div>

          {/* Add to Desktop / PWA Immersion Setting */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <span>添加到桌面 & PWA 沉浸模式</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 border border-blue-500/25">
                  独立视口
                </span>
              </div>
              <div className="text-slate-500 text-[11px] sm:text-xs font-medium mt-0.5">
                支持在浏览器中点击一键“添加到桌面”并导出轻量化 PWA 配置文件 (manifest.json)
              </div>
            </div>
            <button
              id="profile-pwa-install-btn"
              onClick={() => {
                if (onOpenPwaModal) onOpenPwaModal();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <Monitor className="h-4 w-4" />
              <span>添加到桌面 / 导出 PWA</span>
            </button>
          </div>

          {/* Data Backup & Reset */}
          <div className="py-5 space-y-3 pt-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <span>数据管理与本地备份/恢复</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/20">
                    JSON格式
                  </span>
                </div>
                <div className="text-slate-500 text-[11px] sm:text-xs font-medium mt-0.5">
                  支持一键导出或解析合并外部 JSON 备份文件（涵盖课表、待办、通知与个性化设置）
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Hidden File Input for Import */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportFileChange}
                  className="hidden"
                />

                {/* Export Button */}
                <button
                  id="profile-backup-data-btn"
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-black cursor-pointer transition-all shadow-md shadow-blue-500/25 border border-white/30 active:scale-95"
                >
                  <Download className="h-4 w-4" />
                  <span>备份数据 (导出JSON)</span>
                </button>

                {/* Import Button */}
                <button
                  id="profile-import-data-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white text-slate-800 text-xs sm:text-sm font-black cursor-pointer transition-all shadow-sm border border-slate-200/80 active:scale-95"
                >
                  <Upload className="h-4 w-4 text-indigo-600" />
                  <span>导入数据 (JSON合并)</span>
                </button>

                {/* Reset Demo Button */}
                <button
                  onClick={() => {
                    if (confirm('确认恢复所有演示课表与通知数据吗？')) {
                      onResetData();
                    }
                  }}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/25 text-rose-700 text-xs sm:text-sm font-bold cursor-pointer transition-all active:scale-95"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>重置演示</span>
                </button>
              </div>
            </div>

            {/* Export Success Feedback Toast */}
            {backupSuccessInfo && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-medium flex items-center gap-2.5 backdrop-blur-xs animate-in fade-in slide-in-from-top-1 duration-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{backupSuccessInfo}</span>
              </div>
            )}

            {/* Import Status Feedback Toast */}
            {importStatus && (
              <div
                className={`p-3.5 rounded-2xl border text-xs font-medium flex items-center gap-2.5 backdrop-blur-xs animate-in fade-in slide-in-from-top-1 duration-200 ${
                  importStatus.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-800'
                }`}
              >
                {importStatus.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                )}
                <span>{importStatus.message}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 4. About CampusOS (Liquid Glass Card) */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-blue-200/60 text-xs text-slate-600 space-y-2 bg-linear-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5">
        <div className="font-black text-slate-800 text-sm flex items-center gap-2">
          <Info className="h-4.5 w-4.5 text-blue-600" />
          <span>关于 CampusOS 智能校园操作系统</span>
        </div>
        <p className="leading-relaxed font-medium">
          CampusOS 是面向大学生的新一代智能校园操作系统，以“信息聚合、零学习成本、AI赋能”为核心，无缝整合教务、学工、课表、竞赛与实习雷达，助力提升大学生的学习与科研效率。
        </p>
      </div>

      {/* Recharge Modal (Frosted Liquid Glass Modal) */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-5 shadow-2xl border border-white/80 backdrop-blur-2xl">
            <h4 className="font-black text-lg text-slate-900">一卡通快捷充值模拟</h4>
            <p className="text-xs text-slate-500 font-medium">
              当前账户余额：<span className="font-bold text-emerald-600 font-mono">¥{user.campus_card_balance.toFixed(2)}</span>
            </p>
            <div className="grid grid-cols-3 gap-3">
              {['20', '50', '100'].map(amt => (
                <button
                  key={amt}
                  onClick={() => setRechargeAmount(amt)}
                  className={`py-3 rounded-2xl text-xs font-black border transition-all cursor-pointer active:scale-95 ${
                    rechargeAmount === amt
                      ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white border-white/40 shadow-md shadow-blue-500/25'
                      : 'bg-white/70 text-slate-700 border-white/90 hover:bg-white'
                  }`}
                >
                  ¥{amt}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowRechargeModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100/60 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleRecharge}
                className="px-5 py-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-blue-500/25 border border-white/30 cursor-pointer active:scale-95"
              >
                确认充值
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
