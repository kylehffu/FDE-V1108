import React, { useEffect, useState } from 'react';
import { RAYBIO_PRODUCTS, PRODUCT_STORY_EDGES } from '../data/mockData';
import { ProductNode, ProductEdge, ProductRelation } from '../types';
import { useCustomerContext } from '../context/CustomerContext';
import {
  GitBranch,
  ShieldCheck,
  Microscope,
  Layers,
  Zap,
  Check,
  RefreshCw,
  UserCheck,
} from 'lucide-react';

export const ProductStoryGraph: React.FC = () => {
  const { confirmedCustomer } = useCustomerContext();
  const [selectedNode, setSelectedNode] = useState<ProductNode>(RAYBIO_PRODUCTS[0]);
  const [activeRelationFilter, setActiveRelationFilter] = useState<string>('all');
  const [hoveredEdge, setHoveredEdge] = useState<ProductEdge | null>(null);
  const [syncNotice, setSyncNotice] = useState<string>('');

  const matchBestProductForCustomer = () => {
    if (!confirmedCustomer) return;
    const kw = `${confirmedCustomer.scholarName} ${confirmedCustomer.researchKeywords} ${confirmedCustomer.department}`;
    let matched = RAYBIO_PRODUCTS[0]; // default Cytek Aurora
    if (kw.includes('外泌体') || kw.includes('纳米')) {
      matched = RAYBIO_PRODUCTS.find((p) => p.id.includes('nanofcm')) || RAYBIO_PRODUCTS[0];
    } else if (kw.includes('消化') || kw.includes('空间') || kw.includes('病理')) {
      matched = RAYBIO_PRODUCTS.find((p) => p.id.includes('panovue')) || RAYBIO_PRODUCTS[0];
    } else if (kw.includes('流式') || kw.includes('MRD') || kw.includes('γδ') || kw.includes('尹芝南') || kw.includes('欧阳')) {
      matched = RAYBIO_PRODUCTS[0];
    }
    setSelectedNode(matched);
    setActiveRelationFilter('all');
    setSyncNotice(`已按「${confirmedCustomer.scholarName}」匹配最优产品组合链路`);
    setTimeout(() => setSyncNotice(''), 2500);
  };

  useEffect(() => {
    matchBestProductForCustomer();
  }, [
    confirmedCustomer?.id,
    confirmedCustomer?.scholarName,
    confirmedCustomer?.researchKeywords,
  ]);

  const relationFilters: { id: string; label: string; color: string }[] = [
    { id: 'all', label: '全部因果关系 (All Relations)', color: 'border-slate-700 text-slate-300' },
    { id: 'DownstreamValidationOf', label: '下游验证依赖 (Validation)', color: 'border-cyan-500/50 text-cyan-400' },
    { id: 'SpatialComplementOf', label: '原位空间互补 (Spatial)', color: 'border-purple-500/50 text-purple-400' },
    { id: 'ScaleBreakthroughOf', label: '物理尺度突破 (Scale)', color: 'border-amber-500/50 text-amber-400' },
    { id: 'OpExAlternativeOf', label: '服务降维替代 (OpEx)', color: 'border-emerald-500/50 text-emerald-400' },
  ];

  const filteredEdges =
    activeRelationFilter === 'all'
      ? PRODUCT_STORY_EDGES
      : PRODUCT_STORY_EDGES.filter((e) => e.relationship === activeRelationFilter);

  const getRelationColor = (rel: ProductRelation) => {
    switch (rel) {
      case 'DownstreamValidationOf':
        return '#06b6d4';
      case 'SpatialComplementOf':
        return '#a855f7';
      case 'ScaleBreakthroughOf':
        return '#f59e0b';
      case 'OpExAlternativeOf':
        return '#10b981';
      case 'RiskMitigationOf':
        return '#3b82f6';
      default:
        return '#64748b';
    }
  };

  const selectedNodeEdges = PRODUCT_STORY_EDGES.filter(
    (e) => e.source === selectedNode.id || e.target === selectedNode.id
  );

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[680px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden">
      {/* Left Canvas Visualizer */}
      <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
        {/* Canvas Toolbar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-200">
              产品故事图谱 · 当前适配客户：{confirmedCustomer?.scholarName || '欧阳涓'}（{confirmedCustomer?.department || '医学检验科'}）
            </span>
            <button
              type="button"
              onClick={matchBestProductForCustomer}
              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1 shadow-sm cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>手动运行 / 匹配「{confirmedCustomer?.scholarName || '当前客户'}」方案路径</span>
            </button>
            {syncNotice && (
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                ✓ {syncNotice}
              </span>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {relationFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveRelationFilter(f.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 border cursor-pointer ${
                  activeRelationFilter === f.id
                    ? 'bg-slate-800 text-white border-cyan-500/60 shadow-xs'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Node & Edge Canvas Stage */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
          <svg className="w-full h-[520px] max-w-[840px] select-none" viewBox="100 20 740 500">
            <defs>
              <marker
                id="arrow-cyan"
                viewBox="0 0 10 10"
                refX="24"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
              </marker>
              <marker
                id="arrow-purple"
                viewBox="0 0 10 10"
                refX="24"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
              </marker>
              <marker
                id="arrow-amber"
                viewBox="0 0 10 10"
                refX="24"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
              </marker>
              <marker
                id="arrow-emerald"
                viewBox="0 0 10 10"
                refX="24"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
              </marker>
            </defs>

            {/* Render Edges */}
            {filteredEdges.map((edge) => {
              const srcNode = RAYBIO_PRODUCTS.find((n) => n.id === edge.source);
              const tgtNode = RAYBIO_PRODUCTS.find((n) => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const isConnected =
                selectedNode.id === srcNode.id || selectedNode.id === tgtNode.id;
              const strokeColor = getRelationColor(edge.relationship);
              const markerId =
                edge.relationship === 'DownstreamValidationOf'
                  ? 'url(#arrow-cyan)'
                  : edge.relationship === 'SpatialComplementOf'
                  ? 'url(#arrow-purple)'
                  : edge.relationship === 'ScaleBreakthroughOf'
                  ? 'url(#arrow-amber)'
                  : 'url(#arrow-emerald)';

              const midX = (srcNode.x + tgtNode.x) / 2;
              const midY = (srcNode.y + tgtNode.y) / 2;

              return (
                <g
                  key={edge.id}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredEdge(edge)}
                  onMouseLeave={() => setHoveredEdge(null)}
                >
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={strokeColor}
                    strokeWidth={isConnected ? 3 : 1.5}
                    strokeDasharray={edge.relationship === 'OpExAlternativeOf' ? '4 3' : 'none'}
                    opacity={isConnected ? 0.95 : 0.35}
                    markerEnd={markerId}
                    className="transition-all duration-200"
                  />
                  <rect
                    x={midX - 35}
                    y={midY - 10}
                    width="70"
                    height="20"
                    rx="4"
                    fill="#0f172a"
                    stroke={strokeColor}
                    strokeWidth="1"
                    opacity={isConnected || hoveredEdge?.id === edge.id ? 0.95 : 0.25}
                  />
                  <text
                    x={midX}
                    y={midY + 3.5}
                    textAnchor="middle"
                    fill={strokeColor}
                    fontSize="9"
                    fontWeight="600"
                    opacity={isConnected || hoveredEdge?.id === edge.id ? 1 : 0.4}
                  >
                    {edge.relationship === 'DownstreamValidationOf'
                      ? '下游活体验证'
                      : edge.relationship === 'SpatialComplementOf'
                      ? '原位空间互补'
                      : edge.relationship === 'ScaleBreakthroughOf'
                      ? '尺度突破'
                      : '服务降维替代'}
                  </text>
                </g>
              );
            })}

            {/* Render Nodes */}
            {RAYBIO_PRODUCTS.map((node) => {
              const isSelected = selectedNode.id === node.id;
              const isCapEx = node.tier === 'CapEx';
              const nodeBg = isSelected
                ? isCapEx
                  ? '#1e293b'
                  : '#064e3b'
                : isCapEx
                ? '#0f172a'
                : '#022c22';
              const borderColor = isSelected
                ? isCapEx
                  ? '#38bdf8'
                  : '#34d399'
                : isCapEx
                ? '#334155'
                : '#065f46';

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer transition-all duration-200"
                >
                  {isSelected && (
                    <circle
                      r="40"
                      fill="none"
                      stroke={isCapEx ? '#38bdf8' : '#34d399'}
                      strokeWidth="2"
                      opacity="0.3"
                      className="animate-ping"
                    />
                  )}

                  <rect
                    x="-75"
                    y="-30"
                    width="150"
                    height="60"
                    rx="10"
                    fill={nodeBg}
                    stroke={borderColor}
                    strokeWidth={isSelected ? 2.5 : 1.2}
                    className="hover:stroke-cyan-400 transition-colors"
                  />

                  <text
                    x="-65"
                    y="-12"
                    fill={isCapEx ? '#38bdf8' : '#34d399'}
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    [{node.tier}] {node.brand}
                  </text>

                  <text x="-65" y="6" fill="#f1f5f9" fontSize="11" fontWeight="600">
                    {node.name.length > 11 ? node.name.slice(0, 10) + '...' : node.name}
                  </text>

                  <text
                    x="-65"
                    y="20"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {node.priceDisplay.split('/')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {hoveredEdge && (
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-900/95 border border-cyan-500/40 rounded-xl text-xs text-slate-200 shadow-xl flex items-center justify-between gap-4">
              <div>
                <span className="font-semibold text-cyan-400">因果叙事逻辑：</span>
                <span className="ml-1 text-slate-300">{hoveredEdge.causalStory}</span>
              </div>
              <div className="italic text-slate-400 text-[11px] shrink-0">
                “{hoveredEdge.salesPitch.slice(1, -1)}”
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Product & Battlecard Detail Drawer */}
      <div className="w-full lg:w-[420px] bg-slate-900/90 flex flex-col overflow-y-auto p-6 space-y-5">
        {confirmedCustomer && (
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>针对「{confirmedCustomer.scholarName}」定制切入建议</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              围绕【{confirmedCustomer.department} · {confirmedCustomer.researchKeywords}】，先找{' '}
              <strong className="text-amber-300">
                {confirmedCustomer.subPiNames?.split('、')[0] || 'L2分管二当家'}
              </strong>{' '}
              用 4.8万 OpEx 服务包跑通首批实测数据，再由{' '}
              <strong className="text-emerald-300">
                {confirmedCustomer.deptLeaderName?.split('（')[0] || confirmedCustomer.scholarName}
              </strong>{' '}
              拍板 {selectedNode.name} 年度立项。
            </p>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                selectedNode.tier === 'CapEx'
                  ? 'bg-sky-950/80 text-sky-400 border-sky-800'
                  : 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
              }`}
            >
              {selectedNode.tier} · {selectedNode.highlightTag}
            </span>
            <span className="text-xs font-mono text-slate-400">{selectedNode.priceDisplay}</span>
          </div>

          <h3 className="text-base font-bold text-white mt-2 leading-snug">{selectedNode.name}</h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedNode.summary}</p>
        </div>

        {/* Scientific Value Proposition */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <Microscope className="w-4 h-4" />
            <span>客户业务与科研实测价值</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-6">
            {selectedNode.scientificValue}
          </p>
        </div>

        {/* Key Specs */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>核心技术指标参数</span>
          </h4>
          <div className="space-y-1.5">
            {selectedNode.keySpecs.map((spec, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60"
              >
                <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lock-In Params / Battlecards */}
        {selectedNode.lockInParams.length > 0 && (
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>独家排他性控标参数 (提前3-6个月植入)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 pl-4 list-disc marker:text-amber-500">
              {selectedNode.lockInParams.map((param, i) => (
                <li key={i}>{param}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Competitor Weakness */}
        <div className="bg-slate-950/80 border border-rose-500/20 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
            <Zap className="w-4 h-4" />
            <span>友商死穴与对比卡 (Battlecards)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-6">
            {selectedNode.competitorWeakness}
          </p>
        </div>

        {/* Upstream & Downstream Story Connections */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5" />
            <span>关联产品组合节点 (工作流拓展)</span>
          </h4>
          <div className="space-y-2">
            {selectedNodeEdges.map((edge) => {
              const otherNodeId =
                edge.source === selectedNode.id ? edge.target : edge.source;
              const otherNode = RAYBIO_PRODUCTS.find((p) => p.id === otherNodeId);
              const isSource = edge.source === selectedNode.id;

              return (
                <button
                  key={edge.id}
                  onClick={() => otherNode && setSelectedNode(otherNode)}
                  className="w-full text-left p-2.5 bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1">
                    <span className="text-cyan-400 group-hover:text-cyan-300">
                      {isSource ? '→ 激活下游' : '← 源自上游'}：{otherNode?.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      [{edge.relationLabel}]
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                    {edge.salesPitch}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
