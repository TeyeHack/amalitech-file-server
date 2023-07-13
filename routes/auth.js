const express = require('express');

const authController = require('../controllers/auth');
//const loginController = require('../controllers/auth');

const router = express.Router();

    router.post("/signup", authController.register); //ch
    router.post("/index", authController.login); //ch
    router.post("/adminlogin", authController.adminlogin); //ch
    router.post("/admindashboard",authController.admindashboard);
    router.post("/userdashboard",authController.userdashboard);
   
   router.post("/filerecords",authController.getRecords);

   router.get("/filerecords",authController.getRecords);
  router.post("/forgetpass",authController.forgetpass);

// File upload route
    router.post('/send-email', authController.sendEmailWithAttachment);


   /* router.get("/forgetpass", (req,res) =>{
        res.render("forgetpass")
    });**/
    module.exports = router;