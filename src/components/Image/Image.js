import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    onDelete: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      rotation: 0
    };
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

  onDelete() {
    this.props.onDelete(this.props.dto);
  }

  onRotate() {
    this.setState({
      rotation: (this.state.rotation + 90) % 360
    });
  }

  onExpand() {
    this.props.onExpand({
      title: this.props.dto.title,
      link: this.urlFromDto(this.props.dto),
      rotation: this.state.rotation
    });
  }

  render() {
    return (
      <div className="image-root">
        <img src={this.urlFromDto(this.props.dto)} width={this.state.size + 'px'} height={this.state.size + 'px'}
             style={{
               transform: `rotate(${this.state.rotation}deg)`
             }}/>
        <div>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.onRotate.bind(this)}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={this.onDelete.bind(this)}/>
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={this.onExpand.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default Image;
