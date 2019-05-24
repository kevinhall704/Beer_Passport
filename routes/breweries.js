 var express = require("express");
 var router = express.Router();
 var Breweries = require("../models/breweries");
 var middleware = require("../middleware");  
 var multer = require("multer");
 var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
 var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
 var upload = multer({ storage: storage, fileFilter: imageFilter});

 var cloudinary = require('cloudinary');
 cloudinary.config({ 
  cloud_name: process.env.DB_NAME, 
  api_key: process.env.DB_KEY, 
  api_secret: process.env.DB_PASS
});  

// Index route show all breweries
router.get("/", function(req,res){
  
    //get all breweries from db
Breweries.find({}, function(err, allBreweries){
    if(err){
        console.log(err);
    } else {
        res.render("breweries/index", {breweries: allBreweries});
    }
});    
    
});

//New - Show form to create new Brewery
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
  cloudinary.uploader.upload(req.file.path, function(result) {
  // add cloudinary url for the image to the breweries object under image property
  req.body.breweries.image = result.secure_url;
  // add author to campground
  req.body.breweries_id.author = {
    id: req.user._id,
    username: req.user.username
  };
  Breweries.create(req.body.breweries, function(err, breweries) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect('/breweries/' + breweries.id);
  });
});
  });
   
   //Create - Add new Breweries
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("breweries/new");
});

 //Show - Shows more info about the Brewery  
router.get("/:id", function(req, res) {
    //find brewery with provided ID
    Breweries.findById(req.params.id).populate("comments").exec(function(err, foundBreweries){
        if(err || !foundBreweries){
        req.flash("error", "Brewery Not Found");
        res.redirect("back");
        } else {
            console.log(foundBreweries);
            res.render("breweries/show", {breweries: foundBreweries});
        }
    
    });
    
    });  
    
    //Edit Breweries Route
    router.get("/:id/edit", middleware.checkBreweryOwnership, function(req, res) {
      Breweries.findById(req.params.id, function(err, foundBreweries){
        res.render("breweries/edit", {breweries: foundBreweries});
            });  
    });
    
    //Update breweries Route
   router.put("/:id", middleware.checkBreweryOwnership, function(req, res){
    // find and update the correct campground
    Breweries.findByIdAndUpdate(req.params.id, req.body.breweries, function(err, updatedbreweries){
       if(err){
           res.redirect("/breweries");
       } else {
           //redirect somewhere(show page)
           res.redirect("/breweries/" + req.params.id);
       }
    });
});
  
  //Destroy brewery Route
  router.delete("/:id", middleware.checkBreweryOwnership, function(req, res){
      Breweries.findByIdAndRemove(req.params.id, function(err){
          if(err){
              res.redirect("/breweries");
          } else {
              res.redirect("/breweries");
          }
      });
  });
  
 


    


module.exports = router;