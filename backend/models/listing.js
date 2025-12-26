const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingschema = new Schema({
    title: {
        type:String,
        required: true,
    },
    description: String,
    image : {
        type: String,
        default : "https://unsplash.com/photos/tokyo-tower-viewed-from-below-through-trees-j8Wo7cmoieY",
        set : (v)=> v === "" ? "https://unsplash.com/photos/tokyo-tower-viewed-from-below-through-trees-j8Wo7cmoieY":v, 
    },
    price : Number,
    location: String,
    country: String,
})

const Listing = mongoose.model("Listing",listingschema);
module.exports= Listing;