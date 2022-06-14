const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extends: false }));

app.use(bodyParser.json());

// MySQL
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'restaurant_mobile'
});


// GET all restaurants
app.get('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id &{connection.threadId}`)

        // query(sqlString, callback)
        connection.query('SELECT  r.id, r.name, r.opening, r.close, r.delivery, r.reviews, r.rating, r.locationId, r.image, l.city, l.country, l.street  FROM restaurants r JOIN locations l ON (l.id = r.locationId)', (err, rows) => {
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

// GET a restaurant by ID
app.get('/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id &{connection.threadId}`)

        // query(sqlString, callback)
        connection.query('SELECT r.id, r.name, r.opening, r.close, r.delivery, r.reviews, r.rating, r.locationId, r.image, l.city, l.country, l.street FROM restaurants r JOIN locations l ON (l.id = r.locationId) WHERE r.id = ?', [req.params.id], (err, rows) => {
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
});

// GET the list of categories
app.get('/list/categories', (req, res) => {
    pool.getConnection((err, connection) => {

        if(err) throw err

        // query(sqlString, callback)
        connection.query('SELECT * FROM categories', (err, rows) => {
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
});

// GET a list with rel rest-categ
app.get('/list/categories/:id/restaurants/', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id &{connection.threadId}`)

        // query(sqlString, callback)
        connection.query('SELECT * FROM restaurant_categories JOIN restaurants ON (restaurants.id = restaurant_categories.restaurantId) JOIN locations ON (restaurants.locationId = locations.id) WHERE restaurant_categories.categoryId = ?', [req.params.id], (err, rows) => {
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
});


// DELETE a restaurant by ID
app.delete('/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id &{connection.threadId}`);

        // query(sqlString, callback)
        connection.query('DELETE FROM restaurants WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release(); //return the connection to pool

            if(!err) {
                res.send(`Restaurant with the Record ID: ${[req.params.id]} has been removed`)
            } else {
                console.log(err)
            }
        })
    })
});

// Add a record / restaurant
app.post('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        const params = req.body;


        // query(sqlString, callback)
        connection.query('INSERT INTO restaurants SET ?', params, (err, rows) => {
            connection.release(); //return the connection to pool

            if(!err) {
                res.json({success: true})
            } else {
                console.log(err)
            }
        })

        console.log(req.body)
    })
});

// Add to favorites
app.post('/favorites', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        const params = req.body;


        // query(sqlString, callback)
        connection.query('INSERT INTO favorites SET ?', params, (err, rows) => {
            connection.release(); //return the connection to pool

            if(!err) {
                res.json({success: true})
            } else {
                console.log(err)
            }
        });

        console.log(req.body)
    })
});


// GET favorite restaurant
app.get('/favorites/:userId', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id &{connection.threadId}`)

        // query(sqlString, callback)
        connection.query('SELECT restaurantId FROM favorites WHERE userId = ?', [req.params.userId], (err, rows) => {
            connection.release(); //return the connection to pool
            let result = [];

            for (let row of rows)   {
                result.push(row.restaurantId);
            }

            if(!err) {
                res.json(result)
            } else {
                console.log(err)
            }
        })
    })
});

// Update a record / restaurant
app.put('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id &{connection.threadId}`);

        const { id, name, opening, close, delivery, reviews, rating } =req.body;

        // query(sqlString, callback)
        connection.query('UPDATE restaurants SET name = ?, opening = ?, close = ? WHERE id = ?', [name, opening, close, id], (err, rows) => {
            connection.release(); //return the connection to pool

            if(!err) {
                res.json({success: true})
            } else {
                console.log(err)
            }
        })

        console.log(req.body)
    })
});

// Update a image for restaurant
app.put('/image', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id &{connection.threadId}`);

        const { id, name, opening, close, delivery, reviews, rating, image } =req.body;

        // query(sqlString, callback)
        connection.query('UPDATE restaurants SET name = ?, image = ? WHERE id = ?', [name, image, id], (err, rows) => {
            connection.release(); //return the connection to pool

            if(!err) {
                res.send(`Restaurant with the Record name: ${name} has been updated`)
            } else {
                console.log(err)
            }
        })

        console.log(req.body)
    })
});

// Listen on port environment port or 5000
app.listen(port, () => console.log(`Listen on port ${port}`))


// const http = require('http');
//
// // Create an instance of the http server to handle HTTP requests
// let app = http.createServer((req, res) => {
//     // Set a response type of plain text for the response
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//
//     // Send back a response and end the connection
//     res.end('Hello World!\n');
// });
//
// // Start the server on port 3000
// app.listen(3000, '127.0.0.1');
// console.log('Node server running on port 3000');