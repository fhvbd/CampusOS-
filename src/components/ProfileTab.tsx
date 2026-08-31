import React, { useState } from 'react';
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
  ShieldCheck, 
  Info, 
  Moon, 
  Sun, 
  Volume2, 
  Bell, 
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { UserProfile, AppSettings } from '../types';

interface ProfileTabProps {
  user: UserProfile;
  settings: AppSettings;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onUpdateSettings: (updated: Partial<AppSettings>) => void;
  onResetData: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  settings,
  onUpdateUser,
  onUpdateSettings,
  onResetData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user.username);
  const [tempMajor, setTempMajor] = useState(user.major);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('50');

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
      user,
      settings,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CampusOS_Backup_${user.student_id}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Student Identity Card */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Avatar & Student Info */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white/20">
                {user.username.slice(0, 1)}
              </div>
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center" title="在线认证中">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {user.username}
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {user.grade}
                </span>
              </div>
              <div className="text-xs text-slate-300 font-mono">
                学号：{user.student_id} · {user.class_name}
              </div>
              <div className="text-xs text-slate-400">
                {user.university} · {user.college} · {user.major}
              </div>
            </div>
          </div>

          {/* Quick Edit Trigger */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/15 transition-colors cursor-pointer"
          >
            {isEditing ? '取消编辑' : '编辑个人资料'}
          </button>
        </div>

        {/* Edit profile drawer if active */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">姓名</label>
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">专业方向</label>
              <input
                type="text"
                value={tempMajor}
                onChange={e => setTempMajor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                保存变更
              </button>
            </div>
          </div>
        )}

        {/* Academic Stats Strip */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-[11px] text-slate-400">当前学分绩点 GPA</div>
            <div className="text-lg font-extrabold text-amber-300 font-mono mt-0.5">{user.gpa.toFixed(2)}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-[11px] text-slate-400">已修学分 / 毕业要求</div>
            <div className="text-lg font-extrabold text-white font-mono mt-0.5">{user.credits_earned} / {user.credits_total}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-[11px] text-slate-400">一卡通账户余额</div>
            <div className="text-lg font-extrabold text-emerald-400 font-mono mt-0.5">¥{user.campus_card_balance.toFixed(2)}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-[11px] text-slate-400">图书馆在借图书</div>
            <div className="text-lg font-extrabold text-blue-300 font-mono mt-0.5">{user.library_books_borrowed} 本</div>
          </div>
        </div>
      </div>

      {/* 2. Integrated Campus Systems Matrix */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Building className="h-4 w-4 text-blue-600" />
            <span>校园系统集成与绑定状态</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            最后同步：{user.last_sync_time}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* CAS Academic */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                已同步
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">综合教务系统 (CAS)</div>
              <div className="text-[11px] text-slate-500 mt-0.5">课表/成绩/缓补考自动更新</div>
            </div>
          </div>

          {/* Campus Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CreditCard className="h-4 w-4" />
              </div>
              <button
                onClick={() => setShowRechargeModal(true)}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                充值
              </button>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">一卡通与消费码</div>
              <div className="text-[11px] text-slate-500 mt-0.5">余额 ¥{user.campus_card_balance.toFixed(2)}</div>
            </div>
          </div>

          {/* Library */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                在借 3 本
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">大学图书馆借阅</div>
              <div className="text-[11px] text-slate-500 mt-0.5">《算法导论》等将于9月20日到期</div>
            </div>
          </div>

          {/* Dorm & Network */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                <Wifi className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                网络在线
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">宿舍与校园网</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{user.dormitory_room}</div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. System Preferences & Settings */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Settings className="h-4 w-4 text-slate-600" />
          <span>系统与偏好设置</span>
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          
          {/* Current Semester */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-slate-800">学期与开学周次</div>
              <div className="text-slate-500 text-[11px]">当前处于：{settings.semester_name}</div>
            </div>
            <select
              value={settings.current_week}
              onChange={e => onUpdateSettings({ current_week: parseInt(e.target.value, 10) })}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map(w => (
                <option key={w} value={w}>
                  第 {w} 周
                </option>
              ))}
            </select>
          </div>

          {/* Auto CAS sync */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-slate-800">自动同步教务数据</div>
              <div className="text-slate-500 text-[11px]">每次启动时自动检查课表变更与考试更新</div>
            </div>
            <input
              type="checkbox"
              checked={settings.auto_sync_cas}
              onChange={e => onUpdateSettings({ auto_sync_cas: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
            />
          </div>

          {/* Notification alerts */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-slate-800">考勤与待办提醒</div>
              <div className="text-slate-500 text-[11px]">上课前20分钟及作业截止前推送桌面提醒</div>
            </div>
            <input
              type="checkbox"
              checked={settings.notification_alert}
              onChange={e => onUpdateSettings({ notification_alert: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
            />
          </div>

          {/* Data Backup & Reset */}
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
            <div>
              <div className="font-bold text-slate-800">数据管理与备份</div>
              <div className="text-slate-500 text-[11px]">导出完整课表与待办配置，或恢复演示初值</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>导出数据</span>
              </button>
              <button
                onClick={() => {
                  if (confirm('确认恢复所有演示课表与通知数据吗？')) {
                    onResetData();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>重置为初始演示</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 4. About CampusOS */}
      <div className="rounded-2xl bg-slate-100/80 p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
          <Info className="h-4 w-4 text-blue-600" />
          <span>关于 CampusOS 智能校园操作系统</span>
        </div>
        <p className="leading-relaxed">
          CampusOS 是面向大学生的新一代智能校园操作系统，以“信息聚合、零学习成本、AI赋能”为核心，无缝整合教务、学工、课表、竞赛与实习雷达，助力提升大学生的学习与科研效率。
        </p>
      </div>

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <h4 className="font-extrabold text-base text-slate-900">一卡通快捷充值模拟</h4>
            <p className="text-xs text-slate-500">
              当前账户余额：¥{user.campus_card_balance.toFixed(2)}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {['20', '50', '100'].map(amt => (
                <button
                  key={amt}
                  onClick={() => setRechargeAmount(amt)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    rechargeAmount === amt
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ¥{amt}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRechargeModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleRecharge}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
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
