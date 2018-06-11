import React from 'react';
import PropTypes from 'prop-types';
import './ShareImage.scss';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  TumblrShareButton,
  TumblrIcon
} from 'react-share';

class ShareImage extends React.Component {
  static propTypes = {
    url: PropTypes.string,
    iconSize: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }
  
  render() {
    const {url, iconSize} = this.props;
    return (
          <div className={'share-buttons'}>
            <FacebookShareButton url={url} className={'share-button'} children={<FacebookIcon size={iconSize} round={true} style={{padding: '5px'}} />} />
            <TwitterShareButton url={url} className={'share-button'} children={<TwitterIcon size={iconSize} round={true} style={{padding: '5px'}} />} />
            <TumblrShareButton url={url} className={'share-button'} children={<TumblrIcon size={iconSize} round={true} style={{padding: '5px'}} />} />
          </div>
    );
  }
}

export default ShareImage;
