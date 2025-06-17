'use client';

import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Settings, Code, TestTube } from 'lucide-react';
import { CodingExercise, TestCase } from '@/types/course';
import { ExercisePlayground } from '@/components/playground';
import Button from '@/components/ui/Button';

interface CodingExerciseBuilderProps {
  exercise?: CodingExercise;
  onSave: (exercise: CodingExercise) => void;
}

const defaultExercise: CodingExercise = {
  id: '',
  title: 'New Coding Exercise',
  description: '',
  problemStatement: '',
  initialCode: `// Write your solution here
function solution(a, b) {
  // Your code here
  return a + b;
}`,
  solution: '',
  testCases: [
    {
      id: 'tc_1',
      input: '2, 3',
      expectedOutput: '5',
      description: 'Basic addition'
    }
  ],
  programmingLanguage: 'javascript',
  difficulty: 'beginner',
  points: 10,
  timeLimit: 30,
  hints: [],
  tags: [],
  order: 0,
  status: 'draft',
  estimatedTime: 15
};

const CodingExerciseBuilder: React.FC<CodingExerciseBuilderProps> = ({
  exercise,
  onSave
}) => {
  const [currentExercise, setCurrentExercise] = useState<CodingExercise>(exercise || defaultExercise);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Update exercise when prop changes
  useEffect(() => {
    if (exercise) {
      setCurrentExercise(exercise);
    }
  }, [exercise]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Generate a unique ID if not exists
      const exerciseToSave = {
        ...currentExercise,
        id: currentExercise.id || `exercise_${Date.now()}`
      };
      
      await onSave(exerciseToSave);
      setIsSaving(false);
    } catch (error) {
      console.error('Failed to save exercise:', error);
      setIsSaving(false);
    }
  };

  const handleExerciseUpdate = (updatedData: {
    title: string;
    description: string;
    initialCode: string;
    testCases: any[];
  }) => {
    setCurrentExercise(prev => ({
      ...prev,
      title: updatedData.title,
      description: updatedData.description,
      initialCode: updatedData.initialCode,
      testCases: updatedData.testCases.map((tc, index) => ({
        id: tc.id || `tc_${index}_${Date.now()}`,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        description: tc.description
      }))
    }));
  };

  if (isPreviewMode) {
    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Preview Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentExercise.title}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Preview Mode - This is how learners will see the exercise
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<EyeOff className="w-4 h-4" />}
                onClick={() => setIsPreviewMode(false)}
              >
                Exit Preview
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto">
          <ExercisePlayground
            mode="learner"
            title={currentExercise.title}
            description={currentExercise.description}
            initialCode={currentExercise.initialCode || ''}
            testCases={currentExercise.testCases}
            language={currentExercise.programmingLanguage as 'javascript' | 'html' | 'css' | 'python'}
            readOnly={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Builder Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Coding Exercise Builder
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create interactive programming challenges for your learners
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Eye className="w-4 h-4" />}
              onClick={() => setIsPreviewMode(true)}
            >
              Preview
            </Button>
            
            <Button
              variant="primary"
              size="sm"
              icon={<Save className="w-4 h-4" />}
              onClick={handleSave}
              loading={isSaving}
            >
              Save Exercise
            </Button>
          </div>
        </div>
      </div>

      {/* Builder Content */}
      <div className="flex-1 overflow-auto">
        <ExercisePlayground
          mode="creator"
          title={currentExercise.title}
          description={currentExercise.description}
          initialCode={currentExercise.initialCode || ''}
          testCases={currentExercise.testCases}
          language={currentExercise.programmingLanguage as 'javascript' | 'html' | 'css' | 'python'}
          readOnly={false}
          onSave={handleExerciseUpdate}
        />
      </div>

      {/* Exercise Settings Panel */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty
              </label>
              <select
                value={currentExercise.difficulty}
                onChange={(e) => setCurrentExercise(prev => ({
                  ...prev,
                  difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced'
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Points
              </label>
              <input
                type="number"
                value={currentExercise.points}
                onChange={(e) => setCurrentExercise(prev => ({
                  ...prev,
                  points: parseInt(e.target.value) || 0
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time Limit (min)
              </label>
              <input
                type="number"
                value={currentExercise.timeLimit || 0}
                onChange={(e) => setCurrentExercise(prev => ({
                  ...prev,
                  timeLimit: parseInt(e.target.value) || 0
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="120"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estimated Time (min)
              </label>
              <input
                type="number"
                value={currentExercise.estimatedTime || 0}
                onChange={(e) => setCurrentExercise(prev => ({
                  ...prev,
                  estimatedTime: parseInt(e.target.value) || 0
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="60"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <input
              type="text"
              value={currentExercise.tags.join(', ')}
              onChange={(e) => setCurrentExercise(prev => ({
                ...prev,
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
              }))}
              placeholder="Enter tags separated by commas"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingExerciseBuilder; 