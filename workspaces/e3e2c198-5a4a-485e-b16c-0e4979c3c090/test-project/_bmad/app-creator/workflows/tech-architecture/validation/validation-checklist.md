# Tech Architecture Workflow Validation

Validation rules and quality checks for the Tech Architecture workflow.

## Workflow Validation Standards

### Frontmatter Validation
The output file frontmatter MUST include these fields:

```yaml
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]  # All steps must be listed
lastStep: 'complete'                        # Must be 'complete' when finished
date: 'YYYY-MM-DD'                          # Creation date
user_name: 'username'                       # User who initiated workflow
projectName: 'project-name'                 # Project name in kebab-case
techStack: 'frontend-backend-database'      # Summary of tech stack
architectureStatus: 'complete'              # Must be 'complete' when finished
completedDate: 'YYYY-MM-DD'                 # Date workflow completed
```

## Section Validation

### Required Sections

#### 1. 需求分析 (Requirements Analysis)
- [ ] Functional requirements documented
- [ ] Non-functional requirements documented
- [ ] Technical constraints identified
- [ ] MVP scope defined for architecture

#### 2. 技术选型 (Technology Selection)
- [ ] Frontend technology stack selected
- [ ] Backend technology stack selected
- [ ] Database solution selected
- [ ] Infrastructure/deployment selected
- [ ] Architecture decision records (ADRs) included

#### 3. 系统架构设计 (System Architecture Design)
- [ ] Architecture style defined
- [ ] Module decomposition documented
- [ ] Component responsibilities clear
- [ ] Data flow described
- [ ] Communication patterns defined

#### 4. 数据模型设计 (Data Model Design)
- [ ] All entities identified and defined
- [ ] Entity relationships documented
- [ ] Database schema DDL provided
- [ ] Indexes and constraints defined
- [ ] Migration strategy planned

#### 5. 接口设计 (Interface Design)
- [ ] All API endpoints documented
- [ ] Request/response formats standardized
- [ ] Authentication/authorization defined
- [ ] Error handling strategy documented
- [ ] Rate limiting configured

#### 6. 安全与性能 (Security & Performance)
- [ ] Security architecture comprehensive
- [ ] Performance optimization strategies documented
- [ ] Monitoring and observability defined
- [ ] Backup and recovery strategy included

#### 7. 文档与交付 (Documentation & Handoff)
- [ ] Executive summary complete
- [ ] Development environment setup guide provided
- [ ] Implementation roadmap with timelines
- [ ] Architecture diagrams included
- [ ] Handoff checklist complete

## Quality Metrics

### Completeness Metrics

#### Documentation Completeness
- **Minimum**: All 7 major sections present
- **Preferred**: All sections with detailed subsections
- **Excellent**: All sections with examples and code samples

#### Technical Completeness
- **Minimum**: Major architectural decisions documented
- **Preferred**: All decisions with alternatives considered
- **Excellent**: All decisions with implementation references

### Quality Indicators

#### Decision Quality
- Each technology choice has:
  - [ ] Clear rationale
  - [ ] Alternatives considered
  - [ ] Trade-offs acknowledged
  - [ ] Long-term impact considered

#### Implementation Readiness
- Development team can:
  - [ ] Understand the architecture
  - [ ] Set up development environment
  - [ ] Navigate the codebase structure
  - [ ] Implement features based on specifications
  - [ ] Deploy and test the application

## Common Validation Failures

### Missing Content
1. Frontmatter fields incomplete or missing
2. ADRs (Architecture Decision Records) not documented
3. Database schema not provided in DDL format
4. API endpoinst not fully documented
5. Security measures not comprehensive

### Quality Issues
1. Vague technology selections without rationale
2. Missing error handling specifications
3. No monitoring/observability plan
4. Performance strategies not actionable
5. Handoff checklist incomplete

### Process Issues
1. Steps not marked as completed
2. `lastStep` not updated to 'complete'
3. `architectureStatus` not set to 'complete'
4. Missing completion date
5. Incomplete transitions between steps

## Approval Criteria

The Tech Architecture workflow is considered COMPLETE when:

### Must-Have (Complete Failure Without)
- [ ] All 8 steps completed in `stepsCompleted` array
- [ ] `lastStep` = 'complete'
- [ ] `architectureStatus` = 'complete'
- [ ] All 7 major sections present in document
- [ ] Technology stack fully defined with rationale
- [ ] Database schema with DDL statements
- [ ] API specification for all major endpoints
- [ ] Security architecture documented

### Should-Have (Quality Concern Without)
- [ ] Architecture diagrams (system, data flow, deployment)
- [ ] ADRs for all major decisions
- [ ] Implementation roadmap with time estimates
- [ ] Development environment setup guide
- [ ] Performance optimization strategies
- [ ] Monitoring and observability plan
- [ ] Handoff checklist

### Nice-to-Have (Premium Quality)
- [ ] Code samples for key patterns
- [ ] Performance benchmarks or targets
- [ ] Security audit checklist
- [ ] Testing strategy document
- [ ] Troubleshooting guide
- [ ] Migration path from MVP to production

## Automated Validation

### Script Validation (Pseudo-Code)
```javascript
function validateArchitectureDocument(doc) {
  const errors = [];
  const warnings = [];

  // Check frontmatter
  if (!doc.stepsCompleted || doc.stepsCompleted.length !== 8) {
    errors.push('stepsCompleted must contain all 8 steps');
  }
  if (doc.lastStep !== 'complete') {
    errors.push('lastStep must be "complete"');
  }

  // Check sections
  const requiredSections = [
    '需求分析',
    '技术选型',
    '系统架构设计',
    '数据模型设计',
    '接口设计',
    '安全与性能',
    '文档与交付'
  ];

  requiredSections.forEach(section => {
    if (!doc.content.includes(section)) {
      errors.push(`Missing section: ${section}`);
    }
  });

  return { errors, warnings };
}
```

## Sign-off

### Workflow Completeness
- [ ] All validation checks passed
- [ ] No critical errors
- [ ] Documentation is deliverable
- [ ] Handoff checklist complete

### Quality Assurance
- [ ]Architecture reviewed by lead architect or peer
- [ ] Technical feasibility confirmed
- [ ] Performance requirements addressed
- [ ] Security requirements met
- [ ] Scalability considerations included

---

**Validation Date**: __________________
**Validated By**: __________________
**Status**: [ ] Not Started [ ] In Progress [ ] Complete
**Overall Quality Score**: ___/10
