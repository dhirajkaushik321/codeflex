'use client';

import React, { useState, useCallback } from 'react';
import { Play, Save, RotateCcw, Settings, FileText, Code, TestTube, Eye, EyeOff } from 'lucide-react';
import { ExercisePlaygroundProps, TestCase, TestResult } from './types';
import MonacoEditor from './MonacoEditor';
import TestCaseForm from './TestCaseForm';
import TestCaseOutput from './TestCaseOutput';
import ProblemStatement from './ProblemStatement';

const ExercisePlayground: React.FC<ExercisePlaygroundProps> = ({
  mode = 'learner',
  initialCode,
  testCases = [],
  description,
  title,
  language = 'javascript',
  readOnly = false,
  onSave,
  onChange,
}) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // --- Learner mode: locally controlled code state ---
  const [learnerCode, setLearnerCode] = useState(initialCode);
  // Reset code if initialCode changes (e.g., on exercise switch)
  React.useEffect(() => {
    if (mode === 'learner') {
      console.log('[ExercisePlayground] useEffect - initialCode changed to:', initialCode, 'mode:', mode);
      setLearnerCode(initialCode);
      console.log('[ExercisePlayground] initialCode changed, resetting learnerCode');
    }
  }, [initialCode, mode]);

  // Controlled values from props
  const currentCode = mode === 'learner' ? learnerCode : initialCode;
  const currentTestCases = testCases;
  const currentTitle = title;
  const currentDescription = description;

  console.log('[ExercisePlayground] Render - mode:', mode, 'currentCode:', currentCode, 'learnerCode:', learnerCode, 'initialCode:', initialCode);

  // Safe JavaScript evaluation function
  const evaluateJavaScript = useCallback((code: string, input: string): any => {
    try {
      // Create a safe execution environment
      const logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => logs.push(args.map(arg => String(arg)).join(' ')),
        error: (...args: any[]) => logs.push('ERROR: ' + args.map(arg => String(arg)).join(' ')),
        warn: (...args: any[]) => logs.push('WARN: ' + args.map(arg => String(arg)).join(' ')),
      };

      // Parse input as array
      let parsedInput: any[];
      try {
        parsedInput = JSON.parse(`[${input}]`);
      } catch {
        throw new Error(`Invalid input format: ${input}`);
      }

      // Create function with the user's code
      const userFunction = new Function('input', 'console', `
        ${code}
        // The function should be named 'solution' and accept the input parameters
        if (typeof solution !== 'function') {
          throw new Error('Please define a function named "solution"');
        }
        return solution(...input);
      `);

      // Execute the function
      const result = userFunction(parsedInput, customConsole);
      
      return {
        result,
        logs: logs.join('\n'),
        error: null,
      };
    } catch (error: any) {
      return {
        result: null,
        logs: '',
        error: error.message,
      };
    }
  }, []);

  // Run test cases
  const runTests = useCallback(async () => {
    console.log('[ExercisePlayground] runTests called');
    console.log('[ExercisePlayground] Running tests with code:', currentCode);
    console.log('[ExercisePlayground] Test cases count:', currentTestCases.length);
    
    if (currentTestCases.length === 0) {
      console.log('[ExercisePlayground] No test cases, clearing results');
      setTestResults([]);
      return;
    }
    
    console.log('[ExercisePlayground] Starting test execution...');
    setIsRunning(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const results: TestResult[] = currentTestCases.map((testCase) => {
      console.log('[ExercisePlayground] Running test case:', testCase);
      const startTime = performance.now();
      const evaluation = evaluateJavaScript(currentCode, testCase.input);
      const executionTime = performance.now() - startTime;
      console.log('[ExercisePlayground] Test result:', evaluation);
      
      return {
        testCase,
        result: evaluation.result,
        passed: evaluation.error ? false : String(evaluation.result) === testCase.expectedOutput,
        error: evaluation.error,
        executionTime,
      };
    });
    
    console.log('[ExercisePlayground] All test results:', results);
    setTestResults(results);
    setIsRunning(false);
    console.log('[ExercisePlayground] Tests completed');
  }, [currentCode, currentTestCases, evaluateJavaScript]);

  // Handle test case management
  const handleAddTestCase = (testCase: TestCase) => {
    const updated = [...currentTestCases];
    const existingIndex = updated.findIndex(tc => tc.id === testCase.id);
    if (existingIndex >= 0) {
      updated[existingIndex] = testCase;
    } else {
      updated.push(testCase);
    }
    if (onChange) onChange({
      title: currentTitle,
      description: currentDescription,
      initialCode: currentCode,
      testCases: updated,
    });
  };

  const handleRemoveTestCase = (id: string) => {
    const updated = currentTestCases.filter(tc => tc.id !== id);
    if (onChange) onChange({
      title: currentTitle,
      description: currentDescription,
      initialCode: currentCode,
      testCases: updated,
    });
  };

  // Handle save
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave({
        title: currentTitle,
        description: currentDescription,
        initialCode: currentCode,
        testCases: currentTestCases,
      });
    }
  }, [onSave, currentTitle, currentDescription, currentCode, currentTestCases]);

  // In learner mode, update local state and log
  const handleCodeChange = (code: string) => {
    console.log('[ExercisePlayground] handleCodeChange called with:', code);
    console.log('[ExercisePlayground] Mode:', mode);
    
    if (mode === 'learner') {
      console.log('[ExercisePlayground] Updating learnerCode from:', learnerCode, 'to:', code);
      setLearnerCode(code);
      console.log('[ExercisePlayground] Learner code changed:', code);
    } else if (onChange) {
      console.log('[ExercisePlayground] Creator mode - calling onChange');
      onChange({
        title: currentTitle,
        description: currentDescription,
        initialCode: code,
        testCases: currentTestCases,
      });
    }
  };

  // In learner mode, reset code to initialCode
  const handleResetCode = () => {
    console.log('[ExercisePlayground] handleResetCode called');
    console.log('[ExercisePlayground] Mode:', mode);
    
    if (mode === 'learner') {
      console.log('[ExercisePlayground] Resetting learnerCode from:', learnerCode, 'to:', initialCode);
      setLearnerCode(initialCode);
      console.log('[ExercisePlayground] Learner code reset to initialCode');
    } else if (onChange) {
      console.log('[ExercisePlayground] Creator mode - calling onChange with initialCode');
      onChange({
        title: currentTitle,
        description: currentDescription,
        initialCode,
        testCases: currentTestCases,
      });
    }
  };

  // Example for title change:
  const handleTitleChange = (title: string) => {
    if (onChange) onChange({
      title,
      description: currentDescription,
      initialCode: currentCode,
      testCases: currentTestCases,
    });
  };

  // Example for description change:
  const handleDescriptionChange = (description: string) => {
    if (onChange) onChange({
      title: currentTitle,
      description,
      initialCode: currentCode,
      testCases: currentTestCases,
    });
  };

  if (mode === 'creator') {
    return (
      <div className="w-full space-y-6">
        {/* Enhanced Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 w-full">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">🧪</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Exercise Creator
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Design engaging coding exercises with interactive test cases
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exercise Settings Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden w-full">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-white" />
              <h2 className="text-lg font-semibold text-white">Exercise Settings</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Exercise Title
              </label>
              <input
                type="text"
                value={currentTitle}
                onChange={e => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter exercise title..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Problem Description
              </label>
              <textarea
                value={currentDescription}
                onChange={e => handleDescriptionChange(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Describe the problem in markdown format..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Supports markdown formatting for rich content
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Programming Language
              </label>
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <Code className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {language.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Cases Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden w-full">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <TestTube className="w-5 h-5 text-white" />
              <h2 className="text-lg font-semibold text-white">Test Cases</h2>
              <span className="ml-auto bg-white/20 text-white text-xs font-medium px-2 py-1 rounded-full">
                {currentTestCases.length}
              </span>
            </div>
          </div>
          <div className="p-6">
            <TestCaseForm
              onAdd={handleAddTestCase}
              onRemove={handleRemoveTestCase}
              testCases={currentTestCases}
            />
          </div>
        </div>
      </div>
    );
  }

  // Learner Mode (unchanged)
  return (
    <div className="w-full space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🧪</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Coding Exercise
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Solve the problem and test your solution
            </p>
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <ProblemStatement
        title={currentTitle}
        description={currentDescription}
        collapsible={true}
        defaultExpanded={true}
      />

      {/* Code Editor */}
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Solution
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={runTests}
              disabled={isRunning || currentTestCases.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Run Tests'}
            </button>
            <button
              onClick={handleResetCode}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        <MonacoEditor
          initialCode={currentCode}
          language={language}
          readOnly={readOnly}
          onCodeChange={handleCodeChange}
          height={400}
        />
      </div>

      {/* Test Results */}
      <TestCaseOutput
        results={testResults}
        isLoading={isRunning}
      />

      {/* Test Cases Summary */}
      {currentTestCases.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 w-full">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Test Cases ({currentTestCases.length})
          </h3>
          <div className="space-y-2">
            {currentTestCases.map((testCase, index) => (
              <div key={testCase.id} className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Test {index + 1}:</span> {testCase.input} → {testCase.expectedOutput}
                {testCase.description && (
                  <span className="text-gray-500"> ({testCase.description})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisePlayground; 