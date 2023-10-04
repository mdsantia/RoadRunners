const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../Models/user_model');
const Vehicle = require('../Models/user_model');

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
            name,
            email,
            preferences: preferences ? preferences : new Map(),
            google_id,
            google_expiry,
            profile_picture
        });

        // Save user
        await newUser.save();

        // Return user
        res.status(200).json(newUser);
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
    res.status(201).json(user);
}

/*
    Add a new vechile to the user array. If they have not already passed in MPG, 
    then we get it from an API.

    API: /api/user/addVehicle
    Method: POST
    Request: {email, make, model, year, color, mpg}
    Response: {email, make, model, year, color, mpg}
    responseCode: 200 if vehicle is added
    responseCode: 400 if user is not found

*/
const addVehicle = async (req, res) => {
    const {email, make, model, year, color, mpg} = req.body;
    console.log(req.body);

    // Check if user exists
    const user = await User.findOne({email});
    if (!user) {
        res.status(400).json({error: 'User not found'});
        return;
    }

    mpg = mpg ? mpg : await getMPG(make, model, year);
    // Create new vehicle
    const newVehicle ={
        make,
        model,
        year,
        color,
        mpg 
    };

    // Add vehicle to user
    user.vehicles.push(newVehicle);
    await user.save();
    console.log(user);
    res.status(200).json(user);
    return;
}

/* Helper Functions */
const getMPG = async (make, model, year) => {
    const url = `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${make}&model=${model}`;
    const response = await axios.get(url);
    const mpg = response.data.menuItems[0].value;
    return mpg;
}

module.exports = {checkAndSaveUser, addVehicle};