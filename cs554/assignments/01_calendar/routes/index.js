const calendarRoutes = require("./calendar");

const constructorMethod = (app) => {
    app.use("/calendar", calendarRoutes);
    app.get("/", (req, res) => {
        let month = "October";
        //maybe get days of the month and everything here then deliver it
        //splt up routes to use /month/<number> /year/month/day/<number> etc
        //and only get data in that scope
        res.render("layouts/month", {pageTitle: "Calendar", month: month});
    });
    
    app.use("*", (req, res) => {
        res.redirect("/");
    })
};

module.exports = constructorMethod;