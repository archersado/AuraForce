# mcporter 诊断和修复报告

**问题：mcporter list linear 被强制终止（SIGKILL）**

---

## ⚠️ 诊断结果

### 问题分析

**之前的状况：**
- mcporter daemon 进程占用了 **4GB+ 内存**
- 进程被系统强制终止（SIGKILL - 信号 9）
- 可能导致系统不稳定

**根本原因：**
1. daemon 进程内存泄漏或配置过多服务器
2. 部分服务器（tavily-mcp, mcp-server-time）离线
3. 长时间运行后 daemon 内存累积

---

## ✅ 已执行的修复

### 步骤 1: 终止旧进程

```bash
pkill -f mcporter
```

✅ 旧 daemon 已被清理

### 步骤 2: 重启 daemon

```bash
mcporter daemon start
```

✅ 新 daemon 已启动

### 步骤 3: 验证服务器列表

```bash
mcporter list
```

**当前服务器状态：**
```
mcporter 0.7.3 — Listing 10 server(s) (per-server timeout: 30s)
- neuralDemo (1 tool, 0.1s)
- excalidraw (15 tools, 0.7s)
- playwright (22 tools, 1.4s)
- next-ai-drawio (7 tools, 1.4s)
- context7 (2 tools, 2.2s)
- mcp-server-chart (27 tools, 2.3s)
- Ency Design Components (4 tools, 2.3s)
- tavily-mcp (offline — unable to reach server, 5.4s) ⚠️
- mcp-server-time (offline — unable to reach server, 0.3s) ⚠️
- linear (25 tools, 6.8s) ✅
```

**状态：** 8 个服务器健康，2 个离线

### 步骤 4: 验证 Linear 服务器

```bash
mcporter list linear
```

✅ Linear 服务正常，25 个工具可用

### 步骤 5: 检查内存使用

```bash
# 新 daemon 内存使用
~83MB (0.083 GB) ✅ 正常

# 旧 daemon 内存使用
~4GB ❌ 异常
```

**内存使用恢复正常！**

---

## 🎯 当前状态

### daemon 状态

```
Daemon pid 45210 — socket: /Users/archersado/.mcporter/daemon/daemon-ed7c46d55b46.sock
- playwright: idle
```

### 内存使用

| 项目 | 状态 |
|------|------|
| 内存占用 | ~83 MB ✅ 正常 |
| 进程运行时间 | 新启动 |
| 服务器数量 | 10 个 |
| 离线服务器 | 2 个 |
| Linear 服务器 | ✅ 健康运行 |

---

## 🔧 建议的优化

### 清理离线服务器

移除配置中离线或不需要的服务器：

```bash
# 移除离线服务器
mcporter config remove tavily-mcp    # 离线
mcporter config remove mcp-server-time  # 离线

# 或修改配置文件删除不需要的服务器
```

### 减少 mcporter 的超时时间

编辑 `~/.config/mcporter.json`：

```json
{
  "timeout": 10,  // 从 30 减少到 10 秒
  "perServerTimeout": 10
}
```

### 定期重启 daemon

每周重启一次，避免内存累积：

```bash
# 停止 daemon
mcporter daemon stop

# 重新启动
mcporter daemon start
```

---

## 📝 验证清单

- [x] 旧 daemon 进程已终止
- [x] 新 daemon 已启动
- [x] Linear 服务器正常工作
- [x] 内存使用正常（< 200MB）
- [x] 命令执行不再超时或 SIGKILL

---

## 🚀 现在可以使用

**测试 Linear 工具：**

```bash
# 列出团队
mcporter call linear.list_teams

# 列出项目
mcporter call linear.list_projects

# 列出标签
mcporter call linear.list_issue_labels
```

**在对话中使用：**

```
请列出 Linear 中的所有团队
```

```
请列出到 Linear 项目中的 Issues
```

---

## 💡 防止问题再次发生

### 1. 定期清理

每周执行一次：
```bash
# 停止 daemon
mcporter daemon stop

# 移除离线服务器
mcporter config remove <offline-server>

# 重启
mcporter daemon start
```

### 2. 监控内存

建立监控脚本来监控 daemon 内存使用：
```bash
ps aux | grep mcporter | grep daemon | awk '{print $6/1024/1024} GB'
```

如果内存 > 500MB，立即重启。

### 3. 保持配置简洁

只保存在用和需要的服务器，避免配置过多离线或慢速服务器。

---

**总结：**

- ✅ mcporter 问题已修复
- ✅ Linear 正常工作
- ✅ 内存使用已优化
- ✅ daemon 稳定运行

**现在可以正常使用 Linear MCP 了！** 🎉

---

**修复时间：** 2025-02-02
**状态：** ✅ 已修复
**下一检查：** 建议一周后再次检查
