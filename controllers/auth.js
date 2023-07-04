
const mysql = require('mysql');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
	host: process.env.db_host,
	user: process.env.db_user,
	passord: process.env.db_pass,
	database: process.env.database,

});
//signup model
exports.register = (req,res) => {
    console.log(req.body);
    
    const { name, email, password, pconfirm} = req.body;
    db.query('SELECT email from users WHERE email = ? ', [email], async (error, results)=> {
        if(error){
            console.log(error)
        }
        if(results.length > 0){
            return res.render('signup',{
                message: 'Email is arealdy in use'
            });
        } else if ( password !== pconfirm){
            return res.render('signup', {
                message: 'Password do not match'
            });
        }
        //uncomment if want I want to hashed password to database
       // let hashedPassword = await bcrypt.hash(password, 8);
       // console.log(hashedPassword);
        db.query('INSERT INTO users SET ?', {name : name, email : email, password : pconfirm} , (error,results) =>{
            if(error){
                console.log(error);

            }else{
                console.log(results);
                return res.render('signup', {
                    message: 'Registration successful'
                });
            }
    });

    });
   // res.send("submitted");
}
//login model
exports.login = (req,res) => {
    console.log(req.body);
    
    const {username, password} = req.body;
    // Check if username and password are provided
  if (!username || !password) {
    return res.render('index', {
        message: 'Username and password are required.'
    });
}
    db.query('SELECT * from users WHERE name = ? AND password = ?', [username, password] , (error,results) =>{
        if(error){
            console.log(error);
        } 
        if (results.length === 0){
            console.log(results);
            return res.render('index', {
                message: 'Invalid username or password'
            });
        }else{
            return res.render('dashboard', {
                message: 'Login successful'
            });
        }

       
});

  // res.send("submitted");
}
