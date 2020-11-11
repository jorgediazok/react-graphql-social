const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');
require('dotenv').config();

const Post = require('./models/Post');
const User = require('./models/User');

//Graphql
// @ts-ignore
const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }

  type Query {
    getPosts: [Post]
  }
`;

const resolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//Connection to DB
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((db) => console.log('DB is connected!!'))
  .catch((err) => console.log(err));

//Server

server.listen({ port: 5000 }).then((res) => {
  console.log(`Server running at ${res.url}`);
});
