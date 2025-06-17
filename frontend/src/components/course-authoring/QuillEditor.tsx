'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Modal from '../ui/Modal';
import { Edit3 } from 'lucide-react';

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
  const [quillLoaded, setQuillLoaded] = useState(false);
  const [inserting, setInserting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState('');

  // Initialize Quill
  useEffect(() => {
    let quillInstance: any = null;
    let destroyed = false;
    let Quill: any;
    (async () => {
      if (typeof window === 'undefined') return;
      const QuillModule = await import('quill');
      Quill = QuillModule.default;
      if (destroyed || !editorRef.current) return;
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
      setQuillLoaded(true);
    })();
    return () => {
      destroyed = true;
      if (quillRef.current) quillRef.current = null;
      if (editorRef.current) editorRef.current.innerHTML = '';
    };
  }, []);

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

  // Handle Save from modal (insert or edit)
  const handleModalSave = () => {
    if (!quillRef.current) return;
    const encoded = encodeURIComponent(code);
    if (inserting) {
      // Insert new marker at selection or end
      let range = quillRef.current.getSelection(true);
      if (!range) {
        const length = quillRef.current.getLength();
        range = { index: length, length: 0 };
      }
      const marker = `&lt;!--PLAYGROUND:${encoded}--&gt;`;
      quillRef.current.clipboard.dangerouslyPasteHTML(range.index, marker);
      quillRef.current.setSelection(range.index + marker.length, 0);
      // Update content and call onChange
      setTimeout(() => {
        onChange(quillRef.current.root.innerHTML);
      }, 0);
    }
    setModalOpen(false);
    setCode('');
    setInserting(false);
  };

  return (
    <div className={`quill-editor border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Custom Toolbar with Playground Button */}
      <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className="px-3 py-1 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition-all"
          onClick={() => {
            setCode("console.log('Hello, world!');");
            setInserting(true);
            setModalOpen(true);
          }}
          disabled={readOnly}
          title="Insert JavaScript Playground"
        >
          <span role="img" aria-label="Playground">🧪</span> JS Playground
        </button>
      </div>
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
      {/* Edit Playground Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Insert JavaScript Playground" size="md">
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          className="w-full min-h-[120px] font-mono text-base bg-[#181c23] text-[#d1d5db] p-4 outline-none resize-y border-none rounded-lg mb-4"
          spellCheck={false}
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition"
            onClick={handleModalSave}
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
} 