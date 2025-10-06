/*import React from 'react';

export default function StatusBar({ status }) {
  return (
    <div className="statusbar">
      <span>{status}</span>
    </div>
  );
}
*/
import React from 'react';

export default function StatusBar({ status, type }) {
  const colors = {
    success: { bg: '#d4edda', border: '#28a745', text: '#155724' },
    error: { bg: '#f8d7da', border: '#dc3545', text: '#721c24' },
    warning: { bg: '#fff3cd', border: '#ffc107', text: '#856404' },
    default: { bg: '#f0f4f8', border: '#007bff', text: '#333' },
  };

  const style = {
    padding: '10px 20px',
    backgroundColor: colors[type]?.bg || colors.default.bg,
    borderLeft: `5px solid ${colors[type]?.border || colors.default.border}`,
    borderRadius: '5px',
    color: colors[type]?.text || colors.default.text,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    margin: '10px auto',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
  };

  return <div style={style}>{status}</div>;
}
