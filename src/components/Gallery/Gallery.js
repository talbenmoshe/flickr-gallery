import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import './Gallery.scss';
import flicker from '../../flicker'
import Modal from 'react-modal';
import Measure from 'react-measure';
import InfiniteScroll from 'react-infinite-scroller';
import RGL, { WidthProvider } from 'react-grid-layout';

Modal.setAppElement('body');
const ReactGridLayout = WidthProvider(RGL);

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      imageSize: 200,
      modalIsOpen: false,
      modalTitle: '',
      modalImage: '',
      modalRotation: 0,
      loadMore: false,
      page: 1,
      pages: 2,
      columns: 1,
      layout: []
    };
  }

  addImages(pages, page, photos) {
    this.setState(prevState => {
      // Append new page items
      let images = prevState.images;
      images.push(...photos);
      return {
        images, pages, page,
        loadMore: page < pages
      };
    }, () => this.setState({layout: this.getLayout()}));
  }

  getImages(tag, page) {
    if (!tag) return;

    this.setState({loadMore: false}, () => {
      flicker.searchByTags(tag, page)
        .then(({data: {photos: {pages, page, photo}}}) => this.addImages(pages, page, photo))
        .catch(err => {
          this.setState({error: err, loadMore: false});
        });
    });
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
    this.setState({imageSize, columns}, () => {
      this.setState({layout: this.getLayout()});
    });
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  loadMore() {
    this.getImages(this.props.tag, this.state.page + 1);
  }

  componentWillReceiveProps(props) {
    // Clear images, then get images for the new tags
    this.setState({
      page: 1,
      pages: 2,
      loadMore: false
    }, () => this.setState({images: []}, () => this.getImages(props.tag, this.state.page)));
  }

  componentDidMount() {
    this.getImages(this.props.tag, 1)
  }

  getLayout() {
    let columns = this.state.columns;
    return this.state.images.map((image, i) => {
      return {
        i: i.toString(),
        x: Math.floor(i % columns),
        y: Math.floor(i / columns),
        w: 1,
        h: 1,
        isDraggable: true,
        isResizable: true
      };
    });
  }

  render() {
    const VisibilitySensor = require('react-visibility-sensor');

    return (
      <InfiniteScroll
        pageStart={this.state.page}
        loadMore={this.state.loadMore ? ::this.loadMore : ()=>{}}
        hasMore={this.state.loadMore}
        loader={<div className="loader" key={0}>Loading ...</div>}
      >
        <Measure bounds onResize={::this.onResize}>
          {
            ({measureRef}) => {
              return <div ref={measureRef} className="gallery-root">
                <ReactGridLayout
                  className="layout"
                  margin={[0, 0]}
                  layout={this.state.layout}
                  rowHeight={this.state.imageSize}
                  items={this.state.images.length}
                  cols={this.state.columns}
                >
                  {
                    this.state.images.map((dto, i) => {
                      return <div key={i} data-grid={this.state.layout[i]}>
                        <VisibilitySensor partialVisibility={true}>
                          {({isVisible}) => {
                            return isVisible ? <Image key={dto.id} dto={dto} size={this.state.imageSize}
                                          onDelete={::this.deleteImage}
                                          onExpand={::this.onExpand}/> : <div></div>
                          }}
                        </VisibilitySensor>
                      </div>
                    })
                  }
                </ReactGridLayout>

                <Modal
                  isOpen={this.state.modalIsOpen}
                  onRequestClose={::this.closeModal}
                  contentLabel={this.state.modalTitle}>
                  <button className="modal-close" onClick={::this.closeModal}>x</button>
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
