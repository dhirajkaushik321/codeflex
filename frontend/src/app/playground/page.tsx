import React from 'react';
import PlaygroundTabs from '../../components/playground/PlaygroundTabs';

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex flex-col items-center justify-start py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 animate-fade-in">Code Playground</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 animate-fade-in">Practice JavaScript, HTML, CSS, and Python in a beautiful, interactive playground.</p>
      <PlaygroundTabs />
    </div>
  );
} 