import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Download,
  Check,
  Wrench,
  ShieldCheck,
  ClipboardCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { useCustomerContext, B2B_INDUSTRY_SECTORS } from '../context/CustomerContext';

interface FieldTemplateItem {
  id: string;
  roleBadge: string;
  title: string;
  targetAudience: string;
  whenToUse: string;
  documentText: string;
}

export const WhitepaperView: React.FC = () => {
  const { confirmedCustomer, activeIndustry } = useCustomerContext();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-feasibility');
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const sectorMeta =
    B2B_INDUSTRY_SECTORS.find(
      (s) => s.id === (confirmedCustomer?.industrySector || activeIndustry)
    ) || B2B_INDUSTRY_SECTORS[0];

  const customerName = confirmedCustomer?.scholarName || '目标客户';
  const institution = confirmedCustomer?.institution || '目标单位';
  const department = confirmedCustomer?.department || '目标部门/科室';
  const keywords = confirmedCustomer?.researchKeywords || '核心业务攻关';
  const subPi = confirmedCustomer?.subPiNames?.split('、')[0] || '分管副手（二当家）';
  const execPerson = confirmedCustomer?.firstAuthorNames?.split('（')[0] || '一线工程师/实验骨干';

  const templates: FieldTemplateItem[] = [
    {
      id: 'doc-feasibility',
      roleBadge: '销售 + 立项执笔人必用',
      title: `01 · 《年度设备/系统购置可行性论证报告》底稿（直接发给秘书/设备科）`,
      targetAudience: `适用对象：帮【${department}】立项执笔人、科研秘书或设备工程科省去写材料时间`,
      whenToUse: '使用时机：距离正式挂网招标还有 3~6 个月，内部收集下一年度预算计划与三家摸底单时',
      documentText: `【${institution} · ${department}】年度专项购置可行性论证底稿（供内部提报直接修改引用）

一、 申购背景与现有瓶颈
1. 核心攻关任务：当前团队正围绕「${keywords}」开展高通量验证与关键项目攻关。
2. 现有条件短板：${confirmedCustomer?.procurementHistoryClue || '现有基础设备处于满负荷状态，且在分辨率、通量及在线无损检测能力上无法满足二期项目要求'}。

二、 共享负荷与年开机率/ROI测算
1. 预计年有效运行机时：≥ 1,850 小时/年（涵盖本部门核心项目及跨部门协作需求）。
2. 降本增效预期：改变以往依赖外部送测周期长（5-7天）、样品损耗率高的问题，预计6个月内收回阶段验证成本，批次合格率/数据产出效率提升 35% 以上。

三、 推荐配置与预算区间
- 对应预算科目：${sectorMeta.capexLabel}
- 配套先行验证通路：${sectorMeta.opexLabel}（由 ${subPi} 直接签批即可启动首轮实测）`,
    },
    {
      id: 'doc-fae-sop',
      roleBadge: '售前技术支持 (FAE) 必用',
      title: `02 · 售前工程师现场免费盲测 / 沙箱压测配合执行单`,
      targetAudience: `适用对象：售前技术支持（FAE）配合销售与【${execPerson}】对接样品或压测环境`,
      whenToUse: '使用时机：初次跑通二当家与一线实操骨干，准备用 2 例免费样品盲测或 1 周沙箱压测拿下首笔免招标小单时',
      documentText: `【售前技术支持 (FAE) 现场免费试测与汇报交底单】

一、 对接人员与交付目标
- 现场交接人：${execPerson}（一线实操负责人）
- 汇报把关人：${subPi}（日常业务二当家）
- 核心目标：赶在团队下周固定例会/组会前，交付可直接放进汇报 PPT 的高清实测对比大图与定量分析表。

二、 技术支持现场操作规范
1. 零损耗/零侵入保障：针对客户珍稀样品或生产隔离环境，采用超微量/无损检测流程（或离线容器一键旁路部署），确保原始样品100%可复核、现有生产零改动。
2. 关键对比指标：重点突出我方方案在「${keywords}」场景下相比传统方法在信噪比、检测通量或P99低延迟上的代际优势。
3. 交付物清单：① 高清实测对比图（300 DPI / 现成PPT页）；② 完整原始参数表；③ 供 ${subPi} 签字直报的小额测试/打样方案单（${sectorMeta.opexLabel.split('（')[0]}）。`,
    },
    {
      id: 'doc-aftersales-sop',
      roleBadge: '售后工程师 + 平台把关必用',
      title: `03 · 售后工程师《防故障质控SOP & 驻场维保免责承诺书》`,
      targetAudience: `适用对象：售后工程师递交【${department}】公共仪器平台主管、设备科或信安运维部门`,
      whenToUse: '使用时机：防止平台机管或设备运维人员因“怕堵孔、怕停机背锅、怕维护麻烦”而否决采购方案时',
      documentText: `【售后工程与驻场保障承诺书（供平台主管/设备科留存）】

一、 售后响应与备件兜底承诺
1. 现场响应时效：提供 4 小时本地区域售后工程师到场响应，关键备件与耗材本土常备库存 48-72 小时闪换，杜绝进口设备动辄 8-16 周等备件停机问题。
2. 预防性维护计划：每季度由原厂售后工程师主动上门完成光路/流路校准、防堵管自清洁保养或系统安全基线巡检，并出具书面《设备健康度巡检报告》。

二、 一线操作防故障与免责护盾
1. 随附《一线人员标准化防故障操作红宝书（塑封版）》，内置自动清洗与异常联锁保护机制，从硬件底层杜绝人为误操作导致的堵孔或停机。
2. 试运行与重点项目冲刺期间，由我方售后与应用工程师驻场协同，出现任何批次异常由我方免费重测兜底，彻底免除平台管理与运维人员的考核顾虑。`,
    },
    {
      id: 'doc-three-quotes',
      roleBadge: '销售 + 售前控标必用',
      title: `04 · 内部市场调研《三家梯度比价参考表 & 核心技术参数》`,
      targetAudience: `适用对象：销售配合【${subPi}】与采购接口人完成内部市场调研三家比价归档`,
      whenToUse: '使用时机：客户内部启动市场调研征集、需要锁定技术规格书（SOR/招标参数）时',
      documentText: `【${department} · 市场调研三家梯度配置与核心技术参数参考】

一、 三家调研梯度设计策略
- 旗舰档（锁定预算上限）：按 ${sectorMeta.capexLabel.split('（')[0]} 满配申报，为部门争取充足年度预算额度；
- 主力档（我方核心方案）：100% 契合「${keywords}」高通量、高分辨率及本土快速维保刚需，综合TCO（三年总拥有成本）最优；
- 基础档（参照对比配置）：仅满足常规基础指标，突出主力档在核心性能上的不可替代性。

二、 建议写入技术规范书（SOR）的 3 条核心刚性指标
1. 针对「${keywords}」具备原位无损/高通量实时定量与自动背景扣除能力；
2. 100% 兼容部门现有样本库/产线自动化接口（支持标准协议无缝对接，无需额外付费改造）；
3. 供应商须提供本土 4 小时现场工程响应及首年驻场应用支持保障。`,
    },
  ];

  const activeTemplate =
    templates.find((t) => t.id === selectedDocId) || templates[0];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadSource = async (format: 'zip' | 'tar') => {
    setDownloadingFormat(format);
    try {
      const res = await fetch(`/api/download-source?format=${format}&t=${Date.now()}`);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        format === 'zip'
          ? 'fde-consultative-copilot-v2-source.zip'
          : 'fde-consultative-copilot-v2-source.tar.gz';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.location.href = `/api/download-source?format=${format}&t=${Date.now()}`;
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Wrench className="w-4 h-4" />
              <span>销售 · 售前技术支持 (FAE) · 售后工程师实战工具箱</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              【{customerName} · {department}】立项报告底稿与现场技术支持 SOP 库
            </h1>
            <p className="text-xs text-slate-400">
              所有模板均已自动带入当前客户信息，销售、技术支持与售后工程师可直接一键复制发给客户或带下现场使用。
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => handleDownloadSource('zip')}
              disabled={downloadingFormat !== null}
              className="px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-800 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>{downloadingFormat === 'zip' ? '打包中...' : '下载源码 (.zip)'}</span>
            </button>
            <button
              onClick={() => handleDownloadSource('tar')}
              disabled={downloadingFormat !== null}
              className="px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-800 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{downloadingFormat === 'tar' ? '打包中...' : '.tar.gz 源码包'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container: Left 4 Templates Selector + Right Active Template Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 space-y-2.5">
          {templates.map((item) => {
            const isSelected = item.id === selectedDocId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedDocId(item.id)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-colors cursor-pointer space-y-1.5 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-400 shadow-md'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-cyan-400">
                    {item.roleBadge}
                  </span>
                  <span className="text-[11px] text-slate-400">点击查看 ▸</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white leading-snug">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1">
                  {item.targetAudience}
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-7 bg-slate-900/85 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs font-mono text-amber-300 font-bold">
                  {activeTemplate.roleBadge}
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {activeTemplate.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(activeTemplate.id, activeTemplate.documentText)}
                className="min-h-[38px] px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
              >
                {copiedId === activeTemplate.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>已复制全文</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>一键复制模板全文</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                <strong className="text-cyan-400 block mb-0.5">配合对象：</strong>
                {activeTemplate.targetAudience}
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                <strong className="text-emerald-400 block mb-0.5">使用时机：</strong>
                {activeTemplate.whenToUse}
              </div>
            </div>

            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 font-sans whitespace-pre-wrap leading-relaxed overflow-x-auto select-text">
              {activeTemplate.documentText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
