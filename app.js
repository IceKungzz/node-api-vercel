//nodemon app.js
const express = require('express');
const cors = require('cors');
const controller = require('./controller');
const app = express();
const port = 3002;
const mysql = require("mysql2");


app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'mydb_node'
})

db.connect((err)=>{
    if(err){
        console.log('Error connecting to database:', err);
        return;
    }
    console.log('Connect to database');
})

app.use((req,res,next)=>{
    req.db = db;
    next();
})


app.post('/register', (req,res) => controller.register(req,res));
app.post('/login',(req,res) => controller.login(req,res));
app.post('/auth',(req,res) => controller.auth(req,res));


app.listen(port, ()=>{
    console.log("Server listening on port "+port);
})

module.exports = app;