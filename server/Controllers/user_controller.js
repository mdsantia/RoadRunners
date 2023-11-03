const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../Models/user_model');
const axios = require('axios');
const LZString = require('lz-string');

/*
    Check if a user already exists, if they do update and return them
    If they don't exist, create a new user and return them

    API: /api/user/checkAndSaveUser
    Method: POST
    Request: {name, email, age, google_id, google_expiry, profile_picture}
    Response: {name, email, age, google_id, google_expiry, profile_picture}
    responseCode: 200 if user is found
    responseCode: 201 if user is created
    responseCode: 400 if user is not found or created
*/
const checkAndSaveUser = async (req, res) => {
    const {name, email, age, google_id, google_expiry, preferences, profile_picture} = req.body;

    // Check if user exists
    const user = await User.findOne({email});

    if (!user) {
        // Create new user
        const newUser = new User({
            name: name,
            email: email,
            age: age,
            google_id: google_id,
            google_expiry: google_expiry,
            profile_picture: profile_picture
        });

        // Save user
        await newUser.save();

        // Return user
        res.status(200).json({user: newUser, firstTime: true});
        return;
    }

    // Update user
    user.name = name;
    user.age = age ? age : user.age;
    user.google_id = google_id;
    user.google_expiry = google_expiry;
    user.profile_picture = profile_picture;
    
    // Save user
    await user.save();
    res.status(201).json({user: user, firstTime: false});
}

/*
    Delete a trip 

    API: /api/user/deleteTrip
    Method: POST
    Request: {email, id}
    Response: {user}
    responseCode: 200 if trip is deleted
    responseCode: 400 if user is not found or trip is not found
*/

const deleteTrip = async (req, res) => {
    const {email, id} = req.body;
    // Check if user exists
    const user = await User.findOne({email});

    if (!user) {
        console.log(`ERROR in deleteTrip User was not found`.red.bold);
        res.status(400).json({error: 'User not found'});
        return;
    }

    // Delete trip
    for (let i = 0; i < user.trips.length; i++) {
        if (user.trips[i]._id === id) {
            user.trips.splice(i, 1);
            await user.save();
            res.status(200).json(user);
            return;
        }
    }

    console.log(`ERROR in deleteTrip Trip was not found`.red.bold);
    res.status(400).json({error: 'Trip not found'});
    return;
}

/* 
    Clear all trips from a user

    API: /api/user/clearTrips
    Method: POST
    Request: {email}
    Response: {user}
    responseCode: 200 if trips are cleared
    responseCode: 400 if user is not found
*/

const clearTrips = async (req, res) => {

    const {email} = req.body;

    // Check if user exists
    const user = await User.findOne({email});

    if (!user) {
        console.log(`ERROR in clearTrips User was not found`.red.bold);
        res.status(400).json({error: 'User not found'});
        return;
    }

    // Clear trips
    user.trips = [];
    await user.save();
    res.status(200).json(user);
    return;
}

/*
    Saves a trip given the hash, and id if it exists (if it exists, it is an update)

    API: /api/user/saveTrip
    Method: POST
    Request: {email, hash, id (optional)}
    Response: {user}
    responseCode: 200 if trip is saved
    responseCode: 400 if user is not found
*/

const saveTrip = async (req, res) => {
    const {email, hash, id, allStops, options, chosenRoute, polyline, stops} = req.body;
    // Check if user exists
    const user = await User.findOne({email});
    if (!user) {
        console.log(`ERROR in saveTrip User was not found`.red.bold);
        res.status(400).json({error: 'User not found'});
        return;
    }

    // They are updating a trip
    if (id) {
        console.log(id);
        for (let i = 0; i < user.trips.length; i++) {
            if (user.trips[i]._id == id) {
                const newTrip = {
                    _id: id,
                    hash: hash,
                    allStops: allStops,
                    options: options,
                    chosenRoute: chosenRoute,
                    polyline: polyline,
                    stops: stops
                }
                
                user.trips[i] = newTrip; 
                await user.save();
                res.status(200).json(user);
                return;
            }
        }
        console.log(`ERROR in saveTrip Trip was not found`.red.bold);
        res.status(400).json({error: 'Trip not found'});
        return;
    } 

    const newTrip = { 
        hash: hash,
        allStops: allStops,
        options: options,
        chosenRoute: chosenRoute,
        polyline: polyline,
        stops: stops
    }

    // Add trip to user
    user.trips.push(newTrip);
    await user.save();
    
    let tripDetails = JSON.parse(atob(hash)).tripDetails;
    tripDetails.id = user.trips[user.trips.length - 1]._id;
    const tripDetailsToHash = {
        startLocation: tripDetails.startLocation,
        endLocation: tripDetails.endLocation,
        startDate: tripDetails.startDate,
        endDate: tripDetails.endDate,
        preferences: tripDetails.preferences,
        numVehicles: tripDetails.numVehicles,
        selectedVehicles: tripDetails.selectedVehicles,
        id: tripDetails.id
    }
    const newHash = btoa(JSON.stringify({tripDetails: tripDetailsToHash}));
    user.trips[user.trips.length - 1].hash = newHash;
    await user.save();
    res.status(200).json(user);
}

