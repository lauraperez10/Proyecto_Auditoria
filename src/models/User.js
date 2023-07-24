import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    phone: {type: String, required: false},
    otp: {type: String, required: false, default: ''},
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    firstLog: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.matchOtp = async function (otp) {
  return await bcrypt.compare(otp, this.otp);
};


export default mongoose.model("User", UserSchema);
