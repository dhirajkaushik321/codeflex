'use client';

import React, { useState } from 'react';
import ExercisePlayground from '@/components/playground/ExercisePlayground';
import { TestCase } from '@/components/playground/types';

const sampleTestCases: TestCase[] = [
  {
    id: 'tc_1',
    input: '2, 3',
    expectedOutput: '5',
    description: 'Basic addition',
  },
  {
    id: 'tc_2',
    input: '-1, 1',
    expectedOutput: '0',
    description: 'Negative numbers',
  },
  {
    id: 'tc_3',
    input: '0, 0',
    expectedOutput: '0',
    description: 'Zero values',
  },
];

const sampleCode = `// Write a function that adds two numbers
function solution(a, b) {
  // Your code here
  return a + b;
}`;

const sampleDescription = `# JavaScript Addition Problem

Write a function called \`solution\` that takes two numbers as parameters and returns their sum.

## Requirements:
- The function should be named \`solution\`
- It should accept exactly two parameters
- It should return the sum of the two numbers

## Example:
\`\`\`javascript
solution(2, 3) // should return 5
solution(-1, 1) // should return 0
\`\`\`

## Tips:
- Make sure your function handles negative numbers correctly
- Test your solution with the provided test cases
- The function should be simple and efficient`;

export default function ExerciseDemoPage() {
  const [mode, setMode] = useState<'creator' | 'learner'>('learner');
  const [savedExercise, setSavedExercise] = useState<{
    title: string;
    description: string;
    initialCode: string;
    testCases: TestCase[];
  } | null>(null);

  const handleSave = (exercise: {
    title: string;
    description: string;
    initialCode: string;
    testCases: TestCase[];
  }) => {
    setSavedExercise(exercise);
    alert('Exercise saved! Check the console for details.');
    console.log('Saved Exercise:', exercise);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Exercise Playground Demo
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Test the coding exercise component in different modes
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Mode:</span>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as 'creator' | 'learner')}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="learner">Learner Mode</option>
                  <option value="creator">Creator Mode</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6">
        {mode === 'creator' ? (
          <ExercisePlayground
            mode="creator"
            title="JavaScript Addition Problem"
            description={sampleDescription}
            initialCode={sampleCode}
            testCases={sampleTestCases}
            language="javascript"
            onSave={handleSave}
          />
        ) : (
          <ExercisePlayground
            mode="learner"
            title={savedExercise?.title || "JavaScript Addition Problem"}
            description={savedExercise?.description || sampleDescription}
            initialCode={savedExercise?.initialCode || sampleCode}
            testCases={savedExercise?.testCases || sampleTestCases}
            language="javascript"
          />
        )}
      </div>

      {/* Info Panel */}
      <div className="fixed bottom-4 right-4 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Demo Instructions
        </h3>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p><strong>Creator Mode:</strong> Design exercises with test cases</p>
          <p><strong>Learner Mode:</strong> Solve exercises and run tests</p>
          <p>• Switch between modes using the dropdown</p>
          <p>• Try creating an exercise and then solving it</p>
          <p>• Test cases are evaluated safely in the browser</p>
        </div>
      </div>
    </div>
  );
} 