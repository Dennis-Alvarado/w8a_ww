const { google } = require('googleapis');
const sheets = google.sheets('v4');

// Spreadsheet ID constant
const SPREADSHEET_ID = '1vj9kf-CJBq1VBRjvlgfBphJUzIhEk_Ug7GGk79dd1IQ'; // Replace with your actual Spreadsheet ID

// Load the service account credentials from the JSON file
const auth = new google.auth.GoogleAuth({
    keyFile: 'keys/wba-web-data-4be1d229403d.json', // Path to your Google API JSON key file
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Function to append new user data to Google Sheets
async function appendToSheet(values) {
    const authClient = await auth.getClient();
    const request = {
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A:V', // Adjust the range to match the number of columns
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: { values: [values] }, // Append one row with the data
        auth: authClient,
    };

    try {
        const response = await sheets.spreadsheets.values.append(request);
        console.log('Data successfully added:', response.data.updates.updatedRows);
    } catch (err) {
        console.error('Error appending data:', err);
    }
}

// Function to update user data in Google Sheets by phone number
async function updateSheet(phoneNumber, values) {
    const authClient = await auth.getClient();
    const request = {
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A:V', // Define the range of your sheet to find the record
        valueInputOption: 'RAW',
        auth: authClient,
    };

    try {
        // Fetch all rows from the spreadsheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: request.spreadsheetId,
            range: 'Sheet1!A:V', // Adjust range based on your spreadsheet structure
            auth: authClient,
        });

        const rows = response.data.values;

        // Find the row matching the phone number (assuming phone number is in column A)
        const rowIndex = rows.findIndex(row => row[0] === phoneNumber);

        if (rowIndex !== -1) {
            // Update the row with the new values
            await sheets.spreadsheets.values.update({
                spreadsheetId: request.spreadsheetId,
                range: `Sheet1!A${rowIndex + 1}:V${rowIndex + 1}`, // Specify the row to update
                valueInputOption: 'RAW',
                resource: { values: [values] },
                auth: authClient,
            });
            console.log('Data updated successfully.');
        } else {
            console.log('Phone number not found in the spreadsheet.');
        }
    } catch (err) {
        console.error('Error updating data:', err);
    }
}

// Function to check if a user exists based on phone number
async function checkIfUserExists(phoneNumber) {
    const authClient = await auth.getClient();
    const request = {
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A:V', // Adjust range based on your spreadsheet structure
        auth: authClient,
    };

    try {
        // Fetch all rows from the spreadsheet
        const response = await sheets.spreadsheets.values.get(request);
        const rows = response.data.values;

        // Find the row where the first column matches the phone number
        const userRow = rows.find(row => row[0] === phoneNumber);
        return userRow || null; // Return the user row if found, otherwise null
    } catch (err) {
        console.error('Error fetching user data:', err);
        return null;
    }
}

module.exports = {
    appendToSheet,
    updateSheet,
    checkIfUserExists,
};
