const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");


const listings = require("./routes/listing");
const reviews = require("./routes/review");


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



//router used for listing
app.use("/listings" , listings);

//router for reviews
app.use("/listings/:id/reviews", reviews);




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