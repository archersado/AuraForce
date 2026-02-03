# Story 3.7: WebSocket Connection Management

Status: done

**Epic 3: Claude Code Graphical Interface**

Epic Value: Implement robust WebSocket connection management for real-time bidirectional communication between client and Claude Code API, ensuring reliable streaming and automatic reconnection.

---

## Story

As a user,
I want a stable WebSocket connection that automatically handles network issues and reconnection,
so that I can have uninterrupted real-time conversations with Claude Code even when the network is unstable.

---

## Acceptance Criteria

1. **WebSocket Client Implementation**
   - WebSocket client connects to `ws://localhost:3000/api/claude/ws`
   - Connection state is tracked (connecting, connected, disconnected, error)
   - Supports both standard WebSocket and secure WSS protocols
   - Connection timeout is configurable (default 10 seconds)

2. **Bidirectional Message Communication**
   - Client can send user messages to server via WebSocket
   - Server streams assistant responses back to client
   - Message format is JSON with type and payload fields
   - Supports multiple message types: chat_request, chat_response, session_update, connection_status

3. **Automatic Reconnection**
   - Automatic reconnection on connection loss with exponential backoff
   - Max reconnection attempts (default 5) before giving up
   - User can manually trigger reconnection via UI button
   - Pending messages are queued during reconnection and sent when connected

4. **Connection Status UI**
   - Connection status indicator in ChatHeader
   - Shows visual states: green (connected), yellow (connecting), red (disconnected), gray (error)
   - Displays connection latency/ping time
   - Shows reconnection progress and attempt count

5. **Error Handling and Recovery**
   - Graceful handling of WebSocket errors (network, timeout, protocol errors)
   - Error messages displayed to user with actionable steps
   - Fallback to REST API if WebSocket unavailable
   - Connection health monitoring with periodic ping/pong

---

## Tasks / Subtasks

### Task 1: Create WebSocket Client (AC: 1)
- [ ] Create `src/lib/claude/websocket-client.ts`
- [ ] Implement `WebSocketClient` class with connect, disconnect, send methods
- [ ] Track connection state: connecting, connected, disconnected, error
- [ ] Implement connection timeout with configurable duration
- [ ] Support for WebSocket and WSS protocols based on current protocol

### Task 2: Implement Message Protocol (AC: 2)
- [ ] Define message type interfaces in `src/types/websocket.ts`
- [ ] Create message types: chat_request, chat_response, session_update, connection_status
- [ ] Implement JSON message serialization/deserialization
- [ ] Add message ID tracking for request/response correlation

### Task 3: Implement Automatic Reconnection (AC: 3)
- [ ] Add reconnection logic with exponential backoff
- [ ] Implement max retry attempts limit
- [ ] Create message queue for pending messages during reconnection
- [ ] Send queued messages after successful reconnection
- [ ] Add manual reconnection trigger method

### Task 4: Create Connection Status Component (AC: 4)
- [ ] Create `src/components/claude/ConnectionStatus.tsx`
- [ ] Display connection status with color-coded indicator
- [ ] Show ping/latency measurement
- [ ] Display reconnection progress
- [ ] Add retry button for manual reconnection

### Task 5: Implement Error Handling (AC: 5)
- [ ] Catch and handle WebSocket errors
- [ ] Display user-friendly error messages
- [ ] Implement health monitoring with ping/pong
- [ ] Add fallback to REST API when WebSocket fails
- [ ] Log errors for debugging

### Task 6: Integrate with Chat Interface (AC: 2, 4, 5)
- [ ] Update ChatInterface to use WebSocket for streaming
- [ ] Connect ConnectionStatus component to ChatHeader
- [ ] Handle fallback to REST API on WebSocket failure
- [ ] Test edge cases (tab background, network loss, rapid messages)

### Task 7: Create WebSocket Server Route (Backend)
- [ ] Create `src/app/api/claude/ws/route.ts`
- [ ] Implement WebSocket server with upgrade handling
- [ ] Route messages to Claude SDK
- [ ] Stream responses back to client
- [ ] Handle multiple concurrent connections per session

