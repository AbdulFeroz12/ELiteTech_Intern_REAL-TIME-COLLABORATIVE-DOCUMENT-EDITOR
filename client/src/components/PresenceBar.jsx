import React from "react";

export default function PresenceBar({ users }) {
  return (
    <div className="presence-bar">
      {users.map((u, idx) => (
        <div key={idx} className="avatar" title={u}>
          {u[0].toUpperCase()}
        </div>
      ))}
    </div>
  );
}
