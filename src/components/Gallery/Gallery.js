import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import Flicker from '../Flicker';
import './Gallery.scss';
import InfiniteScroll from 'react-infinite-scroller';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      page: 1,
      pages: 1
    };
    this.deleteImageFromGallery = this.deleteImageFromGallery.bind(this);
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag, page) {
    var that = this;
    Flicker.getImages(tag, page).then(function (response) {
      let images = [];
      if (page > 1) {
        images = that.state.images.concat(response.data.photos.photo)
      } else {
        images = response.data.photos.photo;
      }
      that.setState({images: images, pages: response.data.photos.pages});
    }).catch(function (error) {

    });
  }

  componentDidMount() {
    this.getImages(this.props.tag, 1);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
    window.addEventListener("resize", this.resize.bind(this));
  }

  deleteImageFromGallery(dto) {
    this.state.images.splice(this.state.images.indexOf(dto), 1)
    this.setState({images: this.state.images});
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag, 1);
  }

  resize(){
    this.setState({galleryWidth: this.getGalleryWidth()})
  }

  loadNewPage(page) {
    this.getImages(this.props.tag, page)
  }

  render() {
    return (
      <InfiniteScroll
        pageStart={1}
        loadMore={this.loadNewPage.bind(this)}
        hasMore={this.state.page < this.state.pages}
        loader={<div className="loader" key={1}>Loading ...</div>} >
          <div className="gallery-root">
            {this.state.images.map(dto => {
              return <Image  key={'image-' + dto.id} dto={dto} deleteAction={this.deleteImageFromGallery} galleryWidth={this.state.galleryWidth}/>;
            })}
          </div>
      </InfiniteScroll>
    );
  }
}

export default Gallery;
