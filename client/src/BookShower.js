import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo';

import { BOOKS_QUERY } from './queries/Books'
import { ADD_BOOK_MUTATION } from './mutations/addBook'

export default class BookShower extends Component {
  state = {
    author: '',
    title: '',
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
                <ul style={{ textAlign: 'left' }}>
                  {data.books.map(book => (
                    <li>
                      <strong>{book.title}</strong><br />
                      by {book.author}
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
              <div style={{ textAlign: 'left', maxWidth: 300, marginLeft: 40 }}>
                <form 
                  style={{ display: 'flex', flexDirection: 'column' }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    addBook({
                      variables: {...this.state},
                      refetchQueries: [
                        { query: BOOKS_QUERY },
                      ],
                    });
                    this.setState({ title: '', author: '' });
                  }}  
                >
                  <input 
                    placeholder="Title"
                    type='text'
                    onChange={({ target }) => this.setState({ title: target.value })}
                    value={this.state.title}
                  />
                  <input
                    placeholder="Author"
                    type='text'
                    onChange={({ target }) => this.setState({ author: target.value })}
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