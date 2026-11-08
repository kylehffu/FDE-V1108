import React, { useEffect, useState } from 'react';
import {
  X,
  Sparkles,
  AlertCircle,
  BookOpen,
  Wallet,
  Users,
  HelpCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react';
import { ScholarMatcherBox } from './ScholarMatcherBox';
import { useCustomerContext } from '../context/CustomerContext';

interface AiTacticalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultScholarName?: string;
  defaultResearchField?: string;
}

function buildClientDynamicDeduction(params: {
  institution: string;
  department: string;
  scholarName: string;
  researchField: string;
  currentEquipment: string;
  fundingRange: string;
  feedbackText: string;
}) {
  const unitLabel = `${params.institution || '目标医院'}·${params.department || '相关科室'}`;
  const targetName = (params.scholarName || `${unitLabel}课题组负责人`).trim();
  const shortName = targetName.replace(/教授|老师|主任|研究员|博士/g, '').trim() || targetName;
  const field = (params.researchField || 'CAR-T细胞衰竭与实体瘤原位浸润').trim();
  const equip = (params.currentEquipment || '常规流式细胞仪与普通单色免疫组化').trim();
  const funding = (params.fundingRange || '手头仅有30万国自然青年基金').trim();

  const isHighBudget =
    funding.includes('百万') ||
    funding.includes('100') ||
    funding.includes('500') ||
    funding.includes('重点') ||
    funding.includes('杰青') ||
    funding.includes('优青');

  return {
    inferredScholarNote: params.scholarName.trim()
      ? `已定位目标：【${unitLabel}】${params.scholarName}`
      : `AI 根据【${unitLabel}】与「${field}」线索，自动按该科室主攻PI画像生成应对方案`,
    needAnalysis: {
      scientificGap: `「${equip}」打碎组织丢失原位空间距离，且微升级样本用常规 ELISA 无法检出细胞因子。`,
      personalWin: `急需在 4-8 周内拿到「空间6色原位病理 + 1μL超微量蛋白组」数据回复顶刊审稿人。`,
    },
    affordabilityStrategy: {
      selectedPath: isHighBudget
        ? '路径 A：大额 CapEx 旗舰设备控标'
        : '路径 B：4.8万小额测试费直签（免招标）',
      recommendedProducts: isHighBudget
        ? [
            'Cytek Aurora CS 全光谱流式分选系统',
            'Indica Labs HALO 数字病理空间工作站',
          ]
        : [
            `PanoVUE 6-8色空间荧光外包服务（定制「${field}」Panel）`,
            'Olink 96 超微量靶向蛋白组检测（仅需 1μL 样本）',
          ],
      dealValue: isHighBudget ? '180万 - 350万元（院级设备招标）' : '4.8万 - 6.5万元（测试费直接报销）',
      pitchNarrative: `“${shortName}老师，既然目前账上是【${funding}】，不用硬凑百万预算买机器。直接从课题测试费划出 4.8 万元，我们用 PanoVUE 6色空间病理 + 1微升 Olink 蛋白组帮您跑这批样本，两周直接交付 15 分顶刊 Figure！”`,
    },
    socialLeverage: {
      peerProbingScript: `“${shortName}老师，同城好几个做「${field}」的团队都在补空间多组学证据。咱们【${unitLabel}】合作的临床大主任里，哪位今年刚批了重点专科经费准备升级流式和病理平台？”`,
      warmIntroTarget: `【${unitLabel}】合作紧密的临床重点专科大主任（手握千万级专项经费）`,
      hookBenefit: `先用 4.8万外包帮${shortName}老师跑出顶刊大图，再由其引荐给科室大主任联合申报院级平台设备；设备落地后享免费优先上机。`,
    },
    masterPlaybook: {
      niJianweiTactic: `发起人（给顶刊补实验排期） + 平台把关人（给《防堵孔质控免责SOP》） + 科室大主任（给重点专科硬件指标）。`,
      aliIronArmyTactic: `展示同城标杆课题组最新 6色病理实测图；追问测试费走个人国自然还是科室重点专科（3秒验明签字权）。`,
      mentorAdvice: `现场拍板“免费试跑2例预实验切片（达不到15分期刊画质分文不收）”，打消顾虑当场锁单。`,
    },
    goldenThreeQuestions: [
      `“${shortName}老师，做「${field}」用现有「${equip}」，最头疼的是不是看不清原位浸润距离、微量样本ELISA又测不出因子？”`,
      `“既然目前经费是【${funding}】，不如先用 4.8万测试费（免招标），两周内由我们直接交付一套 6色空间病理 + 1微升 Olink 顶刊数据？”`,
      `“等两周后跑出漂亮数据搞定审稿人，您跟临床大主任合报院级平台设备时，能不能带我们一起把全光谱流式和空间病理规划进去？”`,
    ],
  };
}

