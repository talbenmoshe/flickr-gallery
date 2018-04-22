import React from 'react';
import './App.scss';
import Gallery from '../Gallery';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();

    let last_search = localStorage.getItem('last_search');
    this.state = {
      tag: last_search || ''
    };
  }

  tagChange(event) {
    let tag = event.target.value;
    this.setState({tag: tag});
    localStorage.setItem('last_search', tag);
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" onChange={this.tagChange.bind(this)} value={this.state.tag}/>
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;
