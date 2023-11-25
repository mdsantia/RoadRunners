const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();
const mongoose = require('mongoose');
const Trip = null;
// const Trip = require('../Models/trip_model');
const axios = require('axios');
const {mongoURI} = require('../Constants');
const {roadRunnersEmail, roadRunnersEmailPwd} = require("../Constants");
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
    const {tripId, permission, shareTo} = req.body;

    // Check if trip exists
    const trip = await trip.findOne({tripId});

    if (!trip) {
        // Return user
        res.status(400).json({message: "Trip ID does not exist!"});
        return;
    }

    // Update trip
    
    // Call email function to send

    // Save trip
    await trip.save();
    res.status(200).json({trip: trip});
}

const sendEmail = (recepientEmail) => {
    const senderEmail = roadRunnersShareEmail;
    const senderEmailPwd = roadRunnersShareEmailPwd;

    var transport = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: senderEmail,
            pass: senderEmailPwd,
        },
    });

    const mailOptions = {
        from:
        {
            name: 'no-reply@roadrunners.com',
            address: senderEmail
        },
        to: recepientEmail,
        subject: "Test",
        html: "<html><h1>Welcome to RoadRunners!</h1><body><h4>"
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


module.exports = {shareTrip, sendEmail};