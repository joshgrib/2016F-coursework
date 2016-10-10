const express = require('express');
const router = express.Router();

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
let weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

let data = require('../data');

router.get("/", (req, res) => {
    res.send("Heres the api");
});

router.get("/:year", (req, res) => {
    let year = req.params.year;
    let d = data.getYear(year);
    res.json(d);
})

router.get("/:year/:month", (req, res) => {
    let year = req.params.year;
    let month = req.params.month;
    let d = data.getMonth(year, month);
    res.json(d);
});

router.get("/:year/:month/:day", (req, res) =>{
    let year = req.params.year;
    let month = req.params.month;
    let day = req.params.day;
    let d = data.getDay(year, month, day);
    res.json(d);
});

router.get("/:year/:month/:day/:eventID", (req, res) => {
    let year = req.params.year;
    let month = req.params.month;
    let day = req.params.day;
    let eventID = req.params.eventID;
    let d = data.getEvent(year, month, day, eventID);
    res.json(d);
});

router.use("*", (req, res) => {
    res.sendStatus(404);
});

module.exports = router;
