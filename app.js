const express = require("express")
const mysql = require("mysql")

const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	passord: '',
	database:'file_server_amalitech',

});
db.connect((error) =>{
    if(error){
        console.log(error)
    }else{
        console.log("Mysql connected ......")
    }
})

const app = express();

app.get("/", (req,res) => {
res.send("<h1>Hello </h1>")
});
app.listen (3000, ()=>{

console.log("Server connected on port 3000");
})