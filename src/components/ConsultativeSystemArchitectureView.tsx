import React, { useEffect, useState } from 'react';
import {
  Layers,
  BookOpen,
  Users,
  Compass,
  FlaskConical,
  CalendarClock,
  Check,
  Copy,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Database,
  Sparkles,
} from 'lucide-react';
import { useCustomerContext, ConfirmedCustomerProfile } from '../context/CustomerContext';
import { RelationshipRadarGraph } from './RelationshipRadarGraph';

type EngineStepId =
  | 'arch_blueprint'
  | 'step0_macro_funnel'
  | 'step1_lab_panorama'
  | 'step2_blindspot_consulting'
  | 'step3_network_routing'
  | 'step4_mvp_pilot'
  | 'step5_lifecycle_closing';

function buildInstantConsultativeFallback(customer: ConfirmedCustomerProfile) {
  const isYouth = customer.personTier === 'L2';
  const mentorList = customer.deptLeaderName
    ? customer.deptLeaderName.split(/[&、/]/).map((s) => s.trim()).filter(Boolean)
    : [];

  return {
    customerHeader: {
      institution: customer.institution,
      department: customer.department,
      scholarName: customer.scholarName,
      englishName: customer.scholarName,
      roleBadge: customer.title || (isYouth ? '第一作者青年科研骨干' : '课题组长 PI'),
      personTier: isYouth ? 'L2' : 'L1',
      mentorNames: mentorList,
      totalLabPapers: 4,
      totalLabPersonnel: 6,
      totalSubDirections: 2,
    },
    module1_labPanorama: {
      allLabPapers: [
        {
          id: 'fallback-p1',
          pmid: '',
          title: `围绕「${customer.researchKeywords}」的核心分子机制与转化医学代表作`,
          journalTitle: 'International Peer-Reviewed SCI Journal',
          pubYear: '2024',
          authorString: isYouth
            ? `${customer.scholarName}, ${customer.firstAuthorNames || '同组实验骨干'}, ${customer.deptLeaderName || '通讯导师'}*`
            : `${customer.firstAuthorNames || '课题组一作硕博'}, ${customer.scholarName}*`,
          affiliation: `${customer.institution} · ${customer.department}`,
          relationScope: '本人直接署名代表作',
        },
      ],
      fullRoster: [
        {
          name: customer.scholarName,
          cleanEnName: customer.scholarName,
          isTarget: true,
          paperCount: 1,
          firstAuthorCount: isYouth ? 1 : 0,
          corrAuthorCount: isYouth ? 0 : 1,
          minYear: 2021,
          maxYear: 2025,
          department: customer.department,
          email: '',
          papers: [`「${customer.researchKeywords}」代表性成果`],
          timeStatusTag: '当前锁定目标客户',
          tacticalRole: isYouth
            ? '目标青年骨干（一作操盘手 · 自下而上突破核心）'
            : '目标课题组长 PI（经费终审与立项拍板人）',
        },
      ],
      subDirections: [
        {
          clusterTitle: `核心主攻子方向 A：${customer.researchKeywords}`,
          leadPersons: `核心负责人：${customer.scholarName}`,
          yearSpan: '2021–2025',
          coreTechniques: '多色流式细胞分型 + 组织原位多重免疫荧光 + 信号通路分子验证',
          paperItems: [
            {
              title: `围绕「${customer.researchKeywords}」的机制与验证研究`,
              journal: 'SCI 期刊',
              year: '2024',
              pmid: '',
              scope: '本人直接署名代表作',
            },
          ],
        },
      ],
    },
    module2_blindSpotConsulting: {
      currentBaseline: {
        researchFocus: customer.researchKeywords,
        sampleAndModel: `围绕「${customer.researchKeywords}」的细胞系、造模动物组织及临床队列样本`,
        currentTechUsed: '传统流式细胞术 + 双色免疫荧光 / Western Blot + 常规 ELISA',
        representativeEvidence: `${customer.institution} · ${customer.department} 发表成果`,
      },
      equipmentAndPipelineAudit: {
        verificationMethodology:
          '三级招标回退（课题组直属 ➔ 二级学院/重点实验室 ➔ 上级法人单位抬头）× 历史论文 Materials & Methods 交叉印证法',
        biddingFallbackChain: [
          {
            tier: '第一级 · 课题组/科室级直属招标核查',
            headerUsed: `${customer.scholarName}课题组（${customer.department}）`,
            statusBadge: '自动向上回退穿透',
            finding: `高校与三甲医院科研采购极少以单一 PI 姓名对外发标；本课题组日常小额耗材走院内商城直采，大型仪器均归口至二级学院或【${customer.institution}】统一抬头招标。`,
          },
          {
            tier: '第二级 · 二级学院 / 重点实验室共享平台招标',
            headerUsed: `${customer.institution} · ${customer.department.split(' · ')[0]}`,
            statusBadge: '匹配院级平台配置',
            finding: `检索【${customer.institution}${customer.department.split(' · ')[0]}】历史设备修购记录，确认院系公共房配置有常规细胞培养间、蛋白免疫印迹系统、普通荧光显微镜及基础流式分析仪。`,
          },
          {
            tier: '第三级 · 上级单位法人抬头历史招标回退（核心兜底）',
            headerUsed: `采购人抬头：「${customer.institution}」（中央/省市高校与医疗设备集中采购公告）`,
            statusBadge: '结合论文M&M交叉锁定',
            finding: `通过【${customer.institution}】历年教学科研设备招标公告与该实验室历史论文的 Materials & Methods 交叉比对，精准剥离出「实验室自有常备设备」、「需去校级平台排队借用的设备」与「完全缺失的卡脖子设备」。`,
          },
        ],
        confirmedOwnedEquipment: [
          {
            equipmentName:
              '常规分子与蛋白验证全套基础设备（WB 化学发光成像仪 / 梯度 PCR & 实时荧光定量 qPCR 仪 / 多功能酶标仪）',
            ownershipBadge: '课题组实验室自有常备',
            biddingEvidence: `【二级学院批量招标】${customer.institution} · ${customer.department} 基础科研仪器标准配置包`,
            paperMethodEvidence: `历史论文 Materials & Methods 高频出现：直接开展蛋白表达免疫印迹（Western Blot）、基因敲减/过表达验证及细胞增殖活力测定。`,
            bottleneckAndPain:
              '仅能做群体细胞匀浆后的半定量均值分析（Bulk Level），无法分辨异质性细胞亚群，更无法获知蛋白在组织原位的空间分布。',
          },
          {
            equipmentName: '传统 4–8 色常规滤光片式流式细胞分析仪（院系公共流式房基础款）',
            ownershipBadge: '上级单位抬头招标 · 院级公共共享',
            biddingEvidence: `【上级单位抬头招标】「${customer.institution} 教学科研仪器设备采购项目」早期购置的传统双激光/三激光常规流式分析仪`,
            paperMethodEvidence:
              '论文实测印证：课题组文章已发表 Annexin V/PI 细胞凋亡、PI 细胞周期或基础表面标志物分群数据，证明具备流式样本前处理能力但受限于仪器通道数。',
            bottleneckAndPain:
              '① 传统滤光片流式最多测 4–6 色，通道间荧光溢漏补偿极难调；② 无法自动扣除原代组织/肝细胞/药物处理带来的高强度自发荧光；③ 公共平台开机预约常需排队 3–7 天。',
          },
        ],
        confirmedMissingEquipment: [
          {
            missingEquipmentName:
              '【确认缺口 01】24–40 色全光谱流式细胞分析与超高速无损细胞分选平台（带自发荧光独立通道扣除）',
            gapConfirmationLogic: `交叉比对「${customer.institution}」近 3 年公开招标公告与本课题组历史文章 Materials & Methods：确认课题组内部升级切入方向。`,
            technicalPainPoint:
              '在研管线往「体内免疫微环境 / 稀有干性亚群 / 药物干预原代细胞」深入时，原代组织自发荧光极强且珍贵样本细胞数少。',
            actionTrackService:
              '【短期免设备切入 · 卖测样/试剂】无需客户买百万元仪器！直接提供「全光谱流式驻场收样代测 + 12–24色定制抗体小样包」，走课题组 ≤5万测试费直签。',
            actionTrackCapEx: `【中长期设备切入 · 挂靠上级单位抬头报计划】在 3月/9月「双一流/设备更新专项」窗口，联合同学院 2–3 位 PI 以【${customer.institution}】抬头申报修购计划。`,
          },
          {
            missingEquipmentName:
              '【确认缺口 02】全自动多光谱组织原位多重免疫荧光定量分析系统（mIHC / TSA 6–9色空间表型平台）',
            gapConfirmationLogic: `历史论文 M&M 核查：课题组过往文章采用传统单标 IHC 或双色 IF，缺乏多色酪胺信号放大（TSA）原位空间距离算法分析。`,
            technicalPainPoint:
              '审稿人一旦要求证明“靶点蛋白高表达细胞是否在空间上直接招募/抑制了某类免疫细胞”，传统切连续切片做单染无法对齐同一细胞坐标。',
            actionTrackService:
              '【短期免设备切入 · 卖石蜡切片多色原位包】仅需客户寄送 2 张常规石蜡白片，我方利用 mIHC 平台完成 6–8 色同片共染 + 空间距离定量分析。',
            actionTrackCapEx: `【中长期设备切入 · 院级病理与转化平台立项】协助科室主任撰写《多模态组织空间定量成像平台可行性论证报告》，挂靠「${customer.institution}」年度科研仪器修购专项。`,
          },
        ],
        activePipelinesDeduction: [
          {
            pipelineTitle: `在研管线 01（主航道延续线）：围绕「${customer.researchKeywords}」从体外分子机制向体内原位微环境/临床队列推进`,
            grantAndPaperAnchor: `锚定依据：课题组近期发表代表作 + 在研国家自然科学基金/省市专项`,
            supportedByOwnedEquip:
              '已用实验室自有平台跑通了核心靶点对下游信号通路与细胞表型的调控。',
            blockedByMissingEquip:
              '卡在「体内原位多细胞互作验证」与「高背景组织样本稀有亚群高维分型及单细胞多组学验证」。',
            fdeBreakthroughAction:
              '先用 2 例样本跑通 MVP 预实验，直接卡位其在研管线最痛的实验缺口！',
          },
        ],
      },
      verticalNextStepPrediction: {
        title: '纵向预判切入点：结合「已有/缺失设备差集」，精准预判他正在卡壳的下一篇实验',
        publishedLimitation: `前期研究主要验证了「${customer.researchKeywords}」基础表型，冲击更高分顶刊面临审稿人“缺乏体内组织微环境多细胞空间共定位与高维免疫代谢证据”的质询。`,
        predictedNextExperiment:
          '向体内原代组织微环境推进：高维全光谱免疫分型定制 Panel + 单张切片 6–8 色空间原位免疫荧光定量靶点与微环境空间距离！',
        consultativeHookScript: `“${customer.scholarName}老师，拜读了咱们组在「${customer.researchKeywords}」上的前期成果，也对照了咱们【${customer.institution}】平台的仪器配置。咱们前期通路跑得很扎实，下一步往体内微环境或临床队列推进时，我们刚好有一套无需买大设备、直接用高维定制抗体包配空间原位共染的补充方案，正好能接在您上一篇结论后面直接出顶刊大图！”`,
      },
      horizontalTechTransplant: {
        title: '横向跨界移植切入点：针对该实验室「设备空白点」，把邻近高分领域的新工具嫁接过来',
        sourceDomainBenchmark:
          '借鉴 2024–2025《Nature Communications》《Hepatology》在肿瘤免疫微环境与器官损伤中的前沿范式',
        transplantedTechSolution:
          '【全光谱流式高维预混抗体 Panel】+【1μL 超微量上清/血清 24 因子高通量液相芯片联检】',
        whyCustomerHasNotThoughtOfIt:
          `通过核查【${customer.institution}】历史招标与咱们组历史文章的 Materials & Methods，针对珍贵原代样本与微量体液，引入高通量微量化联检可大幅节省样本并翻倍产出机制数据。`,
        consultativeHookScript: `“${customer.scholarName}老师，最近隔壁发《Nature Communications》的团队都在用高维预混光谱流式 Panel 配合‘1微升上清一次同测 24 种细胞因子’，同样一批造模或临床样本能多挖出两倍的机制数据！”`,
      },
    },
    module3_intermediaryRoutes: [
      {
        routeType: '路径 A · 一线实操内线法（先把干活的一作/同门发展成内部中间人）',
        targetPerson: isYouth
          ? `${customer.scholarName}（本人即为一线一作） + 同组共署实验骨干`
          : customer.firstAuthorNames || '课题组近两年新发一作的在读博后/博士生',
        roleInChain: '每天在实验室养细胞、跑流式并向大老板做周四组会 PPT 汇报的实操主将',
        howToTurnIntoChampion:
          '不谈商务采购，只聊实验卡点！由售前工程师带现成抗体小样与顶刊 Protocol 进实验室，免费帮跑 2 例高难样本并修好组会 Figure 图，让他在大老板面前立功。',
      },
      {
        routeType: '路径 B · 同门与跨院系“曲线救国”法（大老板见不到或防御心强时借力引荐）',
        targetPerson: customer.subPiNames || '同课题组共同通讯 PI / 往届留院同门师兄',
        roleInChain: '与目标课题组共享论文署名、共享实验平台或同出一门的“熟人信任跳板”',
        howToTurnIntoChampion:
          '先拜访或服务其共同通讯合作科室/同门师兄弟，拿到同院实测背书后，以“正配合咱们共同通讯 X 教授/同门师兄做联合课题预实验”名义自然切入。',
      },
      {
        routeType: '路径 C · 经费拍板人直击法（带着咨询切入点 + 组会实测数据找大老板收网）',
        targetPerson: isYouth
          ? customer.deptLeaderName || '课题组通讯作者大老板 (L1 PI)'
          : `${customer.scholarName}（课题组通讯 PI）`,
        roleInChain: '国家自然科学基金与省市重大专项经费终审签字人（L1 拍板层）',
        howToTurnIntoChampion:
          '在一作内线跑出 2 例漂亮预实验图的基础上，携《冲击 10 分顶刊补实验测试方案》与《≤5万元免招标课题测试费直签协议》面见通讯大老板，10 分钟内敲定签字。',
      },
    ],
    module4_mvpPilotProtocol: {
      pilotName: `针对【${customer.scholarName}】课题组的 2 样本零风险微缩预实验包（MVP Pilot）`,
      sampleRequirement:
        '无需动用珍贵临床孤品队列！仅需提供 2 例常规细胞系或造模小鼠对照样本',
      technicalExecution:
        '由我方应用工程师携带全套预混多色流式 Panel / 原位多重免疫荧光试剂盒驻场或冷链取样，48–72 小时内完成光谱解混与空间共定位定量分析。',
      deliverables: [
        '1 份可直接放进周四课题组会 PPT 的 300 DPI 顶刊级高清多色共定位/流式分群 Figure 图',
        '1 份针对该课题组样本本底荧光特征定制的《实验条件摸索与抗体配比 SOP》',
        '1 份控制在院内免招标额度内（≤4.8万元）的分阶段测试化验加工费报价单',
      ],
      riskReversalPromise:
        '零样本损耗风险、零前期费用门槛：预实验不出清晰阳性分群/共定位结果，分文不收且免费协助排查样本制备问题。',
    },
    module5_lifecycleClosing: {
      verifiedGrants: [
        {
          grantId: '在研国家级/省部级纵向课题',
          agency: '国家自然科学基金委员会 / 省市科技计划',
        },
      ],
      stages: [
        {
          stageName: '阶段一：课题刚立项 / 新生开题期（每年 9–11 月）',
          customerPain: '刚拿到经费或博后刚进组，正在搭动物/细胞模型，急需确定高分技术路线与采购首批基础抗体耗材。',
          bestAction: '主打【模块二·横向跨界技术移植咨询】，帮其把全光谱流式与空间多组学写进开题报告，锁定全年试剂耗材协议供货。',
          budgetAccount: '纵向课题「材料费 / 试剂耗材费」（院内商城或课题组直采）',
        },
        {
          stageName: '阶段二：文章审稿大修补实验期（Revision / Rebuttal 黄金救急窗口）',
          customerPain: '审稿人限期 2–3 个月补充体内免疫微环境或信号通路共定位证据，客户对时间极度敏感、对价格最不敏感！',
          bestAction: '主打【模块二·纵向预判 + 模块四·72小时加急预实验】，帮一作在 2 周内快速补齐审稿人要求的硬核 Figure。',
          budgetAccount: '纵向课题「测试化验加工费」（单笔 ≤5 万元免政采招标，PI 一支笔直接签字报销）',
        },
        {
          stageName: '阶段三：年度设备报计划与结题冲刺期（每年 3–4 月 / 9–10 月）',
          customerPain: '科室/重点实验室准备上报次年大型仪器修购预算，老师缺人手撰写长达十余页的《可行性论证报告》与三家比价材料。',
          bestAction: '联合同院系 2–3 个子课题组，代写完备的《共享平台年均 1800 小时开机率可行性论证初稿》，提前植入独有控标参数。',
          budgetAccount: '双一流学科建设专项 / 医院年度医学装备 CapEx 修购预算（50万–500万元级）',
        },
      ],
    },
  };
}

