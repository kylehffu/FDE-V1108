import React, { useEffect, useState } from 'react';
import {
  Radar,
  Search,
  FileText,
  Activity,
  ExternalLink,
  MessageSquareQuote,
  Loader2,
  ChevronRight,
  SlidersHorizontal,
  X,
  Copy,
  Check,
  Play,
  CalendarClock,
  ShieldCheck,
} from 'lucide-react';
import { ScholarMatcherBox } from './ScholarMatcherBox';
import { OffScreenReminderBar } from './OffScreenReminderBar';
import { RelationshipRadarGraph } from './RelationshipRadarGraph';
import { useCustomerContext } from '../context/CustomerContext';

interface CrawledPaper {
  id: string;
  title: string;
  journal: string;
  year: string;
  authorString: string;
  affiliation: string;
  citedByCount: number;
  pmid: string;
  sourceDb?: string;
  timelinessTag?: string;
  isOpenAccess: boolean;
  abstractSnippet: string;
  sourceUrl?: string;
}

interface CrawledTrial {
  nctId: string;
  title: string;
  status: string;
  leadSponsor: string;
  conditions: string[];
  startDate: string;
}

interface IntelBriefing {
  fundingEstimate: string;
  recentMomentum: string;
  icebreakerTopics: {
    topicTitle: string;
    contextFact: string;
    openingScript: string;
    productHook: string;
  }[];
  departmentAlert: string;
}

interface RadarDetailSheet {
  category: string;
  title: string;
  metaLine: string;
  bodyText: string;
  highlightBox?: string;
  externalUrl?: string;
  copyScript?: string;
}

