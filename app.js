const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");


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

//index route 
app.get("/listings" , async(req,res)=>{
    const alllistings = await  Listing.find({});
    res.render("./listings/index.ejs" , {alllistings} )
})

//new or add listing route
app.get("/listings/new" , (req,res)=>{
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id" , async(req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs" , {listing});
})

//create route
app.post("/listings" , async(req , res) =>{
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings")
})

//edit route
app.get("/listings/:id/edit" , async(req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
})

//update route
app.put("/listings/:id" , async(req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect(`/listings/${id}`); 
})

//delete route
app.delete("/listings/:id" , async(req , res)=>{
    let {id} = req.params;
    const deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings")
})


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




app.listen(8080 ,()=>{
    console.log("server is listning")
})