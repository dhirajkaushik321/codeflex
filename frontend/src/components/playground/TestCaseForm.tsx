'use client';

import React, { useState } from 'react';
import { Plus, X, Edit2, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { TestCase, TestCaseFormProps } from './types';

const TestCaseForm: React.FC<TestCaseFormProps> = ({ onAdd, onRemove, testCases }) => {
  const [newTestCase, setNewTestCase] = useState({
    input: '',
    expectedOutput: '',
    description: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form
  React.useEffect(() => {
    setIsFormValid(newTestCase.input.trim() !== '' && newTestCase.expectedOutput.trim() !== '');
  }, [newTestCase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      return;
    }

    const testCase: TestCase = {
      id: editingId || `tc_${Date.now()}`,
      input: newTestCase.input.trim(),
      expectedOutput: newTestCase.expectedOutput.trim(),
      description: newTestCase.description.trim() || undefined,
    };

    onAdd(testCase);
    setNewTestCase({ input: '', expectedOutput: '', description: '' });
    setEditingId(null);
  };

  const handleEdit = (testCase: TestCase) => {
    setNewTestCase({
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      description: testCase.description || '',
    });
    setEditingId(testCase.id);
  };

  const handleCancel = () => {
    setNewTestCase({ input: '', expectedOutput: '', description: '' });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Test Case Form */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          {editingId ? (
            <Edit2 className="w-5 h-5 text-blue-600" />
          ) : (
            <Plus className="w-5 h-5 text-emerald-600" />
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingId ? 'Edit Test Case' : 'Add New Test Case'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Input Parameters
              </label>
              <input
                type="text"
                value={newTestCase.input}
                onChange={(e) => setNewTestCase({ ...newTestCase, input: e.target.value })}
                placeholder="e.g., 2, 3"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Comma-separated values
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Expected Output
              </label>
              <input
                type="text"
                value={newTestCase.expectedOutput}
                onChange={(e) => setNewTestCase({ ...newTestCase, expectedOutput: e.target.value })}
                placeholder="e.g., 5"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                What the function should return
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <input
                type="text"
                value={newTestCase.description}
                onChange={(e) => setNewTestCase({ ...newTestCase, description: e.target.value })}
                placeholder="e.g., Basic addition"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Brief description of the test
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!isFormValid}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {editingId ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Update Test Case
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Test Case
                </>
              )}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Test Cases List */}
      {testCases.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Test Cases ({testCases.length})
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Ready to test</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {testCases.map((testCase, index) => (
              <div
                key={testCase.id}
                className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Test Case {index + 1}
                      </span>
                      {testCase.description && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          {testCase.description}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Input:</span>
                        <span className="ml-2 font-mono text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                          {testCase.input}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Expected:</span>
                        <span className="ml-2 font-mono text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                          {testCase.expectedOutput}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(testCase)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                      title="Edit test case"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemove(testCase.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                      title="Remove test case"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {testCases.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No test cases yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add test cases to help learners validate their solutions
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>• Test cases should cover different scenarios</p>
            <p>• Include edge cases and error conditions</p>
            <p>• Make sure inputs and outputs are clearly defined</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCaseForm; 