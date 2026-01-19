---
workflow:
  name: 'prototyping'
  title: '快速原型'
  icon: '🎭'
  version: '1.0.0'
  description: 'Create interactive prototypes for user testing and validation'

  primary_agent: 'luna'
  supporting_agents:
    - 'chen'
    - 'alex'

  estimated_duration: '1-2 hours'
  complexity: 'intermediate'

  input_requirements:
    - 'Design Sprint deliverables (wireframes, visual design)'
    - 'User journeys and interaction patterns'
    - 'Key user scenarios to test'

  outputs:
    - 'Interactive prototype'
    - 'User testing plan'
    - 'Usability test results'
    - 'Design refinements'
    - 'Prototype iteration decisions'

  steps: 5

  resume_enabled: true
  auto_save: true

  metadata:
    category: 'design'
    tags:
      - 'prototype'
      - 'ux'
      - 'testing'
      - 'validation'
      - 'interaction'
      - 'iteration'

    prerequisite_workflows:
      - 'design-sprint'

    recommended_next:
      - 'all-workflows-complete'
