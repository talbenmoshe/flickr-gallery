/**
 * Created by wafaneh on 4/21/2018.
 */
export class FlickrImage {
  constructor(farm, id, isfamily, isfriend, ispublic, owner, secret, server, title) {
    this.farm = farm;
    this.id = id;
    this.isfamily = isfamily;
    this.isfriend = isfriend;
    this.ispublic = ispublic;
    this.owner = owner;
    this.secret = secret;
    this.secret = secret;
    this.server = server;
    this.title = title;
    this.rotation = 0;
  }

  // Getter
  get url() {
    return `https://farm${this.farm}.staticflickr.com/${this.server}/${this.id}_${this.secret}.jpg`;
  }
}
