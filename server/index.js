const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtAuth = require('express-jwt');

const app = express();

app.use(jwtAuth({
  secret: 'secret',
  credentialsRequired: false,
}))

// Mongo Stuff
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = mongoose.Types.ObjectId

ObjectId.prototype.valueOf = function () {
	return this.toString();
};

const db = mongoose.connect('mongodb://localhost:27017/example-app')
  .then(() => { console.log("Connected to DB ")})


const bookSchema = new Schema({
  title: String,
  author: String,
})

const userSchema = new Schema({
  username: String,
  password: String,
})

const BookModel = mongoose.model('Book', bookSchema)
const UserModel = mongoose.model('User', userSchema);
// Seperate 


// GraphgQL
const typeDefs = gql`

  type Book {
    _id: String
    title: String
    author: String
  }

  type User {
    _id: String
    username: String
    token: String
  }

  type Query {
    books: [Book]
    users: [User]
  }

  type Mutation {
    addBook(title: String!, author: String!): Book
    deleteBook(_id: String!): Book
    login(username: String!, password: String!): User
    signup(username: String!, password: String!): User
  }
`;

// Map Resolvers
const resolvers = {
  Query: {
    books: async (obj, arg, context) => {
      if (!context.user) {
        return [];
      }

      return BookModel.find({})
    },
    users: async () => UserModel.find({}).select('-password'),
  },
  Mutation: {
    addBook: async (obj, arg) => {
      return BookModel.create({ title: arg.title, author: arg.author})
    },
    deleteBook: async (obj, arg) => BookModel.deleteOne({ _id: arg._id }),
    login: async (obj, arg) => {
      console.log('attempting to login');

      const user = await UserModel.findOne({ username: arg.username })
      
      if (!user) {
        throw Error('Invalid username or password');
      }

      const valid = await bcrypt.compare(arg.password, user.password);

      if (!valid) {
        throw Error('Invalid username or password');
      }

      const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
        'secret',
        { expiresIn: '1s' },
      );

      user.token = token;

      return user
    },
    signup: async (obj, arg) => {
      const userExist = await UserModel.findOne({ username: arg.username })

      if (userExist) {
        throw Error('Invalid username');
      }

      const password = await bcrypt.hash(arg.password, 10);      

      const user = await UserModel.create({
          username: arg.username,
          password,
        })
        
        
      const token = jwt.sign({
        id: user._id,
        username: user.username,
      },
      'secret',
      { expiresIn: '1d' },
      );
        
      user.token = token

      return user
    }
  }
};


// Start Server
const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    user: req.user,
  })
});

server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)