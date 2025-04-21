const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const port = 8080;
const methodOverride = require('method-override')
const Listing = require("./Models/listing");
const Review = require("./Models/review.js");
engine = require('ejs-mate');
const wrapAsync = require("./utills/wrapAsync");
const ExpressError = require("./utills/expressError");
const { rmSync } = require("fs");
const dbURL = process.env.MONGO_LINK;
const listingController = require("./controllers/listing.js");

app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine('ejs', engine);

main(() => console.log("connected with wanderlust")).catch(err => console.log(err));
async function main() {
  await mongoose.connect("mongodb+srv://sayanpub2020:sayan8945097611@cluster-demo.pah6g4g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-demo");
}


//index route
app.get("/listings", wrapAsync(listingController.index));

//new route
app.get("/listings/new", listingController.renderNewFrom)
app.post("/listings",
  wrapAsync(listingController.new))

//show route
app.get("/listings/:id", wrapAsync(listingController.show))

//update route
app.get("/listings/:id/edit",
  wrapAsync(listingController.update))
app.put("/listings/:id", wrapAsync(listingController.updateform))

//delete route
app.delete("/listings/:id", wrapAsync(listingController.delete))

// review route
app.post("/listings/:id/reviews", wrapAsync(listingController.review))
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(listingController.reviewDel))

// error handling
app.use("/", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"))
})
app.use((err, req, res, next) => {
  let {statusCode = 500, message = "Something went wrong !"} = err;
  res.status(statusCode).render("error.ejs", {message});
})

app.listen(port, (req,res)=>{
  console.log("listening to port 8080...");
})
