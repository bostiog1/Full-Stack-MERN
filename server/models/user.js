import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Added unique constraint for email
  password: { type: String, required: false }, // Make password optional
  googleId: { type: String, required: false }, // Add field for Google ID (from Auth0 user.sub if it's a Google login)
  auth0Id: { type: String, required: false, unique: true }, // Add a general field for Auth0 user ID (user.sub)
  // The 'id' field seems redundant if you use MongoDB's default _id, you can remove it.
  // id: { type: String }, // Consider removing this if _id is sufficient
});
// const userSchema = mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   password: { type: String, required: true },
//   id: { type: String },
// });

export default mongoose.model("User", userSchema);
