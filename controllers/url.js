const  shortid  = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: 'url is required' });

    const shortID = shortid.generate();
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });

    // Fetch all URLs from the database
    const urls = await URL.find();

    return res.render("home", {
        id: shortID,
        urls: urls // Pass the urls array to the template
    });
}


async function handleGetAnalytics(req, res) {
    try {
        const shortId = req.params.shortId;
        const result = await URL.findOne({ shortId });
        if (!result) {
            return res.status(404).json({ error: 'Short URL not found' });
        }
        return res.json({ totalClicks: result.visitHistory.length, analytics: result.visitHistory });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = { handleGenerateNewShortURL, handleGetAnalytics };