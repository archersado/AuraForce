---
name: 'step-05-diagram-creation'
description: 'Create comprehensive diagrams for the workflow using DrawIO MCP'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmb/workflows/edit-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-05-diagram-creation.md'
workflowFile: '{workflow_path}/workflow.md'
editedWorkflowPath: '{target_workflow_path}'
outputFile: '{output_folder}/workflow-edit-{target_workflow_name}.md'
diagramsFolder: '{project-root}/diagrams'

# Task References
---

# Step 5: Diagram Creation

## STEP GOAL:

Create comprehensive workflow diagrams using DrawIO MCP to visualize the workflow structure, interactions, and key components. Export each diagram in multiple formats (SVG, PNG, DrawIO) to the /diagrams folder for maximum flexibility and professional quality.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a workflow visualization specialist and diagram creation expert
- ✅ If you already have been given a name, communication_style, and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in DrawIO MCP and professional diagram design
- ✅ User brings their workflow context and diagramming needs

### Step-Specific Rules:

- 🎯 Focus only on creating workflow diagrams using DrawIO MCP
- 🚫 FORBIDDEN to use Excalidraw or any other diagramming tools
- 💬 Approach: Professional design thinking, clear structure, and methodical execution
- 📋 Ensure each diagram is exported in multiple formats before creating the next one

## EXECUTION PROTOCOLS:

- 🎯 Create 5 workflow diagrams using DrawIO MCP
- 💾 Export each diagram in three formats (SVG, PNG, DrawIO) to /diagrams folder
- 📖 Create new diagram for each chart type using DrawIO sessions
- 🚫 FORBIDDEN to proceed without proper multi-format export completion

## CONTEXT BOUNDARIES:

- Available context: Edited workflow files from previous improve step
- Focus: Professional diagram creation using DrawIO MCP only
- Limits: Create exactly 5 diagrams, no more, no less
- Dependencies: Successful workflow improvements in previous step
- Output: Multiple format exports for each diagram (SVG, PNG, DrawIO)

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Initialize Diagram Creation Process

"**Workflow Visualization: Creating Comprehensive Professional Diagrams**

Now that your workflow has been edited and improved, let's create comprehensive diagrams to visualize its structure and interactions using professional DrawIO tools.

**Default Diagram Set** (recommended for most projects):

1. **User Experience & System Interaction Diagram** - Shows user journey and system touchpoints
2. **Process Flow Diagram** - Illustrates the main process flow and decision points
3. **Component Architecture Diagram** - Displays system components and their relationships
4. **Data Flow Diagram** - Shows how data moves through the system
5. **State Transition Diagram** - Illustrates system states and transitions

**Customization Options**:
- **Keep Default Set**: Continue with all 5 diagrams (recommended)
- **Customize Selection**: Choose which diagrams to include/exclude
- **Add Additional Diagrams**: Include extra diagram types based on your project needs

**Additional Diagram Types Available**:
- Network Architecture Diagram
- Database Schema Diagram
- API Integration Diagram
- Security Flow Diagram
- Deployment Architecture Diagram

Would you like to:
[D] Use Default 5-diagram set (recommended)
[C] Customize diagram selection
[A] Add additional diagram types

Based on your selection, each chosen diagram will be exported in three formats (SVG, PNG, DrawIO) to the /diagrams folder for maximum flexibility."

**Diagram Selection Logic:**
- IF D: Proceed with default 5 diagrams
- IF C: Present checklist of diagrams to include/exclude
- IF A: Show additional diagram options to add to the set

### 2. Prepare Diagram Environment

**A. Verify Diagrams Folder:**

"Preparing the diagram creation environment...

Checking if the /diagrams folder exists and creating it if needed..."

Use the command: `mkdir -p {diagramsFolder}`

**B. Initialize DrawIO:**

"Initializing DrawIO MCP for professional diagram creation.

Let's start by opening a new DrawIO session for our first diagram."

