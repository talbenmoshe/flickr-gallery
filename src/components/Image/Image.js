import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
//npm i react-facebook
import FacebookProvider, { Share } from 'react-facebook';


class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.delete= this.delete.bind(this);
    this.rotate = this.rotate.bind(this);
    this.expand = this.expand.bind(this);
    this.drag = this.drag.bind(this);
    this.dragOver= this.dragOver.bind(this);
    this.drop = this.drop.bind(this);
    this.share = this.share.bind(this);
    this.calcImageSize = this.calcImageSize.bind(this);

    this.state = {
      from:0,
      to:0,
      rotation: 0,
      size: 200
    };
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }
  
  //The function calls the parent deleteFromGallery function and pass the index of image to remove
  delete(){
    //console.log('removed'+this.props.index);
    this.props.deleteFromGallery(this.props.index); 
  }

  //function rotate trigggerd on click increases the rotation of each image component by 90 deg
  rotate(){
    console.log('rotated by 90');
    let newRotation = this.state.rotation + 90;
    if(newRotation >= 360){
      newRotation =-360;
    }
    this.setState({
      rotation: newRotation,
    })
  }
  //function calls the expand of gallery that is passed in as a prop
  expand(){
    this.props.expand(this.props.index);
    //console.log(this.props.image.toString);
  }

  //function triggered on drag and stores the dragged image index as from
  drag() { 
    this.setState({
      from:this.props.index   
    })
    console.log("Dragged from " + this.state.from );
  }

  //function triggered on drop and calls the switch to swap images on the gallery 
  drop(event){
    event.preventDefault();
    console.log("Dropped");
    this.props.switchImages(this.state.from,this.state.to);  
  }

  //function triggered on dragOver event and stores the dest image index as to
  dragOver(event){
    event.preventDefault();
    this.setState({
      to: this.props.index
    })
    console.log("Over/To " + this.state.to );
  }
  share(){
    return 'https://farm'+this.props.dto.farm+'staticflickr.com/'+this.props.dto.server+'/'+this.props.dto.id+this.props.dto.secret+'.jpg';
  
  }
  render() {
    return (
      <div className="image-root" draggable="true" 
       onDrag={this.drag} 
       onDragOver={this.dragOver}
       onDrop={this.drop}

        style={{
          //css property tranform that actually rotate the component 
          transform: `rotate(${this.state.rotation}deg)`,
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px'
        }}
        >
        <div>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.rotate}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={this.delete} />
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={this.expand}/>
          <FacebookProvider appId="575259816194402">
             <Share href={`https://farm${this.props.dto.farm}.staticflickr.com/${this.props.dto.server}/${this.props.dto.id}_${this.props.dto.secret}.jpg`}>
               <button className="icon-b"><img width="42" height="42" src="http://localhost:8000/components/localImages/share.png" alt="Share with facebook"/></button>
             </Share>
          </FacebookProvider>
        </div>
        
      </div>
    );
  }
}

export default Image;
