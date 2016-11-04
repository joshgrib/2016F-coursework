const collections = require('./config/mongoCollections');
const recipeCollection = collections.recipes;//require("./recipeCollection");
const userCollection = collections.users;

let exportedMethods = {
    getAllRecipes() {
        return recipeCollection().then((recipes) => {
            return recipes
                .find()
                .toArray();
        });
    },
    getAllUsers() {
        return userCollection().then((users) => {
            return users
                .find()
                .toArray();
        });
    },
    getRecipe(id) {
        return recipeCollection().then((recipes) => {
            return recipes.findOne({_id: id})
        })
    },
    getUser(id) {
        return userCollection().then((users) => {
            return users.findOne({_id: id});
        });
    },
    addRecipe(recipe) {
        return recipeCollection().then((recipes) => {
            let newRecipe = JSON.parse(JSON.stringify(recipe));

            newRecipe.ingredients.forEach(ingredient => {
                ingredient.systemTitle = ingredient.displayTitle.toString();
            });

            newRecipe.relatedIngredients = [];
            newRecipe.imageUrls = [];            

            return recipes.insertOne(recipe)
        }).then((recipe) => {
            return this.getRecipe(recipe.insertedId);
        });
    },
    addUser(user) {
        return userCollection().then((users) => {
            return users.insertOne(user);
        }).then((user) => {
            return this.getUser(user.insertedId);
        });
    },
    removeRecipe(id) {
        return recipeCollection().then((recipes) => {
            return recipes.removeOne({ _id: id }).then((deletionInfo) => {
                if(deletionInfo.deletedCount === 0){
                    throw (`Could not delete recipe with id of ${id}`)
                }
            })
        });
    },
    removeUser(id) {
        return userCollection().then((users) => {
            return users.removeOne({ _id: id }).then((deletionInfo) => {
                if(deletionInfo.deletedCount === 0){
                    throw (`Could not delete user with id of ${id}`)
                }
            })
        });
    },
    updateRecipe(id, updatedRecipe){
        return recipeCollection().then((recipes) => {
            let updateCommand = {
                $set: updatedRecipe
            };
            return recipes.updateOne({ _id: id}, updateCommand).then((result) => {
                return this.getRecipe(id);
            })
        });
    },
    updateUser(id, updatedUser){
        return userCollection().then((users) => {
            let updateCommand = {
                $set: updatedUser
            };
            return users.updateOne({ _id: id}, updateCommand).then((result) => {
                return this.getUser(id);
            })
        });
    },
    createRecipeRelationship(firstRecipe, firstMatchAmount, secondRecipe, secondMatchAmount) {
        return recipeCollection().then((recipes) => {
            return recipes.updateOne({
                _id: firstRecipe
            }, {
                $addToSet: {
                    relatedRecipes: {
                        _id: secondRecipe,
                        amount: firstMatchAmount
                    }
                }
            }).then(() => {
                recipes.updateOne({
                    _id: secondRecipe
                }, {
                    $addToSet: {
                        relatedRecipes: {
                            _id: firstRecipe,
                            amount: secondMatchAmount
                        }
                    }
                })
            }).then(() => {
                return recipes.find({
                    _id: [firstRecipe, secondRecipe]
                })
            });
        });
    },
    findRecipesWithIngredient(systemTitle) {
        return recipeCollection().then((recipes) => {
            return recipes
                .find({"ingredients.systemTitle": systemTitle})
                .toArray()
        });
    },
    findRecipesWithIngredients(systemTitles) {
        return recipeCollection().then((recipes) => {
            return recipes
                .find({
                "ingredients.systemTitle": {
                    $in: systemTitles
                }
            })
                .toArray()
        });
    },
    addImagesToRecipe(recipeId, imageUrlArray) {
        return recipeCollection().then((recipes) => {
            return recipes.updateOne({
                _id: recipeId
            }, {
                $addToSet: {
                    imageUrls: {
                        $each: imageUrlArray
                    }
                }
            }).then(() => {
                return this.getRecipe(recipeId);
            });
        });
    }
}

module.exports = exportedMethods;

/*
let allRecipes = exportedMethods.getAllRecipes();
let allUsers = exportedMethods.getAllUsers();

allRecipes.then((recipes) => {
    console.log(recipes);
}).then( () => {
    console.log("##############");
    console.log("#    Done    #");
    console.log("##############");
});

allUsers.then((users) => {
    console.log(`All users: ${JSON.stringify(users, null, 2)}`);
    return users[0]
}).then((user) => {
    return exportedMethods.getUser(user._id);
}).then((user) => {
    console.log(`Got first user: ${JSON.stringify(user, null, 2)}`);
    newUser = {
        username: 'josh',
        password: 'pass',
        firstname: 'Josh',
        lastname: 'Gribbon'
    }
    return exportedMethods.addUser(newUser);
}).then((addedUser) => {
    console.log(`Added user: ${JSON.stringify(addedUser, null, 2)}`);
    return exportedMethods.updateUser(addedUser._id, {username: 'not_josh'});
}).then((updatedUser) => {
    console.log(`Updated user: ${JSON.stringify(updatedUser, null, 2)}`);
    return exportedMethods.removeUser(updatedUser._id);
}).then((stuff) => {
    console.log(`Deleted stuff: ${stuff}`);
    return exportedMethods.getAllUsers();
}).then((users) => {
    console.log(`All users: ${JSON.stringify(users, null, 2)}`);
})
*/


/*
TEST:
-getUser(id)
-addUser(user)
removeRecipe(id)
-removeUser(id)
updateRecipe(id, updateRecipe)
-updateUser(id, updatedUser)
*/