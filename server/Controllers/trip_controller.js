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
    }

    const trips = Trip.find({user_email: email});

    const tripList = [];

    trips.forEach(trip => {
        const tripObj = {
            startLocation: trip.startLocation,
            endLocation: trip.endLocation,
            startDate: trip.startDate,
            endDate: trip.endDate,
            preferences: trip.preferences,
            numVehicles: trip.numVehicles,
            selectedVehicles: trip.selectedVehicles,
        }
        tripList.push(tripObj);
    })

    res.status(200).json(tripList);
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

    const user = await User.findOne({email});
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
    res.status(200).json(trip);
}

/*
*   Delete a trip
*
*  API: /api/trip/deleteTrip/:id
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
    const trip = await Trip.findOne({_id: id});
    if (!trip) {
        res.status(400).json({message: 'Invalid trip'});
    }

    await trip.delete();
    user.trips = user.trips.filter(trip => trip._id !== id);
    await user.save();
    res.status(200).json(user);
}

module.exports = {getAllTrips, getTrip, saveTrip, deleteTrip};
