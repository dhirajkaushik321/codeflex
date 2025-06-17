'use client';

import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { TestCaseOutputProps } from './types';

const TestCaseOutput: React.FC<TestCaseOutputProps> = ({ results, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-blue-500 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Running Tests...
          </h3>
        </div>
        <div className="space-y-2">
          {results.map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded animate-pulse">
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No test results yet</p>
          <p className="text-sm">Run your code to see test results</p>
        </div>
      </div>
    );
  }

  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Results Header */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Test Results
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {passedTests}/{totalTests} passed
            </div>
            <div className={`text-sm font-medium ${
              successRate === 100 ? 'text-green-600' : 
              successRate >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {successRate.toFixed(0)}% success
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              successRate === 100 ? 'bg-green-500' : 
              successRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${successRate}%` }}
          />
        </div>
      </div>

      {/* Test Results List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {results.map((result, index) => (
          <div
            key={result.testCase.id}
            className={`p-4 transition-colors ${
              result.passed 
                ? 'bg-green-50 dark:bg-green-900/20' 
                : 'bg-red-50 dark:bg-red-900/20'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {result.passed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>

              {/* Test Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Test Case {index + 1}
                  </span>
                  {result.testCase.description && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({result.testCase.description})
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Input:</span>
                    <span className="ml-1 font-mono text-gray-900 dark:text-white">
                      {result.testCase.input}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Expected:</span>
                    <span className="ml-1 font-mono text-gray-900 dark:text-white">
                      {result.testCase.expectedOutput}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Actual:</span>
                    <span className={`ml-1 font-mono ${
                      result.passed 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {result.error ? 'Error' : String(result.result)}
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                {result.error && (
                  <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded text-sm text-red-700 dark:text-red-300">
                    <span className="font-medium">Error:</span> {result.error}
                  </div>
                )}

                {/* Execution Time */}
                {result.executionTime && (
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Execution time: {result.executionTime.toFixed(2)}ms
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {totalTests > 0 && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {successRate === 100 ? (
                <span className="text-green-600 font-medium">🎉 All tests passed!</span>
              ) : passedTests > 0 ? (
                <span className="text-yellow-600 font-medium">⚠️ Some tests failed</span>
              ) : (
                <span className="text-red-600 font-medium">❌ All tests failed</span>
              )}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {passedTests} of {totalTests} test cases passed
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCaseOutput; 