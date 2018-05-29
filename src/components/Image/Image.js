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

    this.state = {
      from:0,
      to:0,
      rotation: 0,
      size: 200
    };

    this.rotate = this.rotate.bind(this);
    this.drag = this.drag.bind(this);
    this.dragOver= this.dragOver.bind(this);
    this.drop = this.drop.bind(this);
    this.calcImageSize = this.calcImageSize.bind(this);
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
  

  //function rotate trigggerd on click increases the rotation of each image component by 90 deg
  rotate(){
    console.log('rotated by 90');
    let newRotation = this.state.rotation + 90;
    if(newRotation >= 360){
      newRotation =-360;
    }
    this.setState({rotation: newRotation});
  }
  
  //function triggered on drag and stores the dragged image index as from
  drag=()=> { 
             this.setState({from:this.props.index});
             console.log("Dragged from " + this.state.from + '   '+this.state.to);
            }

  //function triggered on drop and calls the switch to swap images on the gallery 
  drop=()=> {
            console.log("Dropped");
             this.props.switchImages(this.state.from,this.state.to);  
            }

  //function triggered on dragOver event and stores the dest image index as to
  dragOver=(event)=>{
          event.preventDefault();
          this.setState({
            to: this.props.index
          })
          console.log(this.state.from+"Over/To " + this.state.to );
        }
  
  render() {
    return (
      <div className="image-root" draggable="true" 
       onDragStart ={this.drag} 
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
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={this.props.deleteFromGallery} />
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={this.props.expand}/>

          <FacebookProvider appId="575259816194402">
            <Share href={`https://farm${this.props.dto.farm}.staticflickr.com/${this.props.dto.server}/${this.props.dto.id}_${this.props.dto.secret}.jpg`}>
              <button className="icon-b"><img width="35" height="35" src="http://localhost:8000/components/localImages/share.png" alt="Share with facebook"/></button>
            </Share>
          </FacebookProvider>
        </div>
        
      </div>
    );
  }
}

export default Image;
