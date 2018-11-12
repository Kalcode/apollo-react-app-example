import ApolloClient from "apollo-boost";
import React, { Component } from 'react';
import { ApolloProvider } from "react-apollo";

import './App.css';
import BookShower from './BookShower';
import Login from './Login';

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});
``

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Login /> 
          <BookShower></BookShower>
        </div>
      </ApolloProvider>
    );
  }
}



export default App;
