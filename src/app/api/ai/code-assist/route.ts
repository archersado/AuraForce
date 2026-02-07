/**
 * AI Code Assist API Endpoint
 *
 * Accepts POST requests for AI-assisted code writing, refactoring, and optimization.
 * Integrates with Claude API for code generation and applies security validation.
 *
 * Runtime: Node.js environment (server-side only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { claude as claudeConfig } from '@/lib/config';
import { validateCodeSecurity, generateSecurityReport, isObfuscatedCode } from '@/lib/ai/code-security';
import { generateCodeDiff, calculateSimilarity } from '@/lib/ai/code-diff';

/**
 * Request body structure
 */
interface CodeAssistRequest {
  command: string;
  code: string;
  language?: string;
  sessionId?: string; // Resume existing session
  selection?: {
    startLine: number;
    endLine: number;
    startChar: number;
    endChar: number;
  };
}

/**
 * AI Code Assistant System Prompt
 */
const CODE_ASSISTANT_SYSTEM_PROMPT = `You are an expert code assistant specializing in code improvement, refactoring, and optimization. Your goal is to help developers write cleaner, more efficient, and more maintainable code.

When responding to code assistance requests:

1. **Understand the Intent**:
   - "改善这个函数" / "Improve this function": Enhance code quality, readability, and maintainability
   - "添加注释" / "Add comments": Add meaningful comments explaining the logic
   - "重构代码" / "Refactor code": Restructure code for better organization and reduced duplication
   - "优化性能" / "Optimize performance": Suggest performance improvements with explanations

2. **Code Quality Standards**:
   - Use meaningful variable and function names
   - Follow language-specific best practices and conventions
   - Keep functions focused and single-responsibility
   - Write self-documenting code (code should be clear without excessive comments)
   - DRY (Don't Repeat Yourself) principle

3. **Output Format**:
   - Provide the improved/refactored code as a code block
   - Include brief explanations of changes made
   - For performance optimizations, explain the trade-offs
   - For refactoring, explain the architectural improvements

4. **Security**:
   - Never introduce security vulnerabilities
   - Avoid eval(), dangerouslySetInnerHTML, and similar dangerous patterns
   - Use parameterized queries for database operations
   - Sanitize user inputs

5. **Language-Specific Guidelines**:
   - JavaScript/TypeScript: Use modern ES6+ features, async/await, arrow functions appropriately
   - Python: Follow PEP 8 style guide, use list comprehensions, context managers
   - General: Use type hints where applicable, meaningful error handling

**Important**: Respond ONLY with the improved code and a brief explanation. Do not include conversational filler or excessive preamble.

Format your response as:

\`\`\`[language]
[your improved code here]
\`\`\`

[Brief explanation of changes]`;

/**
 * Extract code block from AI response
 */
