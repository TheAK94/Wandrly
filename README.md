<img src="./public/logo.png" alt="logo" width="300"/>

---

Wandrly is a full-stack web application inspired by Airbnb, built for learning and practice purposes. It allows users to browse and book listings, host properties, and manage bookings with an intuitive and responsive UI.

---

## ✨ Features

- 🔍 Browse and search rental listings
- 🧳 Book listings with availability checks
- 🧑‍💼 Host your own properties
- 💬 Leave and view reviews
- 🔐 Authentication & Authorization
- 📱 Responsive design
- 📅 Flatpickr-powered date range picker with validation
- 🧹 Account deletion with cascading data cleanup

---

## 🛠️ Tech Stack

- **Frontend:** HTML, EJS, Bootstrap 5, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Auth:** Passport.js, express-session
- **Utilities:** Cloudinary, Flatpickr, MapBox, joi, multer, dayjs

---

## 🚀 Installation

```bash
git clone https://github.com/TheAK94/Wandrly.git
cd wandrly
npm install
```

Create a .env file with following:

```bash
ATLASDB_URL=your_mongodb_atlas_url
SESSION_SECRET=some_secret
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_key
CLOUD_API_SECRET=your_secret
MAP_TOKEN=your_map_token
```

---

## 🌐 Usage

Start the development server:

```bash
npm run dev
```
Visit the app at: 
```
http://localhost:8080
```

Make sure MongoDB Atlas is running and all required .env variables are set correctly.

---

## 📁 Project Structure

```bash
Wandrly/
├─ controllers/
│  ├─ listings.js
│  ├─ reviews.js
│  └─ users.js
├─ Init/
│  ├─ data.js
│  └─ index.js
├─ models/
│  ├─ booking.js
│  ├─ listing.js
│  ├─ review.js
│  └─ user.js
├─ public/
│  ├─ css/
│  │  ├─ rating.css
│  │  └─ style.css
│  ├─ js/
│  │  ├─ booking.js
│  │  ├─ map.js
│  │  └─ script.js
│  └─ logo.png
├─ routes/
│  ├─ listing.js
│  ├─ review.js
│  └─ user.js
├─ utils/
│  ├─ ExpressError.js
│  └─ wrapAsync.js
├─ views/
│  ├─ layouts/
│  │  └─ boilerplate.ejs
│  ├─ listings/
│  │  ├─ edit.ejs
│  │  ├─ index.ejs
│  │  ├─ new.ejs
│  │  └─ show.ejs
│  ├─ partials/
│  │  ├─ flash.ejs
│  │  ├─ footer.ejs
│  │  └─ navbar.ejs
│  ├─ users/
│  │  ├─ login.ejs
│  │  ├─ profile.ejs
│  │  └─ signup.ejs
│  └─ error.ejs
├─ .env
├─ .gitignore
├─ app.js
├─ cloudConfig.js
├─ middleware.js
├─ package-lock.json
├─ package.json
├─ README.md
└─ schema.js

```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
