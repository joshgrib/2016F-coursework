const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const static = express.static(__dirname + '/public');

const configRoutes = require("./routes");

const exphbs = require('express-handlebars');

const Handlebars = require('handlebars');

let data = require('../recipe-data');

//var cache = require('express-redis-cache')({host: 'localhost', port: 6379});

var redis = require("redis");
var cache = redis.createClient(6379, 'localhost');

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === "number") 
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
            
            return new Handlebars.SafeString(JSON.stringify(obj));
        }
    },
    partialsDir: ['views/partials/']
});

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

let checkHeaders = (req, res, next) => {
    let authToken = req.get('Auth-Token');
    res.set('reqAuthToken', authToken);
    if(authToken == undefined){
        res.set('isAuthorized', false);
    }else{
        cache.get(authToken.toString(), (err, val) => {
            if(err || (val == undefined)){
                res.set('isAuthorized', false);
                res.set("tokenID", null);
            }else{
                console.log('val');
                console.log(val.toString());
                res.set('isAuthorized', true);
                res.set("tokenID", val.toString());
            }
        });
    }
    next();
};

app.set('redis', require("./redis-connection"));

app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);
app.use(checkHeaders);



app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});