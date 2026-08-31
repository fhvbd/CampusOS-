import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-Memory mock state for server (resilient & ephemeral)
let userProfile = {
  student_id: '20260309108',
  username: '张明远',
  university: '华东理工大学',
  college: '信息科学与工程学院',
  major: '计算机科学与技术 (卓越班)',
  grade: '2026级',
  class_name: '计卓261班',
  gpa: 3.84,
  credits_earned: 42.5,
  credits_total: 160,
  campus_card_balance: 168.5,
  library_books_borrowed: 3,
  dormitory_room: '知行苑 7号楼 402',
  net_status: 'online',
  cas_sync_status: 'synced',
  last_sync_time: '2026-08-31 07:45',
};

// Lazy initialize Gemini API client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// API Routes
// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Auth Login
app.post('/api/auth/login', (req, res) => {
  const { student_id } = req.body;
  res.json({
    code: 200,
    message: 'success',
    data: {
      token: `jwt_token_${student_id || '20260001'}_${Date.now()}`,
    },
  });
});

// 3. User Profile
app.get('/api/user/profile', (req, res) => {
  res.json(userProfile);
});

app.put('/api/user/profile', (req, res) => {
  userProfile = { ...userProfile, ...req.body };
  res.json(userProfile);
});

// 4. AI Chat / Study Assistant
app.post('/api/ai/chat', async (req, res) => {
  const { message, context } = req.body;

  const ai = getAI();
  if (ai) {
    try {
      const systemInstruction = `你是 CampusOS 智能校园操作系统专属学习助理。你服务于中国大学生（当前学生专业：计算机科学与技术，大一秋季学期）。
你的职责是：
1. 解答课程疑难（高等数学、数据结构、计算机系统、大学物理等）；
2. 提炼课件与笔记要点（康奈尔笔记法、考试重点清单）；
3. 规划学业与作息（GPA管理、竞赛规划、奖学金申报、考研保研规划）；
4. 提供规范、专业、亲切、排版清晰的 Markdown 回答。`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\n学生提问/需求：\n${message}` }] }
        ],
      });

      const replyText = response.text || '已收到您的请求。';
      return res.json({
        code: 200,
        reply: replyText,
        suggested_actions: ['制定本周复习计划', '提炼高等数学重点考点', '查看最新教务通知'],
      });
    } catch (err: any) {
      console.warn('[Gemini API Proxy Error]', err.message);
    }
  }

  // Built-in intelligent academic engine fallback
  let fallbackReply = `### 🎓 CampusOS 智能校园解答

已为您分析关于 **"${message}"** 的相关校园与课程要点：
1. **核心概念梳理**：建议掌握核心基础定理与高频考点，多结合习题与OJ实验；
2. **复习安排建议**：可将复习拆解为 25 分钟番茄钟，优先攻克薄弱环节；
3. **校园政策提醒**：如涉及选课与奖学金申报，请务必关注教务处与学工在线的截止时间。`;

  if (message.includes('高数') || message.includes('微积分')) {
    fallbackReply = `### 📐 高等数学期末复习与考点提炼
1. **重要极限**：$\\lim_{x\\to 0}\\frac{\\sin x}{x}=1$, $\\lim_{x\\to\\infty}(1+\\frac{1}{x})^x=e$
2. **中值定理与导数应用**：罗尔定理、拉格朗日中值定理、洛必达法则结合泰勒公式
3. **不定积分与定积分**：换元法与分部积分法必考大题。`;
  } else if (message.includes('数据结构') || message.includes('算法')) {
    fallbackReply = `### 💻 数据结构与算法核心要点
1. **线性表**：单链表倒置、双向循环链表增删边界；
2. **树与二叉树**：先序/中序/后序遍历、平衡二叉树 AVL 旋转、哈夫曼编码；
3. **图论与排序**：Dijkstra 最短路算法、快速排序与堆排序的时间复杂度分析。`;
  }

  res.json({
    code: 200,
    reply: fallbackReply,
    suggested_actions: ['将此复习计划加入待办', '生成模拟考题', '查看本周对应课程'],
  });
});

async function startServer() {
  // Vite integration in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: 3000 },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CampusOS] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
