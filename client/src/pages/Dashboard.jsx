import { Link } from "react-router-dom";

import React, { useEffect, useState } from "react";
const SERVER = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

export default function Dashboard() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fetch(`${SERVER}/api/docs`)
      .then(res => res.json())
      .then(data => setDocs(data))
      .catch(err => console.error("Fetch docs error", err));
  }, []);

  return (
    <div className="container">
      <h2>📂 Your Saved Documents</h2>
      {docs.length === 0 ? (
        <p>No documents found. Create a new one!</p>
      ) : (
        <ul className="doc-list">
          {docs.map(doc => (
            <li key={doc._id} className="doc-item">
              <span>📝 {doc._id}</span>
              <small>
                Last updated: {new Date(doc.updatedAt).toLocaleString()}
              </small>
              <a
                href={`/?doc=${doc._id}`}
                className="btn open-btn"
              >
                Open
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
