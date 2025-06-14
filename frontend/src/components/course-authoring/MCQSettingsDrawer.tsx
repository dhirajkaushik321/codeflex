'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Clock, Shuffle, Eye, BookOpen, RotateCcw, Upload, Download } from 'lucide-react';
import { MCQQuizSettings } from '@/types/mcq';

interface MCQSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: MCQQuizSettings;
  onSettingsChange: (settings: MCQQuizSettings) => void;
}

export default function MCQSettingsDrawer({
  isOpen,
  onClose,
  settings,
  onSettingsChange
}: MCQSettingsDrawerProps) {
  const [localSettings, setLocalSettings] = useState<MCQQuizSettings>(settings);

  const handleSettingChange = (key: keyof MCQQuizSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[320px] bg-white dark:bg-[#23243a] shadow-xl z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <h2 id="settings-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quiz Settings
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-label="Close settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* General Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>General</span>
                </h3>

                {/* Shuffle Options */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shuffle className="w-4 h-4 text-gray-500" />
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      Shuffle options
                    </label>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.shuffleOptions}
                    onChange={(e) => handleSettingChange('shuffleOptions', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                {/* Show Hints */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      Show hints
                    </label>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.showHints}
                    onChange={(e) => handleSettingChange('showHints', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                {/* Show Explanations */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      Show explanations
                    </label>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.showExplanations}
                    onChange={(e) => handleSettingChange('showExplanations', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                {/* Allow Review */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4 text-gray-500" />
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      Allow review
                    </label>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.allowReview}
                    onChange={(e) => handleSettingChange('allowReview', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Time & Attempts */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Time & Attempts</span>
                </h3>

                {/* Time Limit */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Time limit (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={localSettings.timeLimit || ''}
                    onChange={(e) => handleSettingChange('timeLimit', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="No limit"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#18181b] dark:text-white"
                  />
                </div>

                {/* Max Attempts */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Max attempts
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={localSettings.maxAttempts || ''}
                    onChange={(e) => handleSettingChange('maxAttempts', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Unlimited"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#18181b] dark:text-white"
                  />
                </div>
              </div>

              {/* Scoring */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Scoring
                </h3>

                {/* Passing Score */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Passing score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={localSettings.passingScore}
                    onChange={(e) => handleSettingChange('passingScore', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#18181b] dark:text-white"
                  />
                </div>

                {/* Points per Question */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Points per question
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={localSettings.pointsPerQuestion}
                    onChange={(e) => handleSettingChange('pointsPerQuestion', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#18181b] dark:text-white"
                  />
                </div>
              </div>

              {/* Import/Export */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Import/Export
                </h3>

                <div className="flex space-x-2">
                  <button
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => {/* TODO: Implement import */}}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import</span>
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => {/* TODO: Implement export */}}
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
} 