import gql from 'graphql-tag';

export const ADD_BOOK_MUTATION = gql`
  mutation addBook($title: String!, $author: String!) {
    addBook(title: $title, author: $author) {
      _id
      title
      author
    }
  }
`