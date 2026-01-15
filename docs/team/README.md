# Team Collaboration Hub

**Project**: AuraForce
**Last Updated**: 2026-01-07
**Team**: PM + Dev + QA

---

## Welcome to the Team!

This is your central hub for all team collaboration documentation. Here you'll find processes, guidelines, and resources to help you work effectively as a cross-functional team.

---

## Quick Links

| Document | Purpose | Target |
|----------|---------|--------|
| [Sprint 1 Plan](./sprint-1-plan.md) | Current sprint goals and timeline | All |
| [Development Standards](./development-standards.md) | Coding conventions and patterns | Dev |
| [Testing Guidelines](./testing-guidelines.md) | Testing processes and standards | QA/Dev |
| [Story 0.1 - Team Formation](../../_bmad-output/implementation-artifacts/stories/0-1-team-formation-and-project-management.md) | Team roles and responsibilities | All |
| [Daily Standup Agenda](#daily-standup-agenda) | Daily sync meeting format | All |
| [Communication Protocol](#communication-protocol) | Team communication rules | All |

---

## Team Structure

### Project Manager (PM)
- **Responsible for**: Sprint planning, story assignment, progress tracking
- **Key Documents**: Sprint status, sprint plans, epic tracking
- **Deliverables**: Sprint goals met, stories completed, team velocity optimized

### Development Engineer (Dev)
- **Responsible for**: Code implementation, testing, documentation
- **Key Documents**: Development standards, dev agent records
- **Deliverables**: Working features, passing tests, code reviewed

### Testing Engineer (QA)
- **Responsible for**: Test planning, execution, quality reporting
- **Key Documents**: Test plans, test results, bug reports
- **Deliverables**: Validated stories, quality metrics, bug fixes verified

---

## Current Sprint Status

### Sprint 1: Epic 3 Completion
- **Goal**: Complete Claude Code Graphical Interface
- **Duration**: 2 weeks (10 business days)
- **Status**: In Progress
- **Stories**: 4 remaining (3.4, 3.5, 3.6, 3.7)

### Latest Status
Check `sprint-status.yaml` for real-time status:
```bash
cat _bmad-output/implementation-artifacts/sprint-status.yaml
```

---

## Daily Standup Agenda

**Time**: 10:00 AM daily (30 minutes max)
**Attending**: PM, Dev, QA

### Format

```markdown
## Daily Standup - [Date]

### Yesterday
- **[PM]**: Story progress updates, any decisions made
- **[Dev]**: What was implemented, any technical challenges
- **[QA]**: What was tested, any bugs found

### Today
- **[PM]**: Story assignments, priorities, any team coordination
- **[Dev]**: Planned implementation work, tasks for today
- **[QA]**: Planned testing activities, test cases to write/run

### Blockers
- Issue | Owner | Status | Expected Resolution
-------|-------|--------|---------------------
| [Description] | @[Owner] | [Active/Resolved] | [Timeline]
```

### Example

```markdown
## Daily Standup - 2026-01-07

### Yesterday
- **[PM]**: Sprint 1 kicked off, stories 3.4-3.7 assigned
- **[Dev]**: Implemented session database models for Story 3.4
- **[QA]**: Setup testing framework (Jest + Playwright)

### Today
- **[PM]**: Review Story 3.4 progress, prepare Story 3.5 handoff
- **[Dev]**: Complete Story 3.4 session CRUD operations
- **[QA]**: Write unit tests for session models, prepare Story 3.4 test plan

### Blockers
- None today!
```

---

## Communication Protocol

### Synchronous Communication

**Daily Standup**: 10:00 AM, 30 minutes
- Purpose: Sync on progress, identify blockers, plan today's work
- Format: See [Daily Standup Agenda](#daily-standup-agenda)

**Sprint Review**: Every 2 weeks, 1 hour
- Purpose: Demo completed features, discuss lessons learned
- Attendees: All team members + stakeholders

**Sprint Retrospective**: Every 2 weeks, 1 hour
- Purpose: Process improvement, team feedback
- Attending: All team members

### Asynchronous Communication

**Status Updates**: Update sprint-status.yaml daily
- PM: Story state transitions, epic status
- Dev: Implementation progress, technical issues
- QA: Test results, bug reports

**Documentation**: Update relevant docs as work progresses
- Dev: Dev Agent Records in story files
- QA: Test plans and results
- PM: Sprint progress and planning docs

**Urgent Issues**: Direct communication for critical blockers
- Response time: Within 1 hour during work hours

### Handoff Process

**Dev → QA Handoff**

When a developer completes a story:
1. [ ] Story marked as `review` in sprint-status.yaml
2. [ ] Dev Agent Record completed
3. [ ] TypeScript passes: `npm run type-check`
4. [ ] ESLint passes: `npm run lint`
5. [ ] Tests pass: `npm test`
6. [ ] Notify QA team

**QA → PM Handoff**

When testing completes:
1. [ ] Test plan documented
2. [ ] All acceptance criteria validated
3. [ ] Test results with pass/fail status
4. [ ] Any bugs reported with severity
5. [ ] Recommendation (Pass/Fail) provided

**Bug Reporting → Dev**

When bugs found:
1. [ ] Bug report created using [template](#bug-report-template)
2. [ ] Severity assigned
3. [ ] Assignee tagged
4. [ ] Developer acknowledges and estimates fix

---

## Story Workflow

### Story States

```
backlog → ready-for-dev → in-progress → review → done
```

### Role Responsibilities by Story State

| State | PM | Dev | QA |
|-------|----|-----|-----|
| backlog | Plan & prioritize | - | - |
| ready-for-dev | Assign story | Review & estimate | Review & plan |
| in-progress | Monitor & unblock | Implement | Prepare tests |
| review | Review results | Fix issues | Validate ACs |
| done | Close & track | - | - |

### Developer Workflow

1. **Pick up story**: Read story file, review ACs
2. **Implement**: Code, write tests, update documentation
3. **Pre-commit checks**: type-check, lint, test
4. **Move to review**: Update sprint-status.yaml to `review`
5. **Code review**: Run BMAD code-review workflow
6. **Fix feedback**: Address issues from review
7. **Complete**: Move to `done` when QA validates

### QA Workflow

1. **Plan**: Create test plan based on ACs
2. **Prep**: Setup test data, write test cases
3. **Execute**: Run tests, document results
4. **Report**: Document bugs, quality metrics
5. **Validate**: Verify fixes, re-test if needed
6. **Recommend**: Provide pass/fail recommendation

---

## Bug Report Template

```markdown
## Bug Report

### Description
[Clear description of the bug]

### Severity
[Critical/High/Medium/Low]

### Affected Story
[Story ID: Story X.Y]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Browser/OS: [Details]
- Screenshots: [Attach if applicable]
- Logs: [Attach if applicable]

### Test Coverage
[Is there a test for this?]

### Assignee
@[Development Engineer]

### Related Acceptance Criteria
[Which AC(s) does this affect?]
```

---

## Team Velocities & Metrics

### Velocity Tracking

Track story points or stories per sprint to establish team velocity.

| Sprint | Stories Completed | Days | Velocity (stories/day) |
|--------|------------------|------|----------------------|
| Sprint 1 | 4 | 10 | TBD |

### Quality Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Test Coverage | ≥ 80% | TBD |
| Pass Rate | ≥ 95% | TBD |
| Bug Count (per story) | < 2 | TBD |
| Code Review Pass | First pass | TBD |

---

## Risk Management

### Active Risks

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| Story 3.6 complexity | Medium | High | Early start, split if needed | @Dev |
| WebSocket instability | Low | Medium | Robust error handling | @Dev |
| Database migration issues | Low | Medium | Dev environment first | @Dev |
| Testing framework gaps | Medium | Medium | Early setup, document gaps | @QA |

### Escalation Path

1. **Identify Risk**: Report in daily standup
2. **Assess**: Team discusses mitigation approach
3. **Owner**: Assign responsible team member
4. **Monitor**: Track risk status daily
5. **Resolve**: Document resolution lessons learned

---

## Sprint Retrospective Template

```markdown
## Sprint Retrospective - Sprint [N]

### What Went Well
- [Success 1]
- [Success 2]

### What Didn't Go Well
- [Issue 1]
- [Issue 2]

### What to Try Next Sprint
- [Improvement 1]
- [Improvement 2]

### Action Items
| Item | Owner | Due Date |
|------|-------|----------|
| [Action] | @[Owner] | [Date] |
```

---

## Onboarding Checklist

For New Team Members:

### Project Manager
- [ ] Read [Story 0.1](../../_bmad-output/implementation-artifacts/stories/0-1-team-formation-and-project-management.md)
- [ ] Review [Sprint 1 Plan](./sprint-1-plan.md)
- [ ] Understand [sprint-status.yaml](../../_bmad-output/implementation-artifacts/sprint-status.yaml)
- [ ] Review [epics.md](../../_bmad-output/epics.md)

### Development Engineer
- [ ] Read [Development Standards](./development-standards.md)
- [ ] Read [Testing Guidelines](./testing-guidelines.md)
- [ ] Setup local development environment
- [ ] Run `npm install`, `npm run dev`
- [ ] Review [project-context.md](../../_bmad-output/project-context.md)

### Testing Engineer
- [ ] Read [Testing Guidelines](./testing-guidelines.md)
- [ ] Review [Development Standards](./development-standards.md)
- [ ] Setup testing environment
- [ ] Run `npm test`, `npx playwright test`
- [ ] Review test utilities in `src/lib/test-utils.ts`

---

## Resource Directory

### Core Documentation
- [Product Requirements](../../_bmad-output/prd.md)
- [Architecture](../../_bmad-output/architecture.md)
- [Project Context](../../_bmad-output/project-context.md)
- [Epic Breakdown](../../_bmad-output/epics.md)
- [Sprint Status](../../_bmad-output/implementation-artifacts/sprint-status.yaml)

### Story Files
Located in `_bmad-output/implementation-artifacts/stories/`

### Implementation Artifacts
- Test results: `_bmad-output/test-results/`
- Code review reports: `_bmad-output/code-reviews/`
- Quality reports: `_bmad-output/quality-reports/`

---

## Contact & Support

### Questions?
- **Process/Sprints**: Contact Project Manager
- **Technical/Code**: Contact Development Engineer
- **Testing/QA**: Contact Testing Engineer

### Blocking Issues?
Report immediately in:
- Daily standup (next day)
- Direct communication (if urgent)

---

## Document Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-01-07 | Initial team documentation | PM |
| | | |
| | | |
