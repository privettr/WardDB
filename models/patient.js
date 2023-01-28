const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    first: { type: String, required: true },
    second: String,
    town: { type: String, required: true },
    postcode: { type: String, required: true },
    dateOfAdmission: {
        type: Date,
        default: Date.now
    },
    room: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    MHA: {
        type: String,
        required: true
    },
    obs: {
        type: String,
        required: true
    },
    NEWS: {
        type: String,
        required: true
    },
    leave: {
        type: String,
        required: true
    },
    currentlyAdmitted: {
        type: Boolean,
        default: true,
    },
    notes: [{
        author: { type: String, required: true },
        body: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }],
})

module.exports = mongoose.model('Patient', patientSchema);