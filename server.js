const express=require("express");
const cors = require("cors")
const { OAuth2Client } = require("google-auth-library");
const connectDB = require("./config/database");

const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config();
connectDB();

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const adminRoutes = require("./routes/adminRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes =require("./routes/likeRoutes");
const searchRoutes = require("./routes/searchRoutes");

const path = require("path");
const app=express();
app.use(cors());

// app.post("/auth/google", async (req, res) => {
//     try {
//         const { token } = req.body;

//         // Verify ID Token with Google
//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: "YOUR_GOOGLE_CLIENT_ID"
//         });

//         const payload = ticket.getPayload();

//         // User info from Google
//         const user = {
//             name: payload.name,
//             email: payload.email,
//             picture: payload.picture,
//             googleId: payload.sub
//         };

//         // TODO: check database, create user if needed

//         res.json({
//             status: "success",
//             user
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(401).json({ error: "Invalid Google token" });
//     }
// });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/protected", protectedRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/likes", require("./routes/likeRoutes"));

app.use("/api/search",searchRoutes);

app.get("/",(req, res) =>{
    res.send("Server is running");
});



// const token = localStorage.getItem("token");

// const res = await fetch("/api/admin/dashboard", {
//     headers: { "Authorization": `Bearer ${token}` }
// });



const PORT = process.env.PORT || 5000;

app.listen(PORT,() =>{
    console.log(`Server is running on port`, 'http://localhost:5000');
});