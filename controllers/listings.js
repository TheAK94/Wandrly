const Listing = require("../models/listing");
const {cloudinary} = require("../cloudConfig.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

module.exports.index = async (req, res) => {
    const {category} = req.query;
    let listings;
    
    if (category === "Trending") {
        listings = await Listing.aggregate([
            {
                $addFields: {
                    reviewCount: { $size: "$reviews" }
                }
            },
            {
                $match: {
                    reviewCount: { $gte: 5 }
                }
            },
            {
                $sort: { reviewCount: -1 }
            }
        ]);
    } else if (category) {
        listings = await Listing.find({ category });
    } else {
        listings = await Listing.find({});
    }
    res.render("listings/index.ejs", {listings, category: category || "All" });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing, dayjs});
};

module.exports.createListing = async (req, res) => {
    const fullLocation = `${req.body.listing.location}, ${req.body.listing.country}`;
    let response = await geocodingClient
        .forwardGeocode({
            query: fullLocation,
            limit: 1
        })
        .send()
    
    
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = { filename, url };
    }

    newListing.geometry = response.body.features[0].geometry;
    
    let savedListing = await newListing.save();
    // console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    let imageUrl = listing.image.url;
    if (imageUrl.includes("res.cloudinary.com")) {
        imageUrl = imageUrl.replace("/upload", "/upload/w_250,h_200,e_blur:300");
    }
    res.render("listings/edit.ejs", {listing, imageUrl});
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);

    const originalLocation = listing.location;
    const originalCountry = listing.country;

    Object.assign(listing, req.body.listing);

    if (
        req.body.listing.location !== originalLocation ||
        req.body.listing.country !== originalCountry
    ) {
        const geoData = await geocodingClient
            .forwardGeocode({
                query: `${req.body.listing.location}, ${req.body.listing.country}`,
                limit: 1,
            })
            .send();
        listing.geometry = geoData.body.features[0]?.geometry || listing.geometry;
    }

    if (req.file) {
        if (listing.image?.filename && listing.image.filename !== "listingimage") {
            await cloudinary.uploader.destroy(listing.image.filename);
        }
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (listing.image && listing.image.filename && listing.image.filename !== "listingimage") {
        await cloudinary.uploader.destroy(listing.image.filename);
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
