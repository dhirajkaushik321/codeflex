'use client';
import React from 'react';
import Playground from './Playground';

const PlaygroundTabs: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Playground
        language="javascript"
        title="JavaScript Playground"
        description="Practice and run JavaScript code in a beautiful, interactive playground."
      />
    </div>
  );
};

export default PlaygroundTabs; 