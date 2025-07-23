// class/Content.js
export default class Content {
  constructor() {
    this._favoriteCount = 0;
  }

  favorite() {
    this._favoriteCount += 1;
  }

  get favoriteCount() {
    return this._favoriteCount;
  }
}

