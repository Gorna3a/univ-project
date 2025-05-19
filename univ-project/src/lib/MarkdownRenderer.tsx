import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import toast from 'react-hot-toast';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const CodeBlock = ({ inline, className, children, ...props }: any) => {
    if (inline) {
      return <code className={className} {...props} />;
    }

    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'text';
    const codeContent = String(children).replace(/\n$/, '');

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(codeContent);
        toast.success('Copied!');
      } catch (err) {
        toast.error('Failed to copy');
      }
    };

    return (
      <div className="code-block-container">
        <div className="code-header">
          <span className="code-title">{language}</span>
          <button className="copy-button" onClick={handleCopy}>
            Copy
          </button>
        </div>
        <SyntaxHighlighter
          style={atomDark}
          language={language}
          PreTag="div"
          {...props}
        >
          {codeContent}
        </SyntaxHighlighter>
      </div>
    );
  };

  const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ children, ...props }) => (
    <div className="table-container">
      <table className="markdown-table" {...props}>{children}</table>
    </div>
  );

  return (
    <div className="markdown-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
          table: Table,
          th: ({ children }) => <th className="table-header">{children}</th>,
          td: ({ children }) => <td className="table-cell">{children}</td>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="markdown-link">
              {children}
            </a>
          ),
          hr: ({ node, ...props }) => <hr className="markdown-hr" {...props} />,
          img: ({ src, alt }) => <img src={src} alt={alt} className="markdown-img" />,
          blockquote: ({ children }) => <blockquote className="markdown-blockquote">{children}</blockquote>,
        }}
      >
        {content}
      </ReactMarkdown>

      <style >{`
        .markdown-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          line-height: 1.6;
          font-family: system-ui, sans-serif;
        }

        /* Tables */
        .table-container {
          width: 100%;
          overflow-x: auto;
          margin: 1.5rem 0;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .markdown-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .markdown-table th,
        .markdown-table td {
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          text-align: left;
        }

        .table-header {
          background-color: #f3f4f6 !important;
          font-weight: 600;
          color: #1f2937;
        }

        .table-cell {
          background-color: white;
          color: #374151;
        }

        .markdown-table tr:nth-child(even) td {
          background-color: #f9fafb;
        }

        .markdown-table tr:hover td {
          background-color: #f3f4f6;
        }

        /* Code blocks */
        .code-block-container {
          position: relative;
          margin: 1.5rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          background: #1e293b;
          color: #f8fafc;
        }

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          background: #0f172a;
          border-bottom: 1px solid #334155;
        }

        .code-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #93c5fd;
        }

        .copy-button {
          padding: 0.3rem 0.75rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .copy-button:hover {
          background: #2563eb;
        }

        /* Links */
        .markdown-link {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }

        .markdown-link:hover {
          text-decoration: underline;
        }

        /* Horizontal rules */
        .markdown-hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2rem 0;
        }

        /* Blockquotes */
        .markdown-blockquote {
          border-left: 4px solid #3b82f6;
          padding: 0.5rem 1rem;
          margin: 1rem 0;
          background-color: #f3f4f6;
          color: #1f2937;
        }

        /* Images */
        .markdown-img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        /* Dark mode */
        .dark .markdown-table {
          background: #1f2937;
        }

        .dark .table-header {
          background-color: #111827 !important;
          color: #f9fafb !important;
          border-color: #374151 !important;
        }

        .dark .table-cell {
          background-color: #1f2937 !important;
          color: #f9fafb !important;
          border-color: #374151 !important;
        }

        .dark .markdown-table tr:nth-child(even) td {
          background-color: #1e293b !important;
        }

        .dark .markdown-table tr:hover td {
          background-color: #374151 !important;
        }

        .dark .markdown-blockquote {
          background-color: #1e293b;
          border-left-color: #60a5fa;
          color: #f3f4f6;
        }

        .dark .code-block-container {
          background: #0f172a;
        }
      `}</style>
    </div>
  );
};

export default MarkdownRenderer;