import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import './Gallery.scss';
import axios from 'axios';
import RGL, { WidthProvider }  from 'react-grid-layout';
import InfiniteScroll from 'react-infinite-scroller';
import Measure from 'react-measure';
import VisibilitySensor from 'react-visibility-sensor';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import ShareImage from '../ShareImage';
import {debounce} from 'throttle-debounce';

const ReactGridLayout = WidthProvider(RGL);

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      layout: [],
      columnsCount: 1,
      targetImageSize: 150,
      imageSize: 150,
      hasMorePhotos: false,
      pageNumber: 1,
      imagesCountPerPage: 50,
      photoIndex: 0,
      isOpen: false
    };
    this.deleteImage = this.deleteImage.bind(this);
    this.loadMorePhotos = this.loadMorePhotos.bind(this);
    this.onScreenResize = this.onScreenResize.bind(this);
    this.viewImageInLightbox = this.viewImageInLightbox.bind(this);
    this.getImages = debounce(2000, this.getImages);
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag, page) {
    //save last search to local storage
    localStorage.setItem('lastSearch', tag);
    const self = this;
    const apiKey = 'bb358062f623905b881c07cad117a097';
    const url = `https://api.flickr.com/services/rest/?api_key=${apiKey}&method=flickr.photos.search&tag_mode=all&format=json&nojsoncallback=1&tags=${tag}&page=${page}&per_page=${this.state.imagesCountPerPage}&extras=owner_name`
    const photosPromise = axios.get(url);
    photosPromise.then(response => {
      //update images in state
      if (page <= 1) {
        //override images
        self.setState({
          images: response.data.photos.photo,
          layout: this.getPhotosLayout(),
          pageNumber: 1,
          hasMorePhotos: response.data.photos.pages > page
        });
  
      } else {
        self.setState((prevState) => {
          return {
            images: prevState.images.concat(response.data.photos.photo),
            hasMorePhotos: response.data.photos.pages > page,
            pageNumber: page
          }
        });
      }
      
    }).catch(() => {
      //handle error
    })

    
  }
  //update images count on sxreen resize
  onScreenResize(contentRect) {
    let width = this.state.galleryWidth;
    if (contentRect) {
       width = contentRect.bounds.width;
    }
    const columnsCount = Math.floor(width / this.state.targetImageSize);
    const imageSize = Math.floor(width / columnsCount);
    this.setState({columnsCount, imageSize}, () => {
      this.setState({layout: this.getPhotosLayout()})
    });
  }

  componentDidMount() {
    this.getImages(this.props.tag, 1);
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag, 1);
  }

  deleteImage(index) {
    this.setState((prevState) => {
      prevState.images.splice(index, 1)
    });
  }
  viewImageInLightbox(photoIndex) {
    this.setState({
      photoIndex,
      isOpen: true
    });
  }
  //map grid layout configs for images
  getPhotosLayout() {
    const {columnsCount} = this.state;
    return this.state.images.map((image, i) => {
      return {
        i: i.toString(),
        x: Math.floor(i % columnsCount),
        y: Math.floor(i / columnsCount),
        w: 1,
        h: 1,
        isDraggable: true,
        isResizable: true
      };
    });
  }

  loadMorePhotos() {
    // load more photos on scroll
    this.getImages(this.props.tag, this.state.pageNumber + 1)
  }

  urlFromDto(image) {
    return `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`;
  }

  render() {
    const { layout,imageSize, columnsCount, images, photoIndex, isOpen } = this.state;
    return (
        <div className="gallery-root">
         <InfiniteScroll
          pageStart={this.state.page}
          loadMore={this.loadMorePhotos}
          hasMore={this.state.hasMorePhotos}
          loader={<div className="loader" key={this.state.pageNumber}>Loading ...</div>}
        >
          <Measure bounds onResize={this.onScreenResize}>
            {({ measureRef }) => {
              return <div ref={measureRef} >
                <ReactGridLayout
                  containerPadding={[0, 0]}
                  margin={[0, 0]}
                  layout={layout}
                  rowHeight={imageSize}
                  items={images.length}
                  cols={columnsCount}
                >
                  {images.map((dto, index) => {
                    return <div className="gallary-img" key={index} >
                      <VisibilitySensor partialVisibility={true} resizeCheck={true}>
                        {({ isVisible }) => {
                          return isVisible ?
                            <Image
                              dto={dto}
                              index={index}
                              imageSize={imageSize}
                              deleteImage={this.deleteImage}
                              viewImageInLightbox={this.viewImageInLightbox}
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
        {isOpen && (
          <Lightbox
            mainSrc={this.urlFromDto(images[photoIndex])}
            nextSrc={this.urlFromDto(images[(photoIndex + 1) % images.length])}
            prevSrc={this.urlFromDto(images[(photoIndex + images.length - 1) % images.length])}
            onCloseRequest={() => this.setState({ isOpen: false })}
            imageTitle={<div className={'app-header'}> {images[photoIndex].title} <a href={`https://www.flickr.com/photos/${images[photoIndex].owner}/${images[photoIndex].id}`} target={'_blank'}> View on Flickr </a></div>}
            toolbarButtons={[<ShareImage url={this.urlFromDto(images[photoIndex])} iconSize={32} />]}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length
              })
            }
          />
        )}

        </div>
      
    );
  }
}

export default Gallery;
