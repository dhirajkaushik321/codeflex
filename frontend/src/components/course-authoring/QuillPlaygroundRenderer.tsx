import React from 'react';
import Playground from '../playground/Playground';

interface QuillPlaygroundRendererProps {
  html: string;
}

// Utility to replace playground placeholders with React components
export default function QuillPlaygroundRenderer({ html }: QuillPlaygroundRendererProps) {
  // Parse the HTML and replace playground markers (escaped and unescaped)
  const playgroundRegex = /<!--PLAYGROUND:([\s\S]*?)-->|&lt;!--PLAYGROUND:([\s\S]*?)--&gt;/g;
  const parts: (string | { type: 'playground', code: string })[] = [];
  let lastIndex = 0;
  let match;
  while ((match = playgroundRegex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      parts.push(html.slice(lastIndex, match.index));
    }
    // Use whichever group matched
    const code = decodeURIComponent(match[1] || match[2] || '');
    parts.push({ type: 'playground', code });
    lastIndex = playgroundRegex.lastIndex;
  }
  if (lastIndex < html.length) {
    parts.push(html.slice(lastIndex));
  }
  return (
    <div>
      {parts.map((part, i) => {
        if (typeof part === 'string') {
          return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
        }
        if (part.type === 'playground') {
          return <Playground key={i} language="javascript" initialCode={part.code} />;
        }
        return null;
      })}
    </div>
  );
} 