import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo';

import { BOOKS_QUERY } from './queries/Books'
import { ADD_BOOK_MUTATION } from './mutations/addBook';
import { DELETE_BOOK_MUTATION } from './mutations/deleteBook';

export default class BookShower extends Component {

  state = {
    title: '',
    author: '',
  }
  
  onSubmit = (event, mutation) => {
    event.preventDefault();

    mutation({
      variables: {
        ...this.state,
      },
      refetchQueries: [
        { query: BOOKS_QUERY },
      ]
    })

    this.setState({
      title: '',
      author: '',
    })

  }

  deleteBook = (book, mutation) => {
    mutation({
      variables: {
        id: book._id,
      },
      refetchQueries: [
        { query: BOOKS_QUERY },
      ]
    })
  }

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
                  {data.books.map(book => (
                    <li>
                      <strong>{book.title}</strong><br />
                      by {book.author}
                      <Mutation
                        mutation={DELETE_BOOK_MUTATION}
                      >
                      {
                        (deleteBook) => {
                          return (
                            <button
                              onClick={() => this.deleteBook(book, deleteBook)}
                            >
                              X
                            </button>
                          )
                        }
                      }
                      </Mutation>
                    </li>
                  ))}
                </ul>
              )
            }

            return (<div>Loading</div>)
          }
        }
        </Query>
        <Mutation
          mutation={ADD_BOOK_MUTATION}
        >
        {
          (addBook, { data }) => {
            return (
              <div>
                Submit a Book
                <form
                  onSubmit={(event) => { this.onSubmit(event, addBook) }}
                  style={{ display: 'flex', flexDirection: 'column', maxWidth: 300 }}>
                  <input
                    placeholder='title'
                    onChange={({ target }) => { this.setState({ title: target.value })}}
                    type='text'
                    value={this.state.title}
                  />
                  <input
                    placeholder='author'
                    onChange={({ target }) => { this.setState({ author: target.value })}}
                    type='text'
                    value={this.state.author}
                  />
                  <input type='submit' value='Submit' />
                </form>
              </div>
            )
          }
        }
        </Mutation>
      </div>
    )
  }
}