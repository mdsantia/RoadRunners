const Trip = require('../Models/trip_model.js');
const User = require('../Models/user_model.js');
const axios = require('axios');

/*
*   Get all trips for a user
*   
*   API: /api/trip/getTrips/:email
*   Method: GET
*   Params: email
*   Response: [Trip]
*   Errors: 400 - User not found
*/

const getAllTrips = async (req, res) => {
    const {email} = req.params;

    const user = await User.findOne({email});
    if (!user) {
        res.status(400).json({message: 'User not found'});
        return;
    }

    try {
        const trips = await Trip.find({user_email: email});

        const tripList = trips.map(trip => ({
                startLocation: trip.startLocation,
                endLocation: trip.endLocation,
                startDate: trip.startDate,
                endDate: trip.endDate,
                preferences: trip.preferences,
                numVehicles: trip.numVehicles,
                selectedVehicles: trip.selectedVehicles,
                user_email: trip.user_email,
                _id: trip._id
        }));

        res.status(200).json(tripList);
        return;
    } catch (err) {
        console.error('Error getting trips', err);
        res.status(400).json({message: 'Error getting trips'});
        return;
    }
}

/*
*   Get a trip by id
*
*   API: /api/trip/getTrip/:id
*   Method: GET
*   Params: id
*   Response: Trip
*   Errors: 400 - Trip not found
*/

const getTrip = async (req, res) => {
    const {id} = req.params;

    const trip = await Trip.findOne({_id: id});

    if (!trip) {
        res.status(400).json({message: 'Trip not found'});
    }

    res.status(200).json(trip);
}

/*
*  Add/Update a trip
*
*  API: /api/trip/saveTrip
*
*  Method: POST
*  Body: Trip details, id (if updating)
*  Response: Trip
*  Errors: 400 - Invalid trip
*
*/

const saveTrip = async (req, res) => {
    const {id, startLocation, endLocation, startDate, endDate, preferences, numVehicles, selectedVehicles, allStops, options, chosenRoute, polyline, stops, user_email} = req.body;
    const user = await User.findOne({email: user_email});
    if (!user) {
        res.status(400).json({message: 'Invalid user'});
        return;
    }
    // Trip is being updated
    if (id) {
        const trip = await Trip.findOne({_id: id});
        if (!trip) {
            res.status(400).json({message: 'Invalid trip'});
        }
        trip.startLocation = startLocation;
        trip.endLocation = endLocation;
        trip.startDate = startDate;
        trip.endDate = endDate;
        trip.preferences = preferences;
        trip.numVehicles = numVehicles;
        trip.selectedVehicles = selectedVehicles;
        trip.allStops = allStops;
        trip.options = options;
        trip.chosenRoute = chosenRoute;
        trip.polyline = polyline;
        trip.stops = stops;
        trip.user_email = user_email;
        await trip.save();
        res.status(200).json("Trip updated");
    }

    const trip = new Trip({
        startLocation,
        endLocation,
        startDate,
        endDate,
        preferences,
        numVehicles,
        selectedVehicles,
        allStops,
        options,
        chosenRoute,
        polyline,
        stops,
        user_email
    });

    await trip.save();
    user.trips.push(trip._id);
    await user.save();
    const response = {user: user, id: trip._id};
    res.status(200).json(response);
}

/*
*   Delete a trip
*
*  API: /api/trip/deleteTrip/:email/:id
*  Method: post
*  Params: id
* 
*  Errors: 400 - Trip not found
*/

const deleteTrip = async (req, res) => {
    const {id, email} = req.params;

    const user = await User.findOne({email});
    if (!user) {
        res.status(400).json({message: 'Invalid user'});
        return;
    }
    console.log(id, email);

    const trip = await Trip.findOne({_id: id});
    if (!trip) {
        res.status(400).json({message: 'Trip not found'});
        return;
    }
    await Trip.deleteOne({_id: id})
    for (let i = 0; i < user.trips.length; i++) {
        if (user.trips[i] == id) {
            user.trips.splice(i, 1);
            break;
        }
    }
    await user.save();
    res.status(200).json(user);
}


/* 
    Clear all trips from a user

    API: /api/trip/clearTrips/:email
    Method: POST
    Request: {email}
    Response: {user}
    responseCode: 200 if trips are cleared
    responseCode: 400 if user is not found
*/

const clearAllTrips = async (req, res) => {

    const {email} = req.params;

    // Check if user exists
    const user = await User.findOne({email});

    if (!user) {
        console.log(`ERROR in clearTrips User was not found`.red.bold);
        res.status(400).json({error: 'User not found'});
        return;
    }

    // Delete trips with user_email = email
    const Trips = await Trip.deleteMany({user_email: email});

    // Clear trips
    user.trips = [];
    await user.save();
    res.status(200).json(user);
    return;
}

module.exports = {getAllTrips, getTrip, saveTrip, deleteTrip, clearAllTrips};
