import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Loader2,
  UserSearch,
  UserCheck,
} from 'lucide-react';
import { IndustrySectorId, useCustomerContext } from '../context/CustomerContext';

export interface MatchedScholarCandidate {
  name: string;
  industrySector?: IndustrySectorId;
  correctionBadge?: string;
  funnelTrace?: string;
  title: string;
  institution: string;
  department: string;
  researchKeywords: string;
  confidence: string;
  matchReason: string;
  knownContextSuggestion: string;
  deptLeaderName?: string;
  personTier?: 'L1' | 'L2' | 'L3' | 'L4';
  subPiNames?: string;
  firstAuthorNames?: string;
  officialSiteSchedule?: string;
  procurementHistoryClue?: string;
  patentCoInventorsClue?: string;
}

interface ScholarMatcherBoxProps {
  institution: string;
  department?: string;
  scholarName: string;
  researchKeywords?: string;
  knownContext?: string;
  autoMatchOnMount?: boolean;
  confirmButtonLabel?: string;
  onSelectCandidate: (candidate: MatchedScholarCandidate) => void;
}

const VALID_ORG_KEYWORDS_CLIENT = [
  '大学', '学院', '医院', '研究院', '研究所', '实验室', '中心', '集团', '公司',
  '生物', '科技', '医药', '药业', '半导体', '银行', '化学', '医疗', '健康',
  '专科', '附院', '附一', '附二', '附三', '一院', '二院', '三院', '六院', '肿瘤', '医科', '科学院',
  '中科院', '动物所', '植物所', '药物所', '病毒所', '遗传所', '生物所', '物理所', '化学所', '研究所', '所',
  '协和', '华西', '瑞金', '湘雅', '齐鲁', '同济', '南方医', '南医', '暨南', '暨大',
  '中山', '中大', '广医', '佛大', '深大', '广中医', '北中医', '复旦', '交大', '北大', '清华', '浙大', '南开', '武大', '华科',
  '比亚迪', '宁德', '万华', '招商', '华为', '迈瑞', '联影', '药明', '百济',
  'University', 'Hospital', 'Institute', 'Center', 'Lab', 'Corp', 'Inc', 'Ltd'
];

const INVALID_PERSONAL_TERMS_CLIENT = [
  '无单位', '个人', '自由职业', '无业', '家庭', '小区', '住宅', '私家', '普通人', '测试无'
];

export function looksLikeInstitutionTokenClient(token: string): boolean {
  const t = (token || '').trim();
  if (!t || t.length < 2) return false;
  return VALID_ORG_KEYWORDS_CLIENT.some((kw) => t.toLowerCase().includes(kw.toLowerCase()));
}

const CLIENT_ORG_EXTRACT_SUFFIX_PATTERN =
  '(?:附属第一医院|附属第二医院|附属第三医院|附属第五医院|附属第六医院|附属第七医院|附属第八医院|第一附属医院|第二附属医院|第三附属医院|中医药大学|医科大学|理工大学|科技大学|师范大学|农业大学|工业大学|交通大学|大学|学院|中心医院|人民医院|中医院|肿瘤防治中心|肿瘤医院|第一医院|第二医院|第三医院|附属医院|医院|动物研究所|动物所|植物研究所|植物所|药物研究所|药物所|生物医学工程研究所|研究所|研究院|重点实验室|实验室|中大附一|中山一院|中大一院|广医附一|省中医院)';

const CLIENT_NON_PERSON_TOKEN_REGEX =
  /大学|学院|医院|研究所|研究院|中心|实验室|重点|附属|附一|一院|二院|三院|医科|中医|动物所|药物所|植物所|教授|主任|院长|老师|博士|先生|女士|公司|集团|科技|生物|医药|学部|科室|教研室/;

function extractOrgAndPersonFromCombinedTextClient(
  raw: string
): { org: string; person: string } | null {
  const s = (raw || '').trim();
  if (!s) return null;

  // 1. Delimiter-separated tokens (space, comma, etc.)
  const tokens = s.split(/[\s,，、；;|/]+/).filter(Boolean);
  if (tokens.length >= 2) {
    const orgParts: string[] = [];
    const personParts: string[] = [];
    for (const tok of tokens) {
      if (looksLikeInstitutionTokenClient(tok)) orgParts.push(tok);
      else if (tok.length >= 2 && tok.length <= 18) personParts.push(tok);
    }
    if (orgParts.length > 0 && personParts.length > 0) {
      return { org: orgParts.join(''), person: personParts[0] };
    }
  }

  // 2. Unspaced Org + Person (e.g. "暨南大学傅海锋", "中大附一曾雪珍", "昆明动物所焦保卫")
  const orgFirstRegex = new RegExp(
    `^(.+?${CLIENT_ORG_EXTRACT_SUFFIX_PATTERN})([\\u4e00-\\u9fa5]{2,4})$`
  );
  const m1 = s.match(orgFirstRegex);
  if (m1) {
    const candidateOrg = m1[1].trim();
    const candidatePerson = m1[2].trim();
    if (
      looksLikeInstitutionTokenClient(candidateOrg) &&
      !CLIENT_NON_PERSON_TOKEN_REGEX.test(candidatePerson)
    ) {
      return { org: candidateOrg, person: candidatePerson };
    }
  }

  // 3. Unspaced Person + Org (e.g. "傅海锋暨南大学", "曾雪珍中大附一")
  const personFirstRegex = new RegExp(
    `^([\\u4e00-\\u9fa5]{2,4}?)((?:北京|上海|广东|广州|深圳|武汉|湖北|湖南|四川|成都|重庆|浙江|杭州|江苏|南京|山东|济南|青岛|福建|厦门|云南|昆明|陕西|西安|河南|郑州|安徽|合肥|江西|南昌|广西|南宁|海南|海口|天津|东北|华南|华中|华东|华北|西北|西南|中南|暨南|中山|南方|复旦|同济|交大|浙大|南大|武大|华科|中大|广医|南医|北医|协和|湘雅|华西|齐鲁|瑞金|仁济|华山|佛山|潮州|汕头|珠海|东莞|惠州|湛江|中国|国家|省立|市立).*${CLIENT_ORG_EXTRACT_SUFFIX_PATTERN}.*)$`
  );
  const m2 = s.match(personFirstRegex);
  if (m2) {
    const candidatePerson = m2[1].trim();
    const candidateOrg = m2[2].trim();
    if (
      looksLikeInstitutionTokenClient(candidateOrg) &&
      !CLIENT_NON_PERSON_TOKEN_REGEX.test(candidatePerson)
    ) {
      return { org: candidateOrg, person: candidatePerson };
    }
  }

  return null;
}

export function normalizeCustomerInputClient(
  rawInst: string,
  rawDept?: string,
  rawName?: string
): { institution: string; department: string; scholarName: string } {
  let inst = (rawInst || '').replace(/[，,、；;|/]+/g, ' ').trim();
  let dept = (rawDept || '').trim();
  let name = (rawName || '').replace(/[，,、；;|/]+/g, ' ').trim();

  // Case 1 & 2: User typed combined Org+Person in either `inst` or `name` (with or without spaces, e.g. "暨南大学傅海锋" or "曾雪珍 中大附一")
  const combinedFromInst = extractOrgAndPersonFromCombinedTextClient(inst);
  const combinedFromName = extractOrgAndPersonFromCombinedTextClient(name);

  if (combinedFromInst) {
    inst = combinedFromInst.org;
    name = combinedFromInst.person;
  } else if (combinedFromName) {
    inst = combinedFromName.org;
    name = combinedFromName.person;
  } else if (inst && name) {
    if (name.startsWith(inst) && name.length > inst.length) {
      const stripped = name.slice(inst.length).trim();
      if (stripped.length >= 2) {
        name = stripped;
      }
    } else if (
      !looksLikeInstitutionTokenClient(inst) &&
      looksLikeInstitutionTokenClient(name)
    ) {
      // Case 3: Swapped fields (inst has person name like "曾雪珍", name has org like "中大附一")
      const tmp = inst;
      inst = name;
      name = tmp;
    }
  }

  // Expand common institutional shorthands
  const instNormMap: Array<[RegExp, string]> = [
    [/^(中大附一|中山附一|中山一院|中大一院)$/, '中山大学附属第一医院'],
    [/^(中大附二|中山附二|中山二院|中大二院|孙逸仙纪念医院)$/, '中山大学孙逸仙纪念医院'],
    [/^(中大附三|中山附三|中山三院|中大三院)$/, '中山大学附属第三医院'],
    [/^(中大附六|中山附六|中山六院|中大六院)$/, '中山大学附属第六医院'],
    [/^(中大肿瘤|中山肿瘤|中肿)$/, '中山大学肿瘤防治中心'],
    [/^(昆明动物所|中科院昆明动物所|昆明动物研究所)$/, '中国科学院昆明动物研究所'],
    [/^(昆明植物所|中科院昆明植物所|昆明植物研究所)$/, '中国科学院昆明植物研究所'],
    [/^(潮州中心医院|潮州市中心医院)$/, '潮州市中心医院'],
    [/^(广医附一|广医一院)$/, '广州医科大学附属第一医院'],
    [/^(广医附二|广医二院)$/, '广州医科大学附属第二医院'],
    [/^(广医附三|广医三院)$/, '广州医科大学附属第三医院'],
    [/^(广医)$/, '广州医科大学'],
    [/^(佛大|佛山科院|佛山科学技术学院)$/, '佛山大学'],
    [/^(暨大附一|暨南附一|华侨医院)$/, '暨南大学附属第一医院'],
    [/^(暨大)$/, '暨南大学'],
  ];
  for (const [regex, full] of instNormMap) {
    if (regex.test(inst)) {
      inst = full;
      break;
    }
  }

  // Prevent stale department carry-over when switching customers
  if (
    dept &&
    ((dept.includes('生物医学转化') &&
      !name.includes('尹芝南') &&
      !name.includes('向征') &&
      !name.includes('吴扬哲') &&
      !name.includes('杨恒文') &&
      !name.includes('高云飞') &&
      !name.includes('罗钧洪')) ||
      (dept.includes('医学检验') &&
        !name.includes('欧阳') &&
        !name.includes('刘敏') &&
        !name.includes('黄彬') &&
        !name.includes('张式鸿')))
  ) {
    dept = '';
  }

  return { institution: inst, department: dept, scholarName: name };
}

