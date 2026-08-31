import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  FileText, 
  BookOpen, 
  Target, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  Trash2, 
  Copy, 
  Check, 
  PlusCircle, 
  HelpCircle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Clock
} from 'lucide-react';
import { ChatMessage, AIStudyTool, Course, Task } from '../types';
import { AI_STUDY_TOOLS } from '../mockData';
import { CampusAPI } from '../services/api';

interface AIAssistantTabProps {
  courses: Course[];
  onAddTaskFromAI: (title: string, deadline?: string) => void;
}

export const AIAssistantTab: React.FC<AIAssistantTabProps> = ({
  courses,
  onAddTaskFromAI,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: `### 🎓 你好！我是 CampusOS 智能校园学习助理

我已经接入您的校园课表与教务系统。今天我可以为您提供：
- 📑 **课件/教材速读**：提炼高等数学、数据结构等核心定理与高频考点
- 📝 **笔记重构**：将随堂记录一键转化为标准康奈尔笔记或复习卡片
- 📅 **智能学习规划**：分析空闲时间，制定 GPA 3.8+ 冲刺计划
- 🏆 **奖学金/竞赛答疑**：解读国家奖学金综测细则、挑战杯申报流程

您可以点击下方的【快捷功能卡片】，或直接在对话框中向我提问！`,
      timestamp: '刚刚',
      suggested_actions: [
        '为我提炼高等数学考试核心考点',
        '根据我的课表制定本周学习计划',
        '国家奖学金申请需要准备哪些材料？',
        '帮我写一段计算机专业大一学习总结',
      ],
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Build relevant campus context to pass to Gemini API
      const context = {
        courses: courses.map(c => ({ name: c.course_name, teacher: c.teacher, credits: c.credits })),
      };

      const res = await CampusAPI.sendAIChat(query, context);

      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_actions: res.suggested_actions,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      const errMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: '抱歉，当前 AI 响应遇到一点波动，请稍后再试或检查网络设置。',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToolClick = (tool: AIStudyTool) => {
    setInputPrompt(tool.prompt_template);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `m_init_${Date.now()}`,
        role: 'assistant',
        content: '对话记录已清空。有什么可以帮您的吗？',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header & AI Capability Badges */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-slate-900 flex items-center gap-2">
                <span>AI 智能学习与校园助手</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Gemini Flash 驱动
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                支持全学科教材课件解析、康奈尔笔记重构、期末高频考点生成与智能学业规划。
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto border border-slate-200 hover:border-rose-200"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>清空对话</span>
          </button>
        </div>

        {/* 2. Quick Action Tool Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100">
          {AI_STUDY_TOOLS.map(tool => {
            let Icon = FileText;
            if (tool.id === 'tool_class_summary') Icon = BookOpen;
            if (tool.id === 'tool_exam_focus') Icon = Target;
            if (tool.id === 'tool_study_plan') Icon = Calendar;
            if (tool.id === 'tool_postgrad_plan') Icon = GraduationCap;
            if (tool.id === 'tool_resume_tuner') Icon = Briefcase;

            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className="flex flex-col items-start p-3 rounded-xl bg-slate-50/80 hover:bg-purple-50/70 border border-slate-200/80 hover:border-purple-300 transition-all text-left cursor-pointer group"
              >
                <div className="h-7 w-7 rounded-lg bg-white group-hover:bg-purple-600 group-hover:text-white text-purple-700 flex items-center justify-center shadow-2xs transition-colors mb-2">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-purple-700 leading-snug">
                  {tool.title}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {tool.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Chat History Window */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col min-h-[460px] max-h-[680px]">
        
        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map(msg => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-purple-600 text-white'
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`space-y-2 max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-slate-50 text-slate-800 rounded-tl-xs border border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Actions & Timestamp below message */}
                  <div className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <>
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-slate-700 flex items-center gap-0.5 cursor-pointer ml-1"
                          title="复制回答"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          <span>{copiedId === msg.id ? '已复制' : '复制'}</span>
                        </button>

                        <button
                          onClick={() => onAddTaskFromAI(msg.content.slice(0, 40) + '...', '2026-09-07')}
                          className="hover:text-indigo-600 flex items-center gap-0.5 cursor-pointer ml-2"
                          title="把要点加入待办任务"
                        >
                          <PlusCircle className="h-3 w-3" />
                          <span>生成待办</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Suggested Prompts pills */}
                  {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {msg.suggested_actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(act)}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/70 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Lightbulb className="h-3 w-3 text-amber-500" />
                          <span>{act}</span>
                          <ArrowRight className="h-2.5 w-2.5 opacity-60" />
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-500 text-xs">
              <div className="h-8 w-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 animate-bounce" />
              </div>
              <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-purple-600" />
                <span>AI 助手正在深度思考与提炼中...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area */}
        <div className="p-3 sm:p-4 bg-slate-50/80 border-t border-slate-200">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="ai-chat-input"
              type="text"
              value={inputPrompt}
              onChange={e => setInputPrompt(e.target.value)}
              placeholder="输入课程问题、课件内容、笔记、或请求 AI 制定学习规划..."
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
            <button
              id="ai-chat-send"
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">发送</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
