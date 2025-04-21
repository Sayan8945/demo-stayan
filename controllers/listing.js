const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({}).sort({title:1});
    res.render("listings/index.ejs", {allListings});
  }
  module.exports.renderNewFrom = (req,res)=> {
    res.render("listings/new");
  }
  module.exports.new = async (req,res,next)=>{
    let newlisting = req.body.listing;
    await Listing.insertOne(newlisting);
    res.redirect("/listings");
  }
  module.exports.show = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show", {listing});
  }
  module.exports.update = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit", {listing});
  }
  module.exports.updateform = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let editedlisting = req.body.listing;
    await Listing.findByIdAndUpdate(id , editedlisting);
    res.redirect(`/listings/${id}`);
  }
  module.exports.delete = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
  }
  module.exports.review = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);  //convert into schema format
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();  //existing document change
    res.redirect(`/listings/${listing._id}`);
  }
module.exports.reviewDel = async (req,res) => {
    let {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    res.redirect(`/listings/${id}`)
  }