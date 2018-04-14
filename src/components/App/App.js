import React from 'react';
import './App.scss';
import Gallery from '../Gallery';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    const myLastSearch = localStorage.getItem('MY_LAST_SEARCH');
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      tag: myLastSearch || 'art',
      isModalOpen: false
    };
  }

  handleInputChange(event) {
    const tag = event.target.value;

    this.setState({
      tag: tag
    });
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>
            Flickr Gallery
          </h2>
          <input className="app-input"
                 placeholder="enter tags here"
                 onChange={this.handleInputChange}
                 value={this.state.tag}/>
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;
