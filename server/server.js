const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 5010;

const user = "mdsantia";
const pwd = "PkLnDkpIynsO9YR8";

const mongoURI = `mongodb+srv://${user}:${pwd}@data.oknxymr.mongodb.net/Data?retryWrites=true&w=majority`;

// Moved the MongoDB client initialization outside of the function
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function getDatabaseData(database, collection, query) {
  try {
    // Connect to MongoDB before querying
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db(database);
    const col = db.collection(collection);

    const document = await col.findOne(query);

    if (document) {
      console.log(document);
      const data = document._id;
      console.log(data);
      return data;
    } else {
      console.log("Data not found.");
      return null;
    }
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    return null;
  }
}

async function saveData(database, collection, document) {
  try {
    await client.connect();
    
    const db = client.db(database);
    const col = db.collection(collection);
    
    const result = await col.insertOne(document);
    console.log("Document inserted:", result.insertedId);
    return result;
  } catch (error) {
    console.error('Error building MongoDB:', error);
    return null;
  } finally {
    await client.close(); // Close the MongoDB connection
  }
}

async function updateData(database, collection, query, updateFields) {
  try {
    await client.connect();

    const db = client.db(database);
    const col = db.collection(collection);

    const result = await col.updateOne(query, { $set: updateFields });

    if (result.modifiedCount === 0) {
      console.log("No document matched the query.");
      return null;
    }

    console.log("Document updated:", result.modifiedCount);
    return result;
  } catch (error) {
    console.error('Error updating MongoDB document:', error);
    return null;
  } finally {
    await client.close();
  }
}

app.get('/api/data', async (req, res) => {
  // Example: Retrieve data from a collection in your 'Data' database
  const query = { name: "Jane Doe" };
  const data = await getDatabaseData("Data", "Test", query);

  if (data === null) {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.json(data);
  }
});

app.post('/api/newData', async (req, res) => {
  // Example: Retrieve data from a collection in your 'Data' database
  const document = { name: "Jane Doe" };
  const data = await saveData("NEW", "Test", document);

  if (data === null) {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.json(data);
  }
});

app.post('/api/updateData', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});