const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync");
const {listingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");


const validatelisting = (req , res, next)=>{
    let {error} = listingSchema.validate(req.body); 
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 ,errmsg)
    }
    next();
}

//index route 
router.get("/" , wrapAsync(async(req,res)=>{
    const alllistings = await  Listing.find({});
    res.render("./listings/index.ejs" , {alllistings} )
}));

//new or add listing route
router.get("/new" , (req,res)=>{
    res.render("listings/new.ejs");
})

//show route
router.get("/:id" , wrapAsync(async(req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs" , {listing});
})
);
//create route

    router.post("/" ,validatelisting, wrapAsync( async(req , res) =>{
        const newlisting = new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings")
})
);

//edit route
router.get("/:id/edit" , wrapAsync(async(req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
})
);

//update route
router.put("/:id" , validatelisting,wrapAsync(async(req , res)=>{
    if (!req.body.listing) {
            throw new ExpressError(400 , "Send valid data for listing")
        }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect(`/listings/${id}`); 
})
);

//delete route
router.delete("/:id" , wrapAsync(async(req , res)=>{
    let {id} = req.params;
    const deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings")
})
);

module.exports = router;