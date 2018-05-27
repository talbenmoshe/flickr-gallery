import React from 'react';
import './App.scss';
import Gallery from '../Gallery';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'nature'
    };
    this.handleOnChangeOfInput = this.handleOnChangeOfInput.bind(this)
  }

  handleOnChangeOfInput(event) {
    const target = event.target
    const tag = target.value
    localStorage.setItem('tag', tag) //save the searched keyword to the browser local storage
    this.setState({tag}, () => this.setInputFocus(target, tag.length));
  }

  setInputFocus(input, position) {
    input.focus()
    input.setSelectionRange(position, position)
  }

  componentDidMount() {
    const tag = localStorage.getItem('tag') // get the previously searched keyword and add it to state if not undefined or null
    if (tag) {
      this.setState({tag})
    }
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" autoFocus onChange={this.handleOnChangeOfInput} value={this.state.tag}/>
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;
