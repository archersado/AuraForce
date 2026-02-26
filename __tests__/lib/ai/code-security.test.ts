/**
 * Code Security Validation Tests
 *
 * Tests for code security validation utility
 */

import {
  validateCodeSecurity,
  stripComments,
  isObfuscatedCode,
  generateSecurityReport,
  SecurityIssueType,
} from '@/lib/ai/code-security';

describe('Code Security Validation', () => {
  describe('validateCodeSecurity', () => {
    it('should return valid result for safe code', () => {
      const safeCode = `
        function greet(name) {
          return 'Hello, ' + name;
        }
      `;

      const result = validateCodeSecurity(safeCode);

      expect(result.isValid).toBe(true);
      expect(result.score).toBeGreaterThan(80);
      expect(result.issues.length).toBe(0);
    });

    it('should detect XSS vulnerability with innerHTML', () => {
      const xssCode = `
        document.getElementById('output').innerHTML = user_input;
      `;

      const result = validateCodeSecurity(xssCode);

      expect(result.isValid).toBe(false);
      expect(result.issues.some(i => i.type === SecurityIssueType.XSS)).toBe(true);
    });

    it('should detect SQL injection vulnerability', () => {
      const sqlCode = `
        const query = "SELECT * FROM users WHERE id = " + userId;
        db.execute(query);
      `;

      const result = validateCodeSecurity(sqlCode);

      expect(result.isValid).toBe(false);
      expect(result.issues.some(i => i.type === SecurityIssueType.SQL_INJECTION)).toBe(true);
    });

    it('should detect eval usage', () => {
      const evalCode = `
        const result = eval(userCode);
      `;

      const result = validateCodeSecurity(evalCode);

      expect(result.isValid).toBe(false);
      expect(result.issues.some(i => i.type === SecurityIssueType.EVAL)).toBe(true);
    });

    it('should detect Function constructor usage', () => {
      const functionCode = `
        const func = new Function('x', 'return x * 2');
      `;

      const result = validateCodeSecurity(functionCode);

      expect(result.isValid).toBe(false);
      expect(result.issues.some(i => i.type === SecurityIssueType.EVAL)).toBe(true);
    });

    it('should detect hardcoded secrets', () => {
      const secretCode = `
        const password = "mySecretPassword123";
        const apiKey = "sk-1234567890abcdefghijklmnopqrstuv";
      `;

      const result = validateCodeSecurity(secretCode);

      expect(result.isValid).toBe(false);
      expect(result.issues.some(i => i.type === SecurityIssueType.HARDCODED_SECRETS)).toBe(true);
    });

    it('should detect dangerouslySetInnerHTML', () => {
      const reactXssCode = `
        <div dangerouslySetInnerHTML={{ __html: content }} />
      `;

      const result = validateCodeSecurity(reactXssCode);

      expect(result.isValid).toBe(false);
      expect(result.issues.some(i => i.type === SecurityIssueType.DANGEROUS_API)).toBe(true);
    });

    it('should calculate security score correctly', () => {
      const codeWithIssues = `
        document.getElementById('output').innerHTML = userInput;
        eval(someCode);
      `;

      const result = validateCodeSecurity(codeWithIssues);

      expect(result.score).toBeLessThan(100);
      expect(result.score).toBeGreaterThanOrEqual(0);
    });

    it('should allow code with medium/low severity issues', () => {
      const codeWithLowRisk = `
        const randomValue = Math.random();
      `;

      const result = validateCodeSecurity(codeWithLowRisk);

      // Math.random() is medium severity, should be allowed but with warning
      expect(result.issues.some(i => i.severity === 'medium')).toBe(true);
      // Medium severity doesn't make it invalid
      expect(result.isValid).toBe(true);
    });

    it('should handle empty code', () => {
      const emptyCode = '';

      const result = validateCodeSecurity(emptyCode);

      expect(result.isValid).toBe(true);
      expect(result.score).toBe(100);
    });
  });

  describe('stripComments', () => {
    it('should remove single-line comments', () => {
      const code = `
        // This is a comment
        const x = 5;
      `;

      const result = stripComments(code);

      expect(result).toContain('const x = 5;');
      expect(result).not.toContain('// This is a comment');
    });

    it('should remove multi-line comments', () => {
      const code = `
        /*
          Multi-line comment
          spanning multiple lines
        */
        const y = 10;
      `;

      const result = stripComments(code);

      expect(result).toContain('const y = 10;');
      expect(result).not.toContain('Multi-line comment');
    });

    it('should remove Python-style comments', () => {
      const code = `
        # Python comment
        x = 5
      `;

      const result = stripComments(code, 'python');

      expect(result).toContain('x = 5');
      expect(result).not.toContain('# Python comment');
    });

    it('should preserve code without comments', () => {
      const code = 'const x = 5;';
      const result = stripComments(code);

      expect(result).toBe('const x = 5;');
    });
  });

  describe('isObfuscatedCode', () => {
    it('should detect excessive single-character variables', () => {
      const obfuscatedCode = `
        const a = 1;
        const b = 2;
        const c = 3;
        const d = 4;
        const e = 5;
        const f = 6;
        const g = 7;
        const h = 8;
        const i = 9;
        const j = 10;
        const k = 11;
        const l = 12;
      `;

      const result = isObfuscatedCode(obfuscatedCode);

      expect(result).toBe(true);
    });

    it('should detect very long lines', () => {
      const longLineCode = `
        const veryLongLine = 'a'.repeat(500) + 'b'.repeat(500);
      `;

      const result = isObfuscatedCode(longLineCode);

      expect(result).toBe(true);
    });

    it('should detect base64-like strings', () => {
      const base64Code = `
        const encoded = 'VGhpcyBpcyBhIGJhc2U2NCBlbmNvZGVkIHN0cmluZw==12345678901234567890';
      `;

      const result = isObfuscatedCode(base64Code);

      expect(result).toBe(true);
    });

    it('should detect hex escape sequences', () => {
      const hexCode = `
        const escaped = '\\x68\\x65\\x6c\\x6c\\x6f';
      `;

      const result = isObfuscatedCode(hexCode);

      expect(result).toBe(true);
    });

    it('should pass normal readable code', () => {
      const normalCode = `
        function calculateTotal(price, quantity) {
          return price * quantity;
        }

        const total = calculateTotal(10, 5);
      `;

      const result = isObfuscatedCode(normalCode);

      expect(result).toBe(false);
    });
  });

  describe('generateSecurityReport', () => {
    it('should generate success message for valid code', () => {
      const result = {
        isValid: true,
        issues: [],
        score: 100,
      };

      const report = generateSecurityReport(result);

      expect(report).toContain('✅');
      expect(report).toContain('No security issues detected');
    });

    it('should generate warning message for code with low severity issues', () => {
      const result = {
        isValid: true,
        issues: [
          {
            type: SecurityIssueType.INSECURE_RANDOM,
            severity: 'medium',
            message: 'Math.random() is not cryptographically secure',
            suggestion: 'Use crypto.randomBytes()',
          },
        ],
        score: 90,
      };

      const report = generateSecurityReport(result);

      expect(report).toContain('⚠️');
      expect(report).toContain('minor issue');
      expect(report).toContain('Security Score: 90/100');
    });

    it('should generate error message for invalid code', () => {
      const result = {
        isValid: false,
        issues: [
          {
            type: SecurityIssueType.EVAL,
            severity: 'critical',
            message: 'eval() is dangerous',
            suggestion: 'Avoid dynamic code evaluation',
          },
        ],
        score: 60,
      };

      const report = generateSecurityReport(result);

      expect(report).toContain('🚫');
      expect(report).toContain('must be addressed');
      expect(report).toContain('Security Score: 60/100');
    });

    it('should include code snippets and suggestions in report', () => {
      const result = {
        isValid: false,
        issues: [
          {
            type: SecurityIssueType.XSS,
            severity: 'high',
            line: 5,
            message: 'Direct innerHTML assignment',
            suggestion: 'Use textContent instead',
          },
        ],
        score: 75,
      };

      const report = generateSecurityReport(result);

      expect(report).toContain('Line 5');
      expect(report).toContain('Use textContent instead');
    });
  });
});
