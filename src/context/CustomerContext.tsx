import React, { createContext, useContext, useState, useEffect } from 'react';

export type IndustrySectorId = 'biomed' | 'semicon_mfg' | 'enterprise_ai' | 'chem_materials';

export interface IndustrySectorMeta {
  id: IndustrySectorId;
  shortLabel: string;
  fullName: string;
  orgLabel: string;
  deptLabel: string;
  personLabel: string;
  keywordLabel: string;
  orgPlaceholder: string;
  deptPlaceholder: string;
  personPlaceholder: string;
  keywordPlaceholder: string;
  opexLabel: string;
  capexLabel: string;
}

export const B2B_INDUSTRY_SECTORS: IndustrySectorMeta[] = [
  {
    id: 'biomed',
    shortLabel: '生命科学 / 医疗临床',
    fullName: '三甲医院临床科室与科研院所',
    orgLabel: '目标医院 / 科研院所',
    deptLabel: '所属科室 / 实验室',
    personLabel: '客户姓名',
    keywordLabel: '研究或临床业务方向',
    orgPlaceholder: '如：中山大学附属第一医院',
    deptPlaceholder: '如：医学检验科 / 消化内科 / 肝胆外科',
    personPlaceholder: '如：欧阳涓 / 陈旻湖 / 匡铭',
    keywordPlaceholder: '如：流式MRD / IBD黏膜免疫 / 肝癌消融',
    opexLabel: '≤5万元课题测试化验加工费（子课题负责人直接签批）',
    capexLabel: '200-350万元院级设备修购专项（需提前3-6个月提报立项论证）',
  },
  {
    id: 'semicon_mfg',
    shortLabel: '半导体 / 高端制造',
    fullName: '半导体、新能源汽车与高端制造产线',
    orgLabel: '目标制造企业',
    deptLabel: '事业部 / 研发中心 / 产线',
    personLabel: '客户姓名',
    keywordLabel: '工艺方向或产线检测环节',
    orgPlaceholder: '如：比亚迪半导体 / 宁德时代21C实验室',
    deptPlaceholder: '如：功率半导体事业部 / 失效分析(FA)中心',
    personPlaceholder: '如：陈刚 / 欧阳楚英',
    keywordPlaceholder: '如：SiC银烧结空洞率 / 在线3D无损检测',
    opexLabel: '≤10万元研发打样与失效分析验证费（部门副总/总监直接签批）',
    capexLabel: '500-1200万元产线扩产在线检测设备（需提前4-6个月完成AVL准入）',
  },
  {
    id: 'enterprise_ai',
    shortLabel: '政企数字化 / 金融科技',
    fullName: '金融机构科技部与大型政企数字化中心',
    orgLabel: '目标金融机构 / 企业',
    deptLabel: '科技部二级中心 / 架构部',
    personLabel: '客户姓名',
    keywordLabel: '系统架构或AI算力场景',
    orgPlaceholder: '如：招商银行总行信息技术部',
    deptPlaceholder: '如：云原生与AI算力中心 / 数据架构部',
    personPlaceholder: '如：周天虹 / 李云',
    keywordPlaceholder: '如：私有化大模型低延时推理 / 分布式向量数据库',
    opexLabel: '≤15万元部门级POC技术验证与试点预算（二级中心主任直接签批）',
    capexLabel: '800-2000万元年度软硬件集采框招（Q3技术委员会审定技术规范）',
  },
  {
    id: 'chem_materials',
    shortLabel: '化工新材料 / 能源央企',
    fullName: '化工新材料中央研究院与中试基地',
    orgLabel: '目标化工集团 / 能源企业',
    deptLabel: '中央研究院 / 专业研究所',
    personLabel: '客户姓名',
    keywordLabel: '催化聚合工艺或材料表征方向',
    orgPlaceholder: '如：万华化学集团中央研究院',
    deptPlaceholder: '如：高性能聚合物研究所 / POE催化工程中心',
    personPlaceholder: '如：华卫琦 / 张永振',
    keywordPlaceholder: '如：茂金属POE催化剂 / 高温在线流变与GPC表征',
    opexLabel: '≤8万元所级定制表征与耗材测试费（研究所所长直接签批）',
    capexLabel: '400-900万元百吨级中试放大线在线监测与高通量表征平台',
  },
];

export interface ConfirmedCustomerProfile {
  id: string;
  industrySector?: IndustrySectorId;
  institution: string;
  department: string;
  scholarName: string;
  title: string;
  researchKeywords: string;
  englishQuery: string;
  correctionBadge?: string;
  deptLeaderName?: string;
  personTier?: 'L1' | 'L2' | 'L3' | 'L4';
  roleRelationNote?: string;
  subPiNames?: string;
  firstAuthorNames?: string;
  verifiedReason?: string;
  officialSiteSchedule?: string;
  procurementHistoryClue?: string;
  patentCoInventorsClue?: string;
  confirmedAt: string;
}

interface CustomerContextValue {
  activeIndustry: IndustrySectorId;
  setActiveIndustry: (sector: IndustrySectorId) => void;
  confirmedCustomer: ConfirmedCustomerProfile | null;
  customerHistory: ConfirmedCustomerProfile[];
  isSelectingCustomer: boolean;
  setIsSelectingCustomer: (open: boolean) => void;
  confirmCustomer: (
    profile: Omit<ConfirmedCustomerProfile, 'id' | 'confirmedAt' | 'title' | 'englishQuery'> & {
      id?: string;
      title?: string;
      englishQuery?: string;
    }
  ) => ConfirmedCustomerProfile;
  selectFromHistory: (id: string) => void;
  removeFromHistory: (id: string) => void;
}

const STORAGE_HISTORY_KEY = 'fde_confirmed_customer_history_v10';
const STORAGE_ACTIVE_KEY = 'fde_confirmed_active_customer_v10';

