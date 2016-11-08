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

const CHECK_CACHE = false;

//add a recipe
router.post("/", (req, res) => {
    //check auth
    let isAuthorized = res.get('isAuthorized');
    if(isAuthorized === 'false'){
        res.sendStatus(401);
    }

    let newRecipe = req.body.recipe;
    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`recipe-added:${messageId}`, (recipeAdded, channel) => {
        redisConnection.off(`recipe-added:${messageId}`);
        redisConnection.off(`recipe-added-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);

        //save recipe to cache
        let idString = recipeAdded._id.toString();
        let recipeString = JSON.stringify(recipeAdded);
        cache.set(idString, recipeString, {expire: 60*60}, ()=>{});

        res.json(recipeAdded);
    });

    redisConnection.on(`recipe-added-failed:${messageId}`, (error, channel) => {
        redisConnection.off(`recipe-added:${messageId}`);
        redisConnection.off(`recipe-added-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
        
        res.status(500).json(error);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`recipe-added:${messageId}`);
        redisConnection.off(`recipe-added-failed:${messageId}`);

        res.status(500).json({error: "Timeout error"})
    }, 5000);


    let authToken = req.get('Auth-Token');
    let authTokenString = authToken.toString();
    cache.get(authTokenString, (err, result) => {
        if(err || !result){
            res.status(500).send("Error getting cached recipe ID");
            redisConnection.off(`recipe-added:${messageId}`);
            redisConnection.off(`recipe-added-failed:${messageId}`);
            clearTimeout(killswitchTimeoutId);
        }else{
            redisConnection.emit(`add-recipe:${messageId}`, {
                requestId: messageId,
                recipe: newRecipe,
                userId: result
            });
        }
    });
});

//get recipe info
router.get("/:id", (req, res) => {
    let recipeId = req.params.id;

    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`recipe-got:${messageId}`, (recipe, channel) => {
        redisConnection.off(`recipe-got:${messageId}`);
        redisConnection.off(`recipe-got-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);

        let idString = recipe._id.toString();
        let recipeString = JSON.stringify(recipe);
        cache.set(idString, recipeString, {expire: 60*5}, ()=>{});

        res.json(recipe);
    });

    redisConnection.on(`recipe-got-failed:${messageId}`, (error, channel) => {
        redisConnection.off(`recipe-got:${messageId}`);
        redisConnection.off(`recipe-got-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);

        res.status(500).json(error);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`recipe-got:${messageId}`);
        redisConnection.off(`recipe-got-failed:${messageId}`);

        res.status(500).json({error: "Timeout error"})
    }, 5000);

    let idString = recipeId.toString();
    cache.get(idString, (err, result) => {
        if((!err && result) && CHECK_CACHE){
            redisConnection.off(`recipe-got:${messageId}`);
            redisConnection.off(`recipe-got-failed:${messageId}`);
            clearTimeout(killswitchTimeoutId);
            return res.json(JSON.parse(result));
        }else{
            redisConnection.emit(`get-recipe:${messageId}`, {
                requestId: messageId,
                recipeId: recipeId
            });   
        }
    });
});

//get info for all recipes
router.get("/", (req, res) => {

    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`recipes-got:${messageId}`, (recipes, channel) => {
        let idString = 'recipe-list';
        let recipesString = JSON.stringify(recipes);
        cache.set(idString, recipesString, {expire: 60*60}, ()=>{});

        res.json(recipes);

        redisConnection.off(`recipes-got:${messageId}`);
        redisConnection.off(`recipes-got-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`recipes-got-failed:${messageId}`, (error, channel) => {
        res.status(500).json(error);

        redisConnection.off(`recipes-got:${messageId}`);
        redisConnection.off(`recipes-got-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`recipes-got:${messageId}`);
        redisConnection.off(`recipes-got-failed:${messageId}`);

        res.status(500).json({error: "Timeout error"})
    }, 5000);

    //check cache
    cache.get('recipe-list', (err, result) => {
        if((!err && result) && CHECK_CACHE){
            redisConnection.off(`recipes-got:${messageId}`);
            redisConnection.off(`recipes-got-failed:${messageId}`);
            clearTimeout(killswitchTimeoutId);
            return res.json(JSON.parse(result));
        }else{
            redisConnection.emit(`get-recipes:${messageId}`, {
                requestId: messageId
            });
        }
    });
});

