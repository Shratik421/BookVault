import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
});

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcryptjs.genSalt(10);
    const password = await bcryptjs.hash(this.password, salt);
    this.password = password;
    next();
  } catch (error) {
    console.log(error);
  }
});

UserSchema.methods.comparePassword = async function(password) {
  try {
    return await bcryptjs.compare(password, this.password);
  } catch (error) {
    console.log("errror in comparePassword", error);
  }
};

const User = mongoose.model("User", UserSchema);
export default User;
