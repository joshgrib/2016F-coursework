const recipeRoutes = require("./recipes");
const userRoutes = require("./users");

const constructorMethod = (app) => {
    app.use("/recipes", recipeRoutes);
    app.use("/users", userRoutes);
    app.get("/", (req, res) => {
        res.render("home", {});
    });
    app.use("*", (req, res) => {
        res.sendStatus(404);
    })
};

module.exports = constructorMethod;

//https://devcenter.heroku.com/articles/asynchronous-web-worker-model-using-rabbitmq-in-node
//Check out this link - might be exactly what I'm doing