const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema ,reviewSchema} = require("./schema");
const Review = require("./models/review");


const MONGO_url = 'mongodb://127.0.0.1:27017/travelstay';

app.set("view engine", "ejs");
app.set("views", path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine('ejs' , ejsmate);
app.use(express.static(path.join(__dirname , "/public")))

main().then(()=>{
    console.log("connected");
})
.catch(err =>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_url);
    console.log("db connected");
}

app.get("/" , (req,res)=>{
    res.send("working")
})

const validatelisting = (req , res, next)=>{
    let {error} = listingSchema.validate(req.body); 
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 ,errmsg)
    }
    next();
}

const validatereview = (req , res, next)=>{
    let {error} = reviewSchema.validate(req.body); 
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 ,errmsg)
    }
    next();
}


//index route 
app.get("/listings" , wrapAsync(async(req,res)=>{
    const alllistings = await  Listing.find({});
    res.render("./listings/index.ejs" , {alllistings} )
}));

//new or add listing route
app.get("/listings/new" , (req,res)=>{
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id" , wrapAsync(async(req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs" , {listing});
})
);
//create route

    app.post("/listings" ,validatelisting, wrapAsync( async(req , res) =>{
        const newlisting = new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings")
})
);

//edit route
app.get("/listings/:id/edit" , wrapAsync(async(req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
})
);

//update route
app.put("/listings/:id" , validatelisting,wrapAsync(async(req , res)=>{
    if (!req.body.listing) {
            throw new ExpressError(400 , "Send valid data for listing")
        }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect(`/listings/${id}`); 
})
);

//delete route
app.delete("/listings/:id" , wrapAsync(async(req , res)=>{
    let {id} = req.params;
    const deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings")
})
);

//post reviews route
app.post("/listings/:id/reviews" , validatereview ,wrapAsync(async(req , res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
}));

//delete review route

app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async(req ,res)=>{
    let {id , reviewId} = req.params;

    await Listing.findByIdAndUpdate(id , {$pull :{ reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
})
);


// app.get("/testlisting" , async(req , res)=>{
//     let samplelisting = new Listing({
//         title: "tokyo tower",
//         description : "beautifult view",
//         price : 200,
//         location : "tokyo" ,
//         country : "Japan", 
//     })
//     await samplelisting.save().then(()=>{
//         console.log("saves ")
//         res.send("saved")
//     })
//     .catch((err)=>{
//         console.log(err);
//         res.send("error connecting");
//     })

// })

app.use((req , res , next)=>{
    next(new ExpressError(404, "Page not found"))
})

//error handling middleware
app.use((err , req , res ,next)=>{
    let{statusCode = 500 , message} = err;
    res.status(statusCode).render("error.ejs" , {err});
    //res.status(statusCode).send(message);
})

app.listen(8080 ,()=>{
    console.log("server is listning")
})