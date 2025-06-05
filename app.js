//configured dotenv to access enviroment variables
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const chapterRoutes = require("./routes/chapter.routes");
const rateLimiter = require("./middleware/rateLimiter.middleware");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//connection to MongoDB
connectDB();

app.get("/api/v1", (req, res) => {
  res.send("API running! Do visit the github repo for other endpoints");
});

//authentication routes. signup and login for users. Login for Admin (Manualy added to DB)
app.use("/api/v1/auth", authRoutes);

//chapter routes - with rate limiting 30 requests per IP per minute
app.use("/api/v1/chapters", rateLimiter(), chapterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