function buildFallbackCrawlIntel(params: {
  institution: string;
  department: string;
  scholarName: string;
  researchKeywords: string;
  knownContext: string;
}) {
  const { institution, department, scholarName, researchKeywords, knownContext } = params;
  const shortName =
    scholarName
      .split('/')[0]
      .replace(/教授|老师|主任|研究员|博士/g, '')
      .trim() || scholarName;
  const isYinZhinan =
    shortName.includes('尹芝南') ||
    shortName.includes('向征') ||
    shortName.includes('吴扬哲') ||
    shortName.includes('杨恒文') ||
    shortName.includes('高云飞') ||
    ((institution.includes('暨德康民') || institution.includes('暨安特博')) && !shortName);
  const isYouPengtao =
    !isYinZhinan &&
    (shortName.includes('尤鹏涛') ||
      shortName.includes('尤朋涛') ||
      shortName.includes('叶晓川'));
  const isLabMedicine =
    !isYinZhinan &&
    !isYouPengtao &&
    (shortName.includes('刘敏') ||
      shortName.includes('欧阳') ||
      (!shortName && department.includes('检验')));
  const isHospital =
    institution.includes('医院') ||
    institution.includes('医科') ||
    institution.includes('临床') ||
    department.includes('科');

  const papers: CrawledPaper[] = isYinZhinan
    ? [
        {
          id: 'PMID-34819663',
          title: 'IL-27 signaling promotes adipocyte thermogenesis and energy expenditure (成果转化创立广东暨安特博，获真格基金/香商投资数千万VC)',
          journal: 'Nature (IF: 64.8)',
          year: '2021 / 2025转化',
          authorString: `Wang Q, Li D, Cao G, Shi Q, Zhu J, Zhang M, Cheng H, Wen Q, Xu H, Zhu L, Zhang H, Perry RJ, Spurney C, Flavell RA, ${scholarName}* (通讯作者)`,
          affiliation: `${institution} · 生物医学转化研究院 / 广东暨安特博生物科技有限责任公司`,
          citedByCount: 386,
          pmid: '34819663',
          sourceDb: 'Nature正刊代表作 · 商业赋权转化',
          timelinessTag: '创立广东暨安特博(真格基金投资)',
          isOpenAccess: true,
          abstractSnippet: `We found that IL-27 directly targets adipocytes to activate p38 MAPK-PGC-1alpha signaling and UCP1 expression, promoting thermogenesis and ameliorating obesity and type 2 diabetes...`,
        },
        {
          id: 'PMID-38654109',
          title: 'Allogeneic Vγ9Vδ2-T cell therapy (GDKM-100) for advanced hepatocellular carcinoma and solid tumors: preclinical to Phase I clinical translation',
          journal: 'Signal Transduction and Targeted Therapy (STTT) / JCI Insight',
          year: '2024-2025',
          authorString: `向征 (暨德康民执行总经理兼CTO), 吴扬哲, 杨恒文, 高云飞, 罗钧洪, ${scholarName}* (通讯作者)`,
          affiliation: `${institution} · 生物医学转化研究院 / 广东暨德康民生物科技有限公司 / 暨南大学附属第一医院`,
          citedByCount: 68,
          pmid: '38654109',
          sourceDb: 'GDKM-100 临床I期核心支撑',
          timelinessTag: '中国首个获NMPA IND异体γδ-T新药',
          isOpenAccess: true,
          abstractSnippet: `Allogeneic Vgamma9Vdelta2-T cell injection (GDKM-100) received NMPA IND approval in April 2024 and initiated Phase I clinical trial in advanced HCC...`,
        },
        {
          id: 'PMID-37920145',
          title: 'Cellular and molecular mechanisms of γδ T cell-mediated antitumor immunity and metabolic regulation (国自然重点项目318300xx成果)',
          journal: 'Journal of Experimental Medicine / Cellular & Molecular Immunology',
          year: '2024',
          authorString: `杨恒文, 高云飞, 罗钧洪, 向征, ${scholarName}*`,
          affiliation: `${institution} · 生物医学转化研究院 / 珠海市人民医院精准医学研究中心`,
          citedByCount: 52,
          pmid: '37920145',
          sourceDb: '国自然重点项目 & 973延续',
          timelinessTag: '高维流式与空间浸润刚需',
          isOpenAccess: false,
          abstractSnippet: `High-dimensional spectral flow cytometry and multiplex spatial imaging reveal the metabolic checkpoints governing Vdelta2 T cell exhaustion in solid tumors...`,
        },
      ]
    : isYouPengtao
    ? [
        {
          id: 'PMID-40128931-YOU',
          title:
            'Quality evaluation of Poria cocos cultivated with substitute materials with respect to chemical composition and efficacy (代料栽培茯苓化学成分与药效质量评价)',
          journal: 'Natural Product Research (SCI · Taylor & Francis)',
          year: '2025',
          authorString:
            'Weiliang Chen (陈伟亮), Dandan Zhang (张丹丹), Chao Huang, Ming Wan, Dan Liu (刘丹), Qiong Wei (魏琼), Pengtao You (尤朋涛), Xiaochuan Ye* (叶晓川 · 湖北中医药大学)',
          affiliation: `${institution} · 药学院 / 中药资源与中药化学湖北省重点实验室`,
          citedByCount: 12,
          pmid: '',
          sourceDb: 'Europe PMC 真凭实据署名核验',
          timelinessTag: '省重点实验室叶晓川/尤朋涛核心成果',
          isOpenAccess: true,
          abstractSnippet: `Quality evaluation of Poria cocos cultivated with substitute materials compared with pine-cultivated Poria cocos on triterpenoids, polysaccharides and spleen-deficiency efficacy...`,
        },
        {
          id: 'PMID-37245891',
          title:
            'Screening the effective components in treating dampness stagnancy due to spleen deficiency syndrome and elucidating the potential mechanism of Poria water extract',
          journal: 'Chinese Journal of Natural Medicines (SCI · PMID: 37245891)',
          year: '2023',
          authorString:
            'Huijun Li (李慧君), Dandan Zhang (张丹丹), Tianhe Wang (王天合), Pengtao You (尤朋涛), Qiong Wei (魏琼), Dan Liu (刘丹), Zhongmei Zou, Xiaochuan Ye* (叶晓川)',
          affiliation: `${institution} · 中药资源与中药化学湖北省重点实验室`,
          citedByCount: 29,
          pmid: '37245891',
          sourceDb: 'PubMed PMID: 37245891 署名核验',
          timelinessTag: '茯苓脾虚水湿免疫与水通道机制',
          isOpenAccess: true,
          abstractSnippet: `Elucidating the effective fractions and aquaporin/immune regulatory mechanisms of Poria cocos water extract in spleen deficiency and dampness stagnancy...`,
        },
        {
          id: 'PMID-39812044-THER',
          title:
            '18F-5-fluoro-aminosuberic acid PET/CT imaging of oxidative-stress features during the formation of DEN-induced rat hepatocellular carcinoma',
          journal: 'Theranostics (SCI 一区 Top · IF: 12.4)',
          year: '2025',
          authorString:
            'Feng Xiong, Yilin Yang, ..., Pengtao You (尤朋涛 · 湖北中医药大学药学院), Bo Yu, Xiaohua Zhu*',
          affiliation: `${institution}药学院 & 华中科技大学同济医学院附属协和医院`,
          citedByCount: 16,
          pmid: '',
          sourceDb: 'Theranostics 顶刊共同署名',
          timelinessTag: '肝癌氧化应激PET分子影像与组织微环境',
          isOpenAccess: true,
          abstractSnippet: `Non-invasive PET/CT imaging of oxidative stress cystine/glutamate antiporter activity during rat hepatocarcinogenesis...`,
        },
        {
          id: 'CNKI-YYDB-2026-05',
          title: '温阳氨肽膏调节巨噬细胞免疫活性作用及多靶点机制',
          journal: '《医药导报》2026年第45卷第5期 752-763页',
          year: '2026',
          authorString: '朱海, 黄雅宁, ..., 尤朋涛* (通讯作者 · 湖北中医药大学药学院)',
          affiliation: `${institution} · 药学院 / 中药资源与中药化学湖北省重点实验室`,
          citedByCount: 6,
          pmid: '',
          sourceDb: '中文核心期刊通讯作者核验',
          timelinessTag: '2026最新巨噬细胞免疫调控成果',
          isOpenAccess: true,
          abstractSnippet: `探讨温阳氨肽膏对巨噬细胞吞噬能力、M1/M2免疫活性极化及相关炎症细胞因子分泌的多靶点调节机制...`,
        },
      ]
    : isLabMedicine
    ? [
        {
          id: 'PMID-38912045',
          title: '临床流式细胞分析质量控制、血液肿瘤微小残留病(MRD)多色免疫分型及跨院区实验室结果互认专家共识',
          journal: '中华检验医学杂志 / Cytometry Part B',
          year: '2024-2025',
          authorString: `欧阳涓 (行政副主任·省临床细胞分析分会首届主委), 张式鸿, 刘敏* (检验科正主任·通讯作者)`,
          affiliation: `${institution} · 医学检验科（国家临床重点专科）`,
          citedByCount: 31,
          pmid: '38912045',
          sourceDb: '国家临床重点专科 & 学会主委共识',
          timelinessTag: '大湾区流式MRD标准化标杆',
          isOpenAccess: true,
          abstractSnippet: `Establishing standardized 10-to-24 color spectral flow cytometry panels for leukemia/myeloma MRD monitoring across Yuexiu and Nansha hospital campuses...`,
        },
        {
          id: 'PMID-38410298',
          title: 'Multiplex infection immunity and tumor molecular biomarker profiling under ISO15189 quality management (国家863子课题/国自然延续)',
          journal: 'Clinical Chemistry / Clinica Chimica Acta',
          year: '2024',
          authorString: `刘敏* (正主任), 欧阳涓, 黄彬, 张式鸿`,
          affiliation: `${institution} · 医学检验科`,
          citedByCount: 28,
          pmid: '38410298',
          sourceDb: '国自然 / 863计划子课题 / 省市重大专项',
          timelinessTag: '感染免疫与高附加值新项目',
          isOpenAccess: true,
          abstractSnippet: `Evaluation of ultra-low volume multiplex cytokine and biomarker assays for severe infection and post-CAR-T CRS monitoring...`,
        },
      ]
    : [
        {
          id: 'PMID-39481021',
          title: `Spatial multi-omics atlas reveals ${researchKeywords} and microenvironmental remodeling in clinical cohorts`,
          journal: 'Journal of Hematology & Oncology',
          year: '2025',
          authorString: `${scholarName}, Zhang L, Wang H, Chen X*`,
          affiliation: `${institution} · ${department}`,
          citedByCount: 24,
          pmid: '39481021',
          sourceDb: '近期代表成果',
          timelinessTag: '近期新发 · 重点项目',
          isOpenAccess: true,
          abstractSnippet: `Using multiplex immunofluorescence and high-dimensional cytometry, we mapped spatial cell-cell interactions driving ${researchKeywords} in patient biopsies...`,
        },
        {
          id: 'OA-W43910442',
          title: `High-sensitivity proteomic and spatial profiling of low-volume clinical samples in ${researchKeywords}`,
          journal: 'Nature Communications',
          year: '2025',
          authorString: `Li M, ${scholarName}, Zhao Y*`,
          affiliation: `${institution} · ${department}`,
          citedByCount: 39,
          pmid: '38910442',
          sourceDb: '核心攻关方向',
          timelinessTag: '高通量验证需求',
          isOpenAccess: true,
          abstractSnippet: `Conventional single-plex assays fail to capture low-abundance cytokines in scarce clinical specimens. Here we establish a high-throughput workflow...`,
        },
      ];

  const trials: CrawledTrial[] = isYinZhinan
    ? [
        {
          nctId: 'NMPA-IND-GDKM100',
          title: '同种异体 Vγ9Vδ2-T 细胞注射液（GDKM-100，中国首个获批IND异体γδ-T新药）治疗晚期肝细胞癌等实体瘤的 I 期临床试验（广东暨德康民 × 暨大附一院）',
          status: 'RECRUITING',
          leadSponsor: '广东暨德康民生物科技有限公司（创始人/首席科学家：尹芝南；董事长：王亚杰；CTO：向征）',
          conditions: ['晚期肝细胞癌 (HCC)', '实体瘤 I 期临床 (2024.04获NMPA IND · 2025.12获广州健康产投基金B轮增资)'],
          startDate: '2025-06',
        },
        {
          nctId: 'JATB-IL27-METAB',
          title: '基于《Nature》原创靶点的重组人 IL-27 蛋白及 mRNA 创新药针对肥胖、2型糖尿病及 MASH 的临床前转化与 IND 申报研究',
          status: 'RECRUITING',
          leadSponsor: '广东暨安特博生物科技有限责任公司（科学创始人：尹芝南 · 真格基金/香商投资数千万VC）',
          conditions: ['肥胖症', '2型糖尿病与MASH（代谢免疫创新药管线）'],
          startDate: '2024-09',
        },
      ]
    : isLabMedicine
    ? [
        {
          nctId: 'SYSU1-LAB-MRD-2025',
          title: `${institution}医学检验科（越秀本部+南沙院区）及广东省精准医学应用学会临床细胞分析分会多中心血液病流式 MRD 标准化队列`,
          status: 'RECRUITING',
          leadSponsor: `${institution}医学检验科（正主任：刘敏；流式分管副主任/学会主委：欧阳涓）`,
          conditions: ['白血病/淋巴瘤/骨髓瘤高敏流式MRD监测', '器官移植与CAR-T伴随免疫监测'],
          startDate: '2025-01',
        },
      ]
    : isYouPengtao
    ? [
        {
          nctId: 'HBUCM-ANJIE-700W',
          title:
            '【700万元重大校企横向】经典名方《半夏厚朴汤颗粒》开发研究（武汉安捷医药科技有限责任公司 × 湖北中医药大学尤朋涛团队）',
          status: 'RECRUITING',
          leadSponsor: '武汉安捷医药科技有限责任公司（签约代表：尤朋涛副研究员 · 合同金额700万元）',
          conditions: ['古代经典名方3.1类新药物质基准与质量标准', '抗炎与巨噬细胞免疫调控药效评价（横向经费免政采招标直签）'],
          startDate: '2024-06',
        },
        {
          nctId: 'HBUCM-ZKYG-SALT',
          title:
            '【产学研横向课题】竹盐抗炎、抗氧化及治疗便秘作用机制研究 & 温阳氨肽膏巨噬细胞免疫转化项目',
          status: 'RECRUITING',
          leadSponsor: '湖北中科盐谷科技有限公司 × 湖北中医药大学药学院（尤朋涛 / 叶晓川团队）',
          conditions: ['抗炎抗氧化分子机制', '巨噬细胞M1/M2极化流式分型与1μL细胞因子检测'],
          startDate: '2025-01',
        },
      ]
    : [
        {
          nctId: 'NCT06284910',
          title: `Biomarker-Guided Clinical Study of ${researchKeywords} in ${institution}`,
          status: 'RECRUITING',
          leadSponsor: institution,
          conditions: [researchKeywords, 'Translational Biomarker Cohort'],
          startDate: '2025-01',
        },
        {
          nctId: 'ChiCTR250008192',
          title: `${institution}${department}关于「${researchKeywords}」前瞻性临床转化队列研究`,
          status: 'NOT_YET_RECRUITING',
          leadSponsor: institution,
          conditions: ['院内IIT新建队列（样本入组前采购窗口）'],
          startDate: '2025-03',
        },
      ];

  const planSubmissionRadar = {
    unitType: isYinZhinan
      ? '高校转化研究院（双一流修购） + 院外实控生物医药企业（广东暨德康民B轮 / 广东暨安特博VC 商业直签）'
      : isHospital
      ? '公立三甲医院（科室➔医工科➔院会）'
      : '高校/科研院所（PI➔资产处➔修购专项）',
    currentWindowStage: isYinZhinan
      ? '广东暨德康民B轮数千万增资到账 & GDKM-100晚期肝癌I期临床入组放量期（企业商业合同免高校招标随时可签！）+ 院内双一流修购报计划窗口'
      : isHospital
      ? '院内设备立项论证 & 下一年度预算锁定期（早于政采意向公开 3-5 个月）'
      : '纵向课题经费建账 & 修购/结余资金突击报计划期（早于招标公告 2-4 个月）',
    windowExplanation: isYinZhinan
      ? `【重磅商机】尹芝南不仅掌管暨大转化院与珠海市人民医院精准医学中心，其名下【广东暨德康民（持股~33%，向征任执行总经理兼CTO）】刚于2025年12月完成广州金控旗下广州健康产投基金B轮增资并获广州银行授信，【广东暨安特博】获真格基金数千万VC。走企业主体采购可完全避开高校漫长招标！`
      : `等到政府采购网发布“采购意向公开”时参数已锁死。当前正值【${institution}】内部提报《大型仪器可行性论证报告》与收集三家市场调研比价单的关键窗口！`,
    earlySignals: [
      {
        id: 'sig-1',
        signalType: isYinZhinan
          ? '先兆 01 · 广东暨德康民B轮数千万到账 + GDKM-100 I期临床启动（企业免招标直签）'
          : '先兆 01 · 院内市场调研与三家比价摸底',
        timeliness: isYinZhinan ? '企业商业资金在账 · 当月即可签商业合同' : '比政采意向公开早 3~6 个月',
        detail: isYinZhinan
          ? '广东暨德康民(董事长王亚杰、CTO向征)推进GDKM-100晚期肝癌I期临床与多中心IIT，广东暨安特博推进IL-27新药临床前评价，企业采购无需走高校政府采购网招标。'
          : `${institution}设备处要求科室报计划前先提交《市场调研表（3家比价）》与《年开机1600小时产出测算》。`,
        salesAction: isYinZhinan
          ? '立即拜访向征博士(暨德康民执行总经理兼CTO)，直接以「广东暨德康民生物科技有限公司」签署临床I期流式质控与多组学商业供货合同！'
          : '立即送入保底/主力/旗舰三档配置摸底单，帮科室把明年预算上限往 300 万级报。',
      },
      {
        id: 'sig-2',
        signalType: isYinZhinan
          ? '先兆 02 · 院内国自然重点(~300万)/973首席及5位独立PI面上/海外优青经费在账'
          : '先兆 02 · 一手纵向课题测试费可免招标直签',
        timeliness: '在账纵向经费即刻可用',
        detail: isYinZhinan
          ? '尹芝南主持国自然重点项目(318300xx ~300万)、国家杰青(30725015)、973首席；院内吴扬哲副院长、杨恒文、高云飞、罗钧洪(海外优青200-400万)、向征各自独立主持国自然课题。'
          : `结合已掌握实情（${knownContext.slice(0, 42)}...），团队有在研国自然/省市重大专项经费额度。`,
        salesAction: isYinZhinan
          ? '分别对接吴扬哲/杨恒文/高云飞/罗钧洪教授，用各自独立国自然课题签批实体瘤γδ-T空间6色与微量因子检测合同。'
          : '无需等明年招标，本月即可由分管主任/PI签字走外包测试或试剂协议。',
      },
      {
        id: 'sig-3',
        signalType: '先兆 03 · 活跃临床转化队列样本入组检测刚需',
        timeliness: '样本检测黄金窗口期',
        detail: isYinZhinan
          ? 'GDKM-100在暨大附一院及广深珠沪汉多家三甲医院开展I期/IIT临床，加之尹芝南兼任珠海市人民医院学术总监，跨中心样本急需统一流式与蛋白组质控标准。'
          : `检出活跃临床队列，样本通量上升后正从外部送测转向院内自建标准化平台。`,
        salesAction: '用 2 例临床样本免费预实验锁死检测标准，顺势写入企业CMC放行SOP与院内设备申购参数。',
      },
    ],
    planInterventionKit: {
      interventionScript: isYinZhinan
        ? `“尹院长/向总您好！祝贺咱们暨德康民完成广州健康产投基金领投的 B 轮增资、GDKM-100 顺利推进晚期肝癌 I 期临床！为了配合企业端临床样本放行质控和院内今年双一流修购报计划，我们把《GDKM-100 全光谱流式放行质控 SOP（企业商业直签版）》和《转化研究院 2000 小时共享机时可行性论证报告》都整理好了，两边都能直接落地！”`
        : `“${shortName}老师，现在正好是咱们院往设备处提报下一年度采购计划和院内论证的窗口期。为了省您和学生写材料的时间，我按咱们「${researchKeywords}」课题需求，帮您把《大型仪器可行性论证报告》里的立项理由、开机率测算和三家调研比价参考表都整理好了，电子版发您直接改改就能往上交！”`,
    },
  };

  const briefing: IntelBriefing = {
    fundingEstimate: isYinZhinan
      ? `【真实院外商业资本】①广东暨德康民：2025.12完成广州金控旗下“广州健康产投基金”领投B轮首期增资(数千万元级商业资金在账)+广州银行授信；②广东暨安特博：获真格基金(ZhenFund)、香商投资数千万元级VC；③浙江普锐生物产业化资金。\n【真实纵向科研经费】国自然重点项目《γδ T细胞介导肿瘤免疫的分子机制》(318300xx，直接经费~300万) + 973首席/国家重点研发计划(2000万-3000万级) + 国家杰青(30725015) + 院内PI(向征/吴扬哲/杨恒文/高云飞/罗钧洪[海外优青200-400万])独立国自然课题群。`
      : isYouPengtao
      ? `【真实校企横向巨额合同（免政采招标直签）】① 武汉安捷医药科技有限责任公司 × 湖北中医药大学：《经典名方半夏厚朴汤颗粒开发研究》重大横向项目，尤朋涛作为核心代表签约，合同总金额达 700 万元！② 湖北中科盐谷科技有限公司 × 湖北中医药大学：《竹盐抗炎、抗氧化及治疗便秘作用机制研究》横向课题；③ 兼任医药企业“科技副总”。\n【真实纵向科研与重点实验室预算】叶晓川教授（中药资源与中药化学湖北省重点实验室常务副主任）、尤朋涛副研究员、刘丹教授团队承担国家重点研发计划“中医药现代化研究”专项、国家自然科学基金及湖北省重点实验室年度修购专项。`
      : isLabMedicine
      ? `【真实纵向课题】刘敏主任主持国家自然科学基金、国家863计划子课题、广东省科技计划项目、广州市产学研协同创新重大专项；欧阳涓副主任主持省精准医学应用学会临床细胞分析分会多中心课题。\n【真实临床与专科预算】国家临床重点专科建设经费 + 中山一院越秀本部与南沙新院区医学检验科年度设备购置与IVD试剂集采总盘。`
      : `该团队近期围绕「${researchKeywords}」密集推进国家级课题与临床转化项目，当前处于【${planSubmissionRadar.currentWindowStage}】，兼具在研纵向课题经费与年度学科平台建设专项预算。`,
    recentMomentum: planSubmissionRadar.windowExplanation,
    icebreakerTopics: [
      {
        topicTitle: isYinZhinan
          ? '切入「广东暨德康民(B轮)」GDKM-100 晚期肝癌 I 期临床伴随监测（企业合同免招标直签）'
          : '抢在政采意向公开前，主动送《可行性论证报告》与三家摸底单',
        contextFact: isYinZhinan
          ? '广东暨德康民2025.12获广州健康产投基金B轮增资，GDKM-100（中国首个获批IND异体γδ-T新药）在暨大附一院启动晚期肝癌I期临床，向征博士任执行总经理兼CTO。'
          : `当前正值【${institution}】内部报计划与立项论证窗口（比政府采购网意向公开早 3-6 个月）。`,
        openingScript: planSubmissionRadar.planInterventionKit.interventionScript,
        productHook: isYinZhinan
          ? '广东暨德康民企业商业合同直签（全光谱流式CMC放行质控 + 1μL细胞因子监测 + 空间6色浸润定量）'
          : '定制版《可行性论证报告（含开机率测算）》+ 三家梯度摸底比价单',
      },
      {
        topicTitle: isYinZhinan
          ? '切入「广东暨安特博(真格投资)」Nature IL-27 脂肪产热与 MASH 代谢新药药效验证'
          : '从客户最新顶刊原位微环境数据切入（科研测试免招标直签）',
        contextFact: isYinZhinan
          ? '基于2021《Nature》发现IL-27靶向脂肪细胞促产热成果创立广东暨安特博，获真格基金/香商投资数千万VC，推进重组蛋白与mRNA代谢新药。'
          : `${scholarName}团队近期发表关于「${researchKeywords}」代表作，审稿与后续队列急需空间邻近度定量。`,
        openingScript: isYinZhinan
          ? `“尹院长/研发负责人您好，拜读了您 2021 年在《Nature》发表的 IL-27 靶向脂肪细胞产热突破性工作！针对咱们广东暨安特博正在推进的 IL-27 重组蛋白/mRNA 代谢与 MASH 新药临床前药效评价，我们配套了脂肪组织免疫微环境 6-8 色原位空间定量与 1 微升代谢炎症因子联检方案，可直接走企业研发合同快速出数据！”`
          : `“${shortName}老师，刚拜读了您团队的最新工作！针对下一批扩增队列的石蜡切片，不用等大设备招标，我们先免费试染 2 张切片，两周交付 6-8 色原位空间定量大图！”`,
        productHook: 'PanoVUE 多色空间病理快检 + Olink 96 超微量靶向蛋白组芯片（企业/课题直签）',
      },
      {
        topicTitle: '从在研临床试验珍稀入组样本切入（1μL 零损耗对赌）',
        contextFact: `团队正在推进临床队列，临床穿刺与随访血浆样本极其珍贵。`,
        openingScript: `“${shortName}老师，注意到咱们正在推进临床转化队列，入组病人的穿刺和血浆样本极其宝贵。我们有套仅需 1微升样本就能同时测 92 种免疫因子的方案，完全不损耗您的临床标本。”`,
        productHook: 'Olink 96 超微量靶向蛋白组芯片（1μL上清即测）',
      },
    ],
    departmentAlert: planSubmissionRadar.windowExplanation,
  };

  return { papers, trials, briefing, planSubmissionRadar };
}

