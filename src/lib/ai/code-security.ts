/**
 * Code Security Validation Utility
 *
 * Validates AI-generated code for security vulnerabilities and harmful patterns.
 * Provides security recommendations and can block unsafe code modifications.
 */

/**
 * Security vulnerability types
 */
export enum SecurityIssueType {
  XSS = 'XSS',
  SQL_INJECTION = 'SQL_INJECTION',
  COMMAND_INJECTION = 'COMMAND_INJECTION',
  EVAL = 'EVAL',
  DANGEROUS_API = 'DANGEROUS_API',
  HARDCODED_SECRETS = 'HARDCODED_SECRETS',
  INSECURE_RANDOM = 'INSECURE_RANDOM',
  SSRF = 'SSRF',
  PATH_TRAVERSAL = 'PATH_TRAVERSAL',
}

/**
 * Security issue details
 */
export interface SecurityIssue {
  type: SecurityIssueType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  line?: number;
  message: string;
  suggestion?: string;
}

/**
 * Validation result
 */
export interface SecurityValidationResult {
  isValid: boolean;
  issues: SecurityIssue[];
  score: number; // 0-100, higher is more secure
}

/**
 * Security patterns for detection
 */
const SECURITY_PATTERNS = [
  // XSS patterns
  {
    type: SecurityIssueType.XSS,
    pattern: /innerHTML\s*=\s*[\w\.\[\]'"]+/gi,
    severity: 'high' as const,
    message: 'Direct innerHTML assignment may lead to XSS vulnerabilities',
    suggestion: 'Use textContent or sanitize HTML before assignment',
  },
  {
    type: SecurityIssueType.XSS,
    pattern: /document\.write\s*\(/gi,
    severity: 'high' as const,
    message: 'document.write() can execute scripts (XSS risk)',
    suggestion: 'Use DOM manipulation methods instead',
  },

  // SQL Injection patterns
  {
    type: SecurityIssueType.SQL_INJECTION,
    pattern: /['"`]\s*\+\s*\w+['"`]|query\s*=\s*['"`].*\$\{/,
    severity: 'critical' as const,
    message: 'String concatenation in SQL queries is vulnerable to injection',
    suggestion: 'Use parameterized queries or prepared statements',
  },

  // Command injection
  {
    type: SecurityIssueType.COMMAND_INJECTION,
    pattern: /exec\s*\(|spawn\s*\(|child_process\s*\.\s*exec/,
    severity: 'high' as const,
    message: 'Command execution with user input is dangerous',
    suggestion: 'Validate and sanitize all inputs, use whitelisting',
  },

  // eval/Function constructor
  {
    type: SecurityIssueType.EVAL,
    pattern: /\beval\s*\(|new\s+Function\s*\(/gi,
    severity: 'critical' as const,
    message: 'eval() or Function constructor is extremely dangerous',
    suggestion: 'Avoid dynamic code evaluation, use safer alternatives',
  },

  // Hardcoded secrets
  {
    type: SecurityIssueType.HARDCODED_SECRETS,
    pattern: /password\s*=\s*['"`][^'"`]{6,}['"`]|secret\s*=\s*['"`][^'"`]{16,}['"`]|api_key\s*=\s*['"`][^'"`]{20,}['"`]/gi,
    severity: 'high' as const,
    message: 'Hardcoded secrets detected in code',
    suggestion: 'Use environment variables or secure secret management',
  },

  // Insecure random
  {
    type: SecurityIssueType.INSECURE_RANDOM,
    pattern: /Math\.random\s*\(\)/gi,
    severity: 'medium' as const,
    message: 'Math.random() is not cryptographically secure',
    suggestion: 'Use crypto.randomBytes() or window.crypto.getRandomValues()',
  },

  // SSRF (Server-Side Request Forgery)
  {
    type: SecurityIssueType.SSRF,
    pattern: /fetch\s*\(\s*[\w\.\[\]*'"]/gi,
    severity: 'medium' as const,
    message: 'URLs from user input may lead to SSRF vulnerabilities',
    suggestion: 'Validate and restrict URLs to allowed domains',
  },

  // Path traversal
  {
    type: SecurityIssueType.PATH_TRAVERSAL,
    pattern: /fs\.readFile\s*\(|fs\.writeFile\s*\(|readFileSync\s*\(/gi,
    severity: 'medium' as const,
    message: 'File operations with user input may allow path traversal',
    suggestion: 'Validate and sanitize file paths, use path.resolve()',
  },
];

/**
 * Dangerous API patterns
 */
const DANGEROUS_API_PATTERNS = [
  {
    type: SecurityIssueType.DANGEROUS_API,
    pattern: /dangerouslySetInnerHTML\s*=/gi,
    severity: 'high' as const,
    message: 'dangerouslySetInnerHTML bypasses React XSS protection',
    suggestion: 'Use React components or sanitize HTML',
  },
  {
    type: SecurityIssueType.DANGEROUS_API,
    pattern: /__proto__|constructor\.prototype/gi,
    severity: 'high' as const,
    message: 'Prototype pollution vulnerability',
    suggestion: 'Avoid modifying object prototypes',
  },
];

/**
 * Validate code for security issues
 *
 * @param code - Code to validate
 * @param language - Programming language (optional, for language-specific checks)
 * @returns Security validation result
 */
export function validateCodeSecurity(code: string, language?: string): SecurityValidationResult {
  const issues: SecurityIssue[] = [];
  const lines = code.split('\n');

  // Check each security pattern
  const allPatterns = [...SECURITY_PATTERNS, ...DANGEROUS_API_PATTERNS];

  for (const pattern of allPatterns.typeof === 'function' ? allPatterns.filter(() => true) : allPatterns) {
    const matches = code.matchAll(pattern.pattern);

    for (const match of matches) {
      // Find line number
      const matchIndex = match.index || 0;
      let lineNumber: number | undefined;
      let currentPosition = 0;

      for (let i = 0; i < lines.length; i++) {
        currentPosition += lines[i].length + 1; // +1 for newline
        if (currentPosition > matchIndex) {
          lineNumber = i + 1;
          break;
        }
      }

      issues.push({
        type: pattern.type,
        severity: pattern.severity,
        line: lineNumber,
        message: pattern.message,
        suggestion: pattern.suggestion,
      });
    }
  }

  // Calculate security score (0-100)
  const score = calculateSecurityScore(issues);

  // Determine if code is safe enough to apply
  // Allow medium/low severity issues but block critical/high severity
  const hasCriticalOrHigh = issues.some(issue =>
    issue.severity === 'critical' || issue.severity === 'high'
  );

  return {
    isValid: !hasCriticalOrHigh,
    issues,
    score,
  };
}

/**
 * Calculate security score based on issues found
 *
 * @param issues - Security issues found
 * @returns Score from 0-100
 */
function calculateSecurityScore(issues: SecurityIssue[]): number {
  if (issues.length === 0) return 100;

  let deductions = 0;

  for (const issue of issues) {
    switch (issue.severity) {
      case 'critical':
        deductions += 40;
        break;
      case 'high':
        deductions += 25;
        break;
      case 'medium':
        deductions += 10;
        break;
      case 'low':
        deductions += 5;
        break;
    }
  }

  return Math.max(0, 100 - deductions);
}

/**
 * Sanitize code comments (remove before validation to reduce false positives)
 *
 * @param code - Code with comments
 * @returns Code without comments
 */
export function stripComments(code: string, language?: string): string {
  // Remove single-line and multi-line comments
  let sanitized = code;

  // JS/TS-style comments
  sanitized = sanitized.replace(/\/\/.*$/gm, '');
  sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, '');

  // Python-style comments
  sanitized = sanitized.replace(/#.*$/gm, '');

  // HTML-style comments
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');

  return sanitized;
}

/**
 * Check for suspicious code obfuscation
 *
 * @param code - Code to check
 * @returns True if code appears obfuscated
 */
export function isObfuscatedCode(code: string): boolean {
  // Check for excessive single-character variable names
  const singleCharVars = (code.match(/\b[a-z]\s*=/gi) || []).length;
  const avgLineLength = code.split('\n').reduce((sum, line) => sum + line.length, 0) / code.split('\n').length;

  // Check for excessive encoding
  const hasBase64 = /[A-Za-z0-9+/]{20,}={0,2}/.test(code);
  const hasHexEscape = /\\x[0-9a-f]{2}/gi.test(code);

  return (
    singleCharVars > 10 || // Too many single-char variables
    avgLineLength > 300 || // Very long lines
    hasBase64 || // Likely encoded data
    hasHexEscape // Likely obfuscated strings
  );
}

/**
 * Generate security report for display
 *
 * @param result - Security validation result
 * @returns Formatted security report
 */
export function generateSecurityReport(result: SecurityValidationResult): string {
  if (result.isValid && result.issues.length === 0) {
    return '✅ No security issues detected. Code appears safe.';
  }

  let report = '';

  if (!result.isValid) {
    report += '🚫 **Security Issues Found**\n\n';
    report += `The generated code has ${result.issues.length} security issue(s) that must be addressed:\n\n`;
  } else {
    report += '⚠️ **Security Warnings**\n\n';
    report += `The code is generally safe but has ${result.issues.length} minor issue(s) to consider:\n\n`;
  }

  // Group issues by severity
  const groupedIssues: Record<string, SecurityIssue[]> = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };

  for (const issue of result.issues) {
    groupedIssues[issue.severity].push(issue);
  }

  const severityOrder = ['critical', 'high', 'medium', 'low'];
  const severityEmojis = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🔵',
  };

  for (const severity of severityOrder) {
    const issues = groupedIssues[severity];
    if (issues.length === 0) continue;

    report += `### ${severityEmojis[severity]} ${severity.toUpperCase()} Issues\n\n`;

    for (const issue of issues) {
      report += `- **${issue.type}**`;
      if (issue.line) report += ` (Line ${issue.line})`;
      report += `\n`;
      report += `  ${issue.message}\n`;
      if (issue.suggestion) {
        report += `  💡 *${issue.suggestion}*\n`;
      }
      report += `\n`;
    }
  }

  report += `\n**Security Score: ${result.score}/100**\n`;

  return report;
}

/**
 * Get allowed code operations based on user permissions
 *
 * @param userRole - User role
 * @returns Set of allowed operations
 */
export function getAllowedOperations(userRole: string): string[] {
  // This is a placeholder - in real implementation, check against user permissions
  const permissions: Record<string, string[]> = {
    admin: ['read', 'write', 'execute', 'ai_suggest', 'ai_apply'],
    developer: ['read', 'write', 'ai_suggest', 'ai_apply'],
    reviewer: ['read', 'ai_suggest'],
    viewer: ['read'],
  };

  return permissions[userRole] || permissions.viewer;
}
