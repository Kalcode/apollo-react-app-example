const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId;

// Convert ObjectID to string
ObjectId.prototype.valueOf = function () {
	return this.toString();
};

mongoose.connect('mongodb://localhost:27017/example-app-2');

var bookSchema = new Schema({
  title: String,
  author: { type: Schema.Types.ObjectId, ref: 'Author' },
})

var authorSchema = new Schema({
  name: String,
  books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
})

const BookModel = mongoose.model('Book', bookSchema);
const AuthorModel = mongoose.model('Author', authorSchema);

const typeDefs = gql`

  type Book {
    _id: String,
    title: String
    author: Author
  }

  type Author {
    _id: String
    name: String
    books: [Book]
  }
  
  type Mutation {
    addBook(title: String!, author: String!): Book
  }

  type Query {
    books: [Book]
    authors: [Author]
  }
`;

const resolvers = {
  Author: {
    books: async (obj) => BookModel.find({ author: obj._id }),
  },
  Book: {
    author: async (obj) => AuthorModel.findById(obj.author)
  },
  Query: {
    authors: async () =>  AuthorModel.find({}),
    books: async () =>  BookModel.find({}),
  },
  Mutation: {
    addBook: async (obj, arg) => {
      let author = await AuthorModel.findOne({ name: arg.author })
      
      if (!author) {
        author = await AuthorModel.create({ name: arg.author })
      }

      const book = await BookModel.create({
        title: arg.title,
        author: author._id,
      })

      author.books.push(book);
      return author.save();
    }
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