const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 5010;

const user = "mdsantia";
const pwd = "PkLnDkpIynsO9YR8";

const mongoURI = `mongodb+srv://${user}:${pwd}@data.oknxymr.mongodb.net/Data?retryWrites=true&w=majority`;

// Moved the MongoDB client initialization outside of the function
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function getDatabase() {
  try {
    // Connect to MongoDB before querying
    await client.connect();
    console.log("Connected to MongoDB!");

    const database = client.db("Data");
    const collection = database.collection("Test");

    const query = { name: "Jane Doe" };
    const document = await collection.findOne(query);

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

app.get('/api/data', async (req, res) => {
  // Example: Retrieve data from a collection in your 'Data' database
  const data = await getDatabase();

  if (data === null) {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.json(data);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
