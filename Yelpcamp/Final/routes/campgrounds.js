var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Campground = require("../models/campground");
var user = require("../models/user");
var middleware = require("../middleware");

//INDEX ROUTE
router.get("/" ,  function(req,res) {
    
    // Get all the campgrounds from the database
    Campground.find({} , function(err , allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
           res.render("campgrounds/index" , {campgrounds:allCampgrounds , currentUser: req.user}); 
        }
    });
});

//NEW ROUTE
router.get("/new" , middleware.isLoggedIn , function(req,res) {
   res.render("campgrounds/new");
});

//CREATE ROUTE
router.post("/" ,function(req,res) {
   var name = req.body.name;
   var price = req.body.price;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var newCampground = {name: name , price: price , image: image , description: desc , author: author};
   //create a new campground and save to the database
   Campground.create(newCampground , function(err , newlyCreated) {
       if(err) {
           console.log(err);
       } else {
           console.log(newlyCreated);
           res.redirect("/campgrounds");
       }
   })
   // campgrounds.push(newCampground);
   
});

//SHOW ROUTE
router.get("/:id" , function(req,res) {
   Campground.findById(req.params.id).populate("comments").exec(function(err , foundCampground) {
       if(err) {
           console.log(err);
       } else {
           res.render("campgrounds/show" , {campground : foundCampground});
       }
   });
   
});

//EDIT ROUTE
router.get("/:id/edit" , middleware.checkCampgroundownership , function(req,res){
   Campground.findById(req.params.id , function(err , foundCampground){
        res.render("campgrounds/edit" , {campground: foundCampground});
   });
});
      

//UPDATE ROUTE
router.put("/:id" , middleware.checkCampgroundownership , function(req,res) {
    Campground.findByIdAndUpdate(req.params.id , req.body.campground , function(err , updatedCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id );
        }
    })
});

//DELETE ROUTE
router.delete("/:id" , middleware.checkCampgroundownership , function(req,res) {
    Campground.findByIdAndRemove(req.params.id , function(err) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;