function extractCodeBlock(response: string): string | null {
  // Try markdown code block format
  const codeBlockMatch = response.match(/```(?:\w*\n)?([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // Fallback: if entire response looks like code (no markdown markers)
  const lines = response.split('\n');
  if (lines.length > 3 && response.trim().length > 50) {
    // Check if it looks like code (has common code patterns)
    const codePatterns = [
      /function\s+\w+/,
      /const\s+\w+\s*=/,
      /class\s+\w+/,
      /def\s+\w+/,
      /import\s+/,
      /export\s+/,
      /\{\s*\n|,\s*\n/,
    ];

    const looksLikeCode = codePatterns.some(pattern => pattern.test(response));
    if (looksLikeCode) {
      return response.trim();
    }
  }

  return null;
}

/**
 * Extract explanation from AI response
 */
function extractExplanation(response: string): string {
  // Remove code block
  const withoutCode = response.replace(/```[\s\S]*?```/, '').trim();
  return withoutCode || 'Code has been improved based on your request.';
}

/**
 * Calculate confidence score for AI suggestion
 */
function calculateConfidence(
  originalCode: string,
  suggestedCode: string,
  explanationLength: number,
  securityScore: number
): number {
  const factors = {
    similarity: calculateSimilarity(originalCode, suggestedCode),
    hasExplanation: explanationLength > 50 ? 0.1 : 0,
    securityScore: securityScore / 100,
  };

  // Weight the factors
  const weights = {
    similarity: 0.4, // Some similarity is good (not complete rewrite)
    hasExplanation: 0.1, // Explanations indicate quality
    securityScore: 0.5, // Security is paramount
  };

  let confidence = 0;

  // Similarity: optimal range is 0.3-0.7 (significant changes but not total rewrite)
  if (factors.similarity >= 0.3 && factors.similarity <= 0.7) {
    confidence += weights.similarity * 1;
  } else if (factors.similarity < 0.3) {
    confidence += weights.similarity * 0.7; // Too many changes
  } else {
    confidence += weights.similarity * 0.8; // Too similar
  }

  confidence += weights.hasExplanation * factors.hasExplanation;
  confidence += weights.securityScore * factors.securityScore;

  return Math.min(1, Math.max(0, confidence));
}

/**
 * POST handler for code assistance
 */
export async function POST(request: NextRequest) {
  try {
    const body: CodeAssistRequest = await request.json();
    const { command, code, language = 'javascript', sessionId, selection } = body;

    // Validate required parameters
    if (!command || !code) {
      return NextResponse.json(
        { error: 'Missing required parameters: command and code are required' },
        { status: 400 }
      );
    }

    // Check for empty code
    if (!code.trim()) {
      return NextResponse.json(
        { error: 'Code cannot be empty' },
        { status: 400 }
      );
    }

    // Check Claude API configuration
    const apiKey = claudeConfig.apiKey;
    if (!apiKey || apiKey.includes('your-')) {
      // Mock response for testing without API key
      console.warn('[Code Assist] No valid Claude API key, returning mock response');

      // Generate a simple mock suggestion
      let mockSuggestion = code;
      const mockExpl = `This is a mock AI suggestion for command: "${command}"`;

      if (command.includes('注释') || command.includes('comment')) {
        // Add comments
        mockSuggestion = code
          .split('\n')
          .map(line => line ? `// ${line}` : line)
          .join('\n');
      } else if (command.includes('优化') || command.includes('optimize')) {
        // Add optimization comment
        mockSuggestion = code + '\n// TODO: Add performance optimizations';
      } else {
        // General improvement
        mockSuggestion = code + '\n// [AI] Code has been improved';
      }

      const mockDiff = generateCodeDiff(code, mockSuggestion);

      return NextResponse.json({
        success: true,
        suggestion: mockSuggestion,
        original: code,
        diff: mockDiff,
        explanation: mockExpl,
        confidence: 0.5,
        security: {
          isValid: true,
          score: 100,
          issues: [],
        },
        isMock: true,
      });
    }

    // Set ANTHROPIC_API_KEY for SDK
    process.env.ANTHROPIC_AUTH_TOKEN = apiKey;

    // Build prompt for Claude
    const prompt = `${CODE_ASSISTANT_SYSTEM_PROMPT}

Command: ${command}
Language: ${language}

Original Code:
\`\`\`${language}
${code}
\`\`\`

Please improve the code according to the command above.`;

    console.log('[Code Assist] Processing request:', {
      command,
      language,
      codeLength: code.length,
      hasSessionId: !!sessionId,
    });

    // Query Claude
    const claudeOptions: Record<string, unknown> = {
      model: claudeConfig.defaultModel || 'sonnet',
      permissionMode: 'bypassPermissions',
      cwd: process.cwd(),
      systemPrompt: {
        type: 'preset' as const,
        preset: 'claude_code' as const,
      },
      settingSources: ['project', 'user', 'local'],
      env: {
        ANTHROPIC_AUTH_TOKEN: apiKey,
        ANTHROPIC_BASE_URL: claudeConfig.baseUrl,
      },
    };

    // Resume session if provided
    if (sessionId) {
      claudeOptions.resume = sessionId;
    }

    let aiResponse = '';
    let fullResponse = '';

    try {
      const queryInstance = query({
        prompt,
        options: claudeOptions,
      });

      // Collect response
      for await (const message of queryInstance) {
        // Handle result messages with content string
        if (message.type === 'result') {
          const resultMessage = message as any;
          if (resultMessage.result && typeof resultMessage.result === 'string') {
            aiResponse = resultMessage.result;
            fullResponse = resultMessage.result;
          }
        }
        // Handle assistant messages
        else if (message.type === 'assistant' && message.message) {
          const content = (message.message as any).content;
          if (Array.isArray(content)) {
            aiResponse = content
              .filter((item: any) => item.type === 'text')
              .map((item: any) => item.text)
              .join('');
            fullResponse = aiResponse;
          }
        }
      }

      console.log('[Code Assist] Received AI response length:', aiResponse.length);
    } catch (queryError) {
      console.error('[Code Assist] Claude query error:', queryError);
      throw queryError;
    }

    // Extract code suggestion
    const suggestedCode = extractCodeBlock(aiResponse);

    if (!suggestedCode) {
      return NextResponse.json(
        {
          error: 'Failed to extract code from AI response',
          rawResponse: aiResponse.substring(0, 500),
        },
        { status: 500 }
      );
    }

    // Extract explanation
    const explanation = extractExplanation(aiResponse);

    // Security validation
    console.log('[Code Assist] Running security validation...');
    const securityValidation = validateCodeSecurity(suggestedCode, language);

    // Check for obfuscated code
    const isObfuscated = isObfuscatedCode(suggestedCode);
    if (isObfuscated) {
      securityValidation.isValid = false;
      securityValidation.issues.push({
        type: 'DANGEROUS_API' as any,
        severity: 'high',
        message: 'Code appears to be obfuscated',
        suggestion: 'Refuse to apply obfuscated code for security reasons',
      });
      securityValidation.score = Math.min(securityValidation.score, 30);
    }

    const securityReport = generateSecurityReport(securityValidation);

    // Generate diff
    const diff = generateCodeDiff(code, suggestedCode);

    // Calculate confidence
    const confidence = calculateConfidence(
      code,
      suggestedCode,
      explanation.length,
      securityValidation.score
    );

    console.log('[Code Assist] Validation complete:', {
      isValid: securityValidation.isValid,
      securityScore: securityValidation.score,
      confidence,
      additions: diff.additions,
      deletions: diff.deletions,
    });

    return NextResponse.json({
      success: true,
      suggestion: suggestedCode,
      original: code,
      diff,
      explanation,
      confidence,
      security: {
        isValid: securityValidation.isValid,
        score: securityValidation.score,
        issues: securityValidation.issues,
        report: securityReport,
      },
      meta: {
        language,
        command,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('[Code Assist] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to process code assistance request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - health check
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/ai/code-assist',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}