export const AiTacticalDrawer: React.FC<AiTacticalDrawerProps> = ({
  isOpen,
  onClose,
  defaultScholarName = '',
  defaultResearchField = '',
}) => {
  const { confirmedCustomer, confirmCustomer } = useCustomerContext();

  const [institution, setInstitution] = useState(
    confirmedCustomer?.institution || '中山大学附属第一医院'
  );
  const [department, setDepartment] = useState(
    confirmedCustomer?.department || '医学检验科'
  );
  const [scholarName, setScholarName] = useState(
    defaultScholarName || confirmedCustomer?.scholarName || '欧阳涓'
  );
  const [researchField, setResearchField] = useState(
    defaultResearchField ||
      confirmedCustomer?.researchKeywords ||
      '流式细胞免疫分型 血液肿瘤MRD'
  );
  const [currentEquipment, setCurrentEquipment] = useState(
    confirmedCustomer?.procurementHistoryClue ||
      '常规8-12色流式细胞仪，普通单色IHC，微量样本ELISA耗样量大'
  );
  const [fundingRange, setFundingRange] = useState(
    'L2分管副职/子课题PI握有≤5万元测试费直签权 + 院级年度修购专项'
  );
  const [feedbackText, setFeedbackText] = useState(
    '老师说：“今年大设备预算还要等院里统一论证，而且珍贵临床/分选样本量极少，常规方法怕测坏了。”'
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(() =>
    buildClientDynamicDeduction({
      institution: confirmedCustomer?.institution || '中山大学附属第一医院',
      department: confirmedCustomer?.department || '医学检验科',
      scholarName: defaultScholarName || confirmedCustomer?.scholarName || '欧阳涓',
      researchField:
        defaultResearchField ||
        confirmedCustomer?.researchKeywords ||
        '流式细胞免疫分型 血液肿瘤MRD',
      currentEquipment:
        confirmedCustomer?.procurementHistoryClue ||
        '常规8-12色流式细胞仪，普通单色IHC',
      fundingRange: 'L2分管副职/子课题PI握有≤5万元测试费直签权',
      feedbackText:
        '老师说：“今年大设备预算还要等院里统一论证，而且珍贵临床/分选样本量极少，常规方法怕测坏了。”',
    })
  );
  const [error, setError] = useState<string | null>(null);
  const [showScripts, setShowScripts] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    if (!confirmedCustomer) return;
    const nextInst = confirmedCustomer.institution;
    const nextDept = confirmedCustomer.department;
    const nextScholar = defaultScholarName || confirmedCustomer.scholarName;
    const nextField = defaultResearchField || confirmedCustomer.researchKeywords;
    const nextEquip =
      confirmedCustomer.procurementHistoryClue ||
      '常规流式细胞仪通道受限，单细胞悬液丢失原位空间距离';
    setInstitution(nextInst);
    setDepartment(nextDept);
    setScholarName(nextScholar);
    setResearchField(nextField);
    setCurrentEquipment(nextEquip);
    setResult(
      buildClientDynamicDeduction({
        institution: nextInst,
        department: nextDept,
        scholarName: nextScholar,
        researchField: nextField,
        currentEquipment: nextEquip,
        fundingRange,
        feedbackText,
      })
    );
  }, [
    confirmedCustomer?.id,
    confirmedCustomer?.scholarName,
    defaultScholarName,
    defaultResearchField,
  ]);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1800);
  };

  const handleRunDeduction = async () => {
    confirmCustomer({
      institution,
      department,
      scholarName: scholarName.trim() || '欧阳涓',
      researchKeywords: researchField,
      procurementHistoryClue: currentEquipment,
    });
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gemini/deduce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institution,
          department,
          scholarName,
          researchField,
          currentEquipment,
          fundingRange,
          feedbackText,
        }),
      });

      const rawText = await response.text();
      let parsedData: any = null;
      if (rawText && !rawText.trim().startsWith('<')) {
        try {
          const json = JSON.parse(rawText);
          if (json && json.data) {
            parsedData = json.data;
          }
        } catch {
          // fallback below
        }
      }

      if (parsedData) {
        setResult(parsedData);
      } else {
        setResult(
          buildClientDynamicDeduction({
            institution,
            department,
            scholarName,
            researchField,
            currentEquipment,
            fundingRange,
            feedbackText,
          })
        );
      }
    } catch {
      setResult(
        buildClientDynamicDeduction({
          institution,
          department,
          scholarName,
          researchField,
          currentEquipment,
          fundingRange,
          feedbackText,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end bg-slate-950/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div className="w-full md:max-w-2xl lg:max-w-3xl h-[92vh] md:h-full bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 rounded-t-3xl md:rounded-none shadow-2xl flex flex-col overflow-hidden">
        {/* Mobile Grab Handle */}
        <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto my-2.5 md:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">现场异议快推（支持陌生客户猜测）</h2>
              <p className="text-[11px] text-slate-400">
                输入单位与客户当面拒词 · 3秒生成降维接招话术
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Mobile-Ergonomic Input Form */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  目标医院 / 高校
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="如：中山大学附属第一医院"
                  className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  科室 / 实验室
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="如：肿瘤防治中心 / 消化内科"
                  className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  目标客户姓名（不确定可填姓氏或留空）
                </label>
                <input
                  type="text"
                  value={scholarName}
                  onChange={(e) => setScholarName(e.target.value)}
                  placeholder="如：彭穗（陌生客户可留空让AI猜）"
                  className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  在研课题方向
                </label>
                <input
                  type="text"
                  value={researchField}
                  onChange={(e) => setResearchField(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  现有仪器与痛点
                </label>
                <input
                  type="text"
                  value={currentEquipment}
                  onChange={(e) => setCurrentEquipment(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  我掌握的客户经费实情
                </label>
                <input
                  type="text"
                  value={fundingRange}
                  onChange={(e) => setFundingRange(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white"
                />
              </div>
            </div>

            <ScholarMatcherBox
              institution={institution}
              department={department}
              scholarName={scholarName}
              researchKeywords={researchField}
              knownContext={fundingRange}
              onSelectCandidate={(cand) => {
                setScholarName(cand.name);
                setInstitution(cand.institution);
                setDepartment(cand.department);
                setResearchField(cand.researchKeywords);
                if (cand.knownContextSuggestion) {
                  setFundingRange(cand.knownContextSuggestion);
                }
              }}
            />

            <div>
              <label className="block text-[11px] font-medium text-amber-300 mb-1">
                客户现场原话 / 异议拒词
              </label>
              <textarea
                rows={2}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full p-3 text-xs sm:text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white resize-none leading-relaxed"
              />
            </div>

            <button
              onClick={handleRunDeduction}
              disabled={loading}
              className="w-full min-h-[48px] py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 active:scale-[0.99] disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>正在生成现场接招方案...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>手动运行 · 生成现场破局要点</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-start gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Crisp Key-Point Output */}
          {result && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {result.inferredScholarNote && (
                <div className="px-3.5 py-2 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200">
                  {result.inferredScholarNote}
                </div>
              )}

              {/* 1. Core Need */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1.5 text-xs sm:text-sm">
                <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>01 · 核心痛点与个人刚需</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  <strong className="text-slate-100">实验卡点：</strong>
                  {result.needAnalysis?.scientificGap}
                </p>
                <p className="text-slate-300 leading-relaxed">
                  <strong className="text-cyan-300">个人刚需：</strong>
                  {result.needAnalysis?.personalWin}
                </p>
              </div>

              {/* 2. Affordability & Package */}
              <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" />
                    <span>02 · 降维落地方案</span>
                  </span>
                  <span className="text-xs font-mono text-emerald-300">
                    {result.affordabilityStrategy?.dealValue}
                  </span>
                </div>
                <div className="space-y-1 text-slate-200">
                  {result.affordabilityStrategy?.recommendedProducts?.map(
                    (p: string, idx: number) => (
                      <div key={idx} className="text-xs sm:text-sm">
                        · {p}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* 3. Decision Chain & Leverage */}
              <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-4 space-y-1.5 text-xs sm:text-sm">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>03 · 决策链搞定与跳板裂变</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  <strong className="text-amber-300">引荐目标：</strong>
                  {result.socialLeverage?.warmIntroTarget}
                </p>
                {result.masterPlaybook && (
                  <p className="text-slate-300 leading-relaxed">
                    <strong className="text-emerald-300">当场拍板：</strong>
                    {result.masterPlaybook.mentorAdvice}
                  </p>
                )}
              </div>

              {/* 4. Expandable Verbatim Scripts */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <button
                  onClick={() => setShowScripts(!showScripts)}
                  className="w-full min-h-[44px] flex items-center justify-between text-xs sm:text-sm font-bold text-indigo-400 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    <span>现场直接照念：破局话术与三连问</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <span>{showScripts ? '收起' : '展开话术'}</span>
                    {showScripts ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </span>
                </button>

                {showScripts && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-2.5 text-xs sm:text-sm animate-in fade-in duration-150">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-100 leading-relaxed space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-cyan-400">当面回应主话术</span>
                        <button
                          onClick={() =>
                            handleCopy(result.affordabilityStrategy?.pitchNarrative || '')
                          }
                          className="min-h-[32px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                        >
                          {copiedText === result.affordabilityStrategy?.pitchNarrative ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">已复制</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>复制</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p>{result.affordabilityStrategy?.pitchNarrative}</p>
                    </div>

                    {result.goldenThreeQuestions?.map((q: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl text-slate-200 flex items-start gap-2 leading-relaxed"
                      >
                        <span className="font-mono font-bold text-indigo-400 shrink-0">
                          Q{idx + 1}.
                        </span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 shrink-0">
          <button
            onClick={onClose}
            className="w-full min-h-[48px] bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm cursor-pointer"
          >
            关闭推演抽屉
          </button>
        </div>
      </div>
    </div>
  );
};
