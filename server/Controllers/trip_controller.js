const Trip = require('../Models/trip_model.js');
const User = require('../Models/user_model.js');
const axios = require('axios');
const {roadRunnersShareEmail, roadRunnersShareEmailPwd} = require("../Constants");
const nodemailer = require("nodemailer");

/*
    Check if the trip exists in Database to share to a recepient
    View only: 1, Edit: 2

    API: /api/user/shareTrip
    Method: POST
    Request: {name, email, age, google_id, google_expiry, profile_picture}
    Response: {name, email, age, google_id, google_expiry, profile_picture}
    responseCode: 200 if shared trip
    responseCode: 400 if trip is not found or created
*/

const shareTrip = async (req, res) => {
    const {tripId, senderName, senderEmail, senderProfilePicture, usersWithAccess, addedUsers, initialState} = req.body;

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
    const sendTo = addedUsers.filter((addedUser) => !initialState.some((initialStateUser) => initialStateUser.email === addedUser.email));
    for (let i = 0; i < sendTo.length; i++) {
        sendEmail(trip, senderName, senderEmail, senderProfilePicture, sendTo[i].permission, sendTo[i].email);
        console.log("Email being sent to " + sendTo[i].email + "...");
    }

    let currentUsers = trip.users_shared;
    // If user is in currentUsers, but not in usersWithAccess, remove trip id from user
    const usersNotInNewUsers = currentUsers.filter(currentUser =>
        !usersWithAccess.some(newUser => newUser.email === currentUser.email)
    );

    usersNotInNewUsers.forEach(async user => {
        const userToRemoveFrom = await User.findOne({email: user.email});
        if (!user) {
            console.log(`ERROR in shareTrip User was not found`.red.bold);
            res.status(400).json({error: 'User not found'});
            return;
        }
        // Remove trip from user
        userToRemoveFrom.tripsShared = userToRemoveFrom.tripsShared.filter(trip => trip != tripId);
        userToRemoveFrom.save();
    });

    addedUsers.forEach(async user => {
        const userToAdd = await User.findOne({email: user.email});
        if (!user) {
            console.log(`ERROR in shareTrip User was not found`.red.bold);
            res.status(400).json({error: 'User not found'});
            return;
        }
        // Add trip to user
        userToAdd.tripsShared.push(tripId);
        userToAdd.save();
    });

    // Update trip
    trip.users_shared = usersWithAccess.concat(addedUsers);

    // Save trip
    await trip.save();
    res.status(200).json({users_shared: trip.users_shared, trip: trip});
}

const sendEmail = (trip, senderName, senderEmail, senderProfilePicture, permission, recepientEmail) => {
    const noReplyEmail = roadRunnersShareEmail;
    const noReplyEmailPwd = roadRunnersShareEmailPwd;
    const permissionWord = (permission === 1) ? "view" : "edit";

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
        html: `<html>
                <head>
                    <style>
                        .container {
                            display: grid;
                            grid-template-columns: auto 1fr;
                            gap: 1%;
                            align-items: center;
                        }
                        img.circular-profile {
                            border-radius: 100%;
                            width: 50px;
                            height: 50px;
                        }
                        a.button {
                            display: inline-block;
                            padding: 10px;
                            background-color: darkblue;
                            color: #fff;
                            text-decoration: none;
                            border-radius: 50px;
                            margin: 0 auto;
                        }
                    </style>
                </head>
                <h2>${senderName} has shared a trip with you.</h2>
                <body>
                    <div class="container">
                        <img src="${senderProfilePicture}" class="circular-profile" alt="Profile Picture">
                        <p>${senderName} (${senderEmail}) has invited you to <b>${permissionWord}</b> the following trip:</p>
                    </div>
                    <br>
                    <p>
                        Starting&nbsp from &nbsp<b><i>${trip.startLocation}</i></b>&nbsp&nbsp to &nbsp<tr><td><b><i>${trip.endLocation}</i></b></td></tr>
                        <br>
                        Beginning&nbsp on &nbsp<b><i>${trip.startDate.toLocaleDateString()}</i></b>&nbsp&nbsp until &nbsp<b><i>${trip.endDate.toLocaleDateString()}</i></b>
                        <br>
                        Number of Stops: &nbsp<b><i>${trip.stops.length - 2}</i></b>
                    </p>
                    <br>
                    <a href="http://localhost:3000/dashboard/${trip._id}" class="button">Open Trip</a>
                    <br><br>
                    <p style="font-size: 15px; color: gray;">Thank you for supporting RoadRunners, enjoy your trip!</p>
                </body>
            </html>`
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
* Get all trips that are shared with a user (tripids in tripsShared)
*
* API: /api/trip/getAllSharedTrips
* Method: GET
* Params: user email
* Response: List of trips: {tripId, ownerEmail, ownerProfilePicture, permission}
* Errors: 400 - User not found
*/

const getAllSharedTrips = async (req, res) => {
    const {email} = req.params;
    
    const user = await User.findOne({email});

    if (!user) {
        res.status(400).json({message: 'User not found'});
        return;
    }

    const tripIds = user.tripsShared;
    console.log(tripIds);
    let trips = [];
    for (let i = 0; i < tripIds.length; i++) {
        const trip = await Trip.findOne({_id: tripIds[i]});
        if (!trip) {
            console.log(`ERROR in getAllSharedTrips Trip was not found`.red.bold);
            res.status(400).json({error: 'Trip not found'});
            return;
        }
        trips.push({
            _id: trip._id,
            owner: trip.owner,
            startLocation: trip.startLocation,
            endLocation: trip.endLocation,
            startDate: trip.startDate,
            endDate: trip.endDate,
            permission: trip.users_shared.find(user => user.email == email).permission
        });
    }

    res.status(200).json(trips);
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
                _id: trip._id,
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

module.exports = {getAllTrips, getTrip, saveTrip, deleteTrip, clearAllTrips, shareTrip, getAllSharedTrips};
