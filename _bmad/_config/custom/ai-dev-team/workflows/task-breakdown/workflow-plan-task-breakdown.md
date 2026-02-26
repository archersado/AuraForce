# Workflow Plan: task-breakdown

**Module:** ai-dev-team
**Workflow Name:** task-breakdown
**Created:** 2026-02-03

---

## Phase 0: Pre-Workflow Initialization

### Purpose
Prepare for workflow execution by loading configuration and validating inputs.

### Tasks
- Load configuration from `{project-root}/_bmad/bmb/config.yaml`
- Resolve variables: `project_name`, `output_folder`, `user_name`, `communication_language`, `dev_docs_folder`
- Validate required inputs:
  - 产品设计文档（PRD）
  - 交互设计文档
  - 技术设计文档

### Success Criteria
- Configuration loaded and resolved
- Required inputs validated
- Ready to proceed to Step 1

---

## Phase 1: Requirements Analysis (Step 1)

### Step: step-01-analyze-requirements.md

### Agent: PM

### Purpose
Analyze requirements and design documents to understand what needs to be implemented.

### Tasks
1. Display current progress and workflow context
2. Load and resolve configuration
3. Read and analyze:
   - 产品设计文档（PRD）
   - 交互设计文档
   - 技术设计文档
4. Identify key requirements and constraints
5. Clarify any ambiguities with the user
6. Present requirements summary for confirmation

### Menu Options
- [A] Approve & Continue - Proceed to identify features
- [P] Provide Additional Information - Add more details
- [C] Cancel Workflow - Exit workflow

### Success Criteria
- Requirements analyzed and understood
- ambiguities resolved
- User approves requirements analysis

---

## Phase 2: Feature Identification (Step 2)

### Step: step-02-identify-features.md

### Agent: PM

### Purpose
Identify features that need to be implemented based on requirements analysis.

### Tasks
1. Display current progress
2. Based on requirements from Step 1, identify features:
   - Core features (must-have)
   - Secondary features (nice-to-have)
   - Technical features (infrastructure, API, etc.)
3. Group features by logical module/area
   - Frontend features
   - Backend features
   - Shared features
4. Estimate scope for each feature
5. Present feature list for review

### Menu Options
- [A] Approve & Continue - Features are correct, proceed to create stories
- [S] Split Features - Further break down features
- [C] Cancel Workflow - Exit workflow

### Success Criteria
- Features identified clearly
- Features grouped appropriately
- User approves feature list

---

## Phase 3: Story Creation (Step 3)

### Step: step-03-create-stories.md

### Agents: PM, Frontend Dev, Backend Dev

### Purpose
Create detailed stories for each identified feature.

### Tasks
1. Display current progress
2. For each feature, create stories following Story Structure:
   - Story ID (e.g., STORY-001)
   - 标题
   - 描述
   - 验收标准
   - 负责人 (Frontend Dev/Backend Dev/QA)
   - 状态 (初始为: 待处理)
3. Collaborate with Frontend Dev and Backend Dev:
   - Get technical input from Frontend Dev
   - Get technical input from Backend Dev
   - Validate stories from technical perspective
4. Create story list document content
5. Present story list for review

### Menu Options
- [R] Revise Stories - Make changes to stories
- [A] Approve & Continue - Stories look good, proceed to complexity estimation
- [C] Cancel Workflow - Exit workflow

### Success Criteria
- Stories created for all features
- Stories include required fields
- Technical input incorporated
- User approves story list

---

## Phase 4: Complexity Estimation (Step 4)

### Step: step-04-estimate-complexity.md

### Agents: Frontend Dev, Backend Dev

### Purpose
Estimate complexity for each story from technical perspective.

### Tasks
1. Display current progress
2. For each story, assess complexity:
   - Frontend Dev assesses frontend stories
   - Backend Dev assesses backend stories
   - Both assess shared/infrastructure stories
3. Complexity rating scale:
   - **Low (简单)**: Straightforward implementation, minimal dependencies
   - **Medium (中等)**: Moderate complexity, some dependencies/technical challenges
   - **High (复杂)**: Complex implementation, many dependencies, significant technical challenges
4. Document complexity assessment for each story
5. Present complexity estimations for review

### Menu Options
- [F] Finalize & Continue - Complexity estimates are correct
- [B] Back to Create Stories - Make changes to stories
- [C] Cancel Workflow - Exit workflow

### Success Criteria
- Complexity estimated for all stories
- Complexity ratings documented
- User approves complexity estimates

---

## Phase 5: Time Estimation (Step 5)

### Step: step-05-estimate-time.md