---

## Dev Notes

### WebSocket Client Architecture

```typescript
// src/lib/claude/websocket-client.ts
export interface WebSocketConfig {
  url: string;           // WebSocket server URL
  timeout: number;      // Connection timeout in ms
  maxRetries: number;   // Max reconnection attempts
  retryDelay: number;   // Initial retry delay in ms
  enableFallback: boolean; // Enable REST fallback
}

export interface ConnectionState {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  latency: number;      // Ping time in ms
  isReconnecting: boolean;
  reconnectAttempts: number;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private state: ConnectionState;
  private messageQueue: WebSocketMessage[];
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingTimer: NodeJS.Timeout | null = null;

  connect(): Promise<void> {
    // Connect to WebSocket server
  }

  disconnect(): void {
    // Close connection
  }

  send(message: WebSocketMessage): void {
    // Send message or queue if disconnected
  }

  onMessage(callback: (msg: WebSocketMessage) => void): void {
    // Register message handler
  }

  onStateChange(callback: (state: ConnectionState) => void): void {
    // Register state change handler
  }

  reconnect(): void {
    // Manual reconnection trigger
  }
}
```

### Message Protocol Types

```typescript
// src/types/websocket.ts
export type WebSocketMessageType =
  | 'chat_request'
  | 'chat_response'
  | 'chat_stream'
  | 'session_update'
  | 'connection_status'
  | 'ping'
  | 'pong';

export interface WebSocketMessage {
  id: string;              // Unique message ID
  type: WebSocketMessageType;
  payload: Record<string, unknown>;
  timestamp: string;       // ISO 8601 timestamp
}

export interface ChatRequestPayload {
  sessionId: string;
  message: string;
  model?: string;
}

export interface ChatStreamPayload {
  sessionId: string;
  delta: string;           // Streaming text delta
  isComplete: boolean;
}

export interface ConnectionStatusPayload {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  latency?: number;
  error?: string;
}
```

### Reconnection Strategy

Use exponential backoff for retry attempts:

```typescript
function getRetryDelay(attempt: number, baseDelay: number): number {
  return baseDelay * Math.pow(2, attempt); // 1s, 2s, 4s, 8s, 16s
}
```

### Connection Status Component

```typescript
// src/components/claude/ConnectionStatus.tsx
export function ConnectionStatus({ state, onRetry }: ConnectionStatusProps) {
  const statusColors = {
    connected: 'bg-green-500',
    connecting: 'bg-yellow-500',
    disconnected: 'bg-red-500',
    error: 'bg-gray-500',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${statusColors[state.status]} animate-pulse`} />
      <span className="text-sm">{state.status}</span>
      {state.latency > 0 && <span className="text-xs text-gray-400">{state.latency}ms</span>}
      {state.isReconnecting && <span className="text-xs text-gray-400">Retry {state.reconnectAttempts}/{maxRetries}</span>}
      {(state.status === 'error' || state.status === 'disconnected') && (
        <button onClick={onRetry} className="text-blue-500 text-sm">Retry</button>
      )}
    </div>
  );
}
```

### WebSocket Server Route (Next.js API)

```typescript
// src/app/api/claude/ws/route.ts
import { NextRequest } from 'next/server';
import { Server as SocketServer } from 'ws';

export const runtime = 'edge'; // Use edge runtime for WebSocket