/*
    Add a new vechile to the user array. If they have not already passed in MPG, 
    then we get it from an API.

    API: /api/user/addVehicle
    Method: POST
    Request: {email, make, model, year, color, mpg}
    Response: {email, make, model, year, color, mpg}
    responseCode: 200 if vehicle is added
    responseCode: 201 if vehicle is added but there is no mpg data
    responseCode: 400 if user is not found or duplicate vehicle is detected
    
    */
const addVehicle = async (req, res) => {
    const {email, make, model, year, color, mpgGiven, fuelGradeGiven } = req.body;
    var mpg = mpgGiven;
    var fuelGrade = fuelGradeGiven;
    
    // Check if user exists
    const user = await User.findOne({email});
    if (!user) {
        console.log(`ERROR User was not found`.red.bold);
        res.status(400).json({error: 'User not found'});
        return;
    }

    mpg = mpgGiven ? mpgGiven : await getMPG(make, model, year);
    mpg = -1 ? 20 : mpg;
    // fuelGrade = fuelGradeGiven ? fuelGradeGiven : await getFuelGrade(make, model, year);
    // Create new vehicle
    const newVehicle = {
        make,
        model,
        year,
        color,
        mpg,
        fuelGrade
    };

    let i = 0;
    for (; i < user.vehicles.length; i++) {
        // Check if vehicle already exists
        if (make === user.vehicles[i].make && model === user.vehicles[i].model && year === user.vehicles[i].year && color === user.vehicles[i].color) {
            console.log(`ERROR Vehicle exists`.red.bold);
            res.status(400).json({error: 'Vehicle already exists'});
            return;
        }
    }

    newVehicle.ranking = i;
    // Add vehicle to user
    user.vehicles.push(newVehicle);
    await user.save();
    if (mpg === -1) {
        res.status(201).json(user);
        return;
    }
    res.status(200).json(user);
    return;
}

/*
    Edit a vehicle in user array

    API: /api/user/editVehicle
    Method: POST
    Request: {email, _id}
    Response: {user}
    responseCode: 200 if vehicle is editted
    responseCode: 400 if user is not found or no vehicle is found
    
    */
const editVehicle = async (req, res) => {
    const {email, _id, make, model, year, color, mpgGiven, fuelGradeGiven } = req.body;
    // Check if user exists
    const user = await User.findOne({email});
    if (!user) {
        console.log(`ERROR User was not found`.red.bold);
        res.status(400).json({error: 'User not found'});
        return;
    }

    let i = 0;
    for (; i < user.vehicles.length; i++) {
        // Check if vehicle already exists
        if (user.vehicles[i]._id === _id) {
            break;
        }
    }
    if (i === user.vehicles.length) {
        console.log(`ERROR Vehicle does not exist`.red.bold);
        res.status(400).json({error: 'Vehicle was not found'});
    }

    const mpg = mpgGiven ? mpgGiven : await getMPG(make, model, year);
    mpg = -1 ? 20 : mpg;
    // const fuelGrade = fuelGradeGiven ? fuelGradeGiven : await getFuelGrade(make, model, year);
    const newVehicle = {
        _id,
        year,
        make,
        model,
        color,
        ranking: i,
        mpg,
        fuelGrade
    }
    // Add editted vehicle to user
    user.vehicles[i] = newVehicle;
    await user.save();
    res.status(200).json(user);
    return;
}

/*
    UPDATE VEHICLE RANKING

    API: /api/user/vehicleRanking
    Method: POST
    Request: {email, vehicles}
    Response: {user}
    responseCode: 200 if vehicles is updated
    responseCode: 400 if user is not found or duplicate vehicle is detected
    
    */
