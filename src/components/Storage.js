/**
 * Created by wafaneh on 4/21/2018.
 */
class Storage {

  constructor() {
    this.driver = new LocalStorageDriver();
  }

  saveData(key, data) {
    this.driver.saveData(key, data);
  }

  getData(key) {
    return this.driver.getData(key);
  }
}

class LocalStorageDriver {

  constructor() {
  }

  saveData(key, data) {
    localStorage.setItem(key, data);
  }

  getData(key) {
    return localStorage.getItem(key);
  }
}

export default new Storage();
