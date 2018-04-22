import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import './Gallery.scss';
import flicker from '../../flicker'
import Modal from 'react-modal';
import Measure from 'react-measure';

Modal.setAppElement('#app');

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
      modalRotation: 0
    };
  }

  getImages(tag) {
    flicker.searchByTags(tag).then(res => {
      this.setState({
        images: res.data.photos.photo
      });
    }).catch(err => {
      this.setState({
        error: err
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
    this.setState({ imageSize: imageSize })
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  componentDidMount() {
    this.getImages(this.props.tag);
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  render() {
    return (
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
    );
  }
}

export default Gallery;