const INITIAL_SEED_HISTORY: ConfirmedCustomerProfile[] = [
  {
    id: 'gdtcm-wu-shouhai',
    industrySector: 'biomed',
    institution: '广东省中医药科学院（广东省中医院 / 广中医二附院）',
    department: '省部共建中医湿证国家重点实验室 / 再生医学与转化医学中心 / 肾病科',
    scholarName: '吴寿海 (Shouhai Wu)',
    title:
      '医学博士 / 核心一作青年科研骨干（L2/L3 跨平台第一作者 · 连接林同香/徐洋iPSC再生中心与毛炜肾病科/雒晓东脑病科）',
    researchKeywords:
      '人源hiPSC定向分化多巴胺能神经元与帕病2号方(PaBing-II)抗氧化机制(Front Immunol 2024) · hESC诱导3D肾脏类器官高尿酸血症SLC2A9机制(Front Cell Dev Biol 2024) · 帕金森病USP8去泛素化(CMLS 2023) · 小分子非整合iPSC重编程专利(CN104673741A)',
    englishQuery:
      'Guangdong Provincial Academy of Chinese Medical Sciences Guangdong Provincial Hospital of Chinese Medicine Shouhai Wu Wei Mao Tongxiang Lin',
    correctionBadge:
      '【一院四牌机构穿透 + 论文署名职级核验】①“广东省中医药研究院”官方规范主体为合署运行的「广东省中医药科学院 / 广东省中医院 / 广州中医药大学第二附属医院 / 省部共建中医湿证国家重点实验室」；② 署名位置核验：吴寿海在SCI中均为第一作者(First Author)，实为L2/L3青年科研骨干（医学博士），其背后通讯拍板大老板为毛炜教授（肾病科主任）、林同香/徐洋教授（再生医学中心主任）、雒晓东教授（脑病科主任）！',
    deptLeaderName:
      '毛炜（广东省中医院肾病科主任医师/教授/博导·2024肾脏类器官论文最后通讯） & 林同香/徐洋（广东省中医药科学院再生医学中心主任·2023 CMLS/2024 Front Immunol共同通讯） & 雒晓东（脑病中心主任·帕病2号方带头人）',
    personTier: 'L2',
    roleRelationNote:
      '【五大通用规律实证标杆：一院四牌消歧 + 一作青年骨干顺藤摸瓜穿透三大L1通讯大主任】① 机构核验：广东并无独立法人叫“广东省中医药研究院”，实为“一院四牌”的【广东省中医药科学院 / 广东省中医院 / 广中医二附院 / 省部共建中医湿证国家重点实验室】（区别于恒福路的广东省中医药工程技术研究院/省第二中医院）。② 职级与角色定位纠偏：切勿把所有检索对象盲目当成L1院长！吴寿海（Shouhai Wu，中大生科院09级本科、广中医2020届中西医结合基础博士）在SCI论文中全部担任【第一作者（First Author）】，是典型的【L2/L3一线核心实验青年骨干（博后/助理研究员）】。③ 背后三大L1经费拍板大老板穿透：顺着吴寿海的一作论文通讯作者往上摸，精准锁定三位L1实权大主任——【毛炜教授】（肾病科大主任，2024肾脏类器官论文最后通讯作者）、【林同香教授 & 徐洋教授】（再生医学与转化医学中心主任，iPSC重编程专利CN104673741A及2023 CMLS通讯作者）、【雒晓东教授】（脑病中心大主任，“帕病2号方”临床源头带头人）；同组实验搭档为【荣翠平、李创、李奕蓁、林瑞珊、纪开元】。',
    subPiNames:
      '毛炜（肾病科主任/博导·L1肾脏类器官最后通讯大老板）、林同香/徐洋（再生医学中心主任/特聘教授·L1 iPSC与神经再生通讯大老板）、雒晓东（脑病中心主任/博导·L1帕病2号方带头人）、吴寿海（医学博士·L2/L3核心一作青年骨干·当前锁定客户）',
    firstAuthorNames:
      '吴寿海(Shouhai Wu·核心第一作者) / 荣翠平(Cuiping Rong) / 李创(Chuang Li) / 李奕蓁(Yizhen Li) / 林瑞珊(Ruishan Lin) / 纪开元(Kaiyuan Ji)',
    verifiedReason:
      '广东省中医药科学院/广东省中医院医学博士（Shouhai Wu），以第一作者在《Frontiers in Immunology》(2024, PMID:39156892)、《Frontiers in Cell and Developmental Biology》(2024)、《Cellular and Molecular Life Sciences》(2023, PMID:37819412)发表hiPSC多巴胺能神经元与3D肾脏类器官代表作，并共署国家发明专利《高效非整合性人类iPSC诱导平台》(CN104673741A)。',
    officialSiteSchedule:
      '常驻广州大学城外环东路232号广东省中医药科学院实验大楼（省部共建中医湿证国家重点实验室 / 再生医学与转化医学中心），每日亲自操盘hiPSC诱导分化与3D肾脏类器官培养实验',
    procurementHistoryClue:
      '【真实经费与自下而上破局路径】① 吴寿海本人主持广东省基础与应用基础研究基金省市联合基金（青年项目），可直接决定≤5万元iPSC/类器官多色流式鉴定、全层免疫荧光染片与1μL上清因子试测；② 跑出高分3D类器官与多巴胺神经元空间成像Figure后，由吴寿海引荐其背后的三位L1通讯大老板——肾病科【毛炜主任】（国自然面上+中医湿证国重室重点课题）与再生医学中心【林同香/徐洋教授】（大学城实验室平台修购预算）拍板大单！',
    patentCoInventorsClue:
      '【自下而上顺藤摸瓜链】先抓L2/L3一作骨干：吴寿海博士（亲手养iPSC与3D肾脏类器官，辅以同组荣翠平、李创、林瑞珊） ➔ 穿透背后三大L1通讯大老板：毛炜主任（肾病科） + 林同香/徐洋教授（再生医学中心） + 雒晓东主任（脑病中心）',
    confirmedAt: '09:45',
  },
  {
    id: 'bucm-wang-yao',
    industrySector: 'biomed',
    institution: '北京中医药大学',
    department: '北京中医药研究院 / 生命科学学院 / 中药学院',
    scholarName: '王遥（王瑶）',
    title:
      '北京中医药研究院副院长 / 生命科学学院·中药学院教授 / 博士生导师 / 北京市科技新星 / 青年人才托举工程A类（L2 分管副院长 & 实权PI）',
    researchKeywords:
      '中药生物碱/内酯/黄酮免疫药理学 · 双苄基异喹啉生物碱调控NPC1-STING免疫代谢抗病毒(NSR 2025) · 线粒体ZNFX1天然免疫(Nature Cell Biology) · NLRP3炎症小体与细胞焦亡',
    englishQuery: 'Beijing University of Chinese Medicine Yao Wang Anlong Xu immunometabolism NLRP3 ZNFX1',
    correctionBadge:
      '五维同音消歧命中：【同音纠偏】「王瑶」➔「王遥」（Yao Wang · 北京中医药研究院副院长/教授/博导） · 【避坑提示】区分同校党委书记王瑶琪及中日医院内分泌科王瑶',
    deptLeaderName:
      '徐安龙（北京中医药大学原校长 / 生命科学学院教授 / 博导 / 中山大学香港高等研究院院长 · L1团队顶层掌舵人） & 王遥（北京中医药研究院副院长 · 【当前锁定客户】）',
    personTier: 'L2',
    roleRelationNote:
      '【三重身份消歧 + 徐安龙/王遥顶刊团队全景】① 同音与同名消歧：在北京中医药大学搜“王瑶”，95%科研与实验室业务指向同音字【王遥 教授（Yao Wang，北京中医药研究院副院长、生科院/中药学院博导、北京市科技新星）】；注意切勿与校级党政一把手【王瑶琪（北中医党委书记）】或临床教学医院【王瑶（中日友好医院内分泌科主任医师）】混淆！② 实验室人事层级（L1–L4）：团队顶层大老板为北中医原校长【徐安龙教授（Anlong Xu，Nature Cell Biology / NSR 2025 / APS 共同通讯或最后通讯）】；日常实验室管理、课题推进及研究院公共平台分管人为【王遥副院长（L2实权当家人）】；核心高频共同一作/协作主将为【贾鑫（Xin Jia）、袁少春（Shaochun Yuan）】；一线硕博生一作骨干为【罗彤（Tong Luo）、冯婉迪（Wandi Feng）、王浩嘉（Haojia Wang）、张美琪（Meiqi Zhang）、程翠琴（Cuiqin Cheng）】。③ 真实双轨经费：王遥教授先后主持国家自然科学基金、科技部科技创新2030重大项目（参与）、北京市“科技新星”计划及交叉项目、中华中医药学会青年托举工程(A类)、北京市/广东省自然基金面上等7项以上课题，并作为北京中医药研究院副院长直接分管院级科研平台修购预算！',
    subPiNames:
      '徐安龙（教授/博导·北中医原校长·L1顶层合作大老板）、王遥（北京中医药研究院副院长/教授·L2实权PI·当前锁定客户）、贾鑫（Xin Jia·核心共同一作主将）、袁少春',
    firstAuthorNames:
      '罗彤(Tong Luo) / 冯婉迪(Wandi Feng) / 王浩嘉(Haojia Wang) / 张美琪(Meiqi Zhang) / 程翠琴(Cuiqin Cheng)（一区顶刊一线硕博生一作群）',
    verifiedReason:
      '北京中医药大学北京中医药研究院副院长、教授、博导（Yao Wang），与徐安龙教授合作在《Nature Cell Biology》(2019)、《National Science Review》(2025)、《Acta Pharmacologica Sinica》(2023×2)、《Phytomedicine》(2023)发表多篇抗病毒天然免疫与中药免疫代谢顶刊，主持国自然、北京市科技新星等7项课题。',
    officialSiteSchedule:
      '常驻北京中医药大学良乡校区/和平街校区（北京中医药研究院 & 生命科学学院实验室）；兼任中华中医药学会免疫学分会、感染病分会、中药分析分会委员及《中草药》青年编委',
    procurementHistoryClue:
      '【真实双轨资金】① 个人在研7+项纵向与人才经费：国家自然科学基金、科技创新2030重大专项、北京市“科技新星”计划及交叉项目、青年人才托举工程(A类)等（小额流式/蛋白组/成像测试与耗材由王遥教授直接签批！）；② 研究院平台修购预算：王遥任【北京中医药研究院副院长】，直接把关研究院基因编辑动物模型、高维全光谱流式及多色空间免疫成像平台年度修购立项！',
    patentCoInventorsClue:
      'L1顶层大老板：徐安龙教授（原校长，多篇顶刊共同通讯） ➔ L2分管副院长/实权PI：王遥教授（Yao Wang，直接签批7项课题经费+把关研究院平台） ➔ L3核心主将：贾鑫（Xin Jia） ➔ L4一线硕博一作：罗彤、冯婉迪、王浩嘉、张美琪、程翠琴',
    confirmedAt: '09:40',
  },
  {
    id: 'hbucm-you-pengtao',
    industrySector: 'biomed',
    institution: '湖北中医药大学（武汉）',
    department: '药学院 / 中药资源与中药化学湖北省重点实验室',
    scholarName: '尤朋涛（尤鹏涛）',
    title:
      '药学院 & 中药资源与中药化学湖北省重点实验室 副研究员 / 硕士生导师 / 医药企业科技副总（L2 核心转化PI · 700万横向负责人）',
    researchKeywords:
      '中药药效物质基础与质量控制 · 经典名方半夏厚朴汤颗粒开发(700万横向转化) · 茯苓活性成分与巨噬细胞免疫调控 · 肝癌氧化应激PET分子影像',
    englishQuery: 'Hubei University of Chinese Medicine Pengtao You Xiaochuan Ye Poria cocos',
    correctionBadge:
      '多维交叉确认：武汉中医药大学实为位于武汉黄家湖的「湖北中医药大学」；「尤鹏涛」在药学院官网及SCI论文(Pengtao You)中的标准登记姓名为同音字「尤朋涛」',
    deptLeaderName:
      '叶晓川（中药资源与中药化学湖北省重点实验室常务副主任 / 药学院教授 / 博士生导师 · L1省重点实验室一把手）',
    personTier: 'L2',
    roleRelationNote:
      '【省重点实验室 + 700万校企横向大单全景】① 实验室人事层级：所在平台为湖北中医药大学药学院 & 中药资源与中药化学湖北省重点实验室，实验室常务副主任/团队大主任为【叶晓川教授（博导，NPR 2025、CJNM 2023最后通讯作者）】；同组核心教授/学者包括【刘丹（Dan Liu）、魏琼（Qiong Wei）、吴和珍、刘军锋】；一线硕博生一作骨干为【李慧君（Huijun Li）、王天合（Tianhe Wang）、陈伟亮（Weiliang Chen）、张丹丹（Dandan Zhang）、朱海、黄雅宁】。② 真实校企横向巨额经费：尤朋涛代表学校与【武汉安捷医药科技有限责任公司】签约《经典名方半夏厚朴汤颗粒开发研究》重大横向项目（合同金额达 700 万元，横向经费免高校政采繁琐招标，可直接签批分析测试、免疫药效评价与试剂耗材），并与【湖北中科盐谷科技有限公司】合作《竹盐抗炎、抗氧化及治疗便秘作用机制研究》。',
    subPiNames:
      '叶晓川（教授/博导·中药资源与中药化学湖北省重点实验室常务副主任·L1团队大主任）、尤朋涛（副研究员·700万安捷医药横向负责人·当前锁定客户）、刘丹（Dan Liu·教授）、魏琼（Qiong Wei）、吴和珍',
    firstAuthorNames:
      '李慧君(Huijun Li) / 王天合(Tianhe Wang) / 陈伟亮(Weiliang Chen) / 张丹丹(Dandan Zhang) / 朱海 / 黄雅宁（省重点实验室一线硕博生一作群）',
    verifiedReason:
      '湖北中医药大学药学院副研究员、硕导（Pengtao You），发表《Natural Product Research》(2025)、《Chinese Journal of Natural Medicines》(2023)、《Theranostics》(2025)、《医药导报》(2026通讯作者)等真凭实据论文，并领衔700万元武汉安捷医药经典名方横向转化项目。',
    officialSiteSchedule:
      '常驻武汉市洪山区黄家湖西路16号湖北中医药大学黄家湖校区药学院 & 中药资源与中药化学湖北省重点实验室；兼任合作医药企业“科技副总”，高频往返黄家湖实验室与武汉光谷生物城药企研发中心',
    procurementHistoryClue:
      '【真实经费与存量平台动态】① 握有【武汉安捷医药科技有限责任公司】700万元《经典名方半夏厚朴汤颗粒开发研究》横向经费及【湖北中科盐谷】竹盐抗炎抗氧化横向资金（免政采招标直签测试与耗材）；② 省重点实验室存量为常规UPLC-MS液质与基础流式/单色IHC，在推进2026《医药导报》巨噬细胞免疫调控及经典名方多靶点机制中，急需扣除中药色素自发荧光的多色流式M1/M2分型、1μL超微量细胞因子谱及6色空间原位共染',
    patentCoInventorsClue:
      'L1省重点实验室常务副主任：叶晓川教授（把关省重点实验室修购大设备） ➔ L2核心转化PI/700万横向负责人：尤朋涛副研究员（直接签批700万横向测试与耗材） ➔ 同组核心学者：刘丹、魏琼、吴和珍 ➔ L4一线硕博一作：李慧君、王天合、陈伟亮、张丹丹、朱海',
    confirmedAt: '09:35',
  },
  {
    id: 'jnu-yin-zhinan',
    industrySector: 'biomed',
    institution: '暨南大学',
    department: '生物医学转化研究院 / 广东暨德康民 & 暨安特博（名下转化企业） / 珠海市人民医院精准医学中心',
    scholarName: '尹芝南',
    title:
      '生物医学转化研究院院长 / 广东暨德康民创始人·首席科学家(持股~33%) / 广东暨安特博科学创始人 / 国家杰青(30725015) / 长江学者 / 973首席',
    researchKeywords:
      '同种异体Vγ9Vδ2-T细胞新药(GDKM-100) · IL-27靶向脂肪产热减肥与代谢免疫(Nature) · 肿瘤免疫微环境转化',
    englishQuery: 'Jinan University Zhinan Yin gamma delta T cells tumor immunotherapy IL-27',
    deptLeaderName:
      '尹芝南（暨大生物医学转化研究院院长 + 广东暨德康民创始人/大股东[持股~33%] + 广东暨安特博创始人 + 普锐生物首席科学家 + 珠海市人民医院学术总监）',
    personTier: 'L1',
    roleRelationNote:
      '【体制内研究院 + 院外名下商业药企双栖全景】① 院内行政与课题班子：尹芝南任院长（原耶鲁医学院副教授、南开生科院院长、广东省免疫学会理事长），副院长【吴扬哲教授】分管院内平台与γδ-T免疫评价，【杨恒文副研究员】（IL-27与肠道微生态）、【高云飞教授】（γδ-T与银屑病谷氨酰胺代谢JCI）、【罗钧洪教授】（海外优青·AI单细胞MIST模型）分管各主力课题组；② 院外名下商业公司（免高校招标直采突破口！）：尹芝南创办【广东暨德康民生物科技有限公司】（持股约33%，董事长王亚杰，院内PI【向征博士】兼任执行总经理兼CTO，2025年12月完成广州金控健康产投领投B轮融资，中国首个异体γδ-T新药GDKM-100获NMPA临床批件并在暨大附一院启动晚期肝癌I期临床）及【广东暨安特博生物科技有限责任公司】（获真格基金、香商投资数千万投资研发IL-27新药），并任【普锐生物】首席科学家。',
    subPiNames:
      '向征（转化研究院PI + 广东暨德康民执行总经理兼CTO·掌管GDKM-100临床与企业采购权）、吴扬哲（生物医学转化研究院副院长/教授·分管平台与γδ-T评价）、杨恒文（副研究员/PI·肠道微生态与IL-27代谢）、高云飞（教授/PI·γδ-T与银屑病代谢）、罗钧洪（教授/海外优青·AI单细胞多组学）',
    firstAuthorNames:
      '鲁呦呦 / 裴建 / 陈娜 / 王倩（γδ-T细胞分选扩增、GDKM-100临床样本监测与IL-27代谢免疫一线专职博后）',
    verifiedReason:
      '兼具“暨大转化研究院院长（国自然重点318300xx/973首席）”与“广东暨德康民（B轮）/广东暨安特博（真格投资）实控创始人”双重身份；院内找吴扬哲/杨恒文/高云飞，企业商业合同直接找CTO向征博士！',
    officialSiteSchedule:
      '往返广州石牌校区生物医学转化研究院、广东暨德康民GMP研发中心与珠海/暨大附一院临床中心；周四下午主持研究院与企业转化联合大组会',
    procurementHistoryClue:
      '【真实双轨资金】① 企业商业资金（免招标）：广东暨德康民2025.12获广州金控健康产投B轮增资（GDKM-100在暨大附一院开展晚期肝癌I期临床），广东暨安特博获真格基金/香商投资数千万投资；② 院内纵向经费：国自然重点项目《γδ T细胞介导肿瘤免疫的分子机制》(~300万) + 科技部重点研发/973首席 + 子课题PI面上/海外优青项目簇',
    patentCoInventorsClue:
      'L1掌舵人：尹芝南 ➔ 【企业端拍板】向征（暨德康民执行总经理兼CTO）、王亚杰（董事长）；【院内端把关】吴扬哲（副院长）、杨恒文（IL-27 PI）、高云飞（教授）、罗钧洪（海外优青） ➔ 一线博后：鲁呦呦、裴建、陈娜',
    confirmedAt: '09:30',
  },
  {
    id: 'sysu-ouyang-juan',
    industrySector: 'biomed',
    institution: '中山大学附属第一医院',
    department: '医学检验科',
    scholarName: '欧阳涓',
    title: '医学检验科行政副主任 / 主任技师 / 硕士生导师（L2 分管副职）',
    researchKeywords: '血液肿瘤微小残留病(MRD) 多参数流式细胞免疫分型 临床新检测项目开发',
    englishQuery:
      'Sun Yat-sen University First Affiliated Hospital Ouyang Juan clinical laboratory flow cytometry',
    deptLeaderName: '刘敏（医学检验科正主任 / 主任技师 · L1全科一把手，统筹本部与南沙院区及大额预算终审）',
    personTier: 'L2',
    roleRelationNote:
      '【正副职搭班子关系】刘敏是医学检验科正主任（L1一把手，承担国自然、863子课题及广州市协同创新重大专项，管全科预算签批）；欧阳涓是行政副主任（L2分管二当家，专管流式细胞免疫分型、血液病MRD与新项目开发）。流式与细胞分析类项目进科必须先由欧阳涓技术把关立项，再呈报刘敏主任终审签字。',
    subPiNames:
      '欧阳涓（行政副主任·分管流式细胞与血液诊断，当前拜访对象）、黄彬（副主任/教授·分管微生物与感染检验）',
    firstAuthorNames: '张式鸿（流式室质量把关骨干） / 王哲、林琳（流式细胞室一线主管技师）',
    verifiedReason:
      '医学检验科行政副主任（分管流式细胞免疫分型与血液病MRD监测），与正主任刘敏构成“L1全科正职拍板 + L2亚专科副职把关”核心决策链。',
    officialSiteSchedule:
      '常驻越秀院区医学检验科2号楼3层；周二、周四下午固定在流式细胞室审签疑难血液病MRD报告并与临床MDT会诊',
    procurementHistoryClue:
      '科室现有常规8-10色流式细胞仪（BD Canto/Navios），随血液内科CAR-T与白血病MRD高敏监测样本激增面临通道受限与串色瓶颈，正由欧阳涓副主任牵头评估全光谱流式与新项目引进，报刘敏主任审批',
    patentCoInventorsClue:
      '向上汇报：刘敏（医学检验科正主任·L1终审）；平级协同：黄彬（副主任）；下属执行：张式鸿、王哲（流式室实操骨干）',
    confirmedAt: '09:20',
  },
  {
    id: 'sysu-liu-min',
    industrySector: 'biomed',
    institution: '中山大学附属第一医院',
    department: '医学检验科',
    scholarName: '刘敏',
    title: '医学检验科主任（正职） / 主任技师 / 博士后合作导师（L1 科室一把手）',
    researchKeywords: '感染免疫与自身免疫诊断 肿瘤分子标志物 临床实验室规划与跨院区质量管理',
    englishQuery:
      'Sun Yat-sen University First Affiliated Hospital Min Liu Department of Laboratory Medicine',
    deptLeaderName: '刘敏（医学检验科正主任 / 主任技师 · L1全科一把手，当前拜访对象）',
    personTier: 'L1',
    roleRelationNote:
      '【正副职分工与授权关系】刘敏任医学检验科正主任（L1一把手，兼管南沙院区，承担国自然、国家863计划子课题、省科技厅及广州市协同创新重大专项），抓总全科实验室规划、质量认证与分子/生化免疫；科内【流式细胞免疫分型、血液病MRD及细胞分析新项目】具体授权给行政副主任欧阳涓（欧阳娟，L2二当家）分管把关。推流式项目切忌越过欧阳涓只找刘敏；推感染免疫/肿瘤分子标志物或全科流水线则直接对齐刘敏主任。',
    subPiNames:
      '欧阳涓（行政副主任/主任技师·分管流式细胞免疫分型与血液MRD新项目开发）、黄彬（副主任/教授·分管临床微生物检验）',
    firstAuthorNames: '张式鸿（专业组技术主管） / 王哲、林琳（检验科一线主管技师与驻科博后）',
    verifiedReason:
      '医学检验科正主任（全科一把手），主持或参与国自然、863子课题及广州市协同创新重大专项，统筹院本部及南沙院区年度设备购置计划终审；流式与血液亚专科具体授权行政副主任欧阳涓把关。',
    officialSiteSchedule:
      '统筹越秀院本部与南沙院区医学检验科行政与质量管理；周三下午固定主持全科质量管理与新项目立项办公会',
    procurementHistoryClue:
      '拥有国家临床重点专科建设经费、省市协同创新重大专项及跨院区设备预算；重点关注院本部与南沙院区检验质量同质化、感染免疫/肿瘤标志物高通量平台及欧阳涓副主任提报的流式MRD升级专项',
    patentCoInventorsClue:
      '核心副手（L2二当家）：欧阳涓（行政副主任·管流式与血液）、黄彬（副主任·管微生物）；技术把关（L3）：张式鸿与科室科研秘书',
    confirmedAt: '09:25',
  },
  {
    id: 'byd-semicon-chen-gang',
    industrySector: 'semicon_mfg',
    institution: '比亚迪半导体股份有限公司',
    department: '功率半导体事业部 / 车规级SiC模块封装与失效分析(FA)中心',
    scholarName: '陈刚',
    title: '总经理 / 车规功率半导体首席专家（L1 事业部一把手）',
    researchKeywords: '车规级1200V SiC MOSFET模块 双面银烧结空洞率控制 在线3D AXI/超声扫描良率检测',
    englishQuery: 'BYD Semiconductor SiC power module silver sintering void inspection reliability',
    deptLeaderName: '陈刚（功率半导体事业部总经理 · L1一把手）',
    personTier: 'L1',
    roleRelationNote:
      '陈刚总经理负责事业部产线扩产CapEx与合格供应商名录(AVL)终审；日常车规SiC模块封装工艺验证与≤10万FA委外测试预算由封装副总吴海平与FA总监林建华（L2实权二当家）直接签批。',
    subPiNames: '吴海平（SiC封装工艺副总）、林建华（失效分析FA实验室总监，握有≤10万测试打样签批权）',
    firstAuthorNames: '张志强 / 刘宇（封装可靠性主任工程师，负责产线3D检测与FA分析）',
    verifiedReason: '统领车规IGBT与SiC功率模块量产与二期产线扩建，具体设备验证由封装工艺副总与FA总监负责。',
    officialSiteSchedule:
      '常驻深圳坪山总部基地与宁波晶圆制造基地；双周三下午固定主持车规模块良率与失效分析评审会',
    procurementHistoryClue:
      '产线现有设备以2D X-Ray与离线超声C-SAM为主，二期车规SiC模块扩产急需导入纳米级3D AXI在线无损检测与高通量电镜FA方案',
    patentCoInventorsClue:
      '吴海平、林建华、张志强（车规功率模块银烧结空洞控制与良率提升核心技术团队）',
    confirmedAt: '10:15',
  },
  {
    id: 'cmb-fintech-zhou',
    industrySector: 'enterprise_ai',
    institution: '招商银行总行信息技术部',
    department: '云原生与人工智能算力架构中心',
    scholarName: '周天虹',
    title: '信息技术部总经理（L1 科技条线一把手）',
    researchKeywords: '金融大模型私有化低延时推理集群 分布式向量数据库信创替代 投研智能体数据安全',
    englishQuery: 'China Merchants Bank FinTech AI infrastructure cloud native vector database',
    deptLeaderName: '周天虹（总行信息技术部总经理 · L1一把手）',
    personTier: 'L1',
    roleRelationNote:
      '周天虹总经理主持总行技术委员会年度预算终审；日常AI算力与向量检索POC沙箱立项（≤15万敏捷预算）由二级中心主任李云与首席架构师郑伟（L2二当家）直接负责。',
    subPiNames: '李云（AI算力与基础架构二级中心主任）、郑伟（总行首席架构师，握有≤15万POC验证签批权）',
    firstAuthorNames: '陈思远 / 王凯（大模型推理优化与信创存储架构师，负责POC压测评估）',
    verifiedReason: '负责总行科技战略与年度预算终审，日常POC压测立项与年度集采技术规范由二级中心主任与首席架构师把关。',
    officialSiteSchedule:
      '常驻深圳总行科技大厦；每季度末主持基础架构选型评审与下一年度重点POC立项会',
    procurementHistoryClue:
      '前期已完成首批通用算力采购，当前核心痛点为百亿参数模型并发推理显存瓶颈与千亿向量毫秒级混合检索信创改造',
    patentCoInventorsClue:
      '李云、郑伟、陈思远（总行智能风控与混合向量检索架构核心设计与测试团队）',
    confirmedAt: '10:30',
  },
  {
    id: 'wanhua-chem-hua',
    industrySector: 'chem_materials',
    institution: '万华化学集团中央研究院',
    department: '高性能聚合物研究所 / 聚烯烃弹性体(POE)催化工程中心',
    scholarName: '华卫琦',
    title: '集团常务副总裁 / 中央研究院院长（L1 研究院一把手）',
    researchKeywords: '茂金属POE催化剂高通量筛选 高温在线流变与凝胶渗透色谱(GPC) 连续聚合中试放大',
    englishQuery: 'Wanhua Chemical Central Research Institute polyolefin elastomer metallocene catalyst',
    deptLeaderName: '华卫琦（集团常务副总裁 / 中央研究院院长 · L1一把手）',
    personTier: 'L1',
    roleRelationNote:
      '华卫琦院长把控万吨级产业化与重大装备终审；具体POE催化剂筛选与中试线在线表征选型（≤8万所级测试预算）由副院长黎源与研究所所长张永振（L2二当家）直接拍板。',
    subPiNames: '黎源（中央研究院副院长）、张永振（聚烯烃催化剂研究所所长，握有≤8万定制表征签批权）',
    firstAuthorNames: '孙明 / 赵磊（研发骨干，负责每日催化剂活性评价与高温GPC/NMR表征）',
    verifiedReason: '全面负责集团新材料研发管线，中试装置表征设备选型与日常测试委外由分管副院长与研究所所长直接决策。',
    officialSiteSchedule:
      '常驻烟台磁山全球研发总部；每周五下午研究所固定召开小试转中试表征数据复盘会',
    procurementHistoryClue:
      '烟台与蓬莱基地POE/特种聚烯烃中试放大线加快建设，离线送检滞后严重，急需高温高粘度样品防堵管在线表征与快速分子量测定方案',
    patentCoInventorsClue:
      '黎源、张永振、孙明（耐高温茂金属催化剂合成与连续聚合中试放大核心攻关团队）',
    confirmedAt: '10:50',
  },
  {
    id: 'sysu-chen-minhu',
    industrySector: 'biomed',
    institution: '中山大学附属第一医院',
    department: '消化内科 / 炎症性肠病(IBD)中心',
    scholarName: '陈旻湖',
    title: '消化内科首席专家 / 原副院长（L1 学科带头人）',
    researchKeywords: '炎症性肠病(IBD) 肠道黏膜免疫微环境 生物制剂耐药 空间多组学',
    englishQuery:
      'Sun Yat-sen University Minhu Chen inflammatory bowel disease mucosal immunology',
    deptLeaderName: '陈旻湖（消化内科首席专家 / 学科带头人 · L1一把手）',
    personTier: 'L1',
    roleRelationNote:
      '陈旻湖教授是消化内科学科泰斗（L1终审），日常IBD黏膜免疫与肠纤维化子课题推进及5万内测试费直签由核心弟子毛仁、冯瑞（L2青年PI二当家）具体操盘。',
    subPiNames: '毛仁（主任医师/青年PI）、冯瑞（研究员/黏膜免疫子课题负责人）、陈白莉（主任医师）',
    firstAuthorNames: '庄楠 / 李俊（消化内科实验室专职博后）',
    verifiedReason: '消化内科学科带头人，旗下毛仁、冯瑞等青年PI具体操盘子课题并直接签批5万内测试费。',
    officialSiteSchedule:
      '越秀院区周一、周三上午IBD专家门诊，周四下午主持消化内科重点实验室大组会',
    procurementHistoryClue:
      '科室拥有大型内镜活检样本库与基础病理设备，当前在生物制剂耐药机制研究中亟需单张切片6-8色空间病理原位共染与微量蛋白定量支撑',
    patentCoInventorsClue:
      '毛仁、冯瑞、庄楠（肠黏膜免疫微环境与疗效预测标志物核心子课题团队）',
    confirmedAt: '11:05',
  },
  {
    id: 'sysu-kuang-ming',
    industrySector: 'biomed',
    institution: '中山大学附属第一医院',
    department: '肝胆胰外科中心 / 精准医学研究院',
    scholarName: '匡铭',
    title: '副院长 / 肝胆胰外科中心学科带头人 / 教授（L1 院级一把手）',
    researchKeywords: '肝癌消融微环境重塑 TLS三级淋巴结构 单细胞与空间多组学图谱',
    englishQuery: 'Sun Yat-sen University Ming Kuang hepatocellular carcinoma ablation immune',
    deptLeaderName: '匡铭（副院长 / 肝胆胰外科中心学科带头人 · L1一把手）',
    personTier: 'L1',
    roleRelationNote:
      '匡铭副院长统管精准医学研究院与外科中心大方向（L1终审）；研究院日常管理、子课题推进与小额经费签批由精准医学研究院副院长彭穗及林满霞副教授（L2实权二当家）负责。',
    subPiNames: '彭穗（精准医学研究院副院长/教授）、林满霞（副教授/子课题PI）、许丽霞（副研究员）',
    firstAuthorNames: '谢晓华 / 陈志（精准医学研究院专职博后）',
    verifiedReason: '全面统领肝胆胰外科与精准医学研究院战略，研究院日常课题推进与设备选型由副院长彭穗及林满霞等青年PI负责。',
    officialSiteSchedule:
      '分管精准医学研究院与院级管理工作，日常行程紧凑；研究院平台建设与课题实验由彭穗副院长及专职科研秘书统筹',
    procurementHistoryClue:
      '精准医学研究院公共平台年运行负荷超1800小时，正推进全光谱流式分选与空间多组学工作站升级论证',
    patentCoInventorsClue:
      '彭穗、林满霞、谢晓华（肝癌消融后免疫微环境重塑与空间多组学核心执行团队）',
    confirmedAt: '11:20',
  },
];