Use DrawIO MCP command: `mcp__drawio__start_session`

### 3. Diagram 1: User Experience & System Interaction Diagram

**A. Create User Experience & System Interaction Diagram:**

"**Creating Diagram 1: User Experience & System Interaction**

This comprehensive diagram will show:
- User journey and experience touchpoints
- User roles and personas
- System boundaries and interfaces
- Interaction flows and user pathways
- Input/output points
- External system integrations
- Critical user experience moments

Let's create this diagram using DrawIO MCP with professional elements..."

**B. DrawIO Professional Instructions:**

**DrawIO Best Practices for User Experience Diagrams:**
1. **Start with user personas**: Use DrawIO's person/actor shapes from the "General" or "UML" shape libraries
2. **Create swim lanes**: Use horizontal containers to separate different user types or journey phases
3. **System boundary**: Use rounded rectangles with distinctive colors to define system boundaries
4. **Touchpoints**: Use circles or diamond shapes for key interaction points
5. **Flow arrows**: Use curved connectors with labels to show user journey progression
6. **Color coding**: Apply consistent colors - blue for users, green for positive interactions, orange for pain points
7. **Professional typography**: Use consistent fonts (recommended: Arial, 12pt for labels, 10pt for details)

**Step-by-Step Creation:**
1. Create user persona icons using DrawIO's actor shapes
2. Design the user journey timeline horizontally across the diagram
3. Add system boundary containers using rounded rectangles
4. Place interaction touchpoints as circles along the journey
5. Connect with labeled arrows showing flow direction and context
6. Add annotations for key user experience moments
7. Apply professional color scheme and consistent spacing
8. Add title "User Experience & System Interaction Diagram"

**C. Export Diagram 1 (Multi-format):**

"Exporting User Experience & System Interaction Diagram in multiple formats..."

1. **Export as SVG**: `mcp__next-ai-drawio__export_diagram_as_image` with path: "{diagramsFolder}/user-experience-system.svg", with format: "svg"
2. **Export as PNG**: `mcp__next-ai-drawio__export_diagram_as_image` with path: "{diagramsFolder}/user-experience-system.png", with  format: "png"
3. **Save as DrawIO**: `mcp__drawio__export_diagram` with path: "{diagramsFolder}/user-experience-system.drawio"


**D. Prepare for Next Diagram:**

"Preparing for the next diagram creation..."
**Clear Canvas**: call `mcp__next-ai-drawio__clear_canvas`

Ready to create a new DrawIO diagram for the next chart.

### 4. Diagram 2: Process Flow Diagram

**A. Create Process Flow Diagram:**

"**Creating Diagram 2: Process Flow**

This diagram will illustrate:
- Main process steps and workflows
- Decision points and branching logic
- Process start and end points
- Parallel processes and synchronization
- Exception handling and feedback loops
- Process dependencies and timing

Let's create this diagram using DrawIO's professional flowchart elements..."

**B. DrawIO Professional Instructions:**

**DrawIO Best Practices for Process Flow Diagrams:**
1. **Standard flowchart symbols**: Use DrawIO's "Flowchart" shape library for consistent symbols
   - Ovals/Ellipses for start/end points
   - Rectangles for process steps
   - Diamonds for decision points
   - Parallelograms for input/output
2. **Professional layout**: Use DrawIO's alignment tools and grid snapping (View > Grid)
3. **Connector management**: Use orthogonal connectors with automatic routing
4. **Color coding**: Use green for start, red for end, blue for processes, orange for decisions
5. **Consistent spacing**: Maintain 150px between major elements for clarity
6. **Swim lanes**: Use containers to group related processes by department/role
7. **Label positioning**: Place decision labels on connector lines, not inside diamonds

**Step-by-Step Creation:**
1. Create start point using green oval shape
2. Add main process steps as blue rectangles in logical sequence
3. Insert decision diamonds at branching points with orange color
4. Use parallel paths for concurrent processes
5. Connect elements with labeled arrows using orthogonal connectors
6. Add swim lanes if multiple actors are involved
7. Apply consistent color scheme and professional typography
8. Add title "Process Flow Diagram"

