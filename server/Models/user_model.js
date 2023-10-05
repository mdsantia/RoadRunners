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
    // Preferences will be a hash map of preferences
    preferences: {
        type: Map,
        of: String,
        default: new Map()
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