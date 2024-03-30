// Import necessary modules
const express = require('express');
const path = require('path');
const { connectToMongoDB } = require('./connect');
const { restrictToLoggedinUserOnly, checkAuth } = require('./middlewares/auth');
const URL = require('./models/url');
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user')
const cookieParser = require('cookie-parser')

const app = express();
const PORT = 8001;

// Connect to MongoDB
connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB:", err);
    });

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/url", restrictToLoggedinUserOnly, urlRoute); // Using the urlRoute router for /url-related routes
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute); // Using the staticRoute router for static routes (like home page)

// No need to handle /url/:shortId GET request here, as it's already handled in urlRoute
app.get('/url/:shortId', async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate({
            shortId
        }, {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                }
            }
        });

        if (!entry) {
            return res.status(404).send('URL not found');
        }

        // Redirect to the original URL only if it's a direct access (not a refresh)
        if (req.headers.referer !== `${req.protocol}://${req.get('host')}/url/${shortId}`) {
            res.redirect(entry.redirectURL);
        } else {
            res.send('This is a refresh, not a direct access to the short URL.');
        }
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
