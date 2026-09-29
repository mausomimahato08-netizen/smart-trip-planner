const express = require("express");
const router = express.Router();
const Trip = require("../models/trip");

router.post("/save-trip", async (req, res) => {
    try {
        const trip = new Trip(req.body);
        await trip.save();

        res.json({
            success: true,
            message: "Trip Saved Successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
router.get("/trips", async (req, res) => {
    try {
        const trips = await Trip.find();

        res.json({
            success: true,
            trips
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
router.delete("/delete-trip/:id", async (req, res) => {
    try {

        await Trip.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Trip Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});
router.put("/update-trip/:id", async (req, res) => {
    try {

        await Trip.findByIdAndUpdate(req.params.id, req.body);

        res.json({
            success: true,
            message: "Trip Updated Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});
router.put("/favorite-trip/:id", async (req, res) => {

    try {

        const trip = await Trip.findById(req.params.id);

        trip.favorite = !trip.favorite;

        await trip.save();

        res.json({
            success: true,
            message: "Favorite Updated"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

module.exports = router;