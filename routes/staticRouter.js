const express = require('express');
const router = express.Router();
const URL = require('../models/url'); // Import the URL model

router.get('/', async (req, res) => { // Mark the callback function as async
    try {
        if (!req.user) return res.redirect("/login");
        const allUrls = await URL.find({ createdBy: req.user._id });
        return res.render("home", { 
            urls: allUrls, 
        });
    } catch (error) {
        console.error("Error fetching URLs:", error);
        return res.status(500).send("Internal Server Error");
    }
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.get("/login", (req, res) => {
    return res.render("login");
});

module.exports = router;
