const calendarRoutes = require("./calendar");

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
let weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const constructorMethod = (app) => {
    app.use("/calendar", calendarRoutes);
    app.get("/", (req, res) => {
        let month = "October";
        //maybe get days of the month and everything here then deliver it
        //splt up routes to use /month/<number> /year/month/day/<number> etc
        //and only get data in that scope
        res.render("layouts/month", {
            pageTitle: "Month View", 
            month: month, 
            weekDays:weekDays
        });
    });
    app.get("/day", (req, res) => {
        let month = "October";
        res.render("layouts/day", {
            pageTitle: "Day View", 
            month: month
        });
    });
    app.get("/event", (req, res) => {
        let month = "October";
        res.render("layouts/event", {
            pageTitle: "Event View", 
            month: month
        });
    });
    app.get("/form", (req, res) => {
        let month = "October";
        res.render("layouts/form", {
            pageTitle: "Form View", 
            month: month
        });
    });

    app.get("/:year/:month", (req, res) => {
        let year = req.params.year;
        let month = req.params.month;
        let monthName = monthNames[month-1];
        let dayCount = new Date(year, month, 0).getDate();
        res.render("layouts/month", {
            month: monthName,
            weekDays: weekDays,
            dayCount: dayCount
        });
    });

    app.get("/:year/:month/:day", (req, res) =>{
        let day = req.params.day;
        let month = req.params.month;
        let year = req.params.year;
        res.send(req.params);
    })
    
    app.use("*", (req, res) => {
        res.redirect("/");
    })
};

module.exports = constructorMethod;