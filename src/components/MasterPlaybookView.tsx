import React, { useEffect, useState } from 'react';
import {
  Compass,
  UserCheck,
  Target,
  Flame,
  ChevronRight,
  X,
  Copy,
  Check,
  SlidersHorizontal,
  Play,
} from 'lucide-react';
import { ScholarMatcherBox } from './ScholarMatcherBox';
import { OffScreenReminderBar } from './OffScreenReminderBar';
import { useCustomerContext } from '../context/CustomerContext';

interface FirstPrincipleDimension {
  id: 'decision_chain' | 'budget_verify' | 'risk_reversal' | 'resource_match';
  num: string;
  shortLabel: string;
  name: string;
  shortBullet: string;
  metaTag: string;
  realWorldProblem: string;
  actionableSolution: string;
  prepChecklist: string[];
}

const FIRST_PRINCIPLES: FirstPrincipleDimension[] = [
  {
    id: 'decision_chain',
    num: '01',
    shortLabel: '决策链拆解',
    name: '01 · 决策链三方拆解',
    shortBullet: '发起人要顶刊数据 · 把关人要防堵孔免责 · 拍板人要专科政绩',
    metaTag: '角色定位 · 免责护盾',
    realWorldProblem:
      '只盯做实验的老师聊参数，结果方案报到公共平台被机管以“怕堵孔维护烦”卡死，或报到主任处因缺乏学科考核亮点被搁置。',
    actionableSolution:
      '一份方案拆三页：① 给PI递《顶刊补实验排期》；② 给平台机管递《防堵孔免责SOP与驻场承诺》；③ 给大主任递《重点专科示范平台方案》。',
    prepChecklist: [
      '发起人、平台把关人、经费拍板人分别是谁？',
      '设备故障或样本测坏谁担责？免责协议配齐了吗？',
      '拍板主任今年最核心的重点室/学科考核指标是什么？',
    ],
  },
  {
    id: 'budget_verify',
    num: '02',
    shortLabel: '预算验真',
    name: '02 · 预算验真与同行对标',
    shortBullet: '展示同城对手高分Figure建紧迫感 · 追问报销课题号验真伪',
    metaTag: '同行对标 · 甄别陪标',
    realWorldProblem:
      '盲目跟单半年，最后发现客户根本没有设备指标，或者参数早已被友商锁定、找你只是为了凑三家陪标报价。',
    actionableSolution:
      '先拿《同城标杆课题组高分文章技术对标卡》激发紧迫感；再追问具体报销科目（走个人课题测试费还是院级修购专项），3句话摸清底牌。',
    prepChecklist: [
      '说“没预算”是没设备费(CapEx)但有测试费(OpEx)，还是已内定友商？',
      '同城竞争课题组最近发了什么高分文章可直接拿来对比？',
      '先花4.8万测试费2周出数据 vs 等明年300万招标，哪条路本月能签字？',
    ],
  },
  {
    id: 'risk_reversal',
    num: '03',
    shortLabel: '零风险对赌',
    name: '03 · 零风险预实验对赌',
    shortBullet: '1μL超微量零损耗 + 免费试跑2例切片（不出顶刊图不收费）',
    metaTag: '消除恐惧 · 效果对赌',
    realWorldProblem:
      '面对临床穿刺样本或微升级分选细胞，客户极度保守，怕珍贵样本测坏了无法交差，宁可用老旧4色流式凑合。',
    actionableSolution:
      '把试错风险降为零：① 仅用1μL上清(Olink)或单张石蜡切片6色共染(PanoVUE)；② 免费试染2例，达不到15分期刊标准分文不取。',
    prepChecklist: [
      '客户犹豫是因为怕样本不够、学生不会算、还是怕审稿人不认？',
      '能否提供 ≤5万元小额测试包让客户免招标2周看到实测大图？',
      '是否带了同院或同门师兄实验室已跑通的真实高清Figure？',
    ],
  },
  {
    id: 'resource_match',
    num: '04',
    shortLabel: '跨组拼单',
    name: '04 · 跨组撮合与拼单立项',
    shortBullet: '撮合“临床标本大主任”与“基础机制青年PI”合发文章、联名买大设备',
    metaTag: '样本互补 · 拼单控标',
    realWorldProblem:
      '青年PI懂机制但只有30万青年基金买不起大机器；临床大主任有1000万重点专科经费和标本，却缺人深挖机制发顶刊。',
    actionableSolution:
      '先用5万外包帮青年PI跑出漂亮预实验数据，再由青年PI带数据引见临床大主任，用《跨课题组联合申购报告》锁死300万级平台控标。',
    prepChecklist: [
      '客户手头富余什么（临床队列/动物模型/经费）？最缺什么？',
      '同院哪位大主任能与他形成“临床标本 + 机制深挖”互补？',
      '是否准备好《跨课题组联合申购可行性论证报告》帮他们凑齐预算？',
    ],
  },
];

