const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected ✅");

    const email = "admin@campuslaunch.com";
    const password = "AdminPassword123";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists ⚠️");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: "CampusLaunch Admin",
      email,
      password: hashedPassword,
      role: "admin",
      college: "CampusLaunch",
      course: "Administration",
      year: 0,
      skills: [],
      interests: [],
    });

    console.log("Admin created successfully ✅");
    console.log("Email:", admin.email);
    console.log("Password:", password);

    process.exit(0);
  } catch (error) {
    console.error("Admin creation failed ❌");
    console.error(error.message);
    process.exit(1);
  }
};

createAdmin();