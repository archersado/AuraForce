# Team Documentation Index

**AuraForce Team** - Version 1.0

---

## Quick Start

New to the team? Start here:
1. Read [Team Collaboration Hub](./README.md) - Overview of everything
2. Read your role's specific documentation below
3. Review [Sprint 1 Plan](./sprint-1-plan.md)

---

## Documentation by Role

### For Project Managers
- [Story 0.1 - Team Formation & Project Management](../_bmad-output/implementation-artifacts/stories/0-1-team-formation-and-project-management.md)
  - PM responsibilities and workflows
  - Sprint planning and story management
  - Team coordination

### For Development Engineers
- [Development Standards](./development-standards.md)
  - TypeScript strict mode requirements
  - Code structure and patterns
  - Component development guidelines
  - API development standards
  - Git workflow and pre-commit hooks

### For Testing Engineers
- [Testing Guidelines](./testing-guidelines.md)
  - Unit testing with Jest
  - Integration testing patterns
  - E2E testing with Playwright
  - Test planning and reporting
  - Bug reporting standards

---

## Planning & Tracking

| Document | Description | Last Updated |
|----------|-------------|--------------|
| [Sprint 1 Plan](./sprint-1-plan.md) | Current sprint goals and timeline | 2026-01-07 |
| [epics.md](../_bmad-output/epics.md) | All epics and stories breakdown | 2026-01-04 |
| [sprint-status.yaml](../_bmad-output/implementation-artifacts/sprint-status.yaml) | Real-time story status | 2026-01-04 |

---

## Core Project Documentation

| Document | Description | Location |
|----------|-------------|----------|
| Product Requirements | PRD with all business requirements | `_bmad-output/prd.md` |
| Architecture | Technical architecture decisions | `_bmad-output/architecture.md` |
| Project Context | Dev guidelines and patterns | `_bmad-output/project-context.md` |
| WolfGaze Design System | UI design specifications | `docs/mvp/wolfgaze-design-system.md` |

---

## Story Files

Located in: `_bmad-output/implementation-artifacts/stories/`

### Completed Stories ✅
- Epic 1 (Foundation): Stories 1.1-1.7 (7 stories)
- Epic 2 (Auth): Stories 2.1-2.9 (9 stories)
- Epic 3 (in progress): Stories 3.1-3.3 (3 stories)

### In Progress 🔄
- Epic 3: Stories 3.4-3.7 (4 stories)

### Backlog 📋
- Epic 4-12: Stories 4.1-12.5 (52 stories)

---

## Process Templates

### Handoff Templates

**Dev → QA Handoff Checklist:**
```markdown
- [ ] Story marked as 'review'
- [ ] Dev Agent Record complete
- [ ] TypeScript passes
- [ ] ESLint passes
- [ ] Tests passing
- [ ] QA notified
```

**Test Plan Template:**
See [Testing Guidelines - Test Planning](./testing-guidelines.md#test-planning)

**Bug Report Template:**
See [Team Hub - Bug Report Template](./README.md#bug-report-template)

---

## Tools & Commands

### For PM
```bash
# View sprint status
cat _bmad-output/implementation-artifacts/sprint-status.yaml

# View latest plan
cat docs/team/sprint-1-plan.md
```

### For Dev
```bash
# Type check
npm run type-check

# Lint
npm run lint

# Run tests
npm test

# Build
npm run build
```

### For QA
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run E2E tests
npx playwright test

# Run E2E tests in headed mode
npx playwright test --headed
```

---

## Communication Rituals

### Daily Standup
- **When**: 10:00 AM daily (30 min)
- **Format**: Yesterday / Today / Blockers
- **Where**: See [Daily Standup Agenda](./README.md#daily-standup-agenda)

### Sprint Review
- **When**: Every 2 weeks (1 hour)
- **Purpose**: Demo completed features
- **Where**: TBD

### Sprint Retrospective
- **When**: Every 2 weeks (1 hour)
- **Purpose**: Process improvements
- **Where**: TBD

---

## Metrics & Reports

### Quality Metrics
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Test Coverage | ≥ 80% | `npm test -- --coverage` |
| Pass Rate | ≥ 95% | Test output |
| Bug Density | < 5/1000 LOC | Bug tracker |

### Velocity Metrics
| Metric | How to Track | Where |
|--------|-------------|-------|
| Stories per Sprint | sprint-status.yaml | After each sprint |
| Days to Complete | Story logs | Dev Agent Records |

---

## Quick Reference

### Story State Transitions
```
backlog → ready-for-dev → in-progress → review → done
```

### Severity Levels
- **Critical**: App crash or data loss (< 4 hours response)
- **High**: Major feature broken (< 1 day response)
- **Medium**: Feature partially broken (< 2 days response)
- **Low**: Minor issues (< 3 days response)

### File Naming Conventions
- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Tests: `[Component].test.tsx`
- E2E Tests: `[feature].spec.ts`

---

## Help & Support

### Who to Contact
| Issue | Contact |
|-------|---------|
| Sprint/Story questions | Project Manager |
| Code/Technical issues | Development Engineer |
| Testing/QA issues | Testing Engineer |
| Blocking/critical issues | Direct communication |

### Getting Help
1. Check relevant documentation
2. Ask in daily standup
3. Direct communication for urgent issues

---

## Document Updates

| Document | Last Updated | Updated By |
|----------|--------------|------------|
| README.md | 2026-01-07 | PM |
| sprint-1-plan.md | 2026-01-07 | PM |
| development-standards.md | 2026-01-07 | Dev |
| testing-guidelines.md | 2026-01-07 | QA |

---

**Last Updated**: 2026-01-07
**Version**: 1.0
**Maintained By**: AuraForce Team
