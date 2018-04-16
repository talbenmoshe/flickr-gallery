import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { FacebookShareButton, LinkedinShareButton, PinterestShareButton, FacebookIcon, LinkedinIcon, PinterestIcon } from 'react-share';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    draggedImage: PropTypes.object,
    onImageRemoved: PropTypes.func,
    onImageDragged: PropTypes.func,
    onImageMaximized: PropTypes.func,
    onImageRotated: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.calcImageSize = this.calcImageSize.bind(this);
    this.handleImageRemoved = this.handleImageRemoved.bind(this);
    this.addDragAndDropHandlers = this.addDragAndDropHandlers.bind(this);
    this.handleImageRotated = this.handleImageRotated.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleImageMaximized = this.handleImageMaximized.bind(this);

    this.state = {
      size: 200,
      rotationAngle: 0
    };
  }

  componentDidMount() {
    const { imageRoot } = this.refs;
    this.calcImageSize();
    this.addDragAndDropHandlers(imageRoot);
  }

  componentWillReceiveProps(nextProps) {
    const { galleryWidth } = this.props;
    if(nextProps.galleryWidth !== galleryWidth) {
      this.calcImageSize();
    }
  }

  calcImageSize() {
    const { galleryWidth } = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const { size } = this.state;
    const newSize = Math.floor(galleryWidth / imagesPerRow);

    if(size !== newSize) {
      this.setState({
        size: newSize
      });
    }
  }

  addDragAndDropHandlers(elem) {
    elem.addEventListener('dragstart', this.handleDragStart, false);
    elem.addEventListener('dragover', this.handleDragOver, false);
    elem.addEventListener('dragleave', this.handleDragLeave, false);
    elem.addEventListener('drop', this.handleDrop, false);
    elem.addEventListener('dragend', this.handleDragEnd, false);
  }

  handleDragStart(e) {
    const elem = e.target;
    this.props.onImageDragged(elem);

    e.dataTransfer.effectAllowed = 'move';

    // set current element data to be transferred
    e.dataTransfer.setData('text/html', elem.outerHTML);
    elem.classList.add('dragged');
  }

  handleDragEnd(e) {
    const elem = e.target;
    elem.classList.remove('dragged')
  }

  handleDrop(e) {
    const elem = e.target.parentElement;
    const { draggedImage } = this.props;
    if(e.stopPropagation) {

      // Stops some browsers from redirecting.
      e.stopPropagation();
    }

    // if not the same element swap
    if (draggedImage !== elem) {
      this.swapElements(draggedImage, elem);
    }

    elem.classList.remove('over');
    return false;
  }

  swapElements(elem1, elem2) {
    const parentElement2 = elem2.parentNode;
    const nextElement2 = elem2.nextSibling;
    if (nextElement2 === elem1) {
      return parentElement2.insertBefore(elem1, elem2)
    }

    elem1.parentNode.insertBefore(elem2, elem1);
    parentElement2.insertBefore(elem1, nextElement2);
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  handleDragOver(e) {
    const elem = e.target.parentElement;
    if (e.preventDefault) {

      // this will enable dropping
      e.preventDefault();
    }

    if(elem !== this.props.draggedImage) {
      elem.classList.add('over');
    }

    e.dataTransfer.dropEffect = 'move';

    return false;
  }

  handleDragLeave(e) {
    const elem = e.target.parentElement;
    elem.classList.remove('over');
  }

  handleImageRemoved() {
    const { dto } = this.props;
    this.props.onImageRemoved(dto.id);
  }

  handleImageRotated() {
    const { imageHolder }= this.refs;
    const { dto } = this.props;
    const { rotationAngle } = this.state;
    const newRotationAngle = (rotationAngle + 90) % 360;
    imageHolder.style.transform = `rotate(${newRotationAngle}deg)`;

    this.setState({
      rotationAngle: newRotationAngle
    });

    this.props.onImageRotated(dto.id, newRotationAngle);
  }

  handleImageMaximized() {
    const { dto } = this.props;
    this.props.onImageMaximized(dto.id);
  }

  render() {
    const { dto } = this.props;
    const imageStyle = {
      backgroundImage: `url(${this.urlFromDto(dto)})`,
      width: this.state.size + 'px',
      height: this.state.size + 'px'
    };

    return (
      <div className="image-root"
           ref="imageRoot"
           draggable="true">
        <div className="background-holder"
             ref="imageHolder"
             style={imageStyle}>
        </div>
        <div className="image-controls">
          <FontAwesome className="image-icon"
                       name="sync-alt"
                       title="rotate"
                       onClick={this.handleImageRotated}/>
          <FontAwesome className="image-icon"
                       name="trash-alt"
                       title="delete"
                       onClick={this.handleImageRemoved}/>
          <FontAwesome className="image-icon"
                       name="expand"
                       title="expand"
                       onClick={this.handleImageMaximized}/>
        </div>
        <div className="share-controls">
          <FacebookShareButton url={this.urlFromDto(this.props.dto)}
                               quote={this.props.dto.title}
                               className="btn-share">
            <FacebookIcon size={20}
                          square />
          </FacebookShareButton>
          <LinkedinShareButton url={this.urlFromDto(this.props.dto)}
                               title={this.props.dto.title}
                               className="btn-share">
            <LinkedinIcon size={20}
                          square />
          </LinkedinShareButton>
          <PinterestShareButton url={this.urlFromDto(this.props.dto)}
                                media={this.urlFromDto(this.props.dto)}
                                description={this.props.dto.title}
                                className="btn-share">
            <PinterestIcon size={20}
                           square />
            </PinterestShareButton>

        </div>
      </div>
    );
  }
}

export default Image;
