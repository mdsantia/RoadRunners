const mongoose = require('mongoose');
const express = require('express');
const Schema = mongoose.Schema;

const app = express();

const Vehicle = new Schema({
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    mpg: {
        type: String,
        required: true
    },
    fuelGrade: {
        type: String,
        required: false
    },
    ranking: {
        type: Number,
        required: true
    },
});

const Preferences = new Schema({
    budget: {
        type: String,
    },
    commuteTime: {
        type: String,
    },
    carsickRating: {
        type: String,
    },
    attractionSelection: {
        type: [String],
    },
    diningSelection: {
        type: [String],
    },
    housingSelection: {
        type: [String],
    }
});

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    vehicles: {
        type: [Vehicle],
        default: []
    },
    preferences: {
        type: Preferences,
        default: {}
    },
    filled_preferences: {
        type: Boolean,
        default: false
    },
    trips: {
        type: [String],
        default: []
    },
    google_id: {
        type: String,
        required: true
    },
    google_expiry: {
        type: Number,
        required: true
    },
    profile_picture: {
        type: String,
    },
    //Trips shared with user
    tripsShared: {
        type: [String],
        required: true
    },
});

module.exports = mongoose.model('User', User);