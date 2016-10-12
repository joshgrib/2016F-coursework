let calData = require('./data.json');

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
        let idMax = Math.max(currentIDs);
        let newID = idMax + 1;
        calData[year][month][day][newID] = eventObj;
        //save caldata file
        
    },
    loadNewCalendar: (calObj) => {
        //take the object passed in and save it as the calendar data
        //this can probably just be saved as a file in the repo and
        //accessed like that because its meant to be a desktop app
    },
    saveCalToFile: (filepath) => {
        console.log("Saving file to " + filepath);
    }
};