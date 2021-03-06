let calData = require('../calendar.json');
let fs = require('fs');

let saveObjToFile = (obj) => {
    fs.writeFile("./calendar.json", JSON.stringify(obj), function(err) {
        if(err) {
            console.error(err);
        }
    }); 
}

module.exports = {
    getYear: (year) => {
        let routeData = undefined;
        try{
            routeData = calData[year];
        }catch (e) {
            routeData = {};
        }
        if(routeData === undefined){
            return {}
        }
        return routeData;
    },
    getMonth: (year, month) => {
        let routeData = undefined;
        try{
            routeData = calData[year][month];
        }catch (e) {
            routeData = {};
        }
        if(routeData === undefined){
            return {}
        }
        return routeData;
    },
    getDay: (year, month, day) => {
        let routeData = undefined;
        try{
            routeData = calData[year][month][day];
        }catch (e) {
            routeData = {};
        }
        if(routeData === undefined){
            return {}
        }
        return routeData;
    },
    getEvent: (year, month, day, eventID) => {
        let routeData = undefined;
        try{
            routeData = calData[year][month][day][eventID];
        }catch (e) {
            routeData = {};
        }
        if(routeData === undefined){
            return {}
        }
        return routeData;
    },
    addEvent: (year, month, day, title, location, description) => {
        let eventObj = {
            'title': title,
            'location': location,
            'description':description
        }
        if(calData[year] === undefined){
            calData[year] = {};
        }
        if(calData[year][month] === undefined){
            calData[year][month] = {};
        }
        if(calData[year][month][day] === undefined){
            calData[year][month][day] = {};
        }
        let currentIDs = Object.keys(calData[year][month][day]);
        let intIDs = currentIDs.map(Number);
        let idMax = Math.max.apply(null, currentIDs);
        let newID = idMax + 1;
        if (newID < 0 ){ newID = 0 };
        calData[year][month][day][newID] = eventObj;
        //save caldata file
        saveObjToFile(calData);
    },
    loadNewCalendar: (calObj) => {
        //take the object passed in and save it as the calendar data
        //this can probably just be saved as a file in the repo and
        //accessed like that because its meant to be a desktop app
    },
    saveCalToFile: () => {
        console.log("Saving the calendar");
        //console.log(calData);
        saveObjToFile(calData);
    }
}