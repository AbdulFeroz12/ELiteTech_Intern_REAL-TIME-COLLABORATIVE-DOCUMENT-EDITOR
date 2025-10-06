/*const express = require('express');
const router = express.Router();
const { createDoc, getDoc } = require('../controllers/docController');

router.post('/doc', createDoc);
router.get('/doc/:id', getDoc);

module.exports = router;*/

const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const { createDoc, getDoc } = require('../controllers/docController');

// PUT route to save doc
router.put('/save/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const doc = await Document.findByIdAndUpdate(
      id,
      { content, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ message: 'Document saved', doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save document' });
  }
});
router.post('/doc', createDoc);
router.get('/doc/:id', getDoc);
// GET all documents
router.get('/docs', async (req, res) => {
  try {
    const docs = await Document.find({}, '_id updatedAt').sort({ updatedAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
});


module.exports = router;

