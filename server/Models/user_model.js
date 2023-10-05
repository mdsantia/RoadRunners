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
    }

});

const Preferences = new Schema({
    budget: {
        type: String,
        required: true
    },
    commuteTime: {
        type: String,
        required: true
    },
    carsickRating: {
        type: String,
        required: true
    },
    attractionSelection: {
        type: [String],
        required: true
    },
    diningSelection: {
        type: [String],
        required: true
    },
    housingSelection: {
        type: [String],
        required: true
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
    }
});

module.exports = mongoose.model('User', User);