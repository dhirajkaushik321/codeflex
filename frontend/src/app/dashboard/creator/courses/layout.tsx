'use client';

import { useEffect } from 'react';

export default function CourseAuthoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hide the navbar and chatbot when this layout is active
  useEffect(() => {
    const navbar = document.querySelector('nav') as HTMLElement;
    const chatbot = document.querySelector('.fixed.bottom-6.right-6') as HTMLElement;
    
    if (navbar) {
      navbar.style.display = 'none';
    }
    
    if (chatbot) {
      chatbot.style.display = 'none';
    }

    // Show navbar and chatbot when component unmounts
    return () => {
      if (navbar) {
        navbar.style.display = '';
      }
      if (chatbot) {
        chatbot.style.display = '';
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  );
} 