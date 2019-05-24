     require('dotenv').config();
var  express       = require("express"),
     app           = express(),
     bodyParser    = require("body-parser"),
     mongoose      = require("mongoose"),
     flash         = require("connect-flash"),
     passport      = require("passport"),
     cookieParser  = require("cookie-parser"),
     LocalStrategy = require("passport-local"),
     methodOverride = require("method-override"),
     Breweries     = require("./models/breweries"),
     Comment       = require("./models/comment"),
     User          = require("./models/user")
    //  seedDB        = require("./seeds")
    
     
//requiring routes     
var commentRoutes   = require("./routes/comments"),
    breweriesRoutes = require("./routes/breweries"),
    indexRoutes     = require("./routes/index")
     
mongoose.connect("mongodb://localhost:27017/breweries");     
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(cookieParser('secret'));
app.use(flash());


// seedDB(); //seed database

//Passport configuration
app.use(require("express-session")({
    secret: "My favorite brewery is Legion",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/" , indexRoutes);
app.use("/breweries" , breweriesRoutes);
app.use("/breweries/:id/comments" , commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is Running");
});