import axios from 'axios';
import config from 'config'

export default {
  getParams(params) {
    return Object.keys(params).map(key => key + '=' + params[key]).join('&');
  },
  searchByTags(tags, page) {
    let params = {
      ...config.FLICKER_API_PARAMS,
      method: 'flickr.photos.search',
      tags: tags,
      page: page
    };

    let url = `${config.FLICKER_API}?${this.getParams(params)}`;
    return axios.get(url);
  }
}