### Agents: Frontend Dev, Backend Dev

### Purpose
Estimate completion time for each story based on complexity.

### Tasks
1. Display current progress
2. For each story, estimate time based on:
   - Complexity rating from Step 4
   - Story scope and description
   - Technical considerations
3. Time estimation guidelines:
   - Complexity + Team capability + Dependencies
   - Include buffer for uncertainties
   - Format: hours or days
4. Document time estimation for each story
5. Present time estimations for review

### Menu Options
- [A] Approve & Continue - Time estimates are correct
- [S] Split Stories - Break down stories further if time estimates are too large
- [C] Cancel Workflow - Exit workflow

### Success Criteria
- Time estimated for all stories
- Time estimates reasonable and documented
- User approves time estimates

---

## Phase 6: Document Stories (Step 6)

### Step: step-06-document-stories.md

### Agent: PM

### Purpose
Save the complete story list to the document library.

### Tasks
1. Display current progress
2. Ensure `{dev_docs_folder}/stories/` directory exists
3. Create story list document using template structure
4. Include all stories with:
   - Story ID
   - 标题
   - 描述
   - 验收标准
   - 复杂度评估
   - 时间估算
   - 负责人
   - 状态
5. Save document to `{dev_docs_folder}/stories/{feature-name}.md`
6. Display confirmation with file path

### Menu Options
- [C] Continue to Next Step - Document saved, proceed to Linear sync

**Note:** This step only has C (Continue) option - no exit point

### Success Criteria
- Story list document saved successfully
- Document contains all required information
- File path confirmed

---

## Phase 7: Linear Synchronization (Step 7)

### Step: step-07-sync-to-linear.md

### Agent: PM

### Purpose
Create Linear Story records for tracking and management.

### Tasks
1. Display current progress
2. Get Linear project/team ID if available
3. For each story, attempt to create Linear Story record:
   - Use Linear MCP: `mcp__linear__create_issue`
   - Include title, description, acceptance criteria
   - Include estimates (complexity, time)
   - Assign to appropriate team member
   - Set labels and project associations
4. Handle Linear unavailability:
   - Provide manual creation instructions
   - Document all stories ready for manual entry
5. Display sync results:
   - Stories created successfully
   - Stories requiring manual creation
6. Display final summary and next steps

### Menu Options
- None (This is the final step)

### Success Criteria
- Linear sync attempted (completed or limitation acknowledged)
- Final summary displayed
- Next steps provided clearly
- Workflow completed

---

## Workflow Completion

### Final Deliverables

1. **Story List Document**
   - Location: `{dev_docs_folder}/stories/{feature-name}.md`
   - Format: Markdown
   - Content: Complete story list with all required fields

2. **Linear Stories**
   - Created via Linear MCP
   - Include all story details
   - Assigned to appropriate team members
   - Tracked in Linear project

3. **Summary Report**
   - Total stories created
   - Stories by owner (Frontend, Backend, QA)
   - Stories by complexity (Low, Medium, High)
   - Total estimated time

### Next Steps

After workflow completion, user can:
- Proceed to `dev-delivery` workflow for actual development execution
- Use `dev-delivery` to track story implementation
- Use Linear for ongoing story tracking

---

## Error Handling

### Configuration Loading Failure
- Display error message clearly
- Provide guidance on checking config file
- Exit workflow with error status

### Missing Required Inputs
- Prompt user to provide missing documents
- Allow workflow to continue with available information
- Document gaps in requirements

### Linear MCP Unavailable
- Continue workflow execution
- Provide manual Linear creation instructions
- Note in summary that manual sync required

### Story Creation Issues
- Allow revision at Step 3
- Provide option to split large stories
- Collaborate with technical team for refinements

---

## Quality Assurance

### Story Quality Checks
- [ ] Each story has clear description
- [ ] Each story has measurable acceptance criteria
- [ ] Each story has assigned owner
- [ ] Each story has complexity rating
- [ ] Each story has time estimation
- [ ] Stories are granular enough (not too large)

### Estimation Quality Checks
- [ ] Complexity ratings are consistent across stories
- [ ] Time estimates are reasonable for complexity
- [ ] Time estimates include buffer for uncertainties
- [ ] High complexity stories are justified

### Document Quality Checks
- [ ] Document follows template structure
- [ ] All stories included in document
- [ ] Document is properly formatted
- [ ] File saved to correct location

---

## Workflow Statistics

To track after deployment:
- Average number of stories per feature
- Average time per story by complexity
- Linear sync success rate
- User satisfaction with story granularity

---

_Workflow Plan created on 2026-02-03_
