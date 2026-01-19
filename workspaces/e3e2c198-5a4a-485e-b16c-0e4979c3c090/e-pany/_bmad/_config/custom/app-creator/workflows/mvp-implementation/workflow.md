---
workflow:
  name: 'mvp-implementation'
  title: 'MVP实现'
  icon: '💻'
  version: '1.0.0'
  description: 'Guide MVP implementation with code generation and best practices'

  primary_agent: 'atlas'
  supporting_agents:
    - 'luna'
    - 'alex'

  estimated_duration: '3-5 hours'
  complexity: 'expert'

  input_requirements:
    - 'Technical Architecture Document from Tech Architecture workflow'
    - 'API Specifications'
    - 'Database Schema'
    - 'Code generation level preference (conceptual/basic/implementational)'

  outputs:
    - 'Project structure setup'
    - 'Core components and modules'
    - 'API implementations'
    - 'Database connections and migrations'
    - 'Authentication system'
    - 'State management setup'
    - 'UI components'
    - 'Testing setup'
    - 'Deployment configuration'

  steps: 8

  resume_enabled: true
  auto_save: true

  metadata:
    category: 'technical'
    tags:
      - 'implementation'
      - 'code'
      - 'frontend'
      - 'backend'
      - 'fullstack'
      - 'testing'

    prerequisite_workflows:
      - 'tech-architecture'
      - 'design-sprint'

    recommended_next:
      - 'project-planning'
      - 'testing-strategy'
