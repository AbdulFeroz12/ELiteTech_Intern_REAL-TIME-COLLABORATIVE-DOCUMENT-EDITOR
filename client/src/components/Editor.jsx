import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Editor.css'; // optional for custom CSS

export default function Editor({ value, onChange }) {
  return (
    <div className="editor-container">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        className="custom-quill"
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
          ]
        }}
      />
    </div>
  );
}
