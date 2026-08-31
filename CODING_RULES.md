# CampusOS 编码规范

版本：V1.0

---

# 通用原则

代码可读性

优先于

代码炫技

---

# 命名规范

变量：

snake_case

例：

course_name

task_deadline

---

类名：

PascalCase

例：

UserService

NoticeManager

---

# 文件命名

小写

使用下划线

例如：

course_service.py

notice_router.py

---

# 目录规范

backend

frontend

database

docs

tests

必须分离

---

# 注释规范

所有核心代码：

必须有中文注释

---

# 函数长度

不超过：

50行

---

# 文件长度

不超过：

500行

---

# API规范

统一返回：

{
  "code":200,
  "message":"success",
  "data":{}
}

---

# 数据库规范

禁止：

SELECT *

必须指定字段

---

# Git提交规范

feat:

新增功能

fix:

修复问题

docs:

文档更新

refactor:

重构

test:

测试

---

# AI开发规则

禁止直接修改数据库

禁止删除历史接口

必须兼容旧版本

---

# 开发顺序

先后端

后前端

先接口

后页面

先测试

后提交
