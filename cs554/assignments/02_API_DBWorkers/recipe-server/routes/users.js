const express = require('express');
const router = express.Router();
const data = require("../../recipe-data");
const uuid = require("node-uuid");

const NRP = require('node-redis-pubsub');
const config = {
    port: 6379, // Port of your locally running Redis server
    scope: 'assignment2' // Use a scope to prevent two NRPs from sharing messages
};

const redisConnection = new NRP(config); // This is the NRP client

//var cache = require('express-redis-cache')({host: 'localhost', port: 6379});

var redis = require("redis");
var cache = redis.createClient(6379, 'localhost');

//add a user
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

//get an auth token for the user given a username and password
router.post("/session", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let newToken = uuid.v4();

    //change this to redis MQ
    data.loginUser(username, password, newToken).then((result) => {
        //get user by auth token
        //return that token, error otherwise
        let authID = res.get('tokenID');
        return data.getUser(authID).then((user) => {
            res.set('Auth-Token', newToken);
            res.json(newToken); 
        })
    }).catch((err) => {
        res.status(500).json(err.toString());
    })
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

    let ulist = cache.get('user-list', (err, val) => {
        console.log("User list:");
        if(err || (val == undefined)){
            console.log("user list not cached yet");
            return;
        }else{
            console.log(val);
            return;
        }
    });

    redisConnection.on(`users-got:${messageId}`, (users, channel) => {
        res.json(users);
        redisConnection.off(`users-got:${messageId}`);
        redisConnection.off(`users-got-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`users-got-failed:${messageId}`, (error, channel) => {
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

//update a user
router.put("/", (req, res) => {
    let newUser = req.body.user;
    //check auth
    let isAuthorized = res.get('isAuthorized');
    if(isAuthorized === 'false'){
        res.sendStatus(401);
        return;
    }

    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`user-updated:${messageId}`, (users, channel) => {
        res.json(users);
        redisConnection.off(`user-updated:${messageId}`);
        redisConnection.off(`user-updated-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
        return;
    });

    redisConnection.on(`user-updated-failed:${messageId}`, (error, channel) => {
        res.status(500).json(error);
        redisConnection.off(`user-updated:${messageId}`);
        redisConnection.off(`user-updated-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
        return;
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`user-updated:${messageId}`);
        redisConnection.off(`user-updated-failed:${messageId}`);
        res.status(500).json({error: "Timeout error"})
        return;
    }, 5000);

    let authID = res.get('tokenID');
    redisConnection.emit(`update-user:${messageId}`, {
        requestId: messageId,
        user: newUser,
        userId: authID
    });     
});

//delete a user
router.delete("/", (req, res) => {
    //check auth
    let isAuthorized = res.get('isAuthorized');
    if(isAuthorized === 'false'){
        res.sendStatus(401);
        return;
    }

    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`user-deleted:${messageId}`, (users, channel) => {
        res.json(users);
        redisConnection.off(`user-deleted:${messageId}`);
        redisConnection.off(`user-deleted-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`user-deleted-failed:${messageId}`, (error, channel) => {
        res.status(500).json(error);
        redisConnection.off(`user-deleted:${messageId}`);
        redisConnection.off(`user-deleted-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`user-deleted:${messageId}`);
        redisConnection.off(`user-deleted-failed:${messageId}`);
        res.status(500).json({error: "Timeout error"})
    }, 5000);

    

    let authToken = req.get('Auth-Token');
    console.log('at');
    console.log(authToken.toString());
    cache.get(authToken.toString(), (err, cacheId) => {
        console.log('cid');
        console.log(cacheId);
        if(!err){
            redisConnection.emit(`delete-user:${messageId}`, {
                requestId: messageId,
                userId: cacheId
            });
        }else{
            res.status(500).send("Error getting cached user ID");
        }
    });
});

module.exports = router;