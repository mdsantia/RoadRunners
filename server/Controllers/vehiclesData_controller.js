const { MongoClient } = require('mongodb');
const { mongoURI } = require('../Constants');

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
      const data = document._id;
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
  try {
    // Connect to the MongoDB server
    await client.connect();

    // Get a reference to the database
    const db = client.db("Vehicles");

    // List all collections in the database
    const collections = await db.listCollections().toArray();

    // Extract the collection names from the result
    const collectionNames = collections.map((collection) => parseInt(collection.name));

    return collectionNames;
  } catch {
    // Close the connection when done
    await client.close();
  }
}

async function findUniqueMakes(collectionName) {
  try {
    // Connect to the MongoDB server
    await client.connect();

    // Get a reference to the database
    const db = client.db("Vehicles");

    // Use the distinct method to find unique 'make' values
    const uniqueMakes = await db.collection(collectionName).distinct('make');

    return uniqueMakes;
  } catch {
    // Close the connection when done
    await client.close();
  }
}

async function findUniqueModelsForMake(collectionName, make) {
  try {
    // Connect to the MongoDB server
    await client.connect();

    // Get a reference to the database
    const db = client.db("Vehicles");

    // Use the distinct method to find unique 'model' values
    const uniqueModels = await db
      .collection(collectionName)
      .distinct('model', { make: make });

    return uniqueModels;
  } catch {
    // Close the connection when done
    await client.close();
  }
}
const getYears = async (req, res) => {
  listCollections()
  .then((collectionNames) => {
    console.log(`Unique Car Years: ${collectionNames}`.green.bold);
    res.status(201).json(collectionNames);
  })
  .catch((error) => {
    console.error(`Error: ${error}`.red.bold);
    res.status(400).json({ message: error });
  });
  return;
}

const getMakes = async (req, res) => {
  findUniqueMakes(req.query.year)
  .then((uniqueMakes) => {
    //console.log(`Unique Car in '${req.query.year}': ${uniqueMakes}`.green.bold);
    res.status(201).json(uniqueMakes);
  })
  .catch((error) => {
    console.error(`Error: ${error}`.red.bold);
    res.status(400).json({ message: error });
  });
  return;
}

const getModels = async (req, res) => {
  findUniqueModelsForMake(req.query.year, req.query.make)
  .then((uniqueModels) => {
    //console.log(`Unique models for year '${req.query.year}' with make '${req.query.make}':${uniqueModels}`.green.bold);
    res.status(201).json(uniqueModels);
  })
  .catch((error) => {
    console.error(`Error: ${error}`.red.bold);
    res.status(400).json({ message: error });
  });
  return;
}
  
const getMPG = async (req, res) => {
  const query = {make: req.query.make, model: model}
  getDatabaseData("Vehicles", req.query.year, query)
  .then((vehicleData)=> {
    const vehicleMPG = vehicleData['mpgData'];
    //console.log(`The MPG for your given car is: ${vehicleMPG}`.green.bold);
    res.status(201).json(vehicleMPG);
  })
  .catch((error) => {
    console.error(`Error: ${error}`.red.bold);
    res.status(400).json({ message: error });
  });
}

const getACar = async (req, res) => {
  // if year is not given, returns all years
  let result = {years: [], makes: [], models: []};
  let string = '';
  try {
    let years = await listCollections();
    result.years = years.sort((a, b) => a - b);
    string = `Unique Car Years: ${result.years}`;
    if (!req.query.year) {
      result.data = result.years;
    }

    if (req.query.year) {
      let makes = await findUniqueMakes(req.query.year);
      result.makes = makes.sort((a, b) => a - b);
      string = `Unique Car in '${req.query.year}': ${result.makes}`;
    }

    if (req.query.make) {
      let models = await findUniqueModelsForMake(req.query.year, req.query.make);
      result.models = models.sort((a, b) => a - b);
      string = `Unique models for year '${req.query.year}' with make '${req.query.make}':${result.models}`;
      if (!req.query.model) {
        result.data = result.models;
      }
    }

    console.log(string.green.bold);
    res.status(201).json(result);
  } catch (error) {
    console.error(`Error: ${error}`.red.bold);
    res.status(400).json({ message: error });
  }
}

module.exports = {getACar, getYears, getMakes, getModels, getMPG};