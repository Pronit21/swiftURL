// user.js
const express = require('express');
const { handleUserSignup, handleUserLogin } = require("../controllers/user");
const router = express.Router();

// Handle user signup POST request
router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);

module.exports = router;
