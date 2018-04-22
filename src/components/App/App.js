import React from 'react';
import './App.scss';
import Gallery from '../Gallery';

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();

    let last_search = localStorage.getItem('last_search');
    this.state = {
      value: last_search || '',
      tag: last_search || ''
    };
    this.timer = null;
  }

  handleChange(event) {
    clearTimeout(this.timer);
    this.setState({ value: event.target.value });
    this.timer = setTimeout(::this.triggerChange, WAIT_INTERVAL);
  }

  handleKeyDown(e) {
    if (e.keyCode === ENTER_KEY) {
      ::this.triggerChange();
    }
  }

  triggerChange() {
    let tag = this.state.value;
    localStorage.setItem('last_search', tag);
    this.setState({tag: tag});
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" onChange={::this.handleChange} onKeyDown={::this.handleKeyDown} value={this.state.value}/>
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;
