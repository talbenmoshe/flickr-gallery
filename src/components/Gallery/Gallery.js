import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import './Gallery.scss';
import Request from 'superagent';
// npm install axios --save 
// import axios from 'axios'; you can  use this instead of Request 
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; 
//npm install --save react-infinite-scroll-component
//npm i react-image-lightbox
import InfiniteScroll from 'react-infinite-scroll-component';
import Draggable, {DraggableCore} from 'react-draggable';
import Reorder, {
  reorder,
  reorderImmutable,
  reorderFromTo,
  reorderFromToImmutable
} from 'react-reorder';


class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.removeImage= this.removeImage.bind(this);
    this.Expand = this.Expand.bind(this);
    this.Switch = this.Switch.bind(this);
    this.getMoreImages = this.getMoreImages.bind(this);
    this.state = {
      images: [],
      isOpen:false,
      page:1,
      index: 0,
      galleryWidth: this.getGalleryWidth()
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
    // TODO: Get images from Flickr
    //public key is provided by flicker api account for non commercial uses 
    let publicApiKey = '799021d2809128939d6520be15d61cdd';
    //let secretApiKey = '90baee38709dbb03';
    
    //check if the tag is empty and worn the user 
    if(this.props.tag==' ')
      alert('Make sure you insert a Tag in the input field');
    else{
      //console.log(this.props.tag); used this for debugging reasons
      //The url to get images using get method and requested by the REQUEST obj provided by the superagent of react
      var url='https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='
               +publicApiKey+'&tags='+this.props.tag
               +'&tag_mode=all&per_page=100&format=json&nojsoncallback=1&page='+this.state.page;
      
      Request.get(url).then((response) => {
        if(response.body.photos.photo.length!=0){ 
          //Store the array of image obj in the state 
          if(this.state.page ==1)
          {
            this.setState({
              images: response.body.photos.photo
            });
          }
          else{
            this.setState({
              images: this.state.images.concat(response.body.photos.photo),
            });
          } 
          console.log(response.body.photos.photo); 
          //console.log(this.state.images[0]); 
          console.log(this.state.page); 
        }
      });
    }
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillReceiveProps(props) {
    this.setState({page:1});
    this.getImages(props.tag);
  }

   //Function that saves the previous images then deletes the clicked image 
   //identified by id the sets the images  again 
  removeImage(index){
      console.log('Removing component '+ index);
      var temp=this.state.images;
      temp.splice(index,1);
      this.setState({images:temp});
      console.log(this.state.images[0]);
      this.setState({
        images: reorder(this.state.images, 0, 1 )
      });
  }

  //Function expand that takes the index from image component to set 
  //the state of is open to run Lightbox
  Expand(i){
      this.setState({index:i});
      this.setState({isOpen:true});
  }

  //Get more images to run the functinality of infint scroll
  getMoreImages(){
      this.setState({page:this.state.page+1});
      console.log('Getting next 100 pics');
      this.getImages(this.props.tag);
      console.log('Done getting');
    
  }
  
  //swaps the images from-to of the state images and rerenders the gallery
  Switch(from,to){
      console.log('Switch'+from+' with '+to);

      var temp = this.state.images[from];
      this.state.images[from] = this.state.images[to];
      this.state.images[to] = temp;

      this.setState({
        images: this.state.images
      });
      console.log('Switch'+from+' with '+to);
  }
  
  render() {
    return (
      //This maps(loop) through the array of images inside the state 
      //Infinit scroll package by react triggers event at the the end of scrolled object
      //and calls function to get more images and render the component again 
      
      <div className="gallery-root">
        <InfiniteScroll
            dataLength={this.state.images.length}
            next={this.getMoreImages}
            hasMore={true}
            loader={<h4>Loading...</h4>}
        >
              {this.state.images.map((dto,index)=>
                <Image  key={'image-' + dto.id} 
                        dto={dto} 
                        galleryWidth={this.state.galleryWidth} 
                        index={this.state.images.indexOf(dto)}
                        deleteFromGallery={()=>this.removeImage(index)} 
                        expand={()=>this.Expand(index)} 
                        switchImages={this.Switch}/> 
              )}

        </InfiniteScroll>

        {this.state.isOpen && (
          <Lightbox
              mainSrc={`https://farm${this.state.images[this.state.index].farm}.staticflickr.com/${this.state.images[this.state.index].server}/${this.state.images[this.state.index].id}_${this.state.images[this.state.index].secret}.jpg`}
              nextSrc={`https://farm${this.state.images[this.state.index+1].farm}.staticflickr.com/${this.state.images[this.state.index+1].server}/${this.state.images[this.state.index+1].id}_${this.state.images[this.state.index+1].secret}.jpg`}
              prevSrc={`https://farm${this.state.images[this.state.index-1].farm}.staticflickr.com/${this.state.images[this.state.index-1].server}/${this.state.images[this.state.index-1].id}_${this.state.images[this.state.index-1].secret}.jpg`}
              onCloseRequest={() => this.setState({ isOpen: false })}
              onMovePrevRequest={() =>
                this.setState({
                  index: (this.state.index + this.state.images.length - 1) % this.state.images.length,
                })
              }
              onMoveNextRequest={() =>
                this.setState({
                  index: (this.state.index + 1) % this.state.images.length,
                })
              }
          />
        )}
      </div>
    );
  }
}
export default Gallery;
