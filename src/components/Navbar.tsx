import React, { useState, useEffect } from 'react';
import { Layers, Radar, Network, Compass, Sparkles, Download, Check, Settings, Cpu } from 'lucide-react';
import { LlmSettingsModal } from './LlmSettingsModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiDeduce: () => void;
  onDownloadSource: () => void;
  isDownloadingSource?: boolean;
  sourceDownloaded?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiDeduce,
  onDownloadSource,
  isDownloadingSource = false,
  sourceDownloaded = false,
}) => {
  const [isLlmModalOpen, setIsLlmModalOpen] = useState(false);
  const [activeModelLabel, setActiveModelLabel] = useState<string>('LLM配置');

  const fetchLlmStatus = async () => {
    try {
      const res = await fetch('/api/llm/config');
      const json = await res.json();
      if (json && json.provider) {
        const p = json.provider;
        const providerName =
          p === 'nvidia'
            ? 'NVIDIA'
            : p === 'deepseek'
            ? 'DeepSeek'
            : p === 'gemini'
            ? 'Gemini'
            : p === 'qwen'
            ? '通义千问'
            : p === 'openai-compatible'
            ? 'OpenAI'
            : '自定义';
        setActiveModelLabel(`${providerName} · ${json.model}`);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchLlmStatus();
  }, []);

  const navItems = [
    { id: 'battle-guide', label: '客户拜访底牌' },
    { id: 'intel-radar', label: '在研项目与报计划' },
    { id: 'dual-graph', label: '找人与竞品防线' },
    { id: 'master-playbook', label: '跟单与异议话术' },
    { id: 'whitepaper', label: '立项与售后SOP库' },
  ];

  const mobileTabItems = [
    { id: 'battle-guide', label: '客户底牌', icon: Layers },
    { id: 'intel-radar', label: '项目立项', icon: Radar },
    { id: 'dual-graph', label: '找人防线', icon: Network },
    { id: 'master-playbook', label: '实战话术', icon: Compass },
  ];

  return (
    <>
      {/* Adaptive Top Bar (<= 56px height) */}
      <header className="sticky top-0 z-30 h-14 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl w-full h-full mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-6">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#battle-guide"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('battle-guide');
            }}
            className="text-sm sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            FDE 随身销售参谋
          </a>

          {/* Zone 2: 5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-slate-400">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(item.id);
                  }}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    isActive
                      ? 'text-white border-cyan-400 font-semibold'
                      : 'text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Model Config + Download Updated Source + Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Model Selector / Settings Button */}
            <button
              onClick={() => setIsLlmModalOpen(true)}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-300 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="配置 AI 大模型 API 网关 (DeepSeek, 通义千问, OpenAI, Gemini等)"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden sm:inline max-w-[130px] truncate">{activeModelLabel}</span>
              <span className="sm:hidden font-mono text-[11px]">LLM</span>
              <Settings className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={onDownloadSource}
              disabled={isDownloadingSource}
              className="min-h-[38px] px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              title="下载最新完整源码包 (.zip)"
            >
              {sourceDownloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400">已下载源码</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{isDownloadingSource ? '打包中...' : '下载源码 (.zip)'}</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenAiDeduce}
              className="min-h-[38px] px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-transform active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
            >
              AI 现场推演
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Tab Bar (Thumb-Zone Navigation Anchor, hidden on md+) */}
      <nav
        aria-label="移动端底部导航"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 min-h-[64px] pb-[env(safe-area-inset-bottom)] bg-slate-950/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-5 items-center px-1"
      >
        {mobileTabItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-medium tracking-tight mt-1 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* 5th Thumb Slot: Quick AI Deduction Sheet Trigger */}
        <button
          onClick={onOpenAiDeduce}
          className="min-h-[48px] flex flex-col items-center justify-center text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[11px] font-semibold tracking-tight mt-1 whitespace-nowrap">
            异议推演
          </span>
        </button>
      </nav>

      {/* LLM Settings Modal */}
      <LlmSettingsModal
        isOpen={isLlmModalOpen}
        onClose={() => setIsLlmModalOpen(false)}
        onConfigSaved={() => {
          fetchLlmStatus();
        }}
      />
    </>
  );
};