**C. Export Diagram 2 (Multi-format):**

"Exporting Process Flow Diagram in multiple formats..."

1. **Export as SVG**: `mcp__next-ai-drawio__export_diagram_as_image` with path: "{diagramsFolder}/process-flow.svg", with format: "svg"
2. **Export as PNG**: `mcp__next-ai-drawio__export_diagram_as_image` with path: "{diagramsFolder}/process-flow.png", with  format: "png"
3. **Save as DrawIO**: `mcp__drawio__export_diagram` with path: "{diagramsFolder}/process-flow.drawio"

**D. Prepare for Next Diagram:**

"Preparing for the next diagram creation..."
**Clear Canvas**: call `mcp__next-ai-drawio__clear_canvas`

Ready to create a new DrawIO diagram for component architecture.

### 5. Diagram 3: Component Architecture Diagram

**A. Create Component Architecture Diagram:**

"**Creating Diagram 3: Component Architecture**

This diagram will display:
- System components and modules
- Component relationships and dependencies
- APIs and service interfaces
- External system integrations
- Technology layers and tiers
- Data persistence layers
- Security boundaries

Let's create this diagram using DrawIO's comprehensive architectural elements..."

**B. DrawIO Professional Instructions:**

**DrawIO Best Practices for Component Architecture Diagrams:**
1. **Architecture shapes**: Use DrawIO's "AWS" or "Azure" libraries for cloud components, "Network" for infrastructure
2. **Layered design**: Organize components in horizontal layers (presentation, business, data)
3. **Container grouping**: Use rounded rectangles with different colors for logical groupings
4. **Interface symbols**: Use specific icons for APIs, databases, services from shape libraries
5. **Dependency arrows**: Use different line styles (solid, dashed, dotted) to show different relationship types
6. **Color semantics**:
   - Blue for presentation layer
   - Green for business logic
   - Orange for data layer
   - Gray for external systems
7. **Component sizing**: Larger boxes for major components, smaller for utilities/helpers

**Step-by-Step Creation:**
1. Create horizontal layers using large containers (presentation, business, data)
2. Add major components as rectangles within appropriate layers
3. Use specific icons for databases, APIs, and external services
4. Group related components with rounded containers
5. Draw dependency arrows with appropriate line styles and labels
6. Add external system connections at boundaries
7. Apply consistent color coding by layer/function
8. Add title "Component Architecture Diagram"

**C. Export Diagram 3 (Multi-format):**

"Exporting Component Architecture Diagram in multiple formats..."

1. **Export as SVG**: `mcp__next-ai-drawio__export_diagram_as_image` with path: "{diagramsFolder}/component-architecture.svg", with format: "svg"
2. **Export as PNG**: `mcp__next-ai-drawio__export_diagram_as_image` with path: "{diagramsFolder}/component-architecture.png", with  format: "png"
3. **Save as DrawIO**: `mcp__drawio__export_diagram` with path: "{diagramsFolder}/component-architecture.drawio"

**D. Prepare for Next Diagram:**

"Preparing for the next diagram creation..."
**Clear Canvas**: call `mcp__next-ai-drawio__clear_canvas`

Ready to create a new DrawIO diagram for data flow visualization.

### 6. Diagram 4: Data Flow Diagram

**A. Create Data Flow Diagram:**

"**Creating Diagram 4: Data Flow**

This diagram will show:
- Data sources and data sinks
- Data stores and repositories
- Data transformation processes
- Data flows and directions
- Data entities and relationships
- Data validation points
- Data security boundaries

Let's create this diagram using DrawIO's specialized data flow elements..."

**B. DrawIO Professional Instructions:**

**DrawIO Best Practices for Data Flow Diagrams:**
1. **Standard DFD symbols**: Use DrawIO's proper data flow notation:
   - Circles for processes/transforms
   - Open rectangles for external entities
   - Closed rectangles for data stores
   - Arrows for data flows with descriptive labels
