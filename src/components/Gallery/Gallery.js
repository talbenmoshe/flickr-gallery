import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import FontAwesome from 'react-fontawesome';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import Image from '../Image';
import './Gallery.scss';
import {getImages} from '../APIS';

const PER_PAGE = 100;

const SortableItem = SortableElement(({value, handleImageRemoved, handleImageExpand, galleryWidth}) =>
  <li className="SortableItem">
    <Image key={'image-' + value.id}
           dto={value}
           onImageRemoved={handleImageRemoved}
           onImageExpand={handleImageExpand}
           galleryWidth={galleryWidth}/>
  </li>
);

const SortableList = SortableContainer(({items, handleImageRemoved, handleImageExpand, galleryWidth}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`}
                      index={index}
                      galleryWidth={galleryWidth}
                      handleImageExpand={handleImageExpand}
                      handleImageRemoved={handleImageRemoved}
                      elementHeight={40}
                      value={value}/>
      ))}
    </ul>
  );
});

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      isGalleryModalOpen: false,
      photoIndex: 0,
      isLoading: false
    };

    this.handleImageRemoved = this.handleImageRemoved.bind(this);
    this.handleImageExpand = this.handleImageExpand.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  getGalleryWidth() {
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag, forceReset) {
    this.setState({
      isLoading: true
    });

    const currentPage = forceReset ? 1 : (this.state.images.length / PER_PAGE) + 1;

    if (forceReset) {
      this.setState({
        images: []
      })
    }

    getImages(tag, currentPage, PER_PAGE)
      .then((res) => {

        const totalImages = this.state.images.concat(res.images);

        this.setState({
          images: totalImages,
          isLoading: false
        });

      });
  }

  componentDidMount() {
    this.getImages(this.props.tag, true);

    this.setState({
      galleryWidth: document.body.clientWidth
    });

    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onScroll);
  }

  componentWillReceiveProps(nextProps) {
    const {tag} = this.props;
    if (nextProps.tag != tag) {
      this.getImages(nextProps.tag, true);
    }
  }

  onResize() {
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  getVisibleItems() {

  }

  onScroll() {
    const {images, isLoading} = this.state;

    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 1000) && images.length && !isLoading) {
      this.getImages(this.props.tag, false);
    }
  }

  handleImageRemoved(id) {
    const {images} = this.state;

    this.setState({
      images: images.filter(image => image.id != id)
    });
  }

  handleImageExpand(id) {
    const {images} = this.state;
    const imageIndex = images.findIndex(image => {
      return image.id == id;
    });
    this.setState({
      photoIndex: imageIndex,
      isGalleryModalOpen: true
    })
  }

  onSortEnd({oldIndex, newIndex}) {
    this.setState({
      images: arrayMove(this.state.images, oldIndex, newIndex),
    })
  }

  render() {
    const {photoIndex, isGalleryModalOpen, isLoading} = this.state;

    const imagesSrc = this.state.images.map(dto => dto.url);

    return (
      <div className="gallery-root">
        {this.state.images && this.state.images.length && (
          <SortableList items={this.state.images}
                        galleryWidth={this.state.galleryWidth}
                        handleImageExpand={this.handleImageExpand}
                        axis='xy'
                        handleImageRemoved={this.handleImageRemoved}
                        onSortEnd={this.onSortEnd}/>
        )}
        {isLoading && (
          <div className="is-loading">
            <FontAwesome name="spinner spin"
                         spin
                         title="loading"/>
          </div>
        )}
        {isGalleryModalOpen && (
          <Lightbox
            mainSrc={imagesSrc[photoIndex]}
            nextSrc={imagesSrc[(photoIndex + 1) % imagesSrc.length]}
            prevSrc={imagesSrc[(photoIndex + imagesSrc.length - 1) % imagesSrc.length]}
            onCloseRequest={() => this.setState({isGalleryModalOpen: false})}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + imagesSrc.length - 1) % imagesSrc.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % imagesSrc.length,
              })
            }
          />
        )}
      </div>
    );
  }
}

export default Gallery;
