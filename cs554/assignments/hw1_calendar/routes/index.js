const constructorMethod = (app) => {
    app.get("/", (req, res) => {
        res.render("home", {});
    });
    
    app.use("*", (req, res) => {
        res.render("layouts/404");
    })
};

module.exports = constructorMethod;