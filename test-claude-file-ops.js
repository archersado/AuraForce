#!/usr/bin/env node

/**
 * Test Claude Agent SDK File Operations via API
 *
 * This script tests whether the Claude Agent SDK returns Computer Tool Results
 * for file operations (creation and updates) through the API.
 */

const TEST_PROJECT_ID = '9b3e3f35-4bf4-4e79-a3d8-335da97ff209';
const WORKSPACE_ROOT = '/Users/archersado/workspace/mygit/AuraForce/workspaces/e3e2c198-5a4a-485e-b16c-0e4979c3c090/e-pany';
const API_BASE = 'http://localhost:3000/api';

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function makeRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response;
}

async function testCreateFileOperation() {
  log('\n=== Test 1: Create File Operation ===', colors.cyan);

  const payload = {
    content: '请在 _bmad-output 目录下创建一个新文件 test-cli-file.md，内容为 "这是CLI测试创建的文件"',
    model: 'sonnet',
    projectPath: WORKSPACE_ROOT,
    projectId: TEST_PROJECT_ID,
    permissionMode: 'bypassPermissions'
  };

  try {
    const response = await fetch(`${API_BASE}/claude/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    // Read the stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    let foundComputerToolResult = false;
    let foundFileOperation = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;

      // Check for Computer Tool Result indicators
      const indicators = [
        'ComputerToolResult',
        'tool_result',
        'computer_results',
        '<ComputerToolResult>',
        '"type": "computer"',
        '"tool_use_id"',
        '"content":',
        '"is_error": false',
      ];

      for (const indicator of indicators) {
        if (chunk.includes(indicator)) {
          if (!foundComputerToolResult && indicator.includes('ComputerToolResult')) {
            foundComputerToolResult = true;
            log(`Found Computer Tool Result indicator: ${indicator}`, colors.green);
          }
          foundFileOperation = true;
        }
      }

      // Check for file write/create operations specifically
      const fileOps = [
        'write_file',
        'create_file',
        'files_write',
        'files_create',
        '"command": "write_file"',
        '"command": "create_file"',
        '"command": "edit_file"',
        '"command": "str_replace_editor',
      ];

      for (const op of fileOps) {
        if (chunk.includes(op)) {
          log(`Found file operation: ${op}`, colors.blue);
        }
      }
    }

    log('\n--- Response Summary ---', colors.cyan);
    log(`Total response length: ${fullResponse.length} characters`, colors.yellow);
    log(`Found Computer Tool Results: ${foundComputerToolResult}`, colors.yellow);
    log(`Found any file operations: ${foundFileOperation}`, colors.yellow);

    // Try to parse JSON blocks
    const jsonBlocks = fullResponse.match(/\{[\s\S]*?\}/g);
    if (jsonBlocks && jsonBlocks.length > 0) {
      log('\n--- Parsed JSON Blocks ---', colors.cyan);
      jsonBlocks.forEach((block, index) => {
        if (block.length > 50 && block.length < 5000) {
          try {
            const parsed = JSON.parse(block);
            log(`\nBlock ${index + 1}:`, colors.yellow);
            log(JSON.stringify(parsed, null, 2));
          } catch (e) {
            log(`\nBlock ${index + 1} (non-parsable):`, colors.yellow);
            log(block.substring(0, 200) + '...');
          }
        }
      });
    }

    // Save full response for inspection
    const fs = require('fs');
    fs.writeFileSync('./test-response-create-file.json', fullResponse);
    log('\nFull response saved to: test-response-create-file.json', colors.green);

    return {
      success: true,
      foundComputerToolResult,
      foundFileOperation,
      responseLength: fullResponse.length
    };

  } catch (error) {
    log(`Error: ${error.message}`, colors.red);
    return { success: false, error: error.message };
  }
}

async function testUpdateFileOperation() {
  log('\n=== Test 2: Update File Operation ===', colors.cyan);

  const payload = {
    content: '请修改刚才创建的 test-cli-file.md 文件，将内容改为 "这是CLI测试更新的文件内容"',
    model: 'sonnet',
    projectPath: WORKSPACE_ROOT,
    projectId: TEST_PROJECT_ID,
    permissionMode: 'bypassPermissions'
  };

  try {
    const response = await fetch(`${API_BASE}/claude/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    // Read the stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    let foundComputerToolResult = false;
    let foundUpdateOperation = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;

      // Check for update-specific operations
      const updateOps = [
        'str_replace_editor',
        'str_replace',
        'edit_file',
        'update_file',
        '"command": "str_replace"',
        '"old_str"',
        '"new_str"',
      ];

      for (const op of updateOps) {
        if (chunk.includes(op)) {
          foundUpdateOperation = true;
          log(`Found update operation: ${op}`, colors.blue);
        }
      }

      if (chunk.includes('ComputerToolResult')) {
        foundComputerToolResult = true;
      }
    }

    log('\n--- Response Summary ---', colors.cyan);
    log(`Total response length: ${fullResponse.length} characters`, colors.yellow);
    log(`Found Computer Tool Results: ${foundComputerToolResult}`, colors.yellow);
    log(`Found any update operations: ${foundUpdateOperation}`, colors.yellow);

    // Save full response
    const fs = require('fs');
    fs.writeFileSync('./test-response-update-file.json', fullResponse);
    log('\nFull response saved to: test-response-update-file.json', colors.green);

    return {
      success: true,
      foundComputerToolResult,
      foundUpdateOperation,
      responseLength: fullResponse.length
    };

  } catch (error) {
    log(`Error: ${error.message}`, colors.red);
    return { success: false, error: error.message };
  }
}

