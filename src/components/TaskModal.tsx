import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckSquare, 
  Calendar, 
  Clock, 
  Tag, 
  AlertCircle, 
  Save, 
  BookOpen,
  Sparkles,
  Zap
} from 'lucide-react';
import { Task, TaskCategory, TaskPriority, Course } from '../types';
import { detectTaskAutoTag, getTaskTagIcon, TASK_TAG_RULES } from '../lib/taskTags';

interface TaskModalProps {
  task?: Task | null;
  courses: Course[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  courses,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<Partial<Task>>(
    task || {
      id: `t_${Date.now()}`,
      title: '',
      description: '',
      category: 'homework',
      priority: 'medium',
      deadline: `${new Date().toISOString().split('T')[0]} 23:59`,
      is_completed: false,
      course_id: '',
      course_name: '',
      created_at: new Date().toISOString().split('T')[0],
    }
  );

  // Track if user manually touched category
  const [isCategoryManuallySet, setIsCategoryManuallySet] = useState(Boolean(task));

  // Detected auto tag
  const autoTag = detectTaskAutoTag(formData.title || '', formData.category);
  const TagIconComponent = getTaskTagIcon(autoTag.iconName);

  // Auto-sync category when title changes if not manually set
  const handleTitleChange = (newTitle: string) => {
    const detected = detectTaskAutoTag(newTitle, formData.category);
    if (!isCategoryManuallySet && detected.keywordMatched) {
      setFormData(prev => ({
        ...prev,
        title: newTitle,
        category: detected.category,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        title: newTitle,
      }));
    }
  };

  const handleCategorySelect = (ruleCategory: TaskCategory, ruleLabel: string) => {
    setIsCategoryManuallySet(true);
    setFormData(prev => ({
      ...prev,
      category: ruleCategory,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    const selectedCourse = courses.find(c => c.id === formData.course_id);
    const finalTag = detectTaskAutoTag(formData.title.trim(), formData.category);

    onSave({
      id: formData.id || `t_${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description || '',
      category: formData.category || finalTag.category || 'homework',
      priority: formData.priority || 'medium',
      deadline: formData.deadline || `${new Date().toISOString().split('T')[0]} 23:59`,
      is_completed: formData.is_completed || false,
      course_id: formData.course_id,
      course_name: selectedCourse ? selectedCourse.course_name : formData.course_name,
      created_at: formData.created_at || new Date().toISOString().split('T')[0],
      auto_tag_label: finalTag.label,
      auto_tag_icon: finalTag.iconName,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl max-w-lg w-full shadow-2xl border border-white/80 backdrop-blur-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-white/60 bg-white/40 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-700 flex items-center justify-center font-bold shadow-2xs">
              <CheckSquare className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                {task ? '编辑待办任务' : '新建待办事项'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">支持根据关键词智能自动分配标签与类别</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 cursor-pointer transition-all active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Title with live Auto-Tag hint */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-700">待办标题 *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="例如：周五计算机网络期末考试复习、完成离散数学大作业、挑战杯答辩会议"
              className="w-full px-4 py-2.5 border border-white/90 rounded-2xl bg-white/70 backdrop-blur-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium shadow-2xs text-slate-900"
            />

            {/* Smart Auto-Tag Detection Banner */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/60 border border-white/80 backdrop-blur-xs gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold shrink-0">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  <span>自动标签：</span>
                </span>
                
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black border shadow-2xs ${autoTag.badgeClass}`}>
                  <TagIconComponent className="h-3.5 w-3.5" />
                  <span>{autoTag.label}</span>
                </span>

                {autoTag.keywordMatched && (
                  <span className="text-[10px] text-slate-400 font-medium truncate hidden sm:inline">
                    (匹配关键词: <strong className="text-slate-600 font-bold">「{autoTag.keywordMatched}」</strong>)
                  </span>
                )}
              </div>

              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded-lg border border-indigo-100/60 shrink-0">
                实时语义识别
              </span>
            </div>
          </div>

          {/* Quick Tag Selector Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700">快捷标签分类</label>
              <span className="text-[10px] text-slate-400 font-medium">点击可快捷切换或覆盖</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TASK_TAG_RULES.map(rule => {
                const isSelected = autoTag.label === rule.label;
                const RuleIcon = getTaskTagIcon(rule.iconName);
                return (
                  <button
                    key={rule.id}
                    type="button"
                    onClick={() => handleCategorySelect(rule.category, rule.label)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? `${rule.bgClass} ${rule.textClass} ${rule.borderClass} ring-2 ring-indigo-400/40 shadow-xs scale-102`
                        : 'bg-white/50 hover:bg-white/80 text-slate-600 border-white/80'
                    }`}
                  >
                    <RuleIcon className="h-3.5 w-3.5" />
                    <span>{rule.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">系统底层类别</label>
              <select
                value={formData.category || 'homework'}
                onChange={e => {
                  setIsCategoryManuallySet(true);
                  setFormData({ ...formData, category: e.target.value as TaskCategory });
                }}
                className="w-full px-3.5 py-2.5 border border-white/90 rounded-2xl bg-white/70 backdrop-blur-md font-bold text-slate-800 shadow-2xs cursor-pointer"
              >
                <option value="homework">课程作业</option>
                <option value="exam">考试复习</option>
                <option value="campus">校园事务</option>
                <option value="personal">个人规划</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">优先级</label>
              <select
                value={formData.priority || 'medium'}
                onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                className="w-full px-3.5 py-2.5 border border-white/90 rounded-2xl bg-white/70 backdrop-blur-md font-bold text-slate-800 shadow-2xs cursor-pointer"
              >
                <option value="high">🔥 紧急重要 (高)</option>
                <option value="medium">⚡ 标准任务 (中)</option>
                <option value="low">🌱 稍后处理 (低)</option>
              </select>
            </div>
          </div>

          {/* Associated Course */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">关联课程 (可选)</label>
            <select
              value={formData.course_id || ''}
              onChange={e => setFormData({ ...formData, course_id: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-white/90 rounded-2xl bg-white/70 backdrop-blur-md font-medium text-slate-800 shadow-2xs cursor-pointer"
            >
              <option value="">-- 无关联课程 --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.course_name} ({c.teacher})
                </option>
              ))}
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">截止时间</label>
            <input
              type="text"
              value={formData.deadline || ''}
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
              placeholder="YYYY-MM-DD 或 YYYY-MM-DD HH:mm"
              className="w-full px-4 py-2.5 border border-white/90 rounded-2xl bg-white/70 backdrop-blur-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono font-medium shadow-2xs text-slate-900"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">补充说明与要点</label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="记录具体作业题目要求、提交方式等..."
              className="w-full px-4 py-2.5 border border-white/90 rounded-2xl bg-white/70 backdrop-blur-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs font-medium text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100/60 font-bold cursor-pointer transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-500/25 border border-white/30 transition-all active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span>保存待办</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

