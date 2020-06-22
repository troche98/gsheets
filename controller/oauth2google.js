// controller/oauth2google.js

var express = require('express');
var router = express.Router();

const {google} = require('googleapis');
var fs = require('fs');

var oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URIS
);

const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'];

async function getAuthUrl() {
    const authUrl = await oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    return authUrl;
}

router.get('/api/google', async function(req, res) {
    const url = await getAuthUrl();
    res.redirect(url);
});

router.get('/oauth2callback', async function(req, res) {
  const {tokens} = await oauth2Client.getToken(req.query.code);
  fs.writeFile('./token.json', JSON.stringify(tokens), (err)=> {
    if (err)
      return [];
  });
  res.redirect('/dashboard');
});

module.exports = router;
  