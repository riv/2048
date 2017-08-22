import React, { Component } from 'react';
import Board from './board';
import Mousetrap from 'mousetrap';
import './App.css';

class App extends Component {
  constructor (props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.bindKeys = this.bindKeys.bind(this);
    this.bindKeys();
    this.board = new Board()
    this.state = {
      boardState: this.board.getState()
    }
  }

  bindKeys() {
    Mousetrap.bind('up', this.handleKeyPress('up'));
    Mousetrap.bind('down', this.handleKeyPress('down'));
    Mousetrap.bind('left', this.handleKeyPress('left'));
    Mousetrap.bind('right', this.handleKeyPress('right'));
  }

  handleKeyPress (key) {
    return () => {
      this.board.move(key);
      this.setState({boardState: this.board.getState()});
    };
  }

  renderCell(cell,idx) {
    return(
      <div className={`grid-cell ${cell === null ? "grid-empty-cell" : ""}`} key={idx}>
        <p>{cell}</p>
      </div>
    );
  }

  renderRow(row,idx) {
    return(
      <div className="grid-row" key={idx}>
        {row.map((cell,idx) => this.renderCell(cell,idx))}
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <h2>2048</h2>
        <div className="grid-container">
          { this.state.boardState.map((row,idx) => this.renderRow(row,idx)) }
        </div>
      </div>
    );
  }
}

export default App;
