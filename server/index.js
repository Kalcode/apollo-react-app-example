const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

// Convert ObjectID to string
ObjectId.prototype.valueOf = function () {
	return this.toString();
};

mongoose.connect('mongodb://localhost:27017/example-app');

var bookSchema = new mongoose.Schema({
  title: String,
  author: String,
})

const BookModel = mongoose.model('Book', bookSchema);

const typeDefs = gql`

  type Book {
    _id: String,
    title: String
    author: String
  }
  
  type Mutation {
    addBook(title: String!, author: String!): Book
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: async () =>  BookModel.find({}),
  },
  Mutation: {
    addBook: async (obj, arg) => BookModel.create({
      title: arg.title,
      author: arg.author,
    })
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});