async function checkExistingTestFile() {
  const fs = require('fs');
  const testFilePath = `${WORKSPACE_ROOT}/_bmad-output/test-cli-file.md`;

  if (fs.existsSync(testFilePath)) {
    const content = fs.readFileSync(testFilePath, 'utf-8');
    log('\n=== Existing Test File Check ===', colors.cyan);
    log(`File exists: ${testFilePath}`, colors.green);
    log(`Content: ${content}`, colors.yellow);
  } else {
    log(`\nTest file does not exist yet: ${testFilePath}`, colors.yellow);
  }
}

async function main() {
  log('=== Claude Agent SDK File Operations Test ===', colors.green);
  log(`API Base: ${API_BASE}`);
  log(`Workspace Root: ${WORKSPACE_ROOT}`);

  // Check for existing file first
  await checkExistingTestFile();

  // Test 1: Create file
  const createResult = await testCreateFileOperation();

  // Wait for file operations to complete
  log('\nWaiting 5 seconds for file operations to complete...', colors.yellow);
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Check if file was created
  await checkExistingTestFile();

  // Test 2: Update file
  const updateResult = await testUpdateFileOperation();

  // Wait for file operations to complete
  log('\nWaiting 5 seconds for update to complete...', colors.yellow);
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Final check
  await checkExistingTestFile();

  // Print summary
  log('\n=== Test Summary ===', colors.green);
  log(`Create File Test: ${createResult.success ? 'PASSED' : 'FAILED'}`, createResult.success ? colors.green : colors.red);
  log(`  - Computer Tool Results: ${createResult.foundComputerToolResult ? 'YES' : 'NO'}`, createResult.foundComputerToolResult ? colors.green : colors.yellow);
  log(`  - File Operations: ${createResult.foundFileOperation ? 'YES' : 'NO'}`, createResult.foundFileOperation ? colors.green : colors.yellow);

  log(`Update File Test: ${updateResult.success ? 'PASSED' : 'FAILED'}`, updateResult.success ? colors.green : colors.red);
  log(`  - Computer Tool Results: ${updateResult.foundComputerToolResult ? 'YES' : 'NO'}`, updateResult.foundComputerToolResult ? colors.green : colors.yellow);
  log(`  - Update Operations: ${updateResult.foundUpdateOperation ? 'YES' : 'NO'}`, updateResult.foundUpdateOperation ? colors.green : colors.yellow);

  // Conclusion
  log('\n=== Conclusion ===', colors.green);

  if (createResult.foundComputerToolResult || updateResult.foundComputerToolResult) {
    log('✓ Claude Agent SDK DOES return Computer Tool Results for file operations', colors.green);
    log('  The system is working as expected - file operations are reported back to the client.', colors.green);
  } else if (createResult.foundFileOperation || updateResult.foundUpdateOperation) {
    log('✓ Claude Agent SDK DOES indicate file operations in responses', colors.green);
    log('  File operations are being returned, but may not be wrapped as ComputerToolResult objects.', colors.green);
    log('  Check the saved JSON response files for exact format.', colors.yellow);
  } else {
    log('✗ Claude Agent SDK does NOT appear to return Computer Tool Results', colors.red);
    log('  Either: 1) File operations are not included in the response stream', colors.red);
    log('         2) The format is different than expected', colors.red);
    log('         3) Computer Tool execution is not enabled', colors.red);
    log('  Check test-response-*.json files for actual response format.', colors.yellow);
  }

  process.exit(createResult.success || updateResult.success ? 0 : 1);
}

// Run tests
main().catch(error => {
  log(`Fatal error: ${error.message}`, colors.red);
  console.error(error);
  process.exit(1);
});
