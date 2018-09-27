import React, { Component } from 'react'
import { Query } from 'react-apollo';

import { BOOKS_QUERY } from './queries/Books'

export default class BookShower extends Component {

  render() {
    return (
      <div>
        <h2>
          Book shower working
        </h2>
        <Query
          query={BOOKS_QUERY}
        >
        {
          ({loading, data, error}) => {
            console.log(data)
            if (!loading) {
              return (
                <ul>
                  {data.books.map(book => <li>{book.title}</li>)}
                </ul>
              )
            }

            return (<div>Loading</div>)
          }
        }
        </Query>
      </div>
    )
  }
}