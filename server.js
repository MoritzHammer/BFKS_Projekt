const express = require("express");
const app = express();
const https = require('https');
const cors = require('cors')


const port = 3000;
app.use(cors());

app.get("/request", (req, res) => {

    var resultset = "";
    // result = await fetch("https://api.pons.com/v1/dictionaries?l=deen&q=Hallo")
    https.get({
        hostname: "api.pons.com",
        port: 443,
        path: "/v1/dictionary?l=deen&q=Hallo",
        headers: {
            "x-secret": "44a56a7bfbed28e96c5d6467a08057951705c120acc74934ae1d0a6f0f677fa1",
            "Access-Control-Allow-Origin": "*"
        },
        method: "GET"
    }, (resp) => {
        resp.on("data", (test) => {
            resultset = JSON.parse(test);
            res.send(resultset);
        });
    });
})

app.listen(port, () => {
    console.log("server started");
})
