const Document = require('../models/Document');
const { makeId } = require('../utils/idGenerator');

async function createDoc(req, res) {
  try {
    const id = makeId();
    const doc = new Document({
      _id: id,
      content: `<h2>New Document</h2><p>Start collaborating...</p>`
    });
    await doc.save();
    return res.json({ docId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create document' });
  }
}

async function getDoc(req, res) {
  try {
    const id = req.params.id;
    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    return res.json({ docId: doc._id, content: doc.content, updatedAt: doc.updatedAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
}

module.exports = { createDoc, getDoc };