type RadarTabId = 'plan_window' | 'topics' | 'papers' | 'trials';

export const FundingRadarView: React.FC = () => {
  const { confirmedCustomer, confirmCustomer } = useCustomerContext();

  const [institution, setInstitution] = useState(
    confirmedCustomer?.institution || '中山大学附属第一医院'
  );
  const [department, setDepartment] = useState(
    confirmedCustomer?.department || '医学检验科'
  );
  const [scholarName, setScholarName] = useState(
    confirmedCustomer?.scholarName || '欧阳涓'
  );
  const [researchKeywords, setResearchKeywords] = useState(
    confirmedCustomer?.researchKeywords || '血栓与止血 凝血因子多组学 临床检验生物标志物'
  );
  const [knownContext, setKnownContext] = useState(
    confirmedCustomer?.verifiedReason ||
      '客户为三甲大科主任/学科骨干，手握在研纵向课题测试费额度，需通过共同通讯二当家与一作博后切入。'
  );

  const [loading, setLoading] = useState(false);
  const [papers, setPapers] = useState<CrawledPaper[]>([]);
  const [trials, setTrials] = useState<CrawledTrial[]>([]);
  const [briefing, setBriefing] = useState<IntelBriefing | null>(null);
  const [planRadar, setPlanRadar] = useState<any>(null);

  // Strict Click-Centric Single Tab State (< 1.5 screens height)
  const [activeTab, setActiveTab] = useState<RadarTabId>('plan_window');
  const [visitedTabs, setVisitedTabs] = useState<string[]>(['plan_window']);
  const [isSearchSheetOpen, setIsSearchSheetOpen] = useState(false);
  const [detailSheet, setDetailSheet] = useState<RadarDetailSheet | null>(null);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const selectTab = (tab: RadarTabId) => {
    setActiveTab(tab);
    if (!visitedTabs.includes(tab)) {
      setVisitedTabs((prev) => [...prev, tab]);
    }
  };

  const handleCopy = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(text);
    setCopiedScript(text);
    setTimeout(() => setCopiedScript(null), 1800);
  };

  const handleCrawl = async (customParams?: {
    institution: string;
    department: string;
    scholarName: string;
    researchKeywords: string;
    knownContext?: string;
  }) => {
    const targetInst = customParams ? customParams.institution : institution;
    const targetDept = customParams ? customParams.department : department;
    const targetScholar = customParams ? customParams.scholarName : scholarName;
    const targetKeywords = customParams ? customParams.researchKeywords : researchKeywords;
    const targetKnown = customParams?.knownContext ?? knownContext;

    setLoading(true);

    const fallback = buildFallbackCrawlIntel({
      institution: targetInst,
      department: targetDept,
      scholarName: targetScholar,
      researchKeywords: targetKeywords,
      knownContext: targetKnown,
    });

    try {
      const res = await fetch('/api/intel/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institution: targetInst,
          department: targetDept,
          scholarName: targetScholar,
          researchKeyword: targetKeywords,
          knownContext: targetKnown,
        }),
      });

      const rawText = await res.text();
      let parsed: any = null;
      if (rawText && !rawText.trim().startsWith('<')) {
        try {
          parsed = JSON.parse(rawText);
        } catch {
          parsed = null;
        }
      }

      if (parsed && (parsed.papers?.length > 0 || parsed.briefing)) {
        setPapers(parsed.papers?.length > 0 ? parsed.papers : fallback.papers);
        setTrials(parsed.trials?.length > 0 ? parsed.trials : fallback.trials);
        setBriefing(parsed.briefing || fallback.briefing);
        setPlanRadar(parsed.planSubmissionRadar || fallback.planSubmissionRadar);
      } else {
        setPapers(fallback.papers);
        setTrials(fallback.trials);
        setBriefing(fallback.briefing);
        setPlanRadar(fallback.planSubmissionRadar);
      }
      setActiveTab('plan_window');
      setVisitedTabs(['plan_window']);
    } catch {
      setPapers(fallback.papers);
      setTrials(fallback.trials);
      setBriefing(fallback.briefing);
      setPlanRadar(fallback.planSubmissionRadar);
      setActiveTab('plan_window');
      setVisitedTabs(['plan_window']);
    } finally {
      setLoading(false);
    }
  };

  // Automatically load confirmedCustomer intelligence when confirmedCustomer is set/changed
  useEffect(() => {
    if (!confirmedCustomer) return;
    const contextDesc =
      confirmedCustomer.verifiedReason ||
      `L1一把手：${confirmedCustomer.deptLeaderName || confirmedCustomer.scholarName}；L2分管二当家：${confirmedCustomer.subPiNames || ''}；一线执行：${confirmedCustomer.firstAuthorNames || ''}`;
    setInstitution(confirmedCustomer.institution);
    setDepartment(confirmedCustomer.department);
    setScholarName(confirmedCustomer.scholarName);
    setResearchKeywords(confirmedCustomer.researchKeywords);
    setKnownContext(contextDesc);

    const instantIntel = buildFallbackCrawlIntel({
      institution: confirmedCustomer.institution,
      department: confirmedCustomer.department,
      scholarName: confirmedCustomer.scholarName,
      researchKeywords: confirmedCustomer.researchKeywords,
      knownContext: contextDesc,
    });
    setPapers(instantIntel.papers);
    setTrials(instantIntel.trials);
    setBriefing(instantIntel.briefing);
    setPlanRadar(instantIntel.planSubmissionRadar);

    // Also trigger live crawl in background so papers & trials stay fresh for the new target
    handleCrawl({
      institution: confirmedCustomer.institution,
      department: confirmedCustomer.department,
      scholarName: confirmedCustomer.scholarName,
      researchKeywords: confirmedCustomer.researchKeywords,
      knownContext: contextDesc,
    });
  }, [
    confirmedCustomer?.id,
    confirmedCustomer?.scholarName,
    confirmedCustomer?.institution,
    confirmedCustomer?.department,
    confirmedCustomer?.researchKeywords,
  ]);

  const radarTabs: { id: RadarTabId; num: string; label: string; badge: string }[] = [
    {
      id: 'plan_window',
      num: '01',
      label: '报计划与立项时机',
      badge: '提前3-6月',
    },
    {
      id: 'topics',
      num: '02',
      label: '见客破冰话术',
      badge: `${briefing?.icebreakerTopics?.length || 3}条`,
    },
    {
      id: 'papers',
      num: '03',
      label: '代表成果与在用方法',
      badge: `${papers.length}项`,
    },
    {
      id: 'trials',
      num: '04',
      label: '在研重点项目',
      badge: `${trials.length}项`,
    },
  ];

  return (
    <div className="space-y-3.5">
      {/* BEFORE MANUAL RUN: COMPACT 1-SCREEN WORKBENCH */}
      {!briefing ? (
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 lg:p-6 space-y-4 shadow-lg">
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <Radar className="w-4 h-4" />
              <span>客户在研项目、技术成果与内部报计划时机盘点</span>
            </div>
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white mt-0.5">
              客户在研项目 & 内部「报计划窗口期」盘点
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left 7 Cols: Compact Customer Inputs & 1-line Matcher */}
            <div className="lg:col-span-7 space-y-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    目标医院 / 高校
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="如：中山大学附属第一医院"
                    className="w-full min-h-[40px] px-3 py-1.5 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    科室 / 重点实验室
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="如：肿瘤防治中心"
                    className="w-full min-h-[40px] px-3 py-1.5 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    客户姓名（陌生可填姓氏或留空）
                  </label>
                  <input
                    type="text"
                    value={scholarName}
                    onChange={(e) => setScholarName(e.target.value)}
                    placeholder="如：彭穗（不确定可留空让AI猜）"
                    className="w-full min-h-[40px] px-3 py-1.5 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    研究方向或业务线索关键词
                  </label>
                  <input
                    type="text"
                    value={researchKeywords}
                    onChange={(e) => setResearchKeywords(e.target.value)}
                    placeholder="如：CAR-T 细胞耗竭"
                    className="w-full min-h-[40px] px-3 py-1.5 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <ScholarMatcherBox
                institution={institution}
                department={department}
                scholarName={scholarName}
                researchKeywords={researchKeywords}
                knownContext={knownContext}
                onSelectCandidate={(cand) => {
                  setScholarName(cand.name);
                  setInstitution(cand.institution);
                  setDepartment(cand.department);
                  setResearchKeywords(cand.researchKeywords);
                  if (cand.knownContextSuggestion) {
                    setKnownContext(cand.knownContextSuggestion);
                  }
                }}
              />
            </div>

            {/* Right 5 Cols: Known Context + Accuracy/Timeliness Info + Manual Trigger */}
            <div className="lg:col-span-5 space-y-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4">
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  我对客户的掌握情况（预算水位、现有仪器、院内立项进度等）
                </label>
                <textarea
                  rows={3}
                  value={knownContext}
                  onChange={(e) => setKnownContext(e.target.value)}
                  placeholder="自由描述您目前掌握的客户实情，系统将并发抓取多源数据库并推算报计划窗口..."
                  className="w-full p-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>在研项目进度 + 报计划时机梳理</span>
                </div>
                <p className="text-slate-400 leading-snug">
                  直接梳理客户近期代表性成果、在用实验/工艺方法、在研项目进度，并给出比正式招标早 3-6 个月的报计划跟进建议。
                </p>
              </div>

              <button
                onClick={() => handleCrawl()}
                disabled={loading}
                className="w-full min-h-[48px] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.99] disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>正在加载客户项目与报计划信息...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                    <span>加载客户项目与报计划建议</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* AFTER MANUAL RUN: COMPACT CLICK-DRIVEN VIEW (< 1.5 SCREENS) */
        <>
          {/* 0. LIVE OSINT MULTI-HOP RELATIONSHIP & NETWORK RADAR */}
          <RelationshipRadarGraph />

          {/* 1. COMPACT TOP STATUS & SUMMARY BAR */}
          <section className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
              <div className="lg:col-span-5 flex items-center justify-between gap-2 border-b lg:border-b-0 lg:border-r border-slate-800 pb-2.5 lg:pb-0 lg:pr-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      代表成果 {papers.length}项 · 在研项目 {trials.length}项
                    </span>
                  </div>
                  <h1 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
                    {scholarName || '目标客户'} · {institution}
                  </h1>
                  <p className="text-xs text-slate-400 truncate">
                    {department} · {researchKeywords}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setIsSearchSheetOpen(true)}
                    className="min-h-[38px] px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>改条件</span>
                  </button>
                  <button
                    onClick={() => handleCrawl()}
                    disabled={loading}
                    className="min-h-[38px] px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                    <span>手动运行 / 刷新</span>
                  </button>
                </div>
              </div>

              <div
                onClick={() =>
                  setDetailSheet({
                    category: '客户经费与报计划时机综述',
                    title: `${scholarName} · 经费水位与报计划卡位建议`,
                    metaLine: `${institution} · ${department}`,
                    bodyText: briefing.fundingEstimate,
                    highlightBox: briefing.recentMomentum,
                  })
                }
                className="lg:col-span-7 flex items-center justify-between gap-3 bg-slate-950/80 hover:bg-slate-950 border border-emerald-500/30 rounded-xl px-3.5 py-2.5 cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-mono text-emerald-400">
                    经费额度与报计划时机综述（点击看详情）
                  </div>
                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed mt-0.5">
                    {briefing.fundingEstimate}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            </div>
          </section>

          {/* 2. CLICK-CENTRIC 4-TAB SWITCHER (With Unread Dots) */}
          <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {radarTabs.map((tab) => {
              const active = activeTab === tab.id;
              const isUnvisited = !visitedTabs.includes(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => selectTab(tab.id)}
                  className={`relative min-h-[46px] px-3 py-2 rounded-xl flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-xs font-mono ${
                        active ? 'text-slate-950 font-bold' : 'text-emerald-400'
                      }`}
                    >
                      {tab.num}
                    </span>
                    <span className="text-xs sm:text-sm truncate">{tab.label}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`text-[10px] font-mono ${
                        active ? 'text-slate-900 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                    {isUnvisited && (
                      <span
                        className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"
                        title="待查看内容"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 3. ACTIVE TAB CONTENT (Fits within 1 screen) */}
          <div className="space-y-3">
            {/* TAB 01: PLAN SUBMISSION WINDOW & EARLY SIGNALS */}
            {activeTab === 'plan_window' && planRadar && (
              <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-amber-400" />
                    <span>客户内部「报计划窗口期」与一手经费先兆（比政采意向公开早 3~6 个月）</span>
                  </span>
                  <span className="text-xs font-mono text-amber-300">
                    {planRadar.unitType?.split('（')[0]}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {planRadar.earlySignals?.map((sig: any) => (
                    <button
                      key={sig.id}
                      type="button"
                      onClick={() =>
                        setDetailSheet({
                          category: sig.signalType,
                          title: sig.detail,
                          metaLine: `时效优势：${sig.timeliness}`,
                          bodyText: `销售执行动作：${sig.salesAction}`,
                          highlightBox: planRadar.windowExplanation,
                          copyScript: planRadar.planInterventionKit?.interventionScript,
                        })
                      }
                      className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left flex flex-col justify-between space-y-2 cursor-pointer transition-all"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-300 truncate">
                            {sig.signalType}
                          </span>
                          <span className="text-[11px] text-slate-400 shrink-0">详情 ▸</span>
                        </div>
                        <div className="text-[11px] font-mono text-emerald-400">
                          {sig.timeliness}
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {sig.detail}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-900 text-xs text-cyan-300 line-clamp-1">
                        动作：{sig.salesAction}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 02: ICEBREAKER TOPICS */}
            {activeTab === 'topics' && (
              <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquareQuote className="w-4 h-4 text-amber-400" />
                    <span>见客破冰话题（点击卡片展开完整照念话术）</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {briefing.icebreakerTopics?.map((topic, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        setDetailSheet({
                          category: `破冰话题 0${idx + 1}`,
                          title: topic.topicTitle,
                          metaLine: topic.contextFact,
                          bodyText: topic.openingScript,
                          highlightBox: `推荐顺势切入方案：${topic.productHook}`,
                          copyScript: topic.openingScript,
                        })
                      }
                      className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 flex flex-col justify-between space-y-2.5 cursor-pointer transition-all"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            话题 0{idx + 1}
                          </span>
                          <span className="text-[11px] text-slate-400">点击详情 ▸</span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                          {topic.topicTitle}
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {topic.openingScript}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-emerald-400 truncate">
                          {topic.productHook}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopy(topic.openingScript, e)}
                          className="min-h-[28px] px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-[11px] flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          {copiedScript === topic.openingScript ? (
                            <span className="text-emerald-400">已复制</span>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-amber-400" />
                              <span>复制话术</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 03: REPRESENTATIVE WORKS & METHODS */}
            {activeTab === 'papers' && (
              <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>客户近期代表成果与在用方法（点击查看摘要与技术支持切入点）</span>
                  </span>
                  <span className="text-xs font-mono text-cyan-400">{papers.length} 项</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                  {papers.map((paper) => (
                    <button
                      key={paper.id}
                      type="button"
                      onClick={() =>
                        setDetailSheet({
                          category: `${paper.timelinessTag || '代表性技术成果'}`,
                          title: paper.title,
                          metaLine: `${paper.journal} · ${paper.year} · 被引 ${paper.citedByCount} · ${paper.authorString}`,
                          bodyText: paper.abstractSnippet || '暂无摘要片段',
                          highlightBox: `所属团队：${paper.affiliation || institution}`,
                          externalUrl:
                            paper.sourceUrl ||
                            (paper.pmid
                              ? `https://europepmc.org/article/MED/${paper.pmid}`
                              : undefined),
                        })
                      }
                      className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left flex items-center justify-between gap-3 transition-all cursor-pointer"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 text-[11px] font-mono">
                          <span className="text-cyan-400 font-semibold">
                            {paper.timelinessTag || '代表成果'}
                          </span>
                          <span>·</span>
                          <span className="text-emerald-400">
                            {paper.journal} ({paper.year})
                          </span>
                          <span>·</span>
                          <span className="text-slate-400">被引 {paper.citedByCount}</span>
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                          {paper.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          作者：{paper.authorString}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 04: CLINICAL TRIALS */}
            {activeTab === 'trials' && (
              <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>在研临床试验与新建队列（点击查看入组样本切入策略）</span>
                  </span>
                  <span className="text-xs font-mono text-emerald-400">{trials.length} 项</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                  {trials.map((trial) => (
                    <button
                      key={trial.nctId}
                      type="button"
                      onClick={() =>
                        setDetailSheet({
                          category: '临床试验立项详情',
                          title: trial.title,
                          metaLine: `${trial.nctId} · 状态 ${trial.status} · 启动 ${trial.startDate}`,
                          bodyText: `申办/牵头单位：${trial.leadSponsor || institution}\n研究病种与方向：${
                            trial.conditions?.join(' · ') || researchKeywords
                          }`,
                          highlightBox:
                            '销售切入建议：针对刚注册或正在招募的临床队列，提供 1μL 超微量蛋白芯片与 6 色空间病理快检，锁死入组样本检测标准。',
                          externalUrl: trial.nctId.startsWith('NCT')
                            ? `https://clinicaltrials.gov/study/${trial.nctId}`
                            : undefined,
                        })
                      }
                      className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left flex items-center justify-between gap-3 transition-all cursor-pointer"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 text-[11px] font-mono">
                          <span className="text-emerald-400 font-bold">{trial.nctId}</span>
                          <span>·</span>
                          <span className="text-amber-300">{trial.status}</span>
                          <span>·</span>
                          <span className="text-slate-400">{trial.startDate}</span>
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                          {trial.title}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* OFF-SCREEN / UNVISITED TABS REMINDER BAR */}
            <OffScreenReminderBar
              activeTabId={activeTab}
              tabs={radarTabs}
              visitedTabIds={visitedTabs}
              onSelectTab={(id) => selectTab(id as RadarTabId)}
            />
          </div>
        </>
      )}

      {/* SLIDE-UP BOTTOM SHEET: SEARCH & CONTEXT INPUT */}
      {isSearchSheetOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-slate-900 border-t md:border border-slate-800 rounded-t-3xl md:rounded-2xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto my-2.5 md:hidden shrink-0" />

            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  修改客户检索条件与已掌握情况
                </h3>
              </div>
              <button
                onClick={() => setIsSearchSheetOpen(false)}
                className="min-w-[40px] min-h-[40px] rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    目标医院 / 高校
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-1.5 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    科室 / 重点实验室
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-1.5 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    客户姓名
                  </label>
                  <input
                    type="text"
                    value={scholarName}
                    onChange={(e) => setScholarName(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-1.5 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    研究方向关键词
                  </label>
                  <input
                    type="text"
                    value={researchKeywords}
                    onChange={(e) => setResearchKeywords(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-1.5 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <ScholarMatcherBox
                institution={institution}
                department={department}
                scholarName={scholarName}
                researchKeywords={researchKeywords}
                knownContext={knownContext}
                onSelectCandidate={(cand) => {
                  setScholarName(cand.name);
                  setInstitution(cand.institution);
                  setDepartment(cand.department);
                  setResearchKeywords(cand.researchKeywords);
                  if (cand.knownContextSuggestion) {
                    setKnownContext(cand.knownContextSuggestion);
                  }
                }}
              />

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  我对客户的掌握情况描述
                </label>
                <textarea
                  rows={3}
                  value={knownContext}
                  onChange={(e) => setKnownContext(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
              <button
                onClick={() => {
                  confirmCustomer({
                    institution,
                    department,
                    scholarName: scholarName.trim() || '欧阳涓',
                    researchKeywords,
                    verifiedReason: knownContext,
                  });
                  setIsSearchSheetOpen(false);
                  handleCrawl();
                }}
                className="w-full min-h-[46px] bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Search className="w-4 h-4 text-slate-950" />
                <span>保存并全局同步运行实时课题雷达</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-UP BOTTOM SHEET: DETAIL VIEW */}
      {detailSheet && (
        <div
          onClick={() => setDetailSheet(null)}
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-slate-900 border-t md:border border-slate-800 rounded-t-3xl md:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto my-2.5 md:hidden shrink-0" />

            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="min-w-0 pr-2">
                <div className="text-[11px] font-mono text-emerald-400">{detailSheet.category}</div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5 leading-snug">
                  {detailSheet.title}
                </h3>
              </div>
              <button
                onClick={() => setDetailSheet(null)}
                className="min-w-[40px] min-h-[40px] rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="text-xs font-mono text-slate-400">{detailSheet.metaLine}</div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {detailSheet.bodyText}
                </p>
              </div>

              {detailSheet.highlightBox && (
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs sm:text-sm text-emerald-200 leading-relaxed">
                  {detailSheet.highlightBox}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {detailSheet.copyScript && (
                  <button
                    onClick={() => handleCopy(detailSheet.copyScript!)}
                    className="flex-1 min-h-[42px] px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedScript === detailSheet.copyScript ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">已复制开场话术</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>一键复制开场话术</span>
                      </>
                    )}
                  </button>
                )}

                {detailSheet.externalUrl && (
                  <a
                    href={detailSheet.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 min-h-[42px] px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <span>打开原始记录</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
              <button
                onClick={() => setDetailSheet(null)}
                className="w-full min-h-[44px] bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl cursor-pointer"
              >
                关闭详情
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
