import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function formatTimeAgo(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return '刚刚';
  if (diffMinutes < 60) return `${diffMinutes}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  return formatDate(dateString);
}

export function getDayName(dayIndex: number): string {
  const days = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  return days[dayIndex] || `周${dayIndex}`;
}

export function getFullDayName(dayIndex: number): string {
  const days = ['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
  return days[dayIndex] || `星期${dayIndex}`;
}

export const PERIOD_TIMES = [
  { period: 1, start: '08:00', end: '08:45', section: '上午' },
  { period: 2, start: '08:55', end: '09:40', section: '上午' },
  { period: 3, start: '10:00', end: '10:45', section: '上午' },
  { period: 4, start: '10:55', end: '11:40', section: '上午' },
  { period: 5, start: '13:30', end: '14:15', section: '下午' },
  { period: 6, start: '14:25', end: '15:10', section: '下午' },
  { period: 7, start: '15:30', end: '16:15', section: '下午' },
  { period: 8, start: '16:25', end: '17:10', section: '下午' },
  { period: 9, start: '18:30', end: '19:15', section: '晚上' },
  { period: 10, start: '19:25', end: '20:10', section: '晚上' },
];

export const COURSE_COLOR_MAP: Record<string, { bg: string; text: string; border: string; badge: string; lightBg: string }> = {
  blue: {
    bg: 'bg-blue-500 text-white',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    lightBg: 'bg-blue-50 border-blue-200 text-blue-900',
  },
  indigo: {
    bg: 'bg-indigo-500 text-white',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-800',
    lightBg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
  },
  emerald: {
    bg: 'bg-emerald-500 text-white',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800',
    lightBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  },
  amber: {
    bg: 'bg-amber-500 text-white',
    text: 'text-amber-700',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
    lightBg: 'bg-amber-50 border-amber-200 text-amber-900',
  },
  rose: {
    bg: 'bg-rose-500 text-white',
    text: 'text-rose-700',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-800',
    lightBg: 'bg-rose-50 border-rose-200 text-rose-900',
  },
  purple: {
    bg: 'bg-purple-500 text-white',
    text: 'text-purple-700',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-800',
    lightBg: 'bg-purple-50 border-purple-200 text-purple-900',
  },
  cyan: {
    bg: 'bg-cyan-500 text-white',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    badge: 'bg-cyan-100 text-cyan-800',
    lightBg: 'bg-cyan-50 border-cyan-200 text-cyan-900',
  },
};
