const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// require("dotenv").config();
// const geocoder = mbxGeocoding({ accessToken: "YOUR MAP TOKEN HERE" });

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

const categories = [
  "Rooms",
  "Iconic cities",
  "Mountains",
  "Castles",
  "Beaches",
  "Camping",
  "Farms",
  "Arctic"
];

const sampleReviews = [
    {
        rating: 5,
        comment: "Absolutely loved the place! Super clean and cozy.",
    },
    {
        rating: 4,
        comment: "Great experience overall, but the bathroom could've been cleaner.",
    },
    {
        rating: 5,
        comment: "Perfect location and very friendly host. Would visit again!",
    },
    {
        rating: 3,
        comment: "Okayish stay. The pictures looked better than the actual place.",
    },
    {
        rating: 4,
        comment: "Good value for money. Great for short stays.",
    },
    {
        rating: 5,
        comment: "It felt like home. The vibe was just amazing!",
    },
    {
        rating: 2,
        comment: "Not the best. Had issues with cleanliness and WiFi.",
    },
    {
        rating: 5,
        comment: "Stunning view and peaceful atmosphere!",
    },
    {
        rating: 4,
        comment: "Nicely maintained property, good for families.",
    },
    {
        rating: 3,
        comment: "Decent place, but the neighborhood was too noisy.",
    },
];


const getRandomCategory = () => {
  const index = Math.floor(Math.random() * categories.length);
  return categories[index];
};

const initDB = async () => {
  // await Listing.deleteMany({});
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

const updateListingsWithCategory = async () => {
  const listings = await Listing.find({});
  for (let listing of listings) {
    listing.category = getRandomCategory();
    await listing.save();
  }
  console.log("All listings updated with random categories");
};

// updateListingsWithCategory();

// initDB();

const addFakeReviews = async function addFakeReviewsToListings() {
    const listings = await Listing.find({});
    const users = await User.find({});
    if (!users.length) {
        console.error("⚠️ No users found in database to assign as review authors.");
        return;
    }

    for (let listing of listings) {
        const numberOfReviews = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < numberOfReviews; i++) {
            const { rating, comment } = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
            const randomUser = users[Math.floor(Math.random() * users.length)];

            const review = new Review({
                rating,
                comment,
                author: randomUser._id
            });

            await review.save();
            listing.reviews.push(review);
        }

        await listing.save();
        console.log(`✅ Added ${numberOfReviews} reviews to listing "${listing.title}"`);
    }

    console.log("🎉 Fake reviews added to all listings!");
}

addFakeReviews();