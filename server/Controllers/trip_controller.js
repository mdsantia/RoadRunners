const Trip = require('../Models/trip_model.js');
const User = require('../Models/user_model.js');
const axios = require('axios');
const {roadRunnersShareEmail, roadRunnersShareEmailPwd} = require("../Constants");
const nodemailer = require("nodemailer");

/*
    Check if the trip exists in Database to share to a recepient

    API: /api/user/shareTrip
    Method: POST
    Request: {name, email, age, google_id, google_expiry, profile_picture}
    Response: {name, email, age, google_id, google_expiry, profile_picture}
    responseCode: 200 if shared trip
    responseCode: 400 if trip is not found or created
*/

const shareTrip = async (req, res) => {
    const {tripId, senderName, senderEmail, senderProfilePicture, usersWithAccess, addedUsers} = req.body;

    console.log(`Share ${tripId} in progress \nSent by ${senderName},\n
    Changed Access: ${JSON.stringify(usersWithAccess)}\n
    Added: ${JSON.stringify(addedUsers)}\n`.yellow)

    // Check if trip exists
    const trip = await Trip.findOne({_id: tripId});

    if (!trip) {
        // Return user
        res.status(400).json({message: "Trip ID does not exist!"});
        return;
    }

    // Call email function to send for each added user
    for (let i = 0; i < addedUsers.length; i++) {
        const sendTo = addedUsers[i];
        sendEmail(tripId, senderName, senderEmail, senderProfilePicture, sendTo.permission, sendTo.email);
    }


    // Update trip
    trip.users_shared = usersWithAccess.concat(addedUsers);

    // Save trip
    await trip.save();
    res.status(200).json({users_shared: trip.users_shared, trip: trip});
}

const sendEmail = (tripId, senderName, senderEmail, senderProfilePicture, permission, recepientEmail) => {
    const noReplyEmail = roadRunnersShareEmail;
    const noReplyEmailPwd = roadRunnersShareEmailPwd;

    var transport = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: noReplyEmail,
            pass: noReplyEmailPwd,
        },
    });

    const mailOptions = {
        from:
        {
            name: 'no-reply@roadrunners.com',
            address: noReplyEmail
        },
        to: recepientEmail,
        subject: "Trip Shared with You",
        html: "<html><h1>" + senderName + "(" + senderEmail + ") has shared a trip with you.</h1><body><h4>"
    };
    transport.sendMail(mailOptions, (err, res) => {
        if (err) {
            console.log(`Unable to send email.\n${err}`.red.bold);
        }
        else {
            console.log(`The email was successfully sent!`.green.bold);
        }
    });
}


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
                users_shared: trip.users_shared,
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

    trip.owner = {
        email: user.email,
        name: user.name,
        profile_picture: user.profile_picture
    };
    // SPECIFY IT HAS OWNER PERMISSION
    trip.owner.permission = -1;

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

module.exports = {getAllTrips, getTrip, saveTrip, deleteTrip, clearAllTrips, shareTrip};
