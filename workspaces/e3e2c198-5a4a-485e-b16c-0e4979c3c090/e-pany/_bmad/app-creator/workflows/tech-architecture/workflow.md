---
workflow:
  name: 'tech-architecture'
  title: '技术架构设计'
  icon: '🏗️'
  version: '1.0.0'
  description: 'Design comprehensive technical architecture for MVP implementation'

  primary_agent: 'atlas'
  supporting_agents:
    - 'alex'
    - 'luna'
    - 'chen'

  estimated_duration: '2-3 hours'
  complexity: 'advanced'

  input_requirements:
    - 'Product Requirements Document (PRD) from Alex'
    - 'User Experience Design from Luna'
    - 'Technical preferences and constraints'
    - 'Team capabilities and timeline'

  outputs:
    - 'System Architecture Document'
    - 'Technology Selection Report'
    - 'Architecture Diagrams'
    - 'API Specification Document'
    - 'Database Design Document'
    - 'Security Architecture Plan'
    - 'Performance Optimization Guide'
    - 'Development Environment Setup Guide'

  steps: 8

  resume_enabled: true
  auto_save: true

  metadata:
    category: 'technical'
    tags:
      - 'architecture'
      - 'backend'
      - 'frontend'
      - 'infrastructure'
      - 'security'
      - 'performance'

    prerequisite_workflows:
      - 'product-definition'
      - 'design-sprint'

    recommended_next:
      - 'mvp-implementation'
      - 'project-planning'
