import React from 'react';
import axios from 'axios';

export default {
  GET_METHOD: 'GET',
  POST_METHOD: 'POST',
  PUT_METHOD: 'PUT',
  flickerAPIParams: {
    apiKey : '355de08fb88e049c1c31ee06a790a85d',
    apiSecret : '77d7f31d99ee301f',
    format: 'json'
  },
  baseURL: 'https://api.flickr.com/services/rest/',
  sendRequest(path, method, params) {
    if (method == this.GET_METHOD) {
      path = path || '';
      return axios.get(
        this.baseURL + path,
        {
          params: params
        })
    }
  },
  getImages: function (tag, page) {
    return this.sendRequest('', this.GET_METHOD, {
      method: 'flickr.photos.search',
      api_key: this.flickerAPIParams.apiKey,
      format: this.flickerAPIParams.format,
      nojsoncallback: 1,
      tags: tag,
      page: page
    });
  }
}
