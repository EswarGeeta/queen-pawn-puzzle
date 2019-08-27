import React, { Component } from 'react';
import './App.css';
import Board from './components/board/board';

class App extends Component {
  render() {
    return (
      <div className="puzzle">
        <Board />
      </div>
    );
  }
}

export default App;
