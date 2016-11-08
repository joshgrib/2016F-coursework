const data = require("../recipe-data");
const fetch = require('node-fetch');

const NRP = require('node-redis-pubsub');
const config = {
    port: 6379, // Port of your locally running Redis server
    scope: 'assignment2' // Use a scope to prevent two NRPs from sharing messages
};

const redisConnection = new NRP(config); // This is the NRP client

// Note, this is really bad.
const pixabayApiKey = "3432196-710f5c9e1d0f75f6c0aa4a34a";
const basePixabayUrl = `https://pixabay.com/api/?key=${pixabayApiKey}&safesearch=true&q=`;

redisConnection.on('create-recipe:*', (inData, channel) => {
    let messageId = inData.requestId;

    let fullyComposeRecipe = data
        .addRecipe(inData.recipe)
        .then((newRecipe) => {
            return fetch(`${basePixabayUrl}${newRecipe.title}`).then((res) => {
                return res.json();
            }).then((response) => {
                return response
                    .hits
                    .map(x => x.previewURL)
                    .slice(0, 5);
            }).then((hits) => {
                return data
                    .addImagesToRecipe(newRecipe._id, hits)
                    .then((recipeWithUrls) => {
                        return data
                            .findRecipesWithIngredients(recipeWithUrls.ingredients.map(x => x.systemTitle))
                            .then(recipeList => {

                                let recipeListExceptCurrent = recipeList.filter(x => x._id !== newRecipe._id);

                                console.log(recipeListExceptCurrent);
                                // Perform logic here Go through entire recipe list Calculate the percentage
                                // matched for each. Compose an array of data calls to setup the percentage
                                // matched Add all, then resolve to recipeWithUrls
                                return recipeWithUrls;
                            });
                    })
            }).then((recipeWithUrls) => {
                redisConnection.emit(`recipe-created:${messageId}`, recipeWithUrls);
            }).catch(error => {
                console.log(error);
                // we will submit errors back to the frontend
            });
        });
});

redisConnection.on('add-user:*', (inData, channel) => {
    let messageId = inData.requestId;
    let addUser = data
        .addUser(inData.user)
        .then((newUser) => {
            redisConnection.emit(`user-added:${messageId}`, newUser);
        }).catch( (err) => {
            console.log(err);
            redisConnection.emit(`user-added-failed:${messageId}`, err);
        })
});

redisConnection.on('get-user:*', (inData, channel) => {
    let messageId = inData.requestId;
    let getUser = data
        .getUser(inData.userId)
        .then((user) => {
            redisConnection.emit(`user-got:${messageId}`, user);
        }).catch((err) => {
            console.log(err);
            redisConnection.emit(`user-got-failed:${messageId}`, err);
        })
});

redisConnection.on('get-users:*', (inData, channel) => {
    let messageId = inData.requestId;
    let getUsers = data
        .getAllUsers()
        .then((users) => {
            redisConnection.emit(`users-got:${messageId}`, users);
        }).catch((err) => {
            console.log(err);
            redisConnection.emit(`users-got-failed:${messageId}`, err);
        })
});

redisConnection.on('update-user:*', (inData, channel) => {
    let messageId = inData.requestId;
    let id = inData.userId;
    let user = inData.user;
    let updateUser = data
        .updateUser(id, user)
        .then((updatedUser) => {
            redisConnection.emit(`user-updated:${messageId}`, updatedUser);
        }).catch((err) => {
            console.log(err);
            redisConnection.emit(`user-updated-failed:${messageId}`, err);
        })
});

redisConnection.on('delete-user:*', (inData, channel) => {
    let messageId = inData.requestId;
    let deleteUser = data
        .removeUser(inData.userId)
        .then(() => {
            redisConnection.emit(`user-deleted:${messageId}`, inData.userId);
        }).catch((err) => {
            console.log(err);
            redisConnection.emit(`user-deleted-failed:${messageId}`, err);
        })
});

redisConnection.on('add-recipe:*', (inData, channel) => {
    let messageId = inData.requestId;
    let addRecipe = data
        .addRecipe(inData.recipe)
        .then((newRecipe) => {
            redisConnection.emit(`recipe-added:${messageId}`, newRecipe);
        }).catch( (err) => {
            console.log(err);
            redisConnection.emit(`recipe-added-failed:${messageId}`, err);
        })
});

redisConnection.on('get-recipe:*', (inData, channel) => {
    let messageId = inData.requestId;
    let getRecipe = data
        .getRecipe(inData.recipeId)
        .then((recipe) => {
            redisConnection.emit(`recipe-got:${messageId}`, recipe);
        }).catch((err) => {
            console.log(err);
            redisConnection.emit(`recipe-got-failed:${messageId}`, err);
        })
});

redisConnection.on('get-recipes:*', (inData, channel) => {
    let messageId = inData.requestId;
    let getRecipes = data
        .getAllRecipes()
        .then((recipes) => {
            redisConnection.emit(`recipes-got:${messageId}`, recipes);
        }).catch((err) => {
            console.log(err);
            redisConnection.emit(`recipes-got-failed:${messageId}`, err);
        })
});

redisConnection.on('update-recipe:*', (inData, channel) => {
    let messageId = inData.requestId;
    let id = inData.recipeId;
    let recipe = inData.recipe;
    let updateRecipe = data
        .checkRecipeOwner(recipeId, userId)
        .then((isOwner) => {
            if(isOwner){
                return data.updateRecipe(id, recipe)
                    .then((updatedRecipe) => {
                        redisConnection.emit(`recipe-updated:${messageId}`, updatedRecipe);
                    }).catch((err) => {
                        console.log(err);
                        redisConnection.emit(`recipe-updated-failed:${messageId}`, err);
                    })
            }else{
                redisConnection.emit(`recipe-auth-failed:${messageId}`, 'Not Authorized');
            }
        })
});

redisConnection.on('delete-recipe:*', (inData, channel) => {
    let messageId = inData.requestId;
    let recipeId = inData.recipeId;
    let userId = inData.userId;
    let deleteRecipe = data
        .checkRecipeOwner(recipeId, userId)
        .then((isOwner) => {
            if(isOwner){
                return data.removeRecipe(inData.recipeId)
                    .then(() => {
                        redisConnection.emit(`recipe-deleted:${messageId}`, inData.recipeId);
                    }).catch((err) => {
                        console.log(err);
                        redisConnection.emit(`recipe-deleted-failed:${messageId}`, err);
                    })
            }else{
                redisConnection.emit(`recipe-auth-failed:${messageId}`, 'Not Authorized');
            }
        })
        
});
