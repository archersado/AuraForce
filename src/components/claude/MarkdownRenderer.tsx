/**
 * MarkdownRenderer Component
 *
 * Enhanced markdown rendering with:
 * - GFM (GitHub Flavored Markdown) support
 * - Math formula rendering (LaTeX: $inline$ and $$block$$)
 * - Code blocks with syntax highlighting and copy button
 * - Table rendering
 * - Blockquote support
 * - Link handling (new window)
 * - HTML entity decoding
 * - Math formula protection from escape characters
 */

'use client';

import React, { useState, useCallback, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
  isUserMessage?: boolean;
}

/**
 * Protects math formulas from being escaped during markdown processing
 * Replaces $...$ and $$...$$ with temporary placeholders
 */
function protectMathFormulas(text: string): { text: string; formulas: Array<{ placeholder: string; original: string }> } {
  const formulas: Array<{ placeholder: string; original: string }> = [];
  let protectedText = text;
  let counter = 0;

  // Match block math ($$...$$)
  protectedText = protectedText.replace(/\$\$([^$]+?)\$\$/g, (match) => {
    const placeholder = `__MATH_BLOCK_${counter}__`;
    formulas.push({ placeholder, original: match });
    counter++;
    return placeholder;
  });

  // Match inline math ($...$)
  protectedText = protectedText.replace(/\$([^$\n]+?)\$/g, (match) => {
    const placeholder = `__MATH_INLINE_${counter}__`;
    formulas.push({ placeholder, original: match });
    counter++;
    return placeholder;
  });

  return { text: protectedText, formulas };
}

/**
 * Restores math formulas from placeholders
 */
function restoreMathFormulas(text: string, formulas: Array<{ placeholder: string; original: string }>): string {
  let restoredText = text;
  for (const { placeholder, original } of formulas) {
    restoredText = restoredText.replace(placeholder, original);
  }
  return restoredText;
}

/**
 * Copy to clipboard function with fallback for older browsers
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        textArea.remove();
        return successful;
      } catch (err) {
        textArea.remove();
        console.error('Fallback copy to clipboard failed:', err);
        return false;
      }
    }
  } catch (err) {
    console.error('Copy to clipboard failed:', err);
    return false;
  }
}

/**
 * Code block with syntax highlighting and copy button
 */
const CodeBlock = memo(({ language, children, isUser }: { language: string; children: string; isUser?: boolean }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(String(children));
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [children]);

  return (
    <div className="relative my-3 rounded-lg overflow-hidden bg-gray-900 group">
      {/* Language indicator and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400 font-mono uppercase">{language || 'text'}</span>
        <button
          onClick={handleCopy}
          className="px-2 py-1 text-xs text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Copy code"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {/* Code content */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language || 'text'}
          style={vscDarkPlus as React.CSSProperties}
          PreTag="pre"
          className="!mt-0 !bg-transparent !p-0"
          codeTagProps={{ className: '!bg-transparent !py-0 !px-4' }}
          showLineNumbers
          lineNumberStyle={{
            color: '#6b7280',
            backgroundColor: '#111827',
            paddingRight: '1rem',
            minWidth: '2.5rem',
            textAlign: 'right',
            userSelect: 'none',
          }}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';

/**
 * Enhanced markdown renderer component
 */
export const MarkdownRenderer = memo(({ content, isStreaming = false, isUserMessage = false }: MarkdownRendererProps) => {
  // During streaming, protect math formulas to prevent processing issues
  const { text: protectedContent, formulas } = protectMathFormulas(content);

  return (
    <div className={`prose prose-sm max-w-none ${isUserMessage ? 'prose-invert' : ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Code blocks with syntax highlighting and copy button
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;

            // During streaming, render code blocks as plain text until complete
            // to prevent unnecessary syntax highlighting recalculations
            const isStreamingAndIncomplete = isStreaming && !match;

            return !isInline && match ? (
              <CodeBlock language={match[1]} isUser={isUserMessage}>
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            ) : (
              <code
                className={`
                  ${className || ''}
                  ${
                    isUserMessage
                      ? 'bg-purple-500/30 text-white'
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }
                  px-1.5 py-0.5 rounded text-sm font-mono
                `}
                {...props}
              >
                {children}
              </code>
            );
          },
          // Paragraphs with proper spacing
          p: ({ children }) => (
            <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
          ),
          // Unordered lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 space-y-1 marker:text-gray-500">{children}</ul>
          ),
          // Ordered lists
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 space-y-1 marker:text-gray-500">{children}</ol>
          ),
          // Tasks (GFM)
          input: ({ checked, ...props }: any) => (
            <input
              type="checkbox"
              checked={checked}
              disabled
              className="mr-2 rounded border-gray-300"
              {...props}
            />
          ),
          // Links - open in new window
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={isUserMessage ? 'text-purple-200 hover:text-purple-100' : 'text-blue-600 hover:text-blue-700 underline decoration-blue-300 hover:decoration-blue-500 underline-offset-2'}
            >
              {children}
            </a>
          ),
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gold-500 pl-4 my-4 italic bg-gradient-to-r from-gold-50/50 to-transparent py-2 rounded-r">
              {children}
            </blockquote>
          ),
          // Tables (GFM)
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100 dark:bg-gray-700">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody>
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-gray-200 dark:border-gray-600 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
              {children}
            </td>
          ),
          // Heading levels
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 mt-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mb-3 mt-5 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold mb-2 mt-4 text-gray-900 dark:text-gray-100">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-bold mb-2 mt-3 text-gray-900 dark:text-gray-100">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-bold mb-2 mt-3 text-gray-900 dark:text-gray-100">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-xs font-bold mb-2 mt-3 text-gray-900 dark:text-gray-100">
              {children}
            </h6>
          ),
          // Horizontal rule
          hr: () => (
            <hr className="my-6 border-gray-300 dark:border-gray-700 border-t-2" />
          ),
          // Strong/bold
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900 dark:text-gray-100">
              {children}
            </strong>
          ),
          // Emphasis/italic
          em: ({ children }) => (
            <em className="italic text-gray-800 dark:text-gray-200">
              {children}
            </em>
          ),
          // Deletion
          del: ({ children }) => (
            <del className="line-through text-gray-400 dark:text-gray-500">
              {children}
            </del>
          ),
          // Code fences language tag (already handled by code component)
        }}
      >
        {protectedContent}
      </ReactMarkdown>
    </div>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';
