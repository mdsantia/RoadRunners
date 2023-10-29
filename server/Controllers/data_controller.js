const express = require('express');
const { MongoClient } = require('mongodb');
const { mongoURI } = require('../constants');

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

  module.exports = {saveData, updateData, getDatabaseData};