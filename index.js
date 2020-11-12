const { ApolloServer } = require('apollo-server');
require('dotenv').config();

const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
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
