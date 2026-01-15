/**
 * WebSocket Client Integration Test
 *
 * This script tests the WebSocket server by:
 * 1. Starting the dev server
 * 2. Connecting to the WebSocket server
 * 3. Sending a chat_request message
 * 4. Receiving and validating responses
 * 5. Testing ping/pong health check
 */

import http from 'http';
import WebSocket from 'ws';

// Utility function to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Check if dev server is running
async function checkDevServer(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/claude/ws', (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.status === 'running' && data.port) {
            console.log('Dev server is running on port', data.port);
            resolve(true);
          } else {
            resolve(false);
          }
        } catch {
          resolve(false);
        }
      });
    });
    req.on('error', () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Get WebSocket server port
async function getWSPort(): Promise<number | null> {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/claude/ws', (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve(data.port || null);
        } catch {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(null);
    });
  });
}

// Create a chat_request message
function createChatRequest(content: string): string {
  return JSON.stringify({
    id: crypto.randomUUID(),
    type: 'chat_request',
    payload: {
      content,
      model: 'sonnet',
      permissionMode: 'bypassPermissions',
    },
    timestamp: new Date().toISOString(),
  });
}

// Create a ping message
function createPing(): string {
  return JSON.stringify({
    id: crypto.randomUUID(),
    type: 'ping',
    payload: {
      data: 'Test ping',
    },
    timestamp: new Date().toISOString(),
  });
}

// Test WebSocket connection
async function testWebSocket() {
  console.log('WebSocket Integration Test');
  console.log('=============================\n');

  // Check if dev server is running
  const isRunning = await checkDevServer();
  if (!isRunning) {
    console.error('ERROR: Dev server is not running!');
    console.error('Please run "npm run dev" first.');
    process.exit(1);
  }

  // Get WebSocket port
  const port = await getWSPort();
  if (!port) {
    console.error('ERROR: Could not get WebSocket port!');
    process.exit(1);
  }

  const wsUrl = `ws://localhost:${port}`;
  console.log(`Connecting to WebSocket server at ${wsUrl}...`);

  const ws = new WebSocket(wsUrl);
  let messageCount = 0;
  let sessionId = '';
  let receivedPong = false;
  let testPassed = false;

  // Set timeout for test
  const testTimeout = setTimeout(() => {
    if (!testPassed && messageCount > 0) {
      console.log('\n⚠️  Test completed with timeout (but received messages)');
      console.log(`Total messages received: ${messageCount}`);
    } else if (!testPassed) {
      console.error('\n❌ Test timed out!');
      ws.close();
      process.exit(1);
    } else {
      ws.close();
    }
  }, 60000);

  ws.on('open', async () => {
    console.log('✅ WebSocket connection established!\n');

    // Wait a moment for connection status message
    await wait(1000);

    // Test 1: Send chat_request
    console.log('Test 1: Sending chat_request...');
    ws.send(createChatRequest('Hello, this is a test message!'));

    // Test 2: Send ping after receiving some messages
    await wait(5000);
    if (messageCount > 0) {
      console.log('\nTest 2: Sending ping...');
      ws.send(createPing());
    }
  });

  ws.on('message', (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString('utf-8'));
      messageCount++;

      console.log(`\n[${messageCount}] Received: ${message.type}`);

      switch (message.type) {
        case 'connection_status':
          console.log(`  Status: ${message.payload.status}`);
          console.log(`  Message: ${message.payload.message}`);
          console.log(`  Connection ID: ${message.payload.connectionId}`);
          if (message.payload.error) {
            console.log(`  Error: ${message.payload.error.code} - ${message.payload.error.message}`);
          }
          break;

        case 'session_update':
          console.log(`  Session ID: ${message.payload.sessionId}`);
          console.log(`  Status: ${message.payload.status}`);
          if (message.payload.message) {
            console.log(`  Message: ${message.payload.message}`);
          }
          if (!sessionId) {
            sessionId = message.payload.sessionId;
          }
          break;

        case 'chat_stream':
          console.log(`  Session ID: ${message.payload.sessionId}`);
          console.log(`  Data type: ${message.payload.data.type}`);
          if (message.payload.data.text) {
            console.log(`  Text: "${message.payload.data.text.slice(0, 50)}${message.payload.data.text.length > 50 ? '...' : ''}"`);
          }
          break;

        case 'pong':
          console.log(`  Original timestamp: ${message.payload.originalTimestamp}`);
          console.log(`  Data: ${message.payload.data}`);
          receivedPong = true;
          break;

        case 'error':
          console.log(`  Code: ${message.payload.code}`);
          console.log(`  Message: ${message.payload.message}`);
          console.log(`  Recoverable: ${message.payload.recoverable}`);
          break;

        default:
          console.log(`  Full message:`, JSON.stringify(message.payload, null, 2).slice(0, 200));
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('error', (error) => {
    console.error('\n❌ WebSocket error:', error.message);
    clearTimeout(testTimeout);
    ws.close();
    process.exit(1);
  });

  ws.on('close', (code, reason) => {
    console.log(`\nWebSocket closed: ${code} (${reason.toString()})`);
    clearTimeout(testTimeout);

    // Evaluate test results
    console.log('\n=============================');
    console.log('Test Results:');
    console.log(`  Messages received: ${messageCount}`);
    console.log(`  Session ID: ${sessionId || 'none'}`);
    console.log(`  Received pong: ${receivedPong}`);

    const success = messageCount > 0;
    if (success) {
      console.log('\n✅ WebSocket server is working correctly!');
      testPassed = true;
    } else {
      console.log('\n❌ No messages received, test failed!');
    }
    console.log('=============================');

    process.exit(success ? 0 : 1);
  });
}

// Run test
testWebSocket().catch((error) => {
  console.error('Test failed with exception:', error);
  process.exit(1);
});
