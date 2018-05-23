import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import $ from 'jquery';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      bigImgPath: null,
      isImgExpanded: false,
      galleryWidth: this.getGalleryWidth(),
      currentPage: 0,
      isLoadMore: false
    };

    window.addEventListener('resize', () => {
      this.setState({
        galleryWidth: document.body.clientWidth
      });
    });

    document.addEventListener('scroll', () => {
      this.setState({
        isLoadMore: true
      });
      if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
        this.setState({
          currentPage: this.state.currentPage + 1
        });
        this.getImages(props.tag, this.state.currentPage);
      }
    });

  }

  getGalleryWidth() {
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag) {
    let page = this.state.currentPage;

    fetch('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=2d0066a0ae538617011e54ba902fd4c7&format=json&&nojsoncallback=true&&tags=' + tag + '&page=' + page, {
      method: 'GET'
    }).then(res => res.json())
      .then(res => {
        if (res.photos) {
          if (!this.state.isLoadMore) {
            this.setState({images: res.photos.photo});
          } else {
            this.setState({images: this.state.images.concat(res.photos.photo)});
          }
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillReceiveProps(props) {
    this.setState({
      isLoadMore: false,
      currentPage: 0
    });
    this.getImages(props.tag);
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  expandImg = (dto) => {
    this.setState({
      isImgExpanded: true,
      bigImgPath: this.urlFromDto(dto)
    });
  }

  hideBigImg = () => {
    this.setState({
      isImgExpanded: false
    });
  }

  render() {
    return (
      <div className="gallery-root">
        {this.state.isImgExpanded ?
          <div className="big-img"><span className="close" onClick={this.hideBigImg}> close</span> <img
            src={this.state.bigImgPath}/></div> : null}

        {this.state.images.map((dto, index) => {
          return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth}
                        onExpandImg={this.expandImg} imgIndex={index}/>
        })}
      </div>
    );
  }
}

export default Gallery;