const vehicleRanking = async (req, res) => {
    const {email, vehicles } = req.body;
    
    // Check if user exists
    const user = await User.findOne({email});
    if (!user) {
        console.log(`ERROR User was not found`.red.bold);
        res.status(400).json({error: 'User not found'});
        return;
    }

    // Update vehicles to user
    user.vehicles = vehicles;
    await user.save();
    res.status(200).json(user);
    return;
}

/*
    Remove a vehicle from the user array given the vehicle info
    
    API: /api/user/removeVehicle
    Method: POST
    Request: {email, make, model, year, color}
    Response: {user}
    responseCode: 200 if vehicle is removed
    responseCode: 400 if user is not found
*/
const removeVehicle = async (req, res) => {
    const {email, _id} = req.body;

    // Check if user exists
    const user = await User.findOne({email});
    if (!user) {
        console.log(`ERROR User was not found`.red.bold);
        res.status(400).json({error: 'User not found'});
        return;
    }

    for (let i = 0; i < user.vehicles.length; i++) {
        // Check if vehicle already exists
        if (user.vehicles[i]._id === _id) {
            // Remove vehicle from user
            user.vehicles.splice(i, 1);
        }
    }

    // Update rankings
    for (let i = 0; i < user.vehicles.length; i++) {
        user.vehicles[i].ranking = i;
    }

    await user.save();
    res.status(200).json(user);
    return;
}

/*
    Given an object of preferences, update the user's preferences

    API: /api/user/setPreferences
    Method: POST
    Request: {email, preferences}
    Response: {user}
    responseCode: 200 if preferences are set
    responseCode: 400 if user is not found
*/
const setPreferences = async (req, res) => {
    const {email, preferences} = req.body;
    // Check if user exists
    const user = await User.findOne({email: email});
    if (!user) {
        res.status(400).json({error: 'User not found'});
        return;
    }

    const newPreferences = {
        budget: preferences.budget,
        commuteTime: preferences.commuteTime,
        carsickRating: preferences.carsickRating,
        attractionSelection: preferences.attractionSelection,
        diningSelection: preferences.diningSelection,
        housingSelection: preferences.housingSelection
    };

    user.preferences = newPreferences;
    user.markModified('preferences');
    user.filled_preferences = true;
    await user.save();
    res.status(200).json(user);
    return;
}

/* Helper Functions */
const getMPG = async (make, model, year) => {
    // Mongodb Vehicle connection
    const user = "mdsantia";
    const pwd = "PkLnDkpIynsO9YR8";
    const mongoURI = `mongodb+srv://${user}:${pwd}@data.oknxymr.mongodb.net/Data?retryWrites=true&w=majority`;
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    var id = -1;
    try {
        await client.connect();
        const db = client.db("Vehicles");
        const col = db.collection(year + '');
        const query = {make: make, model: model};
        const document = await col.findOne(query);
        const mpgData = document.mpgData;
        if (mpgData === 'N') {
            return -1;
        }
        id = document.id;
    } catch (error) {
        console.error('Error querying MongoDB:', error);
        return -1;
    } finally {
        await client.close();
    }
    const url = `https://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/${id}`;
    const response = await axios.get(url);
    const mpg = Math.round(response.data.avgMpg);
    return mpg;
}

// const getFuelGrade = async (make, model, year) => {
//     // Mongodb Vehicle connection
//     const user = "mdsantia";
//     const pwd = "PkLnDkpIynsO9YR8";
//     const mongoURI = `mongodb+srv://${user}:${pwd}@data.oknxymr.mongodb.net/Data?retryWrites=true&w=majority`;
//     const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
//     var id = -1;
//     try {
//         await client.connect();
//         const db = client.db("Vehicles");
//         const col = db.collection(year + '');
//         const query = {make: make, model: model};
//         const document = await col.findOne(query);
//         const fuelGradeData = document.mpgData;
//         if (fuelGrade === 'N') {
//             return -1;
//         }
//         id = document.id;
//     } catch (error) {
//         console.error('Error querying MongoDB:', error);
//         return -1;
//     } finally {
//         await client.close();
//     }
//     const url = `https://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/${id}`;
//     const response = await axios.get(url);
//     const fuelGrade = Math.round(response.data.avgMpg);
//     return fuelGrade;
// }

module.exports = {checkAndSaveUser, addVehicle, removeVehicle, setPreferences, saveTrip, vehicleRanking, editVehicle, deleteTrip, clearTrips};