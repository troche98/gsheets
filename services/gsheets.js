//services/GSheet.js
const {google} = require('googleapis');

class GSheet {
    constructor(oAuth2Client) {
        this.oAuth2Client = oAuth2Client;
    }
    
    read = async (spreadsheetId, range) => {
        const sheets = google.sheets({ version: 'v4', auth: this.oAuth2Client });
        return sheets.spreadsheets.values.get({
            auth: this.oAuth2Client,
            spreadsheetId: spreadsheetId,
            range: range
        })
          .then((doc) => { return doc.data.values;})
          .catch((err) => {console.log(err.message)})
    }

    append = async (spreadsheetId, range, values) => {
        const sheets = google.sheets({ version: 'v4', auth: this.oAuth2Client });
    
        return sheets.spreadsheets.values.append({
            auth: this.oAuth2Client,
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: 'USER_ENTERED',
            resource: { 
                range: range,
                values
            },
        });
    }

    clear = async (spreadsheetId, range) => {
        const sheets = google.sheets({ version: 'v4', auth: this.oAuth2Client });
    
        return sheets.spreadsheets.values.clear({
            auth: this.oAuth2Client,
            spreadsheetId: spreadsheetId,
            range: range,
        });
      }
}

module.exports = GSheet;