const express = require("express");
const app = express();
const mongoose = require("mongoose");


const MONGO_url = 'mongodb://127.0.0.1:27017/travelstay';

main().then(()=>{
    console.log("connected");
})
.catch(err =>{
    console.log(err);
})

async function main() {
    mongoose.connect(MONGO_url);
}

app.get("/" , (req,res)=>{
    res.send("hi i am ")
})

app.listen(8080 ,()=>{
    console.log("server is listning")
})