const fs = require('fs');
const Database = require('better-sqlite3');
const path = require('path');
const csv = require('csv-parse/sync');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

const csvPath = path.join(__dirname, 'data.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');

const records = csv.parse(csvContent, {
    columns: true,
    skip_empty_lines: true
});

// Initialize Schema
db.exec(`
  DROP TABLE IF EXISTS dishes;
  DROP TABLE IF EXISTS restaurants;

  CREATE TABLE restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    cuisine TEXT,
    location TEXT,
    rating REAL,
    phone TEXT,
    lat REAL,
    lng REAL,
    area TEXT
  );

  CREATE TABLE dishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER,
    name TEXT NOT NULL,
    FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)
  );
`);

const insertRestaurant = db.prepare(`
  INSERT INTO restaurants (name, address, cuisine, location, rating, phone, lat, lng, area)
  VALUES (@name, @address, @cuisine, @location, @rating, @phone, @lat, @lng, @area)
`);

const insertDish = db.prepare(`
  INSERT INTO dishes (restaurant_id, name)
  VALUES (@restaurant_id, @name)
`);

const processRecords = db.transaction((records) => {
    let count = 0;
    for (const record of records) {
        if (!record.name || record.name.trim() === '') {
            continue;
        }

        // Parse Rating
        const rating = parseFloat(record.rating) || 0;

        // Insert Restaurant
        try {
            const result = insertRestaurant.run({
                name: record.name,
                address: record.address,
                cuisine: record.cuisine,
                location: record.localAddress || record.address,
                rating: rating,
                phone: record.phone,
                lat: parseFloat(record.latitude) || 0,
                lng: parseFloat(record.longitude) || 0,
                area: ''
            });

            const restaurantId = result.lastInsertRowid;

            if (record.Dishes) {
                const dishList = record.Dishes.split(' ').filter(d => d.trim().length > 0);
                for (const dishName of dishList) {
                    insertDish.run({
                        restaurant_id: restaurantId,
                        name: dishName.trim()
                    });
                }
            }
            count++;
        } catch (err) {
            console.error('Error inserting record:', record.name, err);
        }
    }
    console.log(`Inserted ${count} restaurants.`);
});

console.log(`Processing ${records.length} records...`);
processRecords(records);
console.log('Database seeded successfully.');
