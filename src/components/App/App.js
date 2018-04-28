import React from 'react';
import {randomWords} from '../../common/RandomWords';

import './App.scss';
import Gallery from '../Gallery';
import Storage from '../Storage';

class App extends React.Component {
  static propTypes = {};

  constructor() {
    super();

    this.state = {
      tagInput: Storage.getData('tags') || 'art',
      tag: Storage.getData('tags') || 'art'
    };

    this.tryLuck = this.tryLuck.bind(this);
    this.handleTagInputChange = this.handleTagInputChange.bind(this);
  }

  handleTagInputChange(tags) {
    Storage.saveData('tags', tags);
    this.setState({
      tagInput: tags
    });

    clearInterval(this.searchInterval);
    this.searchInterval = setTimeout(() => {
      this.setState({
        tag: tags
      });
    }, 500);
  }

  tryLuck() {
    this.handleTagInputChange(randomWords());
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input"
                 onChange={event => this.handleTagInputChange(event.target.value)}
                 value={this.state.tagInput}/>
          <button className="btn-try-luck"
                  onClick={this.tryLuck}>
            Try my luck!
          </button>
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;
