const apiRoutes = require("./api");

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
let weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

let data = require('../data');

const constructorMethod = (app) => {
    app.use("/api", apiRoutes);

    app.get("/:year/:month", (req, res) => {
        let year = req.params.year;
        let month = req.params.month - 1;
        let monthName = monthNames[month];

        let dayCount = new Date(year, month+1, 0).getDate();
        let weekDayNum = new Date(year, month, 1).getDay();

        let monthData = data.getMonth(req.params.year, req.params.month);
        for(let i=1; i<=dayCount; i++){
            //populate blank days
            let thisData = monthData[i];
            if(thisData === undefined){
                monthData[i] = {};
            }
        }
        console.log(monthData);

        res.render("layouts/month", {
            yearNum: year,
            monthNum: month,
            month: monthName,
            weekDays: weekDays,
            dayCount: dayCount,
            weekStartIndentSize: weekDayNum,
            monthData: monthData
        });
    });

    app.get("/:year/:month/:day", (req, res) =>{
        let year = req.params.year;
        let month = req.params.month - 1;
        let day = req.params.day - 1;

        let monthName = monthNames[month];
        let jsDate = new Date(year, month, day);
        let weekDayNum = jsDate.getDay() + 1;
        let monthDayNum = jsDate.getDate() + 1;
        let dayName = weekDays[weekDayNum];

        let yearStart = new Date(jsDate.getFullYear(), 0, 0);
        let yearEnd = new Date(jsDate.getFullYear(), 11, 31);
        let yearStartDiff = jsDate - yearStart;
        let yearEndDiff = yearEnd - jsDate;
        let dayLength = 1000 * 60 * 60 * 24;
        let yearStartDiffCount = Math.floor( yearStartDiff / dayLength);
        let yearEndDiffCount = Math.floor( yearEndDiff / dayLength);

        let dayData = data.getDay(req.params.year, req.params.month, req.params.day);

        res.render("layouts/day", {
            month: monthName,
            weekDayNum: weekDayNum,
            monthDayNum: monthDayNum,
            dayName: dayName,
            startDiff: yearStartDiffCount,
            endDiff: yearEndDiffCount
        })
    });

    app.get("/:year/:month/:day/:eventID", (req, res) => {
        let year = req.params.year;
        let month = req.params.month - 1;
        let day = req.params.day - 1;
        let eventID = req.params.eventID;

        let eventData = data.getEvent(req.params.year, req.params.month, req.params.day, req.params.eventID);
        res.json(eventData);
    });
    
    app.use("*", (req, res) => {
        res.sendStatus(404);
    })
};

module.exports = constructorMethod;