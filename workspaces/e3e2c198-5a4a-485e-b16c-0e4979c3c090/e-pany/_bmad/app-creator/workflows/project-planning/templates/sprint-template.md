# Sprint Planning Template

Use this template to structure sprint planning and tracking.

## Sprint Header

| Attribute | Value |
|-----------|-------|
| Sprint Number | # |
| Dates | [Start Date] - [End Date] |
| Duration | 2 weeks |
| Focus | [Primary goal/theme] |
| Capacity | [Team members × availability] |

## Sprint Goals

```
PO (Product Owner) Goal:
[What's the primary objective of this sprint from product perspective]

Dev Goal:
[What technical objectives need to be achieved]

Quality Goal:
[Quality targets for this sprint]
```

## Sprint Backlog

| ID | Task | Story Points | Owner | Status | Notes |
|----|------|--------------|--------|--------|-------|
| S1-001 | [Task description] | [1/2/3/5/8] | [Name] | [Todo/In Progress/Done] | [Dependencies] |
| S1-002 | [Task description] | [1/2/3/5/8] | [Name] | [Todo/In Progress/Done] | [Dependencies] |
| S1-003 | [Task description] | [1/2/3/5/8] | [Name] | [Todo/In Progress/Done] | [Dependencies] |

## Task Breakdown Examples

### S1-001: User Authentication

**Story Points**: 5
**Owner**: Atlas

**Subtasks**:
- [ ] User model and Prisma schema
- [ ] Password hashing with bcrypt
- [ ] JWT token generation
- [ ] Login endpoint
- [ ] Register endpoint
- [ ] Auth middleware
- [ ] Unit tests for auth service

**Dependencies**:
- Database setup (S1-BACKEND-001)

**Definition of Done**:
- Code reviewed and merged
- Unit tests passing (coverage > 80%)
- API documentation updated
- Demo working

### S1-002: Login UI Component

**Story Points**: 3
**Owner**: Luna

**Subtasks**:
- [ ] Design review with Luna
- [ ] Login form component
- [ ] Form validation
- [ ] API integration
- [ ] Error handling
- [ ] Responsive design

**Dependencies**:
- Auth API (S1-001)

**Definition of Done**:
- Design matches Figma
- Responsive on all breakpoints
- Error edge cases handled
- Accessibility compliant

## Daily Standup Template

```
Date: [YYYY-MM-DD]

Team Members:
1. [Name]
   - Yesterday: [What did you complete]
   - Today: [What will you work on]
   - Blockers: [Any impediments]

2. [Name]
   - Yesterday: [What did you complete]
   - Today: [What will you work on]
   - Blockers: [Any impediments]
```

## Sprint Review Template

**Demo Items**:
1. [Feature/Task]: [Description]
2. [Feature/Task]: [Description]
3. [Feature/Task]: [Description]

**Stakeholder Feedback**:
- [Feedback 1]
- [Feedback 2]
- [Feedback 3]

**Metrics**:
- Velocity: [Story points completed]
- Sprint Goal Achievement: [X%]
- Bug Count: [X bugs found and fixed]

## Sprint Retrospective Template

**What went well?**
- [Positive outcome 1]
- [Positive outcome 2]

**What could be improved?**
- [Area for improvement 1]
- [Area for improvement 2]

**Action Items**:
- [ ] [Action 1] - [Owner] - [Due Date]
- [ ] [Action 2] - [Owner] - [Due Date]

**Process Changes**:
- [Change 1]: [Rationale]
- [Change 2]: [Rationale]
