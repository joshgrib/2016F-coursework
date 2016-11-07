const express = require('express');
const router = express.Router();
const data = require("../../recipe-data");
const uuid = require("node-uuid");

//add a recipe
router.post("/", (req, res) => {
    let newrecipe = req.body.recipe;
    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`recipe-added:${messageId}`, (recipeAdded, channel) => {
        res.json(recipeAdded);
        redisConnection.off(`recipe-added:${messageId}`);
        redisConnection.off(`recipe-added-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`recipe-added-failed:${messageId}`, (error, channel) => {
        res.status(500).json(error);
        redisConnection.off(`recipe-added:${messageId}`);
        redisConnection.off(`recipe-added-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`recipe-added:${messageId}`);
        redisConnection.off(`recipe-added-failed:${messageId}`);
        res.status(500).json({error: "Timeout error"})
    }, 5000);

    redisConnection.emit(`add-recipe:${messageId}`, {
        requestId: messageId,
        recipe: newrecipe
    });
});

router.post("/session", (req, res) => {
    res.status(200).send("Post a recipename and password to get an auth token");
});

//get recipe info
router.get("/:id", (req, res) => {
    let recipeId = req.params.id;
    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`recipe-got:${messageId}`, (recipe, channel) => {
        res.json(recipe);
        redisConnection.off(`recipe-got:${messageId}`);
        redisConnection.off(`recipe-got-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`recipe-got-failed:${messageId}`, (error, channel) => {
        res.status(500).json(error);
        redisConnection.off(`recipe-got:${messageId}`);
        redisConnection.off(`recipe-got-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`recipe-got:${messageId}`);
        redisConnection.off(`recipe-got-failed:${messageId}`);
        res.status(500).json({error: "Timeout error"})
    }, 5000);

    redisConnection.emit(`get-recipe:${messageId}`, {
        requestId: messageId,
        recipeId: recipeId
    });
});

//get info for all recipes
router.get("/", (req, res) => {
    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`recipes-got:${messageId}`, (recipes, channel) => {
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

    redisConnection.emit(`get-recipes:${messageId}`, {
        requestId: messageId
    });
});

//update a recipe
router.put("/", (req, res) => {
    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`update-recipe:${messageId}`, (recipes, channel) => {
        res.json(recipes);
        redisConnection.off(`recipe-updated:${messageId}`);
        redisConnection.off(`recipe-updated-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`recipe-updated-failed:${messageId}`, (error, channel) => {
        res.status(500).json(error);
        redisConnection.off(`recipe-updated:${messageId}`);
        redisConnection.off(`recipe-updated-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`recipe-updated:${messageId}`);
        redisConnection.off(`recipe-updated-failed:${messageId}`);
        res.status(500).json({error: "Timeout error"})
    }, 5000);

    redisConnection.emit(`update-recipe:${messageId}`, {
        requestId: messageId
    });
});

//delete a recipe
router.delete("/", (req, res) => {
    let redisConnection = req.app.get("redis");
    let messageId = uuid.v4();

    redisConnection.on(`delete-recipe:${messageId}`, (recipes, channel) => {
        res.json(recipes);
        redisConnection.off(`recipe-deleted:${messageId}`);
        redisConnection.off(`recipe-deleted-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    redisConnection.on(`recipe-deleted-failed:${messageId}`, (error, channel) => {
        res.status(500).json(error);
        redisConnection.off(`recipe-deleted:${messageId}`);
        redisConnection.off(`recipe-deleted-failed:${messageId}`);
        clearTimeout(killswitchTimeoutId);
    });

    killswitchTimeoutId = setTimeout(() => {
        redisConnection.off(`recipe-deleted:${messageId}`);
        redisConnection.off(`recipe-deleted-failed:${messageId}`);
        res.status(500).json({error: "Timeout error"})
    }, 5000);

    redisConnection.emit(`delete-recipe:${messageId}`, {
        requestId: messageId
    });
});

module.exports = router;

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