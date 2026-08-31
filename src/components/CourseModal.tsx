import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Calendar, 
  AlertCircle, 
  Trash2, 
  Save,
  Check
} from 'lucide-react';
import { Course } from '../types';
import { COURSE_COLOR_MAP, PERIOD_TIMES, getDayName, getFullDayName } from '../lib/utils';

interface CourseModalProps {
  course?: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
  onDelete?: (courseId: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!isOpen) return null;

  const isNew = !course;

  const [formData, setFormData] = useState<Partial<Course>>(
    course || {
      id: `c_${Date.now()}`,
      course_name: '',
      course_code: '',
      teacher: '',
      classroom: '',
      building: '',
      day_of_week: 1,
      start_period: 1,
      period_count: 2,
      start_time: '08:00',
      end_time: '09:40',
      weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      color: 'blue',
      credits: 3.0,
      exam_date: '',
      exam_time: '',
      exam_location: '',
      notes: '',
    }
  );

  const [isEditing, setIsEditing] = useState(isNew);

  const handlePeriodChange = (startPeriod: number, count: number) => {
    const startInfo = PERIOD_TIMES.find(p => p.period === startPeriod);
    const endPeriod = Math.min(10, startPeriod + count - 1);
    const endInfo = PERIOD_TIMES.find(p => p.period === endPeriod);
    setFormData(prev => ({
      ...prev,
      start_period: startPeriod,
      period_count: count,
      start_time: startInfo?.start || '08:00',
      end_time: endInfo?.end || '09:40',
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course_name?.trim()) return;

    onSave({
      id: formData.id || `c_${Date.now()}`,
      course_name: formData.course_name.trim(),
      course_code: formData.course_code || 'GEN1001',
      teacher: formData.teacher?.trim() || '任课教师',
      classroom: formData.classroom?.trim() || '待定教室',
      building: formData.building?.trim() || '教学楼',
      day_of_week: formData.day_of_week || 1,
      start_period: formData.start_period || 1,
      period_count: formData.period_count || 2,
      start_time: formData.start_time || '08:00',
      end_time: formData.end_time || '09:40',
      weeks: formData.weeks || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      color: formData.color || 'blue',
      credits: Number(formData.credits) || 2.0,
      exam_date: formData.exam_date,
      exam_time: formData.exam_time,
      exam_location: formData.exam_location,
      notes: formData.notes,
    });
    onClose();
  };

  const colorOptions = ['blue', 'indigo', 'emerald', 'amber', 'rose', 'purple', 'cyan'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/80 backdrop-blur-2xl flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-white/60 flex items-center justify-between sticky top-0 bg-white/60 backdrop-blur-xl z-10">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-blue-500/15 border border-blue-500/25 text-blue-700 flex items-center justify-center font-bold shadow-2xs">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <h3 className="font-black text-base text-slate-900">
              {isNew ? '添加新课程' : isEditing ? '编辑课程' : formData.course_name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 cursor-pointer transition-all active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isEditing && course ? (
          /* View Mode */
          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">{course.course_name}</h2>
                <div className="text-xs text-slate-500 font-mono mt-1 font-medium">
                  课程代码：{course.course_code || 'MATH1001'} · {course.credits} 学分
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black shadow-xs ${COURSE_COLOR_MAP[course.color]?.badge || 'bg-blue-100 text-blue-800'}`}>
                {course.credits} 学分
              </span>
            </div>

            {/* Time and Place Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="glass-panel-interactive p-4 rounded-2xl space-y-1">
                <div className="text-slate-400 font-bold flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                  <span>上课时间</span>
                </div>
                <div className="font-black text-slate-900 text-sm">
                  {getFullDayName(course.day_of_week)} 第{course.start_period}-{course.start_period + course.period_count - 1}节
                </div>
                <div className="text-slate-500 font-mono font-medium">{course.start_time} - {course.end_time}</div>
              </div>

              <div className="glass-panel-interactive p-4 rounded-2xl space-y-1">
                <div className="text-slate-400 font-bold flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  <span>上课地点</span>
                </div>
                <div className="font-black text-slate-900 text-sm">{course.classroom}</div>
                <div className="text-slate-500 font-medium">{course.building}</div>
              </div>

              <div className="glass-panel-interactive p-4 rounded-2xl space-y-1">
                <div className="text-slate-400 font-bold flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-purple-600" />
                  <span>任课教师</span>
                </div>
                <div className="font-black text-slate-900 text-sm">{course.teacher}</div>
              </div>

              <div className="glass-panel-interactive p-4 rounded-2xl space-y-1">
                <div className="text-slate-400 font-bold flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                  <span>上课周次</span>
                </div>
                <div className="font-black text-slate-900 text-sm">
                  {course.weeks.length > 0 ? `第 ${course.weeks[0]}-${course.weeks[course.weeks.length - 1]} 周` : '每周'}
                </div>
              </div>
            </div>

            {/* Exam info if available */}
            {course.exam_date && (
              <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 space-y-2 text-xs backdrop-blur-xs">
                <div className="font-black text-rose-900 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                  <span>期末考试安排</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-rose-800 font-medium">
                  <div>考试日期：<span className="font-bold font-mono">{course.exam_date}</span></div>
                  <div>考试时间：<span className="font-bold font-mono">{course.exam_time}</span></div>
                  <div className="col-span-2">考场及座次：<span className="font-bold">{course.exam_location}</span></div>
                </div>
              </div>
            )}

            {/* Notes */}
            {course.notes && (
              <div className="text-xs text-slate-600 glass-panel p-4 rounded-2xl space-y-1">
                <div className="font-bold text-slate-800">课程大纲与注意事项：</div>
                <p className="leading-relaxed font-medium">{course.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/60">
              {onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('确定要删除这门课程吗？')) {
                      onDelete(course.id);
                      onClose();
                    }
                  }}
                  className="px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-500/15 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>删除课程</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="ml-auto px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black cursor-pointer shadow-md shadow-blue-500/25 border border-white/30 transition-all active:scale-95"
              >
                编辑信息
              </button>
            </div>
          </div>
        ) : (
          /* Edit / Create Form */
          <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">课程名称 *</label>
              <input
                type="text"
                required
                value={formData.course_name || ''}
                onChange={e => setFormData({ ...formData, course_name: e.target.value })}
                placeholder="例如：高等数学 (上)"
                className="w-full px-4 py-2.5 border border-white/90 rounded-2xl bg-white/70 backdrop-blur-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">任课教师</label>
                <input
                  type="text"
                  value={formData.teacher || ''}
                  onChange={e => setFormData({ ...formData, teacher: e.target.value })}
                  placeholder="例如：李教授"
                  className="w-full px-4 py-2.5 border border-white/90 rounded-2xl bg-white/70 backdrop-blur-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">学分数</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.credits || 2.0}
                  onChange={e => setFormData({ ...formData, credits: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-white/90 rounded-2xl bg-white/70 backdrop-blur-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">教室编号</label>
                <input
                  type="text"
                  value={formData.classroom || ''}
                  onChange={e => setFormData({ ...formData, classroom: e.target.value })}
                  placeholder="例如：A101"
                  className="w-full px-4 py-2.5 border border-white/90 rounded-2xl bg-white/70 backdrop-blur-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">教学楼宇</label>
                <input
                  type="text"
                  value={formData.building || ''}
                  onChange={e => setFormData({ ...formData, building: e.target.value })}
                  placeholder="例如：第一教学楼"
                  className="w-full px-4 py-2.5 border border-white/90 rounded-2xl bg-white/70 backdrop-blur-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs font-medium"
                />
              </div>
            </div>

            {/* Day and Period Selection */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">星期</label>
                <select
                  value={formData.day_of_week || 1}
                  onChange={e => setFormData({ ...formData, day_of_week: parseInt(e.target.value, 10) })}
                  className="w-full px-3.5 py-2.5 border border-white/90 rounded-2xl bg-white/70 backdrop-blur-md font-bold shadow-2xs cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(d => (
                    <option key={d} value={d}>
                      {getFullDayName(d)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">起始节次</label>
                <select
                  value={formData.start_period || 1}
                  onChange={e => handlePeriodChange(parseInt(e.target.value, 10), formData.period_count || 2)}
                  className="w-full px-3.5 py-2.5 border border-white/90 rounded-2xl bg-white/70 backdrop-blur-md font-bold shadow-2xs cursor-pointer"
                >
                  {PERIOD_TIMES.map(p => (
                    <option key={p.period} value={p.period}>
                      第 {p.period} 节 ({p.start})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">连上节数</label>
                <select
                  value={formData.period_count || 2}
                  onChange={e => handlePeriodChange(formData.start_period || 1, parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 border border-white/90 rounded-2xl bg-white/70 backdrop-blur-md font-bold shadow-2xs cursor-pointer"
                >
                  <option value={1}>1 节</option>
                  <option value={2}>2 节 (标准)</option>
                  <option value={3}>3 节 (大课/实验)</option>
                  <option value={4}>4 节</option>
                </select>
              </div>
            </div>

            {/* Theme Color Picker */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">卡片主题色彩</label>
              <div className="flex items-center gap-2.5">
                {colorOptions.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c })}
                    className={`h-8 w-8 rounded-2xl transition-all cursor-pointer flex items-center justify-center shadow-xs ${
                      COURSE_COLOR_MAP[c]?.bg || 'bg-blue-500 text-white'
                    } ${formData.color === c ? 'ring-2 ring-offset-2 ring-blue-600 scale-110' : 'opacity-80 hover:opacity-100 hover:scale-105'}`}
                  >
                    {formData.color === c && <Check className="h-4 w-4 text-white drop-shadow-xs" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">备注说明 / 考核要求</label>
              <textarea
                rows={2}
                value={formData.notes || ''}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="例如：需携带实验报告，平时出勤占比30%..."
                className="w-full px-4 py-2.5 border border-white/90 rounded-2xl bg-white/70 backdrop-blur-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs font-medium"
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
                className="px-5 py-2.5 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-500/25 border border-white/30 transition-all active:scale-95"
              >
                <Save className="h-4 w-4" />
                <span>保存课程</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
