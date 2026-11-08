import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SCHOLARS_NETWORK, SCHOLAR_RELATION_EDGES } from '../data/mockData';
import { ScholarNode, ScholarEdge, ScholarRelation } from '../types';
import { useCustomerContext, ConfirmedCustomerProfile } from '../context/CustomerContext';
import {
  Building2,
  BookOpen,
  Wallet,
  Share2,
  Sparkles,
  UserCheck,
  Microscope,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';

interface D3ScholarNode extends d3.SimulationNodeDatum, Omit<ScholarNode, 'x' | 'y'> {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface D3ScholarLink extends d3.SimulationLinkDatum<D3ScholarNode> {
  id: string;
  relationship: ScholarRelation;
  relationLabel: string;
  description: string;
  leverageScript: string;
}

function buildCustomerSocialNetwork(customer: ConfirmedCustomerProfile | null): {
  nodes: ScholarNode[];
  edges: ScholarEdge[];
} {
  if (!customer) {
    return { nodes: SCHOLARS_NETWORK, edges: SCHOLAR_RELATION_EDGES };
  }

  const shortName =
    customer.scholarName
      .split('/')[0]
      .replace(/教授|老师|主任|研究员|博士|院长/g, '')
      .trim() || customer.scholarName;

  const isYinZhinan =
    shortName.includes('尹芝南') ||
    shortName.includes('尹志南') ||
    shortName.includes('向征') ||
    shortName.includes('吴扬哲') ||
    shortName.includes('杨恒文') ||
    shortName.includes('高云飞') ||
    shortName.includes('罗钧洪') ||
    ((customer.institution.includes('暨德康民') || customer.institution.includes('暨安特博')) && !shortName);

  const isYouPengtao =
    !isYinZhinan &&
    (shortName.includes('尤鹏涛') ||
      shortName.includes('尤朋涛') ||
      shortName.includes('叶晓川'));

  const isLabMedicine =
    !isYinZhinan &&
    !isYouPengtao &&
    (shortName.includes('欧阳') ||
      shortName.includes('刘敏') ||
      shortName.includes('黄彬') ||
      shortName.includes('张式鸿') ||
      (!shortName && customer.department.includes('检验')));
  const isLiuMin = shortName.includes('刘敏');

  const l1Name = isYinZhinan
    ? '尹芝南（L1院长·暨德康民/暨安特博创始人）'
    : isYouPengtao
    ? '叶晓川（L1省重点实验室常务副主任·博导）'
    : isLabMedicine
    ? '刘敏（L1检验科正主任）'
    : customer.deptLeaderName?.split('（')[0] || `${shortName}（L1负责人）`;

  const l2Name = isYinZhinan
    ? '向征(暨德康民CTO) / 吴扬哲(副院长) / 杨恒文 / 高云飞'
    : isYouPengtao
    ? '尤朋涛(700万横向PI·科技副总) / 刘丹(教授) / 魏琼'
    : isLabMedicine
    ? '欧阳涓（L2行政副主任·省临床细胞分析主委）'
    : customer.subPiNames?.split('、')[0]?.split('（')[0] || '分管副主任/实权青年PI';

  const l3Name = isYinZhinan
    ? '流式平台主管 & 暨德康民QC负责人'
    : isYouPengtao
    ? '吴和珍 / 刘军锋（省重点实验室平台主管）'
    : isLabMedicine
    ? '张式鸿（流式质控主管）'
    : '公共平台主管 & 科研秘书';

  const l4Name = isYinZhinan
    ? '鲁呦呦/裴建（γδ-T与IL-27一线博后）'
    : isYouPengtao
    ? '李慧君/王天合/陈伟亮/朱海（一线硕博一作）'
    : isLabMedicine
    ? '王哲/林琳（流式室骨干）'
    : customer.firstAuthorNames?.split('/')[0]?.split('（')[0] || '一线实验骨干博后';

  const extName = isYinZhinan
    ? '广东暨德康民(B轮·GDKM-100 I期) & 暨安特博'
    : isYouPengtao
    ? '武汉安捷医药(700万横向) & 湖北中科盐谷'
    : isLabMedicine
    ? '李娟（血液内科主任）'
    : '病理科/临床协作PI';

  const nodes: ScholarNode[] = [
    {
      id: 'scholar-lin',
      name: l2Name,
      role: 'PI',
      avatarSeed: 'scholar-lin',
      title: isYinZhinan
        ? '向征(转化院PI兼暨德康民执行总经理/CTO) · 吴扬哲(副院长) · 杨恒文/高云飞/罗钧洪(海外优青)'
        : isYouPengtao
        ? '尤朋涛(副研究员/硕导/科技副总·700万安捷医药横向负责人) · 刘丹(教授) · 魏琼(省重点实验室核心学者)'
        : isLabMedicine
        ? '医学检验科行政副主任 / 主任技师（L2分管流式与血液MRD · 省临床细胞分析首届主委）'
        : '分管副主任 / 子课题实权PI（L2二当家）',
      institution: customer.institution,
      department: customer.department,
      researchField: customer.researchKeywords,
      fundingLevel: 'OpEx_Mid',
      fundingSource: isYinZhinan
        ? '向征掌管广东暨德康民B轮商业采购直签(免高校招标)；吴扬哲/杨恒文/高云飞/罗钧洪(海外优青200-400万)各自独立主持国自然课题'
        : isYouPengtao
        ? '尤朋涛直接掌管武汉安捷医药700万元《半夏厚朴汤颗粒开发》横向经费与中科盐谷横向资金（免政采招标直签）'
        : isLabMedicine
        ? '流式与血液细胞分析亚专科预算 + 广东省精准医学应用学会临床细胞分析分会多中心课题经费'
        : '在研国自然面上/子课题经费（测试与耗材直接签批权）',
      fundingAmountRMB: isYinZhinan
        ? '企业直签+面上/优青'
        : isYouPengtao
        ? '700万横向+企业直签'
        : isLabMedicine
        ? '流式亚专科+学会专项'
        : '国自然面上60万',
      recentPaperTitle: isYinZhinan
        ? 'Allogeneic Vγ9Vδ2 T-cell therapy (GDKM-100) and exosome-mediated antitumor immunity in solid tumors'
        : isYouPengtao
        ? 'Quality evaluation of Poria cocos cultivated with substitute materials (NPR 2025) & 温阳氨肽膏调节巨噬细胞免疫活性 (医药导报 2026通讯)'
        : isLabMedicine
        ? 'High-sensitivity multiparameter spectral flow cytometry for minimal residual disease (MRD) monitoring'
        : `Single-cell and spatial immune profiling in ${customer.researchKeywords}`,
      journal: isYinZhinan
        ? 'Signal Transduction and Targeted Therapy / JCI Insight (2024-2025)'
        : isYouPengtao
        ? 'Natural Product Research (2025) / Chinese Journal of Natural Medicines (2023) / 医药导报 (2026)'
        : isLabMedicine
        ? 'Cytometry Part B: Clinical Cytometry / 中华检验医学杂志 (2024-2025)'
        : 'Nature Communications (2025)',
      impactFactor: 16.8,
      paperDefect: isYinZhinan
        ? 'GDKM-100晚期肝癌I期临床样本与实体瘤悬液自发荧光强，且单细胞悬液丢失了 γδ-T 细胞贴近杀伤肿瘤细胞的 15μm 空间原位证据。'
        : isYouPengtao
        ? '经典名方（半夏厚朴汤/茯苓/温阳氨肽膏）在巨噬细胞M1/M2免疫调控与脾虚水湿组织微环境中的机制急需多色流式分型、6色空间病理共染与1μL细胞因子谱支撑。'
        : isLabMedicine
        ? 'CAR-T治疗后骨髓样本面临抗原漂移与传统8-10色流式通道瓶颈，且重症患者微量样本难以同时测几十种细胞因子。'
        : `常规方法打碎了组织空间结构，急需补充单张切片6-8色空间原位共染与1μL超微量蛋白组数据。`,
      installedBase: isYinZhinan
        ? ['常规三激光流式分选仪 (机时饱和)', '企业CMC/QC质控室 (急需升级全光谱流式放行体系)']
        : isYouPengtao
        ? ['省重点实验室UPLC-MS/MS液质平台', '常规流式与单色IHC平台 (急需升级多色巨噬细胞免疫流式与空间共染)']
        : isLabMedicine
        ? ['常规8-10色临床流式细胞仪 (通道受限)', '常规化学发光仪 (缺超微量多因子联检)']
        : ['常规4-8色流式细胞仪 (老旧待升级)', '常规切片扫描仪'],
      personalWin: isYinZhinan
        ? '向征博士可直接走广东暨德康民B轮商业账户免高校招标快速签约，保障GDKM-100临床I期样本放行质控；院内各PI快速拿到空间6色大图发顶刊。'
        : isYouPengtao
        ? '尤朋涛副研究员可直接用武汉安捷医药700万横向经费或中科盐谷合作资金免招标签批测试与耗材，快速交付半夏厚朴汤与巨噬细胞免疫高分数据。'
        : isLabMedicine
        ? '快速跑通24色高敏MRD流式方案与CAR-T细胞因子监测，向正主任刘敏提交新项目立项与物价回收测算。'
        : '用小额测试费2周内拿到高分实测Figure，并顺势发起下一年度科室大设备立项。',
      x: 280,
      y: 260,
    },
    {
      id: 'scholar-chen',
      name: l1Name,
      role: 'ClinicalDirector',
      avatarSeed: 'scholar-chen',
      title: isYinZhinan
        ? '转化研究院院长 · 广东暨德康民创始人(持股~33%) · 广东暨安特博科学创始人 · 国家杰青(30725015)/973首席'
        : isLabMedicine
        ? '医学检验科正主任 / 主任技师（L1一把手 · 主持国自然/国家863子课题/省市重大专项）'
        : customer.title || '学科带头人 / 科室正主任（L1一把手）',
      institution: customer.institution,
      department: customer.department,
      researchField: customer.researchKeywords,
      fundingLevel: 'CapEx_High',
      fundingSource: isYinZhinan
        ? '广东暨德康民B轮(广州健康产投基金数千万增资) + 广东暨安特博(真格基金/香商投资数千万VC) + 国自然重点(318300xx ~300万)/973首席(2000万+)/双一流修购'
        : isLabMedicine
        ? '国家临床重点专科建设经费 + 国自然/国家863计划子课题/省科技厅/广州市协同创新重大专项 + 跨院区设备预算'
        : '重点专科/研究院年度百万至千万级修购专项',
      fundingAmountRMB: isYinZhinan ? 'B轮数千万+重点300万' : isLabMedicine ? '重点专科+863/国自然' : '重点专项500万+',
      recentPaperTitle: isYinZhinan
        ? 'IL-27 signaling promotes adipocyte thermogenesis and energy expenditure (Nature 2021 通讯，赋权转化广东暨安特博)'
        : isLabMedicine
        ? 'Clinical value of multiplex infection immunity and tumor molecular biomarker profiling in laboratory quality management'
        : `Translational cohort and multi-omics landscape in ${customer.researchKeywords}`,
      journal: isYinZhinan ? 'Nature (2021) / JEM / STTT' : '中华检验医学杂志 / Clinical Chemistry',
      impactFactor: 64.8,
      paperDefect: isYinZhinan
        ? '院内转化院、珠海市人民医院精准医学中心及院外「暨德康民(GDKM-100 I期临床)」「暨安特博(IL-27新药)」急需统一的高维流式与空间多组学质控平台。'
        : isLabMedicine
        ? '越秀本部与南沙院区需建立同质化高通量质控体系，并升级疑难血液病MRD与感染免疫多因子联检能力。'
        : '存量基础设备通量与通道数不足，需升级院级旗舰全光谱与空间多组学平台。',
      installedBase: [
        customer.procurementHistoryClue || '院内平台面临高维升级窗口，院外企业处于B轮临床I期扩产放量期',
        '高校“双一流”修购专项与名下生物医药企业商业采购双通道并行',
      ],
      personalWin: isYinZhinan
        ? '以「院内学术平台 + 院外暨德康民/暨安特博商业直签」双轨推进GDKM-100异体γδ-T细胞新药临床I期与IL-27代谢新药转化。'
        : isLabMedicine
        ? '实现越秀本部与南沙院区检验质量同质化满分通过ISO15189室间质评，将863/国自然科研成果转化为临床高附加值收费项目。'
        : '以高开机率共享平台支撑科室重大专项验收与临床重点专科考核。',
      x: 540,
      y: 160,
    },
    {
      id: 'scholar-zhao',
      name: extName,
      role: 'Dean',
      avatarSeed: 'scholar-zhao',
      title: isYinZhinan
        ? '广东暨德康民(董事长王亚杰/CTO向征·B轮数千万) & 广东暨安特博(真格投资) & 珠海市人民医院'
        : isLabMedicine
        ? '血液内科主任医师/教授（院内骨髓MRD核心送检临床方）'
        : '跨科室临床/病理联合署名PI',
      institution: isYinZhinan ? '广东暨德康民 / 广东暨安特博 / 暨大附一院 / 珠海市人民医院' : customer.institution,
      department: isYinZhinan ? '院外商业转化企业 & 临床I期中心' : isLabMedicine ? '血液内科' : '协作临床/病理科',
      researchField: isYinZhinan
        ? 'GDKM-100异体Vγ9Vδ2-T晚期肝癌I期临床 & IL-27重组蛋白/mRNA代谢新药开发'
        : isLabMedicine
        ? '多发性骨髓瘤 / 白血病CAR-T临床队列与MRD送检'
        : `${customer.researchKeywords} 临床样本库与转化队列`,
      fundingLevel: 'CapEx_High',
      fundingSource: isYinZhinan
        ? '广州金控旗下广州健康产投基金B轮增资(2025.12) + 广州银行授信 + 真格基金/香商投资数千万VC'
        : '临床转化专项经费 & 医院重点专科设备预算',
      fundingAmountRMB: isYinZhinan ? 'B轮数千万+真格VC' : '临床重点专项',
      recentPaperTitle: isYinZhinan
        ? 'NMPA IND approval and Phase I clinical trial of allogeneic Vγ9Vδ2-T cell injection (GDKM-100) in advanced HCC'
        : `Clinical cohort validation and biomarker monitoring in ${customer.researchKeywords}`,
      journal: isYinZhinan ? 'NMPA CDE IND 临床默示许可 / STTT' : 'Clinical Cancer Research (2025)',
      impactFactor: 38.1,
      paperDefect: isYinZhinan
        ? 'GDKM-100晚期肝癌I期受试者穿刺与外周血标本极其珍贵，且GMP细胞制剂放行急需合规稳定的流式质控与1μL多因子联检。'
        : '临床患者穿刺与外周血标本极其珍贵(<5μL)，急需零损耗高维流式与1μL多因子联检。',
      installedBase: isYinZhinan
        ? ['暨德康民GMP细胞制备与QC中心 (B轮资金充沛)', '暨大附一院I期临床病房 & 珠海市人民医院精准医学中心']
        : ['临床样本库 (样本量充沛)', '常规检测平台 (待与主科室联动升级)'],
      personalWin: isYinZhinan
        ? '直接以企业商业合同采购（免除高校漫长招投标），快速建立符合NMPA审评要求的GDKM-100临床I期免疫监测与IL-27药效评价体系。'
        : '打通“基础机制/检验平台 + 临床转化队列”双中心联合立项，快速发表高分临床转化论文。',
      x: 560,
      y: 380,
    },
    {
      id: 'scholar-wang',
      name: l3Name,
      role: 'PlatformGatekeeper',
      avatarSeed: 'scholar-wang',
      title: isYinZhinan
        ? '研究院流式平台主管 & 暨德康民CMC/QC质控主管（L3把关人）'
        : '平台质量主管 & 年度设备论证报告执笔人（L3把关人）',
      institution: customer.institution,
      department: customer.department,
      researchField: '大型仪器年开机率考核 · 防堵孔质控SOP · 企业CMC放行验证',
      fundingLevel: 'Low_Funds',
      fundingSource: '院级修购专项立项参数起草与企业QC实验室耗材准入把关',
      fundingAmountRMB: '修购参数/QC准入',
      recentPaperTitle: 'Standardization and quality control workflow for high-dimensional cytometry platform',
      journal: 'Cytometry Part A / 实验室管理规范',
      impactFactor: 4.8,
      paperDefect: '最怕黏稠骨髓/肿瘤组织悬液堵喷嘴导致仪器停机被投诉，以及企业临床级细胞放行质控出现批间波动。',
      installedBase: ['公共流式/成像平台在管设备', '年度新增设备论证报告汇总表'],
      personalWin: '拿到写好“>1800小时年开机率测算”的《可行性论证报告初稿》与《防堵孔质控SOP》，省心安全零事故。',
      x: 340,
      y: 430,
    },
    {
      id: 'scholar-exec',
      name: l4Name,
      role: 'PI',
      avatarSeed: 'scholar-exec',
      title: '一线专职博后 / 主管技师（L4每日实验与组会PPT执笔人）',
      institution: customer.institution,
      department: customer.department,
      researchField: `${customer.researchKeywords} 样本前处理与上机实操`,
      fundingLevel: 'OpEx_Mid',
      fundingSource: '课题组与企业研发日常试剂耗材及测试费第一建议权',
      fundingAmountRMB: '日常请购建议权',
      recentPaperTitle: `High-dimensional immunophenotyping and spatial mapping in ${customer.researchKeywords}`,
      journal: 'Journal of Immunology / 一作在投顶刊',
      impactFactor: 12.4,
      paperDefect: '每天手工调流式荧光补偿、切石蜡片极耗精力，急需自动光谱解混与现成高颜值组会汇报图。',
      installedBase: ['日常高频使用科室流式与显微镜台位'],
      personalWin: '由技术支持驻场免费帮跑2例高难样本并直接生成组会汇报PPT高清大图，不熬夜准时发文章。',
      x: 150,
      y: 170,
    },
  ];

  const edges: ScholarEdge[] = [
    {
      id: 'edge-exec-subpi',
      source: 'scholar-exec',
      target: 'scholar-lin',
      relationship: 'CoAuthorWith',
      relationLabel: '一作博后 ➔ L2分管PI',
      description: `${l4Name} 每天在一线做实验并向 ${l2Name} 汇报周会数据。`,
      leverageScript: `“先由售前工程师帮 ${l4Name} 免费跑出 2 例高难样本对比图，在组会上向 ${l2Name} 汇报，当周促成 4.8 万测试费免招标直签！”`,
    },
    {
      id: 'edge-subpi-leader',
      source: 'scholar-lin',
      target: 'scholar-chen',
      relationship: 'SameMentorAs',
      relationLabel: 'L2二当家 ➔ L1一把手拍板',
      description: `${l2Name} 是 ${l1Name} 的核心分管副手/子课题PI，负责技术把关与立项发起，报 ${l1Name} 终审签字。`,
      leverageScript: `“${l2Name} 跑通 4.8 万预实验拿到实测数据后，顺势将 300 万级全光谱流式与空间病理平台呈报 ${l1Name} 终审拍板！”`,
    },
    {
      id: 'edge-subpi-clinical',
      source: 'scholar-lin',
      target: 'scholar-zhao',
      relationship: 'CoAuthorWith',
      relationLabel: '基础/检验 × 临床转化联动',
      description: `${l2Name} 与 ${extName} 共享临床队列样本并联合发表高分论文。`,
      leverageScript: `“打通【${customer.department}】与【${extName}】双中心样本队列，联合提报跨科室高维流式与超微量蛋白组平台！”`,
    },
    {
      id: 'edge-gatekeeper-leader',
      source: 'scholar-wang',
      target: 'scholar-chen',
      relationship: 'PlatformGatekeeperOf',
      relationLabel: 'L3执笔论证 ➔ L1终审签字',
      description: `${l3Name} 负责汇总《可行性论证报告》与三家比价单，呈报 ${l1Name} 审批。`,
      leverageScript: `“向 ${l3Name} 递交写好 1800 小时共享机时测算的《可行性论证报告初稿》与《防堵孔SOP》，助推院级立项一次过会！”`,
    },
  ];

  // Put the primary target as the first/default selected item if searching L1
  if (isYinZhinan || isLiuMin) {
    return {
      nodes: [nodes[1], nodes[0], nodes[2], nodes[3], nodes[4]],
      edges,
    };
  }

  return { nodes, edges };
}

export const AcademicSocialGraph: React.FC = () => {
  const { confirmedCustomer } = useCustomerContext();

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<D3ScholarNode, D3ScholarLink> | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);

  const dynamicNetwork = useMemo(
    () => buildCustomerSocialNetwork(confirmedCustomer),
    [
      confirmedCustomer?.id,
      confirmedCustomer?.scholarName,
      confirmedCustomer?.institution,
      confirmedCustomer?.department,
      confirmedCustomer?.researchKeywords,
    ]
  );

  const [selectedScholarId, setSelectedScholarId] = useState<string>(dynamicNetwork.nodes[0].id);
  const [highlightPathFromLin, setHighlightPathFromLin] = useState<boolean>(true);
  const [hoveredEdge, setHoveredEdge] = useState<D3ScholarLink | null>(null);
  const [fundingFilter, setFundingFilter] = useState<string>('all');
  const [manualRunTick, setManualRunTick] = useState<number>(0);

  // Sync selected node whenever confirmedCustomer changes
  useEffect(() => {
    setFundingFilter('all');
    setSelectedScholarId(dynamicNetwork.nodes[0].id);
  }, [
    confirmedCustomer?.id,
    confirmedCustomer?.scholarName,
    dynamicNetwork,
  ]);

  const selectedScholar =
    dynamicNetwork.nodes.find((s) => s.id === selectedScholarId) || dynamicNetwork.nodes[0];

  // Filter nodes based on funding level
  const displayedScholars =
    fundingFilter === 'all'
      ? dynamicNetwork.nodes
      : dynamicNetwork.nodes.filter((s) => s.fundingLevel === fundingFilter);

  const displayedIds = new Set(displayedScholars.map((s) => s.id));

  // Initialize and run D3 force-directed graph
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 540;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const defs = svg.append('defs');

    defs
      .append('marker')
      .attr('id', 'd3-arrow-cyan')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 36)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', '#06b6d4');

    defs
      .append('marker')
      .attr('id', 'd3-arrow-purple')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 36)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', '#a855f7');

    defs
      .append('marker')
      .attr('id', 'd3-arrow-amber')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 36)
      .attr('refY', 5)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', '#f59e0b');

    const filter = defs
      .append('filter')
      .attr('id', 'glow-filter')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g').attr('class', 'main-d3-canvas');
    gRef.current = g;

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    const nodesData: D3ScholarNode[] = displayedScholars.map((s) => ({
      ...s,
      x: s.x,
      y: s.y,
    }));

    const linksData: D3ScholarLink[] = dynamicNetwork.edges
      .filter((e) => displayedIds.has(e.source) && displayedIds.has(e.target))
      .map((e) => ({
        ...e,
        source: e.source,
        target: e.target,
      }));

    const simulation = d3
      .forceSimulation<D3ScholarNode, D3ScholarLink>(nodesData)
      .force(
        'link',
        d3.forceLink<D3ScholarNode, D3ScholarLink>(linksData).id((d) => d.id).distance(185)
      )
      .force('charge', d3.forceManyBody().strength(-580))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(60))
      .alphaDecay(0.028);

    simulationRef.current = simulation;

    const linkGroup = g.append('g').attr('class', 'links');
    const links = linkGroup
      .selectAll<SVGLineElement, D3ScholarLink>('line')
      .data(linksData)
      .enter()
      .append('line')
      .attr('stroke', (d) => {
        const isLinPath =
          highlightPathFromLin &&
          ((d.source as any).id === 'scholar-lin' || d.source === 'scholar-lin') &&
          ((d.target as any).id === 'scholar-chen' || (d.target as any).id === 'scholar-zhao');
        if (isLinPath) return '#f59e0b';
        if (d.relationship === 'CoAuthorWith') return '#06b6d4';
        if (d.relationship === 'SameMentorAs') return '#a855f7';
        if (d.relationship === 'PlatformGatekeeperOf') return '#eab308';
        return '#64748b';
      })
      .attr('stroke-width', (d) => {
        const isLinPath =
          highlightPathFromLin &&
          ((d.source as any).id === 'scholar-lin' || d.source === 'scholar-lin') &&
          ((d.target as any).id === 'scholar-chen' || (d.target as any).id === 'scholar-zhao');
        return isLinPath ? 3.5 : 2;
      })
      .attr('stroke-dasharray', (d) =>
        d.relationship === 'PlatformGatekeeperOf' ? '5 4' : 'none'
      )
      .attr('opacity', 0.85)
      .attr('marker-end', (d) => {
        const isLinPath =
          highlightPathFromLin &&
          ((d.source as any).id === 'scholar-lin' || d.source === 'scholar-lin') &&
          ((d.target as any).id === 'scholar-chen' || (d.target as any).id === 'scholar-zhao');
        if (isLinPath) return 'url(#d3-arrow-amber)';
        if (d.relationship === 'SameMentorAs') return 'url(#d3-arrow-purple)';
        return 'url(#d3-arrow-cyan)';
      })
      .style('cursor', 'pointer')
      .on('mouseenter', (_event, d) => setHoveredEdge(d))
      .on('mouseleave', () => setHoveredEdge(null));

    const linkLabelsGroup = g.append('g').attr('class', 'link-labels');
    const linkLabels = linkLabelsGroup
      .selectAll<SVGGElement, D3ScholarLink>('g')
      .data(linksData)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .on('mouseenter', (_event, d) => setHoveredEdge(d))
      .on('mouseleave', () => setHoveredEdge(null));

    linkLabels
      .append('rect')
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('width', 110)
      .attr('height', 20)
      .attr('fill', '#090d16')
      .attr('stroke', (d) => {
        if (d.relationship === 'CoAuthorWith') return '#0891b2';
        if (d.relationship === 'SameMentorAs') return '#9333ea';
        return '#ca8a04';
      })
      .attr('stroke-width', 1)
      .attr('opacity', 0.95);

    linkLabels
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 13.5)
      .attr('dx', 55)
      .attr('fill', (d) => {
        if (d.relationship === 'CoAuthorWith') return '#38bdf8';
        if (d.relationship === 'SameMentorAs') return '#c084fc';
        return '#fde047';
      })
      .attr('font-size', '9.5px')
      .attr('font-weight', '600')
      .text((d) => d.relationLabel);

    const drag = d3
      .drag<SVGGElement, D3ScholarNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const nodeGroup = g.append('g').attr('class', 'nodes');
    const nodes = nodeGroup
      .selectAll<SVGGElement, D3ScholarNode>('g')
      .data(nodesData)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .call(drag)
      .on('click', (_event, d) => {
        setSelectedScholarId(d.id);
      });

    nodes
      .append('circle')
      .attr('r', 40)
      .attr('class', 'node-halo')
      .attr('fill', 'none')
      .attr('stroke', (d) => (d.id === selectedScholar.id ? '#f59e0b' : 'transparent'))
      .attr('stroke-width', 3)
      .attr('opacity', (d) => (d.id === selectedScholar.id ? 0.8 : 0));

    nodes
      .append('circle')
      .attr('r', 32)
      .attr('fill', (d) => {
        if (d.fundingLevel === 'CapEx_High') return '#064e3b';
        if (d.fundingLevel === 'OpEx_Mid') return '#0c4a6e';
        return '#1e293b';
      })
      .attr('stroke', (d) => {
        if (d.id === selectedScholar.id) return '#f59e0b';
        if (d.fundingLevel === 'CapEx_High') return '#10b981';
        if (d.fundingLevel === 'OpEx_Mid') return '#0ea5e9';
        return '#64748b';
      })
      .attr('stroke-width', (d) => (d.id === selectedScholar.id ? 3 : 2))
      .attr('filter', (d) => (d.id === selectedScholar.id ? 'url(#glow-filter)' : null));

    nodes
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -3)
      .attr('fill', '#ffffff')
      .attr('font-size', '11.5px')
      .attr('font-weight', 'bold')
      .text((d) => d.name.split('（')[0]);

    nodes
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 14)
      .attr('fill', (d) => {
        if (d.fundingLevel === 'CapEx_High') return '#6ee7b7';
        if (d.fundingLevel === 'OpEx_Mid') return '#7dd3fc';
        return '#cbd5e1';
      })
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '9.5px')
      .attr('font-weight', '600')
      .text((d) => d.fundingAmountRMB);

    const tagGroup = nodes.append('g').attr('transform', 'translate(0, 42)');
    tagGroup
      .append('rect')
      .attr('x', -68)
      .attr('y', 0)
      .attr('width', 136)
      .attr('height', 18)
      .attr('rx', 4)
      .attr('fill', '#020617')
      .attr('stroke', (d) => {
        if (d.fundingLevel === 'CapEx_High') return '#065f46';
        if (d.fundingLevel === 'OpEx_Mid') return '#0369a1';
        return '#334155';
      })
      .attr('stroke-width', 0.8)
      .attr('opacity', 0.95);

    tagGroup
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 12)
      .attr('fill', '#e2e8f0')
      .attr('font-size', '9px')
      .text((d) => `${d.institution.slice(0, 6)} · ${d.title.split('/')[0].slice(0, 7)}`);

    simulation.on('tick', () => {
      links
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkLabels.attr('transform', (d: any) => {
        const x = (d.source.x + d.target.x) / 2 - 55;
        const y = (d.source.y + d.target.y) / 2 - 10;
        return `translate(${x}, ${y})`;
      });

      nodes.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [displayedScholars, fundingFilter, highlightPathFromLin, manualRunTick]);

  useEffect(() => {
    if (!gRef.current) return;
    const g = gRef.current;

    g.selectAll('.node-halo')
      .attr('stroke', (d: any) => (d.id === selectedScholar.id ? '#f59e0b' : 'transparent'))
      .attr('opacity', (d: any) => (d.id === selectedScholar.id ? 0.8 : 0));

    g.selectAll('.nodes circle:nth-child(2)')
      .attr('stroke', (d: any) => {
        if (d.id === selectedScholar.id) return '#f59e0b';
        if (d.fundingLevel === 'CapEx_High') return '#10b981';
        if (d.fundingLevel === 'OpEx_Mid') return '#0ea5e9';
        return '#64748b';
      })
      .attr('stroke-width', (d: any) => (d.id === selectedScholar.id ? 3 : 2))
      .attr('filter', (d: any) => (d.id === selectedScholar.id ? 'url(#glow-filter)' : null));
  }, [selectedScholar]);

  const handleZoom = (scaleFactor: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(250).call(zoomBehaviorRef.current.scaleBy, scaleFactor);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(400).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  const handleReheatSimulation = () => {
    setFundingFilter('all');
    setSelectedScholarId(dynamicNetwork.nodes[0].id);
    setManualRunTick((t) => t + 1);
    if (simulationRef.current) {
      simulationRef.current.alpha(0.8).restart();
    }
  };

  const connectedEdges = dynamicNetwork.edges.filter(
    (e) => e.source === selectedScholar.id || e.target === selectedScholar.id
  );

  const getFundingBadge = (level: ScholarNode['fundingLevel'], amount: string) => {
    switch (level) {
      case 'CapEx_High':
        return (
          <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
            CapEx 拍板买家 ({amount})
          </span>
        );
      case 'OpEx_Mid':
        return (
          <span className="text-xs font-mono font-medium text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80">
            OpEx 直签买家 ({amount})
          </span>
        );
      default:
        return (
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            平台把关人 ({amount})
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[700px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
      {/* Left Canvas Visualizer Area */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"
      >
        {/* Canvas Toolbar with D3 and Filter controls */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-200">
              D3 力导向客户关系图谱 · 当前同步：{confirmedCustomer?.scholarName || '欧阳涓'}（{confirmedCustomer?.institution || '中山一院'}）
            </span>
            <button
              type="button"
              onClick={handleReheatSimulation}
              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1 shadow-sm cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>手动运行 / 同步「{confirmedCustomer?.scholarName || '当前客户'}」重绘</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Funding Waterline Filter */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 border border-slate-800 rounded-lg">
              <button
                onClick={() => setFundingFilter('all')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all cursor-pointer ${
                  fundingFilter === 'all'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                全部节点
              </button>
              <button
                onClick={() => setFundingFilter('CapEx_High')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all cursor-pointer ${
                  fundingFilter === 'CapEx_High'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                大额 CapEx (≥ 100万)
              </button>
              <button
                onClick={() => setFundingFilter('OpEx_Mid')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all cursor-pointer ${
                  fundingFilter === 'OpEx_Mid'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                常规 OpEx
              </button>
            </div>

            {/* Jumpboard Path Toggle */}
            <button
              onClick={() => setHighlightPathFromLin(!highlightPathFromLin)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border cursor-pointer ${
                highlightPathFromLin
                  ? 'bg-amber-950/70 text-amber-300 border-amber-600/70 shadow-xs'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{highlightPathFromLin ? '高亮：L2二当家 ➔ L1一把手跳板' : '普通视图'}</span>
            </button>

            {/* D3 Viewport Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 border border-slate-800 rounded-lg">
              <button
                onClick={() => handleZoom(1.2)}
                title="放大"
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleZoom(0.8)}
                title="缩小"
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                title="重置居中"
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleReheatSimulation}
                title="重新沉降力学布局"
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* D3 Interactive SVG Canvas */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
          <svg ref={svgRef} className="w-full h-[540px] select-none" />

          {/* Hover Tooltip Overlay */}
          {hoveredEdge && (
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-900/95 border border-amber-500/40 rounded-xl text-xs text-slate-200 shadow-xl space-y-1 z-10 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Share2 className="w-3.5 h-3.5" />
                <span>内部推进与转介绍脚本：</span>
              </div>
              <p className="italic text-slate-300 text-xs leading-relaxed">
                {hoveredEdge.leverageScript}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Detailed Scholar Inspector */}
      <div className="w-full lg:w-[450px] bg-slate-900/95 flex flex-col overflow-y-auto p-6 space-y-5">
        {/* Scholar Header */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center justify-between gap-2">
            {getFundingBadge(selectedScholar.fundingLevel, selectedScholar.fundingAmountRMB)}
            <span className="text-xs font-mono text-slate-400">{selectedScholar.fundingSource}</span>
          </div>

          <h3 className="text-lg font-bold text-white mt-2 flex items-center gap-2">
            <span>{selectedScholar.name}</span>
            <span className="text-xs font-normal text-slate-400">({selectedScholar.title})</span>
          </h3>

          <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {selectedScholar.institution} · {selectedScholar.department}
            </span>
          </p>

          <p className="text-xs text-cyan-300 mt-1 font-medium">
            主攻方向：{selectedScholar.researchField}
          </p>
        </div>

        {/* 1. 科研经费水位透视 */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-4 h-4" />
              <span>经费水位与支付能力定性</span>
            </span>
            <span className="font-mono text-emerald-300 font-bold">
              {selectedScholar.fundingAmountRMB}
            </span>
          </div>

          <div className="space-y-1 text-xs text-slate-300">
            <p>
              <strong className="text-slate-400">经费类型：</strong>
              {selectedScholar.fundingSource}
            </p>
            <p>
              <strong className="text-slate-400">销售与技术支持动作：</strong>
              {selectedScholar.fundingLevel === 'CapEx_High' ? (
                <span className="text-emerald-300 font-medium">
                  【旗舰大设备立项拍板】先配合L2分管副职跑通实测Figure，再呈报L1一把手锁定全光谱流式与空间多组学预算。
                </span>
              ) : selectedScholar.fundingLevel === 'OpEx_Mid' ? (
                <span className="text-cyan-300 font-medium">
                  【小额OpEx免招标直签】推4.8万元PanoVUE 6色空间切片与Olink 1μL微量蛋白检测，2周快速走账。
                </span>
              ) : (
                <span className="text-amber-300 font-medium">
                  【平台机管与报计划卡位】递交写好1800小时共享机时测算的《可行性论证报告初稿》与《防堵孔质控SOP》。
                </span>
              )}
            </p>
          </div>
        </div>

        {/* 2. 已知实验室装机台账信息 */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Microscope className="w-4 h-4 text-cyan-400" />
              <span>现场设备台账与替换契机</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              共 {selectedScholar.installedBase.length} 项现场线索
            </span>
          </div>

          <div className="space-y-1.5">
            {selectedScholar.installedBase.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-slate-900 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <span className="text-slate-200 font-medium">{item}</span>
                <span className="text-[10px] text-amber-400 font-mono bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60 shrink-0 ml-2">
                  升级切入点
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 关联学者与内部决策跳板 */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <Share2 className="w-4 h-4" />
              <span>内部人事协同与转介绍跳板</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {connectedEdges.length} 条推进链路
            </span>
          </div>

          <div className="space-y-2.5">
            {connectedEdges.map((edge) => {
              const otherId =
                edge.source === selectedScholar.id ? edge.target : edge.source;
              const otherScholar = dynamicNetwork.nodes.find((s) => s.id === otherId);
              if (!otherScholar) return null;

              return (
                <div
                  key={edge.id}
                  className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 transition-all hover:border-amber-500/40"
                >
                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={() => setSelectedScholarId(otherScholar.id)}
                      className="font-semibold text-slate-100 hover:text-amber-300 flex items-center gap-1 group text-left cursor-pointer"
                    >
                      <span>{otherScholar.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({otherScholar.title.split('/')[0]})
                      </span>
                      <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-amber-300" />
                    </button>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                      {otherScholar.fundingAmountRMB}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">{edge.description}</p>

                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                    <span className="text-amber-400 font-medium">实战推进动作：</span>
                    <p className="mt-1 italic text-slate-300 text-[11px] leading-relaxed">
                      {edge.leverageScript}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. 论文与实验痛点扫描 */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>代表成果与实验瓶颈分析</span>
            </span>
            <span className="font-mono text-cyan-300 text-[10px] bg-cyan-950 px-1.5 py-0.5 rounded">
              IF {selectedScholar.impactFactor}
            </span>
          </div>

          <p className="text-xs font-medium text-slate-200">
            《{selectedScholar.recentPaperTitle}》
          </p>
          <p className="text-[11px] text-slate-400 font-mono">{selectedScholar.journal}</p>

          <div className="p-2.5 bg-rose-950/30 border border-rose-800/40 rounded-lg text-xs text-rose-300 space-y-1">
            <span className="font-semibold text-rose-400">核心实验与业务痛点：</span>
            <p className="leading-relaxed">{selectedScholar.paperDefect}</p>
          </div>
        </div>

        {/* 5. 个人买单动力 */}
        <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <UserCheck className="w-4 h-4" />
            <span>客户核心买单诉求</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed pl-6">
            {selectedScholar.personalWin}
          </p>
        </div>
      </div>
    </div>
  );
};
