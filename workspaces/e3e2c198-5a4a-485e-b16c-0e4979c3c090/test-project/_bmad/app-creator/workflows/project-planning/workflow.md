---
workflow:
  name: 'project-planning'
  title: '项目规划'
  icon: '📊'
  version: '1.0.0'
  description: 'Create comprehensive project plan with timelines, resources, and milestones'

  primary_agent: 'chen'
  supporting_agents:
    - 'alex'
    - 'atlas'
    - 'nova'

  estimated_duration: '1-2 hours'
  complexity: 'intermediate'

  input_requirements:
    - 'Product Requirements Document from Product Definition workflow'
    - 'Technical Architecture from Tech Architecture workflow'
    - 'Team size and capabilities'
    - 'Budget constraints'
    - 'Target launch date'

  outputs:
    - 'Project timeline and milestones'
    - 'Resource allocation plan'
    - 'Risk assessment matrix'
    - 'Budget breakdown'
    - 'Team structure and roles'
    - 'Sprint planning'
    - 'Success metrics and KPIs'
    - 'Communication plan'

  steps: 6

  resume_enabled: true
  auto_save: true

  metadata:
    category: 'management'
    tags:
      - 'planning'
      - 'management'
      - 'timeline'
      - 'resources'
      - 'risks'
      - 'milestones'

    prerequisite_workflows:
      - 'product-definition'
      - 'tech-architecture'
      - 'design-sprint'

    recommended_next:
      - 'all-workflows-complete'
