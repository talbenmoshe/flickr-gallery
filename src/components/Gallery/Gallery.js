import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import './Gallery.scss';
import Modal from 'react-modal'
import InfiniteScroll from 'react-infinite-scroller'
import VisibilitySensor from 'react-visibility-sensor'
import Measure from 'react-measure'
import RGL, { WidthProvider } from 'react-grid-layout'
import SimpleModalSlideshow from 'react-simple-modal-slideshow'
import Skeleton from 'react-loading-skeleton'
import ShareButton from 'react-social-share-buttons'
import {urlFromDto} from '../Image/utils'


const ReactGridLayout = WidthProvider(RGL)
const apiKey = '41d0f78cb96e7488c562b760e1566980'
Modal.setAppElement('#app')
class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props)
    this.state = {
      images: [],
      imageIndex: 1,
      showCarousel: false,
      loadMore: false,
      page: 1,
      pages: 1,
      imageSize: 200,
      columns: 1,
      layout: []
    }
    this.deleteImage = this.deleteImage.bind(this)
    this.expandImage = this.expandImage.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.loadMorePhotos = this.loadMorePhotos.bind(this)
    this.onResize = this.onResize.bind(this)
    this.getLayout = this.getLayout.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handlePrev = this.handlePrev.bind(this)
  }

  handlePrev(index) {
    // change the index of the image in the carousel
    this.setState({imageIndex: index})
  }

  handleNext(index) {
    // change the index of the image in the carousel
    this.setState({imageIndex: index})
  }

  closeModal() {
    // Close the carousel modal
    this.setState({ showCarousel: false })
  }

  deleteImage(index) {
    // remove the image
    const images = this.state.images
    images.splice(index, 1)
    this.setState({ images })
  }

  expandImage(index) {
    // expand the clicked image in carousel modal
    this.setState({ imageIndex: index, showCarousel: true })
  }

  loadMorePhotos() {
    // load more photos in on scroll
    this.getImages(this.props.tag, this.state.page + 1)
  }

  getImages(tag, page) {
    // Here we get images from Flickr
    if (tag.slice(-1) !== ',') {
      tag.concat(',')
    }
    const url = `https://api.flickr.com/services/rest/?api_key=${apiKey}&method=flickr.photos.search&format=json&nojsoncallback=1&&per_page=50&page=${page}&tags=${tag}`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState(prevState => {
          let images = prevState.images;
          images.push(...data.photos.photo);
          return {
            images,
            pages: data.photos.pages,
            loadMore: this.state.page < data.photos.pages
          };
        }, () => this.setState({ layout: this.getLayout() }))
      })
      .catch(error => {
        throw error;
      })
  }

  componentDidMount() {
    this.getImages(this.props.tag, this.state.page) // get the images when mpunting the component
  }

  getLayout() {
    // assign the bounds and layout for each image for drag frop functionality
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

  onResize(contentRect) {
    // callback when changing the size of the window
    const width = contentRect.bounds.width;
    const columns = Math.floor(width / 200);
    const imageSize = width / columns;
    this.setState({imageSize, columns}, () => {
      this.setState({layout: this.getLayout()});
    });
  }

  componentWillReceiveProps(props) {
    if (props.tag !== this.props.tag) {
      this.setState({
        images: []
      })
    }
    this.getImages(props.tag, this.state.page);
  }

  render() {
    const slides = []
    if(this.state.showCarousel) {
      // build array of images urls for the carousel
      this.state.images.forEach((image) => {
        const url = urlFromDto(image)
        slides.push({
          media: (
            <img src={`${url}`} />
          )
        })
      })
    }
    return (
      <div className="t-gallery-root">
        <InfiniteScroll
          pageStart={this.state.page}
          loadMore={this.loadMorePhotos}
          hasMore={this.state.loadMore}
          loader={<div key={this.state.page}><Skeleton count={5} /></div>}
        >
          <Measure bounds onResize={this.onResize}>
            {({ measureRef }) => {
              return <div ref={measureRef} className="gallery-root" >
                <ReactGridLayout
                  className="c-grid-layout"
                  margin={[10, 10]}
                  layout={this.state.layout}
                  rowHeight={this.state.imageSize}
                  items={this.state.images.length}
                  cols={this.state.columns}
                >
                  {this.state.images.map((dto, index) => {
                    return <div className="gallary-img" key={index} >
                      <VisibilitySensor partialVisibility={true}>
                        {({ isVisible }) => {
                          return isVisible ?
                            <Image
                              onDelete={this.deleteImage}
                              onExpand={this.expandImage}
                              dto={dto}
                              index={index}
                            />
                            :
                            <div />
                        }}
                      </VisibilitySensor>
                    </div>
                  })}
                </ReactGridLayout>
              </div>
            }
            }
          </Measure>
        </InfiniteScroll>

        {this.state.showCarousel &&
          <div className='modal-container'>
            <Modal className='c-gallery-modal' isOpen={this.state.showCarousel}>
              <SimpleModalSlideshow
                slides={slides}
                currentSlide={this.state.imageIndex}
                open={this.state.showCarousel}
                onClose={this.closeModal}
                onNext={this.handleNext}
                onPrev={this.handlePrev}
                classNamePrefix="modal-slideshow-example2"
              />
              <div className='c-share-buttons'>
                  <ShareButton
                      compact
                      socialMedia={'facebook'}
                      url={slides[this.state.imageIndex].media.props.src}
                      text='Facebook'
                  />
                  <ShareButton
                      compact
                      socialMedia={'google-plus'}
                      url={slides[this.state.imageIndex].media.props.src}
                      text='Google+'
                  />
                  <ShareButton
                      compact
                      socialMedia={'twitter'}
                      url={slides[this.state.imageIndex].media.props.src}
                      text='twitter'
                  />
                  <ShareButton
                      compact
                      socialMedia={'pinterest'}
                      url={slides[this.state.imageIndex].media.props.src}
                      text='pinterest'
                  />
              </div>
            </Modal>
          </div>
        }

      </div>
    );
  }
}

export default Gallery;