export async function GET(req: NextRequest) {
  // Upgrade HTTP to WebSocket
  const upgradeHeader = req.headers.get('Upgrade');
  if (upgradeHeader?.toLowerCase() !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 });
  }

  // Create WebSocket server and upgrade connection
  const server = new SocketServer({ noServer: true });

  // Handle incoming messages and forward to Claude SDK
  server.on('connection', (ws, req) => {
    ws.on('message', async (data) => {
      const message = JSON.parse(data.toString()) as WebSocketMessage;

      if (message.type === 'chat_request') {
        // Process chat message via Claude SDK and stream response
        for await (const chunk of processChatMessage(message.payload)) {
          ws.send(JSON.stringify({
            id: generateId(),
            type: 'chat_stream',
            payload: { delta: chunk, isComplete: false },
            timestamp: new Date().toISOString(),
          }));
        }
        // Send completion message
        ws.send(JSON.stringify({
          id: generateId(),
          type: 'chat_stream',
          payload: { delta: '', isComplete: true },
          timestamp: new Date().toISOString(),
        }));
      }
    });

    // Health check ping/pong
    setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
          id: generateId(),
          type: 'ping',
          payload: {},
          timestamp: new Date().toISOString(),
        }));
      }
    }, 30000); // 30 second health check
  });

  return new Response(null, {
    status: 101,
    headers: {
      'Upgrade': 'websocket',
      'Connection': 'Upgrade',
    },
  });
}
```

### Connection State Management

Integrate WebSocket client with Zustand store:

```typescript
// src/lib/store/claude-store.ts
interface ClaudeState {
  WebSocket connection state
  websocketClient: WebSocketClient | null;
  connectionState: ConnectionState;
  useWebSocket: boolean; // Toggle between WebSocket and REST

  // Actions
  connectWebSocket: () => Promise<void>;
  disconnectWebSocket: () => void;
  sendWebSocketMessage: (message: string) => void;
  setUseWebSocket: (use: boolean) => void;
}
```

### Health Monitoring

Implement ping/pong for connection health:

```typescript
// Client sends ping to server
ws.send(JSON.stringify({ type: 'ping', payload: {} }));

// Client measures latency from pong
const startTime = Date.now();
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === 'pong') {
    this.state.latency = Date.now() - startTime;
  }
};
```

### Fallback to REST API

If WebSocket fails after retries, fall back to REST:

```typescript
if (connectionFailed && this.config.enableFallback) {
  console.warn('WebSocket failed, falling back to REST API');
  this.state.status = 'error';
  this.sendViaREST(message);
}
```

---

## Technical References

### Next.js WebSocket Support
- **Source**: Next.js Documentation - API Routes with WebSocket
- Edge runtime recommended for WebSocket performance

### Existing WebSocket Client
- **Source**: `src/lib/claude/websocket-client.ts` - Partial implementation exists
- Review and enhance existing implementation

### Existing Streaming
- **Source**: `src/app/api/claude/stream/route.ts` - SSE streaming implementation
- Use as pattern for WebSocket streaming

---

## Dependencies

### Prerequisites
- [x] Epic 1: Project Foundation (Next.js configured)
- [x] Epic 3: Story 3.1 - Chat UI Component Design (UI components exist)
- [x] Epic 3: Story 3.3 - Real-time Streaming Response Display (Streaming patterns established)
- [x] Epic 3: Story 3.4 - Session Persistence and State Management (Session management working)

### Required for this Story
- ws library for WebSocket client/server
- Edge runtime support in Next.js
- Connection state management in Zustand store

---

## Success Criteria Checklist

- [ ] WebSocket client connects successfully to server
- [ ] Connection state is properly tracked and displayed
- [ ] Messages are sent and received via WebSocket in real-time
- [ ] Automatic reconnection works with exponential backoff
- [ ] Connection status UI shows correct visual state
- [ ] User can manually retry failed connections
- [ ] Health monitoring with ping/pong works
- [ ] Fallback to REST API when WebSocket fails
- [ ] Multiple concurrent connections handled correctly
- [ ] TypeScript compilation passes with no errors
- [ ] ESLint passes with no warnings

---

**Ready for Development:** ✅

---

## Next Steps After This Story

1. **Epic 4** - Agent SDK Workflow Engine (8 stories)
2. Story 3.6 (Multi-Session Management) - Can be developed in parallel

---

## Known Dependencies

- Existing `src/lib/claude/websocket-client.ts` file may need review and enhancement
- Claude SDK streaming pattern from Story 3.3
- Session management from Story 3.4
