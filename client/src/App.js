import ApolloClient from "apollo-boost";
import React, { Component } from 'react';
import { ApolloProvider } from "react-apollo";

import './App.css';
import BookShower from './BookShower';

const client = new ApolloClient({
  uri: "http://localhost:4000/"
});

// query the client directly
// client.query({
//   query: BOOKS_QUERY
// }).then(data => {
//   console.log(data)
// })

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <BookShower></BookShower>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
