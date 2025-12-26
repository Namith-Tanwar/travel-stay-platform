const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");


const MONGO_url = 'mongodb://127.0.0.1:27017/travelstay';

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

app.get("/testlisting" , async(req , res)=>{
    let samplelisting = new Listing({
        title: "tokyo tower",
        description : "beautifult view",
        price : 200,
        location : "tokyo" ,
        country : "Japan", 
    })
    await samplelisting.save().then(()=>{
        console.log("saves ")
        res.send("saved")
    })
    .catch((err)=>{
        console.log(err);
        res.send("error connecting");
    })

})


app.listen(8080 ,()=>{
    console.log("server is listning")
})