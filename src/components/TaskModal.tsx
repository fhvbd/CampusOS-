import React, { useState } from 'react';
import { 
  X, 
  CheckSquare, 
  Calendar, 
  Clock, 
  Tag, 
  AlertCircle, 
  Save, 
  BookOpen
} from 'lucide-react';
import { Task, TaskCategory, TaskPriority, Course } from '../types';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    const selectedCourse = courses.find(c => c.id === formData.course_id);

    onSave({
      id: formData.id || `t_${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description || '',
      category: formData.category || 'homework',
      priority: formData.priority || 'medium',
      deadline: formData.deadline || `${new Date().toISOString().split('T')[0]} 23:59`,
      is_completed: formData.is_completed || false,
      course_id: formData.course_id,
      course_name: selectedCourse ? selectedCourse.course_name : formData.course_name,
      created_at: formData.created_at || new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <CheckSquare className="h-4 w-4" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              {task ? '编辑待办任务' : '新建待办事项'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">待办标题 *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="例如：完成高等数学课后习题"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">分类标签</label>
              <select
                value={formData.category || 'homework'}
                onChange={e => setFormData({ ...formData, category: e.target.value as TaskCategory })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-800"
              >
                <option value="homework">课程作业</option>
                <option value="exam">考试复习</option>
                <option value="campus">校园事务</option>
                <option value="personal">个人规划</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">优先级</label>
              <select
                value={formData.priority || 'medium'}
                onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-800"
              >
                <option value="high">🔥 紧急重要 (高)</option>
                <option value="medium">⚡ 标准任务 (中)</option>
                <option value="low">🌱 稍后处理 (低)</option>
              </select>
            </div>
          </div>

          {/* Associated Course */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">关联课程 (可选)</label>
            <select
              value={formData.course_id || ''}
              onChange={e => setFormData({ ...formData, course_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800"
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
            <label className="block font-bold text-slate-700 mb-1">截止时间</label>
            <input
              type="text"
              value={formData.deadline || ''}
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
              placeholder="YYYY-MM-DD 或 YYYY-MM-DD HH:mm"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">补充说明与要点</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="记录具体作业题目要求、提交方式等..."
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>保存待办</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
