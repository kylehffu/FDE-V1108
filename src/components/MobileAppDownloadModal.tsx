import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  Check,
  X,
  ShieldCheck,
  Monitor,
  Tablet,
  Sparkles,
  ExternalLink,
  Copy,
  Layers,
  WifiOff,
} from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';

export type ViewportPreviewMode = 'auto' | 'mobile-390' | 'tablet-768';

interface MobileAppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewportMode: ViewportPreviewMode;
  onChangeViewportMode: (mode: ViewportPreviewMode) => void;
}

export const MobileAppDownloadModal: React.FC<MobileAppDownloadModalProps> = ({
  isOpen,
  onClose,
  viewportMode,
  onChangeViewportMode,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [downloadingApk, setDownloadingApk] = useState(false);
  const [apkDownloaded, setApkDownloaded] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const shareUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-lfnhxod6gtdgymavhjdscm-102222692521.asia-northeast1.run.app';

  const handleDownloadApk = async () => {
    setDownloadingApk(true);
    try {
      const response = await fetch('/api/download-apk');
      if (!response.ok) throw new Error('APK download failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'FDE-Sales-Copilot-v2.0.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setApkDownloaded(true);
      setTimeout(() => setApkDownloaded(false), 4000);
    } catch {
      window.location.href = '/api/download-apk';
    } finally {
      setDownloadingApk(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareUrl}/api/download-apk`);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                FDE 随身销售参谋 · 移动端 APK 下载与多屏自适应中心
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                支持 Android 原生 APK 安装包下载、全平台 PWA 桌面直装，以及手机/折叠屏/平板全尺寸自适应布局
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="关闭窗口"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 mt-5">
          {/* Primary Section 1: Direct Android APK Download */}
          <div className="rounded-xl bg-slate-950/90 border border-cyan-500/40 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>方式一：Android 独立安装包 (.APK) · RSA-2048 V1+V2 双重签名</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  FDE-Sales-Copilot-v2.0.apk（全行业 2B 自适应屏幕版）
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  包名 <span className="font-mono text-slate-300">com.fde.salescopilot</span> · 适用 Android 5.0 ~ 15 及鸿蒙 HarmonyOS · 内置硬件加速自适应 WebView 内核，自动适配直板手机、折叠屏展开态、平板横竖屏切换与异形刘海屏安全区。
                </p>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={handleDownloadApk}
                  disabled={downloadingApk}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 transition-transform active:scale-[0.98] cursor-pointer whitespace-nowrap"
                >
                  {apkDownloaded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>已开始下载 APK</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>{downloadingApk ? '正在打包下载...' : '立即下载 .APK 安装包'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/80 text-xs text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">已复制 APK 直链（可发微信/手机浏览器打开）</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>复制 APK 手机下载直链</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Technical Adaptive Screen Specs */}
            <div className="mt-4 pt-3.5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-400">
              <div className="bg-slate-900/60 rounded-lg px-3 py-2 border border-slate-800/60">
                <span className="text-slate-200 font-semibold block">多尺寸流式视口</span>
                <span>320px 小屏手机 ~ 768px 折叠屏 ~ 1440px 桌面端无损缩放</span>
              </div>
              <div className="bg-slate-900/60 rounded-lg px-3 py-2 border border-slate-800/60">
                <span className="text-slate-200 font-semibold block">拇指热区底部导航</span>
                <span>手机端自动启用 5 槽位固定底栏 + 触控拓扑图手势缩放</span>
              </div>
              <div className="bg-slate-900/60 rounded-lg px-3 py-2 border border-slate-800/60">
                <span className="text-slate-200 font-semibold block">离线缓存与秒开</span>
                <span>内置 Service Worker 预缓存核心客户档案与话术库</span>
              </div>
            </div>
          </div>

          {/* Primary Section 2: Native PWA One-Click Home Screen Install */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <span>方式二：PWA 原生级桌面直装（免开启“未知来源应用”权限 · 推荐 iOS / 鸿蒙 / 安卓）</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  一键添加到手机主屏幕（独立全屏运行 · 隐藏浏览器地址栏）
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isInstalled
                    ? '当前已处于独立 App 全屏运行模式（Standalone Mode），具备原生 App 图标与离线缓存能力。'
                    : isIOS
                    ? 'iOS Safari 用户：点击浏览器底部【分享】按钮 ➔ 下滑选择【添加到主屏幕】，即可生成独立全屏 App。'
                    : '在手机 Chrome / Edge / 华为浏览器中打开本页，点击右侧按钮或浏览器菜单【安装应用 / 添加到主屏幕】即可秒装。'}
                </p>
              </div>

              {!isInstalled && isInstallable && (
                <button
                  onClick={install}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-[0.98] cursor-pointer whitespace-nowrap"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>一键安装到桌面</span>
                </button>
              )}

              {!isInstalled && !isInstallable && (
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 text-xs font-medium flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>独立窗口打开以安装</span>
                </a>
              )}
            </div>
          </div>

          {/* Primary Section 3: Live Adaptive Screen Preview Switcher */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>实时检验「自适应屏幕」布局效果</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  不仅在真机上自动适配，您也可以立即在当前屏幕上切换不同终端视口宽度，实时体验手机竖屏与折叠屏自适应排版：
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => {
                  onChangeViewportMode('auto');
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  viewportMode === 'auto'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  {viewportMode === 'auto' && (
                    <span className="text-[11px] font-semibold text-cyan-300">当前激活</span>
                  )}
                </div>
                <div className="text-xs font-bold mt-2">全屏流式自适应 (默认)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  100% 贴合当前设备真实屏幕宽度
                </div>
              </button>

              <button
                onClick={() => {
                  onChangeViewportMode('mobile-390');
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  viewportMode === 'mobile-390'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  {viewportMode === 'mobile-390' && (
                    <span className="text-[11px] font-semibold text-cyan-300">当前激活</span>
                  )}
                </div>
                <div className="text-xs font-bold mt-2">手机竖屏视口 (390px)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  模拟 APK 在安卓/iPhone 手机上的单手操作布局
                </div>
              </button>

              <button
                onClick={() => {
                  onChangeViewportMode('tablet-768');
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  viewportMode === 'tablet-768'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Tablet className="w-4 h-4 text-amber-400" />
                  {viewportMode === 'tablet-768' && (
                    <span className="text-[11px] font-semibold text-cyan-300">当前激活</span>
                  )}
                </div>
                <div className="text-xs font-bold mt-2">折叠屏/平板视口 (768px)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  模拟折叠屏展开态与 iPad 随身拜访展示布局
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OfflineToastIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/95 px-3.5 py-2 text-xs font-semibold text-slate-950 shadow-lg">
      <WifiOff className="w-4 h-4" />
      <span>离线模式 · 已启用本地缓存档案库与作战话术</span>
    </div>
  );
};
