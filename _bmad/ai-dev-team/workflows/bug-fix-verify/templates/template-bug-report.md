# Bug Report Template

This is the template for creating comprehensive bug reports in the bug-fix-verify workflow.

---

## Bug Information

### Bug ID
`BUG-{{YYYYMMDD}}-{{SEQUENCE}}`

### Bug Title
{{Bug标题}}

### Priority
{{Urgent/High/Normal/Low}}

### Bug Type
{{Frontend Bug / Backend Bug / Infrastructure Bug}}

### Status
{{New / Todo / In Development / In Review / Closed}}

---

## Discovery Information

### Found By
{{发现人}}

### Discovery Time
{{发现时间}}

### Bug Source
{{测试发现 / 用户反馈 / 代码审查}}

### Linear Issue ID
{{Linear Story ID (if created)}}

---

## Bug Description

### Brief Description
{{Bug简要描述 - 1-2 sentences}}

### Detailed Description
{{Bug详细描述}}
{{包括Bug的背景、影响范围、严重程度说明}}

---

## Reproduction Steps

1. {{步骤1描述 - 操作1}}
2. {{步骤2描述 - 操作2}}
3. {{步骤3描述 - 操作3}}
4. {{步骤4描述 - 预期Bug出现}}
5. ... (继续添加步骤)

---

## Expected Behavior
{{描述应该发生的正确行为}}
{{包括功能和系统的预期操作}}

---

## Actual Behavior
{{描述实际发生的错误行为}}
{{包括具体表现、错误信息、异常情况}}

---

## Environment Information

| Field | Value |
|-------|-------|
| Application URL | {{应用的完整URL}} |
| Browser | {{浏览器名称和版本}} |
| Operating System | {{操作系统和版本}} |
| Test Account | {{使用的测试账号}} |
| Device | {{设备信息（如果适用）}} |

---

## Affected Component

### Component Type
{{Frontend / Backend / Database / API / Infrastructure}}

### Specific Component
{{具体组件名称}}
{{例如：User authentication module, Product list component, etc.}}

### Files/Modules Affected
- {{文件/模块1路径}}
- {{文件/模块2路径}}
- {{文件/模块3路径}}

---

## Screenshots / Recordings

### Bug Screenshots
- **截图1:** {{文件路径或描述}}
  - {{截图说明}}

- **截图2:** {{文件路径或描述}}
  - {{截图说明}}

### Video Recording (if applicable)
- **录屏文件:** {{文件路径}}
- **录屏说明:** {{说明视频展示的内容}}

---

## Additional Information

### Error Messages
```text
{{错误日志和控制台输出}}
{{包含完整的错误堆栈信息}}
```

### Browser Console Errors
```javascript
{{浏览器控制台的JavaScript/CSS错误}}
```

### Network Requests
- **Request URL:** {{请求URL}}
- **Method:** {{GET/POST/PUT/DELETE}}
- **Status Code:** {{HTTP状态码}}
- **Response:** {{响应内容或错误}}

### Related Logs
```text
{{服务器日志或应用日志}}
{{任何其他相关的日志信息}}
```

---

## Impact Assessment

### Severity
{{Critical / High / Medium / Low}}

### Affected Users
{{受影响的用户群体}}
{{例如：所有用户、特定用户组、特定角色等}}

### Frequency
{{Always / Intermittent / Rare}}

### Workaround Available
{{是 / 否}}

### Workaround Description
{{如果存在workaround，描述其内容}}

---

## Assignment Information

### Assigned To
{{开发人员名称}}

### Assigned Time
{{分配时间}}

### Team
{{开发团队名称}}

---

## Fix Information

### Fix Status
{{Not Started / In Progress / Completed}}

### Developer Notes
{{开发人员的笔记和分析}}

### Fix Description
{{修复方案的详细说明}}

### Files Modified
- {{文件1: 描述修改内容}}
- {{文件2: 描述修改内容}}
- {{文件3: 描述修改内容}}

### Code Changes
```diff
{{如果有重要的代码更改，使用diff格式显示}}
- 删除的代码
+ 新增的代码
  修改的代码
```

---

## Verification Information

### Verified By
{{验证人名称}}

### Verification Time
{{验证时间}}

### Verification Steps
1. {{验证步骤1}}
2. {{验证步骤2}}
3. {{验证步骤3}}

### Verification Result
{{PASS / FAIL}}

### Verification Notes
{{验证过程中的发现和备注}}

### Verification Screenshots
- **验证前截图:** {{截图路径}}
- **验证后截图:** {{截图路径}}

---

## Timeline

| Milestone | Date/Time | Notes |
|-----------|-----------|-------|
| Bug Discovered | {{发现时间}} | {{备注}} |
| Bug Reported | {{报告时间}} | {{备注}} |
| Bug Story Created | {{Story创建时间}} | {{备注}} |
| Assigned to Developer | {{分配时间}} | {{备注}} |
| Fix Completed | {{修复完成时间}} | {{备注}} |
| Verification Started | {{验证开始时间}} | {{备注}} |
| Bug Closed | {{关闭时间}} | {{备注}} |

---

## References

### Related Issues
- Linear Issue: {{Issue URL}} (if created)
- Related Bug: {{相关Bug ID}}
- Related Feature: {{相关功能/Story}}

### Related Documentation
- PRD: {{PRD链接}}
- Technical Spec: {{技术文档链接}}
- Design Doc: {{设计文档链接}}

---

## Comments

### Discovery Team Comments
{{发现团队的备注和建议}}

### Development Team Comments
{{开发团队的备注和分析}}

### QA Team Comments
{{QA团队的验证意见}}

### PM Comments
{{PM的备注和管理意见}}

---

## Changelog

| Date/Time | Updated By | Change Description |
|-----------|------------|-------------------|
| {{时间1}} | {{更新人1}} | {{更改描述1}} |
| {{时间2}} | {{更新人2}} | {{更改描述2}} |

---

---

### Report Metadata

- **Report Created:** {{报告创建时间}}
- **Report Last Updated:** {{最后更新时间}}
- **Report Version:** {{1.0}}
- **Report Template Version:** {{1.0}}

---

**End of Bug Report Template**

*This report was generated as part of the bug-fix-verify workflow.*
