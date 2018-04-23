import React from 'react';
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

    this.handleTagInputChange = this.handleTagInputChange.bind(this);
  }

  handleTagInputChange(tags) {
    Storage.saveData('tags', tags);
    this.setState({
      tagInput: tags
    });

    clearInterval(this.searchInterval);
    this.searchInterval = setTimeout(() => {
      console.log("tags", tags);
      this.setState({
        tag: tags
      });
    }, 500);
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input"
                 onChange={event => this.handleTagInputChange(event.target.value)}
                 value={this.state.tagInput}/>
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;
