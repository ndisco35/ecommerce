import mongoose from "mongoose";
import bcrypt from "bcrypt";
// Define schema for user
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // unique username
  email: { type: String, required: true, unique: true },   // unique email
  password: { type: String, required: true },  // hashed password
    isAdmin: { type: Boolean, default: false },  // for product control            
}, { timestamps: true });

// Hash password before saving user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // only hash if password is new/changed
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with stored hashed password
userSchema.methods.matchPassword = function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
export default mongoose.model("User", userSchema);

