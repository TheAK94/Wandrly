const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing, imageUpload, validateBooking } = require("../middleware.js");


const listingController = require("../controllers/listings.js");


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, imageUpload, validateListing, wrapAsync(listingController.createListing));

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, imageUpload, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

router.route("/:id/book")
    .post(isLoggedIn, validateBooking, wrapAsync(listingController.newBooking));


module.exports = router;
