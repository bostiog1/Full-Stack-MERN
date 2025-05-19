import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: false }, 
  googleId: { type: String, required: false }, 
  auth0Id: { type: String, required: false, unique: true }, 
});


export default mongoose.model("User", userSchema);
