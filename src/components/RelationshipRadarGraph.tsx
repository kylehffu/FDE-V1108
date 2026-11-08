import React, { useEffect, useMemo, useState } from 'react';
import {
  Radar,
  Network,
  Users,
  FileText,
  Database,
  Building2,
  Search,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Check,
  ArrowRight,
  Compass,
  Mail,
  History,
  ChevronRight,
} from 'lucide-react';
import { useCustomerContext, ConfirmedCustomerProfile } from '../context/CustomerContext';

export type RadarNodeCategory =
  | 'target'
  | 'mentor_pi'
  | 'co_pi'
  | 'first_author'
  | 'co_author'
  | 'second_hop_peer'
  | 'paper_node'
  | 'grant_node'
  | 'org_entity';

export interface RadarGraphNode {
  id: string;
  label: string;
  subLabel: string;
  category: RadarNodeCategory;
  ring: 0 | 1 | 2 | 3;
  institution: string;
  department: string;
  email?: string;
  roleTitle: string;
  relationToTarget: string;
  evidenceItems: string[];
  salesRoleAndAction: string;
  greetingScript?: string;
  canPivotSearch?: boolean;
  pivotInstitution?: string;
  pivotDepartment?: string;
  pivotScholarName?: string;
}

export interface RadarGraphEdge {
  id: string;
  source: string;
  target: string;
  relationType:
    | 'mentor_of'
    | 'co_author_on'
    | 'authored_paper'
    | 'funded_by'
    | 'second_hop_lab'
    | 'cross_dept_collab'
    | 'affiliated_with';
  label: string;
  weight: number;
}

export interface RadarGraphPayload {
  centerTarget: {
    name: string;
    englishName: string;
    institution: string;
    department: string;
    roleBadge: string;
    personTier: 'L1' | 'L2';
    researchKeywords: string;
    totalPapers: number;
    totalGrants: number;
    totalDirectPeople: number;
    totalSecondHopPeople: number;
  };
  nodes: RadarGraphNode[];
  edges: RadarGraphEdge[];
}

interface PivotBreadcrumb {
  institution: string;
  department: string;
  scholarName: string;
  researchKeywords: string;
}

