// controller/dashboard.js

var express = require('express');
var router = express.Router();

const {google} = require('googleapis');
const fs = require('fs');

var oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URIS
);

async function getToken() {
    return new Promise((resolve, reject) => {
      fs.readFile('./token.json', (err, data) => {
        if (err)
          res.status(400).send(err.message);
        tokens = JSON.parse(data);
        resolve(tokens);
      })
    })
}

async function getFiles() {
    const tokens = await getToken();
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({version: 'v3', oauth2Client});
    const result = await drive.files.list({auth: oauth2Client, q:"mimeType='application/vnd.google-apps.spreadsheet'"});
    return result.data.files;
  }
  
router.get('/dashboard', async function (req, res) {
    var files = await getFiles();
    var list = [];
    for (var i = 0; i < files.length; i++) {
      var obj = {
        id: files[i].id,
        title: files[i].name
      }
      list.push(obj);
    }
    res.render('gsheets.ejs', {list : list});
});

var GSheet = require('../services/gsheets');
var processData = require('../services/processData');

router.post('/api/gsheets', async function(req, res) {
    var tokens = await getToken();
    oauth2Client.setCredentials(tokens);
    var g = new GSheet(oauth2Client);
    var tabA = await g.read(req.body.list[0], "tabA");
    var tabB = await g.read(req.body.list[0], "tabB");
    var tabC = processData.Deduplicate(tabA, tabB);
    if (tabC == null)
      res.send("File doesn't respect template.");
    else {
      await g.clear(req.body.list[0], "tabC");
      await g.append(req.body.list[0], "tabC", tabC);
      res.status(200).send("Done");
    }
});

module.exports = router;