interface PlaybookDetailModal {
  category: string;
  title: string;
  summary: string;
  script?: string;
}

export const MasterPlaybookView: React.FC = () => {
  const { confirmedCustomer, confirmCustomer } = useCustomerContext();
  const [hasRun, setHasRun] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<FirstPrincipleDimension['id']>('decision_chain');
  const [visitedIds, setVisitedIds] = useState<string[]>(['decision_chain']);
  const [institution, setInstitution] = useState(
    confirmedCustomer?.institution || '中山大学附属第一医院'
  );
  const [department, setDepartment] = useState(
    confirmedCustomer?.department || '医学检验科'
  );
  const [customerName, setCustomerName] = useState(
    confirmedCustomer?.scholarName || '欧阳涓'
  );
  const [researchKeywords, setResearchKeywords] = useState(
    confirmedCustomer?.researchKeywords || '流式细胞免疫分型 血液肿瘤MRD'
  );
  const [customerContext, setCustomerContext] = useState(
    confirmedCustomer?.verifiedReason ||
      '手头有在研测试费 · 急需补齐原位微环境与超微量蛋白数据支撑新项目与顶刊'
  );
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [detailModal, setDetailModal] = useState<PlaybookDetailModal | null>(null);
  const [copied, setCopied] = useState(false);
  const [syncBadge, setSyncBadge] = useState(false);

  useEffect(() => {
    if (!confirmedCustomer) return;
    setInstitution(confirmedCustomer.institution);
    setDepartment(confirmedCustomer.department);
    setCustomerName(confirmedCustomer.scholarName);
    setResearchKeywords(confirmedCustomer.researchKeywords);
    setCustomerContext(
      confirmedCustomer.verifiedReason ||
        `L1一把手：${confirmedCustomer.deptLeaderName || confirmedCustomer.scholarName}；L2分管二当家：${confirmedCustomer.subPiNames || ''}；一线执行：${confirmedCustomer.firstAuthorNames || ''}`
    );
    setHasRun(true);
    setSyncBadge(true);
    const timer = setTimeout(() => setSyncBadge(false), 1800);
    return () => clearTimeout(timer);
  }, [
    confirmedCustomer?.id,
    confirmedCustomer?.scholarName,
    confirmedCustomer?.institution,
    confirmedCustomer?.department,
    confirmedCustomer?.researchKeywords,
  ]);

  const [customerTraits, setCustomerTraits] = useState<string[]>([
    '急需高分文章过考核',
    '受制于公共平台排期',
    '与临床大主任有深度合作',
  ]);

  const availableTraits = [
    '急需高分文章过考核',
    '受制于公共平台排期',
    '与临床大主任有深度合作',
    '新归国建组急需配齐硬件',
    '年底有预算执行刚需',
    '样本极其珍稀怕测试损耗',
  ];

  const toggleTrait = (tag: string) => {
    if (customerTraits.includes(tag)) {
      setCustomerTraits(customerTraits.filter((t) => t !== tag));
    } else {
      setCustomerTraits([...customerTraits, tag]);
    }
  };

  const activeDim = FIRST_PRINCIPLES.find((s) => s.id === selectedId) || FIRST_PRINCIPLES[0];

  const getContextualTactics = (
    name: string,
    unit: string,
    dept: string,
    dimId: FirstPrincipleDimension['id']
  ) => {
    const targetLabel = name.trim() || `${unit}${dept}老师`;
    const l1Leader =
      confirmedCustomer?.deptLeaderName?.split('（')[0] ||
      (targetLabel.includes('尹芝南')
        ? '尹芝南院长'
        : targetLabel.includes('欧阳') || targetLabel.includes('刘敏')
        ? '刘敏正主任'
        : `${dept}一把手大主任`);
    const l2SubPi =
      confirmedCustomer?.subPiNames?.split('、')[0]?.split('（')[0] ||
      (targetLabel.includes('尹芝南')
        ? '杨恒文副院长/高云飞教授'
        : targetLabel.includes('欧阳') || targetLabel.includes('刘敏')
        ? '欧阳涓行政副主任'
        : `${targetLabel}（或L2分管副职）`);

    if (dimId === 'decision_chain') {
      return {
        keyPerson: `L2分管把关人（${l2SubPi}） ➔ L3平台主管与秘书（防故障与写报告） ➔ L1终审一把手（${l1Leader}）`,
        coreAction: `由售前工程师配合 ${l2SubPi} 用 4.8万 PanoVUE+Olink 免招标测试包2周出高分实测图；同步给平台主管递《防堵孔SOP》，再呈报 ${l1Leader} 终审拍板。`,
        proWeaponScript: `“${targetLabel}您好！针对咱们【${dept}】在「${researchKeywords}」方向的攻坚需求，我们先由应用工程师配合 ${l2SubPi} 走 4.8 万小额测试费（免招标2周交付完整高分 Figure）；同时给平台老师配好《疑难样本防堵孔质控SOP》与 1800 小时开机率论证初稿，顺势呈报 ${l1Leader} 锁定明年大设备预算。”`,
      };
    } else if (dimId === 'budget_verify') {
      return {
        keyPerson: `同级别标杆中心参照 & 【${unit}·${dept}】内部签字链（${l2SubPi} ➔ ${l1Leader}）`,
        coreAction: `展示同级别中心最新「${researchKeywords}」全光谱流式+6色空间病理实测图，当面确认首单测试费走 ${l2SubPi} 子课题号还是院级专项。`,
        proWeaponScript: `“${targetLabel}您好，目前同级别标杆团队做「${researchKeywords}」已经全面升级为40色全光谱流式+6色原位病理。咱们这批预实验如果本周启动，4.8万测试费是直接走 ${l2SubPi} 手头在研课题号签字，还是跟【${dept}】年度重点项目一起走？”`,
      };
    } else if (dimId === 'risk_reversal') {
      return {
        keyPerson: `${l2SubPi} 及一线实验骨干（${confirmedCustomer?.firstAuthorNames?.split('（')[0] || '专职博后/主管技师'}）`,
        coreAction: `技术支持驻场签订《零风险试测保障》：仅取1μL上清液 + 免费盲测2例疑难样本，达不到高分期刊信噪比分文不收。`,
        proWeaponScript: `“${targetLabel}您好，咱们【${dept}】的临床队列与分选样本极其珍贵。我们提供《零风险试测保障》：Olink 仅需 1微升上清；全光谱流式/PanoVUE 6色切片先由应用工程师免费试跑2例样本，跑出满意对比图再走正式测试合同！”`,
      };
    } else {
      return {
        keyPerson: `${l2SubPi}（技术立项发起） × ${l1Leader}（【${unit}】院级千万平台终审拍板）`,
        coreAction: `用首单4.8万预实验高分数据助推 ${l2SubPi} 与 ${l1Leader} 联名提报 300万全光谱流式与空间多组学平台。`,
        proWeaponScript: `“${targetLabel}您好，咱们先把这批「${researchKeywords}」预实验数据跑漂亮放进组会/院务会汇报 PPT，接着我们帮团队起草好《全光谱流式与空间多组学平台联合申购论证报告》，由 ${l2SubPi} 呈报 ${l1Leader} 拍板院级修购专项！”`,
      };
    }
  };

  const tactics = getContextualTactics(customerName, institution, department, selectedId);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-4">
      {!hasRun ? (
        /* MANUAL LAUNCH WORKBENCH (Desktop 12-Col Split) */
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 space-y-6 shadow-lg">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
              <Compass className="w-4 h-4" />
              <span>销售第一性原理 · 手动生成关键人攻关策略</span>
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mt-1">
              关键人攻关与话术生成器
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4 bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-xs sm:text-sm font-bold text-white">
                  01 · 目标单位与关键人定位
                </span>
                <span className="text-[11px] font-mono text-slate-400">支持陌生客户AI猜测匹配</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    目标医院 / 高校
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="如：中山大学附属第一医院"
                    className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    科室 / 实验室
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="如：肿瘤防治中心 / 消化内科"
                    className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    目标客户姓名（陌生客户可填姓氏或留空）
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="如：彭穗（不确定可填姓氏或留空由AI猜）"
                    className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    在研方向或线索关键词
                  </label>
                  <input
                    type="text"
                    value={researchKeywords}
                    onChange={(e) => setResearchKeywords(e.target.value)}
                    placeholder="如：CAR-T 细胞耗竭与肿瘤微环境"
                    className="w-full min-h-[44px] px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <ScholarMatcherBox
                institution={institution}
                department={department}
                scholarName={customerName}
                researchKeywords={researchKeywords}
                knownContext={customerContext}
                onSelectCandidate={(cand) => {
                  setCustomerName(cand.name);
                  setInstitution(cand.institution);
                  setDepartment(cand.department);
                  setResearchKeywords(cand.researchKeywords);
                  if (cand.knownContextSuggestion) {
                    setCustomerContext(cand.knownContextSuggestion);
                  }
                }}
              />
            </div>

            <div className="lg:col-span-5 space-y-4 bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-amber-300 mb-1.5">
                  我对客户的掌握情况描述（预算、平台排期、合作大主任等）
                </label>
                <textarea
                  rows={3}
                  value={customerContext}
                  onChange={(e) => setCustomerContext(e.target.value)}
                  className="w-full p-3.5 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  勾选客户当前处境特征
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableTraits.map((tag) => {
                    const active = customerTraits.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTrait(tag)}
                        className={`min-h-[44px] px-3 py-2 text-xs font-medium rounded-xl border text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/50'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {active ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setHasRun(true)}
                className="w-full min-h-[52px] bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-[0.99] text-slate-950 font-bold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>手动运行 · 生成关键人攻关策略与话术</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* 1. COMPACT MOBILE HEADER WITH CUSTOMER INPUT */}
          <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono text-amber-400">
                  <Compass className="w-3.5 h-3.5" />
                  <span>成单攻关指南 · {institution} · {department}</span>
                  {syncBadge && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/50 text-emerald-300">
                      ✓ 已同步最新目标客户
                    </span>
                  )}
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-white mt-0.5 truncate">
                  目标对象：{customerName}（{researchKeywords}）
                </h1>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{customerContext}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setSyncBadge(true);
                    setTimeout(() => setSyncBadge(false), 1800);
                  }}
                  className="min-h-[42px] px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>手动运行 / 刷新攻关策略</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditCustomerOpen(true)}
                  className="min-h-[42px] px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-amber-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>修改单位与对象</span>
                </button>
              </div>
            </div>
          </section>

          {/* 2. MOBILE THUMB-ZONE 4-STAGE SEGMENTED SWITCHER */}
          <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl grid grid-cols-4 gap-1">
            {FIRST_PRINCIPLES.map((dim) => {
              const active = dim.id === selectedId;
              const isUnvisited = !visitedIds.includes(dim.id);
              return (
                <button
                  key={dim.id}
                  onClick={() => {
                    setSelectedId(dim.id);
                    if (!visitedIds.includes(dim.id)) {
                      setVisitedIds((prev) => [...prev, dim.id]);
                    }
                  }}
                  className={`relative min-h-[48px] rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 font-medium'
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono leading-none ${
                      active ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {dim.num}
                  </span>
                  <span className="text-xs mt-1 leading-none">{dim.shortLabel}</span>
                  {isUnvisited && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* 3. CORE TACTIC LIST ROWS */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-amber-400">{activeDim.metaTag}</span>
                <h2 className="text-sm font-bold text-white">{activeDim.shortBullet}</h2>
              </div>
            </div>

            <div className="divide-y divide-slate-800/80">
              <button
                onClick={() =>
                  setDetailModal({
                    category: `${activeDim.name} · 现场标准话术`,
                    title: `针对【${institution} · ${customerName}】的一句话动作`,
                    summary: `关键决策链：${tactics.keyPerson}\n\n核心执行动作：${tactics.coreAction}`,
                    script: tactics.proWeaponScript,
                  })
                }
                className="w-full min-h-[72px] p-4 text-left hover:bg-slate-800/40 active:bg-slate-800/70 transition-colors flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>核心执行动作（点击展开照念话术）</span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white mt-1 line-clamp-1">
                    {tactics.coreAction}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              </button>

              <button
                onClick={() =>
                  setDetailModal({
                    category: `${activeDim.name} · 死结与解法`,
                    title: '常见卡单死结 vs 第一性原理解法',
                    summary: `【常见卡单死结】\n${activeDim.realWorldProblem}\n\n【第一性原理解法】\n${activeDim.actionableSolution}`,
                  })
                }
                className="w-full min-h-[64px] p-4 text-left hover:bg-slate-800/40 active:bg-slate-800/70 transition-colors flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-mono text-cyan-400">
                    底层逻辑 · 为什么普通销售容易卡单？
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5 line-clamp-1">
                    {activeDim.actionableSolution}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              </button>
            </div>
          </div>

          {/* 4. 3 PRE-VISIT CHECKLIST ITEMS & TRAITS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>进门前必查 3 个关键点</span>
              </div>
              <div className="space-y-2">
                {activeDim.prepChecklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="min-h-[44px] p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 flex items-center gap-2.5"
                  >
                    <span className="font-mono font-bold text-cyan-400 shrink-0">0{idx + 1}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>客户处境特征（点击切换）</span>
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {availableTraits.map((tag) => {
                    const active = customerTraits.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTrait(tag)}
                        className={`min-h-[40px] px-2.5 py-1.5 text-[11px] font-medium rounded-xl border text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/50'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {active ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-emerald-950/25 border border-emerald-800/50 rounded-xl text-xs text-emerald-200 leading-relaxed">
                <strong>策略结论：</strong>结合「{customerTraits.slice(0, 2).join(' · ')}」，先签 4.8万预实验测试包，再由 {customerName} 引见【{institution}】科室大主任锁死千万级平台预算。
              </div>
            </div>
          </div>

          <OffScreenReminderBar
            activeTabId={selectedId}
            tabs={FIRST_PRINCIPLES.map((d) => ({ id: d.id, label: d.shortLabel }))}
            visitedTabIds={visitedIds}
            onSelectTab={(id) => {
              setSelectedId(id as FirstPrincipleDimension['id']);
              if (!visitedIds.includes(id)) {
                setVisitedIds((prev) => [...prev, id]);
              }
            }}
          />
        </>
      )}

      {/* SLIDE-UP BOTTOM SHEET: EDIT CUSTOMER & UNIT */}
      {isEditCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-end md:items-center justify-center animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-slate-900 border-t md:border border-slate-800 rounded-t-3xl md:rounded-2xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto my-2.5 md:hidden shrink-0" />
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold text-white">设置目标单位、客户与我方掌握情况</h3>
              <button
                onClick={() => setIsEditCustomerOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    目标医院 / 高校
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    科室 / 实验室
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    目标客户姓名（陌生客户可填姓氏或留空）
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    在研方向关键词
                  </label>
                  <input
                    type="text"
                    value={researchKeywords}
                    onChange={(e) => setResearchKeywords(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <ScholarMatcherBox
                institution={institution}
                department={department}
                scholarName={customerName}
                researchKeywords={researchKeywords}
                knownContext={customerContext}
                onSelectCandidate={(cand) => {
                  setCustomerName(cand.name);
                  setInstitution(cand.institution);
                  setDepartment(cand.department);
                  setResearchKeywords(cand.researchKeywords);
                  if (cand.knownContextSuggestion) {
                    setCustomerContext(cand.knownContextSuggestion);
                  }
                }}
              />

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  我对客户的掌握情况描述
                </label>
                <textarea
                  rows={3}
                  value={customerContext}
                  onChange={(e) => setCustomerContext(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl text-white resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/90 shrink-0">
              <button
                onClick={() => {
                  confirmCustomer({
                    institution,
                    department,
                    scholarName: customerName.trim() || '欧阳涓',
                    researchKeywords,
                    verifiedReason: customerContext,
                  });
                  setIsEditCustomerOpen(false);
                }}
                className="w-full min-h-[48px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl cursor-pointer"
              >
                保存并全局同步攻关话术
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-UP BOTTOM SHEET: SCRIPT & BREAKDOWN VIEWER */}
      {detailModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-end md:items-center justify-center animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 border-t md:border border-slate-800 rounded-t-3xl md:rounded-2xl max-h-[84vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto my-2.5 md:hidden shrink-0" />
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-mono font-bold text-amber-400">
                {detailModal.category}
              </span>
              <button
                onClick={() => setDetailModal(null)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <h3 className="text-base font-bold text-white">{detailModal.title}</h3>
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                {detailModal.summary}
              </div>

              {detailModal.script && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">现场照念标准话术</span>
                    <button
                      onClick={() => handleCopy(detailModal.script!)}
                      className="min-h-[36px] px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>复制话术</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-3.5 bg-slate-950 border border-cyan-500/30 rounded-xl text-xs sm:text-sm text-slate-100 leading-relaxed">
                    {detailModal.script}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/90 shrink-0">
              <button
                onClick={() => setDetailModal(null)}
                className="w-full min-h-[48px] bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
