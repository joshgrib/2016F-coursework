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

var redis = require("redis");
var cache = redis.createClient(6379, 'localhost');

const CHECK_CACHE = true;

//add a user
router.post("/", (req, res) => {
    //no need to check cache here
    let newUser = req.body.user;
    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`user-added:${messageId}`, (userAdded, channel) => {
        redisConnection.off(`user-added:${messageId}`);
        redisConnection.off(`user-added-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);

        //save user to cache
        let idString = userAdded._id.toString();
        let userString = JSON.stringify(userAdded);
        cache.set(idString, userString, {expire: 60*5}, ()=>{});

        res.json(userAdded);
    });

    redisConnection.on(`user-added-failed:${messageId}`, (error, channel) => {
        redisConnection.off(`user-added:${messageId}`);
        redisConnection.off(`user-added-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
        
        res.status(500).json(error);
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
        if(result._id){
            return data.getUser(result._id).then((user) => {
                res.set('Auth-Token', newToken);
                res.json(newToken); 
            })
        }else{
            throw "Error logging user in"
        }
        
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
        redisConnection.off(`user-got:${messageId}`);
        redisConnection.off(`user-got-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);

        let idString = user._id.toString();
        let userString = JSON.stringify(user);
        cache.set(idString, userString, {expire: 60*5}, ()=>{});

        res.json(user);
    });

    redisConnection.on(`user-got-failed:${messageId}`, (error, channel) => {
        redisConnection.off(`user-got:${messageId}`);
        redisConnection.off(`user-got-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);

        res.status(500).json(error);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`user-got:${messageId}`);
        redisConnection.off(`user-got-failed:${messageId}`);

        res.status(500).json({error: "Timeout error"})
    }, 5000);

    let idString = userId.toString();
    cache.get(idString, (err, result) => {
        if((!err && result) && CHECK_CACHE){
            redisConnection.off(`user-got:${messageId}`);
            redisConnection.off(`user-got-failed:${messageId}`);
            clearTimeout(killswitchTimeoutId);
            return res.json(JSON.parse(result));
        }else{
            redisConnection.emit(`get-user:${messageId}`, {
                requestId: messageId,
                userId: userId
            });   
        }
    });
});

//get info for all users
router.get("/", (req, res) => {

    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`users-got:${messageId}`, (users, channel) => {
        let idString = 'user-list';
        let usersString = JSON.stringify(users);
        cache.set(idString, usersString, {expire: 60*10}, ()=>{});

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

    //check cache
    cache.get('user-list', (err, result) => {
        if((!err && result) && CHECK_CACHE){
            redisConnection.off(`users-got:${messageId}`);
            redisConnection.off(`users-got-failed:${messageId}`);
            clearTimeout(killswitchTimeoutId);
            return res.json(JSON.parse(result));
        }else{
            redisConnection.emit(`get-users:${messageId}`, {
                requestId: messageId
            });
        }
    });
});

//update a user
router.put("/", (req, res) => {
    let newUser = req.body.user;
    //check auth
    let isAuthorized = res.get('isAuthorized');
    if(isAuthorized === 'false'){
        res.sendStatus(401);
    }

    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`user-updated:${messageId}`, (user, channel) => {
        let idString = user._id.toString();
        let userString = JSON.stringify(user);
        cache.set(idString, userString, {expire: 60*5}, ()=>{});

        res.json(user);

        redisConnection.off(`user-updated:${messageId}`);
        redisConnection.off(`user-updated-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`user-updated-failed:${messageId}`, (error, channel) => {
        res.status(500).json(error);

        redisConnection.off(`user-updated:${messageId}`);
        redisConnection.off(`user-updated-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`user-updated:${messageId}`);
        redisConnection.off(`user-updated-failed:${messageId}`);

        res.status(500).json({error: "Timeout error"})
    }, 5000);

    let authToken = req.get('Auth-Token');
    let authTokenString = authToken.toString();
    cache.get(authTokenString, (err, result) => {
        if(err || !result){
            res.status(500).send("Error getting cached user ID");

            redisConnection.off(`user-updated:${messageId}`);
            redisConnection.off(`user-updated-failed:${messageId}`);
            clearTimeout(killswitchTimeoutId);
        }else{
            redisConnection.emit(`update-user:${messageId}`, {
                requestId: messageId,
                user: newUser,
                userId: result
            });    
        }
    });
});

//delete a user
router.delete("/", (req, res) => {
    //check auth
    let isAuthorized = res.get('isAuthorized');
    if(isAuthorized === 'false'){
        res.sendStatus(401);
    }

    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`user-deleted:${messageId}`, (userId, channel) => {
        let userIdString = userId.toString();
        cache.del(userIdString);

        res.json(userId);

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
    let authTokenString = authToken.toString();
    cache.get(authTokenString, (err, result) => {
        if(err || !result){
            res.status(500).send("Error getting cached user ID");
            redisConnection.off(`user-deleted:${messageId}`);
            redisConnection.off(`user-deleted-failed:${messageId}`);
            clearTimeout(killswitchTimeoutId);
        }else{
            redisConnection.emit(`delete-user:${messageId}`, {
                requestId: messageId,
                userId: result
            });
        }
    });
});

module.exports = router;