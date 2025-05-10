import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signUp = async (req, res) => {
  const { email, password, firstName, lastName, confirmPassword } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords don't match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// --- New controller for handling Auth0 login data ---
export const auth0SignIn = async (req, res) => {
  // We expect to receive the user data from the frontend after Auth0 successful authentication
  // The Auth0 'user' object contains info like sub, email, name, picture
  const { sub, email, name, picture } = req.body; // 'sub' is the unique Auth0 user ID

  try {
    // 1. Try to find the user in your database using the email or auth0Id
    const existingUser = await User.findOne({
      $or: [{ email }, { auth0Id: sub }],
    });

    let result;

    if (existingUser) {
      // 2. If user exists, maybe update their name/picture if necessary
      // You might also link a traditional account if they log in via Auth0 with the same email
      // but don't have auth0Id set yet.
      if (!existingUser.auth0Id) {
        // Link existing traditional account to this Auth0 ID if email matches
        existingUser.auth0Id = sub;
        await existingUser.save();
      }
      result = existingUser;
    } else {
      // 3. If user does not exist, create a new user record
      result = await User.create({
        email,
        name, // Use the name from Auth0
        auth0Id: sub, // Store the Auth0 user ID
        picture, // Store the picture URL if available
        // No password field set for Auth0-only users
      });
    }

    // 4. Generate your application's standard JWT for this user
    // Use the user's _id from your database
    const token = jwt.sign(
      { email: result.email, id: result._id },
      "test", // Use your actual secret (should be an environment variable)
      { expiresIn: "1h" }
    );

    // 5. Return the user data (from your DB) and the generated token to the frontend
    res.status(200).json({ result, token });
  } catch (error) {
    console.error("Backend Auth0 sign-in error:", error); // Log the actual error
    res
      .status(500)
      .json({
        message: "Something went wrong during Auth0 sign-in on backend.",
      });
  }
};
