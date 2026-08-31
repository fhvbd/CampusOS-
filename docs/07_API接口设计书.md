# CampusOS API接口设计书

版本：V1.0

---

# 一、接口规范

协议：

HTTPS

格式：

JSON

认证：

JWT Token

---

# 返回格式

成功：

{
    "code": 200,
    "message": "success",
    "data": {}
}

失败：

{
    "code": 500,
    "message": "error"
}

---

# 二、用户模块

## 用户登录

POST

/api/auth/login

请求：

{
    "student_id": "20260001",
    "password": "123456"
}

返回：

{
    "token": "xxxxx"
}

---

## 用户信息

GET

/api/user/profile

返回：

{
    "student_id": "20260001",
    "username": "张三"
}

---

# 三、课程模块

## 获取课表

GET

/api/course/list

返回：

[
    {
        "course_name":"高等数学",
        "teacher":"李老师",
        "classroom":"A101"
    }
]

---

## 获取今日课程

GET

/api/course/today

---

# 四、待办模块

## 获取待办

GET

/api/task/list

---

## 新增待办

POST

/api/task/create

请求：

{
    "title":"完成CAD作业",
    "deadline":"2026-09-01"
}

---

## 删除待办

DELETE

/api/task/delete/{id}

---

# 五、通知模块

## 获取通知

GET

/api/notice/list

---

## 通知详情

GET

/api/notice/detail/{id}

---

## 标记已读

POST

/api/notice/read/{id}

---

# 六、AI模块

（V0.5启用）

---

## PDF总结

POST

/api/ai/pdf-summary

---

## 学习规划

POST

/api/ai/study-plan

---

## 知识问答

POST

/api/ai/chat

---

# 七、系统模块

## 获取配置

GET

/api/settings

---

## 更新配置

PUT

/api/settings

---

# 八、版本控制

V0.1

用户模块

课程模块

---

V0.2

通知模块

---

V0.3

待办模块

---

V0.5

AI模块

---

# 九、安全要求

密码哈希存储

JWT认证

接口限流

异常日志记录

敏感信息脱敏
