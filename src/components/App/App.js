import React from 'react';
import './App.scss';
import Gallery from '../Gallery';

class App extends React.Component {
  static propTypes = {};

  constructor() {
    super();

    if (localStorage.getItem('lastSearch') !== null) {
      this.state = {
        tag: localStorage.getItem('lastSearch')
      };
    } else {
      this.state = {
        tag: 'art'
      };
    }
  }

  onChangeHandler = (event) => {
    this.setState({tag: event.target.value});
    localStorage.setItem('lastSearch', event.target.value);
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" onChange={this.onChangeHandler}
                 value={this.state.tag}/>
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;
