  var express = require("express");
  var router = express.Router();
  var passport = require("passport");
  var User = require("../models/user");
 
   
   //Root route
    router.get("/", function(req, res){
    res.render("landing");
});

    
    //Show register form
    router.get("/register", function(req, res) {
        res.render("register");
    });
    
    //handle signup logic
   router.post("/register", function(req, res) {
        var newUser = new User({username: req.body.username});
         eval(require("locus"));
        User.register(newUser, req.body.password, function(err, user){
            if(err){
                console.log(err);
                req.flash("error", err.message);
               return res.render("register");
            }
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome "  +  user.username);
                res.redirect("/breweries");
            });
        } );
    });
    
    
    //show login form
    router.get("/login", function(req, res) {
        res.render("login");
    });
    //Handling login logic
    router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/breweries",
        failureRedirect: "/login"
    }) , function(req, res) {
        
    });
    
    //logout route
    
    router.get("/logout", function(req, res){
        req.logout();
        req.flash("success", "Logged Out");
        res.redirect("/breweries");
    });
    
    
    module.exports = router;