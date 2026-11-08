import React, { useEffect, useState } from 'react';
import { SCHOLARS_NETWORK } from '../data/mockData';
import { ScholarNode } from '../types';
import { JointDocModal } from './JointDocModal';
import { useCustomerContext, ConfirmedCustomerProfile } from '../context/CustomerContext';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  BookOpen,
  Wallet,
  Users,
  Mic,
  FileText,
  Award,
  CheckCircle2,
  ChevronRight,
  Zap,
  ArrowRight,
  Flame,
  Radio,
  Check,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { ScholarMatcherBox } from './ScholarMatcherBox';

interface FieldCopilotViewProps {
  onOpenAiDeduce: () => void;
  onNavigateToCrawler?: () => void;
}

function buildScholarNodeFromProfile(
  profile: ConfirmedCustomerProfile | null,
  fallbackName: string,
  fallbackInst: string,
  fallbackDept: string,
  fallbackKw: string
): ScholarNode {
  const name = profile?.scholarName || fallbackName || '欧阳涓';
  const inst = profile?.institution || fallbackInst || '中山大学附属第一医院';
  const dept = profile?.department || fallbackDept || '医学检验科';
  const kw = profile?.researchKeywords || fallbackKw || '流式细胞免疫分型与肿瘤免疫微环境';

  const isYinZhinan =
    name.includes('尹芝南') ||
    name.includes('向征') ||
    name.includes('吴扬哲') ||
    name.includes('杨恒文') ||
    name.includes('高云飞') ||
    name.includes('罗钧洪') ||
    ((inst.includes('暨德康民') || inst.includes('暨安特博')) && !name);
  const isLabMedicine =
    !isYinZhinan &&
    (name.includes('欧阳') ||
      name.includes('刘敏') ||
      (!name && dept.includes('检验')));
  const isL1 =
    name.includes('尹芝南') ||
    name.includes('刘敏') ||
    name.includes('陈旻湖') ||
    name.includes('匡铭');

  return {
    id: profile?.id || 'custom-scholar',
    name,
    role: isL1 ? 'ClinicalDirector' : 'PI',
    avatarSeed: profile?.id || name,
    title:
      profile?.title ||
      (isYinZhinan
        ? '生物医学转化研究院院长 · 广东暨德康民创始人(持股~33%) · 广东暨安特博科学创始人 · 国家杰青(30725015)/973首席'
        : isLabMedicine
        ? name.includes('刘敏')
          ? '医学检验科正主任 / 主任技师（L1一把手 · 主持国自然/国家863子课题/省市重大专项）'
          : '医学检验科行政副主任 / 主任技师（L2分管流式 · 省精准医学临床细胞分析分会首届主委）'
        : '教授 / 学科带头人 / 主任'),
    institution: `${inst} · ${dept}`,
    department: dept,
    researchField: kw,
    fundingLevel: isL1 ? 'CapEx_High' : 'OpEx_Mid',
    fundingSource: isYinZhinan
      ? '【院外企业】广东暨德康民B轮数千万(广州健康产投基金2025.12领投+广州银行授信) + 广东暨安特博数千万VC(真格基金/香商投资)；【院内纵向】国自然重点(318300xx ~300万)/973首席(2000万+)/国家杰青(30725015)及子课题面上/海外优青(200-400万)'
      : isLabMedicine
      ? '国家临床重点专科建设经费 + 国自然/国家863计划子课题/省科技厅/广州市协同创新重大专项 + 越秀本部与南沙院区年度设备预算'
      : '在研国自然面上/重点项目经费 & 科室年度设备修购专项',
    fundingAmountRMB: isYinZhinan
      ? 'B轮数千万+重点300万'
      : isLabMedicine
      ? '重点专科+863/国自然'
      : isL1
      ? '重点专项500万+'
      : '国自然面上60万',
    recentPaperTitle: isYinZhinan
      ? 'IL-27 signaling promotes adipocyte thermogenesis (Nature 2021 赋权转化暨安特博) & Allogeneic Vγ9Vδ2-T (GDKM-100) Phase I translation'
      : isLabMedicine
      ? 'High-sensitivity multiparameter spectral flow cytometry for minimal residual disease (MRD) monitoring'
      : `High-dimensional immune profiling and spatial neighborhood analysis in ${kw}`,
    journal: isYinZhinan
      ? 'Nature (2021) / STTT / JCI (2024-2025)'
      : isLabMedicine
      ? 'Cytometry Part B / 中华检验医学杂志 (2025)'
      : 'Journal of Hematology & Oncology (2025)',
    impactFactor: isYinZhinan ? 64.8 : 16.5,
    paperDefect: isYinZhinan
      ? '广东暨德康民核心管线「同种异体Vγ9Vδ2-T细胞注射液(GDKM-100)」已在暨大附一院启动晚期肝癌I期临床，急需符合IND规范的高维流式放行质控、15μm肿瘤原位杀伤空间共定位及1μL超微量细胞因子监测。'
      : isLabMedicine
      ? 'CAR-T治疗后与疑难血液肿瘤MRD监测面临抗原漂移与传统8-10色流式通道瓶颈，且重症患者微量骨髓/血清标本难以用传统ELISA同时测齐CRS细胞因子谱。'
      : `常规流式或单细胞悬液打碎了组织空间结构，急需补充「${kw}」单张切片6-8色空间原位共染与1μL超微量蛋白组数据。`,
    installedBase: [
      profile?.procurementHistoryClue ||
        (isYinZhinan
          ? '院内转化院流式平台机时饱和，院外广东暨德康民(B轮到账)与广东暨安特博(真格投资)具备独立企业商业采购通道（免高校招标）'
          : isLabMedicine
          ? '现有8-10色常规流式面临MRD高敏监测通道瓶颈，正评估全光谱流式与多因子新项目'
          : '科室存量常规基础流式/显微镜面临高维通道升级窗口'),
    ],
    personalWin: isYinZhinan
      ? '双线突破：① 商务快线对接向征博士（转化院PI兼广东暨德康民执行总经理/CTO），用企业B轮商业资金免高校招标直签GDKM-100临床I期质控耗材与服务；② 院内线配合吴扬哲副院长及杨恒文/高云飞/罗钧洪教授跑通空间6色大图，支撑尹芝南院长拍板院内修购与珠海市人民医院精准医学平台！'
      : isLabMedicine
      ? '由售前工程师驻场免费试跑2例疑难骨髓样本24色全光谱MRD与1μL因子快检，帮欧阳涓副主任（省临床细胞分析分会首届主委）快速完成新项目立项并呈报正主任刘敏终审拍板。'
      : `免走漫长设备招标，2周内用小额测试费交付高分实测Figure，并由L2分管二当家联合科研秘书提报下一年度300万级平台采购计划。`,
    x: 300,
    y: 250,
  };
}

