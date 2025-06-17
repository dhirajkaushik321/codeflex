'use client';

import React, { useState, useCallback } from 'react';
import { Play, Save, RotateCcw, Settings, FileText, Code, TestTube, Eye, EyeOff } from 'lucide-react';
import { ExercisePlaygroundProps, TestCase, TestResult } from './types';
import SandpackEditor from './SandpackEditor';
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
}) => {
  const [currentCode, setCurrentCode] = useState(initialCode);
  const [currentTestCases, setCurrentTestCases] = useState<TestCase[]>(testCases);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentDescription, setCurrentDescription] = useState(description);
  const [activeTab, setActiveTab] = useState<'preview' | 'settings'>('preview');
  const [showPreview, setShowPreview] = useState(true);

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
    if (currentTestCases.length === 0) {
      setTestResults([]);
      return;
    }

    setIsRunning(true);
    
    // Simulate some processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const results: TestResult[] = currentTestCases.map((testCase) => {
      const startTime = performance.now();
      const evaluation = evaluateJavaScript(currentCode, testCase.input);
      const executionTime = performance.now() - startTime;

      return {
        testCase,
        result: evaluation.result,
        passed: evaluation.error ? false : String(evaluation.result) === testCase.expectedOutput,
        error: evaluation.error,
        executionTime,
      };
    });

    setTestResults(results);
    setIsRunning(false);
  }, [currentCode, currentTestCases, evaluateJavaScript]);

  // Handle test case management
  const handleAddTestCase = useCallback((testCase: TestCase) => {
    setCurrentTestCases(prev => {
      const existingIndex = prev.findIndex(tc => tc.id === testCase.id);
      if (existingIndex >= 0) {
        // Update existing test case
        const updated = [...prev];
        updated[existingIndex] = testCase;
        return updated;
      } else {
        // Add new test case
        return [...prev, testCase];
      }
    });
  }, []);

  const handleRemoveTestCase = useCallback((id: string) => {
    setCurrentTestCases(prev => prev.filter(tc => tc.id !== id));
  }, []);

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

  if (mode === 'creator') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Enhanced Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
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
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
                
                {onSave && (
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Save className="w-4 h-4" />
                    Save Exercise
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Settings */}
            <div className="xl:col-span-1 space-y-6">
              {/* Exercise Settings Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                      onChange={(e) => setCurrentTitle(e.target.value)}
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
                      onChange={(e) => setCurrentDescription(e.target.value)}
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
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

            {/* Right Column - Preview */}
            <div className="xl:col-span-2 space-y-6">
              {showPreview ? (
                <>
                  {/* Preview Header */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Learner Preview
                      </h2>
                      <div className="ml-auto flex items-center gap-2">
                        <button
                          onClick={runTests}
                          disabled={isRunning || currentTestCases.length === 0}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                        >
                          <Play className="w-4 h-4" />
                          {isRunning ? 'Running...' : 'Test Preview'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      This is how learners will see your exercise. Test it to ensure everything works correctly.
                    </div>
                  </div>

                  {/* Problem Statement Preview */}
                  <ProblemStatement
                    title={currentTitle}
                    description={currentDescription}
                    collapsible={false}
                    defaultExpanded={true}
                  />

                  {/* Code Editor Preview */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Code className="w-5 h-5 text-white" />
                        <h3 className="text-lg font-semibold text-white">Code Editor</h3>
                        <span className="ml-auto text-xs text-gray-300">Preview Mode</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <SandpackEditor
                        initialCode={currentCode}
                        language={language}
                        readOnly={false}
                        onCodeChange={setCurrentCode}
                        height={400}
                      />
                    </div>
                  </div>

                  {/* Test Results Preview */}
                  <TestCaseOutput
                    results={testResults}
                    isLoading={isRunning}
                  />
                </>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <EyeOff className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Preview Hidden
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click "Show Preview" to see how learners will experience your exercise
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Learner Mode (unchanged)
  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem Statement */}
          <ProblemStatement
            title={currentTitle}
            description={currentDescription}
            collapsible={true}
            defaultExpanded={true}
          />

          {/* Code Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
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
                  onClick={() => setCurrentCode(initialCode)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <SandpackEditor
              initialCode={currentCode}
              language={language}
              readOnly={readOnly}
              onCodeChange={setCurrentCode}
              height={400}
            />
          </div>

          {/* Test Results */}
          <TestCaseOutput
            results={testResults}
            isLoading={isRunning}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Test Cases Summary */}
          {currentTestCases.length > 0 && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
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
      </div>
    </div>
  );
};

export default ExercisePlayground; 