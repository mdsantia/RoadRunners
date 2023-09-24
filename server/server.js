const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 5010;

const user = "mdsantia";
const pwd = "PkLnDkpIynsO9YR8";

const mongoURI = `mongodb+srv://${user}:${pwd}@data.oknxymr.mongodb.net/Data?retryWrites=true&w=majority`;
// Moved the MongoDB client initialization outside of the function
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const dataRouter = require('./routes/data');

app.use('/api/data', dataRouter);

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}....`, yellow.bold);
});