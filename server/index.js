const { ApolloServer, gql } = require('apollo-server');

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

const BookModel = mongoose.model('Book', bookSchema)
// Seperate 


// GraphgQL
const typeDefs = gql`

  type Book {
    _id: String
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }

  type Mutation {
    addBook(title: String!, author: String!): Book
    deleteBook(_id: String!): Book
  }
`;

// Map Resolvers
const resolvers = {
  Query: {
    books: async () => BookModel.find({}),
  },
  Mutation: {
    // addBook: async (obj, arg, context) => {
    //   const book = new BookModel({ title: arg.title, author: arg.author })
    //   return book.save();
    // }
    addBook: async (obj, arg) => BookModel.create({ title: arg.title, author: arg.author}),
    deleteBook: async (obj, arg) => BookModel.deleteOne({ _id: arg._id })
  }
};


// Start Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});