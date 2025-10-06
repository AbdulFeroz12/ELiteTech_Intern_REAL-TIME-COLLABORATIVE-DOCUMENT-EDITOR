/*import React from 'react';

export default function Toolbar({ onCmd }) {
  return (
    <div className="toolbar">
      <button onClick={() => onCmd('bold')} className="btn">B</button>
      <button onClick={() => onCmd('italic')} className="btn">I</button>
      <button onClick={() => onCmd('underline')} className="btn">U</button>
      <button onClick={() => onCmd('insertUnorderedList')} className="btn">• List</button>
    </div>
  );
}
*/
import React from 'react';

export default function Toolbar({ onCmd }) {
  const toolbarStyle = {
    display: 'flex',
    gap: '10px',
    backgroundColor: '#f9f9f9',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    maxWidth: '400px',
    margin: '10px auto',
  };

  const btnStyle = {
    padding: '6px 12px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const handleMouseEnter = e => {
    e.target.style.backgroundColor = '#007bff';
    e.target.style.color = 'white';
    e.target.style.borderColor = '#007bff';
  };

  const handleMouseLeave = e => {
    e.target.style.backgroundColor = '#fff';
    e.target.style.color = 'black';
    e.target.style.borderColor = '#ccc';
  };

  return (
    <div style={toolbarStyle}>
      {['bold', 'italic', 'underline', 'insertUnorderedList'].map((cmd, idx) => (
        <button
          key={cmd}
          style={btnStyle}
          onClick={() => onCmd(cmd)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {cmd === 'bold' ? 'B' : cmd === 'italic' ? 'I' : cmd === 'underline' ? 'U' : '• List'}
        </button>
      ))}
    </div>
  );
}
