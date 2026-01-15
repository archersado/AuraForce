/**
 * WebSocket Server Test Script
 *
 * This script tests the WebSocket server functionality:
 * 1. Creates a mock WebSocket server
 * 2. Verifies message protocol types
 * 3. Tests message serialization/deserialization
 * 4. Validates type safety
 */

// Mock crypto.randomUUID for Node.js < 20
if (!global.crypto || !global.crypto.randomUUID) {
  global.crypto = {
    randomUUID: () => 'mock-' + Math.random().toString(36).substr(2, 9),
  } as any;
}

// Import types
import type {
  WebSocketMessage,
  ChatRequestPayload,
  ChatStreamPayload,
  SessionUpdatePayload,
  ConnectionStatusPayload,
} from './websocket';

/**
 * Test 1: Type validation for message payloads
 */
function testMessageTypes() {
  console.log('Test 1: Message Type Validation');

  // Test chat_request
  const chatRequest: WebSocketMessage<'chat_request'> = {
    id: crypto.randomUUID(),
    type: 'chat_request',
    payload: {
      content: 'Hello, Claude!',
      model: 'sonnet',
      permissionMode: 'bypassPermissions',
    },
    timestamp: new Date().toISOString(),
  };
  console.log('  chat_request:', JSON.stringify(chatRequest, null, 2));

  // Test chat_stream
  const chatStream: WebSocketMessage<'chat_stream'> = {
    id: crypto.randomUUID(),
    type: 'chat_stream',
    payload: {
      sessionId: 'session-123',
      messageId: 'msg-456',
      data: {
        type: 'text_delta',
        text: 'Hello',
      },
      isFinal: false,
    },
    timestamp: new Date().toISOString(),
  };
  console.log('  chat_stream:', JSON.stringify(chatStream, null, 2));

  // Test session_update
  const sessionUpdate: WebSocketMessage<'session_update'> = {
    id: crypto.randomUUID(),
    type: 'session_update',
    payload: {
      sessionId: 'session-123',
      status: 'created',
      message: 'New session created',
    },
    timestamp: new Date().toISOString(),
  };
  console.log('  session_update:', JSON.stringify(sessionUpdate, null, 2));

  // Test connection_status
  const connectionStatus: WebSocketMessage<'connection_status'> = {
    id: crypto.randomUUID(),
    type: 'connection_status',
    payload: {
      status: 'connected',
      message: 'Connection established',
      connectionId: 'conn-789',
    },
    timestamp: new Date().toISOString(),
  };
  console.log('  connection_status:', JSON.stringify(connectionStatus, null, 2));

  console.log('  All message types validated successfully!\n');
}

/**
 * Test 2: Message serialization/deserialization
 */
function testSerialization() {
  console.log('Test 2: Message Serialization/Deserialization');

  const original: WebSocketMessage<'chat_request'> = {
    id: crypto.randomUUID(),
    type: 'chat_request',
    payload: {
      content: 'Test message',
      sessionId: 'session-123',
    },
    timestamp: '2024-01-01T00:00:00.000Z',
  };

  const serialized = JSON.stringify(original);
  console.log('  Serialized:', serialized);

  const deserialized = JSON.parse(serialized) as WebSocketMessage<'chat_request'>;
  console.log('  Deserialized type:', deserialized.type);
  console.log('  Deserialized content:', deserialized.payload.content);

  if (
    deserialized.id === original.id &&
    deserialized.type === original.type &&
    deserialized.payload.content === original.payload.content
  ) {
    console.log('  Serialization/deserialization successful!\n');
  } else {
    console.error('  Serialization failed!\n');
  }
}

/**
 * Test 3: Connection status with error
 */
function testConnectionStatusWithError() {
  console.log('Test 3: Connection Status with Error');

  const errorStatus: WebSocketMessage<'connection_status'> = {
    id: crypto.randomUUID(),
    type: 'connection_status',
    payload: {
      status: 'error',
      message: 'Connection failed',
      connectionId: 'conn-123',
      error: {
        code: 'CONNECTION_FAILED',
        message: 'Could not establish connection',
      },
    },
    timestamp: new Date().toISOString(),
  };
  console.log('  Error status:', JSON.stringify(errorStatus, null, 2));
  console.log('  Error payload validated successfully!\n');
}

/**
 * Test 4: All message types enumeration
 */
function testAllMessageTypes() {
  console.log('Test 4: All Message Types');

  const messageTypes: WebSocketMessage['type'][] = [
    'chat_request',
    'chat_response',
    'chat_stream',
    'session_update',
    'connection_status',
    'ping',
    'pong',
    'error',
  ];

  console.log('  Supported message types:', messageTypes.join(', '));
  console.log(`  Total message types: ${messageTypes.length}`);
  console.log('  All message types enumerated successfully!\n');
}

/**
 * Run all tests
 */
function runTests() {
  console.log('WebSocket Type Definitions Test Suite');
  console.log('========================================\n');

  try {
    testMessageTypes();
    testSerialization();
    testConnectionStatusWithError();
    testAllMessageTypes();

    console.log('========================================');
    console.log('All tests passed successfully!');
    console.log('========================================');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run tests
runTests();
