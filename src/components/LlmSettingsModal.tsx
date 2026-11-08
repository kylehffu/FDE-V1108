import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Settings,
  Check,
  AlertCircle,
  Key,
  Globe,
  Cpu,
  Layers,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export interface LlmConfigData {
  provider: 'gemini' | 'openai-compatible' | 'deepseek' | 'qwen' | 'custom' | 'mock';
  apiKeyMasked: string;
  hasApiKey: boolean;
  baseUrl: string;
  model: string;
  temperature: number;
}

interface LlmSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: (config: LlmConfigData) => void;
}

const PROVIDER_PRESETS = [
  {
    id: 'deepseek',
    name: 'DeepSeek (深度求索)',
    badge: '高性价比·强推理',
    defaultBaseUrl: 'https://api.deepseek.com',
    defaultModel: 'deepseek-chat',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    help: '国内直连极佳，支持高深度生物医学与商业逻辑推理，兼容 OpenAI 格式。',
    docsUrl: 'https://platform.deepseek.com',
  },
  {
    id: 'qwen',
    name: '通义千问 (DashScope / 百炼)',
    badge: '阿里技术·本土中文强',
    defaultBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-plus',
    models: ['qwen-plus', 'qwen-turbo', 'qwen-max'],
    help: '阿里大模型官方兼容接口，政商关系理解与中文公文语境表现卓越。',
    docsUrl: 'https://bailian.console.aliyun.com',
  },
  {
    id: 'openai-compatible',
    name: 'OpenAI 官方 / 中继',
    badge: '行业标准接口',
    defaultBaseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o', 'o1-mini'],
    help: '标准 OpenAI API 格式，支持官方或各类第三方 One-API / New-API 中继反向代理。',
    docsUrl: 'https://platform.openai.com',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    badge: '原厂 SDK 极速响应',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com',
    defaultModel: 'gemini-3.1-flash-lite',
    models: ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-pro'],
    help: 'Google 原生 GenAI 架构，支持海量上下文与毫秒级学术信息解卷积。',
    docsUrl: 'https://aistudio.google.com',
  },
  {
    id: 'custom',
    name: '本地私有化 / Ollama / vLLM',
    badge: '内网合规·数据绝密',
    defaultBaseUrl: 'http://127.0.0.1:11434/v1',
    defaultModel: 'qwen2.5:14b',
    models: ['qwen2.5:14b', 'deepseek-r1:14b', 'llama3.3:70b'],
    help: '支持本地 Ollama、vLLM 或院所内部私有化部署的大模型端点。',
    docsUrl: 'https://ollama.com',
  },
];

export const LlmSettingsModal: React.FC<LlmSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [provider, setProvider] = useState<string>('deepseek');
  const [apiKey, setApiKey] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>('https://api.deepseek.com');
  const [model, setModel] = useState<string>('deepseek-chat');
  const [temperature, setTemperature] = useState<number>(0.3);

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [hasServerKey, setHasServerKey] = useState<boolean>(false);
  const [maskedKey, setMaskedKey] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  const loadConfig = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/llm/config');
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setProvider(d.provider || 'deepseek');
        setBaseUrl(d.baseUrl || 'https://api.deepseek.com');
        setModel(d.model || 'deepseek-chat');
        setTemperature(d.temperature ?? 0.3);
        setHasServerKey(d.hasApiKey || false);
        setMaskedKey(d.apiKeyMasked || '');
        setApiKey(d.hasApiKey ? d.apiKeyMasked : '');
      }
    } catch {
      // Silent fallback
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentPreset = PROVIDER_PRESETS.find((p) => p.id === provider) || PROVIDER_PRESETS[0];

  const handleSelectProvider = (pId: string) => {
    setProvider(pId);
    setTestResult(null);
    const matched = PROVIDER_PRESETS.find((p) => p.id === pId);
    if (matched) {
      setBaseUrl(matched.defaultBaseUrl);
      setModel(matched.defaultModel);
      // Reset input key if switching to another service and no key typed
      if (apiKey === maskedKey) {
        setApiKey('');
      }
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/llm/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey: apiKey.trim(),
          baseUrl: baseUrl.trim(),
          model: model.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({
          success: true,
          msg: `连通成功！模型响应: ${JSON.stringify(data.response?.message || 'OK')}`,
        });
      } else {
        setTestResult({
          success: false,
          msg: `连接失败: ${data.error || '无法访问上游接口，请检查 Base URL 与 API Key'}`,
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        msg: `网络错误: ${err?.message || '请确认后端服务已启动'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/llm/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey: apiKey.trim(),
          baseUrl: baseUrl.trim(),
          model: model.trim(),
          temperature,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (onConfigSaved) onConfigSaved(data.data);
        onClose();
      } else {
        setTestResult({ success: false, msg: data.error || '保存失败' });
      }
    } catch (err: any) {
      setTestResult({ success: false, msg: err?.message || '保存失败' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>AI 作战大脑模型配置</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  可随时更换 API
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                支持自由切换 DeepSeek、通义千问、OpenAI、Gemini 或本地私有化 Ollama / vLLM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Provider Preset Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              1. 选择大模型供应商 / 接口协议
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PROVIDER_PRESETS.map((p) => {
                const isSelected = provider === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectProvider(p.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500 ring-1 ring-cyan-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-white">{p.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {p.help}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Config Fields */}
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4.5 space-y-4">
            {/* API Key */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>API Key (密钥)</span>
                </label>
                {hasServerKey && (
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                    已保存: {maskedKey}
                  </span>
                )}
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={hasServerKey ? '保留现有密钥，或输入新密钥更新' : '请输入该平台的 API Key (如 sk-...)'}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                密钥仅加密持久化保存在本地后端配置中，绝不上传任何公网三方。本地 Ollama 可留空。
              </p>
            </div>

            {/* Base URL */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Base URL (服务接入端点)</span>
              </label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="如: https://api.deepseek.com 或 https://api.openai.com/v1"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                支持任何兼容 OpenAI 规范的端点。系统会自动补全 <code className="text-cyan-400">/chat/completions</code> 路由。
              </p>
            </div>

            {/* Model Name & Presets */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Model Name (模型标识)</span>
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="如: deepseek-chat, qwen-plus, gpt-4o-mini"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 font-mono"
                />
                {currentPreset.models && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-500">常用模型快速点选:</span>
                    {currentPreset.models.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setModel(m)}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                          model === m
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Temperature */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Temperature (创造力与逻辑严谨度)</span>
                </label>
                <span className="text-xs font-mono text-cyan-400">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0.0 (最严谨·B端建议)</span>
                <span>0.3 (推荐值)</span>
                <span>1.0 (高发散)</span>
              </div>
            </div>
          </div>

          {/* Test connection output banner */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs animate-in fade-in duration-200 ${
                testResult.success
                  ? 'bg-emerald-950/50 border-emerald-800/80 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-800/80 text-rose-200'
              }`}
            >
              {testResult.success ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 break-all leading-relaxed">{testResult.msg}</div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>测试联通性 (Ping)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存并生效'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
