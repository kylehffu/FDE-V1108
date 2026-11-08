import React, { useEffect, useMemo, useState } from 'react';
import {
  Network,
  Users,
  Building2,
  ShieldAlert,
  Target,
  Check,
  Copy,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Layers,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { useCustomerContext, ConfirmedCustomerProfile } from '../context/CustomerContext';

export type NodeCategory = 'internal_leader' | 'internal_subpi' | 'internal_gatekeeper' | 'internal_exec' | 'external_institute' | 'competitor';

export interface TopologyNode {
  id: string;
  name: string;
  roleTitle: string;
  unitLabel: string;
  category: NodeCategory;
  tierLabel: string;
  budgetAuthority: string;
  decisionWeight: string;
  x: number;
  y: number;
  summary: string;
  competitorExposure: string;
  actionStrategy: string;
  greetingScript: string;
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  edgeType: 'hierarchy' | 'decision_chain' | 'external_collab' | 'competitor_risk';
  label: string;
  detail: string;
}

interface UnitTopologyDataset {
  id: string;
  unitName: string;
  badge: string;
  overviewAbstract: string;
  recommendedChainSummary: string;
  nodes: TopologyNode[];
  edges: TopologyEdge[];
}

function buildConfirmedCustomerTopology(customer: ConfirmedCustomerProfile): UnitTopologyDataset {
  const sector = customer.industrySector || 'biomed';
  const shortName =
    customer.scholarName.replace(/教授|主任|院长|老师|博士|总工|总经理/g, '').trim() || customer.scholarName;
  const subPiLabel = customer.subPiNames
    ? customer.subPiNames.split('、')[0].replace(/（.*）/, '').trim()
    : `${shortName}团队实权副手`;
  const execLabel = customer.firstAuthorNames
    ? customer.firstAuthorNames.split('（')[0].trim()
    : '一线技术验证主管';

  if (sector === 'semicon_mfg') {
    return {
      id: `confirmed-${customer.id}`,
      unitName: `【当前客户·半导体/高端制造】${customer.institution} · ${customer.department}（${shortName}体系）`,
      badge: '产线准入与决策链拓扑',
      overviewAbstract: `【${shortName} · ${customer.department}】组织与决策架构：内部呈“事业部总工/总经理(${shortName}, L1) ➔ 工艺与FA总监(${subPiLabel}, L2) ➔ 设备工程科与采购合规(L3) ➔ FA失效分析主任工程师(${execLabel}, L4)”四级结构；外部关联车规认证实验室与存量机台竞争防线。`,
      recommendedChainSummary: `最优推进决策链：FA主任工程师(${execLabel})免费盲测3片不良晶圆/电芯 ➔ 实权二当家(${subPiLabel})动用≤10万研发委外验证预算直签首单 ➔ 设备科汇总UPH吞吐与三年TCO立项书 ➔ ${shortName}在年度技改评审会拍板入围AVL`,
      nodes: [
        {
          id: 'conf-l1',
          name: shortName,
          roleTitle: `${customer.title} / 技改终审负责人`,
          unitLabel: '内部 L1 · 终极拍板人',
          category: 'internal_leader',
          tierLabel: 'L1 技改CapEx终审层（当前客户）',
          budgetAuthority: '年度产线技改/扩产 CapEx 500-3000万终审权',
          decisionWeight: 'AVL合格供应商入围与立项终审 100%',
          x: 470,
          y: 75,
          summary: `统领【${customer.department}】在「${customer.researchKeywords}」方向的车规良率爬坡与二期扩产产线规划，根据FA实测良率提升数据与TCO报告拍板。`,
          competitorExposure: '美日欧老牌进口机台厂商高层定期拜访，但存在备件交期 16 周以上、驻厂响应慢等痛点。',
          actionStrategy: `切勿空谈替代概念！先配合分管副总/总监（${subPiLabel}）与一线主任工程师（${execLabel}）完成 3 片高难失效样品盲测，跑出纳米级空洞定位与 UPH 提升实测报告呈交技改评审会。`,
          greetingScript: `“${shortName}总您好，我们正配合咱们事业部 ${subPiLabel} 总监团队做「${customer.researchKeywords}」产线微米/纳米级失效盲测与在线良率闭环，相关产线节拍与三年 TCO 对标方案已交设备工程科审阅。”`,
        },
        {
          id: 'conf-l2',
          name: subPiLabel,
          roleTitle: '工艺副总 & FA总监（实权二当家）',
          unitLabel: '内部 L2 · 实权二当家',
          category: 'internal_subpi',
          tierLabel: 'L2 核心实权突破口（业务二当家）',
          budgetAuthority: '研发委外测试/产线工程机验证 ≤10万元直签权',
          decisionWeight: '技术选型发起权 95% · 良率周会直接汇报人',
          x: 370,
          y: 210,
          summary: `真正在【${customer.department}】一线背负「${customer.researchKeywords}」良率与客诉零缺陷 KPI 的实权二当家，手握研发测试费免招标直签权。`,
          competitorExposure: '进口设备厂商售后按次高额收费，二线代测机构缺乏车规级 AEC-Q / 3D 无损断层重构能力。',
          actionStrategy: `【首选破局点】携同类型晶圆/电芯失效专利对标单页约见 ${subPiLabel}，提供 3 片典型不良品免费盲测对赌，用其研发测试预算直签 8.5 万元委外验证包。`,
          greetingScript: `“总监您好！拜读了您和${shortName}总联名公开的「${customer.researchKeywords}」发明专利，针对封装微裂纹/热失控界面，我们先免费帮产线盲测 3 片不良样品并出 3D 根因报告，走 8.5 万研发测试费即可直签！”`,
        },
        {
          id: 'conf-l3',
          name: `${customer.department}设备工程科 & 招采合规`,
          roleTitle: '产线设备工程主管 / AVL供应商准入与TCO审核',
          unitLabel: '内部 L3 · 执笔与导入把关',
          category: 'internal_gatekeeper',
          tierLabel: 'L3 技改立项执笔与SECS/GEM把关',
          budgetAuthority: '《年度产线技改可行性报告》与三家比价汇总',
          decisionWeight: '机台参数规范起草权 95% · 产线联机准入一票否决权',
          x: 590,
          y: 210,
          summary: `负责起草年度技改扩产设备招标技术规范书（SOR），严格把关机台 MTBF（平均无故障时间）、SECS/GEM 工厂自动化通讯协议与防尘防震环评合规。`,
          competitorExposure: '进口存量机台厂商正游说设备科沿用旧版排他性硬件尺寸与专有协议参数。',
          actionStrategy: '主动递交写好“UPH吞吐量提升 35% + 备件本土4小时响应 + 三年TCO节省42%”的《技改立项参数对标初稿》与《SECS/GEM零停机联调免责SOP》。',
          greetingScript: `“主管您好，为了省去您编写年度技改 SOR 技术规范书的时间，我们结合 ${subPiLabel} 团队在「${customer.researchKeywords}」上的盲测数据，把三年 TCO 测算表和 SECS/GEM 接口规范初稿全备好了！”`,
        },
        {
          id: 'conf-l4',
          name: execLabel,
          roleTitle: 'FA失效分析主任工程师（一线测试负责人）',
          unitLabel: '内部 L4 · 一线良率执行层',
          category: 'internal_exec',
          tierLabel: 'L4 每日8D客诉报告与盲测执行人',
          budgetAuthority: '委外FA测试与工程样机试用第一建议权 90%',
          decisionWeight: '不良品盲测实操与良率周报第一执笔人',
          x: 470,
          y: 355,
          summary: `每天在 FA 实验室与产线处理晶圆/电芯批次不良并编写车规客户 8D 根因分析报告，最怕常规截面研磨破坏唯一样品或测不出亚微米伪缺陷。`,
          competitorExposure: '常找外部第三方检测机构代测，但排期长达 5-7 天且给不出 AI 自动缺陷分类（ADC）算法模型。',
          actionStrategy: '提供“48小时加急无损亚微米CT/声扫盲测 + 车规8D报告现成高清重构图”，帮其当周搞定良率周会汇报。',
          greetingScript: `“工您好！看到您参与发明的「${customer.researchKeywords}」专利，针对下周良率复盘会，我们先免费帮您无损盲测 3 片极耳/键合不良样品，48 小时内连 8D 报告三维重构图一起交付给您！”`,
        },
        {
          id: 'conf-ext1',
          name: '工信部车规半导体/动力电池国检中心',
          roleTitle: '外部权威院所 · AEC-Q100/GB38031联合认证标杆',
          unitLabel: '外部院所 · 行业认证标杆',
          category: 'external_institute',
          tierLabel: '外部强关联国家级实验室',
          budgetAuthority: '车规可靠性标准制定与联合攻关课题方',
          decisionWeight: '对企业FA方法学与检测标准影响权重 85%',
          x: 115,
          y: 145,
          summary: `与【${customer.institution}】长期联合起草车规功率器件与电池安全评测标准，已全面引入无损高分辨 3D 纳米断层与在线 AI 缺陷拦截方案。`,
          competitorExposure: '高度认可高通量在线无损检测路线，是我方联合方法学示范基地。',
          actionStrategy: `向 ${subPiLabel} 展示国家级检测中心同款“亚微米无损断层 + AI 假阳性过滤”标准判据，瞬间打消技术顾虑。`,
          greetingScript: `“总监，目前车规国检中心做极限热冲击老化复核都在用这套亚微米无损断层配 AI 自动判陷算法，我们用完全一致的车规判据帮咱们产线做盲测！”`,
        },
        {
          id: 'conf-ext2',
          name: '长三角/大湾区头部Tier-1标杆产线',
          roleTitle: '外部标杆客户 · 同制程产线24×7满负荷装机点',
          unitLabel: '外部标杆 · 技改立项对标',
          category: 'external_institute',
          tierLabel: '外部同业量产标杆',
          budgetAuthority: '同类型扩产产线大批量复购示范方',
          decisionWeight: '设备科技改立项与AVL准入参考权重 85%',
          x: 115,
          y: 300,
          summary: '在同类 SiC 功率模块/固态电芯产线已批量导入我方在线检测装备，MTBF 超 4500 小时、零漏检客诉。',
          competitorExposure: '我方核心样板工程，可随时向目标客户开放同业产线数据脱敏对标。',
          actionStrategy: '在《技改可行性报告》中直接引用同业头部产线 UPH 提升 35% 与零漏检数据，帮设备科顺利通过集团投资委员会审查。',
          greetingScript: '“主管，同行业头部产线导入同款在线检测装备后 MTBF 超 4500 小时、年省返工成本超 300 万，脱敏对标参数我已经帮咱们整理进立项模板了！”',
        },
        {
          id: 'conf-comp1',
          name: '欧美日传统进口检测机台商',
          roleTitle: '潜在竞争对手 · 凭借一期存量机台游说锁标',
          unitLabel: '竞争对手 · 存量锁标风险',
          category: 'competitor',
          tierLabel: '外部竞品威胁 A',
          budgetAuthority: '试图锁定二期扩产/年度技改数千万CapEx',
          decisionWeight: '重点公关设备科沿用旧参数 (威胁度 高)',
          x: 825,
          y: 145,
          summary: '凭借一期产线早年采购的进口机台，游说设备工程科在二期扩产招标书中沿用排他性的硬件尺寸与传统离线抽检指标。',
          competitorExposure: '弱点：整机交期长达 6-9 个月，维保备件昂贵，且封闭式软件不支持定制化 AI 假阳性率压降。',
          actionStrategy: '植入“亚微米三维在线全检 + AI假阳性率<0.5% + 本土4小时驻厂SLA”刚性技改指标，瓦解进口存量锁标。',
          greetingScript: '“主管，传统进口机台只能离线抽检而且换个晶圆/电芯规格调参要两周；我们原生支持在线全检和 AI 零代码换型，备件本土 4 小时到厂！”',
        },
        {
          id: 'conf-comp2',
          name: '二线低价视觉组装/常规代测商',
          roleTitle: '潜在竞争对手 · 低价争抢委外FA测试与边缘工位',
          unitLabel: '竞争对手 · 低价内卷分流',
          category: 'competitor',
          tierLabel: '外部竞品威胁 B',
          budgetAuthority: '试图用低价2D视觉/破坏性切片分流研发预算',
          decisionWeight: '高频向一线工程师推销低价代测',
          x: 825,
          y: 300,
          summary: '频繁向 FA 工程师推销廉价 2D 光学外观机或破坏性金相切片代测，试图瓜分 10 万以内的研发验证预算。',
          competitorExposure: '弱点：2D 视觉完全看不见封装内部微米级空洞与界面分层，破坏性切片直接毁掉唯一车规失效证据。',
          actionStrategy: '用“零破坏3D亚微米重构 + 免费盲测3片高难失效件对赌”彻底封堵低价代测分流。',
          greetingScript: '“工，车规客诉件就这 2 片孤品，一旦磨金相切片就彻底毁了证据；用咱们无损 3D 亚微米断层扫描，内部微裂纹一览无余还能保留原件复核！”',
        },
      ],
      edges: [
        {
          id: 'ce-1',
          source: 'conf-l1',
          target: 'conf-l2',
          edgeType: 'hierarchy',
          label: '总工挂帅 / 授权专利二当家',
          detail: `${shortName}把控产线扩产大方向，日常良率攻关与 10 万内研发委外验证预算授权给专利第2发明人 ${subPiLabel}。`,
        },
        {
          id: 'ce-2',
          source: 'conf-l1',
          target: 'conf-l3',
          edgeType: 'hierarchy',
          label: '委托起草年度技改SOR规范',
          detail: `年度《产线技改可行性论证报告》与三家供应商 TCO 比价表由设备工程科汇总后呈报 ${shortName} 签批。`,
        },
        {
          id: 'ce-3',
          source: 'conf-l4',
          target: 'conf-l2',
          edgeType: 'decision_chain',
          label: '破局第1跳：盲测出图促签8.5万',
          detail: `先帮 FA 主任工程师（${execLabel}）免费无损盲测 3 片不良样品，向 ${subPiLabel} 汇报后当周即可走研发测试费直签 8.5 万。`,
        },
        {
          id: 'ce-4',
          source: 'conf-l2',
          target: 'conf-l3',
          edgeType: 'decision_chain',
          label: '破局第2跳：良率实测写入技改SOR',
          detail: `验证包跑出 UPH 与良率提升硬核数据后，由 ${subPiLabel} 联合设备科写入《年度产线技改技术规范书(SOR)》。`,
        },
        {
          id: 'ce-5',
          source: 'conf-l3',
          target: 'conf-l1',
          edgeType: 'decision_chain',
          label: '破局第3跳：良率周报+TCO立项终审',
          detail: `良率周会硬核盲测报告 + 设备科完备三年 TCO 立项书呈交，${shortName}在技改评审会上顺水推舟批准入围 AVL。`,
        },
        {
          id: 'ce-6',
          source: 'conf-ext1',
          target: 'conf-l2',
          edgeType: 'external_collab',
          label: '车规国检标准 / 判据对标',
          detail: '国家级车规检测中心的无损 3D 判据对工艺与 FA 总监具有极强公信力。',
        },
        {
          id: 'ce-7',
          source: 'conf-ext2',
          target: 'conf-l3',
          edgeType: 'external_collab',
          label: '同业量产标杆 / MTBF对标',
          detail: '同行业头部产线超 4500 小时 MTBF 实测数据可直接作为设备科撰写技改报告的依据。',
        },
        {
          id: 'ce-8',
          source: 'conf-comp1',
          target: 'conf-l3',
          edgeType: 'competitor_risk',
          label: '竞品渗透：游说沿用旧机台参数',
          detail: '需及时用“在线全检UPH提升35%+本土4小时SLA+SECS/GEM免停机SOP”反制进口存量厂商。',
        },
        {
          id: 'ce-9',
          source: 'conf-comp2',
          target: 'conf-l4',
          edgeType: 'competitor_risk',
          label: '竞品分流：低价2D/破坏性代测',
          detail: '用“无损3D亚微米断层+AI自动缺陷分类”高维刚需降维打击低价代测。',
        },
      ],
    };
  }

  if (sector === 'enterprise_ai') {
    return {
      id: `confirmed-${customer.id}`,
      unitName: `【当前客户·政企数字化/金融科技】${customer.institution} · ${customer.department}（${shortName}体系）`,
      badge: '架构选型与决策链拓扑',
      overviewAbstract: `【${shortName} · ${customer.department}】组织与决策架构：内部呈“科技部总经理/首席架构师(${shortName}, L1) ➔ 二级中心主任/领域架构负责人(${subPiLabel}, L2) ➔ 架构办与信安合规评审(L3) ➔ POC基准测试架构师(${execLabel}, L4)”四级结构；外部关联金融信创生态实验室与存量云厂商防线。`,
      recommendedChainSummary: `最优推进决策链：POC测试架构师(${execLabel})跑通脱敏压测沙箱 ➔ 二级中心主任(${subPiLabel})动用≤15万敏捷创新POC预算直签试点 ➔ 架构办汇总信创兼容与三级等保报告 ➔ ${shortName}在架构评审会拍板年度集采入围`,
      nodes: [
        {
          id: 'conf-l1',
          name: shortName,
          roleTitle: `${customer.title} / 技术委员会终审`,
          unitLabel: '内部 L1 · 终极拍板人',
          category: 'internal_leader',
          tierLabel: 'L1 年度科技CapEx终审层（当前锁定客户）',
          budgetAuthority: '总行/集团年度科技专项 500-5000万终审权',
          decisionWeight: '技术委员会架构终审 100%（重生产稳定性与信创合规）',
          x: 470,
          y: 75,
          summary: `统领【${customer.department}】在「${customer.researchKeywords}」方向的架构演进与核心系统安全生产，高度关注RTO<30秒高可用、算力ROI与监管合规，依靠二级中心POC压测数据拍板。`,
          competitorExposure: '头部通用公有云大厂与老牌外资软件商高层常年拜访，但存在私有化定制重、单卡推理成本高等问题。',
          actionStrategy: `切忌空谈概念PPT！先配合二级中心主任（${subPiLabel}）与POC架构师（${execLabel}）在行内隔离沙箱跑出 P99 延迟压降 55% 的压测报告，再由架构办呈报信创集采立项。`,
          greetingScript: `“${shortName}总您好，我们正配合咱们部 ${subPiLabel} 主任团队做「${customer.researchKeywords}」场景的信创算力推理加速与零幻觉审计沙箱压测，相关三级等保与多活高可用架构材料已交架构办审阅。”`,
        },
        {
          id: 'conf-l2',
          name: subPiLabel,
          roleTitle: '专利共同发明人 / 二级部门主任 & 领域架构负责人（二当家）',
          unitLabel: '内部 L2 · 实权二当家',
          category: 'internal_subpi',
          tierLabel: 'L2 核心实权突破口（业务科技二当家）',
          budgetAuthority: '部门级敏捷创新POC/咨询开发 ≤15万元直签权',
          decisionWeight: '技术选型发起权 95% · 架构评审会主汇报人',
          x: 370,
          y: 210,
          summary: `通过金融科技发明专利与顶会白皮书锁定的实权二当家。直接背负【${customer.department}】在「${customer.researchKeywords}」上的业务上线里程碑与吞吐性能指标，手握部门敏捷创新预算。`,
          competitorExposure: '外包开发商虽多，但缺乏高并发分布式流批一体与私有化低延迟算子优化能力。',
          actionStrategy: `【首选破局点】携同业头部银行/政企生产压测白皮书约见 ${subPiLabel}，提供 1 周离线容器镜像沙箱对赌实测，走部门敏捷创新预算直签 14.5 万元首期试点包。`,
          greetingScript: `“主任您好！拜读了您和${shortName}总联名发表的「${customer.researchKeywords}」技术专利，针对高并发实时推理与审计溯源，我们先提供脱敏容器镜像帮咱们跑 1 周基准压测，走部门 14.5 万敏捷创新预算即可快速立项！”`,
        },
        {
          id: 'conf-l3',
          name: `${customer.department}架构办 & 信安合规岗`,
          roleTitle: '企业架构管理办公室(EA) / 网络信息安全与招采合规把关',
          unitLabel: '内部 L3 · 执笔与信安把关',
          category: 'internal_gatekeeper',
          tierLabel: 'L3 集采招标参数执笔与等保合规把关',
          budgetAuthority: '《年度软硬件单一来源/公开招标技术规范书》起草',
          decisionWeight: '架构准入与信安合规一票否决权 95%',
          x: 590,
          y: 210,
          summary: `负责审核新引入软件栈是否符合全栈信创互认证（国产CPU/OS/数据库兼容）、数据不出域三级等保要求，并汇总编写年度科技集采招标技术评分表。`,
          competitorExposure: '存量中间件/云厂商正试图将专有接口标准写入下一年度集采评分细则。',
          actionStrategy: '主动递交完整的《全栈信创互认证证书汇编》、《零数据出域私有化部署安全白皮书》及《存量系统双轨平滑灰度迁移免责SOP》。',
          greetingScript: `“架构办/合规老师您好，为了配合咱们部年度科技集采报计划，我们把「${customer.researchKeywords}」所需的国产芯片/操作系统互认证报告、等保三级安全基线核查表和三家POC评分参照表全整理好了！”`,
        },
        {
          id: 'conf-l4',
          name: execLabel,
          roleTitle: '专利共同发明人 / 核心系统POC基准测试架构师',
          unitLabel: '内部 L4 · 一线压测执行层',
          category: 'internal_exec',
          tierLabel: 'L4 沙箱压测与架构评审PPT制作人',
          budgetAuthority: '开源/商业组件选型与POC压测评分第一建议权 90%',
          decisionWeight: '基准测试报告(Benchmark)第一执笔人',
          x: 470,
          y: 355,
          summary: `一线核心研发骨干。负责在测试环境部署容器镜像、执行 JMeter/Locust 极限并发压测并撰写《POC技术选型对比报告》，最怕部署依赖复杂或压测抖动导致背锅。`,
          competitorExposure: '正测试开源拼凑方案与友商重型底座，但被依赖冲突、显存OOM崩溃与长尾P99延迟困扰。',
          actionStrategy: '提供“单行命令离线Docker/Helm一键拉起 + 自动化Benchmark压测脚本 + 现成架构评审对比PPT页”，帮其2天内完美交差。',
          greetingScript: `“架构师您好！针对下周「${customer.researchKeywords}」选型评审，我们打包好了全离线一键启动镜像和自动化压测脚本，半小时就能跑出 QPS 翻倍、P99 延迟<80ms 的对比图表，连汇报 PPT 都帮您排好了！”`,
        },
        {
          id: 'conf-ext1',
          name: '金融信创生态实验室 / 信通院标准所',
          roleTitle: '外部权威机构 · 行业信创互认证与性能基准标杆',
          unitLabel: '外部机构 · 信创标准风向标',
          category: 'external_institute',
          tierLabel: '外部权威评测与标准机构',
          budgetAuthority: '行业信创选型目录与优秀案例推选方',
          decisionWeight: '对政企/金融科技选型合规参考权重 90%',
          x: 115,
          y: 145,
          summary: `与【${customer.institution}】共同开展核心系统分布式改造与大模型安全可控测评，其发布的信创卓越图谱是行内架构立项的重要参考。`,
          competitorExposure: '我方已全项通过其极端混沌工程高可用与安全合规评测。',
          actionStrategy: `向 ${subPiLabel} 与架构办出示信通院/金融信创实验室首批满分评测证书，彻底免除合规后顾之忧。`,
          greetingScript: `“主任，咱们这套架构刚在金融信创实验室和信通院跑完万级并发混沌工程测评，拿到了全栈一级互认证，行内立项过架构办评审完全零阻碍！”`,
        },
        {
          id: 'conf-ext2',
          name: '同业六大行/头部股份行生产标杆节点',
          roleTitle: '外部标杆客户 · 同级别核心生产集群3年零故障运行',
          unitLabel: '外部标杆 · 集采立项对标',
          category: 'external_institute',
          tierLabel: '外部同业生产样板',
          budgetAuthority: '同业科技集采千万级框架入围示范方',
          decisionWeight: '总行技术委员会立项对标权重 85%',
          x: 115,
          y: 300,
          summary: '已在同业头部机构核心风控与智能投研生产环境稳定运行超 1000 天，节省算力与授权成本 45%。',
          competitorExposure: '我方标杆生产客户，支持同业科技部门互访交流与招标评分参数对标。',
          actionStrategy: '在《立项可行性报告》中直接附带同业生产集群算力节省 45% 与 RTO<15秒实测对标表，助推年度千万级集采过会。',
          greetingScript: '“老师，同业头部行生产环境跑同款架构已稳定超 1000 天，单笔推理算力成本降了 45%，我把他们过技委会的招标技术评分模板整理出来供咱们直接参考！”',
        },
        {
          id: 'conf-comp1',
          name: '传统重型云底座/外资遗留厂商',
          roleTitle: '潜在竞争对手 · 凭借存量商业维保合同试图续标',
          unitLabel: '竞争对手 · 存量绑定风险',
          category: 'competitor',
          tierLabel: '外部竞品威胁 A',
          budgetAuthority: '试图锁定年度数百万维保扩容与二期集采',
          decisionWeight: '公关运维团队强调替换风险 (威胁度 高)',
          x: 825,
          y: 145,
          summary: '利用一期遗留系统的商业绑定，向运维与架构团队渲染切换风险，试图延续高昂的按核授权费与捆绑底座扩容。',
          competitorExposure: '弱点：底座极其臃肿（最少需32节点起步），不支持异构国产算力混部，且年度维保费逐年递增。',
          actionStrategy: '植入“轻量化容器无侵入旁路挂载 + 异构国产GPU/NPU混部算力利用率>78% + 双轨流量镜像零停机回滚”刚性指标反制。',
          greetingScript: '“老师，传统重型底座一扩容就要绑几十台服务器授权；我们支持旁路容器无侵入挂载，原有生产流量零改动就能双轨比对，随时一键毫秒级切回！”',
        },
        {
          id: 'conf-comp2',
          name: '纯开源拼凑集成商 (人力外包商)',
          roleTitle: '潜在竞争对手 · 低人天报价争抢部门敏捷开发预算',
          unitLabel: '竞争对手 · 低价人天分流',
          category: 'competitor',
          tierLabel: '外部竞品威胁 B',
          budgetAuthority: '试图用廉价驻场人天瓜分10-20万敏捷创新费',
          decisionWeight: '向研发团队承诺定制修改开源代码',
          x: 825,
          y: 300,
          summary: '用低廉的初级驻场程序员人天报价，承诺基于开源组件手搓定制，试图分流二级部门的敏捷创新预算。',
          competitorExposure: '弱点：缺乏底层内核并发调度能力，高并发下频繁内存泄漏，且开源许可证污染与安全漏洞无法通过信安扫描。',
          actionStrategy: '用“金融级零漏洞安全加固内核 + P99延迟<80ms压测对赌 + 开箱即用审计溯源”彻底击穿廉价人力外包。',
          greetingScript: '“架构师，纯开源拼凑方案过不了下个月信安的红蓝对抗漏洞扫描，而且高并发下长尾延迟飙到3秒以上；咱们直接用经过金融生产验证的企业级内核，一步到位免踩坑！”',
        },
      ],
      edges: [
        {
          id: 'ce-1',
          source: 'conf-l1',
          target: 'conf-l2',
          edgeType: 'hierarchy',
          label: '总经理掌舵 / 授权二级中心主任',
          detail: `${shortName}把控全局科技规划，具体领域架构演进与 15 万内敏捷创新 POC 预算授权给 ${subPiLabel}。`,
        },
        {
          id: 'ce-2',
          source: 'conf-l1',
          target: 'conf-l3',
          edgeType: 'hierarchy',
          label: '委托架构办与信安合规把关',
          detail: `年度科技集采《技术规范书》与信创/等保合规审查由架构办汇总后呈报 ${shortName} 签批。`,
        },
        {
          id: 'ce-3',
          source: 'conf-l4',
          target: 'conf-l2',
          edgeType: 'decision_chain',
          label: '破局第1跳：沙箱压测促签14.5万',
          detail: `先帮 POC 测试架构师（${execLabel}）跑出 QPS 翻倍压测报告，向 ${subPiLabel} 汇报后当月即可走敏捷创新预算直签 14.5 万试点。`,
        },
        {
          id: 'ce-4',
          source: 'conf-l2',
          target: 'conf-l3',
          edgeType: 'decision_chain',
          label: '破局第2跳：试点成效写入年度集采',
          detail: `生产试点跑通高可用与降本 ROI 后，由 ${subPiLabel} 联合架构办写入《年度科技集采招标技术规范书》。`,
        },
        {
          id: 'ce-5',
          source: 'conf-l3',
          target: 'conf-l1',
          edgeType: 'decision_chain',
          label: '破局第3跳：压测周报+架构会终审',
          detail: `硬核生产试点报告 + 架构办完备信创合规材料呈交，${shortName}在技术委员会上顺水推舟拍板集采入围。`,
        },
        {
          id: 'ce-6',
          source: 'conf-ext1',
          target: 'conf-l2',
          edgeType: 'external_collab',
          label: '金融信创互认证 / 标准背书',
          detail: '金融信创生态实验室与信通院的评测背书对二级部门主任选型极具说服力。',
        },
        {
          id: 'ce-7',
          source: 'conf-ext2',
          target: 'conf-l3',
          edgeType: 'external_collab',
          label: '同业大行标杆 / 集采评分对标',
          detail: '同业头部行超 1000 天零故障与算力降本 45% 的数据可直接作为架构办立项对标依据。',
        },
        {
          id: 'ce-8',
          source: 'conf-comp1',
          target: 'conf-l3',
          edgeType: 'competitor_risk',
          label: '竞品渗透：渲染替换风险锁维保',
          detail: '需用“旁路无侵入双轨灰度+异构信创算力混部+毫秒级回滚SOP”瓦解存量大厂绑定。',
        },
        {
          id: 'ce-9',
          source: 'conf-comp2',
          target: 'conf-l4',
          edgeType: 'competitor_risk',
          label: '竞品分流：低价人力手搓开源',
          detail: '用“开箱即用企业级安全内核+P99<80ms极限压测对赌”降维打击人力外包。',
        },
      ],
    };
  }

  if (sector === 'chem_materials') {
    return {
      id: `confirmed-${customer.id}`,
      unitName: `【当前客户·化工新材料/能源央企】${customer.institution} · ${customer.department}（${shortName}体系）`,
      badge: '中试放大与决策链拓扑',
      overviewAbstract: `【${shortName} · ${customer.department}】组织与决策架构：内部呈“中央研究院院长/总工(${shortName}, L1) ➔ 专业研究所所长与中试基地主任(${subPiLabel}, L2) ➔ 科技管理部与HSE安环把关(L3) ➔ 模试与中试课题组长(${execLabel}, L4)”四级结构；外部关联科研院所与进口中试装备竞争防线。`,
      recommendedChainSummary: `最优推进决策链：模试课题组长(${execLabel})免费盲测3组高粘/催化体系 ➔ 所长/中试主任(${subPiLabel})动用≤10万横向测试费直签工艺包验证 ➔ 科管部与安环部汇总ATEX防爆与单吨能耗立项书 ➔ ${shortName}在万吨级工业化评审会拍板`,
      nodes: [
        {
          id: 'conf-l1',
          name: shortName,
          roleTitle: `${customer.title} / 集团技术委员会主任`,
          unitLabel: '内部 L1 · 终极拍板人',
          category: 'internal_leader',
          tierLabel: 'L1 中试与工业化装置终审层（当前锁定客户）',
          budgetAuthority: '集团重大科技专项与千吨/万吨级技改 500-5000万终审权',
          decisionWeight: '工业化工艺包定型与技改立项终审 100%',
          x: 470,
          y: 75,
          summary: `统领【${customer.department}】在「${customer.researchKeywords}」方向的国产化破局与万吨级产业化转化，唯以中试连续运行收率与单吨综合能耗下降数据作为拍板依据。`,
          competitorExposure: '欧美特种反应与在线分析仪表巨头高层偶有拜访，但存在涉密工艺参数外流顾虑及漫长交期。',
          actionStrategy: `切忌直接推销单台仪表！先配合专业所所长（${subPiLabel}）与模试组长（${execLabel}）跑通高难反应物系在线红外/拉曼原位动力学监测与中试放大收率提升 4.2% 的实测报告。`,
          greetingScript: `“${shortName}院长您好，我们正配合研究院 ${subPiLabel} 所长团队做「${customer.researchKeywords}」中试连续流反应原位动力学监测与副产物抑制验证，相关防爆合规与万吨级放大核算材料已交科技管理部审阅。”`,
        },
        {
          id: 'conf-l2',
          name: subPiLabel,
          roleTitle: '专业研究所所长 & 中试主任（实权二当家）',
          unitLabel: '内部 L2 · 实权二当家',
          category: 'internal_subpi',
          tierLabel: 'L2 核心实权突破口（业务与中试二当家）',
          budgetAuthority: '所级研发委外表征/中试技改验证 ≤10万元直签权',
          decisionWeight: '工艺路线与中试设备选型发起权 95%',
          x: 370,
          y: 210,
          summary: `真正在【${customer.department}】一线分管「${customer.researchKeywords}」从实验室百克模试到百吨级中试放大的实权二当家，手握所级研发测试与小型技改直签权。`,
          competitorExposure: '高校分析中心排队慢且不接高压/强腐蚀样品，常规仪表商不懂高聚物结焦与催化剂失活机理。',
          actionStrategy: `【首选破局点】携同反应体系对标单页约见 ${subPiLabel}，提供 3 组特征催化剂/聚合母液免费原位表征对赌，走所级研发费直签 9.2 万元中试原位监测验证包。`,
          greetingScript: `“所长您好！了解到咱们团队在「${customer.researchKeywords}」方向的中试放大传质与副反应控制由您直接把关，我们先免费帮咱们原位表征 3 组高难体系，走所里 9.2 万研发测试费即可直签！”`,
        },
        {
          id: 'conf-l3',
          name: `${customer.department}科技管理部 & HSE安环工程部`,
          roleTitle: '院级装备立项执笔 / 防爆安全(HAZOP)与腐蚀材质把关',
          unitLabel: '内部 L3 · 执笔与安环把关',
          category: 'internal_gatekeeper',
          tierLabel: 'L3 技改报计划执笔与HSE防爆一票否决',
          budgetAuthority: '《年度中试基地与科研装备可行性报告》起草与HAZOP审查',
          decisionWeight: '安环防爆合规一票否决权 100% · 立项材料执笔权 95%',
          x: 590,
          y: 210,
          summary: `负责起草研究院年度重大装备采购计划，并由 HSE 安环工程师严格审查涉氢/高压/有机溶剂场景下的 Ex d IIC T6 本安防爆认证、哈氏合金耐腐材质证明与 HAZOP 风险评估。`,
          competitorExposure: '进口存量仪表商试图用排他性的欧美标准配件编号锁死下一批中试扩建标书。',
          actionStrategy: '主动递交全套《Ex d IIC T6 国家级防爆合格证与哈氏合金C276材质证明》、《HAZOP本质安全联锁免责SOP》及《多课题组共用年均2400小时立项初稿》。',
          greetingScript: `“科管/安环老师您好，为了配合中试基地年度装备立项，我们把「${customer.researchKeywords}」工况所需的 IIC 级防爆证书、哈氏合金耐强酸强碱检测报告和 HAZOP 安全联锁预案全帮您准备齐全了！”`,
        },
        {
          id: 'conf-l4',
          name: execLabel,
          roleTitle: '模试与中试课题组长（高级工程师 / 一线实操负责人）',
          unitLabel: '内部 L4 · 一线合成与中试执行层',
          category: 'internal_exec',
          tierLabel: 'L4 每日中试倒班数据与机理报告执笔人',
          budgetAuthority: '原位表征耗材与委外评价测试第一建议权 90%',
          decisionWeight: '小试/中试批次实验与月度技术例会PPT第一执笔人',
          x: 470,
          y: 355,
          summary: `每天在合成实验室与中试车间盯反应釜温度压力曲线、取样做离线色谱分析，最怕离线取样滞后导致整釜聚合物交联报废或高压取样存在安全隐患。`,
          competitorExposure: '正被传统离线色谱/滴定仪器商推销，但离线取样存在 30 分钟滞后且高粘度物料极易堵管。',
          actionStrategy: '提供“浸入式蓝宝石耐高压原位探头免费试用 + 高粘防结焦自清洁工装 + 反应动力学拟合模板”，帮其彻底告别危险高频人工取样。',
          greetingScript: `“工/博士您好！看到您参与发明的「${customer.researchKeywords}」专利，针对高压釜离线取样滞后和堵管痛点，我们免费借用一套哈氏合金原位探头帮您跑两釜连续监测，连转化率动力学曲线都帮您直接生成好！”`,
        },
        {
          id: 'conf-ext1',
          name: '中科院大连化物所 / 化学所 / 华东理工联合实验室',
          roleTitle: '外部科研院所 · 国家重点研发计划联合申报伙伴',
          unitLabel: '外部院所 · 催化与化工方法学标杆',
          category: 'external_institute',
          tierLabel: '外部强关联国家级化工院所',
          budgetAuthority: '国家重点专项联合攻关与原位表征方法学示范方',
          decisionWeight: '对中央研究院青年所长技术路线影响权重 85%',
          x: 115,
          y: 145,
          summary: `与【${customer.institution}·${customer.department}】长期联合承担国家重点研发计划“高端聚烯烃/绿色催化”专项，已全面普及高压原位光谱与高通量微反应筛选平台。`,
          competitorExposure: '高度推崇原位实时反应机理捕捉技术，是我方核心方法学合作标杆。',
          actionStrategy: `向 ${subPiLabel} 展示中科院合作团队同款“高温高压原位反应动力学监测 + 毫秒级活性中间体捕捉”实测范本，快速建立技术信任。`,
          greetingScript: `“所长，目前中科院化物所联申团队做同类高端聚烯烃催化机理都在用这套高压原位光谱配微反应评价系统，我们用完全同源的参数帮咱们所做中试放大标定！”`,
        },
        {
          id: 'conf-ext2',
          name: '同行业龙头化工基地千吨级示范线',
          roleTitle: '外部标杆客户 · 同类强腐蚀/高温高压工况连续运行2年',
          unitLabel: '外部标杆 · 技改立项对标',
          category: 'external_institute',
          tierLabel: '外部同业工业化样板',
          budgetAuthority: '同类型中试与万吨级产线批量装机示范方',
          decisionWeight: '科管部与HSE安环立项审查参考权重 85%',
          x: 115,
          y: 300,
          summary: '已在同类尼龙/特种聚氨酯/POE弹性体千吨级中试线连续无故障运行超 16000 小时，批次合格率提升至 99.6%。',
          competitorExposure: '我方核心化工样板工程，支持脱敏工况参数与安环验收档案直接对标。',
          actionStrategy: '在《技改可行性论证报告》中直接引用同业示范线收率提升 4.2%、年减少废料损失 380 万的实测数据，助推院级立项一次过会。',
          greetingScript: '“老师，同行业千吨级中试线在 250℃、8MPa 工况下用咱们这套哈氏合金原位系统已连续运行 16000 小时零泄漏，全套 HAZOP 验收模板我已经整理好供咱们直接引用！”',
        },
        {
          id: 'conf-comp1',
          name: '欧美传统过程分析/特种釜巨头',
          roleTitle: '潜在竞争对手 · 凭借早年进口装机试图排他锁标',
          unitLabel: '竞争对手 · 进口存量锁标风险',
          category: 'competitor',
          tierLabel: '外部竞品威胁 A',
          budgetAuthority: '试图锁定新一批中试基地扩建数百万预算',
          decisionWeight: '游说设备工程人员沿用原厂排他接口 (威胁度 高)',
          x: 825,
          y: 145,
          summary: '凭借一期实验室早年采购的进口设备，游说工程人员在新一轮中试基地招标中沿用原厂特殊法兰尺寸与专有软件协议。',
          competitorExposure: '弱点：特种耐腐探头耗材动辄数十万且交期长达 8 个月，且原厂拒绝开放底层光谱数据接口供客户训练私有软测量模型。',
          actionStrategy: '植入“哈氏合金/蓝宝石全兼容标准法兰 + 底层Modbus/OPC-UA全开放供DCS闭环控制 + 耗材本土72小时交付”刚性指标反制。',
          greetingScript: '“所长，进口探头一旦被高粘聚合物磨损返修就是大半年，整条中试线都得停工等备件；我们提供本土哈氏合金探头 72 小时闪换，而且底层数据完全向咱们院 DCS 系统开放！”',
        },
        {
          id: 'conf-comp2',
          name: '常规高校代测/普通实验室玻璃仪器商',
          roleTitle: '潜在竞争对手 · 低价分流小试表征与常规合成预算',
          unitLabel: '竞争对手 · 低端设备分流',
          category: 'competitor',
          tierLabel: '外部竞品威胁 B',
          budgetAuthority: '试图用常规离线色谱/常压玻璃釜分流10万内预算',
          decisionWeight: '高频向合成博后推销廉价常压设备',
          x: 825,
          y: 300,
          summary: '向课题组长推销廉价常压离线表征或普通实验室设备，试图瓜分所级 10 万以内的研发测试预算。',
          competitorExposure: '弱点：脱离真实中试高温高压传质工况，拿到的常压离线数据在中试放大时完全失真，极易导致放大效应失败。',
          actionStrategy: '用“真实中试高温高压工况原位实时动力学监测 + 3组高粘/高压样品免费盲测对赌”彻底封堵低端分流。',
          greetingScript: '“博士，常压离线测出来的转化率一上百升中试釜全变样了；咱们直接在真实高温高压工况下做原位在线追踪，拿到的动力学参数才能直接指导万吨级工业化放大！”',
        },
      ],
      edges: [
        {
          id: 'ce-1',
          source: 'conf-l1',
          target: 'conf-l2',
          edgeType: 'hierarchy',
          label: '总工/院长掌舵 / 授权专业所长',
          detail: `${shortName}把控万吨级产业化战略，日常中试放大攻关与 10 万内所级研发测试预算授权给专利第2发明人 ${subPiLabel}。`,
        },
        {
          id: 'ce-2',
          source: 'conf-l1',
          target: 'conf-l3',
          edgeType: 'hierarchy',
          label: '委托科管部与HSE安环把关',
          detail: `研究院每年的《重大科研与中试装备可行性报告》及 HAZOP 防爆审查由科管部与安环部汇总后呈报 ${shortName} 签字。`,
        },
        {
          id: 'ce-3',
          source: 'conf-l4',
          target: 'conf-l2',
          edgeType: 'decision_chain',
          label: '破局第1跳：原位盲测促签9.2万',
          detail: `先帮模试/中试组长（${execLabel}）免费原位表征 3 组高难反应体系，向 ${subPiLabel} 汇报后当周即可走所级研发费直签 9.2 万。`,
        },
        {
          id: 'ce-4',
          source: 'conf-l2',
          target: 'conf-l3',
          edgeType: 'decision_chain',
          label: '破局第2跳：收率提升写入中试立项',
          detail: `中试验证跑出收率提升 4.2% 与防结焦实测数据后，由 ${subPiLabel} 联合科管部写入《中试基地扩建可行性论证报告》。`,
        },
        {
          id: 'ce-5',
          source: 'conf-l3',
          target: 'conf-l1',
          edgeType: 'decision_chain',
          label: '破局第3跳：中试月报+HAZOP立项终审',
          detail: `中试连续运行月报 + 完备 IIC 防爆与单吨能耗核算报告呈交，${shortName}在院务会上顺水推舟拍板。`,
        },
        {
          id: 'ce-6',
          source: 'conf-ext1',
          target: 'conf-l2',
          edgeType: 'external_collab',
          label: '中科院联申 / 原位催化方法示范',
          detail: '中科院合作院所的高压原位表征方法学对专业所所长具有极强示范效应。',
        },
        {
          id: 'ce-7',
          source: 'conf-ext2',
          target: 'conf-l3',
          edgeType: 'external_collab',
          label: '千吨中试标杆 / HAZOP防爆对标',
          detail: '同行业千吨级中试线 16000 小时无故障与防爆验收档案可直接作为科管部/安环部立项依据。',
        },
        {
          id: 'ce-8',
          source: 'conf-comp1',
          target: 'conf-l3',
          edgeType: 'competitor_risk',
          label: '竞品渗透：游说沿用进口排他法兰',
          detail: '需用“哈氏合金标准接口+DCS底层OPC-UA全开放+本土72h备件闪换”反制进口存量厂商。',
        },
        {
          id: 'ce-9',
          source: 'conf-comp2',
          target: 'conf-l4',
          edgeType: 'competitor_risk',
          label: '竞品分流：常压离线低价代测',
          detail: '用“真实高温高压原位动力学监测+防放大失真”硬核刚需降维反制常压离线方案。',
        },
      ],
    };
  }

  const isYouPengtao =
    shortName.includes('尤鹏涛') ||
    shortName.includes('尤朋涛') ||
    shortName.includes('叶晓川') ||
    customer.institution.includes('湖北中医药') ||
    customer.institution.includes('武汉中医药');

  if (isYouPengtao) {
    return {
      id: `confirmed-${customer.id}`,
      unitName: `【当前客户·省重点实验室×700万校企横向】湖北中医药大学药学院 × 武汉安捷医药(700万横向) × 湖北中科盐谷`,
      badge: '当前锁定：尤朋涛（同音：尤鹏涛 · 副研究员/硕导/科技副总 · 700万横向负责人）',
      overviewAbstract: `【湖北中医药大学（武汉黄家湖）药学院 & 中药资源与中药化学湖北省重点实验室真实架构】L1省重点实验室常务副主任/团队大主任：叶晓川教授（博导，多篇SCI最后通讯作者，把关省重点实验室大型仪器平台修购） ➔ L2核心转化PI（当前锁定客户）：尤朋涛副研究员（同音：尤鹏涛，Pengtao You，硕导、医药企业科技副总，代表学校与「武汉安捷医药科技有限责任公司」签约700万元《经典名方半夏厚朴汤颗粒开发研究》重大横向项目，并主持「湖北中科盐谷」竹盐抗炎抗氧化横向课题） & 同组核心教授：刘丹(Dan Liu)、魏琼(Qiong Wei) ➔ L3重点实验室大型仪器平台主管：吴和珍/刘军锋 ➔ L4一线硕博生一作群：李慧君(CJNM一作)、王天合、陈伟亮(NPR 2025一作)、张丹丹、朱海(医药导报 2026一作)。`,
      recommendedChainSummary: `针对【湖北中医药大学·尤朋涛/叶晓川团队】双轨攻单链：① 700万横向快签线（免繁琐政采招标）：直接找L2【尤朋涛副研究员】，围绕《经典名方半夏厚朴汤颗粒开发（700万横向）》及2026《医药导报》温阳氨肽膏调节巨噬细胞免疫活性课题，先由应用工程师帮一线硕博生【李慧君/陈伟亮/朱海(L4)】免费试跑2例巨噬细胞M1/M2极化多色流式与1μL细胞因子谱，直接由尤朋涛签批横向测试或耗材合同！② 省重点实验室大设备修购线：由尤朋涛、刘丹教授联名向L1【叶晓川常务副主任】提报中药资源与中药化学湖北省重点实验室年度修购专项！`,
      nodes: [
        {
          id: 'conf-l1',
          name: '叶晓川（L1省重点实验室大主任）',
          roleTitle: '中药资源与中药化学湖北省重点实验室 常务副主任 / 药学院教授 / 博士生导师',
          unitLabel: '内部 L1 · 省重点实验室一把手',
          category: 'internal_leader',
          tierLabel: 'L1 省重点实验室常务副主任 & 团队大主任（NPR 2025 / CJNM 2023最后通讯）',
          budgetAuthority: '湖北省重点实验室平台专项 + 国家重点研发计划子课题 + 学校双一流学科设备修购终审',
          decisionWeight: '省重点实验室大型仪器修购立项终审权 95%',
          x: 470,
          y: 75,
          summary:
            '中药资源与中药化学湖北省重点实验室常务副主任、博士生导师，是尤朋涛、刘丹、魏琼团队的顶层学术带头人（在2025《Natural Product Research》代料栽培茯苓质量评价、2023《Chinese Journal of Natural Medicines》茯苓水提物治疗脾虚湿困证等SCI论文中任最后通讯作者）。掌管省重点实验室大型分析与细胞生物学仪器修购规划。',
          competitorExposure: '常规色谱/质谱厂商经常拜访，但在中药复方调控肠道免疫微环境、巨噬细胞极化多色流式及组织空间原位共染方面缺乏深度应用支持。',
          actionStrategy:
            '先配合尤朋涛副研究员用700万横向课题跑通经典名方与茯苓免疫调控标杆数据，再由尤朋涛、刘丹联名向叶晓川主任汇报，纳入湖北省重点实验室年度大型设备修购计划。',
          greetingScript:
            '“叶主任您好！一直拜读您和尤朋涛老师在《Chinese Journal of Natural Medicines》和《Natural Product Research》上发表的茯苓药效物质与脾虚水湿机制研究！目前我们正配合尤老师推进半夏厚朴汤与茯苓免疫活性多色流式及空间共染验证，特来向您汇报省重点实验室平台升级方案。”',
        },
        {
          id: 'conf-l2',
          name: '尤朋涛 ★当前客户 (700万横向PI) & 刘丹 / 魏琼',
          roleTitle: '尤朋涛(副研究员/硕导/科技副总·700万安捷医药横向负责人) · 刘丹(教授) · 魏琼',
          unitLabel: '内部 L2 · 700万横向直签核心PI',
          category: 'internal_subpi',
          tierLabel: 'L2 核心转化PI（手握700万安捷医药横向经费与企业科技副总直签权）',
          budgetAuthority: '武汉安捷医药700万元横向经费 + 湖北中科盐谷横向经费（免政采招标直接签批）',
          decisionWeight: '横向课题测试/耗材/中型设备直接拍板权 100%',
          x: 370,
          y: 210,
          summary:
            '尤朋涛（常写作“尤鹏涛”，Pengtao You），湖北中医药大学药学院副研究员、硕导、医药企业“科技副总”。代表学校与武汉安捷医药科技有限责任公司签约700万元《经典名方半夏厚朴汤颗粒开发研究》重大横向课题，与湖北中科盐谷合作竹盐抗炎抗氧化项目，并以通讯作者发表2026《医药导报》温阳氨肽膏调节巨噬细胞免疫活性论文、共同署名2025《Theranostics》肝癌氧化应激PET分子影像论文。',
          competitorExposure: '700万经典名方开发与巨噬细胞免疫机制研究任务重，急需能同时搞定中药复杂体系表征与高维细胞免疫评价的实战团队。',
          actionStrategy:
            '【头号攻单突破口】直接约见尤朋涛副研究员，紧扣其700万半夏厚朴汤颗粒开发与2026巨噬细胞免疫活性研究，提供“巨噬细胞M1/M2极化多色流式 + 1μL微量细胞因子联检”免费盲测2例，直接走700万横向经费或合作药企合同快速签单！',
          greetingScript:
            '“尤老师您好！拜读了您最新在《医药导报》作为通讯作者发表的《温阳氨肽膏调节巨噬细胞免疫活性》以及《Theranostics》肝癌氧化应激研究，也祝贺咱们团队与武汉安捷医药签约700万半夏厚朴汤经典名方重大横向项目！针对经典名方调节巨噬细胞极化与1微升炎症因子谱，我们备好了免费试测方案，可直接走横向经费快速落地！”',
        },
        {
          id: 'conf-l3',
          name: '吴和珍 / 刘军锋（省重点实验室平台把关）',
          roleTitle: '中药资源与中药化学湖北省重点实验室 共享仪器平台主管与资深教授',
          unitLabel: '内部 L3 · 实验室仪器论证把关',
          category: 'internal_gatekeeper',
          tierLabel: 'L3 省重点实验室修购论证与共享机时把关人',
          budgetAuthority: '《省重点实验室大型仪器可行性论证报告》审核与三家比价汇总',
          decisionWeight: '大型设备技术参数起草与机时考核把关权 90%',
          x: 590,
          y: 210,
          summary:
            '负责中药资源与中药化学湖北省重点实验室共享分析测试平台与细胞分子生物学平台管理，审核年度新购仪器开机率与多课题组共用效益。',
          competitorExposure: '重视仪器防堵管/防污染稳定性及中药粗提物复杂基质兼容性。',
          actionStrategy:
            '递交《中药复杂体系与细胞免疫平台年开机1800小时可行性论证底稿》及《防中药色素自发荧光干扰光谱解混SOP》。',
          greetingScript:
            '“老师您好，针对咱们省重点实验室中药提取物刺激细胞容易产生强自发荧光的痛点，我们整理了全光谱自动扣除中药本底荧光的质控SOP和年度修购论证底稿，发您审阅！”',
        },
        {
          id: 'conf-l4',
          name: '李慧君 / 王天合 / 陈伟亮 / 朱海（一作硕博群）',
          roleTitle: '药学院 & 省重点实验室 一线硕博实验骨干（SCI及核心期刊第一作者）',
          unitLabel: '内部 L4 · 一线实验与组会汇报主力',
          category: 'internal_exec',
          tierLabel: 'L4 每日大鼠给药、巨噬细胞培养与UPLC/流式上机实操人',
          budgetAuthority: '课题组日常试剂耗材、Elisa/流式抗体及测试外包第一建议权',
          decisionWeight: '每周组会实验进展PPT第一汇报人',
          x: 470,
          y: 355,
          summary:
            '李慧君(2023 CJNM第一作者)、陈伟亮与张丹丹(2025 Natural Product Research共同一作)、朱海与黄雅宁(2026《医药导报》尤朋涛通讯论文一作)等一线硕博生，每天在黄家湖校区实验室制备半夏厚朴汤/茯苓提取物、养RAW264.7巨噬细胞及处理大鼠脾虚/肝损伤样本。',
          competitorExposure: '做中药复方刺激巨噬细胞流式时常遇到中药天然色素自发荧光干扰，且大鼠微量血清做传统ELISA不够分。',
          actionStrategy:
            '由技术支持去黄家湖校区药学院实验室驻场，免费帮跑2例中药干预巨噬细胞M1/M2光谱流式（自动扣除中药色素背景荧光）并出高清Figure供组会向尤朋涛和叶晓川老师汇报。',
          greetingScript:
            '“师兄/师姐您好！看到你们在 CJNM 和《医药导报》发的茯苓和温阳氨肽膏巨噬细胞文章特别棒！中药提取物做流式最怕天然色素自发荧光干扰，这周我们工程师免费帮你们跑2例自动扣背景的多色巨噬细胞极化流式，连组会PPT大图都帮你们配好！”',
        },
        {
          id: 'conf-ext1',
          name: '武汉安捷医药科技有限责任公司（700万横向金主）',
          roleTitle: '《经典名方半夏厚朴汤颗粒开发研究》700万元横向项目委托甲方',
          unitLabel: '院外直签金主① · 700万经典名方合作药企',
          category: 'external_institute',
          tierLabel: '头号横向资金来源（700万元合同在账 · 免高校政采繁琐招标）',
          budgetAuthority: '700万元《经典名方半夏厚朴汤颗粒开发研究》专项研发经费',
          decisionWeight: '横向课题外包测试、对照品耗材与药效毒理采购 100%',
          x: 115,
          y: 145,
          summary:
            '与湖北中医药大学（尤朋涛作为核心签约代表）正式签署《经典名方半夏厚朴汤颗粒开发研究》校企横向合作项目，合同总金额高达700万元，全力推进国家3.1类古代经典名方新药开发与报批。',
          competitorExposure: '经典名方注册申报对物质基准重现性、药代动力学及抗炎免疫药效数据的合规性要求极高。',
          actionStrategy:
            '围绕半夏厚朴汤颗粒的物质基准、药效免疫细胞因子谱与组织病理评价，直接由尤朋涛副研究员走700万横向课题账户或安捷医药企业账户直签合同！',
          greetingScript:
            '“尤老师，咱们针对700万半夏厚朴汤颗粒开发项目的免疫抗炎药效评价和微量血浆多因子检测，既可以走学校横向课题测试费，也可以直接跟武汉安捷医药签企业合同快速推进！”',
        },
        {
          id: 'conf-ext2',
          name: '湖北中科盐谷科技 & 武汉协和医院核医学科',
          roleTitle: '竹盐抗炎抗氧化横向合作企业 & Theranostics肝癌分子影像临床合作方',
          unitLabel: '院外协同② · 产学研药企 & 三甲临床合作方',
          category: 'external_institute',
          tierLabel: '产学研横向金主 & 顶刊临床协作医院',
          budgetAuthority: '中科盐谷横向研发经费 & 跨院联合课题测试费',
          decisionWeight: '抗氧化/抗炎机制验证与小动物分子影像联合实验 85%',
          x: 115,
          y: 300,
          summary:
            '尤朋涛团队一方面与【湖北中科盐谷科技有限公司】合作《竹盐抗炎、抗氧化及治疗便秘作用机制研究》，另一方面与华中科技大学同济医学院附属协和医院朱小华教授团队合作在顶刊《Theranostics》(2025)发表DEN诱导大鼠肝癌氧化应激PET/CT成像研究。',
          competitorExposure: '跨院与校企合作实验急需标准化的肝脏/肠道组织6-8色氧化应激与免疫微环境原位共染。',
          actionStrategy:
            '提供肝脏/结肠石蜡切片6色氧化应激(xCT/ROS)与巨噬细胞共定位染色方案，同时服务中科盐谷横向课题与高分SCI顶刊发表。',
          greetingScript:
            '“尤老师，结合咱们跟协和合作的《Theranostics》氧化应激研究以及中科盐谷的抗炎抗氧化横向项目，我们能在一张大鼠肝脏或肠道切片上同时共染氧化应激标志物与M1/M2巨噬细胞！”',
        },
        {
          id: 'conf-comp1',
          name: '常规单色IHC / 普通ELISA试剂商',
          roleTitle: '潜在竞争对手 · 推销传统低通量单指标试剂盒',
          unitLabel: '竞争对手 · 传统低维方法商',
          category: 'competitor',
          tierLabel: '外部竞品威胁 A',
          budgetAuthority: '试图分流课题组常规耗材预算',
          decisionWeight: '价格低但无法支撑经典名方多靶点机制顶刊发表 (威胁度 中)',
          x: 825,
          y: 220,
          summary: '向实验室推销传统单指标ELISA试剂盒与常规单色免疫组化代测。',
          competitorExposure: '弱点：中药复方讲究“多成分、多靶点、整体免疫调节”，单指标ELISA耗费大鼠血清极多且无法揭示组织微环境原位细胞互作。',
          actionStrategy: '用“1μL超微量多因子联检 + 自动扣除中药天然色素背景荧光的全光谱流式 + 6色空间病理共染”降维打击传统单指标方案！',
          greetingScript: '“尤老师，中药复方机制发高分SCI最怕审稿人挑战‘多靶点证据不足’，我们用1微升血清同测几十种细胞因子配6色空间共染，一次实验就把经典名方多靶点网络图完整呈现出来！”',
        },
      ],
      edges: [
        {
          id: 'ce-you-1',
          source: 'conf-l1',
          target: 'conf-l2',
          edgeType: 'hierarchy',
          label: '省重点实验室搭班子：叶晓川任大主任 / 尤朋涛领衔700万横向转化',
          detail: '叶晓川教授任中药资源与中药化学湖北省重点实验室常务副主任（多篇SCI最后通讯），尤朋涛副研究员负责700万安捷医药经典名方横向转化与巨噬细胞免疫方向。',
        },
        {
          id: 'ce-you-2',
          source: 'conf-l1',
          target: 'conf-l3',
          edgeType: 'hierarchy',
          label: '统筹湖北省重点实验室大型仪器修购计划',
          detail: '省重点实验室年度大型分析与细胞平台设备修购由平台主管汇总后报叶晓川常务副主任审批。',
        },
        {
          id: 'ce-you-3',
          source: 'conf-l4',
          target: 'conf-l2',
          edgeType: 'decision_chain',
          label: '破局第1跳：免费帮跑巨噬细胞流式促成700万横向直签',
          detail: '先帮一线硕博一作（李慧君/陈伟亮/朱海）免费试跑2例扣除中药色素背景的巨噬细胞M1/M2极化流式，组会汇报后由尤朋涛副研究员直接用700万横向经费签单。',
        },
        {
          id: 'ce-you-4',
          source: 'conf-l2',
          target: 'conf-l3',
          edgeType: 'decision_chain',
          label: '破局第2跳：尤朋涛+刘丹联名发起省重点实验室设备论证',
          detail: '尤朋涛与刘丹教授结合经典名方与茯苓重点研发课题需求，向实验室平台提交年度新设备购置论证。',
        },
        {
          id: 'ce-you-5',
          source: 'conf-l3',
          target: 'conf-l1',
          edgeType: 'decision_chain',
          label: '破局第3跳：叶晓川常务副主任拍板省重点实验室修购',
          detail: '纳入中药资源与中药化学湖北省重点实验室年度平台建设专项，由叶晓川主任终审拍板。',
        },
        {
          id: 'ce-you-6',
          source: 'conf-ext1',
          target: 'conf-l2',
          edgeType: 'external_collab',
          label: '签约700万元《经典名方半夏厚朴汤颗粒开发》重大横向合同',
          detail: '武汉安捷医药科技有限责任公司与湖北中医药大学（尤朋涛签约代表）签署700万横向项目，经费支取灵活免政采招标。',
        },
        {
          id: 'ce-you-7',
          source: 'conf-ext2',
          target: 'conf-l2',
          edgeType: 'external_collab',
          label: '中科盐谷竹盐横向合作 & 武汉协和Theranostics顶刊合作',
          detail: '尤朋涛主持湖北中科盐谷抗炎抗氧化横向项目，并联合武汉协和医院发表2025 Theranostics肝癌氧化应激PET成像顶刊。',
        },
      ],
    };
  }

  const isYinZhinan =
    shortName.includes('尹芝南') ||
    shortName.includes('尹志南') ||
    shortName.includes('向征') ||
    shortName.includes('吴扬哲') ||
    shortName.includes('杨恒文') ||
    shortName.includes('高云飞') ||
    shortName.includes('罗钧洪') ||
    ((customer.institution.includes('暨德康民') || customer.institution.includes('暨安特博')) && !shortName);

  if (isYinZhinan) {
    return {
      id: `confirmed-${customer.id}`,
      unitName: `【当前客户·院企双栖实控体系】${customer.institution}生物医学转化研究院 × 广东暨德康民(B轮) × 广东暨安特博(真格VC)`,
      badge: '当前锁定：尹芝南（转化院院长 · 暨德康民/暨安特博创始人 · 国家杰青30725015）',
      overviewAbstract: `【暨南大学转化研究院 + 名下3家生物医药企业真实架构】L1最高实控人：尹芝南（生物医学转化研究院院长、国家杰青30725015、973首席科学家、珠海市人民医院学术总监；院外任「广东暨德康民」创始人/首席科学家[持股~33%，2025.12获广州健康产投基金B轮数千万增资+广州银行授信，GDKM-100获NMPA IND进入晚期肝癌I期临床]、「广东暨安特博」科学创始人[Nature IL-27转化，获真格基金/香商投资数千万VC]、「浙江普锐生物」首席科学家） ➔ L2院企实权执行层：向征博士（转化院PI兼广东暨德康民执行总经理/CTO，掌管企业B轮采购直签）、吴扬哲（分管副院长）、杨恒文/高云飞/罗钧洪（海外优青，各自独立主持国自然课题） ➔ L3公共流式平台主管 & 暨德康民CMC/QC主管 ➔ L4一线专职博后：鲁呦呦/裴建/陈娜。`,
      recommendedChainSummary: `针对【尹芝南院企双栖帝国】攻单链：避开单纯高校漫长招标！商务快线直接由售前/销售对接L2【向征博士（转化院PI兼广东暨德康民执行总经理/CTO）】，围绕GDKM-100异体γδ-T细胞I期临床伴随免疫监控与CMC放行质控，直接走「广东暨德康民」B轮商业资金免招标直签；院内学术线配合【吴扬哲副院长/杨恒文/高云飞/罗钧洪(L2)】与博后(L4)跑通空间多色+全光谱流式实测，联合平台主管(L3)呈报【尹芝南院长(L1)】拍板高校“双一流”修购与珠海市人民医院精准医学中心共建！`,
      nodes: [
        {
          id: 'conf-l1',
          name: '尹芝南 ★当前客户',
          roleTitle: '转化研究院院长 · 广东暨德康民创始人(持股~33%) · 广东暨安特博科学创始人 · 杰青/973首席',
          unitLabel: '院企双栖 L1 · 院长 + 3家生物企业实控人',
          category: 'internal_leader',
          tierLabel: 'L1 研究院院长 & 暨德康民/暨安特博/普锐生物首席科学家',
          budgetAuthority: '暨德康民B轮数千万商业资金 + 暨安特博数千万VC + 国自然重点(318300xx ~300万)/973首席(2000万+)/双一流修购',
          decisionWeight: '高校院级修购终审 100% + 院外企业商业合同终审 · Nature/JEM/STTT通讯作者',
          x: 470,
          y: 75,
          summary:
            '暨南大学生物医学转化研究院院长（曾任耶鲁大学副教授、南开大学生命科学学院院长），兼任广东省免疫学会理事长、珠海市人民医院学术总监/精准医学中心主任。院外创立：①广东暨德康民（持股~33%，董事长王亚杰、CTO向征，2025.12完成广州金控旗下广州健康产投基金B轮增资，核心管线GDKM-100获药监局IND默示许可并在暨大附一院启动晚期肝癌I期临床）；②广东暨安特博（2021 Nature IL-27靶向脂肪产热成果转化，获真格基金/香商投资数千万VC）；③浙江普锐生物（任首席科学家）。',
          competitorExposure: '常规厂商往往只盯着高校院内招标，忽略了其名下「暨德康民」「暨安特博」拥有充沛风险投资且可随时签署企业商业采购合同。',
          actionStrategy:
            '【院企双轨立项与终审拍板】向尹院长汇报“院内转化院/珠海市人民医院学术平台 + 院外暨德康民GDKM-100临床I期免疫监测与暨安特博IL-27管线”一体化方案；获其战略首肯后，企业直签交由向征博士(CTO)落地，院内修购交由吴扬哲副院长推进。',
          greetingScript:
            '“尹院长您好！祝贺咱们广东暨德康民完成广州健康产投基金领投的 B 轮增资、GDKM-100 异体 γδ-T 新药顺利推进晚期肝癌 I 期临床！我们专门准备了既能支撑转化院与珠海市人民医院发顶刊、又能直接配合向征总做 GDKM-100 临床 I 期伴随免疫监控与暨安特博 IL-27 管线验证的院企双轨方案！”',
        },
        {
          id: 'conf-l2',
          name: '向征(暨德康民CTO) / 吴扬哲(副院长) / 杨恒文 / 高云飞 / 罗钧洪',
          roleTitle: '向征(转化院PI兼暨德康民执行总经理/CTO) · 吴扬哲(副院长) · 杨恒文/高云飞/罗钧洪(海外优青)',
          unitLabel: '院企双栖 L2 · 企业CTO直签 + 副院长 + 独立PI',
          category: 'internal_subpi',
          tierLabel: 'L2 企业B轮商业直签拍板人(向征) & 院内独立国自然PI簇',
          budgetAuthority: '向征掌管暨德康民B轮CMC/临床质控商业采购直签(免高校招标)；各PI独立支配国自然面上/海外优青(50万-400万)',
          decisionWeight: '企业采购与临床I期质控方案拍板权 95% + 院内技术路线把关',
          x: 370,
          y: 210,
          summary:
            '【向征博士】既是暨大转化研究院研究员，又兼任广东暨德康民执行总经理兼首席技术官(CTO)，直接负责GDKM-100细胞制剂CMC质控、I期临床样本监测与企业研发采购（可走企业B轮资金免招标直签）；【吴扬哲教授】任研究院副院长分管日常科研平台；【杨恒文、高云飞、罗钧洪(国家海外优青200-400万)】各自独立主持多项国家自然科学基金项目。',
          competitorExposure: 'GDKM-100处于I期临床入组关键期，对Vγ9Vδ2-T细胞纯度、杀伤表型、耗竭标志物及细胞因子释放监测的合规性与重现性要求极高。',
          actionStrategy:
            '【头号实战突破口】① 商务快线直接约见向征博士(暨德康民CTO)，提供GDKM-100临床I期受试者外周血/肿瘤穿刺样本高维流式与超微量因子检测方案，走广东暨德康民企业账户快速签单；② 院内线配合吴扬哲副院长及杨恒文/高云飞/罗钧洪教授，用各自在研国自然经费直签测试与耗材。',
          greetingScript:
            '“向总/吴院长/高老师您好！针对咱们暨德康民 GDKM-100 晚期肝癌 I 期临床入组样本的伴随免疫监测，以及院里国自然课题的实体瘤 γδ-T 空间浸润定量，我们备好了符合 IND 申报规范的 24 色全光谱质控模板与 1 微升细胞因子方案，企业端可直接走商业合同快速交付！”',
        },
        {
          id: 'conf-l3',
          name: '流式分选平台主管 & 暨德康民CMC/QC主管',
          roleTitle: '研究院公共流式平台主管 / 广东暨德康民质量控制(QC)负责人',
          unitLabel: '院企 L3 · 院内修购参数起草 & 企业QC放行把关',
          category: 'internal_gatekeeper',
          tierLabel: 'L3 院内大型仪器参数起草 & 企业GMP细胞放行标准把关',
          budgetAuthority: '《双一流大型仪器可行性论证报告》起草 + 暨德康民QC实验室耗材白名单准入',
          decisionWeight: '设备年开机率测算、防堵孔稳定性与临床级QC合规把关权 90%',
          x: 590,
          y: 210,
          summary:
            '一方面负责管理转化研究院公共流式分选与成像平台（起草年度修购专项论证报告与三家比价单），另一方面在企业端负责广东暨德康民 GDKM-100 临床级 Vγ9Vδ2-T 细胞注射液的流式表型放行检测与批间一致性核查。',
          competitorExposure: '传统流式存量厂商试图游说沿用旧式光学参数，且部分科研试剂缺乏企业CMC质控所需的COA/审计追踪合规文档。',
          actionStrategy:
            '同时递交《院内8个课题组共享>2000小时可行性论证报告初稿》与符合药监局IND审评要求的《GDKM-100细胞制剂全光谱流式放行SOP与21 CFR Part 11合规包》。',
          greetingScript:
            '“平台主管/QC负责人老师您好，我们把今年研究院修购专项的 2000 小时共享机时测算表，以及专门针对暨德康民 GDKM-100 临床级细胞放行检测的审计追踪质控包都整理好了，院内招标和企业迎检都能直接用！”',
        },
        {
          id: 'conf-l4',
          name: '鲁呦呦 / 裴建 / 陈娜（核心博后）',
          roleTitle: 'γδ-T细胞扩增分选与IL-27代谢免疫一线专职博后 / 企业研发骨干',
          unitLabel: '院内 L4 · 一线实验与组会汇报骨干',
          category: 'internal_exec',
          tierLabel: 'L4 每日细胞扩增分选与周四组会 PPT 第一执笔人',
          budgetAuthority: '课题组与企业研发日常试剂耗材及委外测试第一建议权',
          decisionWeight: '每周四下午研究院/企业联合大组会实测数据汇报人',
          x: 470,
          y: 355,
          summary:
            '每天在一线分离扩增 Vγ9Vδ2-T 细胞、处理晚期肝癌临床试验外周血样本及开展 IL-27 脂肪产热小鼠代谢流式分析，背负高分SCI发表与企业IND补充药效数据双重考核。',
          competitorExposure: '常被常规单细胞测序外包商推销，但单细胞测序成本高且无法原位呈现 γδ-T 细胞贴近杀伤肝癌细胞的物理距离。',
          actionStrategy:
            '由FAE技术支持驻场免费帮跑 2 例肝癌/实体瘤 γδ-T 空间 6 色免疫荧光切片与 24 色全光谱自动解混，直接生成周四组会向尹芝南院长和向征博士汇报的高清 Figure。',
          greetingScript:
            '“师兄/师姐您好！知道咱们最近既要赶 GDKM-100 临床样本流式检测又要补顶刊数据特别辛苦。这周我们工程师免费帮您跑 2 例实体瘤 γδ-T 空间 6 色邻近度热图，连组会汇报 PPT 高清图都帮您排好！”',
        },
        {
          id: 'conf-ext1',
          name: '广东暨德康民(B轮) & 暨大附一院 / 珠海市人民医院',
          roleTitle: '尹芝南实控企业(持股~33%·董事长王亚杰·CTO向征) + GDKM-100 I期临床牵头医院',
          unitLabel: '院外直签金主① · 暨德康民(B轮数千万) & 临床I期中心',
          category: 'external_institute',
          tierLabel: '头号商业直签主体（B轮数千万在账 · 免高校招标直签）',
          budgetAuthority: '2025.12广州健康产投基金B轮数千万增资 + 广州银行授信 + 珠海市人民医院精准医学专项',
          decisionWeight: '独立企业商业采购合同直接签约权 100%',
          x: 115,
          y: 145,
          summary:
            '【广东暨德康民生物科技有限公司】由尹芝南创立并任首席科学家（持股约33%），王亚杰任董事长，向征任执行总经理兼CTO，尹福生任董事；2025年12月完成广州金控旗下广州健康产投基金领投的B轮增资并入选广州市“益企共赢计划”。核心产品「同种异体Vγ9Vδ2-T细胞注射液(GDKM-100)」为中国首个获批NMPA IND的异体γδ-T新药，已在暨大附一院正式启动晚期肝癌I期临床，并在广深珠沪汉多家三甲医院开展IIT研究；同时尹芝南兼任珠海市人民医院学术总监/精准医学中心主任。',
          competitorExposure: '临床I期受试者免疫监控与GMP车间放行质控急需高稳定性流式与1μL超微量细胞因子风暴(CRS)快检体系。',
          actionStrategy:
            '【最快签单路径】直接以「广东暨德康民生物科技有限公司」为合同甲方，找向征博士(CTO)与王亚杰董事长签署企业级商业采购协议，避开高校漫长招标周期，并同步覆盖暨大附一院与珠海市人民医院临床监测队列！',
          greetingScript:
            '“向总/王董，咱们这套全光谱 γδ-T 临床放行质控与 1 微升 Olink 细胞因子监测方案，可以直接跟广东暨德康民签企业商业合同快速供货，全力保障 GDKM-100 在暨大附一院的晚期肝癌 I 期临床入组检测！”',
        },
        {
          id: 'conf-ext2',
          name: '广东暨安特博(真格投资) & 浙江普锐生物',
          roleTitle: '尹芝南科学创始人企业(Nature IL-27转化) & 首席科学家企业(免疫健康评价)',
          unitLabel: '院外直签金主② · 暨安特博(数千万VC) & 普锐生物',
          category: 'external_institute',
          tierLabel: '第二商业直签主体（真格基金/香商投资数千万VC在账）',
          budgetAuthority: '真格基金/香商投资数千万元级风险投资 & 普锐生物商业化采购预算',
          decisionWeight: '代谢免疫新药研发与人群免疫评估商业采购权 90%',
          x: 115,
          y: 300,
          summary:
            '【广东暨安特博生物科技有限责任公司】基于尹芝南团队2021年发表于《Nature》的突破性成果（首次发现IL-27靶向脂肪细胞促进产热、减轻肥胖并改善2型糖尿病/MASH）于2023年赋权创立，已获真格基金(ZhenFund)、香商投资数千万元级风险投资，研发重组蛋白、mRNA及小分子代谢新药；【浙江普锐生物技术有限公司】由尹芝南任首席科学家，主攻γδ-T免疫治疗与人类免疫健康精准评价体系产业化。',
          competitorExposure: '暨安特博推进IL-27新药IND申报需大量代谢免疫流式与因子检测；普锐生物开展大规模人群免疫年龄分型需高通量流式试剂包。',
          actionStrategy:
            '以2021《Nature》IL-27管线临床前药效评价对接广东暨安特博研发团队，同时联动华东团队对接浙江普锐生物，实现“锁定尹芝南一人、裂变三家生物医药公司订单”！',
          greetingScript:
            '“尹院长/研发负责人，针对咱们广东暨安特博正在推进的 IL-27 重组蛋白/mRNA 代谢新药药效评价，以及浙江普锐生物的人群免疫健康分型，我们配套了脂肪组织免疫微环境多色流式与高通量因子联检方案！”',
        },
        {
          id: 'conf-comp1',
          name: '传统常规流式存量厂商',
          roleTitle: '潜在竞争对手 · 试图用传统8-12色PMT流式锁定院内增购',
          unitLabel: '竞争对手 · 存量旧机型厂商',
          category: 'competitor',
          tierLabel: '外部竞品威胁 A',
          budgetAuthority: '试图抢占研究院修购与企业QC实验室预算',
          decisionWeight: '游说沿用旧式光学通道参数 (威胁度 高)',
          x: 825,
          y: 145,
          summary:
            '试图凭借实验室早年购买的常规流式细胞仪，游说平台沿用传统滤光片通道参数。',
          competitorExposure:
            '弱点：传统流式超过12色后手工荧光补偿极度繁琐，无法扣除肝癌/实体瘤消化悬液强自发荧光，且缺乏企业IND申报级多色质控深度。',
          actionStrategy:
            '在院内修购与暨德康民QC标准中植入“5激光≥40个APD全光谱检测器 + 实体瘤自发荧光独立光谱实时扣除 + 审计追踪合规”刚性参数。',
          greetingScript:
            '“向总/吴院长，肝癌组织消化下来的 TIL 悬液自发荧光极强，传统流式跑到 12 色以上亚群就糊在一起了；咱们院内平台和暨德康民 QC 室直接统一上 40 通道 APD 全光谱，一步到位支撑 GDKM-100 临床转化与顶刊发表！”',
        },
        {
          id: 'conf-comp2',
          name: '高价单细胞测序外包商',
          roleTitle: '潜在竞争对手 · 游说课题组将经费全投向单细胞RNA-seq',
          unitLabel: '竞争对手 · 测序外包分流',
          category: 'competitor',
          tierLabel: '外部竞品威胁 B',
          budgetAuthority: '试图分流国自然子课题与企业临床样本检测预算',
          decisionWeight: '高频接触一线博后推销测序包',
          x: 825,
          y: 300,
          summary:
            '向一线博后推销动辄十余万的单细胞转录组测序，试图瓜分在研国自然测试费与临床样本分析预算。',
          competitorExposure:
            '弱点：单细胞测序必须把肿瘤组织酶解成悬液，彻底丢失了 GDKM-100 γδ-T 细胞与肝癌靶细胞 15μm 接触杀伤的空间原位证据。',
          actionStrategy:
            '用“单切片6-8色 γδ-T 空间邻近度原位定量 + 1μL Olink 蛋白实测”反制，直接补齐审稿人与药监审评必看的空间浸润杀伤证据。',
          greetingScript:
            '“老师，单细胞测序打碎了组织，审稿人和临床专家还是会要求看回输的 Vγ9Vδ2-T 细胞在肿瘤原位到底有没有贴近杀伤癌细胞；咱们做石蜡切片 6 色空间距离定量配 1 微升蛋白组，2 周直接出硬核实证图！”',
        },
      ],
      edges: [
        {
          id: 'ce-yin-1',
          source: 'conf-l1',
          target: 'conf-l2',
          edgeType: 'hierarchy',
          label: '院企双轨授权：向征任暨德康民CTO / 吴扬哲管院务 / 各PI掌管国自然',
          detail: '尹芝南院长统筹转化院与3家名下企业，将广东暨德康民日常运营与GDKM-100临床技术交由向征博士(执行总经理兼CTO)负责，院内日常管理交由吴扬哲副院长及杨恒文/高云飞/罗钧洪教授。',
        },
        {
          id: 'ce-yin-2',
          source: 'conf-l1',
          target: 'conf-l3',
          edgeType: 'hierarchy',
          label: '审批院内双一流修购与企业GMP/QC质控标准',
          detail: '研究院大型设备修购报告与暨德康民QC实验室标准由平台主管/QC负责人起草后，经向征/吴扬哲审核呈报尹芝南拍板。',
        },
        {
          id: 'ce-yin-3',
          source: 'conf-l4',
          target: 'conf-l2',
          edgeType: 'decision_chain',
          label: '破局第1跳：免费试测促成企业/课题直签',
          detail: '先帮一线博后（鲁呦呦/裴建）免费试跑2例 γδ-T 空间6色切片与流式分型，在周四组会汇报后由向征博士(走暨德康民企业合同)或子课题PI(走国自然经费)快速直签。',
        },
        {
          id: 'ce-yin-4',
          source: 'conf-l2',
          target: 'conf-l3',
          edgeType: 'decision_chain',
          label: '破局第2跳：纳入企业CMC标准与院级修购计划',
          detail: '向征博士与吴扬哲副院长结合实测数据，指派QC主管与平台主管将全光谱流式与空间多组学写入企业采购清单及高校修购论证底稿。',
        },
        {
          id: 'ce-yin-5',
          source: 'conf-l3',
          target: 'conf-l1',
          edgeType: 'decision_chain',
          label: '破局第3跳：尹芝南院长院企双轨终审拍板',
          detail: '院外走广东暨德康民B轮商业资金/暨安特博VC快速采购，院内走双一流2000小时共享机时修购立项，由尹芝南院长最终拍板。',
        },
        {
          id: 'ce-yin-6',
          source: 'conf-ext1',
          target: 'conf-l1',
          edgeType: 'external_collab',
          label: '实控广东暨德康民(持股~33%·B轮) & 珠海市人民医院学术总监',
          detail: '广东暨德康民2025.12获广州健康产投基金B轮数千万增资，GDKM-100在暨大附一院启动晚期肝癌I期临床；向征兼任执行总经理兼CTO，可直接签商业合同。',
        },
        {
          id: 'ce-yin-7',
          source: 'conf-ext2',
          target: 'conf-l2',
          edgeType: 'external_collab',
          label: '创立广东暨安特博(Nature IL-27转化·真格投资) & 普锐生物',
          detail: '广东暨安特博获真格基金/香商投资数千万VC推进IL-27代谢新药；浙江普锐生物由尹芝南任首席科学家推进免疫健康评估产业化。',
        },
        {
          id: 'ce-yin-8',
          source: 'conf-comp1',
          target: 'conf-l3',
          edgeType: 'competitor_risk',
          label: '竞品风险：传统流式锁定旧参数',
          detail: '需用“40通道APD全光谱+实体瘤自发荧光实时扣除+IND申报合规”硬指标反制传统PMT流式厂商。',
        },
        {
          id: 'ce-yin-9',
          source: 'conf-comp2',
          target: 'conf-l4',
          edgeType: 'competitor_risk',
          label: '竞品风险：单细胞测序分流经费',
          detail: '用“保留GDKM-100 γδ-T杀伤空间原位距离+企业合同快速直签”反制单细胞测序外包分流。',
        },
      ],
    };
  }

  const isLabMedicine =
    !isYinZhinan &&
    (shortName.includes('欧阳') ||
      shortName.includes('刘敏') ||
      shortName.includes('黄彬') ||
      shortName.includes('张式鸿') ||
      (!shortName && customer.department.includes('检验')));
  const isLiuMin = shortName.includes('刘敏');
  const isOuyangJuan = shortName.includes('欧阳');

  if (isLabMedicine) {
    return {
      id: `confirmed-${customer.id}`,
      unitName: `【当前客户·三甲医院检验科】${customer.institution} · 医学检验科（正主任刘敏 × 行政副主任欧阳涓 班子体系）`,
      badge: isLiuMin
        ? '当前锁定：刘敏（L1检验科正主任 · 主持国自然/863子课题/省市重大专项）'
        : '当前锁定：欧阳涓（L2检验科行政副主任·管流式 · 省临床细胞分析分会首届主委）',
      overviewAbstract: `【中山一院 · 医学检验科真实人事、纵向课题与业务分工】L1正主任：刘敏（全科行政一把手，统筹越秀本部与南沙院区，主持国家自然科学基金、国家863计划子课题、广东省科技厅项目、广州市产学研协同创新重大专项，掌管国家临床重点专科建设经费与全科年度采购终审） ➔ L2行政副主任：欧阳涓（分管二当家，美国MD安德森肿瘤中心访问学者、广东省精准医学应用学会临床细胞分析分会首届主任委员，专管流式细胞免疫分型、血液病MRD高敏监测与新项目开发）、黄彬（副主任·管微生物） ➔ L3质控与立项把关：张式鸿 & 科研秘书 ➔ L4一线主管技师：王哲/林琳。`,
      recommendedChainSummary: isLiuMin
        ? `针对【L1正主任刘敏】攻单链：若推感染/肿瘤分子标志物、863/产学研专项转化或全科流水线，直接对齐刘敏主任跨院区质量同质化与降低耗占比诉求；若推流式细胞仪或血液MRD，务必先由售前工程师配合她麾下分管副主任【欧阳涓(L2)】与【张式鸿(L3)】跑通流式临床性能验证，再呈报刘敏主任终审签字`
        : `针对【L2副主任欧阳涓】攻单链：先由售前工程师配合一线主管技师(王哲/林琳, L4)与质量骨干(张式鸿, L3)完成疑难骨髓样本高敏MRD试测 ➔ 找分管行政副主任【欧阳涓(L2，省临床细胞分析分会首届主委)】敲定流式新项目立项与大湾区多中心室间比对 ➔ 联名科室秘书向正主任【刘敏(L1)】汇报全科通量与院级预算拍板`,
      nodes: [
        {
          id: 'conf-l1',
          name: isLiuMin ? '刘敏 ★当前客户' : '刘敏（正主任）',
          roleTitle: '医学检验科主任（正职一把手） / 主任技师 / 博导（主持国自然/国家863子课题/省市重大专项）',
          unitLabel: isLiuMin ? '院内 L1 · 当前锁定客户' : '院内 L1 · 科室正职一把手',
          category: 'internal_leader',
          tierLabel: isLiuMin
            ? 'L1 全科一把手（当前锁定拜访对象）'
            : 'L1 全科一把手（欧阳涓的直接正职上级）',
          budgetAuthority: '国家临床重点专科建设经费 + 国自然/863子课题/广州市协同创新重大专项 + 越秀本部与南沙院区年度设备预算终审权',
          decisionWeight: '全科采购计划签字权 100% · 感染/分子/生化免疫领军',
          x: 470,
          y: 75,
          summary:
            '1992年起在中山一院检验科工作，现任医学检验科正主任（兼管南沙院区）。主持国家自然科学基金、国家高技术研究发展计划（863计划）子课题、广东省科技计划项目及广州市产学研协同创新重大专项；全面统管国家临床重点专科建设经费，将流式细胞免疫分型与血液病诊断具体授权给行政副主任欧阳涓分管。',
          competitorExposure: '进口生化免疫流水线与分子大厂高层常去拜访，高度看重ISO15189室间质评满分率、DRG耗占比控制与临床科室满意度。',
          actionStrategy: isLiuMin
            ? '【当前直接拜访对象】谈感染免疫/肿瘤标志物、产学研重大专项转化或全科规划可直接汇报跨院区质量同质化方案；若谈流式细胞仪或血液MRD，切记她一定会征询分管副主任欧阳涓的意见，必须同步搞定欧阳涓！'
            : '在搞定分管副主任欧阳涓（L2）的流式新项目技术立项后，围绕“提升全科疑难血液病临床服务声誉、满足越秀本部与南沙跨院区高通量质控与粤医保合规收费”向刘敏主任呈报终审。',
          greetingScript:
            '“刘敏主任您好！一直关注咱们医学检验科在越秀本部与南沙院区同质化质量管理、国家重点专科建设以及产学研重大专项转化上的标杆成果。目前我们应用团队正配合科里欧阳涓主任和流式室老师做高敏MRD与微量多因子质控对比，特来向您汇报全科立项与ROI测算方案。”',
        },
        {
          id: 'conf-l2',
          name: isOuyangJuan ? '欧阳涓 ★当前客户' : '欧阳涓 / 黄彬（副主任）',
          roleTitle: '医学检验科行政副主任（分管流式细胞与血液病诊断 · 省临床细胞分析分会首届主委）',
          unitLabel: isOuyangJuan ? '院内 L2 · 当前锁定客户' : '院内 L2 · 分管行政副主任',
          category: 'internal_subpi',
          tierLabel: isOuyangJuan
            ? 'L2 流式与血液分管二当家（当前锁定拜访对象）'
            : 'L2 核心分管副职突破口（刘敏主任核心副手）',
          budgetAuthority: '流式/血液新检测项目立项发起权 + 省精准医学学会临床细胞分析多中心课题经费支配权',
          decisionWeight: '流式细胞仪选型与MRD技术参数把关权 95%',
          x: 370,
          y: 210,
          summary:
            '医学检验科行政副主任、主任技师（曾任美国MD安德森肿瘤中心血液病理部访问学者，广东省精准医学应用学会临床细胞分析分会首届主任委员）。专管白血病/淋巴瘤/骨髓瘤流式细胞免疫分型、微小残留病(MRD)高敏监测及临床MDT新项目开发；与正主任刘敏属“正副职搭班子”关系。',
          competitorExposure: '传统8-10色流式厂商常去维护，但在CAR-T后抗原漂移与24色以上高敏MRD监测上面临通道瓶颈。',
          actionStrategy:
            '【流式与细胞分析业务必经核心】无论最终谁签字，流式项目进科必须先由售前应用工程师跟欧阳涓副主任对齐多色MRD灵敏度、学会多中心室间比对标准与新项目物价编码，拿到她的立项背书后再报正主任刘敏拍板。',
          greetingScript:
            '“欧阳主任您好！知道咱们科疑难血液肿瘤流式分型、MRD高敏监测以及广东省临床细胞分析分会的多中心标准化工作都是您在亲自领衔。针对CAR-T后抗原漂移和骨髓微量样本痛点，我们应用工程师整理了全光谱24色MRD对比数据和免费试测方案，特地来向您请教！”',
        },
        {
          id: 'conf-l3',
          name: '张式鸿 & 检验科秘书',
          roleTitle: '流式细胞室质量与方法学把关骨干 / 科室科研秘书',
          unitLabel: '院内 L3 · 质控与报计划把关',
          category: 'internal_gatekeeper',
          tierLabel: 'L3 室间质评把关与年度设备论证执笔',
          budgetAuthority: '《年度检验设备可行性论证报告》起草与质控准入审核',
          decisionWeight: '新项目SOP验证与防故障质控把关权 90%',
          x: 590,
          y: 210,
          summary:
            '协助刘敏主任与欧阳涓副主任管理流式细胞室日常室间质评（EQA）、CAP/ISO15189质量体系核查，并负责汇总撰写科室年度设备购置可行性报告与三家调研比价单。',
          competitorExposure: '存量设备厂商试图游说沿用旧式光学通道参数与封闭耗材体系。',
          actionStrategy:
            '由售后与技术支持递交《疑难骨髓黏稠样本防堵孔质控免责SOP》与《ISO15189性能验证全套方案》，并向秘书提供写好开机率与临床收费回收期测算的《立项报告初稿》。',
          greetingScript:
            '“张老师/秘书老师您好，为了配合咱们检验科今年高敏流式MRD性能验证和下一年度设备报计划论证，我们把《ISO15189性能验证记录表》、《骨髓样本防堵孔SOP》和三家比价参考表全帮您准备好了！”',
        },
        {
          id: 'conf-l4',
          name: '王哲 / 林琳（主管技师）',
          roleTitle: '流式细胞室一线主管技师 & 临床血液学读片骨干',
          unitLabel: '院内 L4 · 一线上机与审签层',
          category: 'internal_exec',
          tierLabel: 'L4 每日骨髓/外周血上机设门与报告初审人',
          budgetAuthority: '试剂耗材试用手感与日常维护反馈第一建议权 90%',
          decisionWeight: '样本实操、自动设门效率与科会汇报PPT第一执笔人',
          x: 470,
          y: 355,
          summary:
            '每天在检验科2号楼3层流式细胞室处理大批量临床血液科送检骨髓与外周血标本，最怕黏稠骨髓标本堵喷嘴、多色荧光手工调补偿耗时及弱阳性亚群漏检。',
          competitorExposure: '日常使用传统流式仪，深受多色串色补偿复杂与清洗维护频繁困扰。',
          actionStrategy:
            '技术支持下午驻场协助，提供“全光谱免手工补偿一键解混模板 + 骨髓微凝块快速过滤工装”，帮一线技师每天节省1.5小时审片时间。',
          greetingScript:
            '“老师您好！知道咱们流式室每天骨髓MRD标本量极大、调多色补偿特别费眼神。我们应用工程师这周驻场免费帮咱们试跑2例疑难骨髓样本，连自动设门和自发荧光扣除模板都帮您配好！”',
        },
        {
          id: 'conf-ext1',
          name: '中山一院 · 血液内科（李娟/许多荣团队）',
          roleTitle: '院内核心临床送检方 · 骨髓瘤/白血病MRD与CAR-T主阵地',
          unitLabel: '关联科室 · 临床需求源头',
          category: 'external_institute',
          tierLabel: '院内上游核心临床送检科室',
          budgetAuthority: '临床MDT联合立项方 · 大型血液病队列样本源头',
          decisionWeight: '对检验科开展高敏MRD与细胞因子新项目推动力 90%',
          x: 115,
          y: 145,
          summary:
            '中山一院血液内科（李娟教授、许多荣教授团队）是医学检验科欧阳涓团队最核心的临床合作伙伴，大量多发性骨髓瘤、白血病及CAR-T治疗患者依赖检验科出具高敏流式MRD与细胞因子监测报告。',
          competitorExposure: '部分第三方特检外送公司试图直接从临床科室分流外送标本。',
          actionStrategy:
            '促成“血液内科临床研究需求 × 检验科欧阳涓流式室院内自建高敏MRD平台”双科联动，既帮检验科把样本留在院内创收，又帮刘敏主任拿到临床高度认可政绩。',
          greetingScript:
            '“欧阳主任，血液内科CAR-T和骨髓瘤队列现在非常需要10^-5高敏全光谱MRD和1微升CRS细胞因子快检，咱们把这套能力建在科里，既能配合临床MDT发顶刊，又能把外送标本全留在咱们院内！”',
        },
        {
          id: 'conf-ext2',
          name: '广东省精准医学应用学会临床细胞分析分会',
          roleTitle: '外部学术主委平台 · 欧阳涓牵头发起的区域流式标杆圈',
          unitLabel: '外部学会 · 行业标准风向标',
          category: 'external_institute',
          tierLabel: '华南临床流式细胞分析专家网络',
          budgetAuthority: '区域多中心流式质控共识制定与示范基地',
          decisionWeight: '对科室引进新一代全光谱流式示范背书权重 85%',
          x: 115,
          y: 300,
          summary:
            '由欧阳涓副主任牵头发起的华南临床细胞分析权威学术组织，连接省内各大三甲医院检验科与血液病实验室，高度看重高维流式标准化与室间质评示范效应。',
          competitorExposure: '我方核心学术合作阵地，可联合举办华南高维全光谱流式MRD读片培训班。',
          actionStrategy:
            '在《可行性论证报告》中强化“建成华南临床细胞分析分会全光谱流式示范培训中心”定位，同时满足刘敏主任与欧阳涓副主任的学科声誉诉求。',
          greetingScript:
            '“刘主任、欧阳主任，这套全光谱流式引进后，不仅服务本院与南沙院区，还能直接挂牌咱们临床细胞分析分会的华南高敏MRD示范中心！”',
        },
        {
          id: 'conf-comp1',
          name: '传统8-10色流式存量厂商 (BD / Beckman)',
          roleTitle: '潜在竞争对手 · 凭借科内存量临床机台游说续购',
          unitLabel: '竞争对手 · 存量锁标风险',
          category: 'competitor',
          tierLabel: '外部竞品威胁 A',
          budgetAuthority: '试图用传统滤光片流式锁定科室更新预算',
          decisionWeight: '重点维护科室常规存量设备接口 (威胁度 高)',
          x: 825,
          y: 145,
          summary:
            '凭借科内早年装机的8-10色常规流式仪，试图游说沿用传统PMT滤光片参数，阻挠全光谱高维流式技术导入。',
          competitorExposure: '弱点：通道数受限无法单管完成20+色深度MRD分型，无法独立扣除骨髓样本高自发荧光，且单管抗体拆分成本高。',
          actionStrategy:
            '紧扣欧阳涓副主任关注的“单管24色深度MRD防漏检 + 骨髓高自发荧光独立扣除 + 节省珍贵骨髓样本量”，在立项参数中植入APD全光谱排他指标。',
          greetingScript:
            '“欧阳主任，传统10色流式测疑难MRD得拆成3管跑，遇到骨髓抽取量少的病人根本不够分；用全光谱一管直接跑24色还能把骨髓自发荧光扣掉，既省样本又防抗原漂移漏检！”',
        },
        {
          id: 'conf-comp2',
          name: '院外第三方特检外送公司 (金域/迪安等)',
          roleTitle: '潜在竞争对手 · 争抢疑难血液病MRD与多因子外送样本',
          unitLabel: '竞争对手 · 外送分流威胁',
          category: 'competitor',
          tierLabel: '外部竞品威胁 B',
          budgetAuthority: '试图将高附加值特检样本分流至院外实验室',
          decisionWeight: '向临床医生推销院外特检外送服务',
          x: 825,
          y: 300,
          summary:
            '高频在临床血液科活动，试图把高难流式MRD与细胞因子谱监测标本拉到院外第三方实验室检测。',
          competitorExposure: '弱点：样本冷链外送耗时24-48小时导致细胞活性下降，且医院流失检验收费与一手科研队列数据。',
          actionStrategy:
            '向刘敏主任与欧阳涓副主任算清“院内自建全光谱流式与1μL多因子平台”的时效优势（院内4小时出报告）与科室创收账，帮检验科把高价值项目牢牢留在院内。',
          greetingScript:
            '“刘主任、欧阳主任，骨髓样本外送超过12小时部分脆弱表面标志物就降解了；咱们科自己配齐这套高敏全光谱和超微量因子方案，4小时院内出精准报告，临床科室更满意！”',
        },
      ],
      edges: [
        {
          id: 'ce-1',
          source: 'conf-l1',
          target: 'conf-l2',
          edgeType: 'hierarchy',
          label: '正主任挂帅 ➔ 授权副主任分管流式/血液',
          detail:
            '刘敏任医学检验科正主任（L1一把手，管全科规划与分子/感染免疫）；欧阳涓任行政副主任（L2二当家），获授权全面分管流式细胞免疫分型、血液病MRD与新项目开发。',
        },
        {
          id: 'ce-2',
          source: 'conf-l1',
          target: 'conf-l3',
          edgeType: 'hierarchy',
          label: '全科质量体系与年度报计划汇总',
          detail:
            '科室年度《大型检验设备可行性论证报告》与跨院区ISO15189质控核查由张式鸿及科室秘书汇总后呈报刘敏主任终审。',
        },
        {
          id: 'ce-3',
          source: 'conf-l4',
          target: 'conf-l2',
          edgeType: 'decision_chain',
          label: '破局第1跳：骨髓MRD实测促成立项',
          detail:
            '售前工程师先驻场配合流式室主管技师（王哲/林琳）跑出2例疑难骨髓样本高敏MRD对比图，向分管副主任欧阳涓汇报并启动新项目立项。',
        },
        {
          id: 'ce-4',
          source: 'conf-l2',
          target: 'conf-l3',
          edgeType: 'decision_chain',
          label: '破局第2跳：写入科室设备论证报告',
          detail:
            '欧阳涓副主任确认流式与多因子方案性能达标后，交由张式鸿与科室秘书写入《医学检验科年度设备购置可行性论证报告》。',
        },
        {
          id: 'ce-5',
          source: 'conf-l3',
          target: 'conf-l1',
          edgeType: 'decision_chain',
          label: '破局第3跳：正副职达成共识呈报终审',
          detail:
            '有分管副主任欧阳涓的专业把关背书 + 完备的跨院区开机率与物价创收测算，正主任刘敏在科务会与院级评审中顺水推舟拍板。',
        },
        {
          id: 'ce-6',
          source: 'conf-ext1',
          target: 'conf-l2',
          edgeType: 'external_collab',
          label: '血液科MDT临床送检刚需拉动',
          detail: '本院血液内科（李娟/许多荣团队）高敏MRD与CAR-T监测需求直接支撑欧阳涓副主任发起新项目立项。',
        },
        {
          id: 'ce-7',
          source: 'conf-ext2',
          target: 'conf-l3',
          edgeType: 'external_collab',
          label: '华南临床细胞分析主委单位标杆对标',
          detail: '作为欧阳涓牵头的省级主委单位，建设高维流式示范中心的定位可直接写入科室设备立项理由。',
        },
        {
          id: 'ce-8',
          source: 'conf-comp1',
          target: 'conf-l3',
          edgeType: 'competitor_risk',
          label: '竞品防线：反制传统10色流式锁参',
          detail: '用“单管24色全光谱省骨髓样本 + 骨髓高自发荧光独立扣除”刚性临床需求反制传统滤光片流式。',
        },
        {
          id: 'ce-9',
          source: 'conf-comp2',
          target: 'conf-l4',
          edgeType: 'competitor_risk',
          label: '竞品防线：拦截院外特检外送分流',
          detail: '用“院内4小时极速出报告 + 零冷链降解 + 留存院内物价创收”协助检验科把高价值样本留在科内。',
        },
      ],
    };
  }

  const isFirstAuthorCustomer =
    customer.personTier === 'L2' ||
    (customer.title || '').includes('第一作者') ||
    (customer.correctionBadge || '').includes('第一作者');

  const l1LeaderName = customer.deptLeaderName
    ? customer.deptLeaderName.split('（')[0].trim()
    : shortName;

  const effectiveL2Name =
    isFirstAuthorCustomer && l1LeaderName !== shortName
      ? `${shortName}（第一作者核心骨干 · 当前锁定客户）`
      : subPiLabel;

  return {
    id: `confirmed-${customer.id}`,
    unitName: `【当前客户·生命科学/医疗临床】${customer.institution} · ${customer.department}（${l1LeaderName}体系）`,
    badge: '团队架构与决策链拓扑',
    overviewAbstract: `【${l1LeaderName} · ${customer.department}】组织与决策架构：内部呈“通讯作者导师/课题组大PI(${l1LeaderName}, L1) ➔ 核心研究骨干/实权把关(${effectiveL2Name}, L2) ➔ 科研秘书与平台主管(L3) ➔ 同组实验协作伙伴(${execLabel}, L4)”四级结构；外部关联协作科研院所与潜在竞品防线。`,
    recommendedChainSummary: `最优推进决策链：一线核心骨干(${effectiveL2Name})免费试测出图 ➔ 联合同组伙伴(${execLabel})整理组会汇报PPT ➔ 通讯作者导师(${l1LeaderName})签批测试费与立项报告`,
    nodes: [
      {
        id: 'conf-l1',
        name: l1LeaderName,
        roleTitle: isFirstAuthorCustomer
          ? `${customer.department} 通讯作者导师 / 课题组长 PI（L1经费拍板人）`
          : `${customer.title} / ${customer.department}学科带头人`,
        unitLabel: '院内 L1 · 终极拍板人',
        category: 'internal_leader',
        tierLabel: 'L1 终审决策层（通讯大PI / 科室一把手）',
        budgetAuthority: '纵向课题经费与院/科级修购专项终审权',
        decisionWeight: '终极拍板权 100%（重顶刊标志性成果）',
        x: 470,
        y: 75,
        summary: `统领【${customer.department}】在「${customer.researchKeywords}」方向的国家自然科学基金、省市重大专项与学科建设经费。依靠课题组第一作者骨干（${effectiveL2Name}）的实测数据做采购决策。`,
        competitorExposure: '跨国器械商与测序大厂高层偶有拜访，但不直接介入具体实验包细节。',
        actionStrategy: `先配合第一作者骨干（${effectiveL2Name}）和同组实验伙伴（${execLabel}）跑出高分辨率流式与原位免疫荧光实测 Figure 放进组会 PPT，再呈报 ${l1LeaderName} 签字拍板。`,
        greetingScript: `“${l1LeaderName}教授您好，我们正配合咱们课题组 ${shortName} 老师做「${customer.researchKeywords}」样本的多色流式与原位免疫荧光实测支撑，特来向您汇报阶段数据与测试方案。”`,
      },
      {
        id: 'conf-l2',
        name: effectiveL2Name,
        roleTitle: isFirstAuthorCustomer
          ? customer.title || 'SCI第一作者核心青年科研骨干（当前锁定客户）'
          : '分管副主任 / 子课题青年PI（实权二当家）',
        unitLabel: isFirstAuthorCustomer
          ? '院内 L2 · 核心一作（当前锁定客户）'
          : '院内 L2 · 实权二当家',
        category: 'internal_subpi',
        tierLabel: 'L2 核心实权突破口',
        budgetAuthority: '实验方案选型与 ≤5万元测试费发起/直签权',
        decisionWeight: '项目发起权 95% · 双周组会汇报把关人',
        x: 370,
        y: 210,
        summary: `真正在【${customer.department}】一线亲手操盘「${customer.researchKeywords}」核心实验，对流式抗体、免疫荧光试剂与测试外包选型拥有直接决定权。`,
        competitorExposure: '常规低价外包商常去推销，但给不出顶刊要求的 15μm 空间邻近度定量与高维光谱数据。',
        actionStrategy: `【首选破局点】携同方向顶刊对标单页直接约见 ${effectiveL2Name}，提供 2 例样本免费试测对赌，跑出漂亮数据后顺势引荐通讯导师（${l1LeaderName}）直签测试合同。`,
        greetingScript: `“${shortName}老师您好！精读了您以第一作者和 ${l1LeaderName} 教授合发的代表作，针对「${customer.researchKeywords}」深入机制验证，我们先免费帮咱们试测 2 例样本并排好组会汇报 PPT！”`,
      },
      {
        id: 'conf-l3',
        name: `${customer.department}科研秘书 & 平台主管`,
        roleTitle: '科室专职科研秘书 / 公共仪器平台把关人',
        unitLabel: '院内 L3 · 执笔与机管把关',
        category: 'internal_gatekeeper',
        tierLabel: 'L3 报计划执笔与查重把关',
        budgetAuthority: '年度《可行性论证报告》起草与三家比价汇总',
        decisionWeight: '立项材料执笔权 95% · 平台准入把关权',
        x: 590,
        y: 210,
        summary: `负责替 ${l1LeaderName} 汇总撰写年度《大型仪器可行性论证报告》及收集三家市场调研比价单，同时把关临床样本质控与仪器防堵孔运维。`,
        competitorExposure: '传统友商试图用旧式滤光片/单色组化参数锁定下一年度科室采购预算。',
        actionStrategy: '主动送上写好“多子课题共享年开机 1800 小时测算”的《可行性论证报告初稿》及《微量临床样本防堵孔质控免责SOP》。',
        greetingScript: `“秘书/主管老师您好，为了省去您写年度报计划材料的时间，我们结合科室几个子课题组在「${customer.researchKeywords}」上的需求，把《可行性论证报告》和三家梯度比价表全帮您备好初稿了！”`,
      },
      {
        id: 'conf-l4',
        name: execLabel,
        roleTitle: '一线主管技师 / 专职博后 & 实验骨干',
        unitLabel: '院内 L4 · 一线实验执行层',
        category: 'internal_exec',
        tierLabel: 'L4 每日实验与组会PPT制作人',
        budgetAuthority: '外包服务与耗材直接建议权 90%',
        decisionWeight: '样本实操与双周组会PPT第一执笔人',
        x: 470,
        y: 355,
        summary: `每天在【${customer.department}】实验室处理珍稀临床样本并制作双周组会 PPT，最怕珍贵临床样本损耗或背景干扰导致文章修回受阻。`,
        competitorExposure: '正被低价外包商接触，但担心普通单色 IHC 或大体积 ELISA 耗尽珍贵样本却发不了高分。',
        actionStrategy: '下午在实验室直接切入，赠送《CNS顶刊空间距离热图模板》，用“免费试染2张切片 + 1μL Olink零损耗”帮其搞定下周组会汇报。',
        greetingScript: `“师兄/师姐您好！拜读了您参与的「${customer.researchKeywords}」研究，针对下周组会汇报，我们先免费帮您跑 2 张切片的 6 色原位共染和 15μm 空间距离热图，连汇报 PPT 页面都帮您排好版！”`,
      },
      {
        id: 'conf-ext1',
        name: '中大生科院 / 基础医学免疫所',
        roleTitle: '外部科研院所 · 医工交叉合著与方法学标杆',
        unitLabel: '外部院所 · 学术风向标',
        category: 'external_institute',
        tierLabel: '外部强关联科研院所',
        budgetAuthority: '共同通讯合著 · 顶刊方法学示范标杆',
        decisionWeight: '对临床青年PI技术路线影响权重 85%',
        x: 115,
        y: 145,
        summary: `与【${customer.institution}·${customer.department}】长期合著发表高分免疫与多组学论文，已全面采用 6-8 色空间蛋白组与 40 色全光谱流式方法学。`,
        competitorExposure: '推崇高分辨率原位空间免疫构象与高维光谱数据，无旧设备锁定包袱。',
        actionStrategy: `向 ${subPiLabel} 展示合作院所同款“单切片 7 色原位共染 + HALO 15μm 空间邻近算法”实测范本，快速建立学术信任。`,
        greetingScript: `“老师，目前基础医学院合著团队发顶刊都在用这套单切片 7 色原位共染配 HALO 15μm 邻近度算法，我们用完全一致的参数帮咱们临床队列做验证，审稿人认可度极高！”`,
      },
      {
        id: 'conf-ext2',
        name: '同城标杆三甲中心实验室',
        roleTitle: '外部科研院所 · 跨院多中心临床联申伙伴',
        unitLabel: '外部院所 · 立项参数对标',
        category: 'external_institute',
        tierLabel: '外部跨院联申伙伴',
        budgetAuthority: '多中心临床队列与大设备配置对标方',
        decisionWeight: '院级修购立项查重参考权重 80%',
        x: 115,
        y: 300,
        summary: '与目标科室共同申报省市重大专项，其公共平台已率先落地全光谱流式与多光谱数字病理空间工作站。',
        competitorExposure: '我方核心标杆装机点，可随时安排样机实测与立项参数对标。',
        actionStrategy: '在《可行性论证报告》中直接引用同城标杆中心超 2000 小时/年的开机率数据，帮科研秘书轻松通过医工处查重。',
        greetingScript: '“秘书老师，隔壁标杆中心同款全光谱与空间病理平台年开机已超 2000 小时，我把他们过会的立项参数模板整理好了，咱们科室直接对标引用最稳妥！”',
      },
      {
        id: 'conf-comp1',
        name: '传统旧技术存量厂商',
        roleTitle: '潜在竞争对手 · 试图延续旧式参数锁标',
        unitLabel: '竞争对手 · 存量控标风险',
        category: 'competitor',
        tierLabel: '外部竞品威胁 A',
        budgetAuthority: '试图锁定科室下一年度设备修购预算',
        decisionWeight: '重点公关平台机管人员 (威胁度 高)',
        x: 825,
        y: 145,
        summary: '凭借早年装机的老旧 4-8 色设备存量，正游说平台管理员沿用传统 PMT 滤光片或普通单色扫片参数。',
        competitorExposure: '弱点：无法剥离临床组织高自发荧光，且无法实现单张切片 6-8 色原位空间细胞距离定量。',
        actionStrategy: '植入“APD全光谱自发荧光独立扣除 + 单切片7色原位共定位”刚性科研指标，实现技术降维反制。',
        greetingScript: '“老师，传统设备无法剥离组织高自发荧光，调补偿还会吞掉弱阳性亚群信号；用 APD 全光谱把自发荧光当独立通道扣掉，分选纯度完全是两个量级！”',
      },
      {
        id: 'conf-comp2',
        name: '低价常规外包商 (普通CRO)',
        roleTitle: '潜在竞争对手 · 争抢子课题5万内测试费',
        unitLabel: '竞争对手 · 低价外包分流',
        category: 'competitor',
        tierLabel: '外部竞品威胁 B',
        budgetAuthority: '试图瓜分子课题 3-5万元测试化验加工费',
        decisionWeight: '高频向一作博后推销廉价单色组化/普通ELISA',
        x: 825,
        y: 300,
        summary: '频繁出入实验室向一作博后推销廉价单色 IHC 与普通 ELISA，试图分流青年PI手头的国自然测试费。',
        competitorExposure: '弱点：耗费 6-8 张珍贵穿刺切片却拿不到细胞原位互作距离，普通 ELISA 需 50μL 样本量远超微量样本上限。',
        actionStrategy: '用“单张切片6色共染 + 1μL Olink 96蛋白芯片 + 免费试染2例对赌”彻底封堵低价外包分流。',
        greetingScript: '“师兄，普通单色组化切 6 张片子也证明不了两群细胞在 15微米内的直接空间互作；咱们在一张切片上做 6色共染配 HALO 定量，一步到位冲顶刊！”',
      },
    ],
    edges: [
      {
        id: 'ce-1',
        source: 'conf-l1',
        target: 'conf-l2',
        edgeType: 'hierarchy',
        label: '大主任挂帅 / 授权分管副职与子课题',
        detail: `${l1LeaderName}把控学科大方向，日常具体课题推进与 5 万内测试费签批授权给 ${subPiLabel}。`,
      },
      {
        id: 'ce-2',
        source: 'conf-l1',
        target: 'conf-l3',
        edgeType: 'hierarchy',
        label: '委托起草年度设备计划',
        detail: `科室每年的《大型仪器可行性论证报告》与三家比价单由科研秘书汇总后呈报 ${l1LeaderName} 签字。`,
      },
      {
        id: 'ce-3',
        source: 'conf-l4',
        target: 'conf-l2',
        edgeType: 'decision_chain',
        label: '破局第1跳：试染出图促签4.8万',
        detail: `先帮一线骨干（${execLabel}）免费试染 2 张 6 色空间切片，向 ${subPiLabel} 汇报后当周即可走测试费直签 4.8 万。`,
      },
      {
        id: 'ce-4',
        source: 'conf-l2',
        target: 'conf-l3',
        edgeType: 'decision_chain',
        label: '破局第2跳：多子课题联名报计划',
        detail: `子课题组跑出高分实测数据后，由 ${subPiLabel} 联合科研秘书写入《科室共享平台可行性论证报告》。`,
      },
      {
        id: 'ce-5',
        source: 'conf-l3',
        target: 'conf-l1',
        edgeType: 'decision_chain',
        label: '破局第3跳：组会PPT+立项书终审',
        detail: `双周组会 PPT 展示惊艳空间大图 + 秘书处完备立项报告呈交，${l1LeaderName}在院务会上顺水推舟拍板。`,
      },
      {
        id: 'ce-6',
        source: 'conf-ext1',
        target: 'conf-l2',
        edgeType: 'external_collab',
        label: '医工合著 / 顶刊方法学示范',
        detail: '外部合著科研院所的空间多组学方法学对科室青年PI具有极强示范效应。',
      },
      {
        id: 'ce-7',
        source: 'conf-ext2',
        target: 'conf-l3',
        edgeType: 'external_collab',
        label: '跨院联申 / 装机参数对标',
        detail: '同城标杆中心的高开机率数据可直接作为科研秘书撰写立项报告的对标依据。',
      },
      {
        id: 'ce-8',
        source: 'conf-comp1',
        target: 'conf-l3',
        edgeType: 'competitor_risk',
        label: '竞品渗透：游说沿用旧参数',
        detail: '需及时用“APD全光谱+高自发荧光独立扣除”及《防堵孔免责SOP》反制存量友商。',
      },
      {
        id: 'ce-9',
        source: 'conf-comp2',
        target: 'conf-l4',
        edgeType: 'competitor_risk',
        label: '竞品分流：低价单色外包诱惑',
        detail: '用“单切片6色共染+15μm邻近算法+1μL Olink”高分刚需降维反制低价CRO。',
      },
    ],
  };
}

const TOPOLOGY_DATASETS: UnitTopologyDataset[] = [
  {
    id: 'sysu-hepatobiliary',
    unitName: '中山一院 · 肝胆胰外科中心 / 精准医学研究院（匡铭·彭穗体系）',
    badge: '院领导挂帅 · 研究院多子课题架构',
    overviewAbstract:
      '内部呈“大院长挂帅(L1) ➔ 研究院副院长/青年PI操盘(L2) ➔ 科研秘书与平台主管把关(L3) ➔ 一作博后执行(L4)”四级结构；外部与中大生科院（邝栋明团队）及中大肿瘤中心深度合著；友商正试图通过公共流式平台锁定传统PMT参数。',
    recommendedChainSummary:
      '最优破局决策链：一作博后(谢晓华)免费试染出图 ➔ 二当家青年PI(彭穗/林满霞)签4.8万测试费并在双周组会汇报 ➔ 科研秘书(李秘书)汇总可行性论证报告 ➔ 大领导(匡铭)院务会顺水推舟签字',
    nodes: [
      // Internal Hierarchy Nodes (Center Column x: 340 - 620)
      {
        id: 'node-kuang',
        name: '匡铭',
        roleTitle: '副院长 / 肝胆胰外科中心学科带头人',
        unitLabel: '院内 L1 · 终极拍板人',
        category: 'internal_leader',
        tierLabel: 'L1 终审决策层',
        budgetAuthority: '院级修购专项 300-1000万终审权',
        decisionWeight: '终极拍板权 100%（不参与日常选型细节）',
        x: 470,
        y: 75,
        summary:
          '论文末位通讯作者，国家杰青。负责精准医学研究院整体战略、国家级重点项目与院务会大设备终审，日常公务极忙，不接待陌生推销。',
        competitorExposure: '友商高层偶有拜访，但大领导从不直接插手单一试剂或未验证的新平台。',
        actionStrategy:
          '切勿盲目堵办公室！先让旗下 3 个子课题青年PI用我方 4.8万空间多组学服务跑出高分数据并在组会 PPT 刷屏，再由科研秘书呈报联名论证报告。',
        greetingScript:
          '“匡院长您好，目前我们正配合研究院彭穗教授、林满霞老师等几个子课题组做肝癌消融后 TLS 空间 6 色免疫构象与超微量蛋白组支撑，相关院级平台共享论证材料已交秘书处审阅。”',
      },
      {
        id: 'node-peng',
        name: '彭穗 / 林满霞',
        roleTitle: '研究院副院长 / 子课题青年PI（共同通讯）',
        unitLabel: '院内 L2 · 实权二当家',
        category: 'internal_subpi',
        tierLabel: 'L2 核心实权突破口',
        budgetAuthority: '子课题测试费 ≤5万元直接签字权',
        decisionWeight: '项目发起权 95% · 组会向大老板汇报人',
        x: 370,
        y: 210,
        summary:
          '论文倒数第二通讯/共同通讯作者。真正在研究院实验室带队攻关肝癌消融微环境与 CAR-T 联合治疗，每天在院且手握在研国自然测试费直签权。',
        competitorExposure: '常规测序/病理外包商常来推销，但缺乏 15μm 空间邻近度算法与顶刊级作图交付。',
        actionStrategy:
          '【首选破局点】提供同方向顶刊文献对标单页 + 免费试染 2 张石蜡切片，用其名下课题测试费直签 4.8 万元首单，并代做双周组会汇报 PPT 页。',
        greetingScript:
          '“彭教授/林老师您好！精读了您和匡院长合发在《JHO》上的文章，针对消融后免疫微环境原位构象，我们先免费帮咱们试染 2 张 6 色切片并排好组会汇报 PPT，费用走子课题 4.8 万测试费即可直报！”',
      },
      {
        id: 'node-sec',
        name: '李秘书 & 张主管',
        roleTitle: '院长专职科研秘书 / 公共流式病理平台主管',
        unitLabel: '院内 L3 · 执笔与机管把关',
        category: 'internal_gatekeeper',
        tierLabel: 'L3 报计划执笔与查重把关',
        budgetAuthority: '年度《可行性论证报告》起草与参数审核',
        decisionWeight: '立项材料执笔权 95% · 平台准入一票否决权',
        x: 590,
        y: 210,
        summary:
          '科研秘书负责每年替大院长汇总撰写《大型仪器可行性论证报告》及收集三家市场调研比价单；平台主管负责全院流式与病理设备日常运维。',
        competitorExposure: '传统流式友商正试图游说平台主管沿用旧式 PMT 滤光片参数排斥全光谱技术。',
        actionStrategy:
          '给科研秘书送上写好“全院 6 个子课题共享年开机 1800 小时测算”的《可行性论证报告初稿》；给平台主管送《微量黏稠样本防堵孔质控免责SOP》。',
        greetingScript:
          '“秘书/主管老师您好，为了给您省去写年度报计划材料的时间，我们结合研究院底下几个子课题组正在跑的空间病理与全光谱数据，把《可行性论证报告》和三家梯度比价表全帮您备好初稿了！”',
      },
      {
        id: 'node-postdoc',
        name: '谢晓华 / 陈志 (博后)',
        roleTitle: '论文第一作者 / 专职博后 & 病理科协作老师',
        unitLabel: '院内 L4 · 一线实验执行层',
        category: 'internal_exec',
        tierLabel: 'L4 每日实验与组会PPT制作人',
        budgetAuthority: '耗材/外包服务直接建议权 90%',
        decisionWeight: '样本实操与组会PPT第一执笔人',
        x: 470,
        y: 355,
        summary:
          '论文第一作者/共同一作。每天下午在精准医学研究院公共平台切石蜡片、跑流式分选，每两周制作组会 PPT 向彭穗教授与匡铭院长汇报。',
        competitorExposure: '正被某低价病理外包商接触，但担心珍贵临床穿刺样本被染坏或背景过高无法发顶刊。',
        actionStrategy:
          '每天下午在研究院实验台或流式房直接接触，分享《CNS顶刊 6色空间邻近度热图模板》，用“免费试染2张切片+1μL Olink不损样”彻底打消顾虑。',
        greetingScript:
          '“师兄您好！拜读了您一作的肝癌消融免疫文章，针对下周四组会汇报，我们先免费帮您跑 2 张石蜡切片的 6 色原位共染和 15μm 空间距离热图，连汇报 PPT 页面都帮您排好版！”',
      },

      // External Research Institutes (Left Column x: 110 - 150)
      {
        id: 'ext-sysu-bio',
        name: '中大生科院 · 邝栋明团队',
        roleTitle: '外部科研院所 · 医工交叉顶刊合著方',
        unitLabel: '外部院所 · 学术风向标',
        category: 'external_institute',
        tierLabel: '外部强关联科研院所',
        budgetAuthority: '共同通讯合著 · 实验方法学示范标杆',
        decisionWeight: '对临床子课题PI技术选型影响极高 (85%)',
        x: 115,
        y: 135,
        summary:
          '中山大学生命科学学院国家杰青团队，长期与中山一院肝胆外科共同发表《Nature/Cancer Cell》级肿瘤免疫巨噬/T细胞空间互作论文，已深度采用多重空间荧光与高维流式方法学。',
        competitorExposure: '无排他锁定，推崇高分辨率原位空间免疫构象与高维光谱数据。',
        actionStrategy:
          '借力打力：向院内青年PI（彭穗/林满霞）展示生科院合著团队同款“6-8色原位共染 + HALO 15μm空间邻近算法”范本，大幅降低方法学信任门槛。',
        greetingScript:
          '“老师，目前中大生科院合作团队发顶刊都在用这套单切片 7 色原位共染配 HALO 15μm 邻近度算法，我们用完全一致的参数帮咱们临床队列做验证，审稿人认可度极高！”',
      },
      {
        id: 'ext-sysucc',
        name: '中大肿瘤防治中心 / 华工生医工',
        roleTitle: '外部科研院所 · 大湾区重大专项联申方',
        unitLabel: '外部院所 · 跨院立项对标',
        category: 'external_institute',
        tierLabel: '外部跨院联申伙伴',
        budgetAuthority: '多中心临床队列与大设备配置对标方',
        decisionWeight: '院级修购立项参数参考权重 80%',
        x: 115,
        y: 305,
        summary:
          '与目标科室共同申报广东省及大湾区重点研发专项，其公共平台已率先引进 Cytek 全光谱流式分选与数字病理空间工作站。',
        competitorExposure: '我方标杆装机阵地，可作为同城同行参观与院内立项论证的对标样板。',
        actionStrategy:
          '在《可行性论证报告》中直接引用肿瘤中心同款 APD 全光谱与空间病理平台的高开机率数据，协助科研秘书顺利通过医工处查重论证。',
        greetingScript:
          '“秘书老师，隔壁肿瘤中心同款全光谱流式与空间病理平台年开机已超 2000 小时，我把他们过会的立项参数模板整理好了，咱们院直接对标引用最稳妥！”',
      },

      // Potential Competitors (Right Column x: 825)
      {
        id: 'comp-legacy-flow',
        name: '传统流式友商 (BD / Beckman)',
        roleTitle: '潜在竞争对手 · 平台存量机管防线',
        unitLabel: '竞争对手 · 存量控标风险',
        category: 'competitor',
        tierLabel: '外部竞品威胁 A',
        budgetAuthority: '试图锁定 300万院级流式修购预算',
        decisionWeight: '重点公关公共平台机管主管 (威胁度 高)',
        x: 825,
        y: 135,
        summary:
          '凭借院内早年装机的老旧 4-8 色传统流式存量，正游说公共平台主管在明年设备计划中延续传统 PMT 光电倍增管参数。',
        competitorExposure: '弱点：传统 PMT 滤光片物理串色严重，无法独立提取肝癌组织高自发荧光，单阳补偿极耗时。',
        actionStrategy:
          '从子课题青年PI的实际痛点（肝癌消融组织高自发荧光干扰）切入，在立项报告中植入“APD雪崩光电二极管全光谱检测 + 实时自发荧光独立扣除通道”排他参数。',
        greetingScript:
          '“老师，咱们肝癌消融组织自发荧光极强，传统 PMT 流式哪怕调补偿也会吞掉弱阳性耗竭 T 细胞信号；用 APD 全光谱直接把自发荧光当独立通道扣掉，分选纯度完全是两个量级！”',
      },
      {
        id: 'comp-cro',
        name: '低价常规外包商 (普通IHC/测序CRO)',
        roleTitle: '潜在竞争对手 · 争抢课题组5万内测试费',
        unitLabel: '竞争对手 · 低价外包分流',
        category: 'competitor',
        tierLabel: '外部竞品威胁 B',
        budgetAuthority: '试图分流子课题 3-5万元测试化验加工费',
        decisionWeight: '重点向一作博后推销低价单色组化/普通ELISA',
        x: 825,
        y: 305,
        summary:
          '高频出入实验室向博后推销廉价单色 IHC 与普通 ELISA 试剂盒，试图瓜分青年PI手头的国自然测试费。',
        competitorExposure: '弱点：耗费大量宝贵穿刺切片却拿不到多靶点原位共定位与 15μm 空间距离数据，普通 ELISA 需 50μL 样本量远超微量穿刺液上限。',
        actionStrategy:
          '用“单张切片 6-8色原位共染 + HALO 空间邻近度定量 + 1μL Olink 96蛋白组”实施降维打击，签署《免费试染2张切片对赌协议》。',
        greetingScript:
          '“师兄，普通单色组化切 6 张片子也证明不了 PD-1+CD8+ T细胞和巨噬细胞在 15微米内的直接互作，审稿人照样打回来；咱们在一张切片上做 6色共染配 HALO 定量，一步到位！”',
      },
    ],
    edges: [
      {
        id: 'e-kuang-peng',
        source: 'node-kuang',
        target: 'node-peng',
        edgeType: 'hierarchy',
        label: '院长授权 / 末位与次通讯',
        detail: '匡铭院长挂末位通讯把控大方向，日常课题推进与 5 万内测试费签批全部授权给彭穗/林满霞等子课题PI。',
      },
      {
        id: 'e-kuang-sec',
        source: 'node-kuang',
        target: 'node-sec',
        edgeType: 'hierarchy',
        label: '委托起草年度设备计划',
        detail: '研究院每年的《大型仪器可行性论证报告》与三家比价单由李秘书与张主管汇总后呈报匡院长签字。',
      },
      {
        id: 'e-postdoc-peng',
        source: 'node-postdoc',
        target: 'node-peng',
        edgeType: 'decision_chain',
        label: '破局第1跳：试染出图促签4.8万',
        detail: '先帮一作博后免费试染 2 张 6 色空间病理切片，博后向青年PI汇报后当周即可走子课题测试费直签 4.8 万。',
      },
      {
        id: 'e-peng-sec',
        source: 'node-peng',
        target: 'node-sec',
        edgeType: 'decision_chain',
        label: '破局第2跳：多子课题联名报计划',
        detail: '3-4 个子课题组跑出高分实测数据后，由青年PI联名交由科研秘书写入《院级共享平台可行性论证报告》。',
      },
      {
        id: 'e-sec-kuang',
        source: 'node-sec',
        target: 'node-kuang',
        edgeType: 'decision_chain',
        label: '破局第3跳：组会PPT+立项书终审',
        detail: '双周组会 PPT 展示惊艳空间大图 + 秘书处完备立项报告呈交，大领导在院务会上顺水推舟拍板 320 万预算。',
      },
      {
        id: 'e-bio-peng',
        source: 'ext-sysu-bio',
        target: 'node-peng',
        edgeType: 'external_collab',
        label: '医工合著 / 顶刊方法学示范',
        detail: '中大生科院邝栋明团队与院内青年PI高频合著，其空间多组学方法学对院内课题组具有极强示范效应。',
      },
      {
        id: 'e-sysucc-sec',
        source: 'ext-sysucc',
        target: 'node-sec',
        edgeType: 'external_collab',
        label: '大湾区联申 / 装机参数对标',
        detail: '肿瘤中心同款全光谱与空间病理平台的高开机率数据，可直接作为科研秘书撰写立项报告的对标依据。',
      },
      {
        id: 'e-comp1-sec',
        source: 'comp-legacy-flow',
        target: 'node-sec',
        edgeType: 'competitor_risk',
        label: '竞品渗透：游说沿用旧PMT参数',
        detail: '传统流式友商正公关平台主管，需及时用“APD全光谱+高自发荧光独立扣除”及《防堵孔免责SOP》反制。',
      },
      {
        id: 'e-comp2-postdoc',
        source: 'comp-cro',
        target: 'node-postdoc',
        edgeType: 'competitor_risk',
        label: '竞品分流：低价单色外包诱惑',
        detail: '低价CRO试图瓜分测试费，需用“单切片6色共染+15μm邻近算法+1μL Olink”高分刚需降维反制。',
      },
    ],
  },
  {
    id: 'sysu-ibd',
    unitName: '中山一院 · 消化内科 / 炎症性肠病(IBD)中心（陈旻湖·毛仁体系）',
    badge: '全国主委科室 · 临床转化大队列',
    overviewAbstract:
      '内部由消化内科泰斗陈旻湖教授(L1)领衔，毛仁/冯瑞等青年PI(L2)分管黏膜免疫与肠纤维化子课题，内镜标本库主管与科研秘书(L3)管样本与报计划，专职博后(L4)跑内镜活检切片；外部与中大医学院免疫所及海外IBD联盟合著紧密。',
    recommendedChainSummary:
      '最优破局决策链：内镜活检博后(庄楠)试染肠黏膜6色切片 ➔ 子课题青年PI(毛仁/冯瑞)直签4.8万测试包 ➔ 科室科研秘书汇总5组共享论证 ➔ 陈旻湖教授拍板重点专科修购专项',
    nodes: [
      {
        id: 'node-chen',
        name: '陈旻湖',
        roleTitle: '消化内科首席专家 / 中华医学会消化学会前任主委',
        unitLabel: '院内 L1 · 学科泰斗拍板人',
        category: 'internal_leader',
        tierLabel: 'L1 终审决策层',
        budgetAuthority: '国家临床重点专科千万级建设经费终审',
        decisionWeight: '学科平台建设终极拍板权 100%',
        x: 470,
        y: 75,
        summary:
          '国内 IBD 领域领军人物，统领全国多中心临床队列与国家临床重点专科建设经费，只关注能否产出《Gut / Gastroenterology》标志性成果。',
        competitorExposure: '跨国药企与大型器械商高层频繁拜访，普通销售极难直接约见。',
        actionStrategy:
          '通过其核心弟子兼子课题负责人（毛仁/冯瑞）先跑出生物制剂耐药患者肠黏膜 6 色空间免疫图谱，在科室大组会上呈现。',
        greetingScript:
          '“陈教授您好，我们正配合科室毛仁教授、冯瑞老师团队，用单张内镜活检切片 6 色原位共染和 1μL 蛋白组解析生物制剂耐药患者的黏膜微环境，特来向您汇报阶段成果。”',
      },
      {
        id: 'node-mao',
        name: '毛仁 / 冯瑞',
        roleTitle: '主任医师 / 研究员 / 子课题青年PI（共同通讯）',
        unitLabel: '院内 L2 · 子课题实权操盘手',
        category: 'internal_subpi',
        tierLabel: 'L2 核心实权突破口',
        budgetAuthority: '国自然面上/青年项目 ≤5万元测试费直签权',
        decisionWeight: '子课题实验设计与外包采购决定权 95%',
        x: 370,
        y: 210,
        summary:
          '陈旻湖团队核心共同通讯作者，分别主攻肠道纤维化机制与黏膜免疫微环境，手握多项在研国自然基金，急需高分机制图冲刺顶刊。',
        competitorExposure: '单细胞测序服务商竞争激烈，但内镜活检样本极小，单细胞酶解损耗过大。',
        actionStrategy:
          '针对内镜活检标本极小痛点，主推“无需酶解打碎组织的 FFPE 石蜡切片 6 色原位共染 + 1μL 血清 Olink 炎症因子谱”，走子课题 4.8万测试费直签。',
        greetingScript:
          '“毛主任/冯老师您好！针对咱们内镜活检样本极珍贵、酶解做单细胞损耗太大的痛点，我们用单张石蜡切片直接做 6 色原位共染定量固有层免疫互作，先免费试染 2 例给您看效果！”',
      },
      {
        id: 'node-ibd-sec',
        name: '消化科科研秘书 & 标本库主管',
        roleTitle: '重点专科秘书 / IBD 生物样本库管理人',
        unitLabel: '院内 L3 · 样本与立项把关',
        category: 'internal_gatekeeper',
        tierLabel: 'L3 样本出库与报计划执笔',
        budgetAuthority: '专科年度设备论证报告起草 & 样本质控把关',
        decisionWeight: '立项材料汇总权 90% · 珍稀活检切片准入把关',
        x: 590,
        y: 210,
        summary:
          '管理数千例 IBD 患者纵向随访内镜活检石蜡块与血清库，并负责起草国家临床重点专科年度仪器购置计划。',
        competitorExposure: '传统病理扫描仪厂商试图推销仅能看 H&E 和单色 IHC 的普通扫片机。',
        actionStrategy:
          '提供《1μL超微量零损耗蛋白检测与单张切片7色复用方案》保护标本库珍稀样本，并送上写好开机率测算的《多光谱空间病理工作站可行性论证底稿》。',
        greetingScript:
          '“老师您好，咱们 IBD 标本库的内镜活检切片极其珍贵，这套方案一张切片顶过去 6 张 IHC，血清只用 1 微升，我把科室年度自建平台的《可行性论证报告》初稿也整理好了供您参考！”',
      },
      {
        id: 'node-ibd-postdoc',
        name: '庄楠 / 李俊 (一作博后)',
        roleTitle: '消化内科实验室专职博后 / 博士生',
        unitLabel: '院内 L4 · 一线实验执行层',
        category: 'internal_exec',
        tierLabel: 'L4 每日实验与修回补数据骨干',
        budgetAuthority: '实验外包与试剂选型直接建议权 90%',
        decisionWeight: '一线做实验与画文章 Figure 的执行人',
        x: 470,
        y: 355,
        summary:
          '每天在消化内科实验室处理肠黏膜切片与外周血样本，正面临《Gut》等顶刊审稿人要求补充“固有层 Treg 与巨噬细胞空间邻近距离证据”的修回压力。',
        competitorExposure: '曾尝试手工做双色免疫荧光，但肠道组织自发荧光极强、信噪比差。',
        actionStrategy:
          '提供《肠道黏膜高自发荧光光谱扣除与 6色 TSA 共染实测样张》，免费帮其试染 2 张修回急需切片。',
        greetingScript:
          '“师兄您好！肠道黏膜自发荧光强是通病，我们用光谱解混把自发荧光彻底剥离，这是刚跑出来的克罗恩病肠黏膜 6 色原位邻近度大图，先免费帮您试染 2 张修回切片！”',
      },
      {
        id: 'ext-ibd-immuno',
        name: '中大基础医学院免疫所',
        roleTitle: '外部科研院所 · 黏膜免疫机制合作方',
        unitLabel: '外部院所 · 基础机制搭档',
        category: 'external_institute',
        tierLabel: '外部强关联科研院所',
        budgetAuthority: '共享流式分选经验与联合基金申报',
        decisionWeight: '基础实验技术路线参考权重 85%',
        x: 115,
        y: 180,
        summary:
          '与消化内科长期合著发表肠道免疫细胞亚群机制文章，熟悉高维全光谱流式与空间转录/蛋白组联合分析。',
        competitorExposure: '已全面转向全光谱流式与多色空间组织学。',
        actionStrategy:
          '引用基础医学院免疫所的 28 色全光谱流式肠黏膜免疫分型 Panel，直接复用到消化内科临床样本。',
        greetingScript:
          '“老师，这是中大免疫所已经验证成熟的肠黏膜固有层 28 色全光谱流式 Panel 和 6 色空间病理方案，咱们临床样本直接复用零摸索成本！”',
      },
      {
        id: 'comp-ibd-ngs',
        name: '传统单细胞测序与普通病理商',
        roleTitle: '潜在竞争对手 · 争抢临床队列经费',
        unitLabel: '竞争对手 · 预算分流风险',
        category: 'competitor',
        tierLabel: '外部竞品威胁',
        budgetAuthority: '试图推销昂贵单细胞测序或普通扫片机',
        decisionWeight: '对子课题经费构成明显分流',
        x: 825,
        y: 210,
        summary:
          '向课题组推销单例上万元的单细胞测序或仅支持 3 色荧光的普通显微镜。',
        competitorExposure: '弱点：内镜活检穿刺组织太小不够酶解做单细胞，且丢失了黏膜上皮与固有层的空间位置关系。',
        actionStrategy:
          '突出“FFPE 存档石蜡切片即可做 6-8 色原位空间细胞邻近度分析 + 成本仅为单细胞测序 1/3”，快速锁死队列验证预算。',
        greetingScript:
          '“老师，内镜活检样本酶解做单细胞既废样本又看不到细胞在黏膜固有层的空间位置；用存档石蜡切片做 6 色空间共染，100 例大队列也能轻松验证！”',
      },
    ],
    edges: [
      {
        id: 'e-chen-mao',
        source: 'node-chen',
        target: 'node-mao',
        edgeType: 'hierarchy',
        label: '主委挂帅 / 子课题授权',
        detail: '陈旻湖教授挂末位通讯，毛仁/冯瑞作为共同通讯具体操盘子课题并直接签批 5 万内测试费。',
      },
      {
        id: 'e-chen-sec',
        source: 'node-chen',
        target: 'node-ibd-sec',
        edgeType: 'hierarchy',
        label: '重点专科报计划汇总',
        detail: '消化内科年度修购设备论证报告由科研秘书与标本库主管汇总提报。',
      },
      {
        id: 'e-ibd-p1',
        source: 'node-ibd-postdoc',
        target: 'node-mao',
        edgeType: 'decision_chain',
        label: '破局第1跳：肠黏膜切片试染直签',
        detail: '免费帮一作博后解决肠黏膜自发荧光并试染 2 例切片，促成毛仁/冯瑞老师直签 4.8 万测试包。',
      },
      {
        id: 'e-ibd-p2',
        source: 'node-mao',
        target: 'node-ibd-sec',
        edgeType: 'decision_chain',
        label: '破局第2跳：标本库零损耗立项论证',
        detail: '凭高分修回数据联合标本库主管起草《重点专科空间病理与全光谱平台可行性论证报告》。',
      },
      {
        id: 'e-ibd-p3',
        source: 'node-ibd-sec',
        target: 'node-chen',
        edgeType: 'decision_chain',
        label: '破局第3跳：重点专科修购专项拍板',
        detail: '陈旻湖教授在专科建设会上签批通过。',
      },
      {
        id: 'e-immuno-mao',
        source: 'ext-ibd-immuno',
        target: 'node-mao',
        edgeType: 'external_collab',
        label: '黏膜免疫 Panel 方法学共建',
        detail: '基础医学院免疫所成熟的流式与空间共染 Panel 可直接迁移至消化科临床队列。',
      },
      {
        id: 'e-comp-ibd',
        source: 'comp-ibd-ngs',
        target: 'node-ibd-postdoc',
        edgeType: 'competitor_risk',
        label: '竞品风险：单细胞测序分流经费',
        detail: '用“无需酶解打碎内镜活检样本、直接用石蜡切片看原位空间距离”反制单细胞外包分流。',
      },
    ],
  },
];

export const DecisionChainTopologyGraph: React.FC = () => {
  const { confirmedCustomer } = useCustomerContext();

  const allDatasets = useMemo(() => {
    if (!confirmedCustomer) return TOPOLOGY_DATASETS;
    const dynamicDs = buildConfirmedCustomerTopology(confirmedCustomer);
    return [dynamicDs, ...TOPOLOGY_DATASETS];
  }, [confirmedCustomer]);

  const [activeDatasetId, setActiveDatasetId] = useState<string>(allDatasets[0].id);
  const [highlightMode, setHighlightMode] = useState<'all' | 'decision_chain' | 'external' | 'competitor'>('decision_chain');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const currentDataset =
    allDatasets.find((d) => d.id === activeDatasetId) || allDatasets[0];

  const [selectedNodeId, setSelectedNodeId] = useState<string>(currentDataset.nodes[1].id);
  const [selectedEdge, setSelectedEdge] = useState<TopologyEdge | null>(null);

  useEffect(() => {
    if (confirmedCustomer) {
      const targetId = `confirmed-${confirmedCustomer.id}`;
      setActiveDatasetId(targetId);
      const isL1Target =
        confirmedCustomer.scholarName.includes('尹芝南') ||
        confirmedCustomer.scholarName.includes('刘敏') ||
        confirmedCustomer.scholarName.includes('陈旻湖') ||
        confirmedCustomer.scholarName.includes('匡铭');
      setSelectedNodeId(isL1Target ? 'conf-l1' : 'conf-l2');
      setSelectedEdge(null);
    }
  }, [
    confirmedCustomer?.id,
    confirmedCustomer?.scholarName,
    confirmedCustomer?.institution,
    confirmedCustomer?.department,
  ]);

  const selectedNode =
    currentDataset.nodes.find((n) => n.id === selectedNodeId) || currentDataset.nodes[0];

  const handleSelectDataset = (id: string) => {
    setActiveDatasetId(id);
    const nextDs = allDatasets.find((d) => d.id === id) || allDatasets[0];
    setSelectedNodeId(nextDs.nodes[1]?.id || nextDs.nodes[0].id);
    setSelectedEdge(null);
  };

  const handleManualSyncCurrentCustomer = () => {
    if (!confirmedCustomer) return;
    const targetId = `confirmed-${confirmedCustomer.id}`;
    setActiveDatasetId(targetId);
    const isL1Target =
      confirmedCustomer.scholarName.includes('尹芝南') ||
      confirmedCustomer.scholarName.includes('刘敏') ||
      confirmedCustomer.scholarName.includes('陈旻湖') ||
      confirmedCustomer.scholarName.includes('匡铭');
    setSelectedNodeId(isL1Target ? 'conf-l1' : 'conf-l2');
    setSelectedEdge(null);
    setHighlightMode('decision_chain');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedScript(text);
    setTimeout(() => setCopiedScript(null), 1800);
  };

  const getNodeStyle = (category: NodeCategory, isSelected: boolean) => {
    switch (category) {
      case 'internal_leader':
        return {
          bg: '#064e3b',
          border: isSelected ? '#fbbf24' : '#10b981',
          badgeBg: '#065f46',
          badgeText: '#6ee7b7',
        };
      case 'internal_subpi':
        return {
          bg: '#451a03',
          border: isSelected ? '#fde047' : '#f59e0b',
          badgeBg: '#78350f',
          badgeText: '#fcd34d',
        };
      case 'internal_gatekeeper':
        return {
          bg: '#0c4a6e',
          border: isSelected ? '#fbbf24' : '#38bdf8',
          badgeBg: '#075985',
          badgeText: '#7dd3fc',
        };
      case 'internal_exec':
        return {
          bg: '#1e1b4b',
          border: isSelected ? '#fbbf24' : '#818cf8',
          badgeBg: '#312e81',
          badgeText: '#a5b4fc',
        };
      case 'external_institute':
        return {
          bg: '#0f172a',
          border: isSelected ? '#fbbf24' : '#2dd4bf',
          badgeBg: '#134e4a',
          badgeText: '#5eead4',
        };
      case 'competitor':
        return {
          bg: '#4c0519',
          border: isSelected ? '#fbbf24' : '#f43f5e',
          badgeBg: '#881337',
          badgeText: '#fda4af',
        };
    }
  };

  const isEdgeHighlighted = (edge: TopologyEdge) => {
    if (highlightMode === 'all') return true;
    if (highlightMode === 'decision_chain') return edge.edgeType === 'decision_chain' || edge.edgeType === 'hierarchy';
    if (highlightMode === 'external') return edge.edgeType === 'external_collab';
    if (highlightMode === 'competitor') return edge.edgeType === 'competitor_risk';
    return true;
  };

  const getEdgeColor = (edge: TopologyEdge) => {
    if (edge.edgeType === 'decision_chain') return '#f59e0b'; // Amber gold for optimal path
    if (edge.edgeType === 'external_collab') return '#2dd4bf'; // Teal for external institutes
    if (edge.edgeType === 'competitor_risk') return '#f43f5e'; // Rose red for competitors
    return '#64748b'; // Slate for formal administrative hierarchy
  };

  return (
    <div className="space-y-3.5">
      {/* Top Bar: Unit Preset Switcher + Highlight Mode Filters */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Network className="w-4 h-4 shrink-0" />
              <span>交互式关键决策链拓扑图 · 内部四级权力网 × 外部合作院所 × 竞争对手渗透雷达</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{currentDataset.overviewAbstract}</p>
          </div>

          {/* Preset Customer Unit Switcher + Manual Sync Trigger */}
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            {confirmedCustomer && (
              <button
                type="button"
                onClick={handleManualSyncCurrentCustomer}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-950/50 cursor-pointer transition-all"
                title="立即按当前锁定客户重新运行决策链推演"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>手动运行 / 同步「{confirmedCustomer.scholarName}」拓扑</span>
              </button>
            )}
            {allDatasets.map((ds) => {
              const active = ds.id === activeDatasetId;
              return (
                <button
                  key={ds.id}
                  type="button"
                  onClick={() => handleSelectDataset(ds.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  {ds.unitName.split('（')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Filter Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1">点击高亮拓扑链路：</span>
            <button
              type="button"
              onClick={() => setHighlightMode('decision_chain')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border cursor-pointer transition-all ${
                highlightMode === 'decision_chain'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>⭐ 内部最优破局决策链 (L4➔L2➔L3➔L1)</span>
            </button>
            <button
              type="button"
              onClick={() => setHighlightMode('external')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border cursor-pointer transition-all ${
                highlightMode === 'external'
                  ? 'bg-teal-500/20 border-teal-400 text-teal-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              <span>🏛️ 外部科研院所合著与背书链</span>
            </button>
            <button
              type="button"
              onClick={() => setHighlightMode('competitor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border cursor-pointer transition-all ${
                highlightMode === 'competitor'
                  ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>⚠️ 潜在竞争对手渗透风险点</span>
            </button>
            <button
              type="button"
              onClick={() => setHighlightMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                highlightMode === 'all'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              全部显示
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setZoomScale((s) => Math.min(1.3, Number((s + 0.1).toFixed(2))))}
              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
              title="放大"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomScale((s) => Math.max(0.8, Number((s - 0.1).toFixed(2))))}
              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
              title="缩小"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomScale(1)}
              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
              title="重置视图"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 12-Col Interactive Topology + Node Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left 8 Cols: Interactive SVG Topology Canvas */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between overflow-hidden relative">
          {/* 3-Column Zone Header Banner inside Canvas */}
          <div className="grid grid-cols-3 gap-2 mb-2 text-center">
            <div className="py-1.5 px-2 rounded-lg bg-teal-950/30 border border-teal-500/30 text-[11px] font-mono text-teal-300">
              🏛️ 外部科研院所 & 合著同盟
            </div>
            <div className="py-1.5 px-2 rounded-lg bg-amber-950/30 border border-amber-500/40 text-[11px] font-mono text-amber-300 font-bold">
              🏥 客户单位内部四级人物层级 (L1-L4)
            </div>
            <div className="py-1.5 px-2 rounded-lg bg-rose-950/30 border border-rose-500/30 text-[11px] font-mono text-rose-300">
              ⚠️ 潜在竞争对手 & 友商防线
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox="0 0 940 435"
              className="w-full h-[380px] sm:h-[420px] select-none"
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: 'center center',
                transition: 'transform 200ms ease',
              }}
            >
              <defs>
                <marker
                  id="topo-arrow-amber"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                </marker>
                <marker
                  id="topo-arrow-teal"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#2dd4bf" />
                </marker>
                <marker
                  id="topo-arrow-rose"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                </marker>
                <marker
                  id="topo-arrow-slate"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                </marker>
              </defs>

              {/* Background Zone Boxes */}
              <rect
                x="15"
                y="10"
                width="205"
                height="410"
                rx="14"
                fill="#042f2e"
                fillOpacity="0.16"
                stroke="#14b8a6"
                strokeOpacity="0.25"
                strokeDasharray="4 4"
              />
              <rect
                x="235"
                y="10"
                width="470"
                height="410"
                rx="16"
                fill="#0f172a"
                fillOpacity="0.65"
                stroke="#f59e0b"
                strokeOpacity="0.35"
              />
              <rect
                x="720"
                y="10"
                width="205"
                height="410"
                rx="14"
                fill="#4c0519"
                fillOpacity="0.15"
                stroke="#f43f5e"
                strokeOpacity="0.25"
                strokeDasharray="4 4"
              />

              {/* Internal Hierarchy Level Guide Lines */}
              <line x1="250" y1="135" x2="690" y2="135" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="250" y1="285" x2="690" y2="285" stroke="#1e293b" strokeDasharray="3 3" />
              <text x="255" y="32" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                L1 院/科拍板层 (末位通讯)
              </text>
              <text x="255" y="155" fill="#fbbf24" fontSize="10" fontFamily="monospace">
                L2 子课题实权二当家 (共同通讯) & L3 科研秘书/平台把关
              </text>
              <text x="255" y="305" fill="#a5b4fc" fontSize="10" fontFamily="monospace">
                L4 一线实验执行层 (一作专职博后 / 跨科合著者)
              </text>

              {/* Render Edges */}
              {currentDataset.edges.map((edge) => {
                const sNode = currentDataset.nodes.find((n) => n.id === edge.source);
                const tNode = currentDataset.nodes.find((n) => n.id === edge.target);
                if (!sNode || !tNode) return null;

                const active = isEdgeHighlighted(edge);
                const color = getEdgeColor(edge);
                const midX = (sNode.x + tNode.x) / 2;
                const midY = (sNode.y + tNode.y) / 2;

                const markerId =
                  edge.edgeType === 'decision_chain'
                    ? 'url(#topo-arrow-amber)'
                    : edge.edgeType === 'external_collab'
                    ? 'url(#topo-arrow-teal)'
                    : edge.edgeType === 'competitor_risk'
                    ? 'url(#topo-arrow-rose)'
                    : 'url(#topo-arrow-slate)';

                return (
                  <g
                    key={edge.id}
                    onClick={() => setSelectedEdge(edge)}
                    className="cursor-pointer"
                    style={{ opacity: active ? 1 : 0.18, transition: 'opacity 200ms' }}
                  >
                    <line
                      x1={sNode.x}
                      y1={sNode.y}
                      x2={tNode.x}
                      y2={tNode.y}
                      stroke={color}
                      strokeWidth={edge.edgeType === 'decision_chain' ? 3 : 2}
                      strokeDasharray={
                        edge.edgeType === 'competitor_risk'
                          ? '5 4'
                          : edge.edgeType === 'hierarchy'
                          ? '3 3'
                          : 'none'
                      }
                      markerEnd={markerId}
                    />
                    <rect
                      x={midX - 68}
                      y={midY - 10}
                      width="136"
                      height="19"
                      rx="5"
                      fill="#020617"
                      stroke={color}
                      strokeWidth="1"
                    />
                    <text
                      x={midX}
                      y={midY + 3}
                      textAnchor="middle"
                      fill={color}
                      fontSize="9.5"
                      fontWeight="600"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {/* Render Nodes */}
              {currentDataset.nodes.map((node) => {
                const isSelected = node.id === selectedNode.id;
                const style = getNodeStyle(node.category, isSelected);
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => {
                      setSelectedNodeId(node.id);
                      setSelectedEdge(null);
                    }}
                    className="cursor-pointer"
                  >
                    {/* Outer Glow Halo if selected */}
                    {isSelected && (
                      <rect
                        x="-94"
                        y="-36"
                        width="188"
                        height="72"
                        rx="14"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                      />
                    )}

                    {/* Card Body */}
                    <rect
                      x="-88"
                      y="-30"
                      width="176"
                      height="60"
                      rx="11"
                      fill={style.bg}
                      stroke={style.border}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />

                    {/* Top Unit/Tier Badge */}
                    <rect
                      x="-80"
                      y="-24"
                      width="160"
                      height="15"
                      rx="4"
                      fill={style.badgeBg}
                    />
                    <text
                      x="0"
                      y="-13.5"
                      textAnchor="middle"
                      fill={style.badgeText}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {node.unitLabel}
                    </text>

                    {/* Person / Org Name */}
                    <text
                      x="0"
                      y="5"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {node.name}
                    </text>

                    {/* Role & Budget Subtitle */}
                    <text
                      x="0"
                      y="20"
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="9.5"
                    >
                      {node.roleTitle.slice(0, 16)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Chain Recommendation Strip */}
          <div className="mt-2 p-2.5 rounded-xl bg-amber-950/25 border border-amber-500/30 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-amber-200 font-semibold truncate">
                {currentDataset.recommendedChainSummary}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 shrink-0">
              点击图中任意人物/连线查看详情
            </span>
          </div>
        </div>

        {/* Right 4 Cols: Selected Node / Edge Deep Inspector Panel */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-3">
            {selectedEdge ? (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-300 font-bold">
                    当前选中关系连线解读
                  </span>
                  <button
                    onClick={() => setSelectedEdge(null)}
                    className="text-[11px] text-slate-400 hover:text-white cursor-pointer"
                  >
                    返回节点 ✕
                  </button>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white">{selectedEdge.label}</div>
                <p className="text-xs text-slate-200 leading-relaxed">{selectedEdge.detail}</p>
              </div>
            ) : null}

            {/* Selected Node Header */}
            <div className="border-b border-slate-800 pb-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
                  {selectedNode.tierLabel}
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  {selectedNode.budgetAuthority}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1.5">{selectedNode.name}</h3>
              <p className="text-xs text-slate-400">{selectedNode.roleTitle}</p>
            </div>

            {/* Role & Influence in Topology */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90">
                <div className="text-[11px] font-bold text-cyan-400 mb-0.5">
                  在决策链中的真实定位与权责
                </div>
                <p className="text-slate-200 leading-relaxed">{selectedNode.summary}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30">
                <div className="text-[11px] font-bold text-rose-300 flex items-center gap-1 mb-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>潜在竞争对手关联与防线态势</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{selectedNode.competitorExposure}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="text-[11px] font-bold text-emerald-300 mb-0.5">
                  销售关键决策链破局动作
                </div>
                <p className="text-slate-200 leading-relaxed">{selectedNode.actionStrategy}</p>
              </div>
            </div>
          </div>

          {/* Copyable Verbatim Script for this Node */}
          <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">针对该节点的切入参考话术</span>
              <button
                type="button"
                onClick={() => handleCopy(selectedNode.greetingScript)}
                className="min-h-[28px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
              >
                {copiedScript === selectedNode.greetingScript ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-amber-400" />
                    <span>复制话术</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed line-clamp-3">
              {selectedNode.greetingScript}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
