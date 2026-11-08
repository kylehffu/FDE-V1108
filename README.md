# 面向生命科学与技术型B端的 FDE 顾问式销售作战系统 (V2.0)

> 基于「双图谱认知底座」与「三级商机裂变中枢」的现场作战副驾驶系统

## 目录结构

```text
├── fde-consultative-copilot-master-specification.md  # V2.0 战略与技术白皮书主规范
├── package.json                                      # 项目依赖与开发脚本
├── server.ts                                         # Express 全栈服务 + Gemini 3.8 Flash AI 作战推理接口
├── vite.config.ts                                    # Vite 前端构建配置
├── tsconfig.json                                     # TypeScript 配置
├── index.html                                        # 应用入口与 Meta 规范
└── src/
    ├── main.tsx                                      # React 入口渲染
    ├── App.tsx                                       # 顶层布局与标签页路由器
    ├── index.css                                     # Tailwind CSS v4 与字体样式
    ├── types/
    │   └── index.ts                                  # 核心数据模型（产品图谱、学术社交图谱、情报信号）
    ├── data/
    │   └── mockData.ts                               # 广州睿贝 8 大 SKU、华南区域学者图谱与 4 级前置经费情报
    ├── utils/
    │   └── proceduralModels.ts                       # Three.js 复合多部件程序化 PBR 仪器模型生成器
    └── components/
        ├── Navbar.tsx                                # 严格规范三区顶栏
        ├── FieldCopilotView.tsx                      # 现场作战副驾驶（广州睿贝 × 肿瘤免疫实验室沙盘）
        ├── DualGraphView.tsx                         # 双图谱认知底座容器
        ├── ProductStoryGraph.tsx                     # 左脑：企业产品故事网络（因果叙事与控标参数）
        ├── AcademicSocialGraph.tsx                   # 右脑：D3 力导向学术社交图谱（经费、共同作者、台账）
        ├── ThreeDStudioView.tsx                      # 3D 旗舰剖析台（光学结构爆炸图与 5 波长激光模拟）
        ├── ThreeTierEngineView.tsx                   # 三级商机裂变引擎（需求定性 -> 降维 -> 圈层裂变）
        ├── FundingRadarView.tsx                      # 战略经费嗅探雷达（环评公示、人才招聘、临床注册）
        ├── WhitepaperView.tsx                        # 白皮书全文阅读与 Markdown 导出
        ├── AiTacticalDrawer.tsx                      # AI 现场作战推演抽屉（调用 Gemini API）
        └── JointDocModal.tsx                         # 交付物文书在线预览与导出（技术方案 / 申报论证）
```

## 快速启动

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量（可选）
在根目录下创建 `.env` 文件：
```env
# 可选：配置 Gemini API Key（若未配置，系统会自动采用高拟真规则引擎推演兜底）
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### 3. 启动开发服务器
```bash
npm run dev
```
打开浏览器访问：`http://localhost:3000`

### 4. 生产环境构建与启动
```bash
npm run build
npm start
```

## 核心系统架构与设计亮点

1. **双图谱认知底座（Dual-Graph Cognitive Engine）**
   - **左脑·产品故事图谱：** 8 大 SKU 之间由 `DownstreamValidationOf`（下游验证依赖）、`SpatialComplementOf`（原位空间互补）、`ScaleBreakthroughOf`（尺度突破）、`OpExAlternativeOf`（服务降维替代）与 `RiskMitigationOf`（风险免责）因果相连。
   - **右脑·学术社交图谱（D3.js 力导向）：** 真实还原学者间的 `CoAuthorWith`、`SameMentorAs` 与 `PlatformGatekeeperOf`，支持任意拖拽、缩放、聚焦，穿透查看经费水位、共同作者人脉与已知实验室装机台账。

2. **现场作战副驾驶（广州睿贝 × 肿瘤免疫实验室实战沙盘）**
   - **拜访前：** 30秒底牌透视卡（论文 Methods 缺陷、经费水位、个人 Win 诉求）。
   - **拜访中：** 顾问式金牌三连问（痛点刺穿 $\rightarrow$ 签下 5.2 万元外包服务单 $\rightarrow$ 约定引见千万元级大主任）。
   - **拜访后：** 10秒语音情报众包录入，自动 NLP 结构化反哺社交图谱，并一键生成交付物文书。

3. **3D 旗舰剖析台（Three.js PBR Studio）**
   - 10 部件程序化精细组装 Cytek Aurora CS 与 9 部件 IVIS Spectrum；
   - 支持平滑阻尼光学爆炸图（`0%`～`100%`），直观对比 64 通道 APD 阵列与传统 PMT 优劣；
   - 5 波长（355/405/488/561/640nm）激光激发流道光路实时模拟。

4. **战略经费嗅探雷达**
   - 定向解析生态环境局《环评受理公示 PDF》（提前 6～18 个月获知房间号与拟购仪器清单）；
   - 追踪高校人事处海外优青引进与科研管家招聘通知（提前 6～12 个月）；
   - 监控 ChiCTR 临床试验与重点实验室立项公示（提前 3～9 个月）。