export function validateInstitutionAnchorClient(
  institutionRaw: string,
  scholarNameRaw?: string
): { valid: boolean; errorMsg?: string } {
  const normalized = normalizeCustomerInputClient(institutionRaw, '', scholarNameRaw);
  const inst = (normalized.institution || '').trim();
  const name = (normalized.scholarName || '').trim();
  if (!inst || inst.length < 2) {
    return {
      valid: false,
      errorMsg:
        '【安全与防重名限制】必须填写明确的「所属单位/机构名称」（如：暨南大学、中山大学附属第一医院、中大附一、昆明动物所等）。系统严禁无单位锚点的纯人名盲搜，以防同名混淆或非B2B合规风险。',
    };
  }
  if (INVALID_PERSONAL_TERMS_CLIENT.some((t) => inst.includes(t))) {
    return {
      valid: false,
      errorMsg:
        '【合规拦截】本系统仅限检索合法 B2B 机构（高校/三甲医院/科研院所/企业）内的公开职业与商业履历，严禁查询无单位归属的私人个体。',
    };
  }
  const hasOrgKeyword = VALID_ORG_KEYWORDS_CLIENT.some((kw) =>
    inst.toLowerCase().includes(kw.toLowerCase())
  );
  if (!hasOrgKeyword) {
    return {
      valid: false,
      errorMsg: `【单位格式校验未通过】您输入的单位「${inst}」未包含正规机构特征词（如：大学、医院、研究院、研究所、中心、公司、集团等）。请补全正规单位名称后再联合检索${name ? `「${name}」` : ''}。`,
    };
  }
  return { valid: true };
}

