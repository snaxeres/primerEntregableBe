import { Schema, model } from "mongoose";
import { createHash } from "../utils/hashFunctions.js";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
    default: "user",
  },
});

// userSchema.pre("save", function (next) {
//   const user = this;

//   // Validate email
//   const emailRegex = /\S+@\S+\.\S+/;
//   const isValidEmail = emailRegex.test(user.email);

//   if (!isValidEmail) return next(new Error("Invalid email"));

//   next();
// });

// userSchema.pre("save", async function (next) {
//   const user = this;

//   if (!user.isModified("password")) return next();

//   // Hash the password
//   const hashedPassword = await hashPassword(user.password);
//   user.password = hashedPassword;

//   next();
// });

// Middleware de mongoose
userSchema.pre("save", function (next) {
  if (this.email.includes("@") && this.email.includes(".")) {
    return next();
  }

  next(new Error("Email inválido"));
});

userSchema.pre("save", async function (next) {
  const newPassword = await createHash(this.password);

  this.password = newPassword;

  next();
});

export const userModel = model("user", userSchema);
