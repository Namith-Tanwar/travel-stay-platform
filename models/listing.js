const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingschema = new Schema({
    title: {
        type:String,
        required: true,
    },
    description: String,
    image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1750764673942-11e683ec65b0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTJ8fHxlbnwwfHx8fHw%3D",
    },
  },
    price : Number,
    location: String,
    country: String,
})

const Listing = mongoose.model("Listing",listingschema);
module.exports= Listing;