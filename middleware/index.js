var Breweries = require("../models/breweries");
var Comment = require("../models/comment");
//all the middleware goes here
var middlewareObj = {
    
};

middlewareObj.checkBreweryOwnership = function(req, res, next){
        if(req.isAuthenticated()){
            
            Breweries.findById(req.params.id, function(err, foundBreweries){
                if(err || !foundBreweries){
                    req.flash("error", "Brewery not Found");
                    res.redirect("back");
                } else {
                    //does user own page
                    if(foundBreweries.author.id.equals(req.user._id)){
                       next();
                    } else {
                        req.flash("error", "Authorization Denied");
                        res.redirect("back");
                    }
                    
                }
            });  
        } else {
            req.flash("error", "Please Log In");
            res.redirect("back");
        }
    };

middlewareObj.checkCommentOwnership =function(req, res, next){
        if(req.isAuthenticated()){
            
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err || !foundComment){
                    req.flash("error", "Comment Not Found");
                    res.redirect("back");
                } else {
                    //does user own comment
                    if(foundComment.author.id.equals(req.user._id)){
                       next();
                    } else {
                        req.flash("error", "Authorization Denied");
                        res.redirect("back");
                    }
                    
                }
            });  
        } else {
            req.flash("error", "Please Log In");
            res.redirect("back");
        }
    };
    
    //Middleware
    middlewareObj.isLoggedIn =function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "Please Log In");
        res.redirect("/login");
    };
    
    
    

module.exports = middlewareObj;