// @ts-nocheck
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
require('dotenv').config();

const { validateRegisterInput } = require('../../util/validators');
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
      //Valudate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      //make sure user doesnt already exist
      const user = await User.findOne({
        username,
      });
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken',
          },
        });
      }

      const userEmail = await User.findOne({
        email,
      });

      if (userEmail) {
        throw new UserInputError('Email is already taken', {
          errors: {
            username: 'This email is taken',
          },
        });
      }

      //hash password and create an auth token
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
  },
};
