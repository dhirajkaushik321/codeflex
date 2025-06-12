'use client';

import { useEffect, useRef, useCallback } from 'react';

interface QuillEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export default function QuillEditor({
  content,
  onChange,
  placeholder = "Start writing your content...",
  className = "",
  readOnly = false
}: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  // Initialize Quill
  useEffect(() => {
    let quillInstance: any = null;
    let destroyed = false;
    import('quill').then((QuillModule) => {
      if (destroyed || !editorRef.current) return;
      const Quill = QuillModule.default;
      const toolbarOptions = [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ];
      quillInstance = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions,
          clipboard: { matchVisual: false },
        },
        placeholder: placeholder,
        readOnly: readOnly,
      });
      quillRef.current = quillInstance;
      quillInstance.root.innerHTML = content;
      quillInstance.on('text-change', () => {
        const html = quillInstance.root.innerHTML;
        if (html !== content) onChange(html);
      });
    });
    return () => {
      destroyed = true;
      if (quillRef.current) quillRef.current = null;
      if (editorRef.current) editorRef.current.innerHTML = '';
    };
  }, []); // Only on mount/unmount

  // Update content if it changes from outside
  useEffect(() => {
    if (quillRef.current && content !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = content;
    }
  }, [content]);

  // Update readOnly if it changes
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!readOnly);
    }
  }, [readOnly]);

  // Get text content
  const getText = useCallback(() => {
    return quillRef.current ? quillRef.current.getText() : '';
  }, []);

  return (
    <div className={`quill-editor border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      <div 
        ref={editorRef}
        className="min-h-[400px]"
        style={{
          fontFamily: 'inherit',
          fontSize: '14px',
          lineHeight: '1.6'
        }}
      />
      
      {/* Character count */}
      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
        {getText().length} characters
      </div>
    </div>
  );
} 