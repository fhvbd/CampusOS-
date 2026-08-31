import React from 'react';
import { 
  GraduationCap, 
  FileText, 
  Users, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Code2, 
  Calendar, 
  Sparkles, 
  Tag as TagIcon,
  FlaskConical,
  MessageSquare,
  FileCheck,
  Building,
  Target
} from 'lucide-react';
import { TaskCategory } from '../types';

export interface TaskAutoTag {
  id: string;
  label: string;
  keywordMatched?: string;
  category: TaskCategory;
  iconName: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeClass: string;
}

export interface TagRule {
  id: string;
  label: string;
  keywords: string[];
  category: TaskCategory;
  iconName: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeClass: string;
}

export const TASK_TAG_RULES: TagRule[] = [
  {
    id: 'exam',
    label: '考试复习',
    keywords: ['考试', '复习', '期末', '期中', '测验', '考点', '模考', '补考', '缓考', '刷题', '真题', '背诵', '考研', '四六级', '软考'],
    category: 'exam',
    iconName: 'GraduationCap',
    bgClass: 'bg-rose-500/15',
    textClass: 'text-rose-700',
    borderClass: 'border-rose-500/25',
    badgeClass: 'bg-rose-500/10 text-rose-700 border-rose-500/25',
  },
  {
    id: 'paper',
    label: '论文报告',
    keywords: ['论文', '报告', '开题', '答辩', '综述', '文献', '调研', '结题', '课程设计', '课设', '设计说明', '毕设', '写作', '毕业设计', '排版'],
    category: 'homework',
    iconName: 'FileText',
    bgClass: 'bg-indigo-500/15',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-500/25',
    badgeClass: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/25',
  },
  {
    id: 'meeting',
    label: '会议研讨',
    keywords: ['会议', '组会', '班会', '研讨', '讲座', '宣讲', '交流', '座谈', '双选会', '见面会', '评审会', '团日活动', '例会'],
    category: 'campus',
    iconName: 'Users',
    bgClass: 'bg-amber-500/15',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-500/25',
    badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-500/25',
  },
  {
    id: 'lab',
    label: '实验代码',
    keywords: ['实验', '上机', '代码', 'OJ', '编程', '算法', '仿真', '开发', '单片机', '调试', '实训', 'CAD', '绘图', '装配'],
    category: 'homework',
    iconName: 'FlaskConical',
    bgClass: 'bg-cyan-500/15',
    textClass: 'text-cyan-700',
    borderClass: 'border-cyan-500/25',
    badgeClass: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/25',
  },
  {
    id: 'application',
    label: '事务申报',
    keywords: ['申报', '申请', '奖学金', '助学金', '挑战杯', '竞赛', '选课', '退课', '补选', '评优', '立项', '入党', '团员', '报销', '审批'],
    category: 'campus',
    iconName: 'Award',
    bgClass: 'bg-purple-500/15',
    textClass: 'text-purple-700',
    borderClass: 'border-purple-500/25',
    badgeClass: 'bg-purple-500/10 text-purple-700 border-purple-500/25',
  },
  {
    id: 'homework',
    label: '课程作业',
    keywords: ['作业', '习题', '课后', '练习', '大作业', '作图', '翻译', '预习', '提交', '读书笔记'],
    category: 'homework',
    iconName: 'BookOpen',
    bgClass: 'bg-emerald-500/15',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-500/25',
    badgeClass: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/25',
  },
  {
    id: 'routine',
    label: '日常打卡',
    keywords: ['打卡', '锻炼', '跑步', '签到', '还书', '借书', '宿舍', '充值', '体测', '卫生', '早读'],
    category: 'personal',
    iconName: 'CheckCircle2',
    bgClass: 'bg-blue-500/15',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-500/25',
    badgeClass: 'bg-blue-500/10 text-blue-700 border-blue-500/25',
  },
];

/**
 * Automatically detects a suitable tag based on the task title and optional existing category.
 */
export function detectTaskAutoTag(title: string, currentCategory?: TaskCategory): TaskAutoTag {
  if (!title) {
    return {
      id: 'default',
      label: currentCategory === 'exam' ? '考试复习' : currentCategory === 'campus' ? '校园事务' : '学习待办',
      category: currentCategory || 'homework',
      iconName: currentCategory === 'exam' ? 'GraduationCap' : 'BookOpen',
      bgClass: 'bg-slate-500/15',
      textClass: 'text-slate-700',
      borderClass: 'border-slate-500/25',
      badgeClass: 'bg-slate-500/10 text-slate-700 border-slate-500/25',
    };
  }

  const lower = title.toLowerCase();

  for (const rule of TASK_TAG_RULES) {
    for (const keyword of rule.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        return {
          id: rule.id,
          label: rule.label,
          keywordMatched: keyword,
          category: rule.category,
          iconName: rule.iconName,
          bgClass: rule.bgClass,
          textClass: rule.textClass,
          borderClass: rule.borderClass,
          badgeClass: rule.badgeClass,
        };
      }
    }
  }

  // If no keyword matched, fallback gracefully according to category
  if (currentCategory === 'exam') {
    const r = TASK_TAG_RULES[0];
    return { ...r, id: 'exam_fallback', keywordMatched: undefined };
  } else if (currentCategory === 'campus') {
    const r = TASK_TAG_RULES[4];
    return { ...r, id: 'campus_fallback', label: '校园事务', keywordMatched: undefined };
  } else if (currentCategory === 'personal') {
    const r = TASK_TAG_RULES[6];
    return { ...r, id: 'personal_fallback', label: '个人规划', keywordMatched: undefined };
  }

  return {
    id: 'general',
    label: '日常学习',
    category: currentCategory || 'homework',
    iconName: 'BookOpen',
    bgClass: 'bg-blue-500/15',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-500/25',
    badgeClass: 'bg-blue-500/10 text-blue-700 border-blue-500/25',
  };
}

/**
 * Helper to get the Lucide React icon component from iconName string
 */
export function getTaskTagIcon(iconName: string): React.FC<{ className?: string }> {
  switch (iconName) {
    case 'GraduationCap':
      return GraduationCap;
    case 'FileText':
      return FileText;
    case 'Users':
      return Users;
    case 'FlaskConical':
      return FlaskConical;
    case 'Award':
      return Award;
    case 'CheckCircle2':
      return CheckCircle2;
    case 'Code2':
      return Code2;
    case 'Calendar':
      return Calendar;
    case 'Sparkles':
      return Sparkles;
    case 'Building':
      return Building;
    case 'BookOpen':
    default:
      return BookOpen;
  }
}
