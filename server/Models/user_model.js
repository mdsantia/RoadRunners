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
        type: Number,
        required: true
    },
    mpg: {
        type: Number,
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
    age: {
        type: Number,
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
    }
    
});

module.exports = mongoose.model('User', User);