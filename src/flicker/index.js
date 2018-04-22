import axios from 'axios';
import config from 'config'

export default {
  getParams() {
    return Object.keys(config.FLICKER_API_PARAMS)
      .map(key => key + '=' + config.FLICKER_API_PARAMS[key])
      .join('&');
  },
  searchByTags(tags) {
    let params = this.getParams();
    let url = `${config.FLICKER_API}?${params}&method=flickr.photos.search&tags=${tags}`;
    return axios.get(url);
  }
}
