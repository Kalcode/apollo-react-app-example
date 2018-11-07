const { ApolloServer, gql } = require('apollo-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    login(username: String!, password: String!): User
    users: [User]
  }

  type Mutation {
    addBook(title: String!, author: String!): Book
    deleteBook(_id: String!): Book
    signup(username: String!, password: String!): User
  }
`;

// Map Resolvers
const resolvers = {
  Query: {
    books: async () => BookModel.find({}),
    login: async (obj, arg) => {
      const user = await UserModel.findOne({ username: arg.username })
      
      if (!user) {
        throw Error('Invalid username or password');
      }

      const valid = await bcrypt.compare(arg.password, user.password);

      if (!valid) {
        throw Error('Invalid username or password');
      }

      const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        id: user._id,
        username: user.username,
      }, 'secret');

      user.token = token;

      return user
    },
    users: async () => UserModel.find({}).select('-password'),
  },
  Mutation: {
    addBook: async (obj, arg) => {
      return BookModel.create({ title: arg.title, author: arg.author})
    },
    deleteBook: async (obj, arg) => BookModel.deleteOne({ _id: arg._id }),
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
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        id: user._id,
        username: user.username,
      }, 'secret');
        
      user.token = token

      return user
    }
  }
};


// Start Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});