import React, { useEffect, useState } from 'react';
import {
  GitFork,
  BookOpen,
  Wallet,
  Users,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { useCustomerContext } from '../context/CustomerContext';

export const ThreeTierEngineView: React.FC = () => {
  const { confirmedCustomer, confirmCustomer } = useCustomerContext();

  const [hasRun, setHasRun] = useState(true);
  const [customerName, setCustomerName] = useState<string>(
    confirmedCustomer?.scholarName || '欧阳涓'
  );
  const [institution, setInstitution] = useState<string>(
    confirmedCustomer?.institution || '中山大学附属第一医院'
  );
  const [department, setDepartment] = useState<string>(
    confirmedCustomer?.department || '医学检验科'
  );
  const [researchFocus, setResearchFocus] = useState<string>(
    confirmedCustomer?.researchKeywords || '流式细胞免疫分型 血液肿瘤MRD'
  );
  const [fundingAmount, setFundingAmount] = useState<number>(45);
  const [selectedTierTab, setSelectedTierTab] = useState<'tier1' | 'tier2' | 'tier3'>('tier2');
  const [syncNotice, setSyncNotice] = useState<string>('');

  // Auto-sync whenever confirmedCustomer changes
  useEffect(() => {
    if (!confirmedCustomer) return;
    setCustomerName(confirmedCustomer.scholarName);
    setInstitution(confirmedCustomer.institution);
    setDepartment(confirmedCustomer.department);
    setResearchFocus(confirmedCustomer.researchKeywords);

    const isL1 =
      confirmedCustomer.scholarName.includes('尹芝南') ||
      confirmedCustomer.scholarName.includes('刘敏') ||
      confirmedCustomer.scholarName.includes('陈旻湖') ||
      confirmedCustomer.scholarName.includes('匡铭');
    setFundingAmount(isL1 ? 260 : 45);
    setHasRun(true);
    setSyncNotice(`已同步「${confirmedCustomer.scholarName}」经费水位与三级报价路径`);
    const timer = setTimeout(() => setSyncNotice(''), 2200);
    return () => clearTimeout(timer);
  }, [
    confirmedCustomer?.id,
    confirmedCustomer?.scholarName,
    confirmedCustomer?.institution,
    confirmedCustomer?.department,
    confirmedCustomer?.researchKeywords,
  ]);

  const l1LeaderName =
    confirmedCustomer?.deptLeaderName?.split('（')[0] ||
    (customerName.includes('尹芝南')
      ? '尹芝南院长（转化院院长+暨德康民/暨安特博创始人）'
      : customerName.includes('欧阳') || customerName.includes('刘敏')
      ? '刘敏正主任'
      : `${department}一把手主任`);

  const l2SubPiName =
    confirmedCustomer?.subPiNames?.split('、')[0]?.split('（')[0] ||
    (customerName.includes('尹芝南')
      ? '向征博士(暨德康民CTO)/吴扬哲副院长/杨恒文教授'
      : customerName.includes('欧阳') || customerName.includes('刘敏')
      ? '欧阳涓副主任'
      : `${customerName}老师`);

  // Determine path automatically based on funding
  let derivedPath: 'A' | 'B' | 'C' = 'B';
  let pathTitle = '';
  let pathDesc = '';
  let recommendedItems: string[] = [];
  let narrativeScript = '';

  if (fundingAmount >= 100) {
    derivedPath = 'A';
    pathTitle = `路径 A：大额 CapEx（可用资金 ${fundingAmount} 万 ≥ 100 万）→ 旗舰设备立项控标 + 先期样机试测`;
    pathDesc = `针对【${institution}·${department}】${customerName}（L1终审：${l1LeaderName} / L2把关：${l2SubPiName}）：手握院级重点平台或专科修购预算。先由应用工程师配合 ${l2SubPiName} 完成 2 例疑难样本实测验证，再提前 3–6 个月将排他性参数植入招标可行性报告！`;
    recommendedItems = [
      'Cytek Aurora CS 全光谱流式细胞分选仪 (¥280万-350万 · 5激光40通道APD)',
      'Revvity IVIS Spectrum 小动物活体光学成像系统 (¥290万-380万)',
      'Indica Labs HALO 数字病理空间邻近度分析工作站 (¥80万-150万)',
    ];
    narrativeScript = `“${customerName}您好，针对咱们【${department}】在「${researchFocus}」方向的平台建设规划，我们建议一步到位配置 5 激光 40 通道雪崩二极管(APD)全光谱系统，实时扣除高自发荧光干扰。我们先由应用工程师配合 ${l2SubPiName} 跑通首批实测数据，再协助科研秘书把 1800 小时开机率测算写进今年修购论证报告！”`;
  } else if (fundingAmount >= 20) {
    derivedPath = 'B';
    pathTitle = `路径 B：小额 OpEx（当前可用 ${fundingAmount} 万）→ 4.8万免招标直签 + 顺势报院级大设备`;
    pathDesc = `针对【${institution}·${department}】${customerName}（L2实权把关人：${l2SubPiName}）：无需苦等漫长设备招标！先走子课题/科室小额测试费（≤5万元直接签批），2周内交付「${researchFocus}」高分实测 Figure，再由 ${l2SubPiName} 呈报 ${l1LeaderName} 立项大设备。`;
    recommendedItems = [
      'PanoVUE 组织 6-8 色原位免疫荧光染色与空间邻近度定量服务 (¥2.8万-4.8万/批次)',
      'Olink 1μL 超微量蛋白质组学 96 细胞因子快检服务 (¥2.2万-4.8万/Panel)',
      '高维全光谱流式 24-40 色定制免疫分型盲测包 (2例免费试测 + 小额直签)',
    ];
    narrativeScript = `“${customerName}您好，等大设备招标走完赶不上咱们这轮「${researchFocus}」实验节点。咱们这次直接走 ${l2SubPiName} 签字权限内的 4.8 万元小额测试费，做 PanoVUE 6 色原位切片 + 1 微升 Olink 因子联检，2周内交付高清 Figure，下个月直接在科务会上向 ${l1LeaderName} 汇报大平台立项！”`;
  } else {
    derivedPath = 'C';
    pathTitle = `路径 C：单组预算紧张（${fundingAmount} 万）→ 跨课题组联名拼单申报院级共享平台`;
    pathDesc = `针对【${institution}·${department}】${customerName}：单课题组经费有限，但在院内与临床队列科室紧密合作。协助 ${l2SubPiName} 联合院内 2–3 个相关科室共同向公共平台/设备处申报年度修购专项。`;
    recommendedItems = [
      `《${institution}多课题组共用全光谱流式与空间病理可行性论证报告模板》`,
      '联合申报 Cytek Aurora CS 全光谱流式仪 (全院共享平台 >1800小时/年)',
      '首阶段免费提供 2 例疑难样本试测数据作为联合立项支撑附件',
    ];
    narrativeScript = `“${customerName}您好，咱们单个子课题虽然测试费有限，但院里好几个相关团队同样卡在「${researchFocus}」高维分选和空间共染上。我们帮您和 ${l1LeaderName} 起草一份跨课题组联合申购可行性报告，机器放公共平台统一维护，咱们团队优先免费上机！”`;
  }

  if (!hasRun) {
    return (
      <div className="space-y-4">
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-lg">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-indigo-400">
                <GitFork className="w-3.5 h-3.5" />
                <span>预算与报价方案 · 手动调整参数并全局同步</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                客户经费水位与三级报价分流器
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setHasRun(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              返回当前测算结果
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
                className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                目标客户姓名
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                客户在研课题方向
              </label>
              <input
                type="text"
                value={researchFocus}
                onChange={(e) => setResearchFocus(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">客户当前可用经费水位</span>
              <span className="font-mono font-bold text-emerald-400">{fundingAmount} 万元</span>
            </div>
            <input
              type="range"
              min="10"
              max="300"
              step="5"
              value={fundingAmount}
              onChange={(e) => setFundingAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <button
            onClick={() => {
              confirmCustomer({
                institution,
                department,
                scholarName: customerName.trim() || '欧阳涓',
                researchKeywords: researchFocus,
              });
              setHasRun(true);
            }}
            className="w-full min-h-[52px] bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>手动运行并全局同步「{customerName}」最佳报价路径</span>
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-indigo-400">
            <GitFork className="w-4 h-4" />
            <span>
              三级商机与报价漏斗 · 当前客户：{customerName}（{institution} · {department}）· 测算水位 {fundingAmount} 万元
            </span>
            {syncNotice && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[11px] font-mono">
                ✓ {syncNotice}
              </span>
            )}
          </div>
          <h1 className="text-base sm:text-lg font-bold text-white mt-1">{pathTitle}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setSyncNotice(`已重新运行「${customerName}」三级报价测算`);
              setTimeout(() => setSyncNotice(''), 2000);
            }}
            className="min-h-[40px] px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>手动运行 / 刷新测算</span>
          </button>
          <button
            type="button"
            onClick={() => setHasRun(false)}
            className="min-h-[40px] px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>修改测算参数</span>
          </button>
        </div>
      </div>

      {/* Interactive Funnel Architecture Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => setSelectedTierTab('tier1')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedTierTab === 'tier1'
              ? 'bg-slate-900 border-cyan-500/60 shadow-sm'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono text-cyan-400 font-bold">TIER 01</span>
            <span className="text-slate-500">现场真实需求</span>
          </div>
          <div className="text-sm font-semibold text-white">
            第一级：「{customerName}」技术卡点诊断
          </div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
            围绕「{researchFocus}」定位实验与检测通道瓶颈
          </p>
        </button>

        <button
          onClick={() => setSelectedTierTab('tier2')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedTierTab === 'tier2'
              ? 'bg-slate-900 border-emerald-500/60 shadow-sm'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono text-emerald-400 font-bold">TIER 02</span>
            <span className="text-slate-500">支付能力路由</span>
          </div>
          <div className="text-sm font-semibold text-white">第二级：按经费水位匹配报价包</div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
            小额免招标测试（{l2SubPiName}直签） ➔ 年度大设备（{l1LeaderName}拍板）
          </p>
        </button>

        <button
          onClick={() => setSelectedTierTab('tier3')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedTierTab === 'tier3'
              ? 'bg-slate-900 border-amber-500/60 shadow-sm'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono text-amber-400 font-bold">TIER 03</span>
            <span className="text-slate-500">跨组拼单立项</span>
          </div>
          <div className="text-sm font-semibold text-white">第三级：内部联动与跨科室扩单</div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
            以实测标杆数据联动 {l1LeaderName} 锁死院级修购专项
          </p>
        </button>
      </div>

      {/* Tier Detail Showcase */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        {selectedTierTab === 'tier1' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>
                第一级诊断：{customerName}（{institution}·{department}）为什么现在需要我们？
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <span className="font-semibold text-cyan-400">
                  1. 「{researchFocus}」现场实验与检测断层
                </span>
                <p className="leading-relaxed text-slate-300">
                  {customerName}团队当前围绕「{researchFocus}」推进高水平课题与临床转化。常规 4–10 色流式细胞仪受荧光通道重叠与高自发荧光干扰限制，且单细胞悬液丢失了组织原位 15μm 空间邻近度证据，因此对 <strong>24-40色全光谱流式、PanoVUE 6-8色空间病理及 Olink 1μL超微量蛋白组</strong> 具备明确刚需。
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <span className="font-semibold text-cyan-400">2. 售前工程师如何切入试测</span>
                <p className="leading-relaxed text-slate-300">
                  不空谈仪器参数，直接由售前应用工程师对接 <strong>{l2SubPiName}</strong> 及一线实验骨干（{confirmedCustomer?.firstAuthorNames?.split('（')[0] || '专职博后/技师'}），提供 2 例高难样本免费盲测与防堵孔质控 SOP，快速产出组会汇报高清对比图。
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedTierTab === 'tier2' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>
                第二级分流：针对「{customerName}」团队的经费滑块与阶梯报价包
              </span>
            </div>

            {/* Dynamic Simulator Interactive Widget */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-200">
                  互动推演模拟器：拖动「{customerName}」当前可用经费滑块实时切换报价方案
                </span>
                <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                  当前测算水位：{fundingAmount} 万元 (
                  {fundingAmount >= 100
                    ? '院级 CapEx 立项'
                    : fundingAmount >= 20
                    ? '子课题 OpEx 直签'
                    : '跨组拼单申购'}
                  )
                </span>
              </div>

              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10万 (单组预算紧)</span>
                <span>45万 (L2二当家免招标直签)</span>
                <span>100万 (科室重点专项线)</span>
                <span>260万+ (L1一把手院级修购平台)</span>
              </div>

              {/* Dynamic Route Card */}
              <div className="mt-4 p-4 bg-slate-900 border border-slate-700/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        derivedPath === 'A'
                          ? 'bg-sky-400'
                          : derivedPath === 'B'
                          ? 'bg-emerald-400'
                          : 'bg-amber-400'
                      }`}
                    />
                    <span>{pathTitle}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">当前推荐方案</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{pathDesc}</p>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-xs font-semibold text-slate-400">推荐配置与报价组合：</span>
                  <ul className="space-y-1 text-xs text-slate-200 list-disc list-inside">
                    {recommendedItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                  <span className="font-medium text-emerald-400">现场报价沟通话术：</span>
                  <p className="mt-1 italic text-slate-300 leading-relaxed">{narrativeScript}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTierTab === 'tier3' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Users className="w-4 h-4 text-amber-400" />
              <span>
                第三级裂变：如何从「{l2SubPiName}」小单升级到「{l1LeaderName}」院级大单？
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <span className="font-semibold text-amber-400">
                  动作 1：同行标杆对标与课题号摸底
                </span>
                <p className="leading-relaxed text-slate-300">
                  向 {l2SubPiName} 展示同级别标杆中心刚跑通的「{researchFocus}」高维流式与空间多组学数据，摸清近期可签批的测试费课题号与年度设备申报窗口：
                </p>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg italic text-slate-300">
                  “{customerName}您好，近期同级别中心围绕「{researchFocus}」都在升级 40 色全光谱和 6 色空间病理平台，咱们院今年修购计划报送前，我们先帮团队跑出 2 例实测标杆图放进论证报告！”
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <span className="font-semibold text-amber-400">
                  动作 2：L2 实测背书 ➔ 呈报 L1（{l1LeaderName}）终审拍板
                </span>
                <p className="leading-relaxed text-slate-300">
                  在 {l2SubPiName} 处跑通 4.8 万首单测试并赢得一线实验骨干口碑后，主动帮科研秘书准备好写明“年均 &gt;1800 小时共享机时测算”的《可行性论证报告初稿》与三家梯度比价单，由 {l2SubPiName} 呈报 <strong>{l1LeaderName}</strong> 终审签字。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
