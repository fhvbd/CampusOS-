import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  Clock,
  Timer
} from 'lucide-react';
import { ChatMessage, AIStudyTool, Course, Task } from '../types';
import { AI_STUDY_TOOLS } from '../mockData';
import { CampusAPI } from '../services/api';
import { PomodoroTimer } from './PomodoroTimer';

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
    <div className="space-y-8 sm:space-y-10 pb-16">
      
      {/* 1. Header & AI Capability Badges (Liquid Glass Container) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-linear-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/25 border border-white/30 shrink-0">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <h2 className="font-black text-xl sm:text-2xl text-slate-900 flex items-center gap-3">
                <span>AI 智能学习与校园助手</span>
                <span className="text-[10px] font-black px-3 py-1 rounded-full bg-purple-500/15 text-purple-700 border border-purple-500/25 backdrop-blur-xs">
                  Gemini Flash 驱动
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
                支持全学科教材课件解析、康奈尔笔记重构、期末高频考点生成与智能学业规划。
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto glass-pill border border-white/80 active:scale-95 shadow-2xs"
          >
            <Trash2 className="h-4 w-4" />
            <span>清空对话</span>
          </button>
        </div>

        {/* 2. Quick Action Tool Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-4 border-t border-white/60">
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
                className="flex flex-col items-start p-4 rounded-2xl glass-panel-interactive transition-all text-left cursor-pointer group shadow-xs"
              >
                <div className="h-9 w-9 rounded-xl bg-purple-500/15 border border-purple-500/25 group-hover:bg-purple-600 group-hover:text-white text-purple-700 flex items-center justify-center shadow-2xs transition-all mb-3">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="text-xs font-black text-slate-800 group-hover:text-purple-700 leading-snug">
                  {tool.title}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1 font-medium">
                  {tool.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2.5. Pomodoro Focus Timer with Custom Time & Break Suggestions */}
      <PomodoroTimer 
        onSuggestBreak={(breakMinutes) => {
          // Send friendly AI Assistant break message to conversation
          const breakTip: ChatMessage = {
            id: `break_${Date.now()}`,
            role: 'assistant',
            content: `☕ **深度专注周期完成提醒**\n\n太棒了！您刚刚完成了一个高强度的专注周期。根据认知科学与学习曲线，持续专注后大脑需要 **${breakMinutes} 分钟** 的休息来巩固短期记忆与神经突触连接。\n\n**建议的放松方式：**\n1. 离开屏幕，眺望远方绿色植物或窗外 20 秒以上\n2. 起身活动颈椎与腰背，喝一杯温开水\n3. 进行 3 次深慢腹式呼吸\n\n休息结束后我们继续高效冲刺！`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggested_actions: ['制定下一轮专注任务', '帮我整理高数复习考点', '抽查英语核心词汇'],
          };
          setMessages(prev => [...prev, breakTip]);
        }}
      />

      {/* 3. Main Chat History Window (Liquid Glass Acrylic Window) */}
      <div className="glass-panel rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[520px] max-h-[740px]">
        
        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-7">
          <AnimatePresence initial={false}>
            {messages.map(msg => {
              const isUser = msg.role === 'user';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex gap-3.5 sm:gap-5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className={`h-10 w-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-md border border-white/40 backdrop-blur-md ${
                      isUser
                        ? 'bg-linear-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/25'
                        : 'bg-linear-to-tr from-purple-600 to-indigo-600 text-white shadow-purple-500/25'
                    }`}
                  >
                    {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </motion.div>

                  {/* Message Bubble */}
                  <div className={`space-y-2.5 max-w-[88%] sm:max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-3xl px-6 py-4.5 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs shadow-md shadow-blue-500/20 border border-white/30 font-medium whitespace-pre-wrap'
                          : 'bg-white/85 text-slate-800 rounded-tl-xs border border-white/90 shadow-sm backdrop-blur-md font-medium'
                      }`}
                    >
                      {isUser ? (
                        msg.content
                      ) : (
                        <div className="markdown-body">
                          <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
                        </div>
                      )}
                    </div>

                    {/* Actions & Timestamp below message */}
                    <div className={`flex items-center gap-2.5 text-[10px] text-slate-400 px-1 font-medium ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <span className="font-mono">{msg.timestamp}</span>

                      {!isUser && (
                        <>
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="hover:text-slate-700 flex items-center gap-1 cursor-pointer ml-2 px-2.5 py-0.5 rounded-md hover:bg-white/60 transition-colors"
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
                            className="hover:text-indigo-600 flex items-center gap-1 cursor-pointer ml-2.5 px-2.5 py-0.5 rounded-md hover:bg-indigo-50/60 transition-colors"
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
                      <motion.div 
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                        className="flex flex-wrap gap-2.5 pt-2.5"
                      >
                        {msg.suggested_actions.map((act, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleSendMessage(act)}
                            className="text-[11px] font-bold px-3.5 py-2 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 border border-purple-500/20 transition-all cursor-pointer flex items-center gap-2 backdrop-blur-xs shadow-2xs text-left"
                          >
                            <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            <span>{act}</span>
                            <ArrowRight className="h-3 w-3 opacity-60 shrink-0" />
                          </motion.button>
                        ))}
                      </motion.div>
                    )}

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex gap-4 items-center text-slate-500 text-xs"
            >
              <div className="h-10 w-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Bot className="h-5 w-5 animate-bounce" />
              </div>
              <div className="glass-panel px-5 py-3.5 rounded-2xl flex items-center gap-3 font-bold text-slate-700 shadow-xs">
                <RefreshCw className="h-4 w-4 animate-spin text-purple-600" />
                <span>AI 助手正在深度思考与提炼中...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 sm:p-5 bg-white/40 backdrop-blur-xl border-t border-white/60">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              id="ai-chat-input"
              type="text"
              value={inputPrompt}
              onChange={e => setInputPrompt(e.target.value)}
              placeholder="输入课程问题、课件内容、笔记、或请求 AI 制定学习规划..."
              className="flex-1 px-5 py-3.5 bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all shadow-2xs font-medium"
            />
            <button
              id="ai-chat-send"
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="px-6 py-3.5 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 text-white rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-purple-500/25 border border-white/30 shrink-0 active:scale-95"
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