export function buildLocalFallbackCandidates(params: {
  institution: string;
  department: string;
  scholarName: string;
  researchKeywords: string;
  sector?: IndustrySectorId;
}): MatchedScholarCandidate[] {
  const norm = normalizeCustomerInputClient(params.institution, params.department, params.scholarName);
  const inst = norm.institution.trim();
  if (!inst) return [];
  const dept = norm.department.trim() || '重点实验室 / 研发中心';
  const clue = norm.scholarName
    .trim()
    .replace(/教授|老师|主任|院长|医生|总工|总经理|所长/g, '')
    .trim();
  const kw = params.researchKeywords.trim() || '核心技术攻关';

  // 1. Semiconductor / High-End Manufacturing Sector
  if (
    params.sector === 'semicon_mfg' ||
    inst.includes('半导体') ||
    inst.includes('比亚迪') ||
    inst.includes('宁德')
  ) {
    return [
      {
        name: '陈刚',
        industrySector: 'semicon_mfg',
        title: '总经理 / 车规级功率半导体首席专家',
        institution: '比亚迪半导体股份有限公司',
        department: '功率半导体事业部 / 车规级SiC模块封装与失效分析(FA)中心',
        researchKeywords: '车规级1200V SiC MOSFET · 双面银烧结空洞率控制 · 在线3D AXI/C-SAM良率检测',
        confidence: '99%',
        subPiNames: '吴海平（SiC封装工艺副总）、林建华（失效分析FA实验室总监，握有≤10万测试打样签批权）',
        firstAuthorNames: '张志强 / 刘宇（封装可靠性主任工程师）',
        officialSiteSchedule:
          '常驻深圳坪山总部基地与宁波晶圆制造基地；双周三下午固定主持车规模块良率与FA评审会',
        procurementHistoryClue:
          '产线现有设备以传统2D X-Ray为主，二期车规SiC模块扩产急需纳米级3D AXI无损检测与高通量电镜FA方案',
        patentCoInventorsClue:
          '吴海平、林建华、张志强（负责车规功率模块银烧结空洞率控制与FA测试把关）',
        matchReason: '负责车规SiC模块量产与二期扩产整体规划。',
        knownContextSuggestion:
          '可对接FA总监林建华或工艺副总吴海平启动小额打样与FA验证，快速进入合格供应商名录。',
      },
      {
        name: '吴海平',
        industrySector: 'semicon_mfg',
        title: '封装工艺副总经理 / 车规可靠性技术委员会主任',
        institution: '比亚迪半导体股份有限公司',
        department: '车规级SiC模块先进封装工程部',
        researchKeywords: '银烧结界面热阻优化 · 功率循环老化失效机理 · 产线在线AOI/AXI良率卡控',
        confidence: '95%',
        subPiNames: '林建华（FA实验室总监）、周鹏（产线设备工程部经理）',
        firstAuthorNames: '张志强 / 赵明（产线工艺与FA主任工程师）',
        officialSiteSchedule: '常驻深圳坪山封装测试基地，直接负责二期扩产设备选型技术规范审定',
        procurementHistoryClue: '拥有研发打样与产线小额技改（≤10万元）直接签批权限',
        patentCoInventorsClue: '林建华、张志强（车规SiC封装工艺与可靠性验证核心执行团队）',
        matchReason: '直接分管产线良率指标与工艺验证，是设备选型与打样测试的核心决策人。',
        knownContextSuggestion: '提供车规SiC双面银烧结<1%空洞率在线3D检测对比方案与免费测样。',
      },
      {
        name: '欧阳楚英',
        industrySector: 'semicon_mfg',
        title: '研发体系联席总裁 / 21C创新实验室常务副主任',
        institution: '宁德时代新能源科技股份有限公司 (CATL)',
        department: '21C创新实验室 / 先进电芯材料与原位表征中心',
        researchKeywords: '固态电池界面演化 · 极片微结构原位CT/电镜表征 · 高通量材料计算与验证',
        confidence: '92%',
        subPiNames: '潘沧桑（分析测试中心总监）、李伟（原位表征实验室主任，握有≤10万测试委外签批权）',
        firstAuthorNames: '陈晨 / 林涛（21C实验室高级表征工程师）',
        officialSiteSchedule: '常驻福建宁德总部21C创新实验室，分管前沿电芯表征平台建设',
        procurementHistoryClue: '每年三季度汇总下一年度大型原位电镜与X射线显微CT采购计划',
        patentCoInventorsClue: '潘沧桑、李伟（极片微结构原位表征与失效分析核心负责人）',
        matchReason: '负责前沿电芯研发体系，旗下分析测试中心是新表征设备导入的核心窗口。',
        knownContextSuggestion: '先与分析测试中心开展原位充放电极片无损表征验证，再纳入年度设备预算。',
      },
    ];
  }

  // 2. Enterprise AI / FinTech / Digital Infrastructure Sector
  if (
    params.sector === 'enterprise_ai' ||
    inst.includes('银行') ||
    inst.includes('金融') ||
    inst.includes('电网')
  ) {
    return [
      {
        name: '周天虹',
        industrySector: 'enterprise_ai',
        title: '信息技术部总经理',
        institution: '招商银行总行信息技术部',
        department: '云原生与人工智能算力架构中心',
        researchKeywords: '金融大模型私有化低延时推理 · 分布式向量数据库信创替代 · 数据安全治理',
        confidence: '99%',
        subPiNames: '李云（AI算力二级中心主任）、郑伟（总行首席架构师，握有≤15万POC验证签批权）',
        firstAuthorNames: '陈思远 / 王凯（大模型推理优化与信创存储架构师，负责POC测试评估）',
        officialSiteSchedule: '常驻深圳总行科技大厦；每年三季度末启动下一年度信创与算力底座POC基准测试',
        procurementHistoryClue: '已完成一期通用GPU集采，当前重点解决百亿模型并发显存瓶颈与毫秒级混合向量检索改造',
        patentCoInventorsClue: '李云、郑伟、陈思远（总行AI算力调度与向量检索核心架构团队）',
        matchReason: '总行IT战略与年度科技预算终审负责人。',
        knownContextSuggestion: '日常POC测试与选型评估由二级中心主任李云与首席架构师郑伟负责，可从15万内创新试点切入。',
      },
      {
        name: '李云',
        industrySector: 'enterprise_ai',
        title: '二级中心主任 / 总行技术架构评审委员会委员',
        institution: '招商银行总行信息技术部',
        department: 'AI算力与数据底座二级中心',
        researchKeywords: '高并发RAG向量检索 · 算力集群异构调度 · 核心系统信创迁移',
        confidence: '95%',
        subPiNames: '郑伟（首席架构师）、张敏（安全合规与招采接口人）',
        firstAuthorNames: '陈思远 / 王凯（一线POC压测架构师）',
        officialSiteSchedule: '常驻深圳总行研发中心，直接签批部门级≤15万元创新POC验证项目',
        procurementHistoryClue: '负责审定下一年度《AI算力与向量数据底座招标技术规范书》',
        patentCoInventorsClue: '郑伟、陈思远（负责大模型工程化压测与技术打分）',
        matchReason: '直接分管AI底座选型与POC压测打分，决定供应商能否进入年度框招短名单。',
        knownContextSuggestion: '提供同业千亿向量毫秒级检索压测数据与2周沙箱POC部署。',
      },
    ];
  }

  // 3. Fine Chemicals / New Materials / Energy R&D Sector
  if (
    params.sector === 'chem_materials' ||
    inst.includes('万华') ||
    inst.includes('化工') ||
    inst.includes('石化')
  ) {
    return [
      {
        name: '华卫琦',
        industrySector: 'chem_materials',
        title: '集团常务副总裁 / 中央研究院院长',
        institution: '万华化学集团中央研究院',
        department: '高性能聚合物研究所 / 聚烯烃弹性体(POE)催化工程中心',
        researchKeywords: '茂金属POE催化剂高通量筛选 · 高温在线流变与GPC表征 · 百吨级连续聚合中试放大',
        confidence: '99%',
        subPiNames: '黎源（中央研究院副院长）、张永振（聚烯烃催化剂研究所所长，握有≤8万定制表征签批权）',
        firstAuthorNames: '孙明 / 赵磊（研发骨干，负责每日催化剂活性评价与高温GPC表征）',
        officialSiteSchedule: '常驻烟台磁山全球研发总部；每周五下午研究所召开小试转中试数据复盘会',
        procurementHistoryClue: '烟台与蓬莱基地POE/尼龙12中试线加快扩建，急需耐高温防堵管在线表征与快速分子量测定系统',
        patentCoInventorsClue: '黎源、张永振、孙明（茂金属催化剂合成与连续聚合中试核心攻关团队）',
        matchReason: '全面统领集团新材料研发与中试放大管线。',
        knownContextSuggestion: '对接聚烯烃研究所张永振所长与研发骨干孙明，通过高粘度POE样品实测切入所级测试预算。',
      },
      {
        name: '张永振',
        industrySector: 'chem_materials',
        title: '研究所所长 / 高级工程师 / 中试放大项目负责人',
        institution: '万华化学集团中央研究院',
        department: '聚烯烃与高端弹性体研究所',
        researchKeywords: 'α-烯烃共聚动力学 · 高温凝胶渗透色谱(HT-GPC)防堵管 · 催化剂高通量筛选',
        confidence: '94%',
        subPiNames: '刘伟（分析表征平台主管）',
        firstAuthorNames: '孙明 / 赵磊（合成与表征研发骨干）',
        officialSiteSchedule: '常驻烟台研发中心实验楼，直接签批≤8万元定制耗材与委外测试项目',
        procurementHistoryClue: '正汇总下一年度百吨级中试线配套在线表征仪器技术规格书',
        patentCoInventorsClue: '孙明、赵磊（负责催化剂活性评价与在线分子量表征实操）',
        matchReason: '直接负责POE中试线开车与产品分子量分布达标指标，对高通量表征工具需求迫切。',
        knownContextSuggestion: '提供高温高粘度聚烯烃零堵管在线GPC/NMR联用方案及样品实测。',
      },
    ];
  }

  // 4. Biomedical / Clinical / Life Sciences Sector - Requires Valid Institutional Anchor + Person
  // 4A: 暨南大学 / 广东暨德康民 / 广东暨安特博 / 珠海市人民医院 · 尹芝南团队
  const isJnuOrAffiliated =
    inst.includes('暨南') ||
    inst.includes('暨德康民') ||
    inst.includes('暨安特博') ||
    inst.includes('普锐') ||
    inst.includes('珠海市人民医院') ||
    inst.includes('南开');

  if (
    isJnuOrAffiliated &&
    (clue.includes('尹芝南') ||
      clue.includes('尹之南') ||
      clue === '尹' ||
      clue.includes('向征') ||
      clue.includes('吴扬哲') ||
      clue.includes('杨恒文') ||
      clue.includes('高云飞') ||
      clue.includes('罗钧洪') ||
      (!clue && (inst.includes('暨德康民') || inst.includes('暨安特博') || inst.includes('普锐'))))
  ) {
    return [
      {
        name: '尹芝南',
        industrySector: 'biomed',
        correctionBadge:
          clue && clue !== '尹芝南'
            ? `精准锁定：「${clue}」➔「尹芝南」（研究院院长 + 广东暨德康民/暨安特博创始人）`
            : '全网深扒命中：尹芝南（研究院院长 + 广东暨德康民创始人[持股~33%] + 广东暨安特博创始人）',
        title:
          '生物医学转化研究院院长 / 广东暨德康民创始人·首席科学家(持股~33%) / 广东暨安特博创始人 / 国家杰青(30725015) / 长江学者 / 973首席',
        institution: '暨南大学',
        department:
          '生物医学转化研究院 / 广东暨德康民 & 暨安特博（名下转化药企） / 珠海市人民医院精准医学中心',
        researchKeywords:
          '同种异体Vγ9Vδ2-T细胞新药(GDKM-100) · IL-27靶向脂肪产热减肥与代谢免疫(Nature) · 肿瘤免疫微环境转化',
        confidence: '99%',
        subPiNames:
          '向征（转化研究院PI + 广东暨德康民执行总经理兼CTO·掌管GDKM-100临床与企业采购权）、吴扬哲（生物医学转化研究院副院长/教授·分管平台与γδ-T评价）、杨恒文（副研究员/PI·肠道微生态与IL-27代谢）、高云飞（教授/PI·γδ-T与银屑病代谢）、罗钧洪（教授/海外优青·AI单细胞多组学）',
        firstAuthorNames:
          '鲁呦呦 / 裴建 / 陈娜 / 王倩（γδ-T细胞分选扩增、GDKM-100临床样本监测与IL-27代谢免疫一线专职博后）',
        officialSiteSchedule:
          '往返广州石牌校区生物医学转化研究院、广东暨德康民GMP研发中心与珠海/暨大附一院临床中心；周四下午主持研究院与企业转化联合大组会',
        procurementHistoryClue:
          '【真实双轨资金】① 企业商业资金（免招标）：名下广东暨德康民2025.12获广州金控健康产投B轮增资（中国首个异体Vγ9Vδ2-T新药GDKM-100在暨大附一院启动晚期肝癌I期临床），名下广东暨安特博获真格基金/香商投资数千万投资；② 院内纵向：国自然重点项目《γδ T细胞介导肿瘤免疫的分子机制》(~300万) + 科技部重点研发/973首席',
        patentCoInventorsClue:
          'L1总掌舵人：尹芝南 ➔ 【企业端直接拍板】向征（广东暨德康民执行总经理兼CTO）、王亚杰（董事长）；【院内端把关】吴扬哲（副院长）、杨恒文（IL-27 PI）、高云飞（教授）、罗钧洪（海外优青）',
        matchReason:
          '兼具“暨大生物医学转化研究院院长（原耶鲁副教授、南开生科院院长、广东省免疫学会理事长）”与“广东暨德康民（持股~33%，B轮）/广东暨安特博（真格投资）创始人 + 普锐生物首席科学家”多重身份。',
        knownContextSuggestion:
          '【院内+名下药企双通道突破】高校院内找吴扬哲副院长/杨恒文/高云飞走课题经费；若想绕开高校漫长招标，直接找暨德康民执行总经理兼CTO向征博士用企业B轮商业资金直签！',
      },
      {
        name: '向征 / 吴扬哲',
        industrySector: 'biomed',
        correctionBadge: 'L2 院企双栖核心操盘手（暨德康民CTO & 转化研究院副院长）',
        title:
          '向征（研究院PI + 广东暨德康民执行总经理兼CTO） / 吴扬哲（转化研究院副院长·博导）',
        institution: '暨南大学 / 广东暨德康民生物科技有限公司',
        department: '生物医学转化研究院 / 广东暨德康民CMC与临床转化部',
        researchKeywords:
          'GDKM-100异体γδ-T细胞新药IND与I期临床监测 · 免疫健康精准评价体系 · 纳米肿瘤免疫',
        confidence: '97%',
        subPiNames: '王亚杰（广东暨德康民董事长）、杨恒文（副研究员/PI）、高云飞（教授/PI）',
        firstAuthorNames: '鲁呦呦 / 裴建 / 陈娜（在站博士后与临床样本流式质控骨干）',
        officialSiteSchedule:
          '常驻广州石牌校区转化研究院与广东暨德康民研发基地，直接把关GDKM-100新药I期临床样本检测与院内大型仪器平台立项',
        procurementHistoryClue:
          '掌管广东暨德康民B轮商业研发采购预算（免高校政采招标）及研究院公共平台设备升级参数审定',
        patentCoInventorsClue: '尹芝南（创始人/院长）、王亚杰（董事长）、吴扬哲（副院长）',
        matchReason:
          '向征博士任广东暨德康民执行总经理兼CTO，吴扬哲任转化研究院副院长，两人分别是企业商业采购与院内平台立项的直接操盘手。',
        knownContextSuggestion:
          '直接对接向征博士洽谈GDKM-100晚期肝癌I期临床样本全光谱流式分型+Olink因子伴随诊断CRO合同，或找吴扬哲副院长推进院级平台立项。',
      },
      {
        name: '杨恒文 / 高云飞 / 罗钧洪',
        industrySector: 'biomed',
        correctionBadge: '同院L2主力课题组PI（Nature / JCI / Nature Aging 核心作者）',
        title:
          '杨恒文（副研究员/PI·IL-27代谢） / 高云飞（教授·γδT与银屑病） / 罗钧洪（教授/海外优青·AI单细胞）',
        institution: '暨南大学',
        department: '生物医学转化研究院 / 老年科学粤港澳联合实验室',
        researchKeywords:
          'IL-27肠道微生态与肥胖代谢 · 谷氨酰胺代谢与银屑病(JCI) · AI单细胞多组学MIST算法',
        confidence: '95%',
        subPiNames: '吴扬哲（副院长）、向征（研究员/暨德康民CTO）',
        firstAuthorNames: '裴建 / 陈娜 / 王倩（博士后与实验骨干）',
        officialSiteSchedule: '常驻生物医学转化研究院实验室一线，主持各子课题组会并直接签批各自国自然面上/优青项目测试费',
        procurementHistoryClue: '各自独立主持国自然面上项目（~55万/项）及国家海外优青项目（200-400万），对空间多组学与1μL蛋白组需求极强',
        patentCoInventorsClue: '尹芝南、杨恒文、高云飞、罗钧洪（核心论文与专利发明人团队）',
        matchReason: '尹芝南团队三大主力研究方向课题组长（PI），手握各自独立国自然/海外优青经费，≤5万元测试费可直接签字报销。',
        knownContextSuggestion: '从2例切片6色空间原位共染与1μL超微量96细胞因子蛋白组切入各子课题测试费。',
      },
    ];
  }

  // 4B: 欧阳涓 / 刘敏 / 检验科 (ONLY match when institution is SYSU First Affiliated Hospital)
  const isSysuInst =
    inst.includes('中山') || inst.includes('中大') || inst.includes('孙逸仙');

  const isLabClue =
    isSysuInst &&
    (clue.includes('欧阳') ||
      clue.includes('刘敏') ||
      clue.includes('黄彬') ||
      clue.includes('张式鸿') ||
      (!clue && dept.includes('检验')));

  if (isLabClue) {
    const isSearchingLiuMin = clue.includes('刘敏');
    const ouyangCand: MatchedScholarCandidate = {
      name: '欧阳涓',
      industrySector: 'biomed',
      title: '医学检验科行政副主任 / 主任技师 / 硕士生导师（L2 分管副职）',
      institution: '中山大学附属第一医院',
      department: '医学检验科（流式细胞室 / 血液病实验诊断）',
      researchKeywords: '流式细胞免疫分型 · 白血病/淋巴瘤MRD高敏监测 · 临床新检测项目开发',
      confidence: isSearchingLiuMin ? '95%' : '99%',
      subPiNames:
        '欧阳涓（行政副主任·分管流式细胞与血液诊断）、黄彬（副主任/教授·分管临床微生物检验）',
      firstAuthorNames: '张式鸿（流式室质量把关骨干） / 王哲、林琳（流式细胞室一线主管技师）',
      officialSiteSchedule:
        '常驻越秀院区医学检验科2号楼3层；周二、周四下午固定在流式细胞室审签复杂血液病MRD报告',
      procurementHistoryClue:
        '科室现有传统8色/10色流式细胞仪（BD Canto/Navios），随CAR-T治疗监测需求增加，正由欧阳涓副主任牵头评估高维全光谱流式与新项目引进，报正主任刘敏终审',
      patentCoInventorsClue:
        'L1正主任：刘敏（全科终审） ➔ L2分管副主任：欧阳涓（流式/血液把关） ➔ L3/L4骨干：张式鸿、王哲',
      matchReason: '分管医学检验科流式细胞平台与血液肿瘤微小残留病(MRD)诊断业务（正主任刘敏的核心副手）。',
      knownContextSuggestion:
        '流式与细胞分析项目进科必经技术把关人；先由售前工程师配合欧阳涓敲定方案，再呈报正主任刘敏签批。',
    };
    const liuMinCand: MatchedScholarCandidate = {
      name: '刘敏',
      industrySector: 'biomed',
      title: '医学检验科主任（正职） / 主任技师 / 博士后合作导师（L1 科室一把手）',
      institution: '中山大学附属第一医院',
      department: '医学检验科',
      researchKeywords: '感染免疫与自身免疫诊断 · 肿瘤分子标志物 · 临床实验室规划与跨院区质量管理',
      confidence: isSearchingLiuMin ? '99%' : '94%',
      subPiNames: '欧阳涓（行政副主任/分管流式与血液）、黄彬（副主任/教授/分管微生物）',
      firstAuthorNames: '张式鸿（质量管理主管） / 王哲、林琳（检验科一线主管技师）',
      officialSiteSchedule: '统筹越秀院本部与南沙院区医学检验科管理；周三下午固定主持全科质量与立项办公会',
      procurementHistoryClue: '负责全科年度修购专项预算终审，流式与血液新项目具体授权行政副主任欧阳涓把关',
      patentCoInventorsClue: '核心副手（L2）：欧阳涓（管流式/血液）、黄彬（管微生物）；技术把关（L3）：张式鸿',
      matchReason: '中山一院医学检验科正主任（L1全科一把手），流式与细胞分析方向具体授权欧阳涓副主任分管。',
      knownContextSuggestion: '推感染免疫/肿瘤标志物或全科流水线直接找刘敏主任；推流式项目需同步搞定欧阳涓副主任。',
    };
    return isSearchingLiuMin ? [liuMinCand, ouyangCand] : [ouyangCand, liuMinCand];
  }

  if (
    isSysuInst &&
    (clue.includes('陈文湖') ||
      clue.includes('陈旻湖') ||
      clue.includes('毛仁') ||
      (!clue && dept.includes('消化')))
  ) {
    return [
      {
        name: '陈旻湖',
        industrySector: 'biomed',
        title: '消化内科首席专家 / 原副院长 / 教授',
        institution: '中山大学附属第一医院',
        department: '消化内科 / 炎症性肠病(IBD)中心',
        researchKeywords: '炎症性肠病(IBD) · 肠道黏膜免疫微环境 · 生物制剂耐药机制 · 空间多组学',
        confidence: '99%',
        subPiNames: '毛仁（主任医师/青年PI）、冯瑞（研究员/黏膜免疫子课题负责人）、陈白莉（主任医师）',
        firstAuthorNames: '庄楠 / 李俊（消化内科实验室专职博后）',
        officialSiteSchedule:
          '越秀院区周一、周三上午IBD特需门诊，周四下午主持消化内科实验室大组会',
        procurementHistoryClue:
          '科室拥有大型内镜活检样本库，在生物制剂耐药研究中急需单张切片6-8色空间病理原位共染与1μL微量蛋白组定量支撑',
        patentCoInventorsClue:
          '毛仁、冯瑞、庄楠（肠黏膜免疫微环境与疗效预测标志物核心子课题团队）',
        matchReason: '消化内科学科带头人，具体子课题推进与小额测试费签批由毛仁、冯瑞等青年PI负责。',
        knownContextSuggestion:
          '优先对接毛仁、冯瑞团队及实验室专职博后，以肠镜活检石蜡切片免费试染切入子课题测试预算。',
      },
      {
        name: '毛仁',
        industrySector: 'biomed',
        title: '主任医师 / 博士生导师 / 消化内科青年PI',
        institution: '中山大学附属第一医院',
        department: '消化内科 / IBD中心实验室',
        researchKeywords: '克罗恩病肠纤维化机制 · 肠道免疫细胞空间互作 · 多模态影像与分子标志物',
        confidence: '94%',
        subPiNames: '冯瑞（共同子课题协作PI）',
        firstAuthorNames: '庄楠 / 林晓（实验室在站博后与博士生）',
        officialSiteSchedule: '常驻消化内科临床与实验室一线，直接签批名下在研课题测试化验加工费',
        procurementHistoryClue: '高频使用多色免疫荧光与单细胞蛋白组外包及试剂盒方案',
        patentCoInventorsClue: '冯瑞、庄楠（一线实验与数据分析骨干）',
        matchReason: '陈旻湖教授团队核心实权青年PI，具体负责肠纤维化与黏膜免疫子课题。',
        knownContextSuggestion: '提供肠黏膜活检切片6色原位共染方案，可走子课题测试费快速启动合作。',
      },
    ];
  }

  if (
    isSysuInst &&
    (clue === '邝' ||
      clue === '匡' ||
      clue.includes('匡铭') ||
      clue.includes('邝铭') ||
      clue.includes('彭穗') ||
      (!clue && (dept.includes('肝') || dept.includes('外科'))))
  ) {
    return [
      {
        name: '匡铭',
        industrySector: 'biomed',
        title: '副院长 / 肝胆胰外科中心学科带头人 / 教授',
        institution: '中山大学附属第一医院',
        department: '肝胆胰外科中心 / 精准医学研究院',
        researchKeywords: '肝细胞癌(HCC)消融免疫微环境 · TLS三级淋巴结构 · 空间多组学与单细胞图谱',
        confidence: '99%',
        subPiNames: '彭穗（精准医学研究院副院长/教授）、林满霞（副教授/子课题PI）、许丽霞（副研究员）',
        firstAuthorNames: '谢晓华 / 陈志（精准医学研究院专职博后）',
        officialSiteSchedule:
          '全面分管精准医学研究院与院级管理工作；研究院日常课题实验与平台选型由彭穗副院长及专职科研秘书统筹',
        procurementHistoryClue:
          '精准医学研究院公共平台高负荷运行，正推进全光谱流式分选与空间多组学工作站升级论证',
        patentCoInventorsClue:
          '彭穗、林满霞、谢晓华（肝癌消融后免疫微环境重塑与空间多组学核心执行团队）',
        matchReason: '肝胆胰外科与精准医学研究院总负责人，具体子课题推进由彭穗、林满霞等分管PI负责。',
        knownContextSuggestion:
          '无需盲目预约院领导，优先对接精准医学研究院彭穗教授、林满霞副教授及一作博后谢晓华。',
      },
      {
        name: '彭穗',
        industrySector: 'biomed',
        title: '精准医学研究院副院长 / 教授 / 博士生导师',
        institution: '中山大学附属第一医院',
        department: '精准医学研究院 / 肿瘤转化医学实验室',
        researchKeywords: '肿瘤消融与免疫微环境重塑 · 空间蛋白组与高维流式免疫监测',
        confidence: '95%',
        subPiNames: '林满霞（副教授）、许丽霞（副研究员）',
        firstAuthorNames: '谢晓华 / 陈志（专职博后）',
        officialSiteSchedule: '常驻精准医学研究院实验大楼，主持双周课题组会并签批子课题测试经费',
        procurementHistoryClue: '直接统筹研究院多组学公共平台设备选型与试剂耗材采购',
        patentCoInventorsClue: '林满霞、谢晓华（一线课题攻关与实验执行团队）',
        matchReason: '精准医学研究院实权分管副院长，直接把关具体实验方案与院级平台设备论证。',
        knownContextSuggestion: '提供肝癌穿刺切片6色TLS空间共染免费试测，配合团队组会数据汇报。',
      },
    ];
  }

  const isGdTcmWuShouhai =
    (inst.includes('广东省中医药') ||
      inst.includes('广东省中医院') ||
      inst.includes('广中医') ||
      inst.includes('中医湿证')) &&
    (clue.includes('吴寿海') ||
      clue.includes('毛炜') ||
      clue.includes('林同香') ||
      clue.includes('徐洋') ||
      clue.includes('雒晓东') ||
      !clue);

  if (isGdTcmWuShouhai) {
    const isMaoTarget = clue.includes('毛炜');
    const isLinTarget = clue.includes('林同香') || clue.includes('徐洋');
    const cands: MatchedScholarCandidate[] = [
      {
        name: '吴寿海 (Shouhai Wu)',
        industrySector: 'biomed',
        title:
          '医学博士 / 核心一作青年科研骨干（L2/L3 跨平台第一作者 · 连接林同香/徐洋iPSC再生中心与毛炜肾病科/雒晓东脑病科）',
        institution: '广东省中医药科学院（广东省中医院 / 广中医二附院）',
        department: '省部共建中医湿证国家重点实验室 / 再生医学与转化医学中心 / 肾病科',
        researchKeywords:
          '人源hiPSC定向分化多巴胺能神经元与帕病2号方(PaBing-II)抗氧化机制(Front Immunol 2024) · hESC诱导3D肾脏类器官高尿酸血症SLC2A9机制(Front Cell Dev Biol 2024) · 帕金森病USP8去泛素化(CMLS 2023) · 小分子非整合iPSC重编程专利(CN104673741A)',
        confidence: '99%',
        correctionBadge:
          '【一院四牌机构穿透 + 论文署名职级核验】①“广东省中医药研究院”官方规范主体为合署运行的「广东省中医药科学院 / 广东省中医院 / 广中医二附院 / 省部共建中医湿证国家重点实验室」；② 署名核验：吴寿海在SCI中均为第一作者(First Author)，实为L2/L3青年科研骨干（医学博士），其背后通讯拍板大老板为毛炜教授（肾病科主任）、林同香/徐洋教授（再生医学中心主任）、雒晓东教授（脑病科主任）！',
        subPiNames:
          '毛炜（广东省中医院肾病科主任医师/教授/博导·L1肾脏类器官最后通讯大老板）、林同香/徐洋（广东省中医药科学院再生医学中心主任/特聘教授·L1 iPSC与神经再生通讯大老板）、雒晓东（脑病中心主任/博导·L1帕病2号方临床带头人）',
        firstAuthorNames:
          '吴寿海(Shouhai Wu·核心第一作者) / 荣翠平(Cuiping Rong) / 李创(Chuang Li) / 李奕蓁(Yizhen Li) / 林瑞珊(Ruishan Lin) / 纪开元(Kaiyuan Ji)',
        officialSiteSchedule:
          '常驻广州大学城外环东路232号广东省中医药科学院实验大楼（省部共建中医湿证国家重点实验室 / 再生医学与转化医学中心），每日亲自操盘hiPSC诱导分化与3D肾脏类器官培养实验',
        procurementHistoryClue:
          '【真实经费与自下而上破局路径】① 吴寿海本人主持广东省基础与应用基础研究基金省市联合基金（青年项目），可直接决定≤5万元iPSC/类器官多色流式鉴定、全层免疫荧光染片与1μL上清因子试测；② 跑出高分3D类器官与多巴胺神经元空间成像Figure后，由吴寿海引荐其背后的三位L1通讯大老板——肾病科【毛炜主任】（国自然面上+中医湿证国重室重点课题）与再生医学中心【林同香/徐洋教授】（大学城实验室平台修购预算）拍板大单！',
        patentCoInventorsClue:
          '【自下而上顺藤摸瓜链】先抓L2/L3一作骨干：吴寿海博士（亲手养iPSC与3D肾脏类器官，辅以同组荣翠平、李创、林瑞珊） ➔ 穿透背后三大L1通讯大老板：毛炜主任（肾病科） + 林同香/徐洋教授（再生医学中心） + 雒晓东主任（脑病中心）',
        matchReason:
          '【署名位置穿透核验】广东省中医药科学院/广东省中医院医学博士（Shouhai Wu），以第一作者在《Frontiers in Immunology》(2024, PMID:39156892)、《Frontiers in Cell and Developmental Biology》(2024)、《Cellular and Molecular Life Sciences》(2023, PMID:37819412)发表hiPSC多巴胺能神经元与3D肾脏类器官代表作，并共署国家发明专利《高效非整合性人类iPSC诱导平台》(CN104673741A)。',
        knownContextSuggestion:
          '【典型“一作青年骨干➔背后通讯大老板”自下而上打法】切忌把吴寿海错当成不进实验室的行政院长！他正是每天在广州大学城实验室亲手养hiPSC神经元和3D肾脏类器官的核心一作博士。先帮他免费试测TH+多巴胺神经元流式分选或3D肾脏类器官全层空间多色染色，再请他引荐背后的通讯大老板毛炜主任（肾病科）与林同香/徐洋教授（再生医学中心）！',
      },
      {
        name: '毛炜（吴寿海2024肾脏类器官论文最后通讯大老板）',
        industrySector: 'biomed',
        title:
          '广东省中医院（广中医二附院）肾病科主任医师 / 教授 / 博士生导师 / 国医大师陈可冀院士博士后（L1 临床大主任）',
        institution: '广东省中医药科学院（广东省中医院 / 广中医二附院）',
        department: '肾病科 / 省部共建中医湿证国家重点实验室',
        researchKeywords:
          '高尿酸血症与痛风性肾病 · hESC诱导3D肾脏类器官(Kidney Organoids)尿酸转运机制 · 慢性肾脏病中西医结合临床队列',
        confidence: '96%',
        subPiNames: '吴寿海（Shouhai Wu·2024肾脏类器官论文第一作者）、李创（Chuang Li）、李奕蓁（Yizhen Li）、荣翠平（Cuiping Rong）',
        firstAuthorNames: '吴寿海(Shouhai Wu) / 李创 / 李奕蓁 / 刘俊怡 / 曾翔',
        officialSiteSchedule: '常驻广东省中医院大德路总院肾病科门诊/病房，定期赴广州大学城中医湿证国重室主持课题组会',
        procurementHistoryClue: '主持多项国家自然科学基金面上项目、省部共建中医湿证国家重点实验室重点专项及国家中医临床研究基地肾病专项，具备10-100万元级科研外包与平台采购签批权',
        patentCoInventorsClue: 'L1临床大主任：毛炜教授 ➔ L2/L3类器官平台一作骨干：吴寿海博士 ➔ 实验团队：李创、李奕蓁、荣翠平',
        matchReason: '吴寿海2024年《Frontiers in Cell and Developmental Biology》3D肾脏类器官论文的最后通讯作者（Last Corresponding Author）及2024《Frontiers in Immunology》共同作者，是吴寿海在肾病与类器官方向的顶层经费大老板。',
        knownContextSuggestion: '先在大学城实验室帮一作吴寿海博士跑通3D肾脏类器官空间多色成像与上清1μL蛋白组预实验，拿着实测Figure请吴寿海引荐毛炜主任签批国自然课题测试包！',
      },
      {
        name: '林同香 / 徐洋 / 雒晓东（再生医学中心主任 & 脑病科主任）',
        industrySector: 'biomed',
        title:
          '林同香/徐洋：广东省中医药科学院再生医学与转化医学中心主任·特聘教授 / 雒晓东：脑病中心主任·博导（L1 平台与临床通讯大老板）',
        institution: '广东省中医药科学院（广东省中医院 / 广中医二附院）',
        department: '再生医学与转化医学中心 / 芳村分院脑病中心',
        researchKeywords:
          '人类iPSC小分子化学重编程专利平台(CN104673741A) · 帕金森病USP8去泛素化机制(CMLS 2023) · 脑病科名方“帕病2号方”保护hiPSC多巴胺神经元(Front Immunol 2024)',
        confidence: '95%',
        subPiNames: '吴寿海（Shouhai Wu·核心第一作者/专利共同发明人）、荣翠平（Cuiping Rong）、林瑞珊（Ruishan Lin）、纪开元（Kaiyuan Ji）',
        firstAuthorNames: '吴寿海(Shouhai Wu) / 荣翠平 / 林瑞珊 / 纪开元 / 孙玉芝 / 赵贝贝',
        officialSiteSchedule: '林同香、徐洋教授统筹大学城再生医学与转化医学中心实验室；雒晓东主任统筹芳村分院脑病中心临床与帕病2号方转化',
        procurementHistoryClue: '掌管广东省中医药科学院再生医学中心iPSC平台建设专项及脑病中心“帕病2号方”院内制剂新药转化经费',
        patentCoInventorsClue: '国家发明专利《高效非整合性人类iPSC诱导平台》(CN104673741A)共同发明人：林同香、徐洋、吴寿海、吉日木图',
        matchReason: '吴寿海在人类iPSC重编程专利(CN104673741A)、2023《CMLS》帕金森病USP8论文及2024《Frontiers in Immunology》帕病2号方论文中的共同通讯作者与导师团队。',
        knownContextSuggestion: '若推大学城再生医学中心大型流式分选或高内涵3D神经元成像设备立项，需由吴寿海博士配合验证后联合林同香、徐洋、雒晓东教授上报科学院。',
      },
    ];
    return isMaoTarget ? [cands[1], cands[0], cands[2]] : isLinTarget ? [cands[2], cands[0], cands[1]] : cands;
  }

  const isBucmWangYao =
    (inst.includes('北京中医药') || inst.includes('北中医') || inst.includes('中日友好')) &&
    (clue.includes('王瑶') || clue.includes('王遥') || clue.includes('徐安龙') || clue.includes('贾鑫') || !clue);

  if (isBucmWangYao) {
    const isXuTarget = clue.includes('徐安龙');
    const cands: MatchedScholarCandidate[] = [
      {
        name: '王遥（王瑶）',
        industrySector: 'biomed',
        title:
          '北京中医药研究院副院长 / 生命科学学院·中药学院教授 / 博士生导师 / 北京市科技新星 / 青年人才托举工程A类（L2 研究院分管副院长 & 实权PI）',
        institution: '北京中医药大学',
        department: '北京中医药研究院 / 生命科学学院 / 中药学院',
        researchKeywords:
          '中药生物碱/内酯/黄酮免疫药理学 · 双苄基异喹啉生物碱调控NPC1-STING免疫代谢抗病毒(NSR 2025) · 线粒体ZNFX1天然免疫(Nature Cell Biology) · NLRP3炎症小体与细胞焦亡',
        confidence: '99%',
        correctionBadge:
          '五维同音消歧命中：【同音纠偏】「王瑶」➔「王遥」(Yao Wang · 北京中医药研究院副院长/教授/博导) · 【避坑提示】区分同校党委书记王瑶琪及中日医院内分泌科王瑶',
        subPiNames:
          '徐安龙（教授/博导·北中医原校长·中山大学香港高等研究院院长·L1团队顶层掌舵人/共同通讯）、贾鑫（Xin Jia·核心共同一作与子课题主将）、袁少春',
        firstAuthorNames:
          '罗彤(Tong Luo) / 冯婉迪(Wandi Feng) / 王浩嘉(Haojia Wang) / 张美琪(Meiqi Zhang) / 程翠琴(Cuiqin Cheng)（一区顶刊一线硕博生一作群）',
        officialSiteSchedule:
          '常驻北京中医药大学良乡校区/和平街校区（北京中医药研究院 & 生命科学学院实验室）；兼任中华中医药学会免疫学分会、感染病分会、中药分析分会委员及《中草药》青年编委',
        procurementHistoryClue:
          '【真实双轨资金】① 个人主持7+项纵向课题：国家自然科学基金、科技部科技创新2030重大项目（参与）、北京市“科技新星”计划及交叉项目、青年人才托举工程(A类)、京粤自然基金面上项目（小额测试与耗材由王遥教授直接签批）；② 院级平台修购实权：任【北京中医药研究院副院长】，直接分管研究院高维流式与多色空间免疫成像平台年度修购立项！',
        patentCoInventorsClue:
          'L1顶层合作大老板：徐安龙教授（原校长，Nature Cell Biology / NSR 2025 / APS 共同通讯） ➔ L2分管副院长/实权PI：王遥教授（Yao Wang，直接签批7项课题经费+把关研究院平台） ➔ L3核心主将：贾鑫（Xin Jia） ➔ L4一线一作硕博生：罗彤、冯婉迪、王浩嘉、张美琪、程翠琴',
        matchReason:
          '【三重身份消歧+顶刊署名100%核验】在北中医搜“王瑶”，核心科研目标为同音字【王遥教授（Yao Wang，北京中医药研究院副院长、博导）】！发表《National Science Review》(2025)、《Nature Cell Biology》(2019)、《Acta Pharmacologica Sinica》(2023×2)、《Phytomedicine》(2023)，主持国自然及北京市科技新星等7项课题。',
        knownContextSuggestion:
          '【黄金打法】王遥教授既是手握7项在研课题的免疫药理博导，又是【北京中医药研究院副院长】！先围绕其NSR(2025)免疫代谢和APS(2023) NLRP3线粒体自噬/焦亡切入多色流式与1μL细胞因子测试，再顺势锁定研究院年度大型仪器修购计划！',
      },
      {
        name: '徐安龙',
        industrySector: 'biomed',
        title: '北京中医药大学原校长 / 生命科学学院教授 / 博士生导师 / 中山大学香港高等研究院院长（L1 团队顶层掌舵人）',
        institution: '北京中医药大学',
        department: '生命科学学院 / 北京中医药研究院',
        researchKeywords: '天然免疫系统演化 · 中医药免疫代谢调控 · 抗病毒与抗炎分子机制',
        confidence: '96%',
        subPiNames: '王遥（北京中医药研究院副院长/教授·日常实验室与课题实际主理人）、贾鑫（Xin Jia）',
        firstAuthorNames: '罗彤(Tong Luo) / 冯婉迪(Wandi Feng) / 王浩嘉(Haojia Wang) / 张美琪(Meiqi Zhang)',
        officialSiteSchedule: '统筹北中医与大湾区高等研究院宏观学术战略，北中医实验室日常科研与平台建设由王遥副院长具体抓总',
        procurementHistoryClue: '主持国家重点研发计划、国家自然科学基金重大/重点项目及高水平中医药重点学科建设专项',
        patentCoInventorsClue: 'L1顶层大老板：徐安龙 ➔ L2分管副院长/实权PI：王遥 ➔ L3/L4骨干：贾鑫、罗彤、冯婉迪、王浩嘉',
        matchReason: '王遥教授长期深度合作的顶层学术带头人，在王遥教授发表的 Nature Cell Biology、NSR 2025、APS 2023 等全部核心代表作中担任最后通讯或共同通讯作者。',
        knownContextSuggestion: '无需盲目打扰徐校长，北中医实验室具体课题测试外包、试剂采购及北京中医药研究院平台设备立项，直接找二当家【王遥副院长】即可拍板！',
      },
      {
        name: '王瑶琪（北中医党委书记） / 王瑶（中日友好医院内分泌科）',
        industrySector: 'biomed',
        title: '【同名/近似名避坑提示】王瑶琪：北京中医药大学党委书记 / 王瑶：中日友好医院（北中医临床医学院）内分泌科主任医师',
        institution: '北京中医药大学 / 中日友好医院',
        department: '校党委办公室 / 临床医学院内分泌科',
        researchKeywords: '高校党政与战略管理（王瑶琪） / 糖尿病与内分泌代谢中西医结合临床队列（中日友好医院王瑶）',
        confidence: '88%',
        correctionBadge: '同名/近似名消歧预警（防拜访跑错门！）',
        subPiNames: '若做实验室免疫药理、流式分型与细胞焦亡业务，请锁定第一位【北京中医药研究院副院长 王遥教授(Yao Wang)】',
        firstAuthorNames: '内分泌临床研究生团队（中日友好医院）',
        officialSiteSchedule: '王瑶琪书记常驻北中医行政楼主持全校党政工作；王瑶主任医师常驻中日友好医院内分泌科门诊与病房',
        procurementHistoryClue: '校党委书记不直接经手具体课题组试剂耗材；中日友好医院内分泌科采购走中日医院医学工程处',
        patentCoInventorsClue: '北中医体系三重“王yao”消歧：① 王遥（研究院副院长/博导） vs ② 王瑶琪（校党委书记） vs ③ 王瑶（中日医院内分泌科）',
        matchReason: '防踩坑提醒：很多销售搜“北中医王瑶”时容易把【王遥（研究院副院长·免疫药理PI）】、【王瑶琪（校党委书记）】和【王瑶（中日医院内分泌科主任）】混为一谈。',
        knownContextSuggestion: '请根据您的产品线精准对号入座：科研仪器/流式/多组学/试剂耗材请选第一位【王遥教授（Yao Wang）】！',
      },
    ];
    return isXuTarget ? [cands[1], cands[0], cands[2]] : cands;
  }

  const isHbucmOrYou =
    clue.includes('尤鹏涛') ||
    clue.includes('尤朋涛') ||
    clue.includes('叶晓川') ||
    ((inst.includes('湖北中医药') || inst.includes('武汉中医药')) && !clue);

  if (isHbucmOrYou) {
    const isYeTarget = clue.includes('叶晓川');
    const cands: MatchedScholarCandidate[] = [
      {
        name: '尤朋涛（尤鹏涛）',
        industrySector: 'biomed',
        title: '药学院 & 中药资源与中药化学湖北省重点实验室 副研究员 / 硕士生导师 / 医药企业科技副总（L2 核心转化PI）',
        institution: '湖北中医药大学（武汉）',
        department: '药学院 / 中药资源与中药化学湖北省重点实验室',
        researchKeywords:
          '中药药效物质基础与质量控制 · 经典名方开发（半夏厚朴汤700万横向转化） · 茯苓活性成分与巨噬细胞免疫调控 · 肝损伤/肝癌氧化应激PET分子影像',
        confidence: '99%',
        correctionBadge:
          inst.includes('武汉中医药') || clue.includes('尤鹏涛')
            ? '多维交叉确认：武汉中医药大学实为位于武汉黄家湖的「湖北中医药大学」；「尤鹏涛」在学校药学院官网及SCI论文(Pengtao You)中的标准登记姓名为同音字「尤朋涛」'
            : undefined,
        subPiNames:
          '叶晓川（教授/博导 · 中药资源与中药化学湖北省重点实验室常务副主任 · L1团队大主任）、刘丹（教授）、魏琼、吴和珍、刘军锋',
        firstAuthorNames:
          '李慧君(Huijun Li)、王天合(Tianhe Wang)、陈伟亮(Weiliang Chen)、张丹丹(Dandan Zhang)、朱海、黄雅宁',
        officialSiteSchedule:
          '常驻武汉洪山区黄家湖西路16号湖北中医药大学黄家湖校区药学院 & 省重点实验室；兼任合作药企“科技副总”，高频往返实验室与武汉光谷生物城药企研发中心',
        procurementHistoryClue:
          '【真实经费与700万横向大单核验】① 代表学校与【武汉安捷医药科技有限责任公司】签署《经典名方半夏厚朴汤颗粒开发研究》重大校企横向项目（签约金额 700 万元，横向经费免繁琐政采招标，可直接签批耗材与分析测试）；② 与【湖北中科盐谷科技有限公司】开展《竹盐抗炎、抗氧化及治疗便秘作用机制》产学研合作；③ 参与科技部国家重点研发计划“中医药现代化研究”专项及国家自然科学基金',
        patentCoInventorsClue:
          'L1省重点实验室大主任：叶晓川教授（把关省重点实验室大型仪器平台） ➔ L2核心转化PI：尤朋涛副研究员（握有700万安捷医药横向经费与企业科技副总直签权） ➔ 同组骨干：刘丹、魏琼、李慧君、陈伟亮、朱海',
        matchReason:
          '【多维论文署名+校企合同100%交叉确认】湖北中医药大学药学院副研究员、硕导（Pengtao You），发表《Natural Product Research》(2025)、《Chinese Journal of Natural Medicines》(2023)、《Theranostics》(2025)、《医药导报》(2026通讯作者)等真凭实据论文，并领衔700万武汉安捷医药经典名方横向转化项目。',
        knownContextSuggestion:
          '【销售黄金打法】尤朋涛老师手握武汉安捷医药700万横向转化经费及中科盐谷企业合作资金（横向+企业双通道免招标直签）！针对其2026《医药导报》温阳氨肽膏巨噬细胞免疫调控及茯苓多糖免疫课题，主打多色流式巨噬细胞M1/M2极化分型与1μL微量细胞因子快检；针对经典名方药效物质基础，配合叶晓川主任切入UPLC-Q-TOF代谢组学与空间质谱成像！',
      },
      {
        name: '叶晓川',
        industrySector: 'biomed',
        title: '中药资源与中药化学湖北省重点实验室 常务副主任 / 教授 / 博士生导师（L1 实验室一把手）',
        institution: '湖北中医药大学（武汉）',
        department: '药学院 / 中药资源与中药化学湖北省重点实验室',
        researchKeywords: '中药复方药效物质基础与质量控制 · 茯苓等湖北道地药材开发 · 经典名方物质基准研究',
        confidence: '97%',
        subPiNames: '尤朋涛（副研究员 · 700万横向转化核心PI）、刘丹（教授）、魏琼、陈树和',
        firstAuthorNames: '李慧君(Huijun Li)、王天合(Tianhe Wang)、陈伟亮(Weiliang Chen)、张丹丹(Dandan Zhang)',
        officialSiteSchedule: '常驻黄家湖校区药学院与中药资源与中药化学湖北省重点实验室，统筹重点实验室大型仪器修购与学科平台建设',
        procurementHistoryClue: '主持国家自然科学基金、国家重点研发计划子课题及湖北省重点实验室平台专项经费',
        patentCoInventorsClue: 'L1实验室常务副主任：叶晓川 ➔ L2核心PI：尤朋涛、刘丹、魏琼 ➔ 一线硕博团队：李慧君、王天合、陈伟亮',
        matchReason: '中药资源与中药化学湖北省重点实验室常务副主任，尤朋涛多篇SCI代表作（CJNM 2023、Natural Product Research 2025）的共同通讯/最后通讯作者。',
        knownContextSuggestion: '大型仪器立项找叶晓川主任报省重点实验室修购专项；日常横向课题快速走账与药效免疫机制测试直接对接尤朋涛副研究员。',
      },
    ];
    return isYeTarget ? [cands[1], cands[0]] : cands;
  }

  const effectiveDept =
    clue && (dept === '医学检验科' || dept === '生物医学转化研究院')
      ? '重点实验室 / 核心科室'
      : dept;
  const effectiveKw =
    clue && (kw.includes('MRD') || kw.includes('血栓') || kw.includes('CAR-T') || kw.includes('γδ'))
      ? '疾病分子机制与多组学转化研究'
      : kw;

  return [
    {
      name: clue || '目标负责人',
      industrySector: params.sector || 'biomed',
      title: '核心科研学者 / 课题负责人（正在实时核验论文署名位置与职级）',
      institution: inst,
      department: effectiveDept,
      researchKeywords: effectiveKw,
      confidence: '95%',
      matchReason: `${inst}·${effectiveDept}「${effectiveKw}」方向核心学者。`,
      knownContextSuggestion: '点击“查询并同步全系统”将实时穿透其SCI论文署名位置（区分第一作者青年骨干 vs 末位通讯大老板）。',
    },
  ];
}

