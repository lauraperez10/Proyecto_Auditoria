import User from "../models/User.js";

export const createAdminUser = async () => {
  const userFound = await User.findOne({ email: "admin@gmail.com" });

  if (userFound) return;

  const newUser = new User({
    username: "admin",
    email: "admin@gmail.com",
    phone: "3168611855"
  });

  newUser.password = await newUser.encryptPassword("adminpassword");

  const admin = await newUser.save();

  console.log("Admin user created", admin);
};
