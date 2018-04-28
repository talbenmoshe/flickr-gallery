/**
 * Created by wafaneh on 4/21/2018.
 */

import axios from 'axios';

import {FlickrImage} from './Models';

const instance = axios.create({
  baseURL: 'https://www.flickr.com/services/rest/?api_key=4cf3706ee38b850c3ed3f3b72790a47a&format=json&nojsoncallback=1',
});

export function getImages(tags, page = 1, perpage = 100) {
  return new Promise((resolve, reject) => {
    instance.get('', {
      params: {
        method: 'flickr.photos.search',
        tags: tags,
        page: page,
        perpage: perpage
      }
    }).then(response => {
      const images = response.data['photos']['photo'];
      const canLoadMore = response.data['page'] === response.data['pages'];
      resolve({
        images: images.map((entry) => new FlickrImage(entry['farm'], entry['id'], entry['isfamily'], entry['isfriend'], entry['ispublic'], entry['owner'], entry['secret'], entry['server'], entry['title'])),
        canLoadMore: canLoadMore
      });
    })
      .catch(error => {
        reject(error)
      })
  });
}
