import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import './Gallery.scss';
import flicker from '../../flicker'
import Modal from 'react-modal';

Modal.setAppElement('#app');

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      modalIsOpen: false,
      modalTitle: '',
      modalImage: '',
      modalRotation: 0
    };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
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

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map(dto => {
          return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth}
                        onDelete={this.deleteImage.bind(this)} onExpand={this.onExpand.bind(this)}/>;
        })}

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
    );
  }
}

export default Gallery;
