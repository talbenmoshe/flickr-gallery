import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome'
import Modal from 'react-modal';
import axios from 'axios';
import { reject, unionBy, findIndex, map } from 'lodash';

import config from '../../config/base';
import Image from '../Image';
import './Gallery.scss';

Modal.setAppElement('#app');

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.handleMouseScroll = this.handleMouseScroll.bind(this);
    this.handleBtnScroll = this.handleBtnScroll.bind(this);
    this.handleImageMaximized = this.handleImageMaximized.bind(this);
    this.handleImageRemoved = this.handleImageRemoved.bind(this);
    this.handleImageRotated = this.handleImageRotated.bind(this);
    this.updateGalleryWidth = this.updateGalleryWidth.bind(this);
    this.setDraggedImage = this.setDraggedImage.bind(this);
    this.getApiParams = this.getApiParams.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleModalNavigation = this.handleModalNavigation.bind(this);

    const apiParams = this.getApiParams();
    const galleryWidth = this.getGalleryWidth();

    this.state = {
      isLoadingImages: true,
      canLoadMoreImages: true,
      images: [],
      galleryWidth: galleryWidth,
      page: 1,
      draggedImage: null,
      searchInterval: null,
      scrolledToThird: false,
      apiParams: apiParams,
      isModalOpened: false,
      activeImage: null,
      error: null
    };
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    window.addEventListener('scroll', this.handleMouseScroll);
    window.addEventListener('resize', this.updateGalleryWidth);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.tag) {
      if(nextProps.tag !== this.props.tag) {

        this.setState({
          isLoadingImages: true,
          page: 1,
          images: []
        });

        localStorage.setItem('MY_LAST_SEARCH', nextProps.tag);
        this.getImages(nextProps.tag);
      }
    }
    else {

      this.setState({
        images: [],
        isLoadingImages: false,
        canLoadMoreImages: false,
        page: 1
      });
    }
  }

  getGalleryWidth() {
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  updateGalleryWidth() {
    const updatedGalleryWidth = this.getGalleryWidth();
    const { galleryWidth } = this.state;

    if(galleryWidth !== updatedGalleryWidth){
      this.setState({
        galleryWidth: updatedGalleryWidth
      });
    }
  }

  getApiParams() {
    return Object.keys(config.API_PARAMS)
      .map(param => param.toLowerCase() + '=' + config.API_PARAMS[param])
      .join('&');
  }

  getImages(tag) {
    clearInterval(this.state.searchInterval);
    const searchInterval = setTimeout(() => {
      const params = this.getApiParams();

      axios.get(`${config.API_URL}${params}&tags=${tag}&page=${this.state.page}`)
        .then(response => {
          const images = response.data['photos']['photo'];
          const canLoadMoreImages = response.data['page'] === response.data['pages'];
          const currentImages = this.state.images;
          let nextPage = this.state.page + 1;

          this.setState({
            isLoadingImages: false,
            canLoadMoreImages: canLoadMoreImages,
            images: unionBy(currentImages, images, 'id'),
            page: nextPage
          });
        })
        .catch(error => {
          this.setState({
            error: error
          });
        });
    }, 250);

    this.setState({
      searchInterval: searchInterval
    });
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  processImage(image) {
    image.style = {
      backgroundImage: `url(${this.urlFromDto(image)})`,
      transform: `rotate(${image.rotationAngle ? image.rotationAngle : 0}deg)`
    };

    return image;
  }

  setDraggedImage(imageElement) {
    this.setState({
      draggedImage: imageElement
    });
  }

  bodyHasVerticalScroll(){
    const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    const clientHeight = (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight;

    return scrollHeight > clientHeight;
  }

  handleImageRemoved(imageId) {
    const { images } = this.state;

    this.setState({
      images: reject(images, (img) => {
        return img.id === imageId;
      })
    });
  }

  handleModalNavigation(event) {
    const { leftArrow, rightArrow } = this.refs;
    const isClickFromButtons = event.target && (rightArrow.contains(event.target) || leftArrow.contains(event.target));
    const isClickFromKeyboard = event.key && (event.key === 'ArrowLeft' || event.key === 'ArrowRight');

    if(isClickFromButtons || isClickFromKeyboard) {
      const { images, activeImage } = this.state;

      let imageIndex = findIndex(images, (img) => {
        return img.id === activeImage.id;
      });

      let imageIndexToShow = event.key === 'ArrowLeft' || leftArrow.contains(event.target) ? imageIndex - 1 : imageIndex + 1;
      if(imageIndexToShow < 0) {
        imageIndexToShow = images.length - 1;
      }
      else if(imageIndexToShow === images.length) {
        imageIndexToShow = 0;
      }

      this.setState({
        activeImage: this.processImage(images[imageIndexToShow])
      });
    }
  }

  handleImageMaximized(imageId) {
    window.addEventListener('keydown', this.handleModalNavigation);
    const { images } = this.state;
    const imageIndex = findIndex(images, (entry) => {
      return entry.id === imageId;
    });

    this.setState({
      activeImage: this.processImage(images[imageIndex]),
      isModalOpened: true
    });
  }

  handleImageRotated(imageId, rotationAngle) {
    const { images } = this.state;
    const updatedImages = map(images, (entry) => {
      if(entry.id === imageId) {
        return {
          ...entry,
          rotationAngle: rotationAngle
        };
      }

      return entry;
    });

    this.setState({
      images: updatedImages
    });
  }

  handleCloseModal() {
    window.removeEventListener('keydown', this.handleModalNavigation);

    this.setState({
      isModalOpened: false,
      activeImage: null
    });
  }

  handleMouseScroll() {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    const scrolledToThird = Math.ceil(scrollTop + clientHeight) >= (scrollHeight / 3);
    const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    const { canLoadMoreImages, isLoadingImages } = this.state;

    if(scrolledToThird) {
      this.setState({
        scrolledToThird: true
      });
    }
    else {
      this.setState({
        scrolledToThird: false
      });
    }

    if (scrolledToBottom) {
      if(canLoadMoreImages && !isLoadingImages) {
        this.getImages(this.props.tag);
      }
    }
  }

  handleBtnScroll(event) {
    const scrollType = event.target.getAttribute('data-scroll') || event.target.parentElement.getAttribute('data-scroll');
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    let distance;

    if(scrollType === 'BOTTOM') {
      distance = scrollHeight;
    }
    else if(scrollType === 'TOP'){
      distance = -scrollTop;
    }
    else {
      distance = Math.ceil(scrollHeight / 2) - scrollTop;
    }

    window.scrollBy({
      top: distance,
      left: 0,
      behavior: 'smooth',
      block: 'start',
      inline: 'start'
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleMouseScroll);
    window.removeEventListener('resize', this.updateGalleryWidth);
  }

  render() {
    return (
      <div className="gallery-root"
           ref="galleryRoot">
        {this.state.images.length > 0 && this.state.scrolledToThird ?
          (<button className="btn-scroll btn-up"
                   data-scroll="TOP"
                   onClick={this.handleBtnScroll}>
            <FontAwesome name="angle-up"
                       title="scroll to top"/>
          </button>) : null }
        {this.state.images.length > 0 && this.bodyHasVerticalScroll() && !this.state.isLoadingImages ?
          (<button className="btn-scroll btn-center"
                   data-scroll="CENTER"
                   onClick={this.handleBtnScroll}>
            <FontAwesome name="ellipsis-h"
                         title="scroll to center"/>
          </button>) : null }
        {this.state.images.length > 0 && this.bodyHasVerticalScroll() && !this.state.isLoadingImages && this.state.canLoadMoreImages ?
          (<button className="btn-scroll btn-down"
                   data-scroll="BOTTOM"
                   onClick={this.handleBtnScroll}>
            <FontAwesome name="angle-down"
                         title="scroll to bottom"/>
          </button>) : null }
        {this.state.images.map(dto => {
            return <Image key={'image-' + dto.id}
                          dto={dto}
                          galleryWidth={this.state.galleryWidth}
                          draggedImage={this.state.draggedImage}
                          onImageRotated={this.handleImageRotated}
                          onImageMaximized={this.handleImageMaximized}
                          onImageRemoved={this.handleImageRemoved}
                          onImageDragged={this.setDraggedImage}/>;
          })
        }
        {this.state.activeImage ? (
          <Modal isOpen={this.state.isModalOpened}
                 contentLabel="onRequestClose Example"
                 onRequestClose={this.handleCloseModal}
                 className="modal-root"
                 overlayClassName="modal-overlay">
            <div className="modal-body">
              <div className="image-title">
                {this.state.activeImage.title}
              </div>
              <button className="btn-close-modal"
                      onClick={this.handleCloseModal}>
                <FontAwesome name="times"/>
              </button>
              <button className="btn-navigate btn-right"
                      ref="rightArrow"
                      onClick={this.handleModalNavigation}>
                <FontAwesome name="angle-right"/>
              </button>
              <button className="btn-navigate btn-left"
                      ref="leftArrow"
                      onClick={this.handleModalNavigation}>
                <FontAwesome name="angle-left"/>
              </button>
              <div className="background-holder"
                   style={this.state.activeImage.style}>
              </div>
            </div>
          </Modal>
        ) : null}
      </div>
    );
  }
}

export default Gallery;
