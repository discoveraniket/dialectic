import React from 'react';
import katex from 'katex';

interface FormattedContentProps {
  content: string;
}

export const MarkdownAndLatexRenderer: React.FC<FormattedContentProps> = ({ content }) => {
  if (!content) return null;

  // Split into code fences first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-xs leading-relaxed text-[#cccccc] font-sans selection:bg-[#264f78]">
      {parts.map((part, partIdx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const language = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : '';
          const codeText = language ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <div key={partIdx} className="my-2 rounded bg-[#141414] border border-[#2b2b2b] overflow-hidden">
              <div className="flex items-center justify-between px-2.5 py-1 bg-[#1a1a1a] text-[10px] text-[#888888] border-b border-[#2b2b2b]">
                <span>{language || 'code'}</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(codeText)}
                  className="hover:text-white transition-colors cursor-pointer"
                  title="Copy code"
                >
                  Copy
                </button>
              </div>
              <pre className="p-2.5 text-[11px] font-mono text-[#d4d4d4] overflow-x-auto whitespace-pre">
                {codeText}
              </pre>
            </div>
          );
        }

        // Process non-code content for display math ($$...$$)
        return (
          <div key={partIdx}>
            {renderTextAndMath(part)}
          </div>
        );
      })}
    </div>
  );
};

function renderTextAndMath(text: string) {
  // Split on display math $$...$$
  const displayMathParts = text.split(/(\$\$[\s\S]*?\$\$)/g);

  return displayMathParts.map((segment, segIdx) => {
    if (segment.startsWith('$$') && segment.endsWith('$$')) {
      const mathExpr = segment.slice(2, -2).trim();
      try {
        const mathHtml = katex.renderToString(mathExpr, { displayMode: true, throwOnError: false });
        return (
          <div
            key={segIdx}
            className="my-2.5 py-1.5 px-2 bg-[#171717] border border-[#262626] rounded text-center overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: mathHtml }}
          />
        );
      } catch {
        return (
          <div key={segIdx} className="my-2 font-mono text-xs text-sky-400 text-center">
            {mathExpr}
          </div>
        );
      }
    }

    // Process regular text paragraphs, headers, and lists
    const lines = segment.split('\n');
    return (
      <React.Fragment key={segIdx}>
        {lines.map((line, lineIdx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={lineIdx} className="h-1.5" />;
          }

          // Headers
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={lineIdx} className="font-semibold text-white text-[13px] mt-2 mb-1">
                {renderInlineFormatting(trimmed.slice(4))}
              </h4>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={lineIdx} className="font-semibold text-white text-sm mt-2.5 mb-1 text-[#38bdf8]">
                {renderInlineFormatting(trimmed.slice(3))}
              </h3>
            );
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h2 key={lineIdx} className="font-bold text-white text-base mt-3 mb-1.5">
                {renderInlineFormatting(trimmed.slice(2))}
              </h2>
            );
          }

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <div key={lineIdx} className="flex items-start space-x-1.5 ml-2 my-0.5">
                <span className="text-[#38bdf8] font-bold text-xs select-none">•</span>
                <span className="flex-1">{renderInlineFormatting(trimmed.slice(2))}</span>
              </div>
            );
          }

          // Numbered lists
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
          if (numMatch) {
            return (
              <div key={lineIdx} className="flex items-start space-x-1.5 ml-2 my-0.5">
                <span className="text-[#888888] font-mono text-[11px] select-none">{numMatch[1]}.</span>
                <span className="flex-1">{renderInlineFormatting(numMatch[2])}</span>
              </div>
            );
          }

          // Regular paragraph line
          return (
            <p key={lineIdx} className="my-0.5">
              {renderInlineFormatting(line)}
            </p>
          );
        })}
      </React.Fragment>
    );
  });
}

function renderInlineFormatting(line: string) {
  // Split on inline math $...$
  const inlineMathParts = line.split(/(\$[^\$]+?\$)/g);

  return inlineMathParts.map((sub, idx) => {
    if (sub.startsWith('$') && sub.endsWith('$') && sub.length > 2) {
      const expr = sub.slice(1, -1);
      try {
        const mathHtml = katex.renderToString(expr, { displayMode: false, throwOnError: false });
        return (
          <span
            key={idx}
            className="inline-math mx-0.5 text-sky-200"
            dangerouslySetInnerHTML={{ __html: mathHtml }}
          />
        );
      } catch {
        return <code key={idx} className="font-mono text-sky-300">{expr}</code>;
      }
    }

    // Bold formatting: **text**
    const boldParts = sub.split(/(\*\*[^\*]+?\*\*)/g);
    return (
      <React.Fragment key={idx}>
        {boldParts.map((bSub, bIdx) => {
          if (bSub.startsWith('**') && bSub.endsWith('**') && bSub.length > 4) {
            return (
              <strong key={bIdx} className="font-semibold text-white">
                {bSub.slice(2, -2)}
              </strong>
            );
          }
          // Inline code: `code`
          const codeParts = bSub.split(/(`[^`]+?`)/g);
          return (
            <React.Fragment key={bIdx}>
              {codeParts.map((cSub, cIdx) => {
                if (cSub.startsWith('`') && cSub.endsWith('`') && cSub.length > 2) {
                  return (
                    <code
                      key={cIdx}
                      className="px-1 py-0.5 bg-[#252525] border border-[#333333] rounded font-mono text-[11px] text-[#38bdf8]"
                    >
                      {cSub.slice(1, -1)}
                    </code>
                  );
                }
                return cSub;
              })}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  });
}

export default MarkdownAndLatexRenderer;
