# Story 4.4: Workflow Execution - User Guide

## Overview

Story 4.4 adds the ability to execute deployed workflows directly through the AuraForce UI, using the Claude Agent SDK to process workflows with real-time streaming output.

## How to Use

### 1. View Workflows

Navigate to the Workflows page (`/workflows`) to see all deployed workflow specifications.

### 2. Execute a Workflow

Each workflow card now has a green "Execute" (▶) button:

- **Enabled**: For workflows with status "deployed" ✅
- **Disabled**: For workflows with other statuses (e.g., "error", "pending") ❌

Click the "Execute" button to open the execution dialog.

### 3. Configure Parameters (Optional)

If the workflow has defined parameters, you'll see an input form:

**Supported Parameter Types:**

| Type | Input | Example |
|------|-------|---------|
| `string` | Text input | Target path, file name |
| `number` | Number input | Port number, retry count |
| `boolean` | Yes/No dropdown | Enable/disable options |
| `select` | Dropdown list | Choose from options |
| `textarea` | Multi-line text | Long descriptions |
| `json` | JSON input | Complex configurations |

**Parameter Properties:**

- `name`: Parameter identifier
- `label`: Display label (defaults to name)
- `type`: Input type
- `description`: Help text
- `required`: Whether mandatory (marked with *)
- `default`: Default value
- `options`: Options for select type

**Example Parameter Definition:**

```json
{
  "inputs": [
    {
      "name": "targetPath",
      "label": "Target Path",
      "type": "string",
      "description": "Path to analyze",
      "required": true,
      "default": "/Users/projects"
    },
    {
      "name": "deepScan",
      "type": "boolean",
      "label": "Deep Scan",
      "description": "Enable deep directory scanning",
      "default": false
    },
    {
      "name": "maxFiles",
      "type": "number",
      "description": "Maximum files to process",
      "default": 100
    }
  ]
}
```

### 4. Execute and Monitor

Click the "Execute" button to start the workflow:

**During Execution:**

- Status indicator shows "Running..." (🔄)
- Output appears in real-time in the terminal-style window
- Auto-scroll keeps latest output visible
- Session ID displayed for tracking

**Execution States:**

| State | Color | Icon | Description |
|-------|-------|------|-------------|
| Running | Blue | 🔄 | Workflow is executing |
| Completed | Green | ✓ | Execution finished successfully |
| Error | Red | ✗ | Execution failed |

### 5. View Results

When execution completes:

- **Success**: Shows "Execution completed" with final results
- **Error**: Shows error message and details
- **Output Terminal**: Displays full execution log

## Workflow Metadata for Parameters

To add parameters to a workflow, include an `inputs` array in the workflow metadata:

```yaml
# workflow.yaml
name: My Workflow
description: Example workflow with parameters
version: "1.0.0"
metadata:
  inputs:
    - name: targetPath
      label: "Target Path"
      type: "string"
      required: true
      default: "/projects"
    - name: mode
      type: "select"
      options:
        - fast
        - balanced
        - thorough
```

On the Claude Code side, the parameters will be available in the execution context.

## Authentication & Authorization

- **Public Workflows**: Can be executed by all authenticated users
- **Private Workflows**: Can only be executed by the owner
- **Unauthenticated**: Cannot execute any workflows

## API Reference

### Execute Endpoint

**POST** `/api/workflows/{id}/execute`

**Request:**

```json
{
  "params": {
    "targetPath": "/projects",
    "mode": "fast",
    "deepScan": true
  },
  "model": "sonnet",
  "permissionMode": "bypassPermissions",
  "sessionId": "optional-uuid-to-resume"
}
```

**Response (SSE Stream):**

Events are sent as Server-Sent Events:

```
data: {"type":"status","message":"Workflow execution started","workflowName":"...","timestamp":"..."}

data: {"type":"session-created","sessionId":"uuid","timestamp":"..."}

data: {"type":"claude-response","data":{"type":"assistant","message":{...}}}

data: {"type":"claude-complete","sessionId":"uuid","workflowId":"...","timestamp":"..."}

data: {"type":"claude-error","error":"Error message","timestamp":"..."}
```

## Common Use Cases

### 1. Code Analysis Workflow

**Parameters:**
- `targetPath`: Directory to analyze (string)
- `maxFiles`: Max files to process (number)
- `includeComments`: Include comments in analysis (boolean)

**Usage:**
1. Click Execute
2. Enter path and settings
3. View analysis results in real-time

### 2. Build & Deploy Workflow

**Parameters:**
- `environment`: Target environment (select: dev/staging/prod)
- `skipTests`: Skip test execution (boolean)

**Usage:**
1. Select environment
2. Toggle skip tests if needed
3. Execute and monitor build output

### 3. Documentation Generation

**Parameters:**
- `outputFormat`: Output format (select: markdown/html/pdf)
- `includeDiagrams`: Include diagrams (boolean)

**Usage:**
1. Choose format options
2. Execute
3. Download generated documentation

## Troubleshooting

### "Workflow is not deployed"

**Solution:** The workflow status must be "deployed" to execute. Check the status badge on the workflow card.

### "Claude API key not configured"

**Solution:** Configure `ANTHROPIC_API_KEY` in your environment or the application config.

### No output appears

**Possible causes:**
- Workflow execution hanging
- Network issues with Claude API
- Check browser console for errors

### Execution fails immediately

**Check:**
- Workflow ccPath is valid
- Required parameters provided
- API key has sufficient permissions

### Timeout error (2 minutes)

**Solution:** The workflow exceeded the 2-minute timeout. Consider:
- Optimizing the workflow
- Breaking into smaller steps
- Adjusting the timeout in the API code

## Tips & Best Practices

1. **Define Clear Parameters**: Use descriptive labels and help text
2. **Set Smart Defaults**: Pre-fill common values to improve UX
3. **Use Select for Options**: Provide a dropdown for fixed choices
4. **Monitor Real-Time**: Watch the output as it streams
5. **Check Status**: Verify workflow is "deployed" before executing
6. **Review Errors**: Error messages show in the terminal output

## Technical Details

**Execution Process:**

1. User clicks Execute → Dialog opens
2. User configures parameters (if any)
3. User clicks Execute → API called
4. API validates workflow and permissions
5. Claude Agent SDK starts execution
6. Results stream via SSE to client
7. UI displays real-time output
8. Complete/Error event ends stream

**Session Management:**

- Each execution creates a unique session
- Session ID displayed for reference
- Can resume sessions (future enhancement)

**SSE Streaming:**

- Real-time output via Server-Sent Events
- Automatic reconnection support
- Event types: status, session-created, claude-response, claude-complete, claude-error

## Future Enhancements

Planned for later stories:

- **Execution History**: View past executions
- **Schedule Execution**: Timer-based workflows
- **WebSocket Support**: Bidirectional communication
- **Export Results**: Download execution logs
- **Share Executions**: Share execution links

---

**Support**: For issues or questions, check the implementation docs or contact the development team.
