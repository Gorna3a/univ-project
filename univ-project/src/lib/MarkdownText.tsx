import React from 'react';

interface MarkdownTextProps {
  text: string;
  className?: string;
}

const MarkdownText: React.FC<MarkdownTextProps> = ({ text, className = '' }) => {
  const processText = (input: string): string => {
    const processors = [
      // Code blocks ```
      (str: string) => str.replace(/```(.*?)\n([\s\S]*?)```/g, (_, lang, code) =>
        `<pre class="language-${lang.trim() || 'text'}"><code>${code.trim()}</code></pre>`
      ),

      // Headings
      (str: string) => str.replace(/^(#{1,6})\s+(.*)$/gm, (_, hashes, content) =>
        `<h${hashes.length} class="heading-${hashes.length}">${content}</h${hashes.length}>`
      ),

      // Horizontal rules
      (str: string) => str.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, '<hr/>'),

      // Blockquotes
      (str: string) => str.replace(/^> ?(.*)$/gm, '<blockquote>$1</blockquote>'),

      // Ordered list
      (str: string) => str.replace(/^\d+\.\s(.*)$/gm, '<li>$1</li>').replace(/(<li>.*<\/li>)/gms, '<ol>$1</ol>'),

      // Unordered list
      (str: string) => str.replace(/^[-*+]\s(.*)$/gm, '<li>$1</li>').replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>'),

      // Images ![alt](url)
      (str: string) => str.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="markdown-img"/>'),

      // Links
      (str: string) => str.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'),

      // Bold
      (str: string) => str.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>'),

      // Italic
      (str: string) => str.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>'),

      // Inline code
      (str: string) => str.replace(/`([^`]+)`/g, '<code>$1</code>'),

      // Line breaks
      (str: string) => str.replace(/ {2,}\n/g, '<br/>'),

      // Paragraphs
      (str: string) => str.replace(/^(?!<(h\d|ul|ol|li|pre|blockquote|img|hr|code|a|strong|em))([^\n]+)$/gm, '<p>$2</p>')
    ];

    return processors.reduce((acc, processor) => processor(acc), input);
  };

  const createMarkup = () => {
    return { __html: processText(text) };
  };

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

const styles = `
  .markdown-text h1 {
    font-size: 2rem;
    font-weight: 800;
    margin: 1.5rem 0 1rem;
  }
  .markdown-text h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 1.25rem 0 0.75rem;
  }
  .markdown-text h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 1rem 0 0.5rem;
  }
  .markdown-text p {
    margin: 0.75rem 0;
  }
  .markdown-text strong {
    font-weight: 600;
  }
  .markdown-text em {
    font-style: italic;
  }
  .markdown-text code {
    font-family: 'Courier New', monospace;
    background: #f3f4f6;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.9em;
  }
  .markdown-text pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
  }
  .markdown-text blockquote {
    border-left: 4px solid #d1d5db;
    padding-left: 1rem;
    color: #6b7280;
    margin: 1rem 0;
    font-style: italic;
  }
  .markdown-text ul, .markdown-text ol {
    padding-left: 1.5rem;
    margin: 1rem 0;
  }
  .markdown-text li {
    margin-bottom: 0.5rem;
  }
  .markdown-text a {
    color: #3b82f6;
    text-decoration: underline;
  }
  .markdown-text a:hover {
    color: #2563eb;
  }
  .markdown-text hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 1.5rem 0;
  }
  .markdown-text img.markdown-img {
    max-width: 100%;
    height: auto;
    margin: 1rem 0;
    border-radius: 0.5rem;
  }
`;

const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default MarkdownText;
