// user.js
const { v4: uuidv4 } = require('uuid')
const User = require("../models/user");
const { setUser } = require('../service/auth')

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password,
    });
    // Redirect to a different route upon successful signup
    return res.redirect("/"); // You can replace '/signup-success' with the route you want to redirect to
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
    password,
  });
  if (!user)
    return res.render("login", {
      error: "Invalid username or password",
    });
    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie("uid", sessionId);
  // Redirect to a different route upon successful signup
  return res.redirect("/"); // You can replace '/signup-success' with the route you want to redirect to
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
