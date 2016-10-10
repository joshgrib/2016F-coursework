let calData = {
    2016: {
        10: {
            8: {
                0:{
                    'title':'Hanging with Amber',
                    'location':'My apartment',
                    'desc':'Amber coming to the apartment to do homework'
                },
                1:{
                    'title':'Watch a movie',
                    'location':'My apartment',
                    'desc':'After homework, watch a movie or something'
                },
                2:{
                    'title':'Watch debate',
                    'location':'My apartment',
                    'desc':'Trump VS Clinton round 2'
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
    }
};