import { Course, Notice, Task, UserProfile, AppSettings, ChatMessage } from '../types';
import { INITIAL_USER, INITIAL_COURSES, INITIAL_NOTICES, INITIAL_TASKS, INITIAL_SETTINGS } from '../mockData';

const STORAGE_KEYS = {
  USER: 'campus_os_user_v1',
  COURSES: 'campus_os_courses_v1',
  NOTICES: 'campus_os_notices_v1',
  TASKS: 'campus_os_tasks_v1',
  SETTINGS: 'campus_os_settings_v1',
  CHAT: 'campus_os_chat_v1',
};

// Safe LocalStorage helpers
function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`[CampusOS] Error loading ${key} from storage:`, e);
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[CampusOS] Error saving ${key} to storage:`, e);
  }
}

export const CampusAPI = {
  // User Profile
  getUserProfile: async (): Promise<UserProfile> => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        saveStorage(STORAGE_KEYS.USER, data);
        return data;
      }
    } catch (e) {
      // fallback to local cache
    }
    return loadStorage<UserProfile>(STORAGE_KEYS.USER, INITIAL_USER);
  },

  updateUserProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    const current = loadStorage<UserProfile>(STORAGE_KEYS.USER, INITIAL_USER);
    const updated = { ...current, ...profile };
    saveStorage(STORAGE_KEYS.USER, updated);
    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      // offline silent ok
    }
    return updated;
  },

  // Courses
  getCourses: async (): Promise<Course[]> => {
    try {
      const res = await fetch('/api/course/list');
      if (res.ok) {
        const data = await res.json();
        saveStorage(STORAGE_KEYS.COURSES, data);
        return data;
      }
    } catch (e) {
      // fallback
    }
    return loadStorage<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
  },

  saveCourse: async (course: Course): Promise<Course[]> => {
    const courses = loadStorage<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    const index = courses.findIndex(c => c.id === course.id);
    let updated: Course[];
    if (index >= 0) {
      updated = [...courses];
      updated[index] = course;
    } else {
      updated = [...courses, course];
    }
    saveStorage(STORAGE_KEYS.COURSES, updated);
    try {
      await fetch('/api/course/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });
    } catch (e) {}
    return updated;
  },

  deleteCourse: async (id: string): Promise<Course[]> => {
    const courses = loadStorage<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    const updated = courses.filter(c => c.id !== id);
    saveStorage(STORAGE_KEYS.COURSES, updated);
    try {
      await fetch(`/api/course/delete/${id}`, { method: 'DELETE' });
    } catch (e) {}
    return updated;
  },

  // Notices
  getNotices: async (): Promise<Notice[]> => {
    try {
      const res = await fetch('/api/notice/list');
      if (res.ok) {
        const data = await res.json();
        saveStorage(STORAGE_KEYS.NOTICES, data);
        return data;
      }
    } catch (e) {}
    return loadStorage<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
  },

  toggleNoticeRead: async (id: string): Promise<Notice[]> => {
    const notices = loadStorage<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
    const updated = notices.map(n => n.id === id ? { ...n, is_read: !n.is_read } : n);
    saveStorage(STORAGE_KEYS.NOTICES, updated);
    try {
      await fetch(`/api/notice/read/${id}`, { method: 'POST' });
    } catch (e) {}
    return updated;
  },

  toggleNoticeStar: async (id: string): Promise<Notice[]> => {
    const notices = loadStorage<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
    const updated = notices.map(n => n.id === id ? { ...n, is_starred: !n.is_starred } : n);
    saveStorage(STORAGE_KEYS.NOTICES, updated);
    return updated;
  },

  // Tasks
  getTasks: async (): Promise<Task[]> => {
    try {
      const res = await fetch('/api/task/list');
      if (res.ok) {
        const data = await res.json();
        saveStorage(STORAGE_KEYS.TASKS, data);
        return data;
      }
    } catch (e) {}
    return loadStorage<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  },

  saveTask: async (task: Task): Promise<Task[]> => {
    const tasks = loadStorage<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    const index = tasks.findIndex(t => t.id === task.id);
    let updated: Task[];
    if (index >= 0) {
      updated = [...tasks];
      updated[index] = task;
    } else {
      updated = [task, ...tasks];
    }
    saveStorage(STORAGE_KEYS.TASKS, updated);
    try {
      await fetch('/api/task/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
    } catch (e) {}
    return updated;
  },

  toggleTaskCompleted: async (id: string): Promise<Task[]> => {
    const tasks = loadStorage<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    const updated = tasks.map(t => t.id === id ? { ...t, is_completed: !t.is_completed } : t);
    saveStorage(STORAGE_KEYS.TASKS, updated);
    return updated;
  },

  deleteTask: async (id: string): Promise<Task[]> => {
    const tasks = loadStorage<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    const updated = tasks.filter(t => t.id !== id);
    saveStorage(STORAGE_KEYS.TASKS, updated);
    try {
      await fetch(`/api/task/delete/${id}`, { method: 'DELETE' });
    } catch (e) {}
    return updated;
  },

  // Settings
  getSettings: async (): Promise<AppSettings> => {
    return loadStorage<AppSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  saveSettings: async (settings: AppSettings): Promise<AppSettings> => {
    saveStorage(STORAGE_KEYS.SETTINGS, settings);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
    } catch (e) {}
    return settings;
  },

  // Reset to initial demo dataset
  resetAllData: () => {
    saveStorage(STORAGE_KEYS.USER, INITIAL_USER);
    saveStorage(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    saveStorage(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
    saveStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    saveStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  // Import and Merge JSON Data
  importAndMergeData: async (backupData: any): Promise<{
    user: UserProfile;
    settings: AppSettings;
    courses: Course[];
    tasks: Task[];
    notices: Notice[];
    stats: {
      addedCourses: number;
      updatedCourses: number;
      addedTasks: number;
      updatedTasks: number;
      addedNotices: number;
      updatedNotices: number;
    };
  }> => {
    // 1. Current data
    const currentUser = loadStorage<UserProfile>(STORAGE_KEYS.USER, INITIAL_USER);
    const currentCourses = loadStorage<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    const currentNotices = loadStorage<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
    const currentTasks = loadStorage<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    const currentSettings = loadStorage<AppSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);

    // 2. User & Settings Merge
    const mergedUser: UserProfile = backupData.user
      ? { ...currentUser, ...backupData.user }
      : currentUser;
    const mergedSettings: AppSettings = backupData.settings
      ? { ...currentSettings, ...backupData.settings }
      : currentSettings;

    // 3. Courses Merge
    let addedCourses = 0;
    let updatedCourses = 0;
    const courseMap = new Map<string, Course>();
    currentCourses.forEach(c => courseMap.set(c.id, c));

    if (Array.isArray(backupData.courses)) {
      backupData.courses.forEach((c: Course) => {
        if (c && c.id) {
          if (courseMap.has(c.id)) {
            updatedCourses++;
          } else {
            addedCourses++;
          }
          courseMap.set(c.id, { ...courseMap.get(c.id), ...c });
        }
      });
    }
    const mergedCourses = Array.from(courseMap.values());

    // 4. Tasks Merge
    let addedTasks = 0;
    let updatedTasks = 0;
    const taskMap = new Map<string, Task>();
    currentTasks.forEach(t => taskMap.set(t.id, t));

    if (Array.isArray(backupData.tasks)) {
      backupData.tasks.forEach((t: Task) => {
        if (t && t.id) {
          if (taskMap.has(t.id)) {
            updatedTasks++;
          } else {
            addedTasks++;
          }
          taskMap.set(t.id, { ...taskMap.get(t.id), ...t });
        }
      });
    }
    const mergedTasks = Array.from(taskMap.values());

    // 5. Notices Merge
    let addedNotices = 0;
    let updatedNotices = 0;
    const noticeMap = new Map<string, Notice>();
    currentNotices.forEach(n => noticeMap.set(n.id, n));

    if (Array.isArray(backupData.notices)) {
      backupData.notices.forEach((n: Notice) => {
        if (n && n.id) {
          if (noticeMap.has(n.id)) {
            updatedNotices++;
          } else {
            addedNotices++;
          }
          noticeMap.set(n.id, { ...noticeMap.get(n.id), ...n });
        }
      });
    }
    const mergedNotices = Array.from(noticeMap.values());

    // 6. Save to LocalStorage
    saveStorage(STORAGE_KEYS.USER, mergedUser);
    saveStorage(STORAGE_KEYS.SETTINGS, mergedSettings);
    saveStorage(STORAGE_KEYS.COURSES, mergedCourses);
    saveStorage(STORAGE_KEYS.TASKS, mergedTasks);
    saveStorage(STORAGE_KEYS.NOTICES, mergedNotices);

    // 7. Sync online endpoints silently if possible
    try {
      if (backupData.user) {
        await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mergedUser),
        });
      }
      if (backupData.settings) {
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mergedSettings),
        });
      }
    } catch (e) {}

    return {
      user: mergedUser,
      settings: mergedSettings,
      courses: mergedCourses,
      tasks: mergedTasks,
      notices: mergedNotices,
      stats: {
        addedCourses,
        updatedCourses,
        addedTasks,
        updatedTasks,
        addedNotices,
        updatedNotices,
      },
    };
  },

  // AI Chat and Tool Request
  sendAIChat: async (message: string, context?: any): Promise<{ reply: string; suggested_actions?: string[] }> => {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          reply: data.reply || data.data?.reply || '已收到您的请求。',
          suggested_actions: data.suggested_actions,
        };
      }
    } catch (e) {
      console.warn('[CampusOS AI] Server API error, using built-in engine', e);
    }

    // Built-in intelligent campus engine response fallback
    return generateFallbackAIResponse(message, context);
  },
};

function generateFallbackAIResponse(message: string, context?: any): { reply: string; suggested_actions?: string[] } {
  const lower = message.toLowerCase();

  if (message.includes('高数') || message.includes('数学') || message.includes('微积分')) {
    return {
      reply: `### 📐 高等数学复习与考点精析

