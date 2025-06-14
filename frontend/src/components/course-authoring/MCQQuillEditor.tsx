'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';

interface MCQQuillEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  showToolbar?: boolean;
  onToolbarToggle?: (show: boolean) => void;
}

// MCQ-specific toolbar configuration
const MCQ_QUIZ_TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  ['link', 'image', 'formula'],
  ['undo', 'redo'],
];

export default function MCQQuillEditor({
  content,
  onChange,
  placeholder = "Write your question here...",
  className = "",
  readOnly = false,
  showToolbar = true,
  onToolbarToggle
}: MCQQuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(showToolbar);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const toolbarTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize Quill
  useEffect(() => {
    let quillInstance: any = null;
    let destroyed = false;

    const initQuill = async () => {
      if (destroyed || !editorRef.current) return;
      
      const QuillModule = await import('quill');
      const Quill = QuillModule.default;
      
      quillInstance = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: toolbarVisible ? MCQ_QUIZ_TOOLBAR : false,
          clipboard: { matchVisual: false },
        },
        placeholder: placeholder,
        readOnly: readOnly,
      });
      
      quillRef.current = quillInstance;
      quillInstance.root.innerHTML = content;
      
      quillInstance.on('text-change', () => {
        const html = quillInstance.root.innerHTML;
        if (html !== content) onChange(html);
      });

      // Auto-hide toolbar functionality
      if (toolbarVisible) {
        const toolbar = editorRef.current.parentElement?.querySelector('.ql-toolbar');
        if (toolbar) {
          const hideToolbar = () => {
            if (toolbarTimeoutRef.current) {
              clearTimeout(toolbarTimeoutRef.current);
            }
            toolbarTimeoutRef.current = setTimeout(() => {
              if (!isFocused) {
                setToolbarVisible(false);
                if (onToolbarToggle) onToolbarToggle(false);
              }
            }, 2000);
          };

          const showToolbar = () => {
            if (toolbarTimeoutRef.current) {
              clearTimeout(toolbarTimeoutRef.current);
            }
            if (!toolbarVisible) {
              setToolbarVisible(true);
              if (onToolbarToggle) onToolbarToggle(true);
            }
          };

          quillInstance.on('focus', () => {
            setIsFocused(true);
            showToolbar();
          });

          quillInstance.on('blur', () => {
            setIsFocused(false);
            hideToolbar();
          });

          quillInstance.on('mouseenter', showToolbar);
          quillInstance.on('mouseleave', hideToolbar);
        }
      }
    };

    initQuill().catch(console.error);

    return () => {
      destroyed = true;
      if (toolbarTimeoutRef.current) {
        clearTimeout(toolbarTimeoutRef.current);
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    };
  }, [toolbarVisible, showToolbar, content, onChange, placeholder, readOnly, isFocused, onToolbarToggle]);

  // Update content if it changes from outside
  useEffect(() => {
    if (quillRef.current && content !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = content;
    }
  }, [content]);

  // Update readOnly if it changes
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!readOnly);
    }
  }, [readOnly]);

  // Get text content
  const getText = useCallback(() => {
    return quillRef.current ? quillRef.current.getText() : '';
  }, []);

  // Get word count
  const getWordCount = useCallback(() => {
    const text = getText();
    return text.split(/\s+/).filter(Boolean).length;
  }, [getText]);

  const toggleDistractionFree = () => {
    setIsDistractionFree(!isDistractionFree);
  };

  const toggleToolbar = () => {
    const newVisibility = !toolbarVisible;
    setToolbarVisible(newVisibility);
    onToolbarToggle?.(newVisibility);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Floating Toolbar Controls */}
      <AnimatePresence>
        {!isDistractionFree && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-12 right-0 flex items-center space-x-2 z-20"
          >
            <button
              onClick={toggleToolbar}
              className="p-2 rounded-lg bg-white/80 dark:bg-[#23243a]/80 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-md hover:bg-white dark:hover:bg-[#23243a] transition-all duration-200"
              aria-label={toolbarVisible ? 'Hide toolbar' : 'Show toolbar'}
            >
              {toolbarVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleDistractionFree}
              className="p-2 rounded-lg bg-white/80 dark:bg-[#23243a]/80 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-md hover:bg-white dark:hover:bg-[#23243a] transition-all duration-200"
              aria-label="Toggle distraction-free mode"
            >
              {isDistractionFree ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Container */}
      <div className={`quill-editor border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-300 ${
        isDistractionFree ? 'border-0 shadow-none' : 'shadow-md'
      }`}>
        <div 
          ref={editorRef}
          className={`transition-all duration-300 ${
            isDistractionFree 
              ? 'min-h-[60vh] px-8 py-6 text-lg' 
              : 'min-h-[200px] px-4 py-3 text-base'
          }`}
          style={{
            fontFamily: 'Inter, ui-sans-serif, system-ui',
            fontSize: isDistractionFree ? '18px' : '16px',
            lineHeight: '1.6',
            caretColor: '#7ef9c0',
          }}
        />
        
        {/* Character and Word Count */}
        {!isDistractionFree && (
          <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
            <span>{getText().length} characters</span>
            <span>{getWordCount()} words</span>
          </div>
        )}
      </div>

      {/* Floating Toolbar Styling */}
      <style jsx>{`
        .ql-toolbar.ql-snow {
          position: absolute !important;
          top: -60px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          z-index: 30 !important;
          border-radius: 12px !important;
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(229, 231, 235, 0.8) !important;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15) !important;
          padding: 8px 16px !important;
          transition: all 0.3s ease !important;
        }
        
        .dark .ql-toolbar.ql-snow {
          background: rgba(35, 36, 58, 0.9) !important;
          border-color: rgba(75, 85, 99, 0.8) !important;
        }
        
        .ql-toolbar.ql-snow .ql-formats {
          margin-right: 12px !important;
        }
        
        .ql-toolbar.ql-snow .ql-stroke {
          stroke: #6b7280 !important;
        }
        
        .ql-toolbar.ql-snow .ql-fill {
          fill: #6b7280 !important;
        }
        
        .ql-toolbar.ql-snow .ql-picker {
          color: #6b7280 !important;
        }
        
        .dark .ql-toolbar.ql-snow .ql-stroke {
          stroke: #9ca3af !important;
        }
        
        .dark .ql-toolbar.ql-snow .ql-fill {
          fill: #9ca3af !important;
        }
        
        .dark .ql-toolbar.ql-snow .ql-picker {
          color: #9ca3af !important;
        }
      `}</style>
    </div>
  );
} 