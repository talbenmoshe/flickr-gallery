import React from 'react';
import './App.scss';
import Gallery from '../Gallery';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    let tag = 'art';
    let lastSearch = localStorage.getItem('lastSearch');
    if (lastSearch && lastSearch != '') {
      tag = lastSearch;
    }
    this.state = {
      tag: tag
    };
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" onChange={event => this.setState({tag: event.target.value})} value={this.state.tag}/>
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;
