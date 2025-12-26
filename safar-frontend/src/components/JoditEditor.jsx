"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';


const JoditEditor = dynamic(() => import('jodit-react'), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-md flex items-center justify-center">Loading editor...</div>
});

const JoditEditorComponent = ({
  value,
  onChange,
  placeholder = "Enter content...",
  height = "300px",
  error_text = "",
  top_title = "",
  className = ""
}) => {
  const editor = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [editorValue, setEditorValue] = useState(value || '');

  useEffect(() => {
    setIsClient(true);
  }, []);

  
  useEffect(() => {
    setEditorValue(value || '');
  }, [value]);

  
  const config = React.useMemo(() => ({
  height: height,
  placeholder: placeholder,
  toolbar: true,
  toolbarButtonSize: "medium",
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: "insert_clear_html",
  buttons: [
    'source', '|',
    'bold', 'italic', 'underline', 'strikethrough', '|',
    'superscript', 'subscript', '|',
    'ul', 'ol', '|',
    'outdent', 'indent', '|',
    'font', 'fontsize', 'brush', 'paragraph', '|',
    'image', 'table', 'link', '|',
    'align', 'undo', 'redo', '|',
    'hr', 'eraser', 'copyformat', '|',
    'symbol', 'fullsize', 'print', 'about'
  ],
  removeButtons: ['brush', 'file', 'video'],
  uploader: {
    insertImageAsBase64URI: true
  },
  controls: {
    ul: {
      list: {
        default: 'Default',
        disc: 'Dot',
        circle: 'Circle',
        square: 'Square'
      }
    }
  },
  // Force proper list styling
  list: {
    default: 'disc',
    disc: 'disc',
    circle: 'circle',
    square: 'square'
  }
}), [height, placeholder]);

  // Stable onChange handler
  const handleChange = useCallback((newValue) => {
    setEditorValue(newValue);
    onChange(newValue);
  }, [onChange]);

  if (!isClient) {
    return (
      <div className={`w-full ${className}`}>
        {top_title && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {top_title}
          </label>
        )}
        <div className="border border-gray-300 rounded-md h-32 bg-gray-100 animate-pulse flex items-center justify-center">
          <span className="text-gray-500">Loading editor...</span>
        </div>
        {error_text && (
          <p className="text-red-500 text-sm mt-1">{error_text}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {top_title && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {top_title}
        </label>
      )}
      
      <div className="border border-gray-300 rounded-md overflow-hidden">
        <JoditEditor
          ref={editor}
          value={editorValue}
          config={config}
          onBlur={handleChange}
          onChange={handleChange}
        />
      </div>
      
      {error_text && (
        <p className="text-red-500 text-sm mt-1">{error_text}</p>
      )}
    </div>
  );
};

export default JoditEditorComponent;