/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Download, Check, Code2 } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { GlobalCustomerBar } from './components/GlobalCustomerBar';
import { CustomerProvider } from './context/CustomerContext';
import { IntegratedBattleGuideView } from './components/IntegratedBattleGuideView';
import { FieldCopilotView } from './components/FieldCopilotView';
import { MasterPlaybookView } from './components/MasterPlaybookView';
import { DualGraphView } from './components/DualGraphView';
import { ThreeTierEngineView } from './components/ThreeTierEngineView';
import { FundingRadarView } from './components/FundingRadarView';
import { WhitepaperView } from './components/WhitepaperView';
import { AiTacticalDrawer } from './components/AiTacticalDrawer';
import { OfflineToastIndicator } from './components/MobileAppDownloadModal';

export default function App() {
  const [activeTab, setActiveTabState] = useState<string>('battle-guide');
  const [isAiDeduceOpen, setIsAiDeduceOpen] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);
  const scrollPositionsRef = useRef<Record<string, number>>({});

  const setActiveTab = (nextTab: string) => {
    if (nextTab === activeTab) return;
    scrollPositionsRef.current[activeTab] =
      window.scrollY || document.documentElement.scrollTop || 0;
    setActiveTabState(nextTab);
  };

  useEffect(() => {
    const savedScroll = scrollPositionsRef.current[activeTab] ?? 0;
    window.scrollTo({ top: savedScroll, behavior: 'instant' as ScrollBehavior });
    window.dispatchEvent(new Event('tab-visibility-change'));
  }, [activeTab]);

  const handleDownload = async (format: 'zip' | 'tar') => {
    setDownloading(format);
    try {
      const res = await fetch(`/api/download-source?format=${format}&t=${Date.now()}`);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        format === 'zip'
          ? 'fde-consultative-copilot-v2-source.zip'
          : 'fde-consultative-copilot-v2-source.tar.gz';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadedFormat(format);
      setTimeout(() => setDownloadedFormat(null), 3500);
    } catch {
      window.location.href = `/api/download-source?format=${format}&t=${Date.now()}`;
    } finally {
      setDownloading(null);
    }
  };

  return (
    <CustomerProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 md:pb-0">
        {/* Top Bar + Mobile Fixed Bottom Tab Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAiDeduce={() => setIsAiDeduceOpen(true)}
          onDownloadSource={() => handleDownload('zip')}
          isDownloadingSource={downloading === 'zip'}
          sourceDownloaded={downloadedFormat === 'zip'}
        />

        {/* Global Confirmed Customer Status & Cross-Industry 2B Switcher Bar */}
        <GlobalCustomerBar onNavigateToHome={() => setActiveTab('battle-guide')} />

        {/* Main Viewport Container - Keep all views mounted to preserve state across tab switches */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className={activeTab === 'battle-guide' ? 'block' : 'hidden'}>
            <IntegratedBattleGuideView
              onOpenAiDrawer={() => setIsAiDeduceOpen(true)}
              onJumpToModule={(tab) => {
                if (tab === 'crawler') setActiveTab('intel-radar');
                else if (tab === 'playbook') setActiveTab('master-playbook');
                else setActiveTab(tab);
              }}
            />
          </div>
          <div className={activeTab === 'copilot' ? 'block' : 'hidden'}>
            <FieldCopilotView
              onOpenAiDeduce={() => setIsAiDeduceOpen(true)}
              onNavigateToCrawler={() => setActiveTab('intel-radar')}
            />
          </div>
          <div className={activeTab === 'master-playbook' ? 'block' : 'hidden'}>
            <MasterPlaybookView />
          </div>
          <div className={activeTab === 'dual-graph' ? 'block' : 'hidden'}>
            <DualGraphView />
          </div>
          <div className={activeTab === 'strategy-engine' ? 'block' : 'hidden'}>
            <ThreeTierEngineView />
          </div>
          <div className={activeTab === 'intel-radar' ? 'block' : 'hidden'}>
            <FundingRadarView />
          </div>
          <div className={activeTab === 'whitepaper' ? 'block' : 'hidden'}>
            <WhitepaperView />
          </div>
        </main>

        {/* Quiet Corporate Footer with Updated Source Code Download Links */}
        <footer className="mt-auto border-t border-slate-900 bg-slate-950 px-4 sm:px-6 lg:px-8 py-4 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>FDE 销售与技术支持随身工作台 · 客户底牌 · 现场技术配合 · 找人与立项工具</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => handleDownload('zip')}
                disabled={downloading !== null}
                className="text-cyan-400 hover:text-cyan-300 font-semibold underline flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                {downloadedFormat === 'zip' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">已下载最新源码 (.zip)</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloading === 'zip' ? '打包中...' : '下载最新完整源码 (.zip)'}</span>
                  </>
                )}
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => handleDownload('tar')}
                disabled={downloading !== null}
                className="text-slate-400 hover:text-white underline cursor-pointer whitespace-nowrap"
              >
                {downloading === 'tar' ? '打包中...' : '下载最新完整源码 (.tar.gz)'}
              </button>
            </div>
          </div>
        </footer>

        {/* Mobile-First Bottom Sheet / Slide-Over AI Deduction Drawer */}
        <AiTacticalDrawer
          isOpen={isAiDeduceOpen}
          onClose={() => setIsAiDeduceOpen(false)}
        />

        {/* Offline Connectivity Toast */}
        <OfflineToastIndicator />
      </div>
    </CustomerProvider>
  );
}


