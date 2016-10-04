const calendarRoutes = require("./calendar");

const constructorMethod = (app) => {
    app.use("/calendar", calendarRoutes);
    app.get("/", (req, res) => {
        res.render("layouts/month", {pageTitle: "Calendar"});
    });
    
    app.use("*", (req, res) => {
        res.redirect("/");
    })
};

module.exports = constructorMethod;