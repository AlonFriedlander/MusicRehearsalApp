import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  instrument: {
    type: String,
    required: function () {
      return this.role === 'user'; // Required only if the role is 'user'
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

userSchema.index({ username: 1 }); // Index for faster queries

const User = mongoose.model('User', userSchema);

export default User;
