const express = require('express');
const router = express.Router();
const data = require("../../recipe-data");
const uuid = require("node-uuid");

//Add a user
router.post("/", (req, res) => {
    let newUser = req.body.user;
    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`user-added:${messageId}`, (userAdded, channel) => {
        res.json(userAdded);
        redisConnection.off(`user-added:${messageId}`);
        redisConnection.off(`user-added-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`user-added-failed:${messageId}`, (error, channel) => {
        res.status(500).json(error);
        redisConnection.off(`user-added:${messageId}`);
        redisConnection.off(`user-added-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`user-added:${messageId}`);
        redisConnection.off(`user-added-failed:${messageId}`);
        res.status(500).json({error: "Timeout error"})
    }, 5000);

    redisConnection.emit(`add-user:${messageId}`, {
        requestId: messageId,
        user: newUser
    });
});

router.post("/session", (req, res) => {
    res.status(200).send("Post a username and password to get an auth token");
});

//get user info
router.get("/:id", (req, res) => {
    let userId = req.params.id;
    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`user-got:${messageId}`, (user, channel) => {
        res.json(user);
        redisConnection.off(`user-got:${messageId}`);
        redisConnection.off(`user-got-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`user-got-failed:${messageId}`, (error, channel) => {
        res.status(500).json(error);
        redisConnection.off(`user-got:${messageId}`);
        redisConnection.off(`user-got-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`user-got:${messageId}`);
        redisConnection.off(`user-got-failed:${messageId}`);
        res.status(500).json({error: "Timeout error"})
    }, 5000);

    redisConnection.emit(`get-user:${messageId}`, {
        requestId: messageId,
        userId: userId
    });
});

//get info for all users
router.get("/", (req, res) => {
    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`users-got:${messageId}`, (users, channel) => {
        //TODO - pull out sensitive data here
        res.json(users);
        redisConnection.off(`users-got:${messageId}`);
        redisConnection.off(`users-got-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`user-gots-failed:${messageId}`, (error, channel) => {
        res.status(500).json(error);
        redisConnection.off(`users-got:${messageId}`);
        redisConnection.off(`users-got-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`users-got:${messageId}`);
        redisConnection.off(`users-got-failed:${messageId}`);
        res.status(500).json({error: "Timeout error"})
    }, 5000);

    redisConnection.emit(`get-users:${messageId}`, {
        requestId: messageId
    });
});

router.put("/", (req, res) => {
    res.status(200).send("Update your user here");
});

router.delete("/", (req, res) => {
    res.status(200).send("Delete your user here");
});

module.exports = router;