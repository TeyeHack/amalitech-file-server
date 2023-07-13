const express = require("express");
const session = require('express-session');
const mysql = require("mysql");
const app = express();
const path = require("path")
const fileUpload = require('express-fileupload');

const dotenv = require("dotenv")

dotenv.config({ path: './.env'});




const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory))
// parsing of urlencoded bodies as html forms
app.use(express.urlencoded({ extended : false}));
//parse json bodies as sent by API CLIENTS
app.use(express.json());
    app.set('view engine', 'hbs');

 

    //db connection to 
const db = mysql.createConnection({
	host: process.env.db_host,
	user: process.env.db_user,
	passord: process.env.db_pass,
	database: process.env.database,

});
db.connect((error) =>{
    if(error){
        console.log(error)
    }else{
        console.log("Mysql connected ......")
    }
    
});
app.use(fileUpload());
//routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));



app.listen (3001, ()=>{

console.log("Server connected on port 3001");
});
