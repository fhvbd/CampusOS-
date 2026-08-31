import { UserProfile, Course, Notice, Task, AIStudyTool, AppSettings } from './types';

export const INITIAL_USER: UserProfile = {
  student_id: '20260309108',
  username: '张明远',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  university: '华东理工大学',
  college: '信息科学与工程学院',
  major: '计算机科学与技术 (卓越班)',
  grade: '2026级',
  class_name: '计卓261班',
  gpa: 3.84,
  credits_earned: 42.5,
  credits_total: 160,
  campus_card_balance: 168.50,
  library_books_borrowed: 3,
  dormitory_room: '知行苑 7号楼 402',
  net_status: 'online',
  cas_sync_status: 'synced',
  last_sync_time: '2026-08-31 07:45',
};

export const INITIAL_SETTINGS: AppSettings = {
  theme: 'light',
  current_week: 1,
  semester_name: '2026-2027学年 第一学期 (秋季)',
  semester_start_date: '2026-08-31',
  auto_sync_cas: true,
  notification_alert: true,
  sound_enabled: true,
  ai_model: 'Gemini 2.5 Flash',
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    course_name: '高等数学 (上)',
    course_code: 'MATH1001',
    teacher: '李建国 教授',
    classroom: '教学楼 A101',
    building: '第一教学楼',
    day_of_week: 1, // Monday
    start_period: 1,
    period_count: 2,
    start_time: '08:00',
    end_time: '09:40',
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    color: 'blue',
    credits: 5.0,
    exam_date: '2027-01-08',
    exam_time: '09:00 - 11:00',
    exam_location: 'A101 / 座位号 42',
    notes: '期末闭卷考试占比60%，平时作业与考勤占比40%。每周一前需提交上一周习题册。',
  },
  {
    id: 'c2',
    course_name: '大学物理实验 (I)',
    course_code: 'PHYS1005',
    teacher: '陈敏 副教授',
    classroom: '物理实验中心 B304',
    building: '理科实验楼 B座',
    day_of_week: 1, // Monday
    start_period: 5,
    period_count: 3,
    start_time: '13:30',
    end_time: '16:15',
    weeks: [1, 3, 5, 7, 9, 11, 13, 15],
    color: 'purple',
    credits: 2.5,
    exam_date: '2026-12-22',
    exam_time: '14:00 - 16:00',
    exam_location: 'B304 实验室',
    notes: '实验前必须完成预习报告，迟到15分钟取消当次实验资格。',
  },
  {
    id: 'c3',
    course_name: '计算机系统基础',
    course_code: 'CS1002',
    teacher: '赵志强 教授',
    classroom: '智算楼 C202',
    building: '信息科技实验大楼',
    day_of_week: 2, // Tuesday
    start_period: 3,
    period_count: 2,
    start_time: '10:00',
    end_time: '11:40',
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    color: 'indigo',
    credits: 4.0,
    exam_date: '2027-01-12',
    exam_time: '14:00 - 16:00',
    exam_location: 'C202',
    notes: '含汇编与计算机体系结构，期中安排一次上机实验考核。',
  },
  {
    id: 'c4',
    course_name: '离散数学',
    course_code: 'CS1004',
    teacher: '王晓芳 讲师',
    classroom: '教学楼 A205',
    building: '第一教学楼',
    day_of_week: 3, // Wednesday
    start_period: 1,
    period_count: 2,
    start_time: '08:00',
    end_time: '09:40',
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    color: 'cyan',
    credits: 3.5,
    exam_date: '2027-01-15',
    exam_time: '09:00 - 11:00',
    exam_location: 'A205',
    notes: '数理逻辑、集合论与图论，考研核心基础科目。',
  },
  {
    id: 'c5',
    course_name: '数据结构与算法',
    course_code: 'CS1006',
    teacher: '刘洋 教授',
    classroom: '智算中心 D101 机房',
    building: '信息科技实验大楼',
    day_of_week: 3, // Wednesday
    start_period: 5,
    period_count: 2,
    start_time: '13:30',
    end_time: '15:10',
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    color: 'emerald',
    credits: 4.5,
    exam_date: '2027-01-18',
    exam_time: '14:00 - 16:30',
    exam_location: 'D101 计算机房机考',
    notes: '每周三上机提交代码并进行在线OJ自动评测（LeetCode难度），需熟练掌握C++/Java。',
  },
  {
    id: 'c6',
    course_name: '工程制图与 CAD',
    course_code: 'ENG1008',
    teacher: '孙伟 讲师',
    classroom: '工程馆 E301',
    building: '工程实验馆',
    day_of_week: 4, // Thursday
    start_period: 3,
    period_count: 2,
    start_time: '10:00',
    end_time: '11:40',
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    color: 'amber',
    credits: 2.5,
    exam_date: '2026-12-18',
    exam_time: '10:00 - 12:00',
    exam_location: 'E301',
    notes: '大作业需提交AutoCAD三维模型图纸与装配图，考核标准严谨。',
  },
  {
    id: 'c7',
    course_name: '学术英语写作与沟通',
    course_code: 'ENG2001',
    teacher: 'Sarah Johnson',
    classroom: '外语楼 F108',
    building: '外国语学院',
    day_of_week: 5, // Friday
    start_period: 1,
    period_count: 2,
    start_time: '08:00',
    end_time: '09:40',
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    color: 'rose',
    credits: 2.0,
    exam_date: '2027-01-05',
    exam_time: '08:30 - 10:30',
    exam_location: 'F108',
    notes: '全英文授课与随堂Presentation，期末需提交一篇1500词的学术文献综述。',
  },
  {
    id: 'c8',
    course_name: '思想道德与法治',
    course_code: 'POLI1001',
    teacher: '周立明 教授',
    classroom: '阶梯教室 G101',
    building: '文科综合大楼',
    day_of_week: 5, // Friday
    start_period: 5,
    period_count: 2,
    start_time: '13:30',
    end_time: '15:10',
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    color: 'blue',
    credits: 3.0,
    exam_date: '2027-01-04',
    exam_time: '14:00 - 15:30',
    exam_location: 'G101',
    notes: '开卷考试，含社会实践调研报告一份（占总成绩30%）。',
  },
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'n1',
    title: '关于2026-2027学年秋季学期开学选课调整与缓补考安排的通知',
    category: 'academic',
    category_name: '教务处',
    source_department: '本科生教务处综合办公室',
    publish_time: '2026-08-31 07:30',
    summary: '本学期初选课退补选系统将于9月1日10:00开放至9月8日17:00，缓考与补考将于第2周周末举行，请相关同学及时核对考场名单。',
    content: `各位同学：
2026-2027学年秋季学期本科生课程补退选阶段即将开始。现将相关事宜通知如下：

一、选课调整时间安排
1. 网上退补选开放时间：2026年9月1日 10:00 至 2026年9月8日 17:00。
2. 跨专业/跨年级重修选课通道将于9月3日 09:00 正式开启。

二、2025-2026学年春季学期缓考与补考
1. 考试时间：2026年9月12日（星期六）至 9月13日（星期日）。
2. 考场查询：即日起可登录综合教务系统（http://jwxt.campus.edu.cn）查看考场及座次。
3. 注意事项：请考生携带有效身份证件与学生证入场，严禁携带手机等通讯工具。

教务处将安排专人在第一教学楼102室提供现场咨询与选课指导。`,
    is_read: false,
    is_starred: true,
    is_urgent: true,
    deadline: '2026-09-08 17:00',
    attachment_count: 2,
    attachments: [
      { name: '2026秋季学期选课手册与课程代码表.pdf', size: '2.4 MB' },
      { name: '2026年秋季补考考场与时间排定表.xlsx', size: '480 KB' },
    ],
    tags: ['选课', '补考', '教务日程'],
  },
  {
    id: 'n2',
    title: '【奖学金雷达】2026年度国家奖学金、国家励志奖学金及校长特别奖评选启动通知',
    category: 'scholarship',
    category_name: '奖学金雷达',
    source_department: '学生工作部（处）资助管理中心',
    publish_time: '2026-08-30 15:20',
    summary: '国家奖学金奖励标准每人每年10,000元，参评要求GPA排名前10%且无挂科记录。学院初审材料接收截止时间为9月15日。',
    content: `各学院、全体本科生：
根据教育部及学校奖学金评审工作有关规定，现启动2026年度本科生国家奖学金、国家励志奖学金及校长特别奖学金的评选工作。

一、奖项设置与奖励额度
1. 国家奖学金：10,000元/人，颁发教育部统一印制的荣誉证书。
2. 国家励志奖学金：6,000元/人。
3. 校长特别奖学金：15,000元/人，表彰在学科竞赛或科研创新中有重大突破的拔尖学生。

二、参评基本条件
1. 学习成绩优异：前一学年综合测评成绩与专业GPA均位列专业前10%（必修课无不及格科目）。
2. 具有突出的创新创业能力或高水平学术成果者可优先推荐。

三、申报流程
1. 个人申报：9月1日-9月10日于学工系统填写《国家奖学金申请审批表》。
2. 学院初审及公示：9月15日前完成答辩评审与5个工作日公示。`,
    is_read: false,
    is_starred: true,
    is_urgent: false,
    deadline: '2026-09-10 18:00',
    attachment_count: 3,
    attachments: [
      { name: '国家奖学金申请审批表(2026版).docx', size: '85 KB' },
      { name: '华东理工大学本科生奖学金评审综合测评细则.pdf', size: '1.8 MB' },
      { name: '证明材料汇总胶装格式规范.pdf', size: '620 KB' },
    ],
    tags: ['国奖', '学工资助', '评优评奖'],
  },
  {
    id: 'n3',
    title: '【实习雷达】2027届科技与互联网名企秋招及暑期实习双选会专场安排公告',
    category: 'internship',
    category_name: '实习雷达',
    source_department: '学生就业指导服务中心',
    publish_time: '2026-08-29 10:00',
    summary: '华为、腾讯、字节跳动、微软等50+重点用人单位将于9月18日在体育馆举行线下双选会，现场提供软件开发、算法及产品等2000+优质岗位。',
    content: `全体应届及在校同学：
为服务学生高质量充分就业与科研实践，学校定于9月中旬举办2026年首场“启航未来”大型校园秋季招聘与实习双选会。

一、时间和地点
时间：2026年9月18日（星期五）09:00 - 16:30
地点：南区体育综合馆主馆

二、参会单位亮点
本次招聘会覆盖人工智能、软件工程、智能制造、金融科技等重点行业，参会名企包括：
• 头部科技公司：华为云计算、腾讯科技、字节跳动、微软亚洲研究院、美团
• 智能汽车与硬件：大疆创新、蔚来、比亚迪研究院
• 央企科研院所：中电科、中科院软件所、航天科工

三、学生参会指引
1. 凭电子学生证或CampusOS求职码现场扫码入场。
2. 建议提前打印5-10份精简简历，着正装或得体便服参会。`,
    is_read: true,
    is_starred: false,
    is_urgent: false,
    deadline: '2026-09-18 09:00',
    attachment_count: 1,
    attachments: [
      { name: '参会企业展位分布图与岗位需求汇总表.pdf', size: '3.1 MB' },
    ],
    tags: ['秋招', '实习', '双选会'],
  },
  {
    id: 'n4',
    title: '第十四届“挑战杯”中国大学生创业计划竞赛校内选拔赛申报指南',
    category: 'competition',
    category_name: '学科竞赛',
    source_department: '共青团委员会 / 创新创业学院',
    publish_time: '2026-08-28 14:00',
    summary: '竞赛设科技创新和未来产业、乡村振兴、城市治理等5个组别。入围校赛金奖项目将获得最高5万元创客孵化基金资助及国赛直通推荐。',
    content: `各团总支、学生创客团队：
“挑战杯”中国大学生创业计划竞赛是全国最具影响力的大学生创新创业顶尖赛事之一。现将2026年校内选拔赛通知如下：

一、竞赛组别
1. 科技创新和未来产业（新一代信息技术、人工智能、高端装备等）
2. 乡村振兴和农业农村现代化
3. 社会治理和公共服务
4. 生态环保和可持续发展
5. 文化创意和区域合作

二、团队要求
每个参赛项目人数不超过10人，指导教师不超过3人。鼓励跨学院、跨专业交叉组队。

三、材料提交
请于2026年9月25日24:00前将商业计划书（BP）与答辩PPT上传至双创竞赛评审平台。`,
    is_read: true,
    is_starred: true,
    is_urgent: false,
    deadline: '2026-09-25 24:00',
    attachment_count: 2,
    attachments: [
      { name: '挑战杯商业计划书编写模板与评分标准.pdf', size: '1.2 MB' },
      { name: '校级创业孵化基金申报书.docx', size: '110 KB' },
    ],
    tags: ['挑战杯', '创新创业', '竞赛直通'],
  },
  {
    id: 'n5',
    title: '信息科学与工程学院关于开放“卓越创客实验室”工位预约与仪器借用的通知',
    category: 'college',
    category_name: '学院公告',
    source_department: '信息科学与工程学院实验中心',
    publish_time: '2026-08-27 16:30',
    summary: '信息大楼501/502实验室面向大一至大四本科生开放GPU算力集群与嵌入式开发套件预约，需通过学院导师或辅导员签署安全承诺书。',
    content: `各位同学：
为鼓励学生自主开展科研探索与学科竞赛，学院开放“卓越创客实验室（智算楼501-503）”。

1. 硬件配置：包含配备RTX 4090算力工作站24台、FPGA开发套件、示波器与3D打印机设备。
2. 开放时间：每日 08:00 - 22:30（节假日照常开放）。
3. 预约方式：通过CampusOS智能校园系统或学院官网提交申请，审核通过后刷校园卡授权门禁。`,
    is_read: true,
    is_starred: false,
    is_urgent: false,
    tags: ['实验室', '算力资源', '学院资源'],
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: '完成工程制图与 CAD 第三章轴测图绘制大作业',
    description: '完成CAD装配图纸DWG导出与PDF排版打印，注意图层线宽与标注公差规范。',
    category: 'homework',
    priority: 'high',
    deadline: '2026-09-01 23:59',
    is_completed: false,
    course_id: 'c6',
    course_name: '工程制图与 CAD',
    created_at: '2026-08-30',
    remind_before_hours: 4,
  },
  {
    id: 't2',
    title: '英语四六级历年真题听力精听与长难句背诵打卡',
    description: '完成2025年12月四六级第一套真题听力精读并记录20个高频核心生词。',
    category: 'homework',
    priority: 'medium',
    deadline: '2026-08-31 22:00',
    is_completed: false,
    course_id: 'c7',
    course_name: '学术英语写作与沟通',
    created_at: '2026-08-31',
    remind_before_hours: 2,
  },
  {
    id: 't3',
    title: '高等数学第一章极限与连续性课后习题 (A组 1-15题)',
    description: '写在习题本上，周一上课前交给学习委员，重点复习洛必达法则与泰勒展开公式。',
    category: 'homework',
    priority: 'high',
    deadline: '2026-09-02 08:00',
    is_completed: false,
    course_id: 'c1',
    course_name: '高等数学 (上)',
    created_at: '2026-08-29',
  },
  {
    id: 't4',
    title: '填报国家奖学金个人申请审批表并整理科研竞赛佐证材料',
    description: '登录学工系统填写GPA综测数据，附上ACM铜奖与计算机软考证书复印件。',
    category: 'campus',
    priority: 'high',
    deadline: '2026-09-08 17:00',
    is_completed: false,
    created_at: '2026-08-31',
  },
  {
    id: 't5',
    title: '数据结构与算法：完成单链表与双向循环链表C++模版类实现',
    description: '通过学院OJ平台前3道算法题目，并通过内存泄漏检测与边界测试。',
    category: 'homework',
    priority: 'medium',
    deadline: '2026-09-04 18:00',
    is_completed: false,
    course_id: 'c5',
    course_name: '数据结构与算法',
    created_at: '2026-08-30',
  },
  {
    id: 't6',
    title: '秋季学期教务系统选课退补选确认',
    description: '确认通识选修课《心理学与现代生活》是否已成功补选入课表。',
    category: 'campus',
    priority: 'medium',
    deadline: '2026-09-03 12:00',
    is_completed: true,
    created_at: '2026-08-28',
  },
];

