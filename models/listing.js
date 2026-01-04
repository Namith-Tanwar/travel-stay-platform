const mongoose = require("mongoose");
const Review = require("./review");

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
        "https://unsplash.com/photos/tokyo-tower-viewed-from-below-through-trees-j8Wo7cmoieY",
    },
  },
    price : Number,
    location: String,
    country: String,
    reviews:[{
      type:Schema.Types.ObjectId,
      ref: "Review"
    }]
})

listingschema.post("findOneAndDelete" , async(listing)=>{
  if (listing) {
    await Review.deleteMany({_id :{$in : listing.reviews}});
  }
})

const Listing = mongoose.model("Listing",listingschema);
module.exports= Listing;