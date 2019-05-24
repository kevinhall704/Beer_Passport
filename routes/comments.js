var express = require("express");
var router = express.Router({mergeParams: true});
var Breweries = require("../models/breweries");
var Comment = require("../models/comment");
var middleware = require("../middleware");  
   
//comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find breweries by id
    Breweries.findById(req.params.id, function(err, breweries){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {breweries: breweries});
        }
    });
   
});
//Comments create
router.post("/", middleware.isLoggedIn, function(req, res) {
    //lookup brewery using id
    Breweries.findById(req.params.id, function(err, breweries) {
        if(err){
            req.flash("error", "Error")
            console.log(err);
            res.redirect("/breweries");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username and id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    //save comment
                    comment.save();
                    breweries.comments.push(comment);
                    breweries.save();
                    console.log(comment);
                    req.flash("success", "Successfully Added Comment");
                    res.redirect('/breweries/' + breweries._id);
                    }
                });
            }
        });
    });
    
    //Comments edit Route
    router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
        Breweries.findById(req.params.id, function (err, foundBreweries){
            if(err || !foundBreweries){
                req.flash("error", "Brewery Not Found");
                res.redirect("back");
            }
             Comment.findById(req.params.comment_id, function(err, foundComment) {
                if(err){
                    res.redirect("back");
              } else {
                    res.render("comments/edit", {breweries_id : req.params.id, comment: foundComment});
            }
        });
        });
       
       
    });
   
   //comment Update 
   router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
       Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
           if(err){
               res.redirect("back");
           } else {
               res.redirect("/breweries/" + req.params.id);
           }
       });
   });
   
   
   //comments destroy route
   router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
      Comment.findByIdAndRemove(req.params.comment_id, function(err){
          if(err){
              res.redirect("back");
          } else {
              res.flash("success", "Comment Deleted");
             res.redirect("/breweries/" + req.params.id); 
          }
      });
   });
   
    //Middleware
   
    
    module.exports = router;