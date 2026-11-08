import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, BellRing } from 'lucide-react';

interface TabOption {
  id: string;
  label: string;
  badge?: string;
}

interface OffScreenReminderBarProps {
  activeTabId?: string;
  tabs?: TabOption[];
  visitedTabIds?: string[];
  onSelectTab?: (id: string) => void;
  contextHint?: string;
}

export const OffScreenReminderBar: React.FC<OffScreenReminderBarProps> = ({
  activeTabId,
  tabs = [],
  visitedTabIds = [],
  onSelectTab,
  contextHint,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hasBelowFold, setHasBelowFold] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const visible = containerRef.current ? containerRef.current.offsetParent !== null : true;
      setIsVisible(visible);
      if (!visible) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const remaining = fullHeight - (scrollTop + viewportHeight);
      setHasBelowFold(remaining > 120);
      setIsScrolledDown(scrollTop > 260);
    };

    checkScroll();
    const timer = setTimeout(checkScroll, 180);
    window.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    window.addEventListener('tab-visibility-change', checkScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      window.removeEventListener('tab-visibility-change', checkScroll);
    };
  }, [activeTabId, tabs.length]);

  const unvisitedTabs = tabs.filter(
    (t) => t.id !== activeTabId && !visitedTabIds.includes(t.id)
  );
  const nextTab =
    unvisitedTabs[0] ||
    (tabs.length > 1
      ? tabs[(tabs.findIndex((t) => t.id === activeTabId) + 1) % tabs.length]
      : null);

  return (
    <div ref={containerRef}>
      {/* Inline Bottom Reminder Bar: reminds user about off-screen / other tab modules */}
      {tabs.length > 1 && onSelectTab && nextTab && (
        <div className="bg-slate-900/95 border border-cyan-500/30 rounded-xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <BellRing className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-slate-300 truncate">
              {unvisitedTabs.length > 0 ? (
                <>
                  屏外待看提醒：还有{' '}
                  <strong className="text-amber-300 font-semibold">
                    {unvisitedTabs.map((t) => t.label).join(' / ')}
                  </strong>{' '}
                  未查看
                </>
              ) : (
                <>{contextHint || '本屏核心要点已展示完毕，点击右侧可切换其他模块'}</>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectTab(nextTab.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="min-h-[34px] px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 active:scale-[0.98] text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all"
          >
            <span>切换至：{nextTab.label}</span>
            {nextTab.badge && (
              <span className="text-[10px] font-mono text-emerald-300">({nextTab.badge})</span>
            )}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Viewport Off-Screen Scroll Indicator (Only shows when active tab is visible and overflows current fold) */}
      {isVisible && (hasBelowFold || isScrolledDown) && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 z-30 flex items-center gap-2 pointer-events-none">
          {hasBelowFold ? (
            <button
              type="button"
              onClick={() =>
                window.scrollBy({ top: Math.round(window.innerHeight * 0.68), behavior: 'smooth' })
              }
              className="pointer-events-auto min-h-[38px] px-3.5 py-1.5 bg-slate-900/95 hover:bg-slate-800 text-amber-300 border border-amber-500/50 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <ChevronDown className="w-4 h-4 animate-bounce text-amber-400" />
              <span>屏外还有内容 · 点击下翻</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="pointer-events-auto min-h-[36px] px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl shadow-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-all"
            >
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>回顶部</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
