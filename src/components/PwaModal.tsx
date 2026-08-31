import React, { useState } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Download, 
  CheckCircle2, 
  X, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  Laptop,
  Layers,
  ArrowRight
} from 'lucide-react';
import { UserProfile, AppSettings } from '../types';

interface PwaModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  settings: AppSettings;
  deferredPrompt: any | null;
  onPromptInstall: () => void;
  onShowToast: (msg: string) => void;
}

export const PwaModal: React.FC<PwaModalProps> = ({
  isOpen,
  onClose,
  user,
  settings,
  deferredPrompt,
  onPromptInstall,
  onShowToast,
}) => {
  const [platformTab, setPlatformTab] = useState<'desktop' | 'ios' | 'android'>('desktop');
  const [hasExported, setHasExported] = useState(false);

  if (!isOpen) return null;

  // Generate lightweight customized PWA configuration
  const handleExportManifest = () => {
    const customManifest = {
      name: `CampusOS 智能校园 (${user.username})`,
      short_name: "CampusOS",
      description: "AI驱动的现代化校园全功能操作系统，支持离线课表、待办与AI辅导",
      start_url: "/",
      id: `/?user=${encodeURIComponent(user.student_id)}`,
      display: "standalone",
      orientation: "portrait-primary",
      background_color: "#f8fafc",
      theme_color: "#2563eb",
      scope: "/",
      lang: "zh-CN",
      categories: ["education", "productivity"],
      icons: [
        {
          src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'><path d='M22 10v6M2 10l10-5 10 5-10 5z'/><path d='M6 12v5c3 3 9 3 12 0v-5'/></svg>",
          sizes: "192x192 512x512",
          type: "image/svg+xml",
          purpose: "any maskable"
        }
      ],
      user_profile: {
        student_id: user.student_id,
        username: user.username,
        university: user.university,
        college: user.college,
        major: user.major
      },
      exported_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(customManifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campusos-pwa-manifest-${user.student_id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setHasExported(true);
    onShowToast(`已导出轻量化 PWA 配置文件 (campusos-pwa-manifest-${user.student_id}.json)`);
    setTimeout(() => setHasExported(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="glass-panel rounded-3xl max-w-xl w-full shadow-2xl border border-white/80 backdrop-blur-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/60 bg-white/50 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Monitor className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-slate-900">添加到桌面 & PWA 沉浸配置</h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 border border-blue-500/25">
                  Standalone PWA
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                将 CampusOS 安装为独立桌面应用，摆脱浏览器标签限制
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/60 cursor-pointer transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          
          {/* Direct Install Action Bar */}
          <div className="p-4 rounded-2xl bg-linear-to-r from-blue-600/10 via-indigo-600/10 to-violet-600/10 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-black text-slate-800 text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>即刻以独立窗口运行</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {deferredPrompt ? '检测到当前浏览器支持快速添加到系统桌面！' : '若浏览器弹出安装提示，点击下方按钮即可一键添加。'}
              </p>
            </div>

            <button
              id="pwa-trigger-install-btn"
              onClick={() => {
                if (deferredPrompt) {
                  onPromptInstall();
                } else {
                  onShowToast('可参考下方平台指南，在浏览器菜单中选择“安装应用”或“添加到主屏幕”');
                }
              }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-black transition-all shadow-md shadow-blue-500/25 border border-white/20 active:scale-95 cursor-pointer shrink-0"
            >
              <Monitor className="h-4 w-4" />
              <span>{deferredPrompt ? '添加到系统桌面' : '触发安装提示'}</span>
            </button>
          </div>

          {/* Export Manifest Box */}
          <div className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-2">
                  <Download className="h-4 w-4 text-indigo-600" />
                  <span>导出轻量化 PWA 配置文件 (JSON)</span>
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                  生成包含学号（{user.student_id}）、个性化主题与独立视口参数的标准 Web Manifest
                </div>
              </div>

              <button
                id="pwa-export-manifest-btn"
                onClick={handleExportManifest}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0 self-start sm:self-auto"
              >
                {hasExported ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <Download className="h-3.5 w-3.5" />}
                <span>{hasExported ? '已成功导出' : '导出 manifest.json'}</span>
              </button>
            </div>
          </div>

          {/* Platform Step-by-Step Guide Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 tracking-wider">各平台快速添加指南</span>
              <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
                <button
                  onClick={() => setPlatformTab('desktop')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    platformTab === 'desktop' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  电脑桌面 (Chrome/Edge)
                </button>
                <button
                  onClick={() => setPlatformTab('ios')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    platformTab === 'ios' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  iOS / iPadOS
                </button>
                <button
                  onClick={() => setPlatformTab('android')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    platformTab === 'android' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Android
                </button>
              </div>
            </div>

            {/* Platform Guides */}
            <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-2.5 text-xs text-slate-600 leading-relaxed font-medium">
              {platformTab === 'desktop' && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <span>点击 Chrome / Edge 浏览器地址栏右侧的 <strong>“安装应用”</strong> 图标（或右上角菜单 <strong>更多工具 ➔ 创建快捷方式 / 安装 CampusOS</strong>）。</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <span>勾选 <strong>“在单独的窗口中打开”</strong> 并确认安装。</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <span>CampusOS 将以原生无边框独立桌面 App 窗口秒速启动！</span>
                  </div>
                </div>
              )}

              {platformTab === 'ios' && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <span>使用 Safari 浏览器打开当前页面，点击底部工具栏的 <strong>分享图标 (Share)</strong>。</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <span>在弹出菜单中向下轻扫，找到并点击 <strong>“添加到主屏幕 (Add to Home Screen)”</strong>。</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <span>点击右上角 <strong>“添加”</strong>，桌面将生成专属 CampusOS 图标，点击全屏无缝沉浸启动。</span>
                  </div>
                </div>
              )}

              {platformTab === 'android' && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <span>使用 Chrome / Edge 等浏览器打开，点击右上角 <strong>三点菜单 (⋮)</strong>。</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <span>选择 <strong>“添加到主屏幕”</strong> 或 <strong>“安装应用程序”</strong>。</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <span>桌面图标创建完成，支持原生多任务分屏与全功能离线加载。</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/60 bg-white/40 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>基于标准 Web App Manifest · 纯前端零侵入运行</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            完成
          </button>
        </div>

      </div>
    </div>
  );
};