export const FieldCopilotView: React.FC<FieldCopilotViewProps> = ({
  onOpenAiDeduce,
  onNavigateToCrawler,
}) => {
  const { confirmedCustomer, confirmCustomer } = useCustomerContext();

  const [hasRun, setHasRun] = useState(true);
  const [institution, setInstitution] = useState(
    confirmedCustomer?.institution || '中山大学附属第一医院'
  );
  const [department, setDepartment] = useState(
    confirmedCustomer?.department || '医学检验科'
  );
  const [customScholarName, setCustomScholarName] = useState(
    confirmedCustomer?.scholarName || '欧阳涓'
  );
  const [researchKeywords, setResearchKeywords] = useState(
    confirmedCustomer?.researchKeywords || '流式细胞免疫分型 血液肿瘤MRD'
  );
  const [customNotes, setCustomNotes] = useState(
    confirmedCustomer?.verifiedReason ||
      'L2分管副主任/子课题实权PI握有≤5万元测试费直签权，正处于新项目验证与年度设备报计划窗口。'
  );
  const [selectedScholar, setSelectedScholar] = useState<ScholarNode>(() =>
    buildScholarNodeFromProfile(
      confirmedCustomer,
      confirmedCustomer?.scholarName || '欧阳涓',
      confirmedCustomer?.institution || '中山大学附属第一医院',
      confirmedCustomer?.department || '医学检验科',
      confirmedCustomer?.researchKeywords || '流式细胞免疫分型 血液肿瘤MRD'
    )
  );
  const [currentPhase, setCurrentPhase] = useState<'pre' | 'in' | 'post'>('pre');
  const [salesMode] = useState<'junior' | 'senior'>('senior');
  const [syncPulse, setSyncPulse] = useState(false);

  // Interactive dialogue state in Phase 2
  const [step1Answered, setStep1Answered] = useState(false);
  const [step2Signed, setStep2Signed] = useState(false);
  const [step3Agreed, setStep3Agreed] = useState(false);

  // Phase 3 voice debrief
  const [isRecording, setIsRecording] = useState(false);
  const [voiceDebriefFinished, setVoiceDebriefFinished] = useState(false);
  const [activeDocModal, setActiveDocModal] = useState<'protocol' | 'co_purchase' | null>(null);

  // Automatically synchronize whenever confirmedCustomer changes!
  useEffect(() => {
    if (!confirmedCustomer) return;
    setInstitution(confirmedCustomer.institution);
    setDepartment(confirmedCustomer.department);
    setCustomScholarName(confirmedCustomer.scholarName);
    setResearchKeywords(confirmedCustomer.researchKeywords);
    setCustomNotes(
      confirmedCustomer.verifiedReason ||
        `${confirmedCustomer.institution}·${confirmedCustomer.department}，主攻「${confirmedCustomer.researchKeywords}」。建议先由售前工程师配合L2二当家（${
          confirmedCustomer.subPiNames?.split('、')[0] || '分管副职'
        }）切入，再报L1一把手（${
          confirmedCustomer.deptLeaderName?.split('（')[0] || confirmedCustomer.scholarName
        }）终审拍板。`
    );
    setSelectedScholar(
      buildScholarNodeFromProfile(
        confirmedCustomer,
        confirmedCustomer.scholarName,
        confirmedCustomer.institution,
        confirmedCustomer.department,
        confirmedCustomer.researchKeywords
      )
    );
    setStep1Answered(false);
    setStep2Signed(false);
    setStep3Agreed(false);
    setVoiceDebriefFinished(false);
    setHasRun(true);
    setSyncPulse(true);
    const t = setTimeout(() => setSyncPulse(false), 1800);
    return () => clearTimeout(t);
  }, [
    confirmedCustomer?.id,
    confirmedCustomer?.scholarName,
    confirmedCustomer?.institution,
    confirmedCustomer?.department,
    confirmedCustomer?.researchKeywords,
  ]);

  const handleManualReRun = () => {
    const nextScholar = buildScholarNodeFromProfile(
      confirmedCustomer,
      customScholarName,
      institution,
      department,
      researchKeywords
    );
    setSelectedScholar(nextScholar);
    setStep1Answered(false);
    setStep2Signed(false);
    setStep3Agreed(false);
    setVoiceDebriefFinished(false);
    setHasRun(true);
    setSyncPulse(true);
    setTimeout(() => setSyncPulse(false), 1800);
  };

  // Dynamic role names for scripts
  const isYinZhinan =
    selectedScholar.name.includes('尹芝南') ||
    selectedScholar.name.includes('向征') ||
    selectedScholar.name.includes('吴扬哲') ||
    selectedScholar.name.includes('杨恒文') ||
    selectedScholar.name.includes('高云飞') ||
    selectedScholar.name.includes('罗钧洪') ||
    ((institution.includes('暨德康民') || institution.includes('暨安特博')) && !selectedScholar.name);
  const isLabMedicine =
    !isYinZhinan &&
    (selectedScholar.name.includes('欧阳') ||
      selectedScholar.name.includes('刘敏') ||
      (!selectedScholar.name && department.includes('检验')));

  const l1BossName = isYinZhinan
    ? '尹芝南院长（转化院院长 + 暨德康民/暨安特博实控人）'
    : isLabMedicine
    ? '刘敏正主任'
    : confirmedCustomer?.deptLeaderName?.split('（')[0] || `${selectedScholar.name}主任`;

  const l2SubPiName = isYinZhinan
    ? '向征博士(暨德康民执行总经理兼CTO) / 吴扬哲副院长 / 杨恒文 / 高云飞 / 罗钧洪'
    : isLabMedicine
    ? '欧阳涓副主任（省临床细胞分析分会首届主委）'
    : confirmedCustomer?.subPiNames?.split('、')[0]?.split('（')[0] || `${selectedScholar.name}老师`;

  const l3GatekeeperName = isYinZhinan
    ? '流式分选平台主管 & 暨德康民CMC/QC主管'
    : isLabMedicine
    ? '张式鸿老师与检验科秘书'
    : '平台主管与科研秘书';

  const partnerJumpboardName = isYinZhinan
    ? '广东暨德康民(B轮数千万·GDKM-100 I期临床) & 广东暨安特博(真格投资) & 珠海市人民医院'
    : isLabMedicine
    ? '血液内科李娟教授团队（院内MRD核心送检临床方）'
    : `${institution}重点专科临床队列合作PI`;

  const handleSignOpExDeal = () => {
    setStep2Signed(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#10b981', '#f59e0b'],
    });
  };

  const handleStartVoiceRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setVoiceDebriefFinished(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }, 2200);
  };

  if (!hasRun) {
    return (
      <div className="space-y-4">
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-lg">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>拜访话术与技术配合 · 手动配置与全局同步</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                设置或切换目标客户（保存后自动同步全系统）
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setHasRun(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              返回当前演练视图
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                目标医院 / 高校
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="如：暨南大学 / 中山大学附属第一医院"
                className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                科室 / 研究院
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="如：生物医学转化研究院 / 医学检验科"
                className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                目标客户姓名
              </label>
              <input
                type="text"
                value={customScholarName}
                onChange={(e) => setCustomScholarName(e.target.value)}
                placeholder="如：尹芝南 / 欧阳涓 / 刘敏"
                className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                核心研究 / 业务方向关键词
              </label>
              <input
                type="text"
                value={researchKeywords}
                onChange={(e) => setResearchKeywords(e.target.value)}
                placeholder="如：γδ T细胞肿瘤免疫治疗 IL-27代谢免疫"
                className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white"
              />
            </div>
          </div>

          <ScholarMatcherBox
            institution={institution}
            department={department}
            scholarName={customScholarName}
            researchKeywords={researchKeywords}
            knownContext={customNotes}
            onSelectCandidate={(cand) => {
              setCustomScholarName(cand.name);
              setInstitution(cand.institution);
              setDepartment(cand.department);
              setResearchKeywords(cand.researchKeywords);
              if (cand.knownContextSuggestion) {
                setCustomNotes(cand.knownContextSuggestion);
              }
              setHasRun(true);
            }}
          />

          <div>
            <label className="block text-xs font-semibold text-amber-300 mb-1">
              现场掌握情况补充
            </label>
            <textarea
              rows={3}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white resize-none leading-relaxed"
            />
          </div>

          <button
            onClick={() => {
              confirmCustomer({
                institution,
                department,
                scholarName: customScholarName.trim() || '欧阳涓',
                researchKeywords,
                verifiedReason: customNotes,
              });
              setHasRun(true);
            }}
            className="w-full min-h-[52px] bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>手动运行并全局同步「{customScholarName || '当前客户'}」拜访推演</span>
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-cyan-400">
              <Sparkles className="w-4 h-4" />
              <span>
                现场拜访与技术配合副驾驶 · 当前客户：{selectedScholar.name}（{institution} · {department}）
              </span>
              {syncPulse && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[11px] font-mono">
                  ✓ 已同步最新目标客户
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{customNotes}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleManualReRun}
              className="min-h-[40px] px-3.5 py-1.5 text-xs font-extrabold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>手动运行 / 刷新推演</span>
            </button>
            <button
              type="button"
              onClick={() => setHasRun(false)}
              className="min-h-[40px] px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>修改演练参数 / 换客户</span>
            </button>
            {onNavigateToCrawler && (
              <button
                type="button"
                onClick={onNavigateToCrawler}
                className="min-h-[40px] px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>去实时课题动态</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3-Phase Navigation Stepper */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => setCurrentPhase('pre')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentPhase === 'pre'
              ? 'bg-slate-900 border-cyan-500/60 shadow-sm'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono text-cyan-400 font-bold">PHASE 01</span>
            <span className="text-slate-500">拜访前 30秒准备</span>
          </div>
          <div className="text-sm font-semibold text-white">
            「{selectedScholar.name}」底牌透视卡
          </div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            实验痛点、经费走账权限与内部L1/L2分工
          </p>
        </button>

        <button
          onClick={() => setCurrentPhase('in')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentPhase === 'in'
              ? 'bg-slate-900 border-emerald-500/60 shadow-sm'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono text-emerald-400 font-bold">PHASE 02</span>
            <span className="text-slate-500">现场面对面沟通</span>
          </div>
          <div className="text-sm font-semibold text-white">顾问式实战三连问</div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            刺穿「{researchKeywords.slice(0, 12)}」痛点 ➔ 4.8万直签 ➔ 联动{l1BossName}
          </p>
        </button>

        <button
          onClick={() => setCurrentPhase('post')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentPhase === 'post'
              ? 'bg-slate-900 border-amber-500/60 shadow-sm'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono text-amber-400 font-bold">PHASE 03</span>
            <span className="text-slate-500">拜访后 10秒闭环</span>
          </div>
          <div className="text-sm font-semibold text-white">语音复盘与方案书导出</div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            一键生成「{selectedScholar.name}」联合实验方案与申购论证报告
          </p>
        </button>
      </div>

      {/* Main Interactive Stage for Selected Phase */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        {/* PHASE 01: Pre-Visit 30s Card */}
        {currentPhase === 'pre' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <span>
                    30 秒客户底牌透视卡：{selectedScholar.name} ({selectedScholar.institution})
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  销售与售前技术支持进门前必看的 4 组关键信息（已同步当前锁定客户）
                </p>
              </div>

              <button
                onClick={() => setCurrentPhase('in')}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-all cursor-pointer"
              >
                <span>进门拜访：开启针对「{selectedScholar.name}」三连问</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Scientific Gap */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>01. 在研课题与方法学痛点</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    IF {selectedScholar.impactFactor}
                  </span>
                </div>

                <div className="text-xs text-slate-200">
                  <p className="font-medium text-slate-100">
                    代表方向/成果：{selectedScholar.recentPaperTitle}
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    期刊与阶段: {selectedScholar.journal}
                  </p>
                </div>

                <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-lg text-xs text-rose-300 space-y-1">
                  <span className="font-semibold text-rose-400">售前工程师重点切入卡点：</span>
                  <p className="leading-relaxed">{selectedScholar.paperDefect}</p>
                </div>
              </div>

              {/* Card 2: Affordability Waterline */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>02. 经费水位与走账策略</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    {selectedScholar.fundingAmountRMB}
                  </span>
                </div>

                <div className="text-xs text-slate-200 space-y-1">
                  <p>
                    <strong className="text-slate-400">资金渠道：</strong>
                    {selectedScholar.fundingSource}
                  </p>
                  <p>
                    <strong className="text-slate-400">现场设备情况：</strong>
                    {selectedScholar.installedBase.join(' / ')}
                  </p>
                </div>

                <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-lg text-xs text-amber-300 space-y-1">
                  <span className="font-semibold text-amber-400">实战报单打法建议：</span>
                  <p className="leading-relaxed">
                    先找 <strong>{l2SubPiName}</strong> 用 ≤5 万元免招标测试费（PanoVUE 6色空间切片 + Olink 1μL蛋白组）2周内跑出标杆数据，再由{' '}
                    <strong>{l2SubPiName}</strong> 呈报 <strong>{l1BossName}</strong> 锁定下一年度 300万级全光谱流式与空间多组学平台预算！
                  </p>
                </div>
              </div>

              {/* Card 3: Personal Win */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4.5 space-y-3">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>03. 客户买单核心动力</span>
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedScholar.personalWin}
                </p>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-indigo-300">
                  <span className="font-semibold text-indigo-400">销售与FAE配合要点：</span>
                  <p className="mt-0.5 text-slate-300">
                    先由应用工程师提供 2 例疑难样本免费盲测与防堵孔质控 SOP，用实测高清 Figure 帮客户解决眼下组会汇报与新项目立项刚需。
                  </p>
                </div>
              </div>

              {/* Card 4: Internal & External Jumpboard */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4.5 space-y-3">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>04. 内部搭班子与临床转化连带目标</span>
                </span>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-slate-100 font-medium">
                        L1终审拍板：{l1BossName} × L2实权把关：{l2SubPiName}
                      </span>
                      <span className="text-slate-500 text-[11px] block">
                        {institution} · {department} 核心决策班子
                      </span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold text-xs">千万级平台</span>
                  </div>
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-slate-100 font-medium">{partnerJumpboardName}</span>
                      <span className="text-slate-500 text-[11px] block">
                        临床样本队列与跨院区/跨科室联合立项方
                      </span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold text-xs">双中心联动</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deep Decision Chain Analysis */}
            {salesMode === 'senior' && (
              <div className="p-5 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    <span>针对「{selectedScholar.name}」团队的内部协同与立项拆解</span>
                  </span>
                  <span className="text-[10px] font-mono bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                    找准关键人 · 先测样后立项
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-lg space-y-1">
                    <span className="font-semibold text-amber-300">1. 决策链三方角色定位：</span>
                    <p className="text-slate-300 leading-relaxed">
                      <strong>{l2SubPiName}</strong> 是具体业务与技术方案把关人（手握≤5万测试费直签权），真正掌握院级大预算终审拍板的是{' '}
                      <strong>{l1BossName}</strong>，而 <strong>{l3GatekeeperName}</strong> 负责汇总《可行性论证报告》与防故障质控审核。
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-lg space-y-1">
                    <span className="font-semibold text-cyan-300">2. 售前工程师实测切入：</span>
                    <p className="text-slate-300 leading-relaxed">
                      围绕「{researchKeywords}」，进门直接展示同级别标杆中心刚跑通的全光谱高维流式 + 6色空间原位病理实测对比图，并提供 2 例疑难样本免费试跑。
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-lg space-y-1">
                    <span className="font-semibold text-emerald-300">3. 先小单破局再大单合围：</span>
                    <p className="text-slate-300 leading-relaxed">
                      先用 4.8万免招标测试包帮 <strong>{l2SubPiName}</strong> 拿到漂亮数据，再由其带着实测报告向{' '}
                      <strong>{l1BossName}</strong> 汇报，把全光谱流式与空间病理写进下一年度采购计划。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PHASE 02: In-Visit Golden 3 Questions & Deal Closing */}
        {currentPhase === 'in' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-emerald-400" />
                  <span>
                    现场面对面：针对「{selectedScholar.name}」团队的实战三连问
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  按照三步推进：刺穿「{researchKeywords}」痛点 ➔ 4.8万小额直签 ➔ 呈报 {l1BossName} 锁定大平台
                </p>
              </div>

              <button
                onClick={onOpenAiDeduce}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium text-xs rounded-lg transition-colors border border-slate-700 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>客户有现场异议？启动实时话术推演</span>
              </button>
            </div>

            {/* Step 1: Probe Scientific Pain */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                step1Answered
                  ? 'bg-slate-950/90 border-slate-800'
                  : 'bg-slate-950 border-cyan-500/50 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  STEP 01. 刺穿「{researchKeywords}」实验与检测瓶颈
                </span>
                {step1Answered && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>痛点已刺穿，客户高度认可</span>
                  </span>
                )}
              </div>

              <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-200 border border-slate-800">
                <span className="font-semibold text-cyan-300">销售/售前开场话术：</span>
                <p className="mt-1 leading-relaxed">
                  “{selectedScholar.name}您好！一直关注咱们【{department}】在「{researchKeywords}」方向的工作。目前咱们团队在处理高难临床/组织样本时，最头疼的是不是：{selectedScholar.paperDefect}？”
                </p>
              </div>

              {!step1Answered ? (
                <div className="mt-3 flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-400 italic">
                    {selectedScholar.name}反馈：“确实卡在这儿！常规流式通道和自发荧光受限，而且珍贵微量样本根本不敢随便拿去试错！”
                  </div>
                  <button
                    onClick={() => setStep1Answered(true)}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-all shrink-0 cursor-pointer"
                  >
                    确认共鸣：进入 4.8万免招标直签方案
                  </button>
                </div>
              ) : null}
            </div>

            {/* Step 2: Affordability Routing */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                !step1Answered
                  ? 'opacity-40 pointer-events-none'
                  : step2Signed
                  ? 'bg-slate-950/90 border-slate-800'
                  : 'bg-slate-950 border-emerald-500/50 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  STEP 02. 小额免招标直签：由 {l2SubPiName} 直接签批 4.8 万测试包
                </span>
                {step2Signed && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>已达成 4.8 万元免招标测试服务意向！</span>
                  </span>
                )}
              </div>

              <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-200 border border-slate-800">
                <span className="font-semibold text-emerald-300">销售与技术支持配合话术：</span>
                <p className="mt-1 leading-relaxed">
                  “等院里大设备招标走完至少半年，赶不上咱们这轮课题节点。不如我们先由应用工程师免费帮咱们盲测 2 例疑难样本，验证满意后直接从在研子课题测试费划出 4.8 万元（{l2SubPiName}签字权限内免招标直签），2周内交付全套 24色全光谱流式 / PanoVUE 6色空间原位切片 + Olink 1微升96因子实测大图！”
                </p>
              </div>

              {!step2Signed ? (
                <div className="mt-3 flex items-center justify-between gap-4 bg-emerald-950/30 p-3 rounded-lg border border-emerald-800/40">
                  <div className="text-xs text-emerald-200">
                    <strong>首单免招标组合：</strong>PanoVUE 6色原位共染/高维流式测试 (¥28,000) + Olink 1μL 96因子快检 (¥20,000) = <strong>¥48,000</strong>
                  </div>
                  <button
                    onClick={handleSignOpExDeal}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>敲定 4.8 万元免招标测试协议</span>
                  </button>
                </div>
              ) : null}
            </div>

            {/* Step 3: Social Leverage */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                !step2Signed
                  ? 'opacity-40 pointer-events-none'
                  : step3Agreed
                  ? 'bg-slate-950/90 border-slate-800'
                  : 'bg-slate-950 border-amber-500/50 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-amber-400">
                  STEP 03. 顺藤摸瓜立项：联合 {l3GatekeeperName} 呈报 {l1BossName} 拍板院级平台
                </span>
                {step3Agreed && (
                  <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>已锁定院务会汇报与年度设备立项路径！</span>
                  </span>
                )}
              </div>

              <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-200 border border-slate-800">
                <span className="font-semibold text-amber-300">立项推进话术：</span>
                <p className="mt-1 leading-relaxed">
                  “等两周后咱们这批漂亮实测数据一出来，放进组会/科务会汇报 PPT，我们同步帮 {l3GatekeeperName} 把写好『年均超过 1800 小时共享开机率测算』的《大型仪器可行性论证报告初稿》和三家比价单准备好，由 {l2SubPiName} 呈报 {l1BossName} 签字，并联动【{partnerJumpboardName}】一起把明年的全光谱流式与空间多组学平台预算锁死！”
                </p>
              </div>

              {!step3Agreed ? (
                <div className="mt-3 flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-300 italic">
                    客户表态：“这个节奏非常稳！先把2例试测和4.8万数据包跑出来，我直接在院务会上向 {l1BossName} 汇报立项！”
                  </div>
                  <button
                    onClick={() => {
                      setStep3Agreed(true);
                      setCurrentPhase('post');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>锁定立项路径：进入拜访后交付物生成</span>
                    <ChevronRight className="w-4 h-4 text-slate-950" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* PHASE 03: Post-Visit Voice Debrief & Deliverable Generation */}
        {currentPhase === 'post' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span>
                    拜访后 10 秒闭环：「{selectedScholar.name}」团队复盘与正式文书交付
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  一键生成针对【{institution} · {department}】的《联合实验方案》与《大型设备可行性论证报告》
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveDocModal('protocol')}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>查看《联合实验方案.pdf》</span>
                </button>
                <button
                  onClick={() => setActiveDocModal('co_purchase')}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>查看《可行性申购论证报告.docx》</span>
                </button>
              </div>
            </div>

            {/* Voice Debrief Recorder Section */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Mic className="w-4 h-4 text-cyan-400" />
                  <span>一线销售 10 秒语音复盘录入</span>
                </div>
                {voiceDebriefFinished && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>已同步更新至「{selectedScholar.name}」客户作战档案！</span>
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={handleStartVoiceRecording}
                  disabled={isRecording}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : voiceDebriefFinished
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>
                    {isRecording
                      ? '正在提取现场复盘要点...'
                      : voiceDebriefFinished
                      ? '重新录制语音复盘'
                      : `按住说话：10秒记录「${selectedScholar.name}」拜访进展`}
                  </span>
                </button>

                {isRecording && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono animate-pulse">
                    <Radio className="w-4 h-4 animate-spin" />
                    <span>[REC 00:03] 识别音频中...</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
                <span className="font-semibold text-cyan-300">现场复盘纪要：</span>
                <p className="text-slate-200 italic leading-relaxed">
                  “今天拜访【{institution}·{department}】进展顺利！围绕「{researchKeywords}」，先由应用工程师配合{' '}
                  {l2SubPiName} 安排 2 例疑难样本免费试测，并走子课题测试费直签 4.8 万元检测包；同时已对接{' '}
                  {l3GatekeeperName} 递交 1800 小时开机率论证底稿，下周带着实测数据向 {l1BossName} 汇报年度平台立项！”
                </p>

                {voiceDebriefFinished && (
                  <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                    <div className="p-2.5 bg-slate-950/70 rounded-lg border border-emerald-500/30 text-emerald-300">
                      <strong>近期动作 01：</strong>售前工程师本周驻场完成 2 例高难样本盲测 ➔ 由 {l2SubPiName} 签批 4.8 万测试合同。
                    </div>
                    <div className="p-2.5 bg-slate-950/70 rounded-lg border border-cyan-500/30 text-cyan-300">
                      <strong>近期动作 02：</strong>向 {l3GatekeeperName} 提交三家比价单与论证初稿 ➔ 报 {l1BossName} 锁定年度大设备预算。
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Generated Deliverables Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>交付物 01：给 {l2SubPiName} 的预实验与测试方案</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">
                    免招标直签 ¥48,000
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  《{selectedScholar.name}团队「{researchKeywords}」高维流式与空间原位多组学联合实验方案》
                </h4>
                <p className="text-xs text-slate-400">
                  包含 2 例疑难样本免费盲测流程、PanoVUE 6色荧光切片靶标设计、Olink 1μL 96因子Panel及2周Figure交付承诺。
                </p>
                <button
                  onClick={() => setActiveDocModal('protocol')}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>在线预览并导出技术方案</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>交付物 02：呈报 {l1BossName} 的院级设备申购论证报告</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded">
                    设备预算 ¥3,200,000
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  《{institution}·{department}共享全光谱流式与空间多组学平台可行性论证报告》
                </h4>
                <p className="text-xs text-slate-400">
                  内置40通道APD全光谱检测器、自发荧光实时扣除及年开机率 &gt;1800 小时测算，直接供科研秘书上报设备处。
                </p>
                <button
                  onClick={() => setActiveDocModal('co_purchase')}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>在线预览并导出申购论证报告</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Document Modal */}
      {activeDocModal && (
        <JointDocModal
          isOpen={true}
          onClose={() => setActiveDocModal(null)}
          docType={activeDocModal}
          scholarName={selectedScholar.name}
        />
      )}
    </div>
  );
};
