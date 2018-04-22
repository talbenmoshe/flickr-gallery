import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import './Gallery.scss';
import flicker from '../../flicker'
import Modal from 'react-modal';
import Measure from 'react-measure';
import InfiniteScroll from 'react-infinite-scroller';

Modal.setAppElement('#app');

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.queue = {};
    this.state = {
      images: [],
      imageSize: 200,
      modalIsOpen: false,
      modalTitle: '',
      modalImage: '',
      modalRotation: 0,
      page: 0,
      pages: 1
    };
  }

  addImages(pages, page, photos) {
    if (page - 1 !== this.state.page) {
      this.queue[page] = {pages, photos};
      return;
    }

    this.setState(prevState => {
      // Append new page items
      let images = prevState.images;
      images.push(...photos);
      return {images, pages, page};
    }, () => {
      let queuedPages = Object.keys(this.queue);
      queuedPages.sort(function(a, b){return a-b});

      if (queuedPages.length) {
        let page = queuedPages[0];
        let pageArgs = this.queue[page];
        delete this.queue[page];
        this.addImages(pageArgs.pages, page, pageArgs.photos);
      }
    });
  }

  getImages(tag, page) {
    flicker.searchByTags(tag, page)
      .then(({data: {photos: {pages, page, photo}}}) => this.addImages(pages, page, photo))
      .catch(err => this.setState({error: err}));
  }

  deleteImage(image) {
    this.setState({
      images: this.state.images.filter(img => img !== image)
    });
  }

  onExpand(image) {
    this.setState({
      modalIsOpen: true,
      modalTitle: image.title,
      modalImage: image.link,
      modalRotation: image.rotation
    });
  }

  onResize(contentRect) {
    let width = contentRect.bounds.width;
    let columns = Math.floor(width / 200);
    let imageSize = width / columns;
    this.setState({ imageSize: imageSize })
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  loadMore(page) {
    this.getImages(this.props.tag, page);
  }

  componentWillReceiveProps(props) {
    // Clear images, then get images for the new tags
    this.setState({
      images: []
    }, () => this.getImages(props.tag, 1));
  }

  render() {
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.loadMore.bind(this)}
        hasMore={this.state.page < this.state.pages}
        loader={<div className="loader" key={0}>Loading ...</div>}
      >
        <Measure bounds onResize={this.onResize.bind(this)}>
          {
            ({measureRef}) => {
              return <div ref={measureRef} className="gallery-root">
                {
                  this.state.images.map(dto => {
                    return <Image key={'image-' + dto.id} dto={dto} size={this.state.imageSize}
                                  onDelete={this.deleteImage.bind(this)} onExpand={this.onExpand.bind(this)}/>;
                  })
                }

                <Modal
                  isOpen={this.state.modalIsOpen}
                  onRequestClose={this.closeModal.bind(this)}
                  contentLabel={this.state.modalTitle}>
                  <button className="modal-close" onClick={this.closeModal.bind(this)}>x</button>
                  <img src={this.state.modalImage} width="100%" height="100%" style={{
                    transform: `rotate(${this.state.modalRotation}deg)`
                  }}/>
                </Modal>
              </div>
            }
          }
        </Measure>
      </InfiniteScroll>
    );
  }
}

export default Gallery;
