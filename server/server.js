const express = require('express');
const { MongoClient } = require('mongodb');
const colors = require("colors");
const mongoose = require('mongoose');

const app = express();
const port = 5010;

const user = "mdsantia";
const pwd = "efx777db3Fz8xHQi";
// set up mongoose and DB
const mongoURI = `mongodb+srv://${user}:${pwd}@data.oknxymr.mongodb.net/Data?retryWrites=true&w=majority`;
// Moved the MongoDB client initialization outside of the function
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true});
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`.red.bold);
    process.exit(1);
  }
  console.log("Connected to MongoDB".cyan.bold);
}

connectDB();
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
});

const dataRoutes = require('./Routes/data_routes');
const userRoutes = require('./Routes/user_routes');
const roadtripRoutes = require('./Routes/roadtrip_routes');
const vehiclesData = require('./Routes/vehiclesData_routes');

app.use('/api/data', dataRoutes);
app.use('/api/user', userRoutes);
app.use('/api/roadtrip', roadtripRoutes);
app.use('/api/vehiclesData', vehiclesData);
 
app.listen(port, console.log(`Server is running on PORT ${port}....`.yellow.bold));
module.exports = {user, pwd}