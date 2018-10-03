import gql from 'graphql-tag';

export const BOOKS_QUERY = gql`
  {
    books {
      _id
      author
      title
    }
  }
`