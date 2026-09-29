const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    destination: {
        type: String,
        required: true
    },
    travelDate: {
        type: String,
        required: true
    },
    travelers: {
        type: Number,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    favorite: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Trip", tripSchema);