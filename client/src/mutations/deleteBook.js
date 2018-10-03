import gql from 'graphql-tag';

export const DELETE_BOOK_MUTATION = gql`
  mutation deleteBook($id: String!) {
    deleteBook(_id: $id) {
      _id
      author
      title
    }
  }
`