export const AI_STUDY_TOOLS: AIStudyTool[] = [
  {
    id: 'tool_pdf',
    title: 'PDF / 课件速读提炼',
    icon: 'FileText',
    description: '上传或粘贴教材章节与PPT内容，自动提取核心公式、知识框架与重点概念。',
    prompt_template: '请帮我精炼以下大学课程讲义/课件的核心内容，列出：\n1. 核心概念与知识框架\n2. 关键公式与定理证明要点\n3. 期末考试常考题型与陷阱\n\n课件内容如下：\n',
    category: 'summary',
  },
  {
    id: 'tool_class_summary',
    title: '课堂笔记智能重构',
    icon: 'BookOpen',
    description: '将零散的随堂记录转化为结构清晰、条理分明的康奈尔笔记或知识卡片。',
    prompt_template: '请将我记录的随堂笔记重构为标准的康奈尔笔记格式，包含【核心线索】、【结构化详记】与【一句话总结/复习自测题】：\n\n我的笔记：\n',
    category: 'summary',
  },
  {
    id: 'tool_exam_focus',
    title: '考试重点与考点精炼',
    icon: 'Target',
    description: '输入课程名称或考试大纲，针对大学期末考生成高频考点清单与自测模拟题。',
    prompt_template: '针对大学期末考试，请为我梳理这门课程的核心考点，并给出3道典型模拟题与详细解题步骤：\n课程名称/章节：',
    category: 'exam',
  },
  {
    id: 'tool_study_plan',
    title: '个性化学习规划制定',
    icon: 'Calendar',
    description: '根据你的课表空闲时间与目标绩点（GPA），定制科学的每日/每周复习时间表。',
    prompt_template: '我目前是大一计算机系学生，目标是本学期GPA达到3.8以上，本周需要复习高等数学与数据结构。请根据我周一至周五的空闲时间，为我制定一份科学可执行的作息与学习计划。',
    category: 'plan',
  },
  {
    id: 'tool_postgrad_plan',
    title: '专升本 / 考研保研规划',
    icon: 'GraduationCap',
    description: '分析专业培养方案、学分绩点算法、竞赛加分项与升学保研全流程关键节点。',
    prompt_template: '请为我梳理计算机科学与技术专业的升学（保研/考研/专升本）规划时间线：包括大一至大四各学期应重点攻克的GPA、国家级竞赛、英语六级、科研项目等关键指标。',
    category: 'career',
  },
  {
    id: 'tool_resume_tuner',
    title: '实习简历润色与面经',
    icon: 'Briefcase',
    description: '使用STAR法则重构校园项目与学生工作经历，精准匹配名企实习岗位要求。',
    prompt_template: '请使用STAR法则（情境、任务、行动、结果）帮我润色以下项目/学生工作经历，使其更加贴合互联网大厂技术实习生的岗位要求：\n\n我的原始经历：\n',
    category: 'career',
  },
];
