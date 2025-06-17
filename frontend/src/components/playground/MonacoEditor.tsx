'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { Sun, Moon, RotateCcw, Copy, Check, Play, Settings } from 'lucide-react';
import { MonacoEditorProps } from './types';

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  initialCode,
  language = 'javascript',
  readOnly = false,
  theme: propTheme = 'auto',
  onCodeChange,
  height = 400,
}) => {
  const { theme: systemTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [currentCode, setCurrentCode] = useState(initialCode);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const hasUserTyped = useRef(false);
  const lastUserCode = useRef(initialCode);
  const editorRef = useRef<any>(null);

  console.log('[MonacoEditor] Render - initialCode:', initialCode, 'currentCode:', currentCode, 'hasUserTyped:', hasUserTyped.current);

  // Only update currentCode from initialCode if user hasn't typed yet
  useEffect(() => {
    console.log('[MonacoEditor] useEffect - initialCode changed to:', initialCode, 'hasUserTyped:', hasUserTyped.current);
    if (!hasUserTyped.current) {
      console.log('[MonacoEditor] Updating currentCode from initialCode (user hasn\'t typed yet)');
      setCurrentCode(initialCode);
      lastUserCode.current = initialCode;
    } else {
      console.log('[MonacoEditor] Ignoring initialCode change because user has typed');
    }
  }, [initialCode]);

  // Determine the actual theme to use
  const getActualTheme = () => {
    if (propTheme === 'auto') {
      return systemTheme === 'dark' ? 'vs-dark' : 'light';
    }
    return propTheme === 'dark' ? 'vs-dark' : 'light';
  };

  // Map language to Monaco language
  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case 'javascript':
        return 'javascript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'python':
        return 'python';
      default:
        return 'javascript';
    }
  };

  const handleCodeChange = (code: string) => {
    console.log('[MonacoEditor] handleCodeChange called with:', code);
    console.log('[MonacoEditor] Previous currentCode:', currentCode);
    
    // Mark that user has typed
    if (!hasUserTyped.current) {
      console.log('[MonacoEditor] User has started typing - marking hasUserTyped = true');
      hasUserTyped.current = true;
    }
    
    setCurrentCode(code);
    lastUserCode.current = code;
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
    console.log('[MonacoEditor] Reset button clicked');
    console.log('[MonacoEditor] Resetting to initialCode:', initialCode);
    setCurrentCode(initialCode);
    hasUserTyped.current = false;
    lastUserCode.current = initialCode;
    onCodeChange?.(initialCode);
    
    // Update the editor content
    if (editorRef.current) {
      editorRef.current.setValue(initialCode);
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    console.log('[MonacoEditor] Editor mounted');
    editorRef.current = editor;
    setIsEditorReady(true);

    // Configure editor options for better UX
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Consolas, "Courier New", monospace',
      lineNumbers: 'on',
      roundedSelection: false,
      automaticLayout: true,
      wordWrap: 'on',
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'always',
      renderLineHighlight: 'all',
      selectOnLineNumbers: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
      mouseWheelScrollSensitivity: 1,
      quickSuggestions: true,
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      tabCompletion: 'on',
      wordBasedSuggestions: true,
      parameterHints: {
        enabled: true,
        cycle: true,
      },
      hover: {
        enabled: true,
        delay: 300,
      },
      links: true,
      colorDecorators: true,
      lightbulb: {
        enabled: true,
      },
      codeActionsOnSave: {
        'source.fixAll': true,
        'source.organizeImports': true,
      },
    });

    // Add custom keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save functionality can be added here
      console.log('Save triggered');
    });

    // Set initial value
    editor.setValue(currentCode);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      handleCodeChange(value);
    }
  };

  // Monaco Editor options
  const editorOptions = {
    readOnly,
    theme: getActualTheme(),
    language: getMonacoLanguage(language),
    automaticLayout: true,
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Consolas, "Courier New", monospace',
    lineNumbers: 'on' as const,
    roundedSelection: false,
    wordWrap: 'on' as const,
    folding: true,
    renderLineHighlight: 'all' as const,
    selectOnLineNumbers: true,
    cursorBlinking: 'smooth' as const,
    smoothScrolling: true,
    quickSuggestions: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on' as const,
    tabCompletion: 'on' as const,
    wordBasedSuggestions: 'allDocuments' as const,
    parameterHints: {
      enabled: true,
    },
    hover: {
      enabled: true,
      delay: 300,
    },
    links: true,
    colorDecorators: true,
  };

  console.log('[MonacoEditor] Rendering with language:', getMonacoLanguage(language), 'theme:', getActualTheme());
  console.log('[MonacoEditor] Current code being passed to Monaco:', currentCode);

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
          {isEditorReady && (
            <span className="text-xs text-green-500 ml-2">● Ready</span>
          )}
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

          <button
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Editor settings"
          >
            <Settings className="w-4 h-4 text-gray-500" />
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
                getActualTheme() === 'vs-dark'
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

      {/* Monaco Editor */}
      <div className="relative" style={{ height: `${height}px` }}>
        <Editor
          height="100%"
          defaultLanguage={getMonacoLanguage(language)}
          value={currentCode}
          theme={getActualTheme()}
          options={editorOptions}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span>Loading editor...</span>
              </div>
            </div>
          }
        />
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span>Lines: {currentCode.split('\n').length}</span>
          <span>Characters: {currentCode.length}</span>
          <span>Language: {language.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Monaco Editor</span>
          <span>•</span>
          <span>VS Code-powered</span>
        </div>
      </div>
    </div>
  );
};

export default MonacoEditor; 