根据教学进度与往年大纲，高等数学的核心考点包括：
1. **极限与连续性**：掌握洛必达法则、重要极限 $\\lim_{x \\to 0}\\frac{\\sin x}{x}=1$、等价无穷小替换。
2. **微分中值定理**：罗尔定理、拉格朗日中值定理在方程根与不等式证明中的综合应用。
3. **不定积分与定积分**：换元积分法（三角代换/分部积分法）是必考大题。

💡 **复习建议**：
• 建议每天抽 45 分钟刷课后 A 组习题；
• 重点注意易错点：分段函数在分界点处的可导性判定。`,
      suggested_actions: ['添加高数刷题到待办', '生成高数重点公式速记卡', '查看本周高数课程安排'],
    };
  }

  if (message.includes('数据结构') || message.includes('算法') || message.includes('链表') || message.includes('树') || message.includes('排序')) {
    return {
      reply: `### 💻 数据结构与算法核心要点

针对计算机专业核心必考课程《数据结构与算法》：
1. **线性结构**：单链表倒置、双向链表插入/删除、循环队列满/空判别条件。
2. **树与二叉树**：前中后序遍历递归与非递归写法、二叉搜索树（BST）、平衡树（AVL）平衡因子计算、哈夫曼编码。
3. **图论算法**：Dijkstra 最短路径、Kruskal/Prim 最小生成树、拓扑排序与关键路径（AOE网）。

