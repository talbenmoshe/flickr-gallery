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
    this.handleRotateBtnClick = this.handleRotateBtnClick.bind(this);
    this.state = {
      size: 200,
      rotation: props.dto.rotation
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

  handleRotateBtnClick() {
    const rotationAngle = (this.state.rotation + 90) % 360;
    this.props.dto.rotation = rotationAngle;
    this.setState({
      rotation: rotationAngle
    })
  }

  componentDidMount() {
    this.calcImageSize();
  }

  componentWillReceiveProps(nextProps) {
    const {galleryWidth} = this.props;

    if (nextProps.galleryWidth != galleryWidth) {
      this.calcImageSize();
    }
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  render() {
    return (
      <div className="image-root"
           style={{
             width: this.state.size + 'px',
             height: '200px'
           }}>
        <div className="image-holder"
             style={{
               backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
               transform: `rotate(${this.state.rotation}deg)`
             }}></div>
        <div>
          <FontAwesome className="image-icon"
                       name="sync-alt"
                       onClick={this.handleRotateBtnClick}
                       title="rotate"/>
          <FontAwesome className="image-icon"
                       name="trash-alt"
                       onClick={() => this.props.onImageRemoved(this.props.dto.id)}
                       title="delete"/>
          <FontAwesome className="image-icon"
                       name="expand"
                       onClick={() => this.props.onImageExpand(this.props.dto.id)}
                       title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;
