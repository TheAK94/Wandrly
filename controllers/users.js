const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs")
};

module.exports.signup = async (req, res) => {
    try {
        let {username, email, password} = req.body;
        let newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wandrly!");
            res.redirect("/listings");
        });
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wandrly!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "Logged out successfully!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    })
};

module.exports.profile = async (req, res) => {
    let myListings = await Listing.find({owner: req.user._id});
    const bookings = await Booking.find({ listing: {$in: myListings} }).populate('listing bookedBy');
    const myOwnBookings = await Booking.find({ bookedBy: req.user._id }).populate('listing');
    res.render("users/profile.ejs", { user: req.user, myListings, bookings, myOwnBookings });
};

module.exports.cancelBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.bookedBy.toString() !== req.user._id.toString()) {
        req.flash("error", "Unauthorized or invalid booking.");
        return res.redirect('/profile');
    }

    await Booking.findByIdAndDelete(req.params.id);
    req.flash("success", "Booking cancelled.");
    res.redirect('/profile#myBookings');
};

module.exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        // Delete bookings made *by* the user
        await Booking.deleteMany({ bookedBy: userId });

        // Delete reviews written by the user
        await Review.deleteMany({ author: userId });

        // Find all listings owned by user
        const listings = await Listing.find({ owner: userId });

        for (let listing of listings) {
            // Delete bookings *for* the listing
            await Booking.deleteMany({ listing: listing._id });

            // Delete the listing — triggers post hook to remove reviews
            await Listing.findOneAndDelete({ _id: listing._id });
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        // Logout and redirect
        req.logout(() => {
            req.flash("success", "Your account and all related data have been deleted.");
            res.redirect("/listings");
        });

    } catch (err) {
        console.error("Error deleting account:", err.message);
        console.error(err.stack);
        req.flash("error", "Something went wrong while deleting your account.");
        res.redirect("/profile");
    }
};
