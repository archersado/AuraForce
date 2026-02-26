/**
 * AI Code Assistant Component Tests
 *
 * Tests for AI Code Assistant UI component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AICodeAssistant from '@/components/workspace/AICodeAssistant';

// Mock apiFetch
jest.mock('@/lib/api-client', () => ({
  apiPost: jest.fn(),
}));

import { apiPost } from '@/lib/api-client';

describe('AICodeAssistant Component', () => {
  const mockCode = `function greet(name) {
  return 'Hello, ' + name;
}`;

  const mockOnApply = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (apiPost as jest.Mock).mockReset();
  });

  describe('Rendering', () => {
    it('should render AI assistant when open', () => {
      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
        />
      );

      expect(screen.getByText('AI 代码助手')).toBeInTheDocument();
      expect(screen.getByText('改善这个函数')).toBeInTheDocument();
      expect(screen.getByText('添加注释')).toBeInTheDocument();
      expect(screen.getByText('重构代码')).toBeInTheDocument();
      expect(screen.getByText('优化性能')).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      const { container } = render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={false}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render close button when onClose provided', () => {
      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByLabelText('Close');
      expect(closeButton).toBeInTheDocument();
    });

    it('should render help text initially', () => {
      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
        />
      );

      expect(screen.getByText(/使用提示/)).toBeInTheDocument();
    });

    it('should display command input', () => {
      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
        />
      );

      const input = screen.getByPlaceholderText(/输入指令/);
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');
    });
  });

  describe('Quick Actions', () => {
    it('should trigger quick action on click', async () => {
      const mockResponse = {
        success: true,
        suggestion: mockCode + '\n// Improved',
        original: mockCode,
        diff: {
          changes: [],
          additions: 1,
          deletions: 0,
          summary: '+1 -0',
        },
        explanation: 'Added comments',
        confidence: 0.85,
        security: {
          isValid: true,
          score: 100,
          issues: [],
        },
        meta: {},
      };

      (apiPost as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      });

      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
        />
      );

      const improveButton = screen.getByText('改善这个函数');
      fireEvent.click(improveButton);

      expect(apiPost).toHaveBeenCalledWith('/api/ai/code-assist', {
        command: 'Improve this function',
        code: mockCode,
        language: 'javascript',
        sessionId: undefined,
      });
    });

    it('should disable buttons during processing', async () => {
      let resolvePromise: (value: any) => void;
      const pendingResponse = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      (apiPost as jest.Mock).mockReturnValue({
        json: () => pendingResponse,
      });

      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
        />
      );

      const improveButton = screen.getByText('改善这个函数');
      fireEvent.click(improveButton);

      await waitFor(() => {
        expect(improveButton).toBeDisabled();
      });

      // Clean up
      resolvePromise!({ success: true, suggestion: '' });
    });
  });

  describe('Custom Commands', () => {
    it('should submit custom command', async () => {
      const mockResponse = {
        success: true,
        suggestion: mockCode,
        original: mockCode,
        diff: {
          changes: [],
          additions: 0,
          deletions: 0,
          summary: '+0 -0',
        },
        explanation: 'No changes needed',
        confidence: 1,
        security: {
          isValid: true,
          score: 100,
          issues: [],
        },
        meta: {},
      };

      (apiPost as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      });

      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
        />
      );

      const input = screen.getByPlaceholderText(/输入指令/);
      fireEvent.change(input, { target: { value: 'simpleify this code' } });

      const submitButton = screen.getByRole('button', { name: /🚀/ }); // Rocket icon
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(apiPost).toHaveBeenCalledWith('/api/ai/code-assist', {
          command: 'simpleify this code',
          code: mockCode,
          language: 'javascript',
          sessionId: undefined,
        });
      });
    });

    it('should not submit empty command', async () => {
      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
        />
      );

      const input = screen.getByPlaceholderText(/输入指令/);
      expect(input).toHaveValue('');

      const submitButton = screen.getByRole('button', { name: /🚀/ });
      expect(submitButton).toBeDisabled();
    });

    it('should submit on Enter key', async () => {
      const mockResponse = {
        success: true,
        suggestion: mockCode,
        original: mockCode,
        diff: {
          changes: [],
          additions: 0,
          deletions: 0,
          summary: '+0 -0',
        },
        explanation: 'OK',
        confidence: 1,
        security: {
          isValid: true,
          score: 100,
          issues: [],
        },
        meta: {},
      };

      (apiPost as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      });

      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
        />
      );

      const input = screen.getByPlaceholderText(/输入指令/);
      fireEvent.change(input, { target: { value: 'add types' } });
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(apiPost).toHaveBeenCalled();
      });
    });
  });

  describe('Processing State', () => {
    it('should show loading indicator during processing', async () => {
      let resolvePromise: (value: any) => void;
      const pendingResponse = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      (apiPost as jest.Mock).mockReturnValue({
        json: () => pendingResponse,
      });

      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
        />
      );

      fireEvent.click(screen.getByText('改善这个函数'));

      await waitFor(() => {
        expect(screen.getByText(/AI 正在分析代码/)).toBeInTheDocument();
      });

      // Clean up
      resolvePromise!({ success: true, suggestion: '' });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on API failure', async () => {
      (apiPost as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
        />
      );

      fireEvent.click(screen.getByText('改善这个函数'));

      await waitFor(() => {
        expect(screen.getByText(/Error/i)).toBeInTheDocument();
        expect(screen.getByText(/Network error/)).toBeInTheDocument();
      });
    });

    it('should dismiss error on close button click', async () => {
      (apiPost as jest.Mock).mockRejectedValue(new Error('Test error'));

      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
        />
      );

      fireEvent.click(screen.getByText('改善这个函数'));

      await waitFor(() => {
        expect(screen.getByText(/Error/i)).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /✕/ });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText(/Error/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Suggestions', () => {
    it('should display suggestion after successful response', async () => {
      const mockResponse = {
        success: true,
        suggestion: mockCode + '\n// Added comments',
        original: mockCode,
        diff: {
          changes: [
            {
              type: 'add',
              content: '// Added comments',
              lineNumber: 3,
            },
          ],
          additions: 1,
          deletions: 0,
          summary: '+1 -0',
        },
        explanation: 'Added documentation',
        confidence: 0.9,
        security: {
          isValid: true,
          score: 100,
          issues: [],
        },
        meta: {
          sessionId: 'test-session',
        },
      };

      (apiPost as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      });

      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
        />
      );

      fireEvent.click(screen.getByText('改善这个函数'));

      await waitFor(() => {
        expect(screen.getByText(/改動說明/)).toBeInTheDocument();
        expect(screen.getByText('Added documentation')).toBeInTheDocument();
        expect(screen.getByText(/置信度: 90%/)).toBeInTheDocument();
      });
    });

    it('should show security warning for invalid security', async () => {
      const mockResponse = {
        success: true,
        suggestion: 'eval("bad code")',
        original: mockCode,
        diff: {
          changes: [],
          additions: 0,
          deletions: 0,
          summary: '+0 -0',
        },
        explanation: 'Refactored',
        confidence: 0.8,
        security: {
          isValid: false,
          score: 0,
          issues: [
            {
              type: 'EVAL',
              severity: 'critical',
              message: 'eval usage detected',
              suggestion: 'Use safer alternatives',
            },
          ],
          report: 'Security issues found',
        },
        meta: {},
      };

      (apiPost as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      });

      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
        />
      );

      fireEvent.click(screen.getByText('改善这个函数'));

      await waitFor(() => {
        expect(screen.getByText(/安全警告/)).toBeInTheDocument();
        expect(screen.getByText(/存在安全问题/)).toBeInTheDocument();
      });
    });
  });

  describe('Apply/Reject', () => {
    beforeEach(() => {
      const mockResponse = {
        success: true,
        suggestion: mockCode + '\n// Improved',
        original: mockCode,
        diff: {
          changes: [],
          additions: 0,
          deletions: 0,
          summary: '+0 -0',
        },
        explanation: 'Improved',
        confidence: 0.9,
        security: {
          isValid: true,
          score: 100,
          issues: [],
        },
        meta: {},
      };

      (apiPost as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      });
    });

    it('should apply suggestion on Apply button click', async () => {
      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
        />
      );

      fireEvent.click(screen.getByText('改善这个函数'));

      await waitFor(() => {
        const applyButton = screen.getByText('应用建议');
        expect(applyButton).toBeInTheDocument();
      });

      const applyButton = screen.getByText('应用建议');
      fireEvent.click(applyButton);

      expect(mockOnApply).toHaveBeenCalledWith(mockCode + '\n// Improved');
    });

    it('should not allow applying suggestions with security issues', async () => {
      const mockResponse = {
        success: true,
        suggestion: 'eval("bad")',
        original: mockCode，
        diff: {
          changes: [],
          additions: 0,
          deletions: 0,
          summary: '+0 -0',
        },
        explanation: 'Refactored',
        confidence: 0.7,
        security: {
          isValid: false,
          score: 0,
          issues: [
            {
              type: 'EVAL',
              severity: 'critical',
              message: 'eval usage',
            },
          ],
        },
        meta: {},
      };

      (apiPost as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      });

      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
        />
      );

      fireEvent.click(screen.getByText('改善这个函数'));

      await waitFor(() => {
        const applyButton = screen.getByText('应用建议');
        expect(applyButton).toBeDisabled();
      });
    });

    it('should reject suggestion on Reject button click', async () => {
      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
        />
      );

      fireEvent.click(screen.getByText('改善这个函数'));

      await waitFor(() => {
        const rejectButton = screen.getByText('拒绝');
        expect(rejectButton).toBeInTheDocument();
      });

      const rejectButton = screen.getByText('拒绝');
      fireEvent.click(rejectButton);

      await waitFor(() => {
        expect(screen.queryByText(/改動說明/)).not.toBeInTheDocument();
      });

      expect(mockOnApply).not.toHaveBeenCalled();
    });
  });

  describe('Close Button', () => {
    it('should call onClose when close button clicked', () => {
      render(
        <AICodeAssistant
          code={mockCode}
          language="javascript"
          onApplySuggestion={mockOnApply}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
