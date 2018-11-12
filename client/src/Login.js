import React, { Component } from 'react';
import { LOGIN_MUTATION } from './mutations/Login'

import { Mutation } from 'react-apollo';

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    loggedIn: false,
    user: '',
  }

  constructor() {
    super();

    const loggedIn = localStorage.getItem('token');
    const user = localStorage.getItem('username');

    this.state = {
      ...this.state,
      user,
      loggedIn,
    }
  }

  storeData(data) {
    if (!data) {
      return
    }
    
    const { login } = data
    
    localStorage.setItem('token', login.token);
    localStorage.setItem('expires', login.exp);
    localStorage.setItem('username', login.username);

    this.setState({
      user: login.username,
      loggedIn: true,
    })
  }

  // arrow function scoping binding 
  // instead of .bind(this)
  onSubmit = (event, mutate) => {
    event.preventDefault();

    const { username, password } = this.state
    
    mutate({
      variables: {
        username,
        password
      }
    })
  }

  render() {
    const { loggedIn, user } = this.state
    return (
      <div>
        {
          loggedIn && <div>Welcome { user }</div>
        }
        { !loggedIn &&
          <Mutation
            mutation={LOGIN_MUTATION}
          >
            {
              (mutate, { data, loading }) => {
    
              this.storeData(data);
    
                return (
                  <div
                  style={{
                    margin: '20px 0',
                    maxWidth: 200,
                  }}
                  >
                    <h5>Login</h5>
                    <form 
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                      onSubmit={(event) => this.onSubmit(event, mutate)}
                    >
                      <input 
                        onChange={({ target }) => { this.setState({ username: target.value }) }}
                        name="username"
                        type='text'
                        value={this.state.username}
                      />
                      <input 
                        onChange={({ target }) => { this.setState({ password: target.value }) }}
                        name="password"
                        type='text'
                        value={this.state.password}
                      />
                      <input 
                        type='submit'
                        value='Login'
                      />
                    </form>
                  </div>
                )
              }
            }
          </Mutation>
        }
      </div>
    )
  }
}
