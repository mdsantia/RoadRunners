const express = require('express');

const router = express.Router();

const {saveData, updateData, getDatabaseData} = require('../Controllers/data_controller');

// Get requests
router.get('/api/data/getData', async (req, res) => {
    // Example: Retrieve data from a collection in your 'Data' database
    const query = { name: "Jane Doe" };
    const data = await getDatabaseData("Data", "Test", query);
  
    if (data === null) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(data);
    }
  });

// Patch requests
router.patch('/api/data/updateData', async (req, res) => {
    // Example: Retrieve data from a collection in your 'Data' database
    const query = { name: "Jane Doe" };
    const updateFields = { age: 30, email: "jane@example.com" };
    const data = await updateData("NEW", "Test", query, updateFields);
  
    if (data === null) {
      res.status(500).json
    } else {
      res.json(data);
    }
  });


// Post requests
router.post('/api/data/newData', async (req, res) => {
    // Example: Retrieve data from a collection in your 'Data' database
    const document = { name: "Jane Doe" };
    const data = await saveData("NEW", "Test", document);
  
    if (data === null) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(data);
    }
  });

  module.exports = router;