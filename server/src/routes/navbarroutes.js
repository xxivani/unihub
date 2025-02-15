const express = require("express");
const router = express.Router();
const { getNavbarItems } = require("../controllers/navbarController");

router.get("/", getNavbarItems);

module.exports = router;
