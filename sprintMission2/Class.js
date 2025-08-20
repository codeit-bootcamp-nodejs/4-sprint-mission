class Article {
    #title;
    #writer;
    #likeCount;
    #content;
    #createdAt;
    

  constructor(title, writer, likeCount = 0, content, createdAt = new Date()){
    this.#title = title;
    this.#writer = writer;
    this.#likeCount = likeCount;
    this.#content = content;
    this.#createdAt = createdAt;
  }
    
  getTitle(){
    return this.#title;
  }

  getWriter(){
    return this.#writer;
  }

  getLikeCount(){
    return this.#likeCount;
  }

  setLikeCount(newLikeCount){
    if(newLikeCount < 0 || !Number.isInteger(newLikeCount)){
      throw new Error('양수만 들어갈 수 있습니다.') // new Error는 정확히 무엇인가....?
    } else{
      this.#likeCount=newLikeCount;
    }       
  }
    
  like() {
    this.#likeCount += 1;
    return this.#likeCount;
  }

  getContent(){
    return this.#content;
  }

  getCreatedAt(){
    return this.#createdAt;
  }
}

class Product {
  #id;
  #name;
  #description;
  #price;
  #tags;
  #images;
  #favoriteCount;
  #createdAt;
  #updatedAt;

  constructor(id, name, description, price, tags, images, favoriteCount = 0, createdAt = new Date(), updatedAt){
    this.#id = id;
    this.#name = name;
    this.#description = description;
    this.#price = price;
    this.#tags = tags;
    this.#images = images;
    this.#favoriteCount = favoriteCount;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  getId(){
    return this.#id;
  }

  getName(){
    return this.#name;
  }

  getDescription(){
    return this.#description;
  }

  getPrice(){
    return this.#price;
  }

  getTags(){
    return this.#tags;
  }
  
  getImages(){
    return this.#images;
  }

  getfavoriteCount(){   
    return this.#favoriteCount;
  }

  favorite(){
    this.#favoriteCount += 1;
    return this.#favoriteCount;
  }

  getCreatedAt(){
    return this.#createdAt;
  }

  getUpdatedAt(){
    return this.#updatedAt;
  }
}

class ElectronicProduct extends Product {
  #manufactuer;

  constructor(id, name, description, price, manufacturer, tags, images, favoriteCount = 0, createdAt, updatedAt) {
    super(id, name, description, price, tags, images, favoriteCount = 0, createdAt, updatedAt);
    this.#manufactuer = manufacturer;
  }

getManufacturer(){
  return this.#manufactuer;

  
}}

export { Article, Product, ElectronicProduct}; 