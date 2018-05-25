import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
import Img from 'react-image'
import {urlFromDto} from './utils'


class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    onDelete: PropTypes.func,
    onExpand: PropTypes.func,
    index: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      rotationValue: 0
    }
    this.deleteImage = this.deleteImage.bind(this)
    this.rotateImage = this.rotateImage.bind(this)
    this.expandImage = this.expandImage.bind(this)
  }

  deleteImage(e) {
    // send the clicked image index to Gallary to be deleted
    e.preventDefault()
    this.props.onDelete(this.props.index)
  }

  expandImage(e) {
    // send the clicked image index to Gallary to be showed in a modal
    e.preventDefault()
    this.props.onExpand(this.props.index)
  }

  rotateImage(e) {
    // rotate the image
    e.preventDefault()
    this.setState({rotationValue: this.state.rotationValue + 90})
  }

  render() {
    return (
      <div
        className="image-root"
        style={{
          width: '100%',
          height: '100%'
        }}
        >
          <Img src={urlFromDto(this.props.dto)} width='100%' height='100%'
            style={{
              transform: `rotate(${this.state.rotationValue}deg)`
            }}
            />
        <div>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onMouseDown={this.rotateImage} />
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onMouseDown={this.deleteImage}/>
          <FontAwesome className="image-icon" name="expand" title="expand" onMouseDown={this.expandImage} />
        </div>
      </div>
    );
  }
}

export default Image;
