const mongoose = require('mongoose');
const express = require('express');
const Schema = mongoose.Schema;

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

const Trip = new Schema({
    startLocation: {
        type: String,
        required: true
    },
    endLocation: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    preferences: {
        type: Preferences,
        required: true
    },
    numVehicles: {
        type: Number,
        required: true
    },
    selectedVehicles: {
        type: [String],
        required: true
    },
    allStops: {
        type: [{}],
        required: true
    },
    options: {
        type: [{}],
        required: true
    },
    chosenRoute: {
        type: Number,
        required: true
    },
    polyline: {
        type: [],
        required: true
    },
    stops: {
        type: [{}],
        required: true
    },
    user_email: {
        type: String,
        required: true
    },
    users_shared: {
        type: [{
            email: String,
            share_type: String
        }],
        required: false,
        default: []
    }
});

module.exports = mongoose.model('Trip', Trip);