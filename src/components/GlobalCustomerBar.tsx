import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  History,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  X,
  AlertCircle,
  Building2,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from 'lucide-react';
import {
  useCustomerContext,
  B2B_INDUSTRY_SECTORS,
  IndustrySectorId,
} from '../context/CustomerContext';
import {
  validateInstitutionAnchorClient,
  normalizeCustomerInputClient,
} from './ScholarMatcherBox';

interface GlobalCustomerBarProps {
  onNavigateToHome?: () => void;
}

export const GlobalCustomerBar: React.FC<GlobalCustomerBarProps> = ({ onNavigateToHome }) => {
  const {
    activeIndustry,
    setActiveIndustry,
    confirmedCustomer,
    customerHistory,
    setIsSelectingCustomer,
    confirmCustomer,
    selectFromHistory,
    removeFromHistory,
  } = useCustomerContext();

  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [quickInstitution, setQuickInstitution] = useState(
    confirmedCustomer?.institution || '暨南大学'
  );
  const [quickDepartment, setQuickDepartment] = useState(
    confirmedCustomer?.department || '生物医学转化研究院'
  );
  const [quickScholarName, setQuickScholarName] = useState(
    confirmedCustomer?.scholarName || '尹芝南'
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [syncFlash, setSyncFlash] = useState(false);

  // Sync top bar inputs when confirmedCustomer changes
  useEffect(() => {
    if (confirmedCustomer) {
      setQuickInstitution(confirmedCustomer.institution);
      setQuickDepartment(confirmedCustomer.department);
      setQuickScholarName(confirmedCustomer.scholarName);
      setValidationError(null);
    }
  }, [
    confirmedCustomer?.id,
    confirmedCustomer?.institution,
    confirmedCustomer?.department,
    confirmedCustomer?.scholarName,
  ]);

  const triggerSyncFlash = () => {
    setSyncFlash(true);
    setTimeout(() => setSyncFlash(false), 1800);
  };

  const handleQuickSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const normalized = normalizeCustomerInputClient(
      quickInstitution,
      quickDepartment,
      quickScholarName
    );
    const inst = normalized.institution.trim();
    const dept = normalized.department.trim();
    const name = normalized.scholarName.trim();

    if (inst !== quickInstitution) setQuickInstitution(inst);
    if (dept !== quickDepartment) setQuickDepartment(dept);
    if (name !== quickScholarName) setQuickScholarName(name);

    if (!name) {
      setValidationError(
        '【缺少目标姓名】请填写「客户姓名」（如：曾雪珍、吴寿海、尹芝南），并与「所属单位」组合检索。'
      );
      return;
    }

    const anchorCheck = validateInstitutionAnchorClient(inst, name);
    if (!anchorCheck.valid) {
      setValidationError(anchorCheck.errorMsg || '请填写合法的所属单位全称（医院/高校/研究院/企业）');
      return;
    }

    setValidationError(null);

    if (
      (name.includes('吴寿海') ||
        name.includes('毛炜') ||
        name.includes('林同香') ||
        name.includes('徐洋') ||
        name.includes('雒晓东')) &&
      (inst.includes('广东省中医药') ||
        inst.includes('广东省中医院') ||
        inst.includes('广中医') ||
        inst.includes('中医湿证'))
    ) {
      const isMao = name.includes('毛炜');
      const isLin = name.includes('林同香') || name.includes('徐洋');
      confirmCustomer({
        industrySector: 'biomed',
        institution: '广东省中医药科学院（广东省中医院 / 广中医二附院）',
        department: dept || '省部共建中医湿证国家重点实验室 / 再生医学与转化医学中心 / 肾病科',
        scholarName: isMao ? '毛炜' : isLin ? '林同香 / 徐洋' : '吴寿海 (Shouhai Wu)',
        title: isMao
          ? '广东省中医院肾病科主任医师 / 教授 / 博士生导师（L1 临床大主任 · 2024肾脏类器官最后通讯）'
          : isLin
          ? '广东省中医药科学院再生医学与转化医学中心主任 / 特聘教授（L1 平台大老板 · iPSC重编程专利负责人）'
          : '医学博士 / 核心一作青年科研骨干（L2/L3 跨平台第一作者 · 连接林同香/徐洋iPSC再生中心与毛炜肾病科/雒晓东脑病科）',
        researchKeywords:
          '人源hiPSC定向分化多巴胺能神经元与帕病2号方(PaBing-II)抗氧化机制(Front Immunol 2024) · hESC诱导3D肾脏类器官高尿酸血症SLC2A9机制(Front Cell Dev Biol 2024) · 帕金森病USP8去泛素化(CMLS 2023) · 小分子非整合iPSC重编程专利(CN104673741A)',
        englishQuery:
          'Guangdong Provincial Academy of Chinese Medical Sciences Guangdong Provincial Hospital of Chinese Medicine Shouhai Wu Wei Mao Tongxiang Lin',
        correctionBadge:
          '【一院四牌机构穿透 + 论文署名职级核验】①“广东省中医药研究院”官方规范主体为合署运行的「广东省中医药科学院 / 广东省中医院 / 广州中医药大学第二附属医院 / 省部共建中医湿证国家重点实验室」；② 署名位置核验：吴寿海在SCI中均为第一作者(First Author)，实为L2/L3青年科研骨干（医学博士），其背后通讯拍板大老板为毛炜教授（肾病科主任）、林同香/徐洋教授（再生医学中心主任）、雒晓东教授（脑病科主任）！',
        subPiNames:
          '毛炜（肾病科主任/博导·L1肾脏类器官最后通讯大老板）、林同香/徐洋（再生医学中心主任/特聘教授·L1 iPSC与神经再生通讯大老板）、雒晓东（脑病中心主任/博导·L1帕病2号方带头人）、吴寿海（医学博士·L2/L3核心一作青年骨干）',
        firstAuthorNames:
          '吴寿海(Shouhai Wu·核心第一作者) / 荣翠平(Cuiping Rong) / 李创(Chuang Li) / 李奕蓁(Yizhen Li) / 林瑞珊(Ruishan Lin) / 纪开元(Kaiyuan Ji)',
        officialSiteSchedule:
          '常驻广州大学城外环东路232号广东省中医药科学院实验大楼（省部共建中医湿证国家重点实验室 / 再生医学与转化医学中心），每日亲自操盘hiPSC诱导分化与3D肾脏类器官培养实验',
        procurementHistoryClue:
          '【真实经费与自下而上破局路径】① 吴寿海本人主持广东省基础与应用基础研究基金省市联合基金（青年项目），可直接决定≤5万元iPSC/类器官多色流式鉴定、全层免疫荧光染片与1μL上清因子试测；② 跑出高分3D类器官与多巴胺神经元空间成像Figure后，由吴寿海引荐其背后的三位L1通讯大老板——肾病科【毛炜主任】（国自然面上+中医湿证国重室重点课题）与再生医学中心【林同香/徐洋教授】（大学城实验室平台修购预算）拍板大单！',
        patentCoInventorsClue:
          '【自下而上顺藤摸瓜链】先抓L2/L3一作骨干：吴寿海博士（亲手养iPSC与3D肾脏类器官，辅以同组荣翠平、李创、林瑞珊） ➔ 穿透背后三大L1通讯大老板：毛炜主任（肾病科） + 林同香/徐洋教授（再生医学中心） + 雒晓东主任（脑病中心）',
      });
    } else if (
      (name.includes('王瑶') || name.includes('王遥') || name.includes('徐安龙') || name.includes('贾鑫')) &&
      (inst.includes('北京中医药') || inst.includes('北中医') || inst.includes('中日友好'))
    ) {
      const isXu = name.includes('徐安龙');
      confirmCustomer({
        industrySector: 'biomed',
        institution: '北京中医药大学',
        department: dept || '北京中医药研究院 / 生命科学学院 / 中药学院',
        scholarName: isXu ? '徐安龙' : '王遥（王瑶）',
        title: isXu
          ? '北京中医药大学原校长 / 生命科学学院教授 / 博导 / 中山大学香港高等研究院院长（L1 顶层大老板）'
          : '北京中医药研究院副院长 / 生命科学学院·中药学院教授 / 博士生导师 / 北京市科技新星 / 青年人才托举工程A类（L2 分管副院长 & 实权PI）',
        researchKeywords:
          '中药生物碱/内酯/黄酮免疫药理学 · 双苄基异喹啉生物碱调控NPC1-STING免疫代谢抗病毒(NSR 2025) · 线粒体ZNFX1天然免疫(Nature Cell Biology) · NLRP3炎症小体与细胞焦亡',
        englishQuery: 'Beijing University of Chinese Medicine Yao Wang Anlong Xu immunometabolism NLRP3 ZNFX1',
        correctionBadge:
          '五维同音消歧命中：【同音纠偏】「王瑶」➔「王遥」（Yao Wang · 北京中医药研究院副院长/教授/博导） · 【避坑提示】区分同校党委书记王瑶琪及中日医院内分泌科王瑶',
        subPiNames:
          '徐安龙（教授/博导·北中医原校长·L1顶层合作大老板）、王遥（北京中医药研究院副院长/教授·L2实权PI）、贾鑫（Xin Jia·核心共同一作主将）、袁少春',
        firstAuthorNames:
          '罗彤（Tong Luo） / 冯婉迪（Wandi Feng） / 王浩嘉（Haojia Wang） / 张美琪（Meiqi Zhang） / 程翠琴（Cuiqin Cheng）（一区顶刊一线硕博生一作群）',
        officialSiteSchedule:
          '常驻北京中医药大学良乡校区/和平街校区（北京中医药研究院 & 生命科学学院实验室）；兼任中华中医药学会免疫学分会、感染病分会、中药分析分会委员及《中草药》青年编委',
        procurementHistoryClue:
          '【真实双轨资金】① 个人主持7+项纵向与人才经费：国家自然科学基金、科技创新2030重大专项、北京市“科技新星”计划及交叉项目、青年人才托举工程(A类)等（小额流式/蛋白组/成像测试与耗材由王遥教授直接签批！）；② 研究院平台修购预算：王遥任【北京中医药研究院副院长】，直接把关研究院高维全光谱流式及多色空间免疫成像平台年度修购立项！',
        patentCoInventorsClue:
          'L1顶层大老板：徐安龙教授（原校长，Nature Cell Biology / NSR 2025 / APS 共同通讯） ➔ L2分管副院长/实权PI：王遥教授（Yao Wang，直接签批7项课题经费+把关研究院平台） ➔ L3核心主将：贾鑫（Xin Jia） ➔ L4一线硕博一作：罗彤、冯婉迪、王浩嘉、张美琪、程翠琴',
      });
    } else if (
      (name.includes('尤朋涛') ||
        name.includes('尤鹏涛') ||
        name.includes('游鹏涛') ||
        name.includes('叶晓川')) &&
      (inst.includes('湖北') || inst.includes('武汉') || inst.includes('安捷') || inst.includes('湖北中医药') || inst.includes('武汉中医药'))
    ) {
      const isYe = name.includes('叶晓川');
      confirmCustomer({
        industrySector: 'biomed',
        institution: inst.includes('武汉中医药')
          ? '湖北中医药大学（原输：武汉中医药大学 · 武汉黄家湖）'
          : '湖北中医药大学',
        department: dept || '药学院 / 中药资源与中药化学湖北省重点实验室',
        scholarName: isYe ? '叶晓川' : '尤朋涛（尤鹏涛）',
        title: isYe
          ? '药学院教授 / 博导 / 中药资源与中药化学湖北省重点实验室常务副主任（L1 实验室一把手）'
          : '药学院副研究员 / 硕士生导师 / 湖北省重点实验室核心骨干 / 医药企业科技副总（L2 实权PI）',
        researchKeywords:
          '中药药效物质基础与质量控制 · 经典名方半夏厚朴汤颗粒开发(700万横向转化) · 茯苓活性成分与巨噬细胞免疫调控 · 肝癌氧化应激PET分子影像',
        englishQuery: 'Hubei University of Chinese Medicine Pengtao You Xiaochuan Ye Poria cocos',
        correctionBadge:
          '五维交叉核验命中：【单位核验】湖北中医药大学（武汉黄家湖） · 【同音纠偏】尤鹏涛 ➔ 尤朋涛 (Pengtao You)',
        subPiNames: isYe
          ? '尤朋涛（副研究员·700万经典名方横向负责人）、刘丹（Dan Liu·教授）、魏琼（Qiong Wei）、吴和珍'
          : '叶晓川（教授/博导·湖北省重点实验室常务副主任·L1团队大主任）、刘丹（Dan Liu·教授）、魏琼（Qiong Wei）、吴和珍、刘军锋',
        firstAuthorNames:
          '李慧君（Huijun Li） / 王天合（Tianhe Wang） / 陈伟亮（Weiliang Chen） / 张丹丹（Dandan Zhang） / 朱海（在读硕博生与一线实验骨干）',
        officialSiteSchedule:
          '常驻武汉市洪山区黄家湖西路16号湖北中医药大学药学院及中药资源与中药化学湖北省重点实验室；主持中药药效毒理、巨噬细胞免疫调控与经典名方质量标准研究，兼任合作药企科技副总',
        procurementHistoryClue:
          '【真实双轨资金】① 700万重大校企横向转化：代表学校与【武汉安捷医药科技有限责任公司】签约《经典名方半夏厚朴汤颗粒开发研究》（合同金额达 700万元，企业横向经费可免政采快速签批测试与耗材！），并与【湖北中科盐谷】开展竹盐抗炎抗氧化合作；② 纵向课题：承担国家重点研发计划“中医药现代化研究”子课题及湖北省重点实验室专项',
        patentCoInventorsClue:
          'L1重点实验室常务副主任：叶晓川教授 ➔ L2核心独立PI/700万横向负责人：尤朋涛副研究员 ➔ L3同组合作学者：刘丹、魏琼、吴和珍、刘军锋 ➔ L4一线实验硕博生：李慧君、王天合、陈伟亮、张丹丹、朱海',
      });
    } else if (
      (name.includes('尹芝南') || name.includes('尹之南') || name.includes('向征') || name.includes('吴扬哲') || name.includes('杨恒文')) &&
      (inst.includes('暨南') || inst.includes('暨德康民') || inst.includes('暨安特博') || inst.includes('普锐') || inst.includes('珠海'))
    ) {
      confirmCustomer({
        industrySector: 'biomed',
        institution: inst || '暨南大学',
        department: dept || '生物医学转化研究院 / 广东暨德康民生物科技有限公司',
        scholarName: name.includes('杨恒文')
          ? '杨恒文'
          : name.includes('向征')
          ? '向征'
          : name.includes('吴扬哲')
          ? '吴扬哲'
          : '尹芝南',
        title: name.includes('杨恒文')
          ? '生物医学转化研究院副院长 / 教授 / 博导（L2 分管副职）'
          : name.includes('向征')
          ? '广东暨德康民执行总经理兼CTO / 副教授（企业实操拍板人）'
          : '生物医学转化研究院院长 / 国家杰青 / 暨德康民&暨安特博创始人（L1 一把手）',
        researchKeywords: 'γδ T细胞发育与肿瘤免疫治疗 同种异体γδ T细胞临床转化 IL-27与代谢免疫',
        englishQuery: 'Jinan University Zhinan Yin gamma delta T cells tumor immunotherapy IL-27',
        subPiNames: '向征（暨德康民CTO/副教授）、吴扬哲（教授）、杨恒文（副院长）、高云飞、罗钧洪',
      });
    } else if (
      name.includes('欧阳') &&
      (inst.includes('中山') || inst.includes('附一') || inst.includes('一院'))
    ) {
      confirmCustomer({
        industrySector: 'biomed',
        institution: inst || '中山大学附属第一医院',
        department: dept || '医学检验科',
        scholarName: '欧阳涓',
        title: '医学检验科行政副主任 / 主任技师 / 硕士生导师（L2 分管副职）',
        researchKeywords: '血液肿瘤微小残留病(MRD) 多参数流式细胞免疫分型 临床新检测项目开发',
        englishQuery: 'Sun Yat-sen University First Affiliated Hospital Ouyang Juan flow cytometry',
        subPiNames: '刘敏（医学检验科正主任·L1一把手）、张式鸿（副主任）',
      });
    } else if (
      name.includes('刘敏') &&
      (inst.includes('中山') || inst.includes('附一') || inst.includes('一院'))
    ) {
      confirmCustomer({
        industrySector: 'biomed',
        institution: inst || '中山大学附属第一医院',
        department: dept || '医学检验科',
        scholarName: '刘敏',
        title: '医学检验科主任（正职） / 主任技师 / 博士后合作导师（L1 科室一把手）',
        researchKeywords: '感染免疫与自身免疫诊断 肿瘤分子标志物 临床实验室规划与跨院区质量管理',
        englishQuery: 'Sun Yat-sen University First Affiliated Hospital Min Liu Laboratory Medicine',
        subPiNames: '欧阳涓（行政副主任·分管流式与细胞分析）、黄彬、张式鸿',
      });
    } else {
      const matchedHistory = customerHistory.find(
        (item) =>
          (item.scholarName.includes(name) || name.includes(item.scholarName)) &&
          (item.institution.includes(inst.slice(0, 3)) || inst.includes(item.institution.slice(0, 3)))
      );
      if (matchedHistory) {
        selectFromHistory(matchedHistory.id);
        triggerSyncFlash();
        setIsSearchExpanded(false);
        return;
      }

      confirmCustomer({
        industrySector: activeIndustry,
        institution: inst,
        department: dept || '重点实验室 / 核心科室',
        scholarName: name,
        title: '学科带头人 / 实验室主任 / 课题组负责人（L1/L2 核心决策人）',
        researchKeywords: '核心研究方向与临床/产业转化攻关',
        englishQuery: `${inst} ${name}`,
      });

      fetch('/api/intel/match-scholar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institution: inst,
          department: dept || '重点实验室 / 核心科室',
          scholarNameClue: name,
          researchKeywords: '核心方向与转化研究',
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          const top = data?.candidates?.[0];
          if (top && top.name) {
            confirmCustomer({
              industrySector: activeIndustry,
              institution: top.institution || inst,
              department: top.department || dept || '重点实验室 / 核心科室',
              scholarName: top.name,
              title: top.title || '学科带头人 / 课题组负责人',
              researchKeywords: top.researchKeywords || '核心方向与转化研究',
              englishQuery: `${top.institution || inst} ${top.name}`,
              correctionBadge: top.correctionBadge,
              deptLeaderName: top.deptLeaderName,
              personTier: top.personTier,
              subPiNames: top.subPiNames,
              firstAuthorNames: top.firstAuthorNames,
              officialSiteSchedule: top.officialSiteSchedule,
              procurementHistoryClue: top.procurementHistoryClue,
              patentCoInventorsClue: top.patentCoInventorsClue,
            });
          }
        })
        .catch(() => {});
    }

    setIsSearchExpanded(false);
    triggerSyncFlash();
  };

  const handleOpenSearchSelector = (sectorId?: IndustrySectorId) => {
    if (sectorId) {
      setActiveIndustry(sectorId);
    }
    setIsSelectingCustomer(true);
    setIsSearchExpanded(false);
    if (onNavigateToHome) {
      onNavigateToHome();
    }
  };

  const handleSwitchSectorPreset = (sectorId: IndustrySectorId) => {
    setActiveIndustry(sectorId);
    const matchingHistory = customerHistory.find((item) => item.industrySector === sectorId);
    if (matchingHistory) {
      selectFromHistory(matchingHistory.id);
      triggerSyncFlash();
    } else {
      setIsSelectingCustomer(true);
      if (onNavigateToHome) onNavigateToHome();
    }
  };

  const currentSectorMeta =
    B2B_INDUSTRY_SECTORS.find(
      (s) => s.id === (confirmedCustomer?.industrySector || activeIndustry)
    ) || B2B_INDUSTRY_SECTORS[0];

  return (
    <>
      {/* Sleek Single-Row Contextual Bar (Saves 240px+ vertical space on mobile, expands on demand) */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          {/* Primary Compact Row */}
          <div className="flex items-center justify-between gap-2">
            {/* Left: Current Customer Identity */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {confirmedCustomer ? (
                <button
                  type="button"
                  onClick={() => setIsSearchExpanded((prev) => !prev)}
                  className="flex items-center gap-2 min-w-0 text-left group cursor-pointer"
                  title="点击展开快速换人或修改检索条件"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                      {confirmedCustomer.scholarName}
                    </span>
                    <span className="text-xs text-slate-400 truncate hidden sm:inline">
                      · {confirmedCustomer.institution}（{confirmedCustomer.department.split('/')[0].trim()}）
                    </span>
                    <span className="text-[11px] text-slate-400 truncate sm:hidden">
                      · {confirmedCustomer.institution.slice(0, 6)}
                    </span>
                  </div>
                  {syncFlash && (
                    <span className="text-[11px] font-semibold text-emerald-400 shrink-0 hidden md:inline">
                      ✓ 已同步
                    </span>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">请选择或检索目标客户</span>
                </div>
              )}
            </div>

            {/* Center: Swipeable Quick Customer Switcher (Desktop inline, Mobile hidden or inside drawer to keep 1-line clean) */}
            <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[11px] text-slate-500 mr-0.5 shrink-0">常访快切:</span>
              {customerHistory.slice(0, 5).map((item) => {
                const isCurrent = confirmedCustomer?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      selectFromHistory(item.id);
                      triggerSyncFlash();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      isCurrent
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                        : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {item.scholarName.split('(')[0].split('（')[0].trim()}
                  </button>
                );
              })}
            </div>

            {/* Right: Search Toggle & History Drawer Trigger (Min-h 38px-40px for easy mobile touch) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsSearchExpanded((prev) => !prev)}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                  isSearchExpanded
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-700/80 text-cyan-300'
                }`}
              >
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span>换客户 / 检索</span>
                {isSearchExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsHistoryDrawerOpen(true)}
                className="min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                title="查看已保存的历史客户档案"
              >
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="hidden sm:inline">客户库</span>
                <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                  ({customerHistory.length})
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Horizontal Quick-Switch Strip (Compact single-line horizontal scroll on phones) */}
          <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <span className="text-[11px] text-slate-500 shrink-0">快切:</span>
            {customerHistory.slice(0, 6).map((item) => {
              const isCurrent = confirmedCustomer?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    selectFromHistory(item.id);
                    triggerSyncFlash();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isCurrent
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                      : 'bg-slate-950/90 text-slate-300 border border-slate-800/90'
                  }`}
                >
                  {item.scholarName.split('(')[0].split('（')[0].trim()}
                </button>
              );
            })}
          </div>

          {/* Collapsible Command Search Drawer (Only visible when user clicks "换客户 / 检索") */}
          {isSearchExpanded && (
            <div className="pt-2 pb-1 border-t border-slate-800/80 space-y-2.5 animate-in fade-in duration-150">
              {/* Industry Sector Selector + Advanced Matcher Button */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>行业:</span>
                  </span>
                  {B2B_INDUSTRY_SECTORS.map((sec) => {
                    const isActive =
                      (confirmedCustomer?.industrySector || activeIndustry) === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => handleSwitchSectorPreset(sec.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          isActive
                            ? 'bg-cyan-500 text-slate-950 font-semibold'
                            : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                        }`}
                      >
                        {sec.shortLabel}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenSearchSelector()}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-xs font-medium text-cyan-200 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>打开多维候选匹配面板</span>
                </button>
              </div>

              {/* Dual-Factor Search Form */}
              <form
                onSubmit={handleQuickSearchSubmit}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex flex-col lg:flex-row items-stretch lg:items-center gap-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                  <div className="flex items-center bg-slate-900 border border-slate-700/80 focus-within:border-cyan-400 rounded-lg px-3 min-h-[40px]">
                    <span className="text-xs font-medium text-rose-400 shrink-0 mr-2">
                      *单位:
                    </span>
                    <input
                      type="text"
                      value={quickInstitution}
                      onChange={(e) => {
                        setQuickInstitution(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      placeholder={currentSectorMeta.orgPlaceholder}
                      className="w-full text-xs sm:text-sm bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                    />
                    {quickInstitution && (
                      <button
                        type="button"
                        onClick={() => setQuickInstitution('')}
                        className="text-slate-500 hover:text-slate-300 ml-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center bg-slate-900 border border-slate-800 focus-within:border-cyan-400 rounded-lg px-3 min-h-[40px]">
                    <span className="text-xs text-slate-400 shrink-0 mr-2">科室:</span>
                    <input
                      type="text"
                      value={quickDepartment}
                      onChange={(e) => setQuickDepartment(e.target.value)}
                      placeholder={currentSectorMeta.deptPlaceholder}
                      className="w-full text-xs sm:text-sm bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                    />
                    {quickDepartment && (
                      <button
                        type="button"
                        onClick={() => setQuickDepartment('')}
                        className="text-slate-500 hover:text-slate-300 ml-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center bg-slate-900 border border-slate-700/80 focus-within:border-cyan-400 rounded-lg px-3 min-h-[40px]">
                    <span className="text-xs font-medium text-cyan-400 shrink-0 mr-2">
                      *姓名:
                    </span>
                    <input
                      type="text"
                      value={quickScholarName}
                      onChange={(e) => {
                        setQuickScholarName(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      placeholder={currentSectorMeta.personPlaceholder}
                      className="w-full text-xs sm:text-sm bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                    />
                    {quickScholarName && (
                      <button
                        type="button"
                        onClick={() => setQuickScholarName('')}
                        className="text-slate-500 hover:text-slate-300 ml-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="submit"
                    className="flex-1 lg:flex-initial min-h-[40px] px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Search className="w-4 h-4" />
                    <span>立即检索并锁定</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(false)}
                    className="min-h-[40px] px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-lg text-xs cursor-pointer"
                  >
                    收起
                  </button>
                </div>
              </form>

              {validationError && (
                <div className="px-3 py-2 rounded-xl bg-rose-950/80 border border-rose-500/60 flex items-center justify-between gap-2 text-xs text-rose-200">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValidationError(null)}
                    className="text-rose-300 hover:text-white text-[11px] underline shrink-0 cursor-pointer"
                  >
                    知道了
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Customer History Bottom Sheet / Modal */}
      {isHistoryDrawerOpen && (
        <div
          onClick={() => setIsHistoryDrawerOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-slate-900 border-t md:border border-slate-800 rounded-t-3xl md:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Mobile Drag Handle */}
            <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mt-2.5 md:hidden" />

            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-cyan-400">
                  <History className="w-3.5 h-3.5" />
                  <span>已保存的客户档案</span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  历史客户列表 ({customerHistory.length})
                </h3>
              </div>
              <button
                onClick={() => setIsHistoryDrawerOpen(false)}
                className="min-w-[40px] min-h-[40px] rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1">
              {customerHistory.map((item) => {
                const isCurrent = confirmedCustomer?.id === item.id;
                const secLabel =
                  B2B_INDUSTRY_SECTORS.find((s) => s.id === item.industrySector)?.shortLabel ||
                  '生命科学 / 医疗临床';
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-emerald-950/25 border-emerald-500/50'
                        : 'bg-slate-950 border-slate-800 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-cyan-400">{secLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-sm font-bold text-white">{item.scholarName}</span>
                      </div>

                      <div className="text-xs text-slate-300">
                        {item.institution} · {item.department}
                      </div>

                      <div className="text-xs text-slate-400 line-clamp-1">
                        方向：{item.researchKeywords}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          selectFromHistory(item.id);
                          setIsHistoryDrawerOpen(false);
                        }}
                        className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                          isCurrent
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{isCurrent ? '当前客户' : '切换客户'}</span>
                      </button>

                      {customerHistory.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFromHistory(item.id)}
                          className="min-h-[40px] min-w-[40px] rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 flex items-center justify-center cursor-pointer"
                          title="删除记录"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setIsHistoryDrawerOpen(false);
                  handleOpenSearchSelector();
                }}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-bold text-cyan-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>高级多维搜索面板</span>
              </button>
              <button
                type="button"
                onClick={() => setIsHistoryDrawerOpen(false)}
                className="min-h-[42px] px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
