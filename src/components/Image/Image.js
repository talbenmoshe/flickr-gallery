import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
import Img from 'react-image';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    index: PropTypes.number,
    deleteImage: PropTypes.func,
    viewImageInLightbox: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      rotation: 0,
      imageSize: this.props.imageSize
    };
  }

  componentDidMount() {
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  delete() {
    this.props.deleteImage(this.props.index)
  }

  rotate() {
    let {rotation} = this.state;
    rotation = (rotation + 90) % 360;
    this.setState({rotation});
  }
  viewImageInLightbox(index) {
    this.props.viewImageInLightbox(index);
  }
  
  render() {
    const imageIndex = this.props.index;
    return (
      <div className="image-root" style={{
        width: '100%',
        height: '100%'
      }} >
        <Img src={this.urlFromDto(this.props.dto)}
        style={{
          transform: `rotate(${this.state.rotation}deg)`,
          width: `${this.props.imageSize}px`,
          height: '100%'
        }}
         />
        <div>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.rotate.bind(this)}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={this.delete.bind(this, imageIndex)}/>
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={this.viewImageInLightbox.bind(this, imageIndex)}/>
        </div>
      </div>
    );
  }
}

export default Image;
