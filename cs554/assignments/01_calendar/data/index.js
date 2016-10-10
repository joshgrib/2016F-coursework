let calData = {
    2016: {
        10: {
            8: {
                0:{
                    'title':'Hanging with Amber',
                    'desc':'Amber coming to the apartment to do homework'
                },
                1:{
                    'title':'Watch a movie',
                    'desc':'After homework, watch a movie or something'
                }
            },
            10: {
                0:{
                    'title':'Birthday',
                    'desc':'Turn 21 and party'
                }
            }
        }
    }
}

module.exports = {
    getYear: (year) => {
        let routeData = undefined;
        try{
            routeData = calData[year];
        }catch (e) {
            routeData = {};
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
        return routeData;
    },
    getDay: (year, month, day) => {
        let routeData = undefined;
        try{
            routeData = calData[year][month][day];
        }catch (e) {
            routeData = {};
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
        return routeData;
    }
};