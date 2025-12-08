const express=require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app=express();
app.use(express.json());
// Routes
app.use("/api/auth", authRoutes);

app.use("/api/protected", protectedRoutes);

app.use("/api/admin", adminRoutes);

app.get("/",(req, res) =>{
    res.send("Server is running");
});

//connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() =>{
    console.log("Connected to MongoDB");
}
).catch((err) =>{
    console.error("Error connecting to MongoDB:", err);
}
);

const PORT = process.env.PORT || 5000;

app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
});