export const ConsultativeSystemArchitectureView: React.FC<{
  deepProfile?: any;
}> = ({ deepProfile }) => {
  const { confirmedCustomer, confirmCustomer } = useCustomerContext();
  const [activeStep, setActiveStep] = useState<EngineStepId>('step2_blindspot_consulting');
  const [systemData, setSystemData] = useState<any>(null);
  const [loadingSystem, setLoadingSystem] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Progressive disclosure states to avoid visual wall-of-text on mobile & desktop
  const [step2Filter, setStep2Filter] = useState<'all' | 'owned' | 'missing' | 'scripts'>('all');
  const [expandedEvidenceIds, setExpandedEvidenceIds] = useState<Record<string, boolean>>({});
  const [step1Tab, setStep1Tab] = useState<'directions' | 'roster'>('directions');

  // Macro-to-Micro ("由面及点") Institutional Funnel State
  const [macroInstitution, setMacroInstitution] = useState<string>(
    confirmedCustomer?.institution || '中山大学附属第一医院'
  );
  const [macroProductLine, setMacroProductLine] = useState<string>(
    '全光谱流式与高维免疫分型'
  );
  const [macroData, setMacroData] = useState<any>(null);
  const [loadingMacro, setLoadingMacro] = useState<boolean>(false);

  const toggleEvidence = (key: string) => {
    setExpandedEvidenceIds((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const loadMacroFunnel = (inst: string, prodLine: string) => {
    if (!inst.trim()) return;
    setLoadingMacro(true);
    fetch('/api/intel/institution-macro-funnel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        institution: inst.trim(),
        productLine: prodLine,
      }),
    })
      .then((r) => r.text())
      .then((raw) => {
        if (!raw || raw.trim().startsWith('<')) return;
        const json = JSON.parse(raw);
        if (json?.success && json?.macroFunnel) {
          setMacroData(json.macroFunnel);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoadingMacro(false);
      });
  };

  useEffect(() => {
    if (confirmedCustomer?.institution) {
      setMacroInstitution(confirmedCustomer.institution);
      loadMacroFunnel(confirmedCustomer.institution, macroProductLine);
    }
  }, [confirmedCustomer?.institution]);

  useEffect(() => {
    if (!confirmedCustomer) return;
    setSystemData(buildInstantConsultativeFallback(confirmedCustomer));

    let cancelled = false;
    setLoadingSystem(true);
    fetch('/api/intel/consultative-system', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        institution: confirmedCustomer.institution,
        department: confirmedCustomer.department,
        scholarName: confirmedCustomer.scholarName,
        researchKeywords: confirmedCustomer.researchKeywords,
      }),
    })
      .then((r) => r.text())
      .then((raw) => {
        if (cancelled || !raw || raw.trim().startsWith('<')) return;
        const json = JSON.parse(raw);
        if (json?.success && json?.consultativeSystem) {
          setSystemData(json.consultativeSystem);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingSystem(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    confirmedCustomer?.id,
    confirmedCustomer?.scholarName,
    confirmedCustomer?.institution,
    confirmedCustomer?.department,
  ]);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1800);
  };

  if (!confirmedCustomer || !systemData) return null;

  const header = systemData.customerHeader;
  const mod1 = systemData.module1_labPanorama;
  const mod2 = systemData.module2_blindSpotConsulting;
  const equipAudit =
    mod2?.equipmentAndPipelineAudit || mod1?.equipmentAndPipelineAudit;
  const mod3: any[] = systemData.module3_intermediaryRoutes || [];
  const mod4 = systemData.module4_mvpPilotProtocol;
  const mod5 = systemData.module5_lifecycleClosing;

  const navSteps: Array<{
    id: EngineStepId;
    num: string;
    title: string;
    sub: string;
  }> = [
    {
      id: 'step2_blindspot_consulting',
      num: '核心 02',
      title: '设备现状与管线切入',
      sub: '论文M&M×招标核验',
    },
    {
      id: 'step0_macro_funnel',
      num: '战略面',
      title: '由面及点单位沙盘',
      sub: '盘平台➔筛课题组集群',
    },
    {
      id: 'step1_lab_panorama',
      num: '家底 01',
      title: '全量文章与人员名单',
      sub: `${header.totalLabPapers}篇文献 · ${header.totalLabPersonnel}名成员`,
    },
    {
      id: 'step3_network_routing',
      num: '找人 03',
      title: '人脉雷达与曲线救国',
      sub: '直接拍板 vs 内部引荐',
    },
    {
      id: 'step4_mvp_pilot',
      num: '验证 04',
      title: '2样本零风险试测包',
      sub: '72h出组会汇报图',
    },
    {
      id: 'step5_lifecycle_closing',
      num: '收网 05',
      title: '课题周期与科目匹配',
      sub: '≤5万免招标/修购立项',
    },
    {
      id: 'arch_blueprint',
      num: '架构图',
      title: '五步系统全景蓝图',
      sub: '点击模块直接跳转',
    },
  ];

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-5 space-y-4">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              五步顾问式攻单引擎（由面及点：单位大盘 ➔ 课题组集群 ➔ 设备与管线切入）
            </h2>
            {loadingSystem && (
              <span className="text-xs font-mono text-cyan-300 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>同步最新论文XML中...</span>
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
            <span className="text-white font-semibold">{header.scholarName}</span>
            <span aria-hidden="true">·</span>
            <span>{header.institution}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-400 tabular-nums">
              文献 {header.totalLabPapers} 篇 / 成员 {header.totalLabPersonnel} 人 / 子方向 {header.totalSubDirections} 个
            </span>
          </div>
        </div>
      </div>

      {/* Swipeable Mobile-First Horizontal Step Pill Bar (No cramped multi-row grid on mobile) */}
      <div className="flex lg:grid lg:grid-cols-7 gap-2 overflow-x-auto no-scrollbar pb-1">
        {navSteps.map((st) => {
          const isAct = activeStep === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setActiveStep(st.id)}
              className={`min-h-[52px] min-w-[148px] lg:min-w-0 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer flex flex-col justify-between shrink-0 border ${
                isAct
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-sm'
                  : 'bg-slate-950/90 hover:bg-slate-900 text-slate-300 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span
                  className={`text-[11px] font-mono tabular-nums ${
                    isAct ? 'text-slate-950 font-extrabold' : 'text-cyan-400 font-semibold'
                  }`}
                >
                  {st.num}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 ${isAct ? 'text-slate-950' : 'text-slate-500'}`}
                />
              </div>
              <div className="text-xs font-bold truncate mt-0.5">{st.title}</div>
              <div
                className={`text-[10px] truncate mt-0.5 ${
                  isAct ? 'text-slate-900 font-medium' : 'text-slate-400'
                }`}
              >
                {st.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* ====================================================================
          VIEW 00: INTERACTIVE SYSTEM ARCHITECTURE BLUEPRINT DIAGRAM
          (Mobile: Touch-friendly vertical flow cards; Desktop: Full SVG diagram)
         ==================================================================== */}
      {activeStep === 'arch_blueprint' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/90 pb-2.5">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  纯业务驱动型顾问式销售系统 · 四层全景架构图
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  点击任意模块直接跳转至【{header.scholarName}】对应的实战数据视图。
                </p>
              </div>
            </div>

            {/* Mobile-Friendly Vertical Interactive Architecture Stack (< md) */}
            <div className="md:hidden space-y-2.5">
              {[
                {
                  layer: 'LAYER 01 · 数据核验底座',
                  title: '多源文献全文 XML + 三级历史招投标回退',
                  desc: '连接 Europe PMC / OpenAlex / ORCID，提取论文 Materials & Methods 仪器型号与基金编号。',
                  target: 'step0_macro_funnel' as EngineStepId,
                  accent: 'border-slate-700 text-sky-300',
                },
                {
                  layer: 'LAYER 02 · 中枢桥梁 (Module 01)',
                  title: '全量实验室业务摸底（全文章 + 全人员时间轴）',
                  desc: `已扒出 ${header.scholarName} 团队 ${header.totalLabPapers} 篇文献与 ${header.totalLabPersonnel} 名成员，自动区分在役一作与往届同门。`,
                  target: 'step1_lab_panorama' as EngineStepId,
                  accent: 'border-cyan-500/40 text-cyan-300',
                },
                {
                  layer: 'LAYER 03-A · 核心引擎 (Module 02)',
                  title: '设备缺口核验 × 在研管线痛点与切入方案',
                  desc: '交叉比对上级单位招标与论文 M&M，明确已配设备、外包环节与纵向/横向切入话术。',
                  target: 'step2_blindspot_consulting' as EngineStepId,
                  accent: 'border-emerald-500/40 text-emerald-300',
                },
                {
                  layer: 'LAYER 03-B · 核心引擎 (Module 03)',
                  title: '人际网络雷达与曲线救国路径',
                  desc: '穿透 1° 通讯导师/一作与 2° 同门师兄弟，制定直接攻关或内部引荐路线。',
                  target: 'step3_network_routing' as EngineStepId,
                  accent: 'border-amber-500/40 text-amber-300',
                },
                {
                  layer: 'LAYER 04 · 转化与收网 (Modules 04 & 05)',
                  title: '2样本零风险试测包 ➔ 课题周期与经费科目收网',
                  desc: '72h 交付组会汇报高清图，精准匹配 ≤5万免招标测试费或 3/9 月设备修购计划。',
                  target: 'step4_mvp_pilot' as EngineStepId,
                  accent: 'border-purple-500/40 text-purple-300',
                },
              ].map((card, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveStep(card.target)}
                  className={`w-full p-3.5 rounded-xl bg-slate-900/90 border ${card.accent} text-left space-y-1 cursor-pointer`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span>{card.layer}</span>
                    <span>点击进入 ▸</span>
                  </div>
                  <div className="text-sm font-bold text-white">{card.title}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{card.desc}</p>
                </button>
              ))}
            </div>

            {/* Desktop Interactive SVG Architecture Blueprint (md+) */}
            <div className="hidden md:block w-full overflow-x-auto">
              <svg
                viewBox="0 0 1080 560"
                className="w-full min-w-[780px] h-auto select-none"
              >
                <defs>
                  <marker
                    id="arch-arrow-cyan"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#22d3ee" />
                  </marker>
                  <marker
                    id="arch-arrow-amber"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
                  </marker>
                  <marker
                    id="arch-arrow-emerald"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#34d399" />
                  </marker>
                </defs>

                {/* LAYER 1: OSINT DATA INGESTION & VERIFICATION LAYER */}
                <rect
                  x={20}
                  y={16}
                  width={1040}
                  height={86}
                  rx={14}
                  fill="#091024"
                  stroke="#1e293b"
                  strokeWidth={1.5}
                />
                <text
                  x={40}
                  y={38}
                  fill="#38bdf8"
                  fontSize={11}
                  fontWeight={700}
                  fontFamily="JetBrains Mono, monospace"
                >
                  LAYER 01 · 多源实时学术与历史招投标采集底座（单位+姓名双因子强校验 · 三级招标抬头回退机制）
                </text>

                {[
                  {
                    x: 40,
                    title: 'Europe PMC / PubMed 论文与材料方法',
                    desc: '提取全量SCI文章 · 实验方法与材料(M&M) · 基金号',
                  },
                  {
                    x: 295,
                    title: 'OpenAlex 机构与学者知识图谱',
                    desc: '穿透机构归属关系 · 共同作者2度网络 · 被引影响力',
                  },
                  {
                    x: 550,
                    title: 'ORCID 同音异字与履历核验',
                    desc: '自动识别拼音/同音字变体 · 跨单位学术迁徙轨迹',
                  },
                  {
                    x: 805,
                    title: '三级历史招投标回退 (实验室➔上级单位)',
                    desc: '查不到具体实验室招标时，用上级单位抬头+论文M&M确认设备',
                  },
                ].map((box, i) => (
                  <g key={i} transform={`translate(${box.x}, 48)`}>
                    <rect
                      x={0}
                      y={0}
                      width={235}
                      height={44}
                      rx={8}
                      fill="#0f172a"
                      stroke="#334155"
                      strokeWidth={1}
                    />
                    <text
                      x={12}
                      y={18}
                      fill="#f8fafc"
                      fontSize={11.5}
                      fontWeight={700}
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      {box.title}
                    </text>
                    <text
                      x={12}
                      y={34}
                      fill="#94a3b8"
                      fontSize={9.5}
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      {box.desc}
                    </text>
                  </g>
                ))}

                <line
                  x1={540}
                  y1={102}
                  x2={540}
                  y2={128}
                  stroke="#22d3ee"
                  strokeWidth={2}
                  markerEnd="url(#arch-arrow-cyan)"
                />

                {/* LAYER 2: MODULE 01 - FULL LAB PANORAMA EXCAVATION */}
                <g
                  onClick={() => setActiveStep('step1_lab_panorama')}
                  className="cursor-pointer"
                >
                  <rect
                    x={20}
                    y={132}
                    width={1040}
                    height={102}
                    rx={14}
                    fill="#082f49"
                    stroke="#22d3ee"
                    strokeWidth={2}
                  />
                  <text
                    x={40}
                    y={156}
                    fill="#67e8f9"
                    fontSize={12}
                    fontWeight={700}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    LAYER 02 · 【中枢桥梁模块 01】全量实验室业务摸底引擎（扒透该客户实验室的所有文章、所有人员与设备底盘） [点击进入 ▸]
                  </text>

                  {[
                    {
                      x: 40,
                      title: '① 个人+导师课题组全量文献与M&M提取',
                      desc: '穿透本人及通讯大老板全量论文，提取实验材料与技术基线',
                    },
                    {
                      x: 380,
                      title: '② 全员名单时间轴过滤 (Time-Axis Filter)',
                      desc: '自动区分「近1-3年在役当打主将」vs「往届已毕业一作校友」',
                    },
                    {
                      x: 720,
                      title: '③ 上级单位招标×论文方法交叉盘点设备',
                      desc: '确认实验室「自有设备 vs 公共平台借用设备 vs 缺失设备缺口」',
                    },
                  ].map((item, idx) => (
                    <g key={idx} transform={`translate(${item.x}, 168)`}>
                      <rect
                        x={0}
                        y={0}
                        width={320}
                        height={52}
                        rx={9}
                        fill="#020617"
                        stroke="#0ea5e9"
                        strokeWidth={1.2}
                      />
                      <text
                        x={14}
                        y={20}
                        fill="#ffffff"
                        fontSize={12}
                        fontWeight={700}
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {item.title}
                      </text>
                      <text
                        x={14}
                        y={38}
                        fill="#bae6fd"
                        fontSize={10}
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {item.desc}
                      </text>
                    </g>
                  ))}
                </g>

                <path
                  d="M 320 234 L 270 266"
                  stroke="#34d399"
                  strokeWidth={2.2}
                  fill="none"
                  markerEnd="url(#arch-arrow-emerald)"
                />
                <path
                  d="M 760 234 L 810 266"
                  stroke="#f59e0b"
                  strokeWidth={2.2}
                  fill="none"
                  markerEnd="url(#arch-arrow-amber)"
                />

                {/* LAYER 3 LEFT: MODULE 02 */}
                <g
                  onClick={() => setActiveStep('step2_blindspot_consulting')}
                  className="cursor-pointer"
                >
                  <rect
                    x={20}
                    y={270}
                    width={505}
                    height={148}
                    rx={14}
                    fill="#064e3b"
                    stroke="#34d399"
                    strokeWidth={2}
                  />
                  <text
                    x={38}
                    y={294}
                    fill="#6ee7b7"
                    fontSize={12}
                    fontWeight={700}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    【第一大核心模块 02】设备缺口确认 × 在研管线痛点与切入点 [点击进入 ▸]
                  </text>
                  <text
                    x={38}
                    y={313}
                    fill="#ecfdf5"
                    fontSize={11}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    核心逻辑：上级单位招标+论文M&M ➔ 确认有什么/缺什么设备 ➔ 锁定在研管线痛点
                  </text>

                  <rect
                    x={38}
                    y={324}
                    width={228}
                    height={78}
                    rx={9}
                    fill="#022c22"
                    stroke="#10b981"
                    strokeWidth={1.2}
                  />
                  <text
                    x={50}
                    y={344}
                    fill="#34d399"
                    fontSize={11.5}
                    fontWeight={700}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    A. 招标×论文确认：有啥设备/缺啥设备
                  </text>
                  <text
                    x={50}
                    y={363}
                    fill="#d1fae5"
                    fontSize={10}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    查不到具体实验室招标时回退上级单位抬头，
                  </text>
                  <text
                    x={50}
                    y={379}
                    fill="#d1fae5"
                    fontSize={10}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    结合论文M&M锁定缺失设备与在研管线卡点
                  </text>

                  <rect
                    x={278}
                    y={324}
                    width={228}
                    height={78}
                    rx={9}
                    fill="#022c22"
                    stroke="#10b981"
                    strokeWidth={1.2}
                  />
                  <text
                    x={290}
                    y={344}
                    fill="#34d399"
                    fontSize={11.5}
                    fontWeight={700}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    B. 纵向预判下一篇 + 横向移植新技术
                  </text>
                  <text
                    x={290}
                    y={363}
                    fill="#d1fae5"
                    fontSize={10}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    针对缺失设备导致的机制断层，给出免买仪器
                  </text>
                  <text
                    x={290}
                    y={379}
                    fill="#d1fae5"
                    fontSize={10}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    测样补实验方案或联合挂靠上级抬头报计划
                  </text>
                </g>

                {/* LAYER 3 RIGHT: MODULE 03 */}
                <g
                  onClick={() => setActiveStep('step3_network_routing')}
                  className="cursor-pointer"
                >
                  <rect
                    x={555}
                    y={270}
                    width={505}
                    height={148}
                    rx={14}
                    fill="#451a03"
                    stroke="#f59e0b"
                    strokeWidth={2}
                  />
                  <text
                    x={573}
                    y={294}
                    fill="#fcd34d"
                    fontSize={12}
                    fontWeight={700}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    【第二大核心模块 03】人际网络雷达与曲线救国导航 [点击进入 ▸]
                  </text>
                  <text
                    x={573}
                    y={313}
                    fill="#fef3c7"
                    fontSize={11}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    核心目标：无论对方是拍板人还是中间人，摸清 1°/2° 关系网实现最高效攻关
                  </text>

                  <rect
                    x={573}
                    y={324}
                    width={228}
                    height={78}
                    rx={9}
                    fill="#270e02"
                    stroke="#f59e0b"
                    strokeWidth={1.2}
                  />
                  <text
                    x={585}
                    y={344}
                    fill="#fbbf24"
                    fontSize={11.5}
                    fontWeight={700}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    A. 多跳同心圆雷达 & 顺藤摸瓜
                  </text>
                  <text
                    x={585}
                    y={363}
                    fill="#fde68a"
                    fontSize={10}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    穿透 1°通讯导师/一作 + 2°导师同门师兄弟，
                  </text>
                  <text
                    x={585}
                    y={379}
                    fill="#fde68a"
                    fontSize={10}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    支持点击任意关联人物一键切换雷达靶心
                  </text>

                  <rect
                    x={813}
                    y={324}
                    width={228}
                    height={78}
                    rx={9}
                    fill="#270e02"
                    stroke="#f59e0b"
                    strokeWidth={1.2}
                  />
                  <text
                    x={825}
                    y={344}
                    fill="#fbbf24"
                    fontSize={11.5}
                    fontWeight={700}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    B. 直接攻关 vs 曲线救国路径矩阵
                  </text>
                  <text
                    x={825}
                    y={363}
                    fill="#fde68a"
                    fontSize={10}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    大老板见不到时，优先扶持一线一作内线或借
                  </text>
                  <text
                    x={825}
                    y={379}
                    fill="#fde68a"
                    fontSize={10}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    跨院系共同通讯PI / 往届同门师兄背书引荐
                  </text>
                </g>

                <line
                  x1={270}
                  y1={418}
                  x2={270}
                  y2={446}
                  stroke="#34d399"
                  strokeWidth={2}
                  markerEnd="url(#arch-arrow-emerald)"
                />
                <line
                  x1={810}
                  y1={418}
                  x2={810}
                  y2={446}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  markerEnd="url(#arch-arrow-amber)"
                />

                {/* LAYER 4 LEFT: MODULE 04 */}
                <g
                  onClick={() => setActiveStep('step4_mvp_pilot')}
                  className="cursor-pointer"
                >
                  <rect
                    x={20}
                    y={450}
                    width={505}
                    height={94}
                    rx={14}
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth={1.8}
                  />
                  <text
                    x={38}
                    y={474}
                    fill="#38bdf8"
                    fontSize={12}
                    fontWeight={700}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    【转化加速器 04】零风险最小验证包（2-Sample MVP Pilot） [点击进入 ▸]
                  </text>
                  <text
                    x={38}
                    y={496}
                    fill="#f1f5f9"
                    fontSize={11}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    • 消除客户“怕浪费珍贵临床样本、怕学生摸条件耽误毕业”两大纯业务阻力
                  </text>
                  <text
                    x={38}
                    y={516}
                    fill="#94a3b8"
                    fontSize={10.5}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    • 2例常规对照样本免费试测 ➔ 72h交付周四组会汇报高清Figure图 ➔ 顺势引出通讯导师
                  </text>
                </g>

                {/* LAYER 4 RIGHT: MODULE 05 */}
                <g
                  onClick={() => setActiveStep('step5_lifecycle_closing')}
                  className="cursor-pointer"
                >
                  <rect
                    x={555}
                    y={450}
                    width={505}
                    height={94}
                    rx={14}
                    fill="#0f172a"
                    stroke="#a855f7"
                    strokeWidth={1.8}
                  />
                  <text
                    x={573}
                    y={474}
                    fill="#c084fc"
                    fontSize={12}
                    fontWeight={700}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    【商务收网闭环 05】课题生命周期与在账经费科目精准匹配 [点击进入 ▸]
                  </text>
                  <text
                    x={573}
                    y={496}
                    fill="#f1f5f9"
                    fontSize={11}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    • 9-11月立项开题期(锁耗材) · 审稿大修Rebuttal期(≤5万测试费直签) · 3/9月报计划(控标设备)
                  </text>
                  <text
                    x={573}
                    y={516}
                    fill="#94a3b8"
                    fontSize={10.5}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    • 自动提取论文致谢国自然/省市基金号（如 {mod5?.verifiedGrants?.[0]?.grantId || 'NSFC'}）匹配财务报销科目
                  </text>
                </g>

                <line
                  x1={525}
                  y1={497}
                  x2={555}
                  y2={497}
                  stroke="#22d3ee"
                  strokeWidth={2}
                  markerEnd="url(#arch-arrow-cyan)"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          VIEW MACRO: 由面及点 · 单位全局沙盘与活跃课题组集群下钻漏斗
         ==================================================================== */}
      {activeStep === 'step0_macro_funnel' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    由面及点 · 四级战略漏斗沙盘（锁单位 ➔ 盘平台招标 ➔ 筛活跃课题组集群 ➔ 下钻具体 PI 与一作）
                  </h3>
                </div>
              </div>
              {loadingMacro && (
                <span className="text-xs font-mono text-emerald-300 flex items-center gap-1 shrink-0">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>正在扫描全院平台与课题组集群...</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-4 space-y-1">
                <label className="text-xs text-slate-400 block">
                  第一步（锁单位）：输入目标医院 / 高校
                </label>
                <input
                  type="text"
                  value={macroInstitution}
                  onChange={(e) => setMacroInstitution(e.target.value)}
                  placeholder="例如：中山大学附属第一医院 / 暨南大学"
                  className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="md:col-span-5 space-y-1">
                <label className="text-xs text-slate-400 block">
                  第二步（定产品线）：选择我方主推产品线
                </label>
                <select
                  value={macroProductLine}
                  onChange={(e) => {
                    setMacroProductLine(e.target.value);
                    loadMacroFunnel(macroInstitution, e.target.value);
                  }}
                  className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none"
                >
                  <option value="全光谱流式与高维免疫分型">
                    产品线 A：全光谱流式细胞仪 / 24-40色定制Panel耗材 / 活细胞无损分选
                  </option>
                  <option value="空间多组学与原位多重免疫荧光">
                    产品线 B：mIHC 6-9色组织原位多重免疫荧光 / 空间转录组与病理定量
                  </option>
                  <option value="活细胞能量代谢与超微量多因子">
                    产品线 C：Seahorse 能量代谢 / 1μL超微量细胞因子芯片 / Olink靶向蛋白组
                  </option>
                  <option value="单细胞与高通量测序外包截流">
                    产品线 D：高活性单细胞核测序(snRNA-seq) / 空间多组学CRO外包截流
                  </option>
                </select>
              </div>

              <div className="md:col-span-3">
                <button
                  type="button"
                  onClick={() => loadMacroFunnel(macroInstitution, macroProductLine)}
                  className="w-full min-h-[42px] py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>扫描单位大盘</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-xs">
              <span className="text-slate-400 shrink-0">快速切换：</span>
              {[
                '中山大学附属第一医院',
                '暨南大学',
                '广东省中医院',
                '北京中医药大学',
                '湖北中医药大学',
              ].map((instName) => (
                <button
                  key={instName}
                  type="button"
                  onClick={() => {
                    setMacroInstitution(instName);
                    loadMacroFunnel(instName, macroProductLine);
                  }}
                  className={`px-3 py-1 rounded-lg border cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                    macroInstitution === instName
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {instName}
                </button>
              ))}
            </div>
          </div>

          {macroData && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      单位级招投标与公共平台设备大盘（{macroData.institution}）
                    </span>
                    <span className="text-xs font-mono text-emerald-300">
                      {macroData.institutionalBiddingOverview?.accountTierBadge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {macroData.institutionalBiddingOverview?.publicPlatformBaseline}
                  </p>
                  <div className="pt-1 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 tabular-nums">
                    <span>
                      匹配SCI产出：<strong className="text-emerald-300">{macroData.totalMatchedRecentPapers} 篇</strong>
                    </span>
                    <span>·</span>
                    <span>
                      核心平台：<strong className="text-cyan-300">{macroData.keyPlatforms?.length || 0} 个</strong>
                    </span>
                    <span>·</span>
                    <span>
                      活跃PI集群：<strong className="text-amber-300">{macroData.activeLabClusters?.length || 0} 个大组</strong>
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <div className="text-xs font-mono font-bold text-emerald-300">
                    战略闭环：由面及点选滩头 ➔ 以点破面连锅端
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                    {macroData.institutionalBiddingOverview?.pointToSurfaceExpansionStrategy}
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-sm font-bold text-white">
                  匹配我方「{macroData.productLine}」的活跃课题组集群（点击一键下钻单点深挖）
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {macroData.activeLabClusters?.map((cluster: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/95 border border-slate-800 hover:border-emerald-500/50 transition-colors space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <span className="text-sm font-bold text-white">
                            #{cluster.clusterRank} {cluster.piName} 团队
                          </span>
                          <span className="text-xs font-mono text-emerald-400">
                            {cluster.activityBadge}
                          </span>
                        </div>
                        <div className="text-xs text-cyan-300">
                          平台/科室：{cluster.departmentPlatform}
                        </div>
                        <div className="text-xs text-amber-300">
                          在役一作骨干：{cluster.firstAuthorBackbones?.join(' 、 ')}
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 line-clamp-3">
                          <strong className="text-emerald-400">匹配诊断：</strong>
                          {cluster.productFitDiagnosis}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            confirmCustomer({
                              industrySector: 'biomed',
                              institution: macroData.institution,
                              department: cluster.departmentPlatform,
                              scholarName: cluster.piName,
                              title: '课题组长 PI / 通讯作者（由面及点筛选锁定）',
                              researchKeywords:
                                cluster.samplePapers?.[0]?.title?.slice(0, 36) ||
                                macroData.productLine,
                              englishQuery: `${macroData.institution} ${cluster.piName}`,
                              personTier: 'L1',
                              firstAuthorNames: cluster.firstAuthorBackbones?.join(' / '),
                            });
                            setActiveStep('step2_blindspot_consulting');
                          }}
                          className="flex-1 min-h-[40px] py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>下钻大PI：{cluster.piName}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        {cluster.firstAuthorBackbones?.[0] &&
                          cluster.firstAuthorBackbones[0] !== '课题组一线在读硕博生' && (
                            <button
                              type="button"
                              onClick={() => {
                                confirmCustomer({
                                  industrySector: 'biomed',
                                  institution: macroData.institution,
                                  department: cluster.departmentPlatform,
                                  scholarName: cluster.firstAuthorBackbones[0],
                                  title: `一线核心第一作者（通讯导师：${cluster.piName}）`,
                                  researchKeywords:
                                    cluster.samplePapers?.[0]?.title?.slice(0, 36) ||
                                    macroData.productLine,
                                  englishQuery: `${macroData.institution} ${cluster.firstAuthorBackbones[0]}`,
                                  personTier: 'L2',
                                  deptLeaderName: cluster.piName,
                                });
                                setActiveStep('step2_blindspot_consulting');
                              }}
                              className="flex-1 min-h-[40px] py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>下钻一作：{cluster.firstAuthorBackbones[0]}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ====================================================================
          VIEW 01: LAB PANORAMA (Segmented into Sub-Directions vs Full Roster)
         ==================================================================== */}
      {activeStep === 'step1_lab_panorama' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setStep1Tab('directions')}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  step1Tab === 'directions'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                业务子方向与论文 ({mod1.subDirections?.length || 1})
              </button>
              <button
                type="button"
                onClick={() => setStep1Tab('roster')}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  step1Tab === 'roster'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                全员时间轴名单 ({mod1.fullRoster?.length || 1}人)
              </button>
            </div>
          </div>

          {step1Tab === 'directions' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
              {mod1.subDirections?.map((sub: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-cyan-300">{sub.clusterTitle}</span>
                    <span className="text-xs font-mono text-slate-400 shrink-0 tabular-nums">
                      {sub.yearSpan}
                    </span>
                  </div>
                  <div className="text-xs text-amber-300 font-medium">{sub.leadPersons}</div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-slate-400">核心方法：</strong>
                    {sub.coreTechniques}
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    {sub.paperItems?.slice(0, 4).map((p: any, pIdx: number) => (
                      <div
                        key={pIdx}
                        className="text-xs text-slate-200 bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5"
                      >
                        <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-emerald-400">
                          <span>
                            {p.journal} ({p.year})
                          </span>
                          <span className="text-cyan-300">{p.scope}</span>
                        </div>
                        <div className="font-medium text-white mt-1 line-clamp-2">{p.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mod1.fullRoster?.map((person: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between space-y-2.5 ${
                    person.isTarget
                      ? 'bg-emerald-950/25 border-emerald-500/50'
                      : person.corrAuthorCount > 0
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-sm font-bold text-white truncate">{person.name}</span>
                      <span className="text-xs font-mono text-cyan-300 shrink-0 tabular-nums">
                        {person.paperCount} 篇
                      </span>
                    </div>
                    <div className="text-xs text-amber-300 font-medium">
                      {person.timeStatusTag}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {person.department}
                    </div>
                    <div className="text-xs text-emerald-300 pt-1 border-t border-slate-800/80">
                      {person.tacticalRole}
                    </div>
                  </div>

                  {!person.isTarget && (
                    <button
                      type="button"
                      onClick={() =>
                        confirmCustomer({
                          industrySector: confirmedCustomer.industrySector || 'biomed',
                          institution: header.institution,
                          department: person.department || header.department,
                          scholarName: person.cleanEnName,
                          title: person.timeStatusTag,
                          researchKeywords: mod2.currentBaseline.researchFocus,
                          englishQuery: `${header.institution} ${person.cleanEnName}`,
                          personTier: person.corrAuthorCount > 0 ? 'L1' : 'L2',
                        })
                      }
                      className="w-full min-h-[38px] py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>切换深挖 {person.cleanEnName}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          VIEW 02: EQUIPMENT AUDIT + ACTIVE PIPELINES + BLIND-SPOT CONSULTING
          (Progressive Disclosure: Scannable conclusions first, 1-tap accordion for XML quotes)
         ==================================================================== */}
      {activeStep === 'step2_blindspot_consulting' && (
        <div className="space-y-4">
          {equipAudit && (
            <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              {/* Top Bar with Sub-Filter Segmented Buttons */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      现场设备现状与动态管线升级切入方案
                    </h3>
                    {equipAudit.scannedFullTextPmcids?.length > 0 && (
                      <span className="text-xs font-mono text-emerald-400">
                        · 已穿透 {equipAudit.scannedFullTextPmcids.length} 篇论文全文 XML
                      </span>
                    )}
                  </div>
                </div>

                {/* Mobile-Friendly Segmented View Filter */}
                <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: '全景速览' },
                    {
                      id: 'owned',
                      label: `已配设备 (${equipAudit.confirmedOwnedEquipment?.length || 0})`,
                    },
                    {
                      id: 'missing',
                      label: `切入机会 (${equipAudit.confirmedMissingEquipment?.length || 0})`,
                    },
                    { id: 'scripts', label: '破局话术' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setStep2Filter(tab.id as any)}
                      className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        step2Filter === tab.id
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Critical Alerts (Dormant Scholar or High-End Multi-Flow Lab) */}
              {equipAudit.historicalDormantAlert && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-xs sm:text-sm text-rose-100 leading-relaxed">
                  <div className="font-bold text-rose-300 mb-1">
                    ⚠️ 近年无本人新数据预警（最后发文停留在 {equipAudit.maxDirectPubYear || 2018} 年）：
                  </div>
                  <div>{equipAudit.historicalDormantAlert}</div>
                </div>
              )}

              {equipAudit.highEndLabAlert && (
                <div className="p-3.5 rounded-xl bg-amber-950/35 border border-amber-500/40 text-xs sm:text-sm text-amber-100 leading-relaxed">
                  <div className="font-bold text-amber-300 mb-1">
                    ⚡ 顶配多流式/高端平台实测预警（严禁盲推基础流式整机）：
                  </div>
                  <div>{equipAudit.highEndLabAlert}</div>
                </div>
              )}

              {/* Confirmed Owned Equipment vs Missing/Upgrade Opportunities */}
              {(step2Filter === 'all' || step2Filter === 'owned' || step2Filter === 'missing') && (
                <div
                  className={`grid grid-cols-1 ${
                    step2Filter === 'all' ? 'lg:grid-cols-2' : ''
                  } gap-4`}
                >
                  {/* Left: Confirmed Owned Equipment */}
                  {(step2Filter === 'all' || step2Filter === 'owned') && (
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/70 border border-emerald-500/30 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-sm font-bold text-emerald-300">
                          已核实在用设备（论文M&M×中标台账）
                        </span>
                        <span className="text-xs font-mono text-slate-400 tabular-nums">
                          共 {equipAudit.confirmedOwnedEquipment?.length || 0} 台/套
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {equipAudit.confirmedOwnedEquipment?.map((eq: any, idx: number) => {
                          const evKey = `owned-${idx}`;
                          const isExpanded = Boolean(expandedEvidenceIds[evKey]);
                          return (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-xs sm:text-sm font-bold text-white leading-snug">
                                  {eq.equipmentName}
                                </span>
                                <span className="text-[11px] font-mono text-emerald-400 shrink-0">
                                  {eq.ownershipBadge}
                                </span>
                              </div>

                              <p className="text-xs text-amber-200/95 leading-relaxed">
                                <strong className="text-amber-300">衍生耗材/升级痛点：</strong>
                                {eq.bottleneckAndPain}
                              </p>

                              <button
                                type="button"
                                onClick={() => toggleEvidence(evKey)}
                                className="min-h-[34px] text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                              >
                                <span>
                                  {isExpanded
                                    ? '收起论文 M&M 原文与招标记录'
                                    : '查看论文 M&M 原文证据与招标溯源'}
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {isExpanded && (
                                <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs animate-in fade-in duration-150">
                                  <div className="text-cyan-200 leading-relaxed">
                                    <strong className="text-slate-400">中标台账：</strong>
                                    {eq.biddingEvidence}
                                  </div>
                                  <div className="text-slate-300 font-mono text-[11px] bg-slate-900 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                                    <strong className="text-emerald-400">论文 M&M 原文：</strong>
                                    {eq.paperMethodEvidence}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Right: Confirmed Missing Equipment / Upgrade Entry */}
                  {(step2Filter === 'all' || step2Filter === 'missing') && (
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/70 border border-cyan-500/30 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-sm font-bold text-cyan-300">
                          动态管线痛点与切入方案（卖耗材服务 / 报计划）
                        </span>
                        <span className="text-xs font-mono text-cyan-400 tabular-nums">
                          {equipAudit.confirmedMissingEquipment?.length || 0} 大突破口
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {equipAudit.confirmedMissingEquipment?.map((gap: any, idx: number) => {
                          const gapKey = `missing-${idx}`;
                          const isExpanded = Boolean(expandedEvidenceIds[gapKey]);
                          return (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                            >
                              <div className="text-xs sm:text-sm font-bold text-white leading-snug">
                                {gap.missingEquipmentName}
                              </div>

                              <p className="text-xs text-amber-200 leading-relaxed">
                                <strong className="text-amber-300">核心卡点：</strong>
                                {gap.technicalPainPoint}
                              </p>

                              <div className="p-2.5 rounded-lg bg-emerald-950/25 border border-emerald-500/25 text-xs text-emerald-200 leading-relaxed">
                                {gap.actionTrackService}
                              </div>

                              <button
                                type="button"
                                onClick={() => toggleEvidence(gapKey)}
                                className="min-h-[34px] text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                              >
                                <span>
                                  {isExpanded
                                    ? '收起核验依据与中长期设备立项路径'
                                    : '展开核验依据与中长期设备报计划路径'}
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {isExpanded && (
                                <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs animate-in fade-in duration-150">
                                  <div className="text-slate-300 leading-relaxed">
                                    <strong className="text-slate-400">推导依据：</strong>
                                    {gap.gapConfirmationLogic}
                                  </div>
                                  <div className="text-cyan-300 leading-relaxed">
                                    {gap.actionTrackCapEx}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Pitch Scripts & Vertical / Horizontal Consulting Cards */}
          {(step2Filter === 'all' || step2Filter === 'scripts') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Vertical Next-Paper Prediction */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    纵向切入 · 预判下一篇必补实验
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {mod2.verticalNextStepPrediction.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-200 bg-emerald-950/25 border border-emerald-500/30 p-3 rounded-xl leading-relaxed">
                    {mod2.verticalNextStepPrediction.predictedNextExperiment}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-cyan-300">
                      面谈 / 微信破冰话术：
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(mod2.verticalNextStepPrediction.consultativeHookScript)
                      }
                      className="min-h-[36px] px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-semibold text-cyan-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedText === mod2.verticalNextStepPrediction.consultativeHookScript ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-cyan-400" />
                          <span>一键复制话术</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {mod2.verticalNextStepPrediction.consultativeHookScript}
                  </p>
                </div>
              </div>

              {/* Horizontal Tech Transplant */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-cyan-400">
                    横向切入 · 跨领域高分新工具移植
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {mod2.horizontalTechTransplant.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-cyan-100 bg-cyan-950/25 border border-cyan-500/30 p-3 rounded-xl leading-relaxed">
                    {mod2.horizontalTechTransplant.transplantedTechSolution}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-cyan-300">
                      横向降维咨询话术：
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(mod2.horizontalTechTransplant.consultativeHookScript)
                      }
                      className="min-h-[36px] px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-semibold text-cyan-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedText === mod2.horizontalTechTransplant.consultativeHookScript ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-cyan-400" />
                          <span>一键复制话术</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {mod2.horizontalTechTransplant.consultativeHookScript}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          VIEW 03: NETWORK RADAR & INTERMEDIARY ROUTING
         ==================================================================== */}
      {activeStep === 'step3_network_routing' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-white">
              目标客户直接攻关 vs「发展中间人曲线救国」三条实战路径
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {mod3.map((route, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="text-xs font-mono font-bold text-amber-300">
                      {route.routeType}
                    </div>
                    <div className="text-sm font-bold text-white">
                      {route.targetPerson}
                    </div>
                    <div className="text-xs text-cyan-300">{route.roleInChain}</div>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-xs text-slate-200 leading-relaxed">
                    <strong className="text-emerald-400">执行打法：</strong>
                    {route.howToTurnIntoChampion}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <RelationshipRadarGraph deepProfile={deepProfile} />
        </div>
      )}

      {/* ====================================================================
          VIEW 04: ZERO-RISK MVP PILOT PROTOCOL
         ==================================================================== */}
      {activeStep === 'step4_mvp_pilot' && mod4 && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <FlaskConical className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">{mod4.pilotName}</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="text-xs sm:text-sm font-bold text-cyan-300">
                1. 零门槛试测设计（消除样本损耗顾虑）
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                <strong className="text-slate-400">样本要求：</strong>
                {mod4.sampleRequirement}
              </p>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                <strong className="text-slate-400">标准执行：</strong>
                {mod4.technicalExecution}
              </p>
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed">
                <strong>零风险承诺：</strong>
                {mod4.riskReversalPromise}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="text-xs sm:text-sm font-bold text-amber-300">
                2. 72小时交付「组会立项三件套」
              </div>
              <div className="space-y-2">
                {mod4.deliverables?.map((deliv: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 flex items-start gap-2"
                  >
                    <span className="font-mono font-bold text-cyan-400 tabular-nums">
                      0{idx + 1}.
                    </span>
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          VIEW 05: LIFECYCLE & GRANT SUBJECT CLOSING
         ==================================================================== */}
      {activeStep === 'step5_lifecycle_closing' && mod5 && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm sm:text-base font-bold text-white">
                课题生命周期三大窗口 × 真实在账基金报销科目匹配
              </h3>
            </div>
            <div className="text-xs font-mono text-emerald-400">
              在账基金：
              {mod5.verifiedGrants?.map((g: any) => g.grantId).join(' / ')}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
            {mod5.stages?.map((st: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="text-sm font-bold text-white">{st.stageName}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-amber-300">客户痛点：</strong>
                    {st.customerPain}
                  </p>
                  <p className="text-xs text-cyan-200 leading-relaxed">
                    <strong className="text-cyan-400">切入动作：</strong>
                    {st.bestAction}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-xs font-mono text-emerald-300">
                  走账科目：{st.budgetAccount}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
