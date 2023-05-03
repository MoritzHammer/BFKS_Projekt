const express = require("express");
const app = express();
const https = require('https');
const cors = require('cors');
const mysql = require('mysql2');

// Create the connection pool. The pool-specific settings are the defaults
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'ponsdb'
});


const port = 3000;
app.use(cors());

app.get("/autocomplete", (req, res) => {

    connection.execute('Select distinct word from request', function (err, rows, fields) {
        if (err == undefined) {
            res.send(rows);
        } else {
            res.status(500).send('Internal Server Error');
        }
    })
})


app.get("/lernfeld", (req, res) => {

    connection.execute('Select word from request where ', function (err, rows, fields) {
        if (err == undefined) {
            res.send(rows);
        } else {
            res.status(500).send('Internal Server Error');
        }
    })



})


app.get("/request", (req, res) => {
    var resultset = "";
    var erg = [];

    connection.execute(
        'SELECT word, transdir, target, language FROM REQUEST, HIT, ROM, ARAB, TRANSLATION WHERE REQUEST.Req_Id = HIT.Hit_Req_Id AND HIT.Hit_Id = ROM.Rom_Hit_id AND ROM.Rom_Id = ARAB.Arab_Rom_Id AND ARAB.Arab_Id = TRANSLATION.Translation_Arab_Id AND word like ? AND transdir like ?',
        [req.query.q, req.query.l],
        function (err, results, fields) {
            erg = results;
            if (err != undefined) {
                console.log(err);
                res.status(500).send('Internal Server Error')
            } else {

                var resobject = {}
                if (erg.length == 0) {
                    https.get({
                        hostname: "api.pons.com",
                        port: 443,
                        path: "/v1/dictionary?l=" + req.query.l + "&q=" + req.query.q,
                        headers: {
                            "x-secret": "44a56a7bfbed28e96c5d6467a08057951705c120acc74934ae1d0a6f0f677fa1",
                            "Access-Control-Allow-Origin": "*"
                        },
                        method: "GET"
                    }, (resp) => {
                        resp.on("data", (test) => {
                            resobject.origin = "pons";
                            if (!test.includes("!DOCTYPE html")) {
                                resultset = JSON.parse(test);
                                resobject.value = resultset;
                                try {
                                    saveinDB(resultset, req.query.q, req.query.l);
                                    res.send(resobject);
                                } catch (error) {
                                    console.log("Fehler beim speichern");
                                }
                            } else {
                                console.log();
                            }



                        });
                    });
                } else {



                    resobject.origin = "db";
                    resobject.value = erg;
                    res.send(resobject);
                    console.log("bereits vorhanden");
                }
            }





        }
    );






})

async function saveinDB(json, suchbegriff, suchrichtung) {


    var lastId = 0;
    await connection.execute(
        'Insert into `request` (`word`, `transdir`) values (?, ?)',
        [suchbegriff, suchrichtung],
        function (err, results, fields) {
            console.log(err);
            lastId = results.insertId;

            json[0].hits.forEach(hit => {
                //Sprache 1
                insertHit(hit, lastId, json[0].lang);
            });

            if (json[1] != undefined) {
                json[1].hits.forEach(hit => {
                    //Sprache 2
                    insertHit(hit, lastId, json[1].lang);
                });
            }




        }
    );



}

function insertHit(hit, parentId, lang) {
    var lastId = 0;
    connection.execute(
        'Insert into `hit` (`language`, `type`, `opendict`, `Hit_Req_Id`) values (?,?,?,?)',
        [lang, hit.type, hit.opendict, parentId],
        function (err, results, fields) {
            console.log(err);
            lastId = results.insertId;
            hit.roms.forEach(rom => {
                insertRom(rom, lastId)
            });
        }
    );



}

function insertRom(rom, parentId) {
    var lastId = 0;
    connection.execute(
        'Insert into `rom` (`headword`, `wordclass`, `Rom_Hit_Id`) values (?,?,?)',
        [rom.headword, rom.wordclass, parentId],
        function (err, results, fields) {
            console.log(err);
            lastId = results.insertId;
            rom.arabs.forEach(arab => {
                insertArab(arab, lastId)
            });
        }
    );



}


function insertArab(arab, parentId) {
    var lastId = 0;
    connection.execute(
        'Insert into `arab` (`header`, `Arab_Rom_Id`) values (?,?)',
        [arab.header, parentId],
        function (err, results, fields) {
            console.log(err);
            lastId = results.insertId;
            arab.translations.forEach(translation => {
                insertTranslation(translation, lastId);
            });
        }
    );


}

function insertTranslation(translation, parentId) {
    connection.execute(
        'Insert into `translation` (`source`, `target`, `Translation_Arab_Id`) values (?,?,?)',
        [translation.source, translation.target, parentId],
        function (err, results, fields) {
            console.log(err);
        }
    );
}

function checkDB(suchbegriff, suchrichtung) {


    console.log("checkDB End");

    return erg;

}



app.listen(port, () => {
    console.log("server started");
})
