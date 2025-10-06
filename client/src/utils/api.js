const SERVER = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export async function createDoc() {
  const res = await fetch(`${SERVER}/api/doc`, { method: 'POST' });
  return await res.json();
}

export async function fetchDoc(id) {
  const res = await fetch(`${SERVER}/api/doc/${id}`);
  return await res.json();
}
