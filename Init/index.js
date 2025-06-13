const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
require("dotenv").config();
const geocoder = mbxGeocoding({ accessToken: "YOUR MAP TOKEN HERE" });

const MONGO_URL = "mongodb://127.0.0.1:27017/wandrly";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  // initData.data = initData.data.map((obj) => ({...obj, owner: "684a8ddb61aa740d6b641e30"}));
  // await Listing.insertMany(initData.data);
  // console.log("data was initialized");
  const updatedData = [];

  for (let listing of initData.data) {
    const fullLocation = `${listing.location}, ${listing.country}`;
    const geoRes = await geocoder.forwardGeocode({
      query: fullLocation,
      limit: 1
    }).send();

    if (geoRes.body.features.length === 0) {
      console.log(`Location not found for: ${fullLocation}`);
      continue;
    }

    listing.owner = "684a8ddb61aa740d6b641e30";
    listing.geometry = geoRes.body.features[0].geometry;
    updatedData.push(listing);
  }

  await Listing.insertMany(updatedData);
  console.log("Data initialized with geometry!");
};

initDB();
