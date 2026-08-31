export type TabType = 'home' | 'schedule' | 'notice' | 'notices' | 'ai' | 'profile';
export type TabKey = TabType;

export type CourseColorKey = 'blue' | 'emerald' | 'purple' | 'amber' | 'rose' | 'indigo' | 'cyan' | 'teal' | 'slate';

export interface UserProfile {
  student_id: string;
  username: string;
  avatar?: string;
  university: string;
  college: string;
  major: string;
  grade: string;
  class_name: string;
  gpa: number;
  credits_earned: number;
  credits_total: number;
  campus_card_balance: number;
  library_books_borrowed: number;
  dormitory_room: string;
  net_status: 'online' | 'offline';
  cas_sync_status: 'synced' | 'syncing' | 'error';
  last_sync_time: string;
}

export interface Course {
  id: string;
  course_name: string;
  course_code?: string;
  teacher: string;
  classroom: string;
  building: string;
  day_of_week: number; // 1 = Monday, 7 = Sunday
  start_period: number; // 1 to 10
  period_count: number; // usually 2 or 3
  start_time: string; // e.g., "08:00"
  end_time: string; // e.g., "09:40"
  weeks: number[]; // e.g. [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
  color: string; // theme color key (e.g. "blue", "indigo", "emerald", "amber", "rose", "purple", "cyan")
  credits: number;
  exam_date?: string;
  exam_time?: string;
  exam_location?: string;
  notes?: string;
}

export type NoticeCategory = 'all' | 'academic' | 'college' | 'competition' | 'scholarship' | 'internship';

export interface Notice {
  id: string;
  title: string;
  category: NoticeCategory;
  category_name: string;
  source_department: string;
  publish_time: string;
  summary: string;
  content: string;
  is_read: boolean;
  is_starred: boolean;
  is_urgent?: boolean;
  deadline?: string;
  attachment_count?: number;
  attachments?: { name: string; size: string; url?: string }[];
  tags?: string[];
}

export type TaskCategory = 'homework' | 'exam' | 'campus' | 'personal' | 'notice' | 'project';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  deadline: string; // YYYY-MM-DD or YYYY-MM-DD HH:mm
  is_completed: boolean;
  completed?: boolean;
  course_id?: string;
  course_name?: string;
  created_at: string;
  remind_before_hours?: number;
  estimated_hours?: number;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  thought?: string;
  suggested_actions?: string[];
}

export interface AIStudyTool {
  id: string;
  title: string;
  icon: string;
  description: string;
  prompt_template: string;
  category: 'summary' | 'exam' | 'plan' | 'career';
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'paper';
  current_week: number;
  semester_name: string;
  semester_start_date: string;
  auto_sync_cas: boolean;
  notification_alert: boolean;
  sound_enabled: boolean;
  ai_model: string;
}