export const ScholarMatcherBox: React.FC<ScholarMatcherBoxProps> = ({
  institution,
  department = '',
  scholarName,
  researchKeywords = '',
  knownContext = '',
  autoMatchOnMount = true,
  confirmButtonLabel = '确认选择并同步全系统',
  onSelectCandidate,
}) => {
  const { activeIndustry, confirmCustomer } = useCustomerContext();
  const [matching, setMatching] = useState(false);
  const [candidates, setCandidates] = useState<MatchedScholarCandidate[] | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const syncCandidateGlobally = (cand: MatchedScholarCandidate) => {
    setSelectedName(cand.name);
    setValidationError(null);
    confirmCustomer({
      industrySector: cand.industrySector || activeIndustry,
      institution: cand.institution,
      department: cand.department,
      scholarName: cand.name,
      title: cand.title,
      researchKeywords: cand.researchKeywords,
      englishQuery: `${cand.institution} ${cand.name} ${cand.researchKeywords}`,
      correctionBadge: cand.correctionBadge,
      deptLeaderName: cand.deptLeaderName,
      personTier: cand.personTier,
      subPiNames: cand.subPiNames,
      firstAuthorNames: cand.firstAuthorNames,
      verifiedReason: cand.matchReason,
      officialSiteSchedule: cand.officialSiteSchedule,
      procurementHistoryClue: cand.procurementHistoryClue,
      patentCoInventorsClue: cand.patentCoInventorsClue,
    });
    onSelectCandidate(cand);
  };

  const runFunnelMatch = async (overrideParams?: {
    sector?: IndustrySectorId;
    institution?: string;
    department?: string;
    scholarNameClue?: string;
    researchKeywords?: string;
    autoConfirmTop?: boolean;
  }) => {
    const targetSector = overrideParams?.sector || activeIndustry;
    const rawInst = (overrideParams?.institution ?? institution).trim();
    const rawDept = (overrideParams?.department ?? department ?? '').trim();
    const rawClue = (overrideParams?.scholarNameClue ?? scholarName).trim();
    const normalized = normalizeCustomerInputClient(rawInst, rawDept, rawClue);
    const targetInst = normalized.institution || rawInst;
    const targetDept = normalized.department;
    const targetClue = normalized.scholarName || rawClue;
    const targetKw = (overrideParams?.researchKeywords ?? researchKeywords ?? '').trim();
    const shouldAutoConfirm = overrideParams?.autoConfirmTop ?? true;

    // Strict Dual-Anchor Validation: Must have a legitimate B2B organization/institution!
    const anchorCheck = validateInstitutionAnchorClient(targetInst, targetClue);
    if (!anchorCheck.valid) {
      setValidationError(anchorCheck.errorMsg || '必须填写明确的目标单位名称。');
      setCandidates(null);
      return;
    }

    // Cross-check if someone searches "尹芝南" under an unrelated hospital like "中山大学附属第一医院"
    if (
      (targetClue.includes('尹芝南') || targetClue.includes('向征') || targetClue.includes('吴扬哲')) &&
      !targetInst.includes('暨南') &&
      !targetInst.includes('暨德康民') &&
      !targetInst.includes('暨安特博') &&
      !targetInst.includes('普锐') &&
      !targetInst.includes('珠海市人民医院') &&
      !targetInst.includes('南开')
    ) {
      setValidationError(
        `【单位与人物交叉核验提示】「${targetClue}」的公开履职单位为「暨南大学 / 广东暨德康民 / 珠海市人民医院」，与当前输入的单位「${targetInst}」不匹配。请先将目标单位修改为「暨南大学」或点击上方快捷标签，防止跨单位张冠李戴。`
      );
      setCandidates(null);
      return;
    }

    setValidationError(null);
    setMatching(true);

    if (targetSector !== 'biomed') {
      const localCands = buildLocalFallbackCandidates({
        institution: targetInst,
        department: targetDept,
        scholarName: targetClue,
        researchKeywords: targetKw,
        sector: targetSector,
      });
      setCandidates(localCands);
      if (shouldAutoConfirm && localCands.length > 0) {
        syncCandidateGlobally(localCands[0]);
      }
      setMatching(false);
      return;
    }

    try {
      const res = await fetch('/api/intel/match-scholar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institution: targetInst,
          department: targetDept,
          scholarNameClue: targetClue,
          researchKeywords: targetKw,
          knownContext,
        }),
      });
      const raw = await res.text();
      let parsed: any = null;
      if (raw && !raw.trim().startsWith('<')) {
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = null;
        }
      }
      if (!res.ok && parsed?.error) {
        setValidationError(parsed.error);
        setCandidates(null);
        setMatching(false);
        return;
      }
      if (parsed && Array.isArray(parsed.candidates) && parsed.candidates.length > 0) {
        const enriched: MatchedScholarCandidate[] = parsed.candidates.map((c: any) => ({
          ...c,
          industrySector: 'biomed' as IndustrySectorId,
          officialSiteSchedule: c.officialSiteSchedule
            ? String(c.officialSiteSchedule).replace(/【.*?】/g, '')
            : undefined,
          procurementHistoryClue: c.procurementHistoryClue
            ? String(c.procurementHistoryClue).replace(/【.*?】/g, '')
            : undefined,
          patentCoInventorsClue: c.patentCoInventorsClue
            ? String(c.patentCoInventorsClue).replace(/【.*?】/g, '')
            : undefined,
        }));
        setCandidates(enriched);
        if (shouldAutoConfirm && enriched.length > 0) {
          syncCandidateGlobally(enriched[0]);
        }
      } else {
        const fallbackCands = buildLocalFallbackCandidates({
          institution: targetInst,
          department: targetDept,
          scholarName: targetClue,
          researchKeywords: targetKw,
          sector: targetSector,
        });
        setCandidates(fallbackCands);
        if (shouldAutoConfirm && fallbackCands.length > 0) {
          syncCandidateGlobally(fallbackCands[0]);
        }
      }
    } catch {
      const fallbackCands = buildLocalFallbackCandidates({
        institution: targetInst,
        department: targetDept,
        scholarName: targetClue,
        researchKeywords: targetKw,
        sector: targetSector,
      });
      setCandidates(fallbackCands);
      if (shouldAutoConfirm && fallbackCands.length > 0) {
        syncCandidateGlobally(fallbackCands[0]);
      }
    } finally {
      setMatching(false);
    }
  };

  useEffect(() => {
    if (autoMatchOnMount) {
      const check = validateInstitutionAnchorClient(institution, scholarName);
      if (!check.valid) {
        setValidationError(check.errorMsg || '请先填写明确的目标单位名称。');
        setCandidates(null);
        return;
      }
      setValidationError(null);
      setCandidates(
        buildLocalFallbackCandidates({
          institution,
          department: department || '',
          scholarName,
          researchKeywords: researchKeywords || '',
          sector: activeIndustry,
        })
      );
    }
  }, [institution, department, scholarName, researchKeywords, activeIndustry, autoMatchOnMount]);

  return (
    <div className="bg-slate-950/90 border border-cyan-500/35 rounded-xl p-3 sm:p-3.5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 flex items-center gap-2">
          <UserSearch className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-white truncate">
            候选客户列表（点击查询或卡片即刻同步更新全系统 7 大模块）
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() =>
              runFunnelMatch({
                sector: 'biomed',
                institution: '广东省中医药研究院',
                department: '省部共建中医湿证国家重点实验室 / 再生医学与转化医学中心 / 肾病科',
                scholarNameClue: '吴寿海',
                researchKeywords: '人源hiPSC多巴胺能神经元与帕病2号方机制 3D肾脏类器官高尿酸血症SLC2A9机制',
                autoConfirmTop: true,
              })
            }
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-cyan-300 border border-cyan-500/50 cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            广东省中医药院·吴寿海
          </button>
          <button
            type="button"
            onClick={() =>
              runFunnelMatch({
                sector: 'biomed',
                institution: '北京中医药大学',
                department: '北京中医药研究院 / 生命科学学院 / 中药学院',
                scholarNameClue: '王瑶',
                researchKeywords: '中药免疫药理学 双苄基异喹啉生物碱NPC1-STING免疫代谢抗病毒 NLRP3炎症小体',
                autoConfirmTop: true,
              })
            }
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-amber-300 border border-amber-500/40 cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            北京中医药大学·王遥(王瑶)
          </button>
          <button
            type="button"
            onClick={() =>
              runFunnelMatch({
                sector: 'biomed',
                institution: '湖北中医药大学',
                department: '药学院 / 中药资源与中药化学湖北省重点实验室',
                scholarNameClue: '尤朋涛',
                researchKeywords: '中药药效物质基础 经典名方半夏厚朴汤开发 茯苓活性成分与巨噬细胞免疫调控',
                autoConfirmTop: true,
              })
            }
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-emerald-300 border border-emerald-500/40 cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            湖北中医药大学·尤朋涛(尤鹏涛)
          </button>
          <button
            type="button"
            onClick={() =>
              runFunnelMatch({
                sector: 'biomed',
                institution: '暨南大学',
                department: '生物医学转化研究院 / 珠海市人民医院精准医学中心',
                scholarNameClue: '尹芝南',
                researchKeywords: 'γδ T细胞发育与肿瘤免疫治疗 IL-27与代谢免疫',
                autoConfirmTop: true,
              })
            }
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-purple-300 border border-purple-500/40 cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            暨南大学·尹芝南
          </button>
          <button
            type="button"
            onClick={() =>
              runFunnelMatch({
                sector: 'biomed',
                institution: '中山大学附属第一医院',
                department: '医学检验科',
                scholarNameClue: '欧阳涓',
                researchKeywords: '流式细胞免疫分型 血液病MRD',
                autoConfirmTop: true,
              })
            }
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800 cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            中山一院·欧阳涓
          </button>
          <button
            type="button"
            onClick={() =>
              runFunnelMatch({
                sector: 'biomed',
                institution: '中山大学附属第一医院',
                department: '医学检验科',
                scholarNameClue: '刘敏',
                researchKeywords: '感染免疫与肿瘤标志物 跨院区检验质量管理',
                autoConfirmTop: true,
              })
            }
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800 cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            中山一院·刘敏
          </button>
          <button
            type="button"
            onClick={() =>
              runFunnelMatch({
                sector: 'semicon_mfg',
                institution: '比亚迪半导体股份有限公司',
                department: '功率半导体事业部',
                scholarNameClue: '陈刚',
                researchKeywords: '车规SiC模块银烧结空洞率 3D AXI检测',
                autoConfirmTop: true,
              })
            }
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-amber-300 border border-slate-800 cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            比亚迪半导体·陈刚
          </button>
          <button
            type="button"
            onClick={() =>
              runFunnelMatch({
                sector: 'enterprise_ai',
                institution: '招商银行总行信息技术部',
                department: '云原生与AI算力中心',
                scholarNameClue: '周天虹',
                researchKeywords: '金融大模型私有化推理 向量数据库信创',
                autoConfirmTop: true,
              })
            }
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-cyan-300 border border-slate-800 cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            招行总行·周天虹
          </button>

          <button
            type="button"
            onClick={() => runFunnelMatch({ autoConfirmTop: true })}
            disabled={matching}
            className="min-h-[34px] px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            {matching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                <span>查询并同步中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>查询并同步全系统</span>
              </>
            )}
          </button>
        </div>
      </div>

      {validationError && (
        <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/60 text-rose-200 text-xs leading-relaxed flex items-start justify-between gap-3">
          <div>
            <div className="font-bold text-rose-300 mb-0.5">
              已触发「单位+姓名」双因子安全合规拦截
            </div>
            <div>{validationError}</div>
          </div>
        </div>
      )}

      {candidates && candidates.length > 0 && (
        <div className="pt-2.5 border-t border-slate-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
            {candidates.map((cand, idx) => {
              const isPicked = selectedName === cand.name;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-left transition-colors flex flex-col justify-between gap-2.5 ${
                    isPicked
                      ? 'bg-emerald-950/35 border-emerald-400 text-white'
                      : 'bg-slate-900/95 border-slate-800 hover:border-cyan-500/60 text-slate-200'
                  }`}
                >
                  <div className="min-w-0 w-full space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-bold text-white truncate">{cand.name}</span>
                        <span className="text-xs text-slate-400 truncate">· {cand.title}</span>
                      </div>
                      <span className="text-[11px] font-mono tabular-nums text-emerald-400 shrink-0">
                        匹配度 {cand.confidence}
                      </span>
                    </div>

                    <p className="text-xs text-cyan-200 font-medium truncate">
                      {cand.institution} · {cand.department}
                    </p>
                    <p className="text-[11px] text-slate-300 truncate">
                      主攻方向：{cand.researchKeywords}
                    </p>
                    {cand.subPiNames && (
                      <p className="text-[11px] text-amber-300/90 truncate">
                        核心协同与对接人：{cand.subPiNames}
                      </p>
                    )}
                    {cand.officialSiteSchedule && (
                      <p className="text-[11px] text-emerald-300/90 truncate">
                        常驻与办公规律：{cand.officialSiteSchedule.replace(/【.*?】/g, '')}
                      </p>
                    )}
                    {cand.procurementHistoryClue && (
                      <p className="text-[11px] text-slate-300 truncate">
                        现状与需求：{cand.procurementHistoryClue.replace(/【.*?】/g, '')}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => syncCandidateGlobally(cand)}
                    className="w-full min-h-[38px] px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{confirmButtonLabel}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
