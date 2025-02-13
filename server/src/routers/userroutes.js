const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = await User.create({ name, email, password });
  res.status(201).json(newUser);
});

module.exports = router;
