'use client';

import React, { useState, useEffect } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { useTheme } from 'next-themes';
import { Sun, Moon, RotateCcw, Copy, Check } from 'lucide-react';
import { SandpackEditorProps } from './types';

const SandpackEditor: React.FC<SandpackEditorProps> = ({
  initialCode,
  language = 'javascript',
  readOnly = false,
  theme: propTheme = 'auto',
  onCodeChange,
  height = 400,
}) => {
  const { theme: systemTheme } = useTheme();
  const [currentCode, setCurrentCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);

  // Determine the actual theme to use
  const getActualTheme = () => {
    if (propTheme === 'auto') {
      return systemTheme === 'dark' ? 'dark' : 'light';
    }
    return propTheme;
  };

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);
    onCodeChange?.(code);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleReset = () => {
    setCurrentCode(initialCode);
    onCodeChange?.(initialCode);
  };

  // Get the appropriate template and files based on language
  const getSandpackConfig = () => {
    const baseConfig = {
      template: 'vanilla' as const,
      theme: getActualTheme() as 'dark' | 'light',
      options: {
        showConsole: true,
        showTabs: false,
        showLineNumbers: true,
        showInlineErrors: true,
        wrapContent: true,
        editorHeight: height,
        autorun: false,
      },
    };

    switch (language) {
      case 'javascript':
        return {
          ...baseConfig,
          files: {
            '/index.js': currentCode,
          },
        };
      case 'html':
        return {
          ...baseConfig,
          files: {
            '/index.html': currentCode,
          },
        };
      case 'css':
        return {
          ...baseConfig,
          files: {
            '/styles.css': currentCode,
            '/index.html': '<!DOCTYPE html>\n<html>\n<head>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <h1>CSS Preview</h1>\n</body>\n</html>',
          },
        };
      case 'python':
        // For Python, we'll use a different approach since Sandpack doesn't support Python directly
        return {
          ...baseConfig,
          files: {
            '/index.js': `// Python code execution simulation\nconsole.log("Python execution not yet supported in this version");\nconsole.log("Code:", \`${currentCode}\`);`,
          },
        };
      default:
        return {
          ...baseConfig,
          files: {
            '/index.js': currentCode,
          },
        };
    }
  };

  const config = getSandpackConfig();

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-2">
            {language.toUpperCase()}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4 text-gray-500" />
          </button>
          
          <div className="flex items-center rounded-md border border-gray-200 dark:border-gray-600">
            <button
              className={`p-1.5 rounded-l-md transition-colors ${
                getActualTheme() === 'light'
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title="Light theme"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              className={`p-1.5 rounded-r-md transition-colors ${
                getActualTheme() === 'dark'
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title="Dark theme"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sandpack Editor */}
      <div className="relative">
        <Sandpack
          template={config.template}
          theme={config.theme}
          files={config.files}
          options={config.options}
          customSetup={{
            dependencies: {},
          }}
        />
      </div>
    </div>
  );
};

export default SandpackEditor; 