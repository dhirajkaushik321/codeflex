'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, ChevronUp, FileText, BookOpen } from 'lucide-react';

interface ProblemStatementProps {
  title: string;
  description: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

const ProblemStatement: React.FC<ProblemStatementProps> = ({
  title,
  description,
  collapsible = false,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const content = (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          // Customize code blocks
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;
            return !isInline ? (
              <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono border border-gray-200 dark:border-gray-700" {...props}>
                {children}
              </code>
            );
          },
          // Customize headings
          h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{children}</h3>,
          // Customize lists
          ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">{children}</ol>,
          // Customize paragraphs
          p: ({ children }) => <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>,
          // Customize blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-4 bg-blue-50 dark:bg-blue-900/20 py-2 rounded-r-lg">
              {children}
            </blockquote>
          ),
          // Customize strong text
          strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
          // Customize emphasis
          em: ({ children }) => <em className="italic text-gray-800 dark:text-gray-200">{children}</em>,
        }}
      >
        {description}
      </ReactMarkdown>
    </div>
  );

  if (!collapsible) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-white" />
            <h2 className="text-xl font-bold text-white">
              {title}
            </h2>
          </div>
        </div>
        <div className="p-6">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isExpanded ? 'Click to collapse' : 'Click to expand problem details'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            Problem
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
          <div className="pt-4">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemStatement; 