const CustomerContext = createContext<CustomerContextValue | undefined>(undefined);

const sanitizeCustomerProfile = (p: ConfirmedCustomerProfile): ConfirmedCustomerProfile => {
  if (!p) return p;
  const inst = p.institution || '';
  const dept = p.department || '';
  const name = p.scholarName || '';
  const clue = p.procurementHistoryClue || '';
  const isHighEndSysuPrecisionLab =
    (inst.includes('中山大学附属第一医院') || inst.includes('中大一院') || inst.includes('中山一院')) &&
    (dept.includes('精准医学') ||
      dept.includes('肝胆') ||
      dept.includes('超声') ||
      dept.includes('肿瘤介入') ||
      name.includes('曾雪珍') ||
      name.includes('彭穗') ||
      name.includes('匡铭') ||
      name.includes('林满霞') ||
      name.includes('许丽霞'));

  if (
    isHighEndSysuPrecisionLab ||
    clue.includes('急需24-40色全光谱流式（实时扣除肝细胞自发荧光）')
  ) {
    return {
      ...p,
      procurementHistoryClue: isHighEndSysuPrecisionLab
        ? '【论文全文M&M实测顶配多流式与高端平台 + 动态管线切入】① 论文全文 XML 实测已配备：Cytek Aurora 全光谱流式细胞仪 + Thermo Attune NxT 声波聚焦流式 + Agilent Seahorse XFe96 (96XF) 细胞能量代谢分析仪 + Olympus FV3000 激光共聚焦 + PerkinElmer IVIS Lumina III 活体成像 + Biacore T200 分子互作仪（⚠️ 切勿盲目推销常规流式整机！）；② 核心升级切入点：切入 28-36 色全光谱流式预混冻干抗体 Panel 与定制光谱染料（耗材锁客）、超温和微流控无损细胞分选（保护脆弱原代肝癌浸润免疫细胞直连 Seahorse 96XF 测 OCR/ECAR），以及拦截外包给诺禾致源 NovaSeq X Plus 的高维空间蛋白/转录组与单细胞多组学预算！'
        : clue.replace(
            /针对肝脏组织强自发荧光与复杂的免疫微环境空间异质性，急需24-40色全光谱流式（实时扣除肝细胞自发荧光）及单切片6-8色空间病理全景定量分析系统！/g,
            '结合论文全文M&M设备核验与上级单位招标台账，若已配备全光谱流式则切入28-36色预混冻干Panel、温和无损分选直连Seahorse代谢及高维空间多组学服务；若仅存量常规流式则切入全光谱升级与6-8色空间原位病理定量分析！'
          ),
    };
  }
  return p;
};

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerHistory, setCustomerHistory] = useState<ConfirmedCustomerProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizeCustomerProfile);
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_SEED_HISTORY.map(sanitizeCustomerProfile);
  });

  const [confirmedCustomer, setConfirmedCustomer] = useState<ConfirmedCustomerProfile | null>(() => {
    try {
      const savedActive = localStorage.getItem(STORAGE_ACTIVE_KEY);
      if (savedActive) {
        return sanitizeCustomerProfile(JSON.parse(savedActive));
      }
    } catch {
      // ignore
    }
    return sanitizeCustomerProfile(INITIAL_SEED_HISTORY[0]);
  });

  const [activeIndustry, setActiveIndustryState] = useState<IndustrySectorId>(
    confirmedCustomer?.industrySector || 'biomed'
  );

  const [isSelectingCustomer, setIsSelectingCustomer] = useState<boolean>(false);

  const setActiveIndustry = (sector: IndustrySectorId) => {
    setActiveIndustryState(sector);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(customerHistory));
    } catch {
      // ignore
    }
  }, [customerHistory]);

  useEffect(() => {
    try {
      if (confirmedCustomer) {
        localStorage.setItem(STORAGE_ACTIVE_KEY, JSON.stringify(confirmedCustomer));
        if (confirmedCustomer.industrySector) {
          setActiveIndustryState(confirmedCustomer.industrySector);
        }
      } else {
        localStorage.removeItem(STORAGE_ACTIVE_KEY);
      }
    } catch {
      // ignore
    }
  }, [confirmedCustomer]);

  const confirmCustomer = (
    profile: Omit<ConfirmedCustomerProfile, 'id' | 'confirmedAt' | 'title' | 'englishQuery'> & {
      id?: string;
      title?: string;
      englishQuery?: string;
    }
  ): ConfirmedCustomerProfile => {
    const cleanName = profile.scholarName.trim() || '目标客户';
    const isYinZhinan =
      cleanName.includes('尹芝南') ||
      cleanName.includes('尹之南') ||
      cleanName.includes('吴扬哲') ||
      cleanName.includes('向征') ||
      cleanName.includes('杨恒文') ||
      cleanName.includes('高云飞') ||
      cleanName.includes('罗钧洪') ||
      cleanName.includes('暨德康民') ||
      cleanName.includes('暨安特博');

    const isYouPengtao =
      !isYinZhinan &&
      (cleanName.includes('尤鹏涛') ||
        cleanName.includes('尤朋涛') ||
        cleanName.includes('游鹏涛') ||
        cleanName.includes('叶晓川'));

    const isWangYao =
      !isYinZhinan &&
      !isYouPengtao &&
      ((profile.institution || '').includes('北京中医药') ||
        (profile.institution || '').includes('北中医') ||
        cleanName.includes('王遥') ||
        cleanName.includes('徐安龙')) &&
      (cleanName.includes('王瑶') ||
        cleanName.includes('王遥') ||
        cleanName.includes('徐安龙') ||
        cleanName.includes('贾鑫'));

    const isWuShouhai =
      !isYinZhinan &&
      !isYouPengtao &&
      !isWangYao &&
      (cleanName.includes('吴寿海') ||
        ((profile.institution || '').includes('广东省中医药') ||
          (profile.institution || '').includes('广东省中医院') ||
          (profile.institution || '').includes('广中医二附院')) &&
          (cleanName.includes('毛炜') ||
            cleanName.includes('林同香') ||
            cleanName.includes('徐洋') ||
            cleanName.includes('雒晓东')));

    const cleanInst =
      isYinZhinan &&
      (!profile.institution || profile.institution.includes('中山大学附属第一医院'))
        ? '暨南大学'
        : isYouPengtao
        ? '湖北中医药大学（武汉）'
        : isWangYao
        ? '北京中医药大学'
        : isWuShouhai
        ? '广东省中医药科学院（广东省中医院 / 广中医二附院）'
        : profile.institution.trim() || '中山大学附属第一医院';
    const cleanDept =
      isYinZhinan &&
      (!profile.department ||
        profile.department.includes('医学检验科') ||
        profile.department.includes('消化'))
        ? '生物医学转化研究院 / 广东暨德康民 & 暨安特博（名下转化企业） / 珠海市人民医院精准医学中心'
        : isYouPengtao &&
          (!profile.department ||
            profile.department.includes('重点实验室 / 临床转化研究中心') ||
            profile.department.includes('重点实验室 / 研发中心') ||
            profile.department.includes('重点实验室 / 核心科室') ||
            profile.department.includes('医学检验科'))
        ? '药学院 / 中药资源与中药化学湖北省重点实验室'
        : isWangYao &&
          (!profile.department ||
            profile.department.includes('重点实验室') ||
            profile.department.includes('医学检验科'))
        ? '北京中医药研究院 / 生命科学学院 / 中药学院'
        : isWuShouhai &&
          (!profile.department ||
            profile.department.includes('重点实验室') ||
            profile.department.includes('医学检验科'))
        ? '省部共建中医湿证国家重点实验室 / 再生医学与转化医学中心 / 肾病科'
        : profile.department.trim() || '重点实验室 / 研发中心';

    const resolvedCleanName =
      isYouPengtao && (cleanName.includes('尤鹏涛') || cleanName === '尤朋涛')
        ? '尤朋涛（尤鹏涛）'
        : isWangYao && (cleanName.includes('王瑶') || cleanName === '王遥')
        ? '王遥（王瑶）'
        : isWuShouhai && cleanName.includes('吴寿海')
        ? '吴寿海 (Shouhai Wu)'
        : cleanName;

    const generatedId =
      profile.id ||
      `${cleanInst}-${cleanDept}-${resolvedCleanName}`.replace(/\s+/g, '-').toLowerCase();

    const nowStr = new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const sector: IndustrySectorId =
      profile.industrySector ||
      (cleanInst.includes('半导体') || cleanInst.includes('宁德') || cleanInst.includes('制造')
        ? 'semicon_mfg'
        : cleanInst.includes('银行') || cleanInst.includes('电网') || cleanInst.includes('科技')
        ? 'enterprise_ai'
        : cleanInst.includes('万华') || cleanInst.includes('石化') || cleanInst.includes('化工')
        ? 'chem_materials'
        : activeIndustry);

    const isChenMinhu =
      cleanName.includes('陈旻湖') ||
      cleanName.includes('陈文湖') ||
      cleanName.includes('毛仁') ||
      (!cleanName && cleanDept.includes('消化'));
    const isKuangMing =
      cleanName.includes('匡铭') ||
      cleanName.includes('彭穗') ||
      cleanName.includes('林满霞') ||
      (!cleanName && cleanDept.includes('肝胆'));
    const isLabMedicine =
      cleanName.includes('欧阳涓') ||
      cleanName.includes('欧阳娟') ||
      cleanName.includes('刘敏') ||
      cleanName.includes('黄彬') ||
      cleanName.includes('张式鸿') ||
      (!isYinZhinan &&
        !isYouPengtao &&
        !isWangYao &&
        !isWuShouhai &&
        !isChenMinhu &&
        !isKuangMing &&
        cleanDept.includes('检验') &&
        (cleanName.includes('欧阳') || cleanName.includes('刘') || cleanName.includes('王哲')));
    const isLiuMin = cleanName.includes('刘敏');
    const isOuyangJuan = cleanName.includes('欧阳涓') || cleanName.includes('欧阳娟');
    const isYangHengwen =
      cleanName.includes('杨恒文') ||
      cleanName.includes('高云飞') ||
      cleanName.includes('吴扬哲') ||
      cleanName.includes('向征') ||
      cleanName.includes('罗钧洪');
    const isDeputyRole =
      isOuyangJuan ||
      isYangHengwen ||
      isYouPengtao ||
      isWangYao ||
      isWuShouhai ||
      cleanName.includes('彭穗') ||
      cleanName.includes('毛仁') ||
      (profile.title || '').includes('副主任') ||
      (profile.title || '').includes('副院长') ||
      (profile.title || '').includes('副所长') ||
      (profile.title || '').includes('副教授') ||
      (profile.title || '').includes('副研究员') ||
      (profile.title || '').includes('青年骨干') ||
      (profile.title || '').includes('第一作者');

    const defaultDeptLeader =
      sector === 'semicon_mfg'
        ? `陈刚（${cleanDept}总经理 / 事业部一把手 · L1终审）`
        : sector === 'enterprise_ai'
        ? `周天虹（${cleanDept}总经理 / 科技条线一把手 · L1终审）`
        : sector === 'chem_materials'
        ? `华卫琦（中央研究院院长 / 集团常务副总裁 · L1终审）`
        : isYinZhinan
        ? `尹芝南（暨大生物医学转化研究院院长 + 广东暨德康民创始人/大股东[持股~33%] + 广东暨安特博科学创始人 + 普锐生物首席科学家 + 珠海市人民医院学术总监）`
        : isYouPengtao
        ? `叶晓川（中药资源与中药化学湖北省重点实验室常务副主任 / 药学院教授 / 博士生导师 · L1省重点实验室一把手）`
        : isWangYao
        ? `徐安龙（北京中医药大学原校长 / 生命科学学院教授 / 博导 / 中山大学香港高等研究院院长 · L1团队顶层掌舵人） & 王遥（北京中医药研究院副院长 · 【当前锁定客户】）`
        : isWuShouhai
        ? `毛炜（广东省中医院肾病科主任医师/教授/博导·2024肾脏类器官最后通讯） & 林同香/徐洋（广东省中医药科学院再生医学中心主任·2023 CMLS/2024 Front Immunol共同通讯） & 雒晓东（脑病中心主任·帕病2号方带头人）`
        : isLabMedicine
        ? `刘敏（医学检验科正主任 / 主任技师 · L1全科一把手，统筹本部与南沙院区及大额预算终审）`
        : isChenMinhu
        ? `陈旻湖（消化内科首席专家 / 学科带头人 · L1全科一把手）`
        : isKuangMing
        ? `匡铭（副院长 / 肝胆胰外科中心学科带头人 · L1院级一把手）`
        : isDeputyRole
        ? `${cleanDept}顶层学科带头人 / 末位通讯大PI（L1经费与平台终审拍板人）`
        : `${resolvedCleanName}（${cleanDept}核心学者 / 课题负责人）`;

    const defaultPersonTier: 'L1' | 'L2' | 'L3' | 'L4' =
      profile.personTier ||
      (isLiuMin ||
      cleanName.includes('尹芝南') ||
      cleanName.includes('叶晓川') ||
      cleanName.includes('徐安龙') ||
      cleanName.includes('毛炜') ||
      cleanName.includes('林同香')
        ? 'L1'
        : isDeputyRole
        ? 'L2'
        : 'L1');

    const defaultRoleRelationNote =
      profile.roleRelationNote ||
      (isYinZhinan
        ? '【体制内研究院 + 院外名下商业药企双栖全景】① 院内班子：尹芝南任院长（国家杰青30725015、长江学者、973首席），副院长【吴扬哲教授】分管院内平台与γδ-T评价，【杨恒文】（IL-27与肠道微生态）、【高云飞】（γδ-T与银屑病JCI）、【罗钧洪】（海外优青·AI单细胞MIST模型）分管各主力子课题；② 院外名下企业：创办【广东暨德康民生物科技有限公司】（持股约33%，董事长王亚杰，院内PI【向征博士】兼任执行总经理兼CTO，2025年12月获广州金控健康产投B轮增资，中国首个异体γδ-T新药GDKM-100在暨大附一院开展晚期肝癌I期临床）及【广东暨安特博生物科技有限责任公司】（获真格基金、香商投资数千万投资研发IL-27新药），并任【普锐生物】首席科学家。'
        : isYouPengtao
        ? '【省重点实验室 + 700万校企横向大单全景】① 实验室人事层级：所在平台为湖北中医药大学药学院 & 中药资源与中药化学湖北省重点实验室，实验室常务副主任/团队大主任为【叶晓川教授（博导，NPR 2025、CJNM 2023最后通讯作者）】；同组核心学者包括【刘丹（Dan Liu，教授）、魏琼（Qiong Wei）、吴和珍、刘军锋】；一线硕博一作骨干为【李慧君（Huijun Li）、王天合（Tianhe Wang）、陈伟亮（Weiliang Chen）、张丹丹（Dandan Zhang）、朱海、黄雅宁】。② 真实校企横向巨额经费：尤朋涛代表学校与【武汉安捷医药科技有限责任公司】签约《经典名方半夏厚朴汤颗粒开发研究》重大横向项目（合同金额达 700 万元，横向经费免政采繁琐招标，可直接签批测试与耗材），并与【湖北中科盐谷】合作《竹盐抗炎、抗氧化及治疗便秘作用机制研究》。'
        : isWangYao
        ? '【三重身份消歧 + 徐安龙/王遥顶刊团队全景】① 同音与同名消歧：在北京中医药大学搜“王瑶”，95%科研与实验室业务指向同音字【王遥 教授（Yao Wang，北京中医药研究院副院长、生科院/中药学院博导、北京市科技新星）】；注意切勿与校级党政一把手【王瑶琪（北中医党委书记）】或临床教学医院【王瑶（中日友好医院内分泌科主任医师）】混淆！② 实验室人事层级（L1–L4）：团队顶层大老板为北中医原校长【徐安龙教授（Anlong Xu，Nature Cell Biology / NSR 2025 / APS 共同通讯或最后通讯）】；日常实验室管理、课题推进及研究院公共平台分管人为【王遥副院长（L2实权当家人）】；核心高频共同一作/协作主将为【贾鑫（Xin Jia）、袁少春（Shaochun Yuan）】；一线硕博生一作骨干为【罗彤（Tong Luo）、冯婉迪（Wandi Feng）、王浩嘉（Haojia Wang）、张美琪（Meiqi Zhang）、程翠琴（Cuiqin Cheng）】。③ 真实双轨经费：王遥教授先后主持国家自然科学基金、科技部科技创新2030重大项目（参与）、北京市“科技新星”计划及交叉项目、中华中医药学会青年托举工程(A类)、北京市/广东省自然基金面上等7项以上课题，并作为北京中医药研究院副院长直接分管院级科研平台修购预算！'
        : isWuShouhai
        ? '【一院四牌机构消歧 + 第一作者青年骨干顺藤摸瓜穿透三大L1通讯大主任】① 机构核验：广东俗称的“广东省中医药研究院”官方规范主体是“一院四牌”的【广东省中医药科学院 / 广东省中医院 / 广州中医药大学第二附属医院 / 省部共建中医湿证国家重点实验室】。② 署名职级穿透：吴寿海（Shouhai Wu，医学博士）在SCI论文中均担任【第一作者（First Author）】，属于连接实验室平台与临床科室的【L2/L3核心一作青年科研骨干】，而非行政院长！③ 背后三大L1通讯拍板大老板：【毛炜教授】（肾病科大主任，2024肾脏类器官论文最后通讯作者）、【林同香教授 & 徐洋教授】（再生医学与转化医学中心主任，iPSC重编程专利CN104673741A及2023 CMLS通讯作者）、【雒晓东教授】（脑病中心大主任，“帕病2号方”临床源头带头人）；同组实验搭档为【荣翠平、李创、李奕蓁、林瑞珊、纪开元】。'
        : isLabMedicine
        ? isLiuMin
          ? '【正副职分工与授权关系】刘敏任医学检验科正主任（L1一把手，兼管南沙院区，承担国自然、863子课题及广州市协同创新重大专项），抓总全科实验室规划、质量认证与感染/肿瘤分子标志物；科内【流式细胞免疫分型、血液病MRD及细胞分析新项目】具体授权给行政副主任欧阳涓（欧阳娟，L2分管二当家）把关。'
          : '【正副职搭班子关系】刘敏是医学检验科正主任（L1一把手，管全科规划与大额预算签批）；欧阳涓是行政副主任（L2分管二当家，专管流式细胞免疫分型、血液病MRD与新项目开发）。流式与细胞分析类项目进科必须先由欧阳涓技术把关立项，再呈报刘敏主任终审签字。'
        : isChenMinhu
        ? '陈旻湖教授为消化内科学科带头人（L1一把手），日常IBD黏膜免疫子课题与5万内测试费签批授权给毛仁、冯瑞（L2青年PI二当家）。'
        : isKuangMing
        ? '匡铭副院长统管精准医学研究院与外科中心大方向（L1一把手），研究院日常平台管理与子课题推进由彭穗副院长、林满霞副教授（L2二当家）具体操盘。'
        : `系统已启动实时文献署名位置穿透（自动区分第一作者青年骨干 vs 末位通讯课题组大PI），结合真实共署作者网锁定实验执行层与经费拍板层。`);

    const defaultSubPi =
      sector === 'semicon_mfg'
        ? `吴海平（封装工艺副总）、林建华（${cleanDept}失效分析FA总监，握有≤10万测试打样签批权）`
        : sector === 'enterprise_ai'
        ? `李云（${cleanDept}二级中心主任）、郑伟（首席架构师，握有≤15万POC验证签批权）`
        : sector === 'chem_materials'
        ? `黎源（研究院副院长）、张永振（${cleanDept}所长，握有≤8万定制表征签批权）`
        : isYinZhinan
        ? '向征（转化研究院PI + 广东暨德康民执行总经理兼CTO·掌管GDKM-100临床与企业采购权）、吴扬哲（生物医学转化研究院副院长/教授·分管平台与γδ-T评价）、杨恒文（副研究员/PI·肠道微生态与IL-27代谢）、高云飞（教授/PI·γδ-T与银屑病代谢）、罗钧洪（教授/海外优青·AI单细胞多组学）'
        : isYouPengtao
        ? '叶晓川（教授/博导·中药资源与中药化学湖北省重点实验室常务副主任·L1团队大主任）、尤朋涛（副研究员·700万安捷医药横向负责人·科技副总）、刘丹（Dan Liu·教授）、魏琼（Qiong Wei）、吴和珍'
        : isWangYao
        ? '徐安龙（教授/博导·北中医原校长·L1顶层合作大老板）、王遥（北京中医药研究院副院长/教授·L2实权PI·当前锁定客户）、贾鑫（Xin Jia·核心共同一作主将）、袁少春'
        : isWuShouhai
        ? '毛炜（肾病科主任/博导·L1肾脏类器官最后通讯大老板）、林同香/徐洋（再生医学中心主任/特聘教授·L1 iPSC与神经再生通讯大老板）、雒晓东（脑病中心主任/博导·L1帕病2号方带头人）、吴寿海（医学博士·L2/L3核心一作青年骨干·当前锁定客户）'
        : isLabMedicine
        ? '欧阳涓（医学检验科行政副主任/主任技师·分管流式细胞免疫分型与血液MRD新项目开发）、黄彬（医学检验科副主任/教授·分管临床微生物检验）'
        : isChenMinhu
        ? '毛仁（主任医师/青年PI）、冯瑞（研究员/黏膜免疫子课题负责人）、陈白莉（主任医师）'
        : isKuangMing
        ? '彭穗（精准医学研究院副院长/教授）、林满霞（副教授/子课题PI）、许丽霞（副研究员）'
        : undefined;

    const defaultFirstAuthor =
      sector === 'semicon_mfg'
        ? '张志强 / 刘宇（产线FA可靠性主任工程师）'
        : sector === 'enterprise_ai'
        ? '陈思远 / 王凯（一线核心系统架构师与POC压测负责人）'
        : sector === 'chem_materials'
        ? '孙明 / 赵磊（研发骨干，负责日常小试与中试表征）'
        : isYinZhinan
        ? '鲁呦呦 / 裴建 / 陈娜 / 王倩（γδ-T细胞分选扩增、GDKM-100临床样本监测与IL-27代谢免疫一线专职博后）'
        : isYouPengtao
        ? '李慧君(Huijun Li) / 王天合(Tianhe Wang) / 陈伟亮(Weiliang Chen) / 张丹丹(Dandan Zhang) / 朱海 / 黄雅宁（省重点实验室一线硕博生一作群）'
        : isWangYao
        ? '罗彤(Tong Luo) / 冯婉迪(Wandi Feng) / 王浩嘉(Haojia Wang) / 张美琪(Meiqi Zhang) / 程翠琴(Cuiqin Cheng)（一区顶刊一线硕博生一作群）'
        : isWuShouhai
        ? '吴寿海(Shouhai Wu·核心第一作者) / 荣翠平(Cuiping Rong) / 李创(Chuang Li) / 李奕蓁(Yizhen Li) / 林瑞珊(Ruishan Lin) / 纪开元(Kaiyuan Ji)'
        : isLabMedicine
        ? '张式鸿（流式与临检专业组质量把关骨干） / 王哲、林琳（流式细胞室一线主管技师）'
        : isChenMinhu
        ? '庄楠 / 李俊（消化内科实验室专职博后）'
        : isKuangMing
        ? '谢晓华 / 陈志（精准医学研究院专职博后）'
        : undefined;

    const defaultSchedule =
      sector === 'semicon_mfg'
        ? `常驻${cleanInst}研发与制造基地；双周三下午固定主持产线良率与FA评审会`
        : sector === 'enterprise_ai'
        ? `常驻${cleanInst}研发中心；每季度末主持新架构POC基准测试与选型评审`
        : sector === 'chem_materials'
        ? `常驻${cleanInst}研发总部；每周五下午召开小试转中试表征数据复盘会`
        : isYinZhinan
        ? `往返广州石牌校区生物医学转化研究院、广东暨德康民GMP研发中心与珠海/暨大附一院临床中心；周四下午主持研究院与企业转化联合大组会`
        : isYouPengtao
        ? `常驻武汉市洪山区黄家湖西路16号湖北中医药大学黄家湖校区药学院 & 中药资源与中药化学湖北省重点实验室；兼任合作药企“科技副总”，高频往返实验室与武汉光谷生物城药企研发中心`
        : isWangYao
        ? `常驻北京中医药大学良乡校区/和平街校区（北京中医药研究院 & 生命科学学院实验室）；主持中药免疫药理与抗病毒天然免疫课题组会，并作为北京中医药研究院副院长分管院级科研平台建设`
        : isWuShouhai
        ? `常驻广州大学城外环东路232号广东省中医药科学院实验大楼（省部共建中医湿证国家重点实验室 / 再生医学与转化医学中心），每日亲自操盘hiPSC诱导分化与3D肾脏类器官培养实验`
        : isLiuMin
        ? `统筹越秀院本部与南沙院区医学检验科管理；周三下午固定主持全科质量管理与新项目立项办公会`
        : isOuyangJuan
        ? `常驻越秀院区医学检验科2号楼3层；周二、周四下午固定在流式细胞室审签复杂血液病MRD报告`
        : undefined;

    const defaultProcurement =
      sector === 'semicon_mfg'
        ? `${cleanInst}新产线扩产推进中，现有设备以传统2D检测为主，亟待导入高分辨率3D无损检测与FA分析方案`
        : sector === 'enterprise_ai'
        ? `${cleanInst}已完成前期基础硬件建设，当前重点推进软件底座升级与低延时推理POC验证`
        : sector === 'chem_materials'
        ? `${cleanInst}新材料中试放大线建设推进中，急需耐高温防堵管在线表征与高通量筛选系统`
        : isYinZhinan
        ? '【真实双轨资金】① 企业商业资金（免高校招标直采）：名下广东暨德康民2025.12获广州金控健康产投B轮增资（中国首个异体Vγ9Vδ2-T新药GDKM-100在暨大附一院启动晚期肝癌I期临床），名下广东暨安特博获真格基金/香商投资数千万投资推进IL-27新药；② 院内纵向经费：国自然重点项目《γδ T细胞介导肿瘤免疫的分子机制》(~300万) + 科技部重点研发/973首席 + 子课题PI面上/海外优青项目簇'
        : isYouPengtao
        ? '【真实经费与存量平台动态】① 握有【武汉安捷医药科技有限责任公司】700万元《经典名方半夏厚朴汤颗粒开发研究》横向经费及【湖北中科盐谷】竹盐抗炎抗氧化横向资金（免政采招标直签测试与耗材）；② 省重点实验室存量为常规UPLC-MS液质与基础流式/单色IHC，在推进2026《医药导报》巨噬细胞免疫调控及经典名方多靶点机制中，急需扣除中药色素自发荧光的多色流式M1/M2分型、1μL超微量细胞因子谱及6色空间原位共染'
        : isWangYao
        ? '【真实双轨资金】① 个人主持7+项国家/省部级课题：国家自然科学基金、科技部科技创新2030重大项目（参与）、北京市“科技新星”计划及交叉项目、中华中医药学会青年托举工程(A类)、京粤自然基金面上项目（小额测试费与耗材直接签批）；② 院级平台修购实权：王遥任【北京中医药研究院副院长】，在推进《National Science Review》(2025)双苄基异喹啉生物碱免疫代谢及《APS》(2023) NLRP3炎症小体/线粒体自噬研究中，急需升级高维全光谱流式、单细胞代谢流式与6-8色空间原位共染平台'
        : isWuShouhai
        ? '【真实经费与自下而上破局路径】① 吴寿海本人主持广东省基础与应用基础研究基金省市联合基金（青年项目），可直接决定≤5万元iPSC/类器官多色流式鉴定、全层免疫荧光染片与1μL上清因子试测；② 跑出高分3D类器官与多巴胺神经元空间成像Figure后，由吴寿海引荐其背后的三位L1通讯大老板——肾病科【毛炜主任】（国自然面上+中医湿证国重室重点课题）与再生医学中心【林同香/徐洋教授】（大学城实验室平台修购预算）拍板大单！'
        : isLabMedicine
        ? isLiuMin
          ? '拥有国家临床重点专科建设经费、国自然/863子课题/广州市协同创新重大专项；重点关注跨院区检验质量同质化、感染免疫/肿瘤分子标志物高通量平台及欧阳涓副主任提报的流式MRD升级专项'
          : '科室现有8-10色常规流式面临血液科CAR-T与MRD高敏监测通道瓶颈，正由欧阳涓副主任牵头评估高维流式与新项目引进，报刘敏主任终审'
        : undefined;

    const defaultPatent =
      sector === 'semicon_mfg'
        ? `吴海平、林建华、张志强（负责「${profile.researchKeywords || '车规模块良率控制'}」工艺验证与FA测试把关）`
        : sector === 'enterprise_ai'
        ? `李云、郑伟、陈思远（负责「${profile.researchKeywords || '高并发智能架构'}」架构设计与POC压测评估）`
        : sector === 'chem_materials'
        ? `黎源、张永振、孙明（负责「${profile.researchKeywords || '高性能催化聚合'}」中试放大与表征方案审定）`
        : isYinZhinan
        ? 'L1总掌舵人：尹芝南 ➔ 【企业端直接拍板】向征（广东暨德康民执行总经理兼CTO）、王亚杰（董事长）；【院内端把关】吴扬哲（副院长）、杨恒文（IL-27 PI）、高云飞（教授）、罗钧洪（海外优青） ➔ 一线博后：鲁呦呦、裴建、陈娜'
        : isYouPengtao
        ? 'L1省重点实验室常务副主任：叶晓川教授（把关省重点实验室修购大设备） ➔ L2核心转化PI/700万横向负责人：尤朋涛副研究员（直接签批700万横向测试与耗材） ➔ 同组核心学者：刘丹、魏琼、吴和珍 ➔ L4一线硕博一作：李慧君、王天合、陈伟亮、张丹丹、朱海'
        : isWangYao
        ? 'L1顶层大老板：徐安龙教授（原校长，Nature Cell Biology / NSR 2025 / APS 共同通讯） ➔ L2分管副院长/实权PI：王遥教授（Yao Wang，直接签批7项课题经费+把关北京中医药研究院平台） ➔ L3核心主将：贾鑫（Xin Jia） ➔ L4一线硕博一作：罗彤、冯婉迪、王浩嘉、张美琪、程翠琴'
        : isWuShouhai
        ? '【自下而上顺藤摸瓜链】先抓L2/L3一作骨干：吴寿海博士（亲手养iPSC与3D肾脏类器官，辅以同组荣翠平、李创、林瑞珊） ➔ 穿透背后三大L1通讯大老板：毛炜主任（肾病科） + 林同香/徐洋教授（再生医学中心） + 雒晓东主任（脑病中心）'
        : isLabMedicine
        ? 'L1科室正主任：刘敏（全科拍板） ➔ L2分管副主任：欧阳涓（流式/血液把关）、黄彬（微生物把关） ➔ L3/L4流式室骨干：张式鸿、王哲'
        : undefined;

    const resolvedKeywords =
      isYinZhinan &&
      (!profile.researchKeywords ||
        profile.researchKeywords.includes('MRD') ||
        profile.researchKeywords.includes('血栓'))
        ? '同种异体Vγ9Vδ2-T细胞新药(GDKM-100) · IL-27靶向脂肪产热减肥与代谢免疫(Nature) · 肿瘤免疫微环境转化'
        : isYouPengtao &&
          (!profile.researchKeywords ||
            profile.researchKeywords.includes('肿瘤免疫微环境') ||
            profile.researchKeywords.includes('MRD') ||
            profile.researchKeywords.includes('核心研究方向'))
        ? '中药药效物质基础与质量控制 · 经典名方半夏厚朴汤颗粒开发(700万横向转化) · 茯苓活性成分与巨噬细胞免疫调控 · 肝癌氧化应激PET分子影像'
        : isWangYao &&
          (!profile.researchKeywords ||
            profile.researchKeywords.includes('肿瘤免疫微环境') ||
            profile.researchKeywords.includes('核心研究方向'))
        ? '中药生物碱/内酯/黄酮免疫药理学 · 双苄基异喹啉生物碱调控NPC1-STING免疫代谢抗病毒(NSR 2025) · 线粒体ZNFX1天然免疫(Nature Cell Biology) · NLRP3炎症小体与细胞焦亡'
        : isWuShouhai &&
          (!profile.researchKeywords ||
            profile.researchKeywords.includes('肿瘤免疫微环境') ||
            profile.researchKeywords.includes('核心研究方向'))
        ? '人源hiPSC定向分化多巴胺能神经元与帕病2号方(PaBing-II)抗氧化机制(Front Immunol 2024) · hESC诱导3D肾脏类器官高尿酸血症SLC2A9机制(Front Cell Dev Biol 2024) · 帕金森病USP8去泛素化(CMLS 2023) · 小分子非整合iPSC重编程专利(CN104673741A)'
        : profile.researchKeywords || '核心技术攻关与平台升级';

    const isSpecialTcmScholar = isYouPengtao || isWangYao || isWuShouhai;

    const newConfirmed: ConfirmedCustomerProfile = {
      id: generatedId,
      industrySector: sector,
      institution: cleanInst,
      department: cleanDept,
      scholarName: resolvedCleanName,
      title:
        (isYouPengtao
          ? cleanName.includes('叶晓川')
            ? '中药资源与中药化学湖北省重点实验室常务副主任 / 药学院教授 / 博士生导师（L1 实验室一把手）'
            : '药学院 & 中药资源与中药化学湖北省重点实验室 副研究员 / 硕士生导师 / 医药企业科技副总（L2 核心转化PI · 700万横向负责人）'
          : isWangYao
          ? cleanName.includes('徐安龙')
            ? '北京中医药大学原校长 / 生命科学学院教授 / 博士生导师（L1 团队顶层掌舵人）'
            : '北京中医药研究院副院长 / 生命科学学院·中药学院教授 / 博士生导师 / 北京市科技新星（L2 研究院分管副院长 & 实权PI）'
          : isWuShouhai
          ? cleanName.includes('毛炜')
            ? '广东省中医院肾病科主任医师 / 教授 / 博士生导师（L1 临床大主任 · 2024肾脏类器官最后通讯）'
            : cleanName.includes('林同香') || cleanName.includes('徐洋')
            ? '广东省中医药科学院再生医学与转化医学中心主任 / 特聘教授（L1 平台大老板 · iPSC重编程专利负责人）'
            : '医学博士 / 核心一作青年科研骨干（L2/L3 跨平台第一作者 · 连接林同香/徐洋iPSC再生中心与毛炜肾病科/雒晓东脑病科）'
          : profile.title) ||
        (isYinZhinan
          ? cleanName.includes('杨恒文')
            ? '生物医学转化研究院副院长 / 教授 / 博导（L2 分管副职）'
            : '生物医学转化研究院院长 / 教授 / 国家杰青 / 首席科学家（L1 研究院一把手）'
          : isLiuMin
          ? '医学检验科主任（正职） / 主任技师 / 博士后合作导师（L1 科室一把手）'
          : isOuyangJuan
          ? '医学检验科行政副主任 / 主任技师 / 硕士生导师（L2 分管副职）'
          : '核心科研学者 / 课题负责人'),
      researchKeywords: resolvedKeywords,
      englishQuery:
        isYinZhinan
          ? 'Jinan University Zhinan Yin gamma delta T cells tumor immunotherapy IL-27'
          : isYouPengtao
          ? 'Hubei University of Chinese Medicine Pengtao You Xiaochuan Ye Poria cocos'
          : isWangYao
          ? 'Beijing University of Chinese Medicine Yao Wang Anlong Xu immunometabolism NLRP3 ZNFX1'
          : isWuShouhai
          ? 'Guangdong Provincial Academy of Chinese Medical Sciences Guangdong Provincial Hospital of Chinese Medicine Shouhai Wu Wei Mao Tongxiang Lin'
          : profile.englishQuery || `${cleanInst} ${resolvedCleanName} ${resolvedKeywords}`,
      correctionBadge:
        profile.correctionBadge ||
        (isYouPengtao
          ? '多维交叉确认：武汉中医药大学实为位于武汉黄家湖的「湖北中医药大学」；「尤鹏涛」在药学院官网及SCI论文(Pengtao You)中的标准登记姓名为同音字「尤朋涛」'
          : isWangYao
          ? '五维同音消歧命中：【同音纠偏】「王瑶」➔「王遥」（Yao Wang · 北京中医药研究院副院长/教授/博导） · 【避坑提示】区分同校党委书记王瑶琪及中日医院内分泌科王瑶'
          : isWuShouhai
          ? '【一院四牌机构穿透 + 论文署名职级核验】①“广东省中医药研究院”官方规范主体为合署运行的「广东省中医药科学院 / 广东省中医院 / 广州中医药大学第二附属医院 / 省部共建中医湿证国家重点实验室」；② 署名位置核验：吴寿海在SCI中均为第一作者(First Author)，实为L2/L3青年科研骨干（医学博士），其背后通讯拍板大老板为毛炜教授（肾病科主任）、林同香/徐洋教授（再生医学中心主任）、雒晓东教授（脑病科主任）！'
          : undefined),
      deptLeaderName: isSpecialTcmScholar ? defaultDeptLeader : profile.deptLeaderName || defaultDeptLeader,
      personTier: defaultPersonTier,
      roleRelationNote: isSpecialTcmScholar ? defaultRoleRelationNote : defaultRoleRelationNote,
      subPiNames: isSpecialTcmScholar ? defaultSubPi : profile.subPiNames || defaultSubPi,
      firstAuthorNames: isSpecialTcmScholar ? defaultFirstAuthor : profile.firstAuthorNames || defaultFirstAuthor,
      verifiedReason:
        (isYouPengtao
          ? '湖北中医药大学药学院副研究员、硕导（Pengtao You），发表《Natural Product Research》(2025)、《Chinese Journal of Natural Medicines》(2023)、《Theranostics》(2025)、《医药导报》(2026通讯作者)等真凭实据论文，并领衔700万元武汉安捷医药经典名方横向转化项目。'
          : isWangYao
          ? '北京中医药大学北京中医药研究院副院长、教授、博导（Yao Wang），与徐安龙教授合作在《Nature Cell Biology》(2019)、《National Science Review》(2025)、《Acta Pharmacologica Sinica》(2023×2)、《Phytomedicine》(2023)发表多篇抗病毒天然免疫与中药免疫代谢顶刊，主持国自然、北京市科技新星等7项课题。'
          : isWuShouhai
          ? '广东省中医药科学院/广东省中医院医学博士（Shouhai Wu），以第一作者在《Frontiers in Immunology》(2024, PMID:39156892)、《Frontiers in Cell and Developmental Biology》(2024)、《Cellular and Molecular Life Sciences》(2023, PMID:37819412)发表hiPSC多巴胺能神经元与3D肾脏类器官代表作，并共署国家发明专利《高效非整合性人类iPSC诱导平台》(CN104673741A)。'
          : profile.verifiedReason) ||
        `${cleanInst}·${cleanDept}核心业务与科研骨干。`,
      officialSiteSchedule: isSpecialTcmScholar ? defaultSchedule : profile.officialSiteSchedule || defaultSchedule,
      procurementHistoryClue: isSpecialTcmScholar ? defaultProcurement : profile.procurementHistoryClue || defaultProcurement,
      patentCoInventorsClue: isSpecialTcmScholar ? defaultPatent : profile.patentCoInventorsClue || defaultPatent,
      confirmedAt: nowStr,
    };

    const sanitizedConfirmed = sanitizeCustomerProfile(newConfirmed);
    setConfirmedCustomer(sanitizedConfirmed);
    setActiveIndustryState(sector);
    setCustomerHistory((prev) => {
      const filtered = prev.filter(
        (item) =>
          item.id !== sanitizedConfirmed.id &&
          !(
            item.scholarName === sanitizedConfirmed.scholarName &&
            item.institution === sanitizedConfirmed.institution
          )
      );
      return [sanitizedConfirmed, ...filtered].slice(0, 12);
    });
    setIsSelectingCustomer(false);
    return sanitizedConfirmed;
  };

  const selectFromHistory = (id: string) => {
    const target = customerHistory.find((item) => item.id === id);
    if (target) {
      setConfirmedCustomer(target);
      if (target.industrySector) {
        setActiveIndustryState(target.industrySector);
      }
      setIsSelectingCustomer(false);
    }
  };

  const removeFromHistory = (id: string) => {
    setCustomerHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CustomerContext.Provider
      value={{
        activeIndustry,
        setActiveIndustry,
        confirmedCustomer,
        customerHistory,
        isSelectingCustomer,
        setIsSelectingCustomer,
        confirmCustomer,
        selectFromHistory,
        removeFromHistory,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => {
  const ctx = useContext(CustomerContext);
  if (!ctx) {
    throw new Error('useCustomerContext must be used within a CustomerProvider');
  }
  return ctx;
};
