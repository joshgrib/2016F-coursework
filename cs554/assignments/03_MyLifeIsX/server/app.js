const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

const appStatic = express.static(path.resolve("app"));
const generalStatic = express.static(path.resolve("server", "public"));
const nodeModuleStatic = express.static(path.resolve("node_modules"));

const configRoutes = require("./routes");

app.use("/public/js/node_modules", nodeModuleStatic);
app.use("/public", generalStatic);
app.use("/app", appStatic);

app.use(bodyParser.json());

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});