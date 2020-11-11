// @ts-nocheck
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../../models/User');

module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      args,
      context,
      info
    ) {
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const result = await newUser.save();

      const token = jwt.sign(
        {
          id: result.id,
          email: result.email,
          username: result.username,
        },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
      );
      return {
        ...result._doc,
        id: result._id,
        token,
      };
    },
    //validate user data
    //make sure user doesnt already exist
    //hash password and create an auth token
  },
};
