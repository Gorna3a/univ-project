import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

interface MarkdownTextProps {
  text: string;
  className?: string;
}

const MarkdownText: React.FC<MarkdownTextProps> = ({ text, className = '' }) => {
  const processText = (input: string): string => {
    const processors = [
      // Code blocks with container + copy button
      (str: string) =>
  str.replace(/```(.*?)\n([\s\S]*?)```/g, (_, lang, code) => {
    const language = lang.trim() || 'text';

    // Step 1: Escape the code to prevent XSS
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // Step 2: Wrap lines starting with "# " in a span with inline style
    const lines = escapedCode.split('\n');
    const processedLines = lines.map((line: string) => {
      if (line.trimStart().startsWith('# ')) {
        return `<span style="color: green; font-weight: bold;">${line}</span>`;
      }
      return line;
    });

    const finalCode = processedLines.join('\n');

    return `
<div class="code-block-container">
  <div class="code-header">
    <span class="code-title">Code Snippet</span>
    <button class="copy-button">Copy</button>
  </div>
  <pre class="language-${language}"><code>${finalCode}</code></pre>
</div>`;
  }),

      // Headings
      (str: string) =>
        str.replace(/^(#{1,6})\s+(.*)$/gm, (_, hashes, content) =>
          `<h${hashes.length} class="heading-${hashes.length}">${content}</h${hashes.length}>`
        ),

        (str: string) => str.replace(/^(-{3,}|\*{3,}|_{3,})(?:\s+(\w+))?$/gm, (_, dashes, style) => {
          const baseClass = 'markdown-hr';
          const styleClass = style ? ` ${baseClass}-${style}` : '';
          return `<hr class="${baseClass}${styleClass}"/>`;
        }),

      // Blockquotes
      (str: string) =>
        str.replace(/^> ?(.*)$/gm, '<blockquote>$1</blockquote>'),

      // Ordered list
      (str: string) =>
        str.replace(/^\d+\.\s(.*)$/gm, '<li>$1</li>').replace(/(<li>.*?<\/li>)/gms, '<ol>$1</ol>'),

      // Unordered list
      (str: string) =>
        str.replace(/^[-*+]\s(.*)$/gm, '<li>$1</li>').replace(/(<li>.*?<\/li>)/gms, '<ul>$1</ul>'),

      // Images
      (str: string) =>
        str.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="markdown-img"/>'),

     // Links
     (str: string) =>
      str.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a style="color:blue;" href="$2" target="_blank" rel="noopener noreferrer">$1</a>'),
// Line breaks
(str: string) =>
str.replace(/ {2,}\n/g, '<br/>'),
(str: string) =>
str.replace(/ {2,}\t/g, '   '),
     // Bold
     (str: string) =>
      str.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>'),
    // H1: # Heading
(str: string) =>
  str.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>'),

// H2: ## Heading
(str: string) =>
  str.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>'),

// H3: ### Heading
(str: string) =>
  str.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>'),

      // Italic
      (str: string) =>
        str.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>'),

      // Inline code
      (str: string) =>
        str.replace(/`([^`]+)`/g, '<code>$1</code>'),

      // Line breaks
      (str: string) =>
        str.replace(/ {2,}\n/g, '<br/>'),
      
      // Markdown tables
      (str: string) =>
        str.replace(
          /^(\|.*\|)\n(\|[\s\-|]*\|)(\n(\|.*\|[\s\S]*?))?/gm,
          (match, headerRow, separatorRow, dataRowsSection) => {
        const dataRows = dataRowsSection
          ?.split('\n')
          .filter((row: string) => row.trim().startsWith('|')) || [];
        
        const headers = headerRow
          .split('|')
          .slice(1, -1)
          .map((cell: string) => cell.trim());
        
        const align = separatorRow
          .split('|')
          .slice(1, -1)
          .map((cell: string) => {
            const trimmed = cell.trim();
            if (/^:?-+:?$/.test(trimmed)) {
          if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
          if (trimmed.startsWith(':')) return 'left';
          if (trimmed.endsWith(':')) return 'right';
            }
            return '';
          });
        
        let html = '<table><thead><tr>';
        headers.forEach((header: string, i: number) => {
          html += `<th${align[i] ? ` style="text-align:${align[i]}"` : ''}>${header}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        dataRows.forEach((row: string) => {
          const cells = row
            .split('|')
            .slice(1, -1)
            .map((cell: string) => cell.trim());
          html += '<tr>';
          cells.forEach((cell: string, i: number) => {
            html += `<td${align[i] ? ` style="text-align:${align[i]}"` : ''}>${cell}</td>`;
          });
          html += '</tr>';
        });
        
        html += '</tbody></table>';
        return html;
          }
        ),

      // Paragraphs
      (str: string) =>
        str.replace(/^(?!<(h\d|ul|ol|li|pre|blockquote|img|hr|code|a|strong|em))([^\n]+)$/gm, '<p>$2</p>')
    ];

    return processors.reduce((acc, processor) => processor(acc), input);
  };

  const createMarkup = () => {
    return { __html: processText(text) };
  };

  // Add Prism.js and copy functionality after markup is inserted
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load Prism.js dynamically if not already loaded
      if (!(window as any).Prism) {
        const prismScript = document.createElement('script');
        prismScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/prism.min.js ';
        prismScript.onload = () => {
          setupCopyButtons();
          (window as any).Prism.highlightAll();
        };
        document.body.appendChild(prismScript);
      } else {
        (window as any).Prism.highlightAll();
        setupCopyButtons();
      }
    }

    function setupCopyButtons() {
      document.querySelectorAll('.copy-button').forEach((btn) => {
        btn.addEventListener('click', () => {
          const codeEl = btn.closest('.code-block-container')?.querySelector('code');
          if (codeEl) {
            const textArea = document.createElement('textarea');
            textArea.value = codeEl.textContent || '';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            toast.success('Code copied to clipboard!', {
              duration: 2000})
          }
        });
      });
    }

    return () => {
      document.querySelectorAll('.copy-button').forEach((btn) => {
        btn.replaceWith(btn.cloneNode(true)); // Remove event listeners
      });
    };
  }, [text]);

  return (
    <div
      className={`markdown-text ${className}`}
      dangerouslySetInnerHTML={createMarkup()}
      style={{
        maxWidth: '100%',
        lineHeight: 1.6,
        fontFamily: 'system-ui, sans-serif'
      }}
    />
  );
};

