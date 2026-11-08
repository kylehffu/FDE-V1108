import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText, CheckCircle2, Building, User, Award, Microscope } from 'lucide-react';

interface JointDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: 'protocol' | 'co_purchase';
  scholarName: string;
}

export const JointDocModal: React.FC<JointDocModalProps> = ({
  isOpen,
  onClose,
  docType,
  scholarName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isProtocol = docType === 'protocol';
  const title = isProtocol
    ? `《${scholarName}课题组 CAR-T 肿瘤微环境浸润与超微量因子检测联合实验方案》`
    : `《中山大学医学院公共仪器平台多课题组联合申购全光谱流式仪可行性论证报告》`;

  const protocolContent = `
【技术方案交付文档】
项目名称：${scholarName}课题组 CAR-T细胞衰竭机制与肿瘤原位浸润高维全景技术方案
编制单位：广州睿贝医学科技有限公司（RayBio）应用工程支持部（FAS）
送测批次：预实验第 01 批 (用于 15 分+ SCI 论文 Figure 补充)
服务金额：¥52,800 元整 (小额常规课题测试费报销)

一、 科学背景与实验瓶颈说明
课题组主要关注 CAR-T 细胞回输实体瘤后的小鼠体内持久性与功能耗竭。现有老旧 Beckman 4 色流式细胞仪检测表明 CAR-T 细胞在外周血有增殖，但在实体瘤局部的浸润深度和空间分布一直缺乏形态学量化支撑；此外，分选产物中回输细胞极少（微升量级），传统 ELISA 灵敏度严重不足。

二、 联合交付方案构架
1. 模块一：PanoVUE 6色肿瘤免疫微环境荧光染色与原位浸润定量 (TSA 放大技术)
   - 靶标 Panel：CD3, CD8, CAR-scFv (独家特异性探针), PD-1, FoxP3, DAPI (细胞核)
   - 关键指标输出：肿瘤实质浸润距离量化 (Proximity Analysis)、CD8+/FoxP3+ 效应/抑制细胞比值空间热图
   - 图像标准：符合 Nature/Cell 子刊分辨率要求之 TIFF 高清全景切片文件

2. 模块二：Olink Target 96 肿瘤免疫微量因子超灵敏检测
   - 样品量要求：仅需 1 μL 微量血清/组织裂解液
   - 覆盖靶标：IFN-gamma, TNF-alpha, Granzyme B, Perforin, IL-2, IL-10 等 96 种炎症介质
   - 交付物：标准化热图、火山图、差异表达基因聚类报告

三、 商业承诺与发表支持
广州睿贝承诺在收到样品后 10 个工作日内完成切片扫描与蛋白质组学检测，并由生信团队免费提供 SCI 级别的图表矢量排版（AI/EPS 格式）及完整的实验方法学 Methods 英文文案。
`.trim();

  const coPurchaseContent = `
【大型仪器联合申购论证报告】
申报项目：2027 年度高校修购专项与一流学科高水平公共实验平台建设项目
设备名称：全光谱多激光高速流式细胞分选系统（Cytek Aurora CS）
预算总额：人民币 3,200,000 元 (叁佰贰拾万元整)
牵头申报单位：中山大学医学院科研公共实验中心
联合使用课题组：${scholarName}课题组、附属肿瘤医院陈大主任课题组、合成生物学与药物递送研究组

一、 申购必要性与设备不可替代性
现有院级公共平台配备之老旧流式细胞仪（Beckman CytoFLEX 与 BD Canto II）购于 2018 年，仅支持 4-8 色传统滤光片模式，在高自发荧光肿瘤组织分析时需进行复杂单阳补偿，且喷嘴经常堵塞，严重影响全院 14 个课题组的科研进度。
拟申购之 Cytek Aurora CS 全光谱流式仪具备以下不可替代优势：
1. 采用雪崩光电二极管(APD)连续光谱检测技术，直接提取自体荧光(AF)，免单阳荧光补偿；
2. 突破 40 色超高维分选，单次上样即可完整表征稀缺临床样本之全谱系亚群；
3. 配备智能防堵液路与自动温控分选仓，降低平台工程师维护负担达 70%。

二、 跨课题组共享机制与经费分摊测算
- 仪器安放地点：学院科研公共实验中心 402 室（由平台主管负责统一排期与质控）
- 开放共享承诺：年有效运行机时承诺不少于 1,600 小时，院内共享率不低于 85%
- 运行成本分摊：由睿贝提供首年全保金牌驻场服务，各课题组按机时费从常规面上课题抵扣。

三、 联合签字专家团队
牵头论证负责人（平台主管）：许主管（签字）________
临床医学协同负责人：陈主任（教授/科主任 签字）________
基础机制学术骨干：${scholarName}（特聘副研究员 签字）________
`.trim();

  const currentContent = isProtocol ? protocolContent : coPurchaseContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = isProtocol
      ? `联合实验技术方案_${scholarName}.txt`
      : `多课题组共用设备申报论证报告_${scholarName}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${isProtocol ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="text-xs text-slate-400">系统一键自动化生成 · 可直接交付客户汇报或向平台打报告</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Document Viewer */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs bg-slate-950/50 text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-cyan-500/30">
          {currentContent}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>已内置符合国自然与顶刊审稿标准的专业措辞与控标参数</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">已复制到剪贴板</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>复制文本</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>导出正式文书 (.doc/.txt)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
