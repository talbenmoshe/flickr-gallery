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
      tag: last_search || 'art'
    };
  }

  handleChange(event) {
    let target = event.target;
    let tag = target.value;

    localStorage.setItem('last_search', tag);
    this.setState({tag: tag}, () => App.setCaretPosition(target, tag.length));
  }

  // Credits: http://blog.vishalon.net/index.php/javascript-getting-and-setting-caret-position-in-textarea/
  static setCaretPosition(ctrl, pos) {
    // Modern browsers
    if (ctrl.setSelectionRange) {
      ctrl.focus();
      ctrl.setSelectionRange(pos, pos);
    // IE8 and below
    } else if (ctrl.createTextRange) {
      let range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" onChange={::this.handleChange} value={this.state.tag}/>
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;
