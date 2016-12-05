const bookRoutes = require("./books");
const path = require("path");

const constructorMethod = (app) => {
    app.use("/books", bookRoutes);

    app.use("*", (req, res) => {
        res.sendFile(path.resolve("server", "public", "html", "index.html"));
    });
};

module.exports = constructorMethod;