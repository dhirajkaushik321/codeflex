import React, { useState } from 'react';
import Button from '../ui/Button';
import SandpackEditor from './SandpackEditor';

interface PlaygroundProps {
  language: 'javascript' | 'html' | 'css' | 'python';
  initialCode?: string;
  readOnly?: boolean;
  title?: string;
  description?: string;
}

const defaultSnippets: Record<string, string> = {
  javascript: `const greet = () => {\n  console.log('Hello, world!');\n}\ngreet();`,
  html: `<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello, world!</h1>\n  </body>\n</html>`,
  css: `body {\n  background: #f0f0f0;\n  color: #222;\n}`,
  python: `print('Hello, world!')`,
};

export const Playground: React.FC<PlaygroundProps> = ({
  language,
  initialCode,
  readOnly = false,
  title = 'Playground',
  description = '',
}) => {
  const [code, setCode] = useState(initialCode || defaultSnippets[language]);

  const handleReset = () => {
    setCode(initialCode || defaultSnippets[language]);
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl p-6 max-w-2xl mx-auto my-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {title} <span className="ml-2 text-xs font-medium text-gray-400">[{language}]</span>
        </h2>
      </div>
      
      {description && (
        <div className="text-gray-500 text-sm mb-3">{description}</div>
      )}
      
      <div className="mb-3">
        <SandpackEditor
          initialCode={code}
          language={language}
          readOnly={readOnly}
          onCodeChange={setCode}
          height={300}
        />
      </div>
      
      <div className="flex gap-3">
        <Button onClick={handleReset} variant="secondary">Reset</Button>
      </div>
      
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
};

export default Playground; 