function buildInstantFallbackRadarGraph(
  customer: ConfirmedCustomerProfile,
  deepProfile?: any
): RadarGraphPayload {
  const nodes: RadarGraphNode[] = [];
  const edges: RadarGraphEdge[] = [];
  const isYouth = customer.personTier === 'L2';

  const targetId = 'node-target-center';
  nodes.push({
    id: targetId,
    label: customer.scholarName,
    subLabel: `${customer.institution} · ${customer.department}`,
    category: 'target',
    ring: 0,
    institution: customer.institution,
    department: customer.department,
    roleTitle: customer.title || (isYouth ? '第一作者青年科研骨干' : '学科带头人 / 课题组长 PI'),
    relationToTarget: '当前雷达锁定核心靶心（0度中心节点）',
    evidenceItems: [
      `所属单位：${customer.institution}`,
      `所属科室/中心：${customer.department}`,
      `核心方向：${customer.researchKeywords}`,
    ],
    salesRoleAndAction: isYouth
      ? '作为一线实验主将与第一作者，可先提供 2 例样本免费预实验解决流式/荧光痛点，再穿透背后通讯导师拍板。'
      : '作为课题组顶层负责人，可双线推进纵向课题测试直签与年度平台仪器修购。',
    greetingScript: `“${customer.scholarName}老师您好！针对咱们团队在「${customer.researchKeywords}」方向的研究，我们备好了配套流式与多色空间染色预实验方案供您验证！”`,
    canPivotSearch: false,
  });

  // Extract people from deepProfile.fullPersonnelNetwork or customer fields
  const personnelList: any[] = deepProfile?.fullPersonnelNetwork || [];
  if (personnelList.length > 0) {
    personnelList.forEach((p, idx) => {
      const cleanPName = String(p.name || '')
        .replace(/·?\s*【当前锁定客户】/g, '')
        .trim();
      if (!cleanPName || cleanPName.includes(customer.scholarName)) return;

      const isMentor =
        String(p.tier || '').includes('L1') || String(p.tier || '').includes('通讯');
      const isFirst =
        String(p.tier || '').includes('一作') || String(p.tier || '').includes('L4');
      const nodeId = `local-person-${idx}`;

      nodes.push({
        id: nodeId,
        label: cleanPName,
        subLabel: p.titleAndUnit || `${customer.institution} · ${customer.department}`,
        category: isMentor ? 'mentor_pi' : isFirst ? 'first_author' : 'co_author',
        ring: 1,
        institution: customer.institution,
        department: customer.department,
        roleTitle: p.tier || '关联学者',
        relationToTarget: p.relationToTarget || '同课题组核心关联成员',
        evidenceItems: [
          `职务与归属：${p.titleAndUnit || customer.department}`,
          `业务关联：${p.relationToTarget || customer.researchKeywords}`,
        ],
        salesRoleAndAction: p.budgetAndSalesRole || '协同攻单关键节点',
        canPivotSearch: true,
        pivotInstitution: customer.institution,
        pivotDepartment: customer.department,
        pivotScholarName: cleanPName.replace(/\(.*?\)|（.*?）/g, '').split('/')[0].trim(),
      });

      edges.push({
        id: `local-edge-p-${idx}`,
        source: isMentor ? nodeId : targetId,
        target: isMentor ? targetId : nodeId,
        relationType: isMentor ? 'mentor_of' : 'co_author_on',
        label: isMentor ? '通讯导师 / 顶层负责人' : '课题组共署与协作',
        weight: isMentor ? 5 : 3,
      });
    });
  } else {
    if (customer.deptLeaderName && customer.deptLeaderName !== customer.scholarName) {
      customer.deptLeaderName
        .split(/[&、/，,]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((leader, idx) => {
          const nodeId = `local-mentor-${idx}`;
          nodes.push({
            id: nodeId,
            label: leader,
            subLabel: `通讯作者导师 / 课题组 PI · ${customer.department}`,
            category: 'mentor_pi',
            ring: 1,
            institution: customer.institution,
            department: customer.department,
            roleTitle: 'L1 通讯作者导师 / 纵向课题持有人',
            relationToTarget: `${customer.scholarName} 的通讯作者导师`,
            evidenceItems: [`所属单位：${customer.institution} · ${customer.department}`],
            salesRoleAndAction: '掌管课题组纵向经费签字权，可由一作引荐汇报拍板。',
            canPivotSearch: true,
            pivotInstitution: customer.institution,
            pivotDepartment: customer.department,
            pivotScholarName: leader.replace(/\(.*?\)|（.*?）/g, '').trim(),
          });
          edges.push({
            id: `local-edge-m-${idx}`,
            source: nodeId,
            target: targetId,
            relationType: 'mentor_of',
            label: '通讯作者导师',
            weight: 5,
          });
        });
    }

    if (customer.firstAuthorNames) {
      customer.firstAuthorNames
        .split(/[、/，,]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((fa, idx) => {
          if (fa.includes(customer.scholarName)) return;
          const nodeId = `local-fa-${idx}`;
          nodes.push({
            id: nodeId,
            label: fa,
            subLabel: `同组共署实验骨干 · ${customer.department}`,
            category: 'co_author',
            ring: 1,
            institution: customer.institution,
            department: customer.department,
            roleTitle: '同组论文共同作者 / 一线实验骨干',
            relationToTarget: `与 ${customer.scholarName} 共同署名发表论文`,
            evidenceItems: [`所属实验室：${customer.institution} · ${customer.department}`],
            salesRoleAndAction: '日常在同实验室协同实验，可同步建立技术口碑。',
            canPivotSearch: true,
            pivotInstitution: customer.institution,
            pivotDepartment: customer.department,
            pivotScholarName: fa.replace(/\(.*?\)|（.*?）/g, '').trim(),
          });
          edges.push({
            id: `local-edge-fa-${idx}`,
            source: targetId,
            target: nodeId,
            relationType: 'co_author_on',
            label: '同组论文共署',
            weight: 3,
          });
        });
    }
  }

  // Add Grants from deepProfile
  (deepProfile?.verifiedGrants || []).slice(0, 3).forEach((gr: any, idx: number) => {
    const gId = `local-grant-${idx}`;
    nodes.push({
      id: gId,
      label: String(gr.grantName || '在研纵向课题').slice(0, 24),
      subLabel: gr.amountRMB || '纵向科研经费',
      category: 'grant_node',
      ring: 2,
      institution: customer.institution,
      department: customer.department,
      roleTitle: '核验在研纵向课题 / 专项资金',
      relationToTarget: gr.grantCodeOrSource || '课题经费池',
      evidenceItems: [
        `项目名称：${gr.grantName}`,
        `来源与编号：${gr.grantCodeOrSource}`,
        `经费规则：${gr.periodAndStatus}`,
      ],
      salesRoleAndAction: gr.periodAndStatus || '支持测试化验加工费与试剂耗材直签。',
      canPivotSearch: false,
    });
    edges.push({
      id: `local-edge-g-${idx}`,
      source: targetId,
      target: gId,
      relationType: 'funded_by',
      label: '在研经费支撑',
      weight: 3,
    });
  });

  // Add Department & Commercial Entities
  const orgId = 'local-org-dept';
  nodes.push({
    id: orgId,
    label: `${customer.institution} · ${customer.department.split(' · ')[0]}`,
    subLabel: customer.department,
    category: 'org_entity',
    ring: 2,
    institution: customer.institution,
    department: customer.department,
    roleTitle: '人事归属院系与公共实验平台',
    relationToTarget: '目标学者归属科研机构',
    evidenceItems: [`机构全称：${customer.institution} · ${customer.department}`],
    salesRoleAndAction: '可依托该院系公共平台申请年度设备修购立项。',
    canPivotSearch: false,
  });
  edges.push({
    id: 'local-edge-org',
    source: targetId,
    target: orgId,
    relationType: 'affiliated_with',
    label: '人事归属',
    weight: 3,
  });

  return {
    centerTarget: {
      name: customer.scholarName,
      englishName: customer.scholarName,
      institution: customer.institution,
      department: customer.department,
      roleBadge: customer.title || '核心科研学者',
      personTier: isYouth ? 'L2' : 'L1',
      researchKeywords: customer.researchKeywords,
      totalPapers: 1,
      totalGrants: (deepProfile?.verifiedGrants || []).length || 1,
      totalDirectPeople: nodes.filter((n) => n.ring === 1).length,
      totalSecondHopPeople: 0,
    },
    nodes,
    edges,
  };
}

const CATEGORY_META: Record<
  RadarNodeCategory,
  {
    badge: string;
    fill: string;
    stroke: string;
    text: string;
    dotColor: string;
  }
> = {
  target: {
    badge: '0° 雷达靶心客户',
    fill: '#083344',
    stroke: '#22d3ee',
    text: '#ecfeff',
    dotColor: 'bg-cyan-400',
  },
  mentor_pi: {
    badge: '1° 通讯导师 / L1大老板',
    fill: '#451a03',
    stroke: '#f59e0b',
    text: '#fef3c7',
    dotColor: 'bg-amber-400',
  },
  co_pi: {
    badge: '1° 联合通讯 / 合作PI',
    fill: '#3b0764',
    stroke: '#c084fc',
    text: '#f3e8ff',
    dotColor: 'bg-purple-400',
  },
  first_author: {
    badge: '1° 一作核心骨干',
    fill: '#064e3b',
    stroke: '#34d399',
    text: '#d1fae5',
    dotColor: 'bg-emerald-400',
  },
  co_author: {
    badge: '1° 论文共署伙伴',
    fill: '#0f172a',
    stroke: '#38bdf8',
    text: '#e0f2fe',
    dotColor: 'bg-sky-400',
  },
  second_hop_peer: {
    badge: '2° 导师同门 / 延伸人脉',
    fill: '#1e1b4b',
    stroke: '#818cf8',
    text: '#e0e7ff',
    dotColor: 'bg-indigo-400',
  },
  paper_node: {
    badge: 'SCI 论文证据锚点',
    fill: '#134e4a',
    stroke: '#2dd4bf',
    text: '#ccfbf1',
    dotColor: 'bg-teal-400',
  },
  grant_node: {
    badge: '在账科研基金池',
    fill: '#3f2e05',
    stroke: '#fbbf24',
    text: '#fef08a',
    dotColor: 'bg-yellow-400',
  },
  org_entity: {
    badge: '归属院系 / 协作平台',
    fill: '#1e293b',
    stroke: '#94a3b8',
    text: '#f1f5f9',
    dotColor: 'bg-slate-400',
  },
};

export const RelationshipRadarGraph: React.FC<{
  deepProfile?: any;
}> = ({ deepProfile }) => {
  const { confirmedCustomer, confirmCustomer } = useCustomerContext();

  const [radarData, setRadarData] = useState<RadarGraphPayload | null>(null);
  const [loadingRadar, setLoadingRadar] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'concentric' | 'network'>('concentric');
  const [categoryFilter, setCategoryFilter] = useState<
    'all' | 'people_1hop' | 'people_2hop' | 'papers_grants' | 'orgs'
  >('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-target-center');
  const [zoom, setZoom] = useState<number>(1);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [pivotHistory, setPivotHistory] = useState<PivotBreadcrumb[]>([]);
  const [activePivotTarget, setActivePivotTarget] = useState<PivotBreadcrumb | null>(null);

  const fetchLiveRadarGraph = async (targetParams: {
    institution: string;
    department: string;
    scholarName: string;
    researchKeywords: string;
  }) => {
    setLoadingRadar(true);
    try {
      const res = await fetch('/api/intel/relationship-radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetParams),
      });
      const raw = await res.text();
      if (raw && !raw.trim().startsWith('<')) {
        const json = JSON.parse(raw);
        if (json?.success && json?.radarGraph?.nodes?.length > 0) {
          setRadarData(json.radarGraph);
          setSelectedNodeId('node-target-center');
        }
      }
    } catch {
      // keep instant fallback
    } finally {
      setLoadingRadar(false);
    }
  };

  useEffect(() => {
    if (!confirmedCustomer) return;
    setPivotHistory([]);
    setActivePivotTarget(null);
    const instant = buildInstantFallbackRadarGraph(confirmedCustomer, deepProfile);
    setRadarData(instant);
    setSelectedNodeId('node-target-center');

    fetchLiveRadarGraph({
      institution: confirmedCustomer.institution,
      department: confirmedCustomer.department,
      scholarName: confirmedCustomer.scholarName,
      researchKeywords: confirmedCustomer.researchKeywords,
    });
  }, [
    confirmedCustomer?.id,
    confirmedCustomer?.scholarName,
    confirmedCustomer?.institution,
    confirmedCustomer?.department,
  ]);

  const handlePivotToNode = (node: RadarGraphNode) => {
    if (!node.canPivotSearch || !node.pivotScholarName || !node.pivotInstitution) return;

    const currentCenter: PivotBreadcrumb = activePivotTarget || {
      institution: confirmedCustomer?.institution || node.institution,
      department: confirmedCustomer?.department || node.department,
      scholarName: radarData?.centerTarget.name || confirmedCustomer?.scholarName || '',
      researchKeywords:
        radarData?.centerTarget.researchKeywords || confirmedCustomer?.researchKeywords || '',
    };

    setPivotHistory((prev) => [...prev, currentCenter]);
    const nextTarget: PivotBreadcrumb = {
      institution: node.pivotInstitution,
      department: node.pivotDepartment || node.department,
      scholarName: node.pivotScholarName,
      researchKeywords: radarData?.centerTarget.researchKeywords || '',
    };
    setActivePivotTarget(nextTarget);
    fetchLiveRadarGraph(nextTarget);
  };

  const handleStepBackPivot = () => {
    if (pivotHistory.length === 0) return;
    const prevTarget = pivotHistory[pivotHistory.length - 1];
    setPivotHistory((prev) => prev.slice(0, -1));
    setActivePivotTarget(pivotHistory.length === 1 ? null : prevTarget);
    fetchLiveRadarGraph(prevTarget);
  };

  const handleLockPivotAsGlobalCustomer = (node: RadarGraphNode) => {
    const targetName = node.pivotScholarName || node.label.replace(/\(.*?\)|（.*?）/g, '').trim();
    confirmCustomer({
      industrySector: confirmedCustomer?.industrySector || 'biomed',
      institution: node.pivotInstitution || node.institution,
      department: node.pivotDepartment || node.department,
      scholarName: targetName,
      title: node.roleTitle,
      researchKeywords:
        radarData?.centerTarget.researchKeywords ||
        confirmedCustomer?.researchKeywords ||
        '前沿生物医学与转化研究',
      englishQuery: `${node.institution} ${targetName}`,
      personTier: node.category === 'mentor_pi' || node.category === 'co_pi' ? 'L1' : 'L2',
    });
  };

  const filteredGraph = useMemo(() => {
    if (!radarData) return { nodes: [], edges: [] };
    const q = searchFilter.trim().toLowerCase();

    const visibleNodes = radarData.nodes.filter((n) => {
      if (n.id === 'node-target-center') return true;
      if (categoryFilter === 'people_1hop') {
        if (
          !['mentor_pi', 'co_pi', 'first_author', 'co_author'].includes(n.category)
        ) {
          return false;
        }
      } else if (categoryFilter === 'people_2hop') {
        if (!['mentor_pi', 'second_hop_peer'].includes(n.category)) {
          return false;
        }
      } else if (categoryFilter === 'papers_grants') {
        if (!['paper_node', 'grant_node', 'mentor_pi'].includes(n.category)) {
          return false;
        }
      } else if (categoryFilter === 'orgs') {
        if (!['org_entity', 'mentor_pi', 'co_pi'].includes(n.category)) {
          return false;
        }
      }

      if (q) {
        const hay = `${n.label} ${n.subLabel} ${n.roleTitle} ${n.department} ${n.email || ''} ${(n.evidenceItems || []).join(' ')}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });

    const visibleIds = new Set(visibleNodes.map((n) => n.id));
    const visibleEdges = radarData.edges.filter(
      (e) => visibleIds.has(e.source) && visibleIds.has(e.target)
    );

    return { nodes: visibleNodes, edges: visibleEdges };
  }, [radarData, categoryFilter, searchFilter]);

  // Compute 2D coordinates for each visible node in either Concentric Radar or Network Topology mode
  const positionedNodes = useMemo(() => {
    const cx = 460;
    const cy = 290;
    const result = new Map<string, RadarGraphNode & { x: number; y: number }>();

    if (viewMode === 'concentric') {
      const ringRadii: Record<number, number> = {
        0: 0,
        1: 118,
        2: 196,
        3: 256,
      };

      const byRing: Record<number, RadarGraphNode[]> = { 0: [], 1: [], 2: [], 3: [] };
      for (const n of filteredGraph.nodes) {
        byRing[n.ring] = byRing[n.ring] || [];
        byRing[n.ring].push(n);
      }

      for (const n of byRing[0]) {
        result.set(n.id, { ...n, x: cx, y: cy });
      }

      [1, 2, 3].forEach((ringNum) => {
        const list = byRing[ringNum] || [];
        const r = ringRadii[ringNum];
        const count = list.length;
        const startOffset = ringNum === 1 ? -Math.PI / 2 : ringNum === 2 ? -Math.PI / 3 : -Math.PI / 2.4;
        list.forEach((node, idx) => {
          const angle = startOffset + (2 * Math.PI * idx) / Math.max(count, 1);
          // Slightly elliptical horizontally to utilize wide 920x580 canvas cleanly
          const rx = r * 1.34;
          const ry = r * 0.94;
          result.set(node.id, {
            ...node,
            x: Math.round(cx + rx * Math.cos(angle)),
            y: Math.round(cy + ry * Math.sin(angle)),
          });
        });
      });
    } else {
      // Structured Network Graph View:
      // Top Zone: Mentor PIs & Co-PIs
      // Center: Target Customer
      // Left Zone: Papers, Grants & Platforms
      // Right Zone: 1st-Hop Co-Authors & First Authors
      // Bottom Zone: 2nd-Hop Extended Lab Peers
      const mentors = filteredGraph.nodes.filter((n) =>
        ['mentor_pi', 'co_pi'].includes(n.category)
      );
      const peers1 = filteredGraph.nodes.filter((n) =>
        ['first_author', 'co_author'].includes(n.category)
      );
      const peers2 = filteredGraph.nodes.filter((n) => n.category === 'second_hop_peer');
      const resources = filteredGraph.nodes.filter((n) =>
        ['paper_node', 'grant_node', 'org_entity'].includes(n.category)
      );
      const targetNode = filteredGraph.nodes.find((n) => n.category === 'target');

      if (targetNode) {
        result.set(targetNode.id, { ...targetNode, x: cx, y: cy });
      }

      mentors.forEach((n, idx) => {
        const span = 520;
        const step = mentors.length > 1 ? span / (mentors.length - 1) : 0;
        const startX = mentors.length > 1 ? cx - span / 2 : cx;
        result.set(n.id, { ...n, x: Math.round(startX + idx * step), y: 82 });
      });

      resources.forEach((n, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        result.set(n.id, {
          ...n,
          x: 115 + col * 155,
          y: 165 + row * 95,
        });
      });

      peers1.forEach((n, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        result.set(n.id, {
          ...n,
          x: 650 + col * 165,
          y: 165 + row * 95,
        });
      });

      peers2.forEach((n, idx) => {
        const span = 680;
        const step = peers2.length > 1 ? span / (peers2.length - 1) : 0;
        const startX = peers2.length > 1 ? cx - span / 2 : cx;
        result.set(n.id, {
          ...n,
          x: Math.round(startX + idx * step),
          y: 495,
        });
      });
    }

    return result;
  }, [filteredGraph.nodes, viewMode]);

  const selectedNode = useMemo(() => {
    return (
      positionedNodes.get(selectedNodeId) ||
      positionedNodes.get('node-target-center') ||
      Array.from(positionedNodes.values())[0] ||
      null
    );
  }, [positionedNodes, selectedNodeId]);

  const connectedNodeIds = useMemo(() => {
    const set = new Set<string>([selectedNodeId]);
    for (const e of filteredGraph.edges) {
      if (e.source === selectedNodeId) set.add(e.target);
      if (e.target === selectedNodeId) set.add(e.source);
    }
    return set;
  }, [filteredGraph.edges, selectedNodeId]);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedScript(text);
    setTimeout(() => setCopiedScript(null), 1800);
  };

  if (!radarData) return null;

  return (
    <section className="bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-4 space-y-3.5 shadow-xl">
      {/* Top Header & Radar Metrics Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Radar className="w-4 h-4 text-cyan-400 shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              全维人物关系与多跳关联网络雷达（论文署名穿透 × 通讯导师溯源 × 2度同门延伸 × 在账基金锚点）
            </h2>
            {loadingRadar && (
              <span className="text-xs font-mono text-cyan-300 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>正在实时扫描 1度/2度 关系网络...</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300">
            当前雷达靶心：
            <strong className="text-cyan-300 mx-1">
              {radarData.centerTarget.name} ({radarData.centerTarget.englishName})
            </strong>
            <span>·</span>
            <span className="mx-1 text-slate-200">
              {radarData.centerTarget.institution}（{radarData.centerTarget.department}）
            </span>
            <span>·</span>
            <span className="ml-1 font-mono text-amber-300">
              已捕获 {radarData.nodes.length} 个关联实体 / {radarData.edges.length} 条实证关系链
            </span>
          </p>
        </div>

        {/* Pivot Breadcrumb Trail & View Switcher */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {pivotHistory.length > 0 && (
            <button
              type="button"
              onClick={handleStepBackPivot}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <History className="w-3.5 h-3.5" />
              <span>
                返回上一靶心：{pivotHistory[pivotHistory.length - 1]?.scholarName}
              </span>
            </button>
          )}

          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('concentric')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'concentric'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>同心圆雷达扫描</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('network')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'network'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>分层网络拓扑</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-950/90 border border-slate-800/90 rounded-xl p-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: `全部关联节点 (${radarData.nodes.length})` },
            {
              id: 'people_1hop',
              label: `1° 直接人物：导师/一作/共署 (${radarData.nodes.filter((n) => ['mentor_pi', 'co_pi', 'first_author', 'co_author'].includes(n.category)).length})`,
            },
            {
              id: 'people_2hop',
              label: `2° 课题组同门延伸 (${radarData.nodes.filter((n) => n.category === 'second_hop_peer').length})`,
            },
            {
              id: 'papers_grants',
              label: `论文与基金锚点 (${radarData.nodes.filter((n) => ['paper_node', 'grant_node'].includes(n.category)).length})`,
            },
            {
              id: 'orgs',
              label: `院系与协作平台 (${radarData.nodes.filter((n) => n.category === 'org_entity').length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                categoryFilter === tab.id
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="过滤人名 / 邮箱 / 基金号 / 期刊..."
              className="w-full pl-8 pr-3 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.35, +(z + 0.12).toFixed(2)))}
              title="放大图谱"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.12).toFixed(2)))}
              title="缩小图谱"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setCategoryFilter('all');
                setSearchFilter('');
                setSelectedNodeId('node-target-center');
              }}
              title="重置视图"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Viewport: Left 7 Cols Interactive SVG Radar Canvas | Right 5 Cols Live Node Intelligence Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Left 7 Cols: Interactive SVG Radar / Network Graph Canvas */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[490px]">
          {/* Legend Bar inside Canvas Top */}
          <div className="px-3 py-2 border-b border-slate-900/90 bg-slate-950/90 flex flex-wrap items-center justify-between gap-2 text-[11px] z-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-cyan-300 font-mono font-semibold">
                ● 0° 靶心客户
              </span>
              <span className="text-amber-300 font-mono font-semibold">
                ● 1° 通讯导师/大老板(PI)
              </span>
              <span className="text-sky-300 font-mono">
                ● 1° 论文共署/一作骨干
              </span>
              <span className="text-indigo-300 font-mono">
                ● 2° 导师同门延伸人脉
              </span>
              <span className="text-teal-300 font-mono">
                ● 论文/在账基金/院系锚点
              </span>
            </div>
            <span className="text-slate-400 font-mono">
              点击任意节点查看关联证据或「顺藤摸瓜」切换靶心
            </span>
          </div>

          {/* Interactive SVG Viewport */}
          <div className="flex-1 w-full overflow-auto flex items-center justify-center">
            <svg
              viewBox="0 0 920 580"
              className="w-full h-full max-h-[540px] select-none"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
                transition: 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <defs>
                <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.16" />
                  <stop offset="55%" stopColor="#0284c7" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                </radialGradient>
                <marker
                  id="radar-arrow-amber"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
                </marker>
                <marker
                  id="radar-arrow-cyan"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                </marker>
                <marker
                  id="radar-arrow-indigo"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#818cf8" />
                </marker>
              </defs>

              {/* Background Radar Grid when in Concentric Mode */}
              {viewMode === 'concentric' && (
                <g>
                  <circle cx={460} cy={290} r={355} fill="url(#radarGlow)" />
                  {/* Azimuth Crosshairs */}
                  <line
                    x1={80}
                    y1={290}
                    x2={840}
                    y2={290}
                    stroke="#1e293b"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                  <line
                    x1={460}
                    y1={20}
                    x2={460}
                    y2={560}
                    stroke="#1e293b"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                  <line
                    x1={190}
                    y1={90}
                    x2={730}
                    y2={490}
                    stroke="#0f172a"
                    strokeWidth={1}
                  />
                  <line
                    x1={190}
                    y1={490}
                    x2={730}
                    y2={90}
                    stroke="#0f172a"
                    strokeWidth={1}
                  />

                  {/* Ring 1: Direct People */}
                  <ellipse
                    cx={460}
                    cy={290}
                    rx={158}
                    ry={111}
                    fill="none"
                    stroke="#0e7490"
                    strokeWidth={1.2}
                    strokeDasharray="5 5"
                    opacity={0.65}
                  />
                  <text
                    x={460}
                    y={173}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize={10}
                    fontFamily="JetBrains Mono, monospace"
                    opacity={0.85}
                  >
                    1° 直接共署圈（通讯导师 / 一作 / 同篇合作者）
                  </text>

                  {/* Ring 2: Papers, Grants & Departments */}
                  <ellipse
                    cx={460}
                    cy={290}
                    rx={262}
                    ry={184}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth={1.2}
                    strokeDasharray="6 4"
                  />
                  <text
                    x={460}
                    y={100}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize={10}
                    fontFamily="JetBrains Mono, monospace"
                    opacity={0.8}
                  >
                    1.5° 实证资源圈（SCI代表作 · 致谢纵向基金 · 归属院系平台）
                  </text>

                  {/* Ring 3: 2nd-Hop Mentor Lab Peers */}
                  <ellipse
                    cx={460}
                    cy={290}
                    rx={343}
                    ry={241}
                    fill="none"
                    stroke="#312e81"
                    strokeWidth={1.2}
                    strokeDasharray="3 6"
                  />
                  <text
                    x={460}
                    y={42}
                    textAnchor="middle"
                    fill="#818cf8"
                    fontSize={10}
                    fontFamily="JetBrains Mono, monospace"
                    opacity={0.85}
                  >
                    2° 延伸人脉圈（导师课题组同门师兄弟 · 跨院系协同网络）
                  </text>
                </g>
              )}

              {/* Edges */}
              <g>
                {filteredGraph.edges.map((edge) => {
                  const src = positionedNodes.get(edge.source);
                  const tgt = positionedNodes.get(edge.target);
                  if (!src || !tgt) return null;

                  const isHighlighted =
                    edge.source === selectedNode?.id || edge.target === selectedNode?.id;
                  const strokeColor =
                    edge.relationType === 'mentor_of'
                      ? '#f59e0b'
                      : edge.relationType === 'second_hop_lab'
                      ? '#818cf8'
                      : edge.relationType === 'funded_by'
                      ? '#fbbf24'
                      : edge.relationType === 'cross_dept_collab'
                      ? '#c084fc'
                      : '#38bdf8';

                  const midX = (src.x + tgt.x) / 2;
                  const midY = (src.y + tgt.y) / 2;

                  return (
                    <g key={edge.id} opacity={isHighlighted ? 1 : 0.36}>
                      <line
                        x1={src.x}
                        y1={src.y}
                        x2={tgt.x}
                        y2={tgt.y}
                        stroke={strokeColor}
                        strokeWidth={isHighlighted ? 2.2 : 1.2}
                        strokeDasharray={
                          edge.relationType === 'second_hop_lab' ||
                          edge.relationType === 'cross_dept_collab'
                            ? '4 3'
                            : undefined
                        }
                        markerEnd={
                          edge.relationType === 'mentor_of'
                            ? 'url(#radar-arrow-amber)'
                            : edge.relationType === 'second_hop_lab'
                            ? 'url(#radar-arrow-indigo)'
                            : 'url(#radar-arrow-cyan)'
                        }
                      />
                      {isHighlighted && (
                        <g transform={`translate(${midX}, ${midY})`}>
                          <rect
                            x={-68}
                            y={-9}
                            width={136}
                            height={17}
                            rx={4}
                            fill="#020617"
                            stroke={strokeColor}
                            strokeWidth={0.8}
                            opacity={0.94}
                          />
                          <text
                            x={0}
                            y={3}
                            textAnchor="middle"
                            fill="#f8fafc"
                            fontSize={9.5}
                            fontFamily="Plus Jakarta Sans, sans-serif"
                          >
                            {edge.label.slice(0, 22)}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* Nodes */}
              <g>
                {Array.from(positionedNodes.values()).map((node) => {
                  const meta = CATEGORY_META[node.category] || CATEGORY_META.co_author;
                  const isSelected = selectedNode?.id === node.id;
                  const isConnected = connectedNodeIds.has(node.id);
                  const isTarget = node.category === 'target';
                  const boxW = isTarget ? 168 : node.ring === 1 ? 148 : 138;
                  const boxH = isTarget ? 48 : 40;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => setSelectedNodeId(node.id)}
                      className="cursor-pointer"
                      opacity={isConnected ? 1 : 0.45}
                    >
                      {isSelected && (
                        <rect
                          x={-boxW / 2 - 4}
                          y={-boxH / 2 - 4}
                          width={boxW + 8}
                          height={boxH + 8}
                          rx={12}
                          fill="none"
                          stroke="#22d3ee"
                          strokeWidth={2}
                        />
                      )}
                      <rect
                        x={-boxW / 2}
                        y={-boxH / 2}
                        width={boxW}
                        height={boxH}
                        rx={9}
                        fill={meta.fill}
                        stroke={isSelected ? '#ffffff' : meta.stroke}
                        strokeWidth={isSelected ? 2 : isTarget ? 2 : 1.3}
                      />
                      <text
                        x={0}
                        y={-3}
                        textAnchor="middle"
                        fill={meta.text}
                        fontSize={isTarget ? 12 : 11}
                        fontWeight={700}
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {node.label.length > 18 ? `${node.label.slice(0, 17)}…` : node.label}
                      </text>
                      <text
                        x={0}
                        y={12}
                        textAnchor="middle"
                        fill="#cbd5e1"
                        fontSize={9.5}
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {node.subLabel.length > 20
                          ? `${node.subLabel.slice(0, 19)}…`
                          : node.subLabel}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Bottom Summary Bar inside Canvas */}
          <div className="px-3.5 py-2 border-t border-slate-900 bg-slate-950/95 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>
              数据底座：Europe PMC 论文作者序列 & 通讯邮箱核验 + OpenAlex 机构图谱 + 导师课题组 2 度同门穿透
            </span>
            <span className="font-mono text-cyan-400">
              1°直接人物 {radarData.centerTarget.totalDirectPeople} 人 · 2°同门延伸{' '}
              {radarData.centerTarget.totalSecondHopPeople} 人 · 关联基金{' '}
              {radarData.centerTarget.totalGrants} 项
            </span>
          </div>
        </div>

        {/* Right 5 Cols: Selected Node Deep Intelligence & Pivot Action Panel */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
          {selectedNode ? (
            <>
              <div className="space-y-3">
                {/* Node Category & Title */}
                <div className="border-b border-slate-800 pb-2.5 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {CATEGORY_META[selectedNode.category]?.badge || '关联节点'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {selectedNode.ring === 0
                        ? '0度中心靶心'
                        : selectedNode.ring === 1
                        ? '1度直接关联'
                        : selectedNode.ring === 2
                        ? '1.5度实证锚点'
                        : '2度延伸人脉'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white break-words">
                    {selectedNode.label}
                  </h3>
                  <div className="text-xs text-emerald-300 font-medium">
                    {selectedNode.roleTitle}
                  </div>
                  {selectedNode.email && (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300 pt-0.5">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span>论文核验通讯邮箱：{selectedNode.email}</span>
                    </div>
                  )}
                </div>

                {/* Relationship Path to Target */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-mono text-slate-400">
                    与靶心客户【{radarData.centerTarget.name}】的关联路径：
                  </div>
                  <p className="text-xs text-white font-medium leading-relaxed">
                    {selectedNode.relationToTarget}
                  </p>
                </div>

                {/* Verified Bibliometric / Institutional Evidence List */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-300">
                    查证原始依据（文章署名 / 单位标注 / 基金致谢）：
                  </div>
                  <div className="space-y-1.5 max-h-[165px] overflow-y-auto pr-1">
                    {selectedNode.evidenceItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-slate-900/70 border border-slate-800/90 text-xs text-slate-200 leading-relaxed"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sales & FAE Action Advice */}
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
                  <div className="text-xs font-bold text-cyan-300">
                    销售与售前工程师（FAE）攻单切入建议：
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedNode.salesRoleAndAction}
                  </p>
                </div>

                {/* Copyable Greeting Script if present */}
                {selectedNode.greetingScript && (
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-amber-300">
                        定制破冰寒暄话术：
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedNode.greetingScript!)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedScript === selectedNode.greetingScript ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">已复制</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-cyan-400" />
                            <span>复制话术</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      {selectedNode.greetingScript}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons: Pivot Radar Center OR Lock as New Global Customer */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                {selectedNode.canPivotSearch ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handlePivotToNode(selectedNode)}
                      className="min-h-[40px] px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Radar className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">顺藤摸瓜：以此人做雷达扫描</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLockPivotAsGlobalCustomer(selectedNode)}
                      className="min-h-[40px] px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">切换为全局锁定客户 ▸</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>点击图谱中的其他学者节点可顺藤摸瓜展开二级人脉雷达</span>
                    <span className="font-mono text-cyan-400">实时联网图谱</span>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Bottom Quick-Select Associated People Strip (All Discovered People at a Glance) */}
      <div className="pt-2 border-t border-slate-800/90 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              雷达检出关联人物名录（点击任一人物卡片定位图谱节点，支持一键顺藤摸瓜深挖）：
            </span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            共检出{' '}
            {
              radarData.nodes.filter((n) =>
                ['target', 'mentor_pi', 'co_pi', 'first_author', 'co_author', 'second_hop_peer'].includes(
                  n.category
                )
              ).length
            }{' '}
            位关联人物
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {radarData.nodes
            .filter((n) =>
              ['target', 'mentor_pi', 'co_pi', 'first_author', 'co_author', 'second_hop_peer'].includes(
                n.category
              )
            )
            .map((personNode) => {
              const isSel = selectedNode?.id === personNode.id;
              const meta = CATEGORY_META[personNode.category];
              return (
                <div
                  key={personNode.id}
                  onClick={() => setSelectedNodeId(personNode.id)}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isSel
                      ? 'bg-slate-900 border-cyan-400 shadow-sm'
                      : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-xs font-bold text-white truncate">
                        {personNode.label}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-300 shrink-0">
                        {personNode.ring === 0
                          ? '靶心'
                          : personNode.ring === 1
                          ? '1°直接'
                          : '2°同门'}
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-300 truncate mt-0.5">
                      {meta?.badge}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {personNode.department}
                      {personNode.email ? ` · ${personNode.email}` : ''}
                    </div>
                  </div>

                  {personNode.canPivotSearch && (
                    <div className="pt-1 border-t border-slate-900 flex items-center justify-between text-[10px] text-cyan-400">
                      <span>点击查看共署详情</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePivotToNode(personNode);
                        }}
                        className="font-bold text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>顺藤摸瓜扫描</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};
