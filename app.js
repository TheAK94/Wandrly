const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wandrly";
const Listing = require("./Models/listing.js");
const path = require("path");


main()
    .then((res) => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log(err)}
    );


async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.send("This is root directory");
});

// Index Route
app.get("/listings", async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
})

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Mumbai",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("Sample saved");
//     res.send("Successful");
// });

app.listen(8080, () => {
    console.log("App is listening on port 8080");
});