//update a recipe
router.put("/:id", (req, res) => {
    let newRecipe = req.body.recipe;
    //check auth
    let isAuthorized = res.get('isAuthorized');
    if(isAuthorized === 'false'){
        res.sendStatus(401);
    }

    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`recipe-updated:${messageId}`, (recipe, channel) => {
        let idString = recipe._id.toString();
        let recipeString = JSON.stringify(recipe);
        cache.set(idString, recipeString, {expire: 60*60}, ()=>{});

        res.json(recipe);

        redisConnection.off(`recipe-updated:${messageId}`);
        redisConnection.off(`recipe-updated-failed:${messageId}`);
        redisConnection.off(`recipe-auth-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`recipe-updated-failed:${messageId}`, (error, channel) => {
        res.status(500).json(error);

        redisConnection.off(`recipe-updated:${messageId}`);
        redisConnection.off(`recipe-updated-failed:${messageId}`);
        redisConnection.off(`recipe-auth-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    redisConnect.on(`recipe-auth-failed:${messageId}`, (error, channel) => {
        res.sendStatus(401);

        redisConnection.off(`recipe-deleted:${messageId}`);
        redisConnection.off(`recipe-deleted-failed:${messageId}`);
        redisConnection.off(`recipe-auth-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    })

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`recipe-updated:${messageId}`);
        redisConnection.off(`recipe-updated-failed:${messageId}`);
        redisConnection.off(`recipe-auth-failed:${messageId}`);

        res.status(500).json({error: "Timeout error"})
    }, 5000);

    let authToken = req.get('Auth-Token');
    let authTokenString = authToken.toString();
    cache.get(authTokenString, (err, result) => {
        if(err || !result){
            res.status(500).send("Error getting cached recipe ID");

            redisConnection.off(`recipe-updated:${messageId}`);
            redisConnection.off(`recipe-updated-failed:${messageId}`);
            redisConnection.off(`recipe-auth-failed:${messageId}`);
            clearTimeout(killswitchTimeoutId);
        }else{
            redisConnection.emit(`update-recipe:${messageId}`, {
                requestId: messageId,
                recipe: newRecipe,
                userId: result
            });    
        }
    });
});

//delete a recipe
router.delete("/:id", (req, res) => {
    //check auth
    let isAuthorized = res.get('isAuthorized');
    if(isAuthorized === 'false'){
        res.sendStatus(401);
    }

    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`recipe-deleted:${messageId}`, (recipeId, channel) => {
        let recipeIdString = recipeId.toString();
        cache.del(recipeIdString);

        res.json(recipeId);

        redisConnection.off(`recipe-deleted:${messageId}`);
        redisConnection.off(`recipe-deleted-failed:${messageId}`);
        redisConnection.off(`recipe-auth-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`recipe-deleted-failed:${messageId}`, (error, channel) => {
        res.status(500).json(error);

        redisConnection.off(`recipe-deleted:${messageId}`);
        redisConnection.off(`recipe-deleted-failed:${messageId}`);
        redisConnection.off(`recipe-auth-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    redisConnect.on(`recipe-auth-failed:${messageId}`, (error, channel) => {
        res.sendStatus(401);

        redisConnection.off(`recipe-deleted:${messageId}`);
        redisConnection.off(`recipe-deleted-failed:${messageId}`);
        redisConnection.off(`recipe-auth-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    })

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`recipe-deleted:${messageId}`);
        redisConnection.off(`recipe-deleted-failed:${messageId}`);
        redisConnection.off(`recipe-auth-failed:${messageId}`);

        res.status(500).json({error: "Timeout error"})
    }, 5000);

    let authToken = req.get('Auth-Token');
    let authTokenString = authToken.toString();
    cache.get(authTokenString, (err, result) => {
        if(err || !result){
            res.status(500).send("Error getting cached recipe ID");
            redisConnection.off(`recipe-deleted:${messageId}`);
            redisConnection.off(`recipe-deleted-failed:${messageId}`);
            redisConnection.off(`recipe-auth-failed:${messageId}`);
            clearTimeout(killswitchTimeoutId);
        }else{
            redisConnection.emit(`delete-recipe:${messageId}`, {
                requestId: messageId,
                recipeId: result,
                userId: result
            });
        }
    });
});


router.get("/old/", (req, res) => {
    recipeData
        .getAllRecipes()
        .then((recipeList) => {
            res.json(recipeList);
        })
        .catch(() => {
            // Something went wrong with the server!
            res.sendStatus(500);
        });
});

router.post("/old/", (req, res) => {
    let newRecipe = req.body.recipe;

    let redisConnection = req.app.get("redis");

    let messageId = uuid.v4();
    let killswitchTimeoutId = undefined;

    redisConnection.on(`recipe-created:${messageId}`, (insertedRecipe, channel) => {
        res.json(insertedRecipe);
        redisConnection.off(`recipe-created:${messageId}`);
        redisConnection.off(`recipe-created-failed:${messageId}`);

        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`recipe-created-failed:${messageId}`, (error, channel) => {
        res
            .status(500)
            .json(error);

        redisConnection.off(`recipe-created:${messageId}`);
        redisConnection.off(`recipe-created-failed:${messageId}`);

        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`recipe-created:${messageId}`);
        redisConnection.off(`recipe-creation-failed:${messageId}`);
        res
            .status(500)
            .json({error: "Timeout error"})
    }, 5000);

    redisConnection.emit(`create-recipe:${messageId}`, {
        requestId: messageId,
        recipe: newRecipe
    });

});

module.exports = router;