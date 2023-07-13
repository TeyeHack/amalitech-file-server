
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const fileUpload = require('express-fileupload');
const nodemailer = require('nodemailer');

const db = mysql.createConnection({
	host: process.env.db_host,
	user: process.env.db_user,
	passord: process.env.db_pass,
	database: process.env.database,

});
var totalDownloads;   var totalEmails;
//signup 
exports.register = (req,res) => {
    console.log(req.body);
    
    const { name, email, password, pconfirm} = req.body;
    db.query('SELECT email from users WHERE email = ? ', [email], async (error, results)=> {
        if(error){
          //  console.log(error)
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
                //console.log(error);

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
//login 
exports.login = (req,res) => {
    console.log(req.body);
    
    const {email, password} = req.body;
    // Check if username and password are provided
  if (!email || !password) {
    return res.render('index', {
        message: 'email and password are required.'
    });
}
    db.query('SELECT * from users WHERE email = ? AND password = ?', [email, password] , (error,results) =>{
        if(error){
          //  console.log(error);
        } 
        if (results.length === 0){
            console.log(results);
            return res.render('index', {
                message: 'Invalid email or password'
            });
        }else{
            return res.render('userdashboard', {
                message: 'Login successful'
            });
        }

       
});
 // res.send("submitted");
}
//adminlogin 
exports.adminlogin = (req,res) => {
    console.log(req.body);
  
    const {email, password} = req.body;
    // Check if username and password are provided
  if (!email || !password) {
    return res.render('adminlogin', {
        message: 'email and password are required.'
    });
}
    db.query('SELECT * from admin WHERE email = ? AND password = ?', [email, password] , (error,results) =>{
        if(error){
          //  console.log(error);
        } 
        if (results.length === 0){
            console.log(results);
            return res.render('adminlogin', {
                message: 'Invalid email or password'
            });
        }else{
  
  //get_records from total-emails, total-downloads
       
            var query1 = "SELECT COUNT(*) AS total FROM emails;";

            db.query(query1, function (error, data){

              if(error)
              {
              console.log(error)
               throw error; 
      
                }
                else
                 {
            totalEmails = data[0].total;
            var query2 = "SELECT SUM(download_count) AS total_downloads FROM files";
            
            db.query(query2, function (error, data1){
            totalDownloads = data1[0].total_downloads;
          
          res.render('admindashboard', {totalDownloads, totalEmails , message: 'all fields are required'});
          //console.log(data)
          
          }
          );
     
   

    }

  });

  
 
        }

       
});
           
            
            }
//userDashboard
exports.userdashboard = (req,res) => {
    console.log(req.body);
    const {title,description,file} = req.body;
   if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
    
      const files = req.files.file;

      // Save file to folder
      const fileName = files.name;
      const filePath = 'public/uploads/' + fileName;
      files.mv(filePath, (error,results) => {
        if (error) {
          //console.error(error);
          return res.render('',{
            message : 'File upload failed.'
        });
         
        }
    
        // Save file details to database
        const query = 'INSERT INTO files (title, description, filename) VALUES (?, ?, ?)';
    db.query(query, [title, description, fileName], (error,results) => {
          if (error) {
            console.error(error);

            return res.render('userdashboard',{
                message : 'Database error.'
            });
          }
    
          return res.render('userdashboard', {
            message : 'File uploaded successfully.'
          });
         
        });
      });
}
//get Records from files
exports.getRecords = function(req, res, next) {
    // Get the search keyword from the query parameters
    var searchKeyword = req.query.search || '';
  var query = "SELECT * FROM files WHERE title LIKE '%" + searchKeyword + "%'";

	db.query(query, function (error, data){

		if(error)
		{
      console.log(error)
			throw error; 
      
		}
		else
		{
      var filename = req.body.filename;
//  console.log(filename);
      // Increment the download_count for the file in the database
      var updateQuery = "UPDATE files SET download_count = download_count + 1 WHERE filename = ? limit 1";
      db.query(updateQuery, [filename], function(error, result) {
        if (error) {
        //  console.log(error);
          throw error;
        }
        //console.log(result)
    
        // Send the file to the client
        // ...
      });
      
      res.render('filerecords', { files: data, searchKeyword: searchKeyword });
    //console.log(data)

		}

	});

 
};

//adminDashboard
exports.admindashboard = (req,res) => {
    console.log(req.body);
    const {title,description,file} = req.body;
   if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
    
      const files = req.files.file;
      const idf = '0';
      // Save file to folder
      const fileName = files.name;
      const filePath = 'public/uploads/' + fileName;
      files.mv(filePath, (error,results) => {
        if (error) {
         // console.error(error);
          return res.render('',{
            message : 'File upload failed.'
        });
         
        }
    
        // Save file details to database
        const query = 'INSERT INTO files (title, description, filename) VALUES ( ?, ?, ?)';
    db.query(query, [ title, description, fileName], (error,results) => {
          if (error) {
            console.error(error);

            return res.render('admindashboard',{
                message : 'Database error.'
            });
          }
    
          res.render('admindashboard', {totalDownloads, totalEmails , message: 'File uploaded succesfull'});
         
        });
      });
}
// create a transporter

const transporter = nodemailer.createTransport({
 //service : 'mail.fartechgh.com',
 host: 'smtp.gmail.com',
  port: 465, // Specify the appropriate port number
  secure: true, // Set to true if your server requires a secure connection (e.g., using SSL/TLS)
 auth:{
    user: 'addicoteye105@gmail.com',
    pass: 'bdsjdtyeinjvfpbc',
 },
});

exports.sendEmailWithAttachment = (req, res) => {
  
  
    // Access the uploaded file
    const file = req.body.file;
    const recipientEmail = req.body.email;
    const subject = req.body.subject;
    const text = req.body.text;
  
    const files = req.files.file;
    // Save file to folder
    const fileName = files.name;
    const filePath = 'public/uploads/' + fileName;
    files.mv(filePath, (error) => {
      if (error) {
        console.error(error);
        return res.status(500).send('File upload failed.');
      }
  
      // Send the email
      const mailOptions = {
        from: 'addicoteye105@gmail.com',
        to: recipientEmail,
        subject: subject,
        text: text,
        attachments: [{
          filename: fileName,
          path: filePath,
        }],
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error occurred while sending email:', error);
          return res.status(500).send('Error occurred while sending email.');
        } else {
          console.log('Email sent:', info.response);
  
          // Save email details to the database
          const query = 'INSERT INTO emails (recipient_email, subject, text, attachment_filename) VALUES (?, ?, ?, ?)';
          db.query(query, [recipientEmail, subject, text, fileName], (error) => {
            if (error) {
              console.error('Database error:', error);
              return res.status(500).send('Database error.');
            }
  
            res.send('Email sent successfully.');
          });
        }
      });
    });
  };

  exports.logout = (req, res) => {
    // Perform logout logic here
   
    req.session.destroy();
    res.redirect('/');
  };



  exports.downloadFile = function(req, res)  {
    var filename = req.query.filename;
  
    // Increment the download_count for the file in the database
    var updateQuery = "UPDATE files SET download_count = download_count + 1 WHERE filename = ?";
    db.query(updateQuery, [filename], function(error, result) {
      if (error) {
        console.log(error);
        throw error;
      }
      console.log(result)
  
      // Send the file to the client
      // ...
    });
  };
  

  
  ///forgetpass
  exports.forgetpass = (req,res) => {
    console.log(req.body);
    
    const { email, password, oldpass} = req.body;
    db.query('SELECT email,password from users WHERE email = ? AND password = ?', [email,oldpass], async (error, results)=> {
        if(error){
            console.log(error)
        }
       
        if(results.length > 0){
        db.query('UPDATE users SET password = ? where email= ?', [ password, email] , (error,results) =>{
          if(error){
            //  console.log(error);

          }else{
              console.log(results);
               res.render('forgetpass', {
                  message: 'Reset successful'
              });
          }
  });
          } 
       
    }) 

}