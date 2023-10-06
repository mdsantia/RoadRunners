const { MongoClient } = require('mongodb');
const user = "mdsantia";
const pwd = "PkLnDkpIynsO9YR8";
const mongoURI = `mongodb+srv://${user}:${pwd}@data.oknxymr.mongodb.net/Data?retryWrites=true&w=majority`;

// Moved the MongoDB client initialization outside of the function
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function getDatabaseData(database, collection, query) {
    try {
      // Connect to MongoDB before querying
      await client.connect();
  
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

async function listCollections() {
const client = new MongoClient(url, { useNewUrlParser: true });

try {
    // Connect to the MongoDB server
    await client.connect();

    // Get a reference to the database
    const db = client.db("Vehicles");

    // List all collections in the database
    const collections = await db.listCollections().toArray();

    // Extract the collection names from the result
    const collectionNames = collections.map((collection) => collection.name);

    return collectionNames;
} finally {
    // Close the connection when done
    await client.close();
}
}

async function findUniqueMakes(collectionName) {
    const client = new MongoClient(url, { useNewUrlParser: true });
  
    try {
      // Connect to the MongoDB server
      await client.connect();
  
      // Get a reference to the database
      const db = client.db("Vehicles");
  
      // Use the distinct method to find unique 'make' values
      const uniqueMakes = await db.collection(collectionName).distinct('make');
  
      return uniqueMakes;
    } finally {
      // Close the connection when done
      await client.close();
    }
  }

const getACar = async (req, res) => {
    // if year is not given, returns all years
    if (!req.query.year) {
        listCollections()
        .then((collectionNames) => {
            console.log(`Unique Car Year ${collectionNames}`.green.bold);
            res.status(201).json(collectionNames);
        })
        .catch((error) => {
            console.error(`Error: ${error}`.red.bold);
            res.status(400).json({ message: error });
        });
    }
    // if make is not given, returns all makes
    if (!req.query.make) {
        findUniqueMakes(req.query.year)
        .then((uniqueMakes) => {
            console.log(`Unique Car in ${req.query.year} Makes ${uniqueMakes}`.green.bold);
            res.status(201).json(uniqueMakes);
        })
        .catch((error) => {
            console.error(`Error: ${error}`.red.bold);
            res.status(400).json({ message: error });
        });
    }
    // if model is not given, returns all models
} 

module.exports = {getACar};