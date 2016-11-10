const collections = require('./config/mongoCollections');
const recipeCollection = collections.recipes;//require("./recipeCollection");
const userCollection = collections.users;

var ObjectId = require('mongodb').ObjectId;

var redis = require("redis");
var cache = redis.createClient(6379, 'localhost');

let addUserToRecipe = (recipe) => {
    let userId = recipe.createdBy;
    return exportedMethods.getUser(userId).then((user) => {
        recipe.createdBy = user;
        return recipe;
    })
}

let exportedMethods = {
    getAllRecipes() {
        return recipeCollection().then((recipes) => {
            return recipes
                .find()
                .toArray()
                .then((result) => {
                    cache.set('recipe-list', JSON.stringify(result));
                    console.log(result);
                    return Promise.all(Array.from(result, addUserToRecipe));
                }).then((res) => {
                    return res;
                })
                
        });
    },
    getAllUsers() {
        return userCollection().then((users) => {
            return users
                .find({}, {password:false, _id:false})
                .toArray().then((result) => {
                    cache.set('user-list', JSON.stringify(result));
                    return result;
                })
        });
    },
    getRecipe(id) {
        if(typeof id == 'string'){
            id = new ObjectId(id);
        }
        return recipeCollection().then((recipes) => {
            return recipes.findOne({_id: id}).then((recipe) => {
                if(!recipe){
                    throw "Recipe not found"
                }else{
                    return recipe
                }
            })
        })
    },
    getUser(id) {
        if(typeof id == 'string'){
            id = new ObjectId(id);
        }
        return userCollection().then((users) => {
            return users.findOne({_id: id}, {password:false}).then((user) => {
                if((user == null) || (user == undefined) || (user == {})){
                    throw "User not found";
                }else{
                    return user;
                }
            })
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
            return this.getUser(user.insertedId).then((dbUser) => {
                return dbUser;
            });
        });
    },
    removeRecipe(id) {
        if(typeof id == 'string'){
            id = new ObjectId(id);
        }
        return recipeCollection().then((recipes) => {
            return recipes.removeOne({ _id: id }).then((deletionInfo) => {
                if(deletionInfo.deletedCount === 0){
                    throw (`Could not delete recipe with id of ${id}`)
                }
            })
        });
    },
    removeUser(id) {
        if(typeof id == 'string'){
            id = new ObjectId(id);
        }
        return userCollection().then((users) => {
            return users.removeOne({ _id: id }).then((deletionInfo) => {
                if(deletionInfo.deletedCount === 0){
                    throw (`Could not delete user with id of ${id}`)
                }else{
                    return true;
                }
            })
        });
    },
    updateRecipe(id, updatedRecipe){
        if(typeof id == 'string'){
            id = new ObjectId(id);
        }
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
        if(typeof id == 'string'){
            id = new ObjectId(id);
        }
        return userCollection().then((users) => {
            let updateCommand = {
                $set: updatedUser
            };
            return users.updateOne({ _id: id}, updateCommand).then((result) => {
                return this.getUser(id).then((user) => {
                    return user
                });
            })
        });
    },
    loginUser(username, password, token){
        return userCollection().then((users) => {
            return users.findOne(
                {username:username, password:password}
            ).then((result) => {
                if(!result){
                    throw "No user found with those credentials"
                }else{
                    return this.getUser(result._id).then((dbUser) => {
                        let tokenString = token.toString();
                        let id = dbUser._id;
                        let idString = id.toString();
                        cache.set(tokenString, idString);
                        return dbUser;
                    })
                }
            })
        })
    },
    checkRecipeOwner(recipeId, userId){
        return this.getRecipe(recipeId).then((recipe) => {
            return recipe.createdBy == userId;
        })
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
/*


/*
TEST:
-getUser(id)
-addUser(user)
removeRecipe(id)
-removeUser(id)
updateRecipe(id, updateRecipe)
-updateUser(id, updatedUser)
*/