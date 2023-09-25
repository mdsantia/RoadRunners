const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../Models/user_model');

const newUser = async (req, res) => {
    console.log("Creating new user");
    const email = "test@email.com";
    const name = "Micky";
    const age = 14;

    const newUser = new User({
        name,
        email,
        age
    });

    try {
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

module.exports = {newUser};