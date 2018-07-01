import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import Flicker from '../Flicker';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth()
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

  getImages(tag) {
    var that = this;
    Flicker.getImages(tag).then(function (response) {
      that.setState({images: response.data.photos.photo});
    }).catch(function (error) {

    });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
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
    this.getImages(props.tag);
  }

  resize(){
    this.setState({galleryWidth: this.getGalleryWidth()})
  }

  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map(dto => {
          return <Image  key={'image-' + dto.id} dto={dto} deleteAction={this.deleteImageFromGallery} galleryWidth={this.state.galleryWidth}/>;
        })}
      </div>
    );
  }
}

export default Gallery;
