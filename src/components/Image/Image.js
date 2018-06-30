import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      rotation: 0
    };
    this.rotateImage = this.rotateImage.bind(this);
/*    this.deleteImage = this.deleteImage.bind(this);*/
    this.expandImage = this.expandImage.bind(this);
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  rotateImage() {
    let rotationAngle = (this.state.rotation + 90) % 360;
    this.setState({rotation: (rotationAngle)});
  }

  deleteImage() {
    console.log(this);
  }

  expandImage() {
    console.log(this);
  }

  render() {
    return (
      <div
        className="image-root"
        style={{
          width: this.state.size + 'px',
          height: this.state.size + 'px',
        }}
        >
        <span
          className='img-container'
          style ={{
            backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
            transform: 'rotate(' + this.state.rotation + 'deg)'
          }}
        />
        <div>
          <FontAwesome className="image-icon" onClick={this.rotateImage} name="sync-alt" title="rotate"/>
          <FontAwesome className="image-icon" onClick={this.deleteImage}name="trash-alt" title="delete"/>
          <FontAwesome className="image-icon" onClick={this.expandImage} name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;