2. **Data store notation**: Use parallel lines || DataStore || for data repositories
3. **Process numbering**: Number processes (1.0, 2.0, etc.) for hierarchical decomposition
4. **Flow labeling**: Label every arrow with specific data content (not just "data")
5. **Color coding**:
   - Blue for input data flows
   - Green for internal processes
   - Orange for output data flows
   - Red for error/exception flows
6. **Layout direction**: Generally left-to-right flow for readability
7. **Boundary lines**: Use dashed lines to show system boundaries

**Step-by-Step Creation:**
1. Identify and place external entities at diagram edges
2. Add main data stores as rectangles with || notation
3. Place transformation processes as circles in logical sequence
4. Draw data flow arrows with specific labels (not generic terms)
5. Add process numbers for clear referencing
6. Include data validation and transformation points
7. Apply consistent coloring and professional spacing
8. Add title "Data Flow Diagram"

**C. Export Diagram 4 (Multi-format):**

"Exporting Data Flow Diagram in multiple formats..."

1. **Export as SVG**: `mcp__next-ai-drawio__export_diagram_as_image` with path: "{diagramsFolder}/data-flow.svg", with format: "svg"
2. **Export as PNG**: `mcp__next-ai-drawio__export_diagram_as_image` with path: "{diagramsFolder}/data-flow.png", with  format: "png"
3. **Save as DrawIO**: `mcp__drawio__export_diagram` with path: "{diagramsFolder}/data-flow.drawio"

**D. Prepare for Next Diagram:**

"Preparing for the final diagram creation..."
**Clear Canvas**: call `mcp__next-ai-drawio__clear_canvas`

Ready to create a new DrawIO diagram for state transitions.

### 7. Diagram 5: State Transition Diagram

**A. Create State Transition Diagram:**

"**Creating Diagram 5: State Transition**

This diagram will illustrate:
- System states and status modes
- Transitions between states
- Events and triggers causing transitions
- Initial and final states
- Concurrent states and parallel processes
- Guard conditions and constraints
- State entry/exit actions

Let's create this diagram using DrawIO's state diagram elements..."

**B. DrawIO Professional Instructions:**

**DrawIO Best Practices for State Transition Diagrams:**
1. **UML State symbols**: Use DrawIO's "UML" shape library for standard state notation:
   - Rounded rectangles for states
   - Solid circle for initial state
   - Circle with ring for final state
   - Arrows for transitions
2. **State structure**: Divide state boxes into sections (name/entry/exit/do)
3. **Transition labels**: Format as "event [guard] / action" on transition arrows
4. **Parallel states**: Use dashed lines to separate concurrent regions
5. **Color coding**:
   - Green for initial states
   - Blue for normal states
   - Orange for intermediate/processing states
   - Red for error/final states
6. **Hierarchical states**: Use nested containers for substates
7. **Professional layout**: Organize states logically, avoid crossing arrows where possible

**Step-by-Step Creation:**
1. Place initial state (solid circle) at starting position
2. Add main system states as rounded rectangles
3. Connect states with labeled transition arrows
4. Add guard conditions in square brackets [condition]
5. Include actions after slash / on transition labels
6. Create final states (circle with ring) where appropriate
7. Add parallel state regions if system has concurrent behavior
8. Apply consistent color coding and professional spacing
9. Add title "State Transition Diagram"

**C. Export Diagram 5 (Multi-format):**

"Exporting State Transition Diagram in multiple formats..."

1. **Export as SVG**: `mcp__next-ai-drawio__export_diagram_as_image` with path: "{diagramsFolder}/state-transition.svg", with format: "svg"
2. **Export as PNG**: `mcp__next-ai-drawio__export_diagram_as_image` with path: "{diagramsFolder}/state-transition.png", with  format: "png"
3. **Save as DrawIO**: `mcp__drawio__export_diagram` with path: "{diagramsFolder}/state-transition.drawio"