🛠️ **实验提示**：OJ平台在线评测注意处理空指针及边界 $n=0, n=1$ 的情况。`,
      suggested_actions: ['创建OJ算法打卡任务', '总结二叉树非递归遍历模板', '生成数据结构期末题库'],
    };
  }

  if (message.includes('奖学金') || message.includes('国奖') || message.includes('评优')) {
    return {
      reply: `### 🏆 校园奖学金申报与评审全景指引

1. **国家奖学金 (10,000元/人)**：
   • 核心门槛：前一学年综合测评成绩与专业 GPA 均在前 10%，无任何不及格科目。
   • 关键加分项：国家级学科竞赛（如 ACM-ICPC、挑战杯、互联网+、数学建模等）、高水平论文或发明专利。
2. **国家励志奖学金 (6,000元/人)**：面向通过家庭经济困难认定的品学兼优学生。
3. **申报时间节点**：个人网上申报截止 9月10日 18:00，请提前准备好综测得分表与佐证扫描件！`,
      suggested_actions: ['打开奖学金评选通知详情', '将奖学金材料准备加入待办', '查询当前GPA与学分排名'],
    };
  }

  if (message.includes('考研') || message.includes('保研') || message.includes('专升本') || message.includes('规划')) {
    return {
      reply: `### 🎓 计算机/工科专业升学全流程规划指南

**大一阶段（打牢基石）**：
• 守住 GPA 核心线（目标 ≥ 3.8），高等数学、大学物理、程序设计等核心课千万不能掉队；
• 争取大一上学期一次性高分通过英语四级（目标 550+）。

**大二阶段（竞赛与进阶）**：
• 积极组队参加国家级学科竞赛（蓝桥杯、数学建模、智能车竞赛）；
• 尝试申请大学生创新创业训练计划（大创）项目，进入学院科研实验室。

**大三至大四（冲刺保研/统考）**：
• 5-7月准备各大高校夏令营与推免资格确认；
• 统考同学在 3月 前完成数学一/专业课第一轮全景复习。`,
      suggested_actions: ['制定本学期GPA冲刺计划', '查看实验室预约公告', '规划英语四六级备考日程'],
    };
  }

  return {
    reply: `### 🤖 CampusOS 智能校园助手

您好！我是您的智能校园学习与生活助手。我可以为您提供以下服务：
- 📚 **课程与复习**：课程重难点提炼、课件速读、考点模拟题生成
- 📅 **学习规划**：基于您的课表定制专属作息与周复习时间表
- 🏛️ **校园政策解答**：学分认定、选课规则、奖学金评定细则、补考流程
- 💼 **竞赛与求职**：挑战杯商业计划书、实习简历 STAR 法则润色

您可以直接向我提问，或点击上方的快捷功能卡片开始！`,
    suggested_actions: ['为我制定本周学习计划', '提炼高等数学考试重点', '查看最新教务通知'],
  };
}
