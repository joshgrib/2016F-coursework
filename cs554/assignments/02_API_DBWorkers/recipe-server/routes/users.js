const express = require('express');
const router = express.Router();
const recipeData = require("../../recipe-data");
const uuid = require("node-uuid");

router.post("/", (req, res) => {
    res.status(200).send("User created");
});

router.post("/session", (req, res) => {
    res.status(200).send("Post a username and password to get an auth token");
});

router.get("/:id", (req, res) => {
    res.status(200).send("Get info for a user here");
});

router.get("/", (req, res) => {
    res.status(200).send("Get info for all users here");
});

router.put("/", (req, res) => {
    res.status(200).send("Update a user here");
});

router.delete("/", (req, res) => {
    res.status(200).send("Delete your user here");
});

module.exports = router;