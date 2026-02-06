const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

const csvPath = path.join(__dirname, 'data.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

const records = csv.parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    to: 1 // Only parse first record
});

console.log('First record keys:', Object.keys(records[0]));
console.log('First record:', records[0]);