// Prism.js Theme (Okaidia)
const prismStyle = `
  .markdown-text .code-block-container {
    max-width: 100%;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: #1e293b;
    color: #f8fafc;
    font-family: 'Courier New', monospace;
  }

 .markdown-text .code-header {
  display: flex;
  justify-content: space-between; 
  align-items: center; 
  background-color: #0f172a;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #334155;
  width: 100%;
}

  .markdown-text .code-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: #93c5fd;
  }

  .markdown-text .copy-button {
    padding: 0.3rem 0.75rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background-color 0.2s ease;
  }

  .markdown-text .copy-button:hover {
    background-color: #2563eb;
  }
.markdown-text .output-line {
  color: #48bb78; /* Tailwind green-400 */
  font-weight: bold;
  display: block;}

  .markdown-text pre {
    margin: 0;
    padding: 1rem;
    overflow-x: auto;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  /* Prism.js theme overrides */
  .markdown-text code[class*="language-"],
  .markdown-text pre[class*="language-"] {
    background: #1e293b;
    color: #f8fafc;
    tab-size: 4;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #94a3b8;
  }

  .token.punctuation {
    color: #cbd5e1;
  }

  .token.namespace {
    opacity: 0.7;
  }

  .token.property,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol {
    color: #fbbf24;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #86efac;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #f8fafc;
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: #60a5fa;
  }

  .token.function,
  .token.class-name {
    color: #fbcfe8;
  }

  .token.regex,
  .token.important,
  .token.variable {
    color: #fca5a5;
  }

  .token.italic {
    font-style: italic;
  }

  .token.bold {
    font-weight: bold;
  }

  .token.entity {
    cursor: help;
  }
    
.markdown-text .markdown-hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 2rem 0;
    height: 1px;
    background-color: #e5e7eb;
    opacity: 0.75;
  }

  /* HR variants */
  .markdown-text .markdown-hr-dotted {
    border-top: 2px dotted #d1d5db;
    background-color: transparent;
    height: auto;
  }

  .markdown-text .markdown-hr-dashed {
    border-top: 2px dashed #d1d5db;
    background-color: transparent;
    height: auto;
  }

  .markdown-text .markdown-hr-thick {
    border-top: 4px solid #9ca3af;
    background-color: transparent;
    opacity: 1;
  }

  .markdown-text .markdown-hr-gradient {
    height: 2px;
    background: linear-gradient(90deg, transparent, #9ca3af, transparent);
    border: none;
    opacity: 1;
  }

`;

// Inject global styles
const styleElement = document.createElement('style');
styleElement.innerHTML = prismStyle;
document.head.appendChild(styleElement);

export default MarkdownText;