### 8. Diagram Completion Summary

**A. Review Created Diagrams:**

"**Diagram Creation Complete!**

All 5 professional workflow diagrams have been successfully created and exported using DrawIO MCP:

1. ✅ User Experience & System Interaction Diagram
   - SVG: /diagrams/user-experience-system.svg
   - PNG: /diagrams/user-experience-system.png
   - DrawIO: /diagrams/user-experience-system.drawio

2. ✅ Process Flow Diagram
   - SVG: /diagrams/process-flow.svg
   - PNG: /diagrams/process-flow.png
   - DrawIO: /diagrams/process-flow.drawio

3. ✅ Component Architecture Diagram
   - SVG: /diagrams/component-architecture.svg
   - PNG: /diagrams/component-architecture.png
   - DrawIO: /diagrams/component-architecture.drawio

4. ✅ Data Flow Diagram
   - SVG: /diagrams/data-flow.svg
   - PNG: /diagrams/data-flow.png
   - DrawIO: /diagrams/data-flow.drawio

5. ✅ State Transition Diagram
   - SVG: /diagrams/state-transition.svg
   - PNG: /diagrams/state-transition.png
   - DrawIO: /diagrams/state-transition.drawio

These professional-grade diagrams provide comprehensive visual documentation with multiple format options for maximum flexibility."

**B. Documentation Update:**

Update the {outputFile} with diagram references:

"## Professional Workflow Diagrams

The following professional-grade diagrams have been created to visualize this workflow using DrawIO:

- **User Experience & System Interaction**: Shows user journey, personas, and system touchpoints
- **Process Flow**: Illustrates main process flow, decision points, and branching logic
- **Component Architecture**: Displays system components, relationships, and technology layers
- **Data Flow**: Shows data movement, transformation processes, and data stores
- **State Transition**: Illustrates system states, transitions, and behavioral patterns

All diagrams are available in multiple formats in the /diagrams folder:
- **SVG files**: Vector graphics for presentations and scalable displays
- **PNG files**: Raster images for document embedding and sharing
- **DrawIO files**: Editable source files for future modifications and maintenance"

### 9. Final Menu Options

"**Professional Diagram Creation Complete!**

**Select an Option:**

- [C] Complete - Finish with all diagrams created in multiple formats
- [R] Review Diagrams - Check each diagram individually
- [M] Modify Diagram - Redraw any specific diagram using DrawIO
- [F] Format Options - Export diagrams in additional formats or adjust existing ones"

## Menu Handling Logic:

- IF C: End diagram creation successfully with summary
- IF R: Show each diagram and provide review options
- IF M: Allow selection of specific diagram to recreate using DrawIO
- IF F: Provide options for exporting in additional formats or modifying existing format settings
- IF Any other comments or queries: respond and redisplay options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN all 5 diagrams have been created using DrawIO MCP, exported in multiple formats (SVG, PNG, DrawIO) to /diagrams folder, will this step be considered successfully completed.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All 5 workflow diagrams created using DrawIO MCP with professional quality
- Each diagram exported in three formats (SVG, PNG, DrawIO) to /diagrams folder
- DrawIO best practices applied throughout diagram creation process
- User Experience & System Interaction diagram successfully integrates user journey elements
- Diagrams are clearly labeled, professionally designed, and understandable
- User provided with comprehensive visual documentation in multiple formats
- Documentation updated with multi-format diagram references

### ❌ SYSTEM FAILURE:

- Using any tool other than DrawIO MCP for diagram creation
- Not exporting diagrams in all three required formats (SVG, PNG, DrawIO)
- Missing DrawIO best practices guidance in any diagram section
- Creating fewer or more than 5 diagrams
- Not integrating user journey elements into the User Experience diagram
- Not following the specific diagram types and requirements
- Skipping any diagram in the sequence
- Using outdated Excalidraw references or instructions

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
