import React from 'react';
import './App.scss';
import Gallery from '../Gallery';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    let lastTagSearch = localStorage.getItem('lastTagSearch');

    this.state = {
      tag: lastTagSearch || 'art'
    };
    this.onTagChange = this.onTagChange.bind(this)
  }

  onTagChange(event) {
    let tag = event.target.value;
    this.setState({tag: tag});
    localStorage.setItem('lastTagSearch', tag);
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" onChange={this.onTagChange} value={this.state.tag}/>
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;
