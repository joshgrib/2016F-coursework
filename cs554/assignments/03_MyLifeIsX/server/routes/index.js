const postRoutes = require("./posts");
const path = require("path");

const constructorMethod = (app) => {
    app.use('/p', postRoutes);

    app.use("*", (req, res) => {
        res.sendFile(path.resolve("server", "public", "html", "index.html"));
    });
};

module.exports = constructorMethod;