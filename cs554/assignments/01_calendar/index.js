const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const static = express.static(__dirname + '/public');

const configRoutes = require("./routes");
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');

Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    
});

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === "number") 
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
            
            return new Handlebars.SafeString(JSON.stringify(obj));
        },
        times: (n, block) => {
            var accum = '';
            for(var i = 0; i < n; ++i)
                accum += block.fn(i);
            return accum;
        },
        for: (from, to, incr, block) => {
            var accum = '';
            for(var i = from; i < to; i += incr)
                accum += block.fn(i);
            return accum;
        },
        addOne: (obj) => {
            return obj+1;
        },
        nextMonthMonth: (monthNum) => {
            if(monthNum == 12){
                return 1
            }
            return monthNum + 1
        },
        nextMonthYear: (yearNum, monthNum) => {
            if(monthNum == 12){
                return yearNum + 1
            }
            return yearNum
        },
        prevMonthMonth: (monthNum) => {
            if(monthNum == 1){
                return 12
            }
            return monthNum - 1
        },
        prevMonthYear: (yearNum, monthNum) => {
            if(monthNum == 1){
                return yearNum - 1
            }
            return yearNum
        },
        math: (lvalue, operator, rvalue, options) => {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);
            return {
                "+": lvalue + rvalue,
                "-": lvalue - rvalue,
                "*": lvalue * rvalue,
                "/": lvalue / rvalue,
                "%": lvalue % rvalue
            }[operator];
        },
        indexOf: (obj,i) => {
            return obj[i];
        },
        hasContent: (obj) => {
            let contentSize = Object.keys(obj).length;
            return contentSize > 0;
        },
        childCount: (obj) => {
            let count = 0;
            for(let i in obj){
                count++;
            }
            return count;
        },
        formDayControl: (dayValue, dayIndex) => {
            if(dayValue == dayIndex){
                return 'selected'
            }
            return ''
        }
    },
    partialsDir: ['views/partials/']
});

const electronApp = require('./electron-app');

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the
    // request's method To be that method; so if they post _method=PUT you can now
    // allow browsers to POST to a route that gets rewritten in this middleware to a
    // PUT route
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    // let the next middleware run:
    next();
};

app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
    console.log("Now we'll start the electron app");
    electronApp();
});
