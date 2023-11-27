// Load the Google API client library
gapi.load('client', initClient);

function initClient() {
  // Load credentials from the JSON file
  fetch('credentials.json')
    .then((response) => response.json())
    .then((credentials) => {
      // Specify the necessary scopes
      const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

      // Authorize using the obtained credentials and scopes
      gapi.client
        .init({
          apiKey: credentials.apiKey, // Your API Key (if required)
          clientId: credentials.clientId,
          scope: scopes.join(' '),
          discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        })
        .then(() => {
          // Google Sheets API is now initialized and ready to use
          const sheets = gapi.client.sheets;

          // Find the file ID by title
          sheets.spreadsheets
            .get({
              properties: { title: 'Week1' }, // Replace 'Week1' with the title of your file
            })
            .then((response) => {
              const fileId = response.result.spreadsheetId;

              // Access the file using the retrieved ID and retrieve cell A1 value from Sheet1
              sheets.spreadsheets.values
                .get({
                  spreadsheetId: fileId,
                  range: 'Sheet1!A1',
                })
                .then((response) => {
                  const value = response.result.values[0][0];
                  console.log('Value of cell A1:', value);
                })
                .catch((err) => {
                  console.error('Error fetching data:', err);
                });
            })
            .catch((err) => {
              console.error('Error retrieving file by title:', err);
            });
        })
        .catch((err) => {
          console.error('Error initializing Google Sheets API:', err);
        });
    })
    .catch((err) => {
      console.error('Error loading credentials:', err);
    });
}
