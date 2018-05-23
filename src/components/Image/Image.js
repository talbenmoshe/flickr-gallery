import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
import $ from 'jquery';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    imgIndex: PropTypes.number,
    onExpandImg: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200
    };

    window.addEventListener('resize', () => {
      this.calcImageSize();
    });

    document.addEventListener('scroll', () => {
      let bottom_of_screen = $(window).scrollTop() + $(window).height(),
        top_of_screen = $(window).scrollTop(),
        bottom_of_element = $('.image-root').eq(this.props.imgIndex).offset().top + $('.image-root').eq(this.props.imgIndex).outerHeight(),
        top_of_element = $('.image-root').eq(this.props.imgIndex).offset().top;

      if (bottom_of_screen > top_of_element && top_of_screen < bottom_of_element) { //lazyload
        $('.image-root').eq(this.props.imgIndex).css('background-image', 'url(' + this.urlFromDto(this.props.dto) + ')');
      }
    });
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

  rotateImg = () => {
    document.getElementsByClassName('image-root')[this.props.imgIndex].classList.add('rotateImg');
  }

  deleteImg = () => { // need authentication for delete api
    fetch('https://api.flickr.com/services/rest/?method=flickr.photos.delete&api_key=2d0066a0ae538617011e54ba902fd4c7&photo_id =' + this.props.dto.id, {
      method: 'POST'
    });
  }

  expandImg = () => {
    if (typeof this.props.onExpandImg === 'function') {
      this.props.onExpandImg(this.props.dto);
    }
  }

  render() {
    return (
      <div className="image-root"
           style={{
             width: this.state.size + 'px',
             height: this.state.size + 'px'
           }}>
        <div>
          <FontAwesome onClick={this.rotateImg} className="image-icon" name="sync-alt" title="rotate"/>
          <FontAwesome onClick={this.deleteImg} className="image-icon" name="trash-alt" title="delete"/>
          <FontAwesome onClick={this.expandImg} className="image-icon" name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;
