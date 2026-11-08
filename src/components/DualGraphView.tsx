import React, { useState } from 'react';
import { DecisionChainTopologyGraph } from './DecisionChainTopologyGraph';
import { ProductStoryGraph } from './ProductStoryGraph';
import { AcademicSocialGraph } from './AcademicSocialGraph';
import { OffScreenReminderBar } from './OffScreenReminderBar';
import { GitBranch, Users, Network, ShieldAlert } from 'lucide-react';

type GraphTabId = 'topology' | 'social' | 'product';

export const DualGraphView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<GraphTabId>('topology');
  const [visitedSubTabs, setVisitedSubTabs] = useState<string[]>(['topology']);

  const selectSubTab = (tab: GraphTabId) => {
    setActiveSubTab(tab);
    if (!visitedSubTabs.includes(tab)) {
      setVisitedSubTabs((prev) => [...prev, tab]);
    }
  };

  const tabs: { id: GraphTabId; label: string; badge: string; icon: React.ReactNode }[] = [
    {
      id: 'topology',
      label: '内部找人与竞品防线图（谁拍板 · 谁签单 · 谁干活）',
      badge: '内部L1-L4 × 外部合作 × 友商防线',
      icon: <Network className="w-4 h-4" />,
    },
    {
      id: 'social',
      label: '同行与合作院所人脉网',
      badge: '熟人引荐路径',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'product',
      label: '小单带大单推进路径',
      badge: '小额测试单 ➔ 年度大设备',
      icon: <GitBranch className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-3.5">
      {/* Compact Header & 3-Tab Switcher */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>大老板见不到先找谁？现场哪家友商在公关？点击人物节点直接看打法</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-white mt-0.5">
            客户内部关键人分工、外部合作人脉与竞品防线
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {tabs.map((tab) => {
            const active = activeSubTab === tab.id;
            const isUnvisited = !visitedSubTabs.includes(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => selectSubTab(tab.id)}
                className={`relative min-h-[42px] px-3 py-1.5 rounded-lg flex items-center justify-between gap-2 text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {tab.icon}
                  <span className="truncate">{tab.label}</span>
                </div>
                {isUnvisited && (
                  <span
                    className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"
                    title="未读图谱"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Graph Component */}
      <div>
        {activeSubTab === 'topology' && <DecisionChainTopologyGraph />}
        {activeSubTab === 'social' && <AcademicSocialGraph />}
        {activeSubTab === 'product' && <ProductStoryGraph />}
      </div>

      <OffScreenReminderBar
        activeTabId={activeSubTab}
        tabs={tabs.map((t) => ({ id: t.id, label: t.label }))}
        visitedTabIds={visitedSubTabs}
        onSelectTab={(id) => selectSubTab(id as GraphTabId)}
      />
    </div>
  );
};
