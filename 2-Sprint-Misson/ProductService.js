class Product {
  name;
  description;
  price;
  tags;
  images;
  favoriteCount;

  constructor(name, description, price, tags, images, favoriteCount)  {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount;
  }

  favorite() {
    this.favoriteCount++;
  }
}

 class ElectronicProduct extends Product {
  manufacturer;
  
  constructor(name, description, price, tags, images, favoriteCount, manufacturer) {
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer;
  }
}

class ProductService {

  //GET, page, pageSize, keyword 쿼리 파라미터 사용
  async getProductList({ page = 1, pageSize = 10, keyword = '' }) {
    let response;
    const products = [];

   //비동기, 오류 처리
    try {
      response = await fetch(
        `https://panda-market-api-crud.vercel.app/products?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`
      );
    } catch (error) {
      console.error('네트워크 오류:', error);
      throw new Error('오류');
    }
  
    if (!response.ok) {
      console.error(`서버 오류: ${response.status} ${response.statusText}`);
      throw new Error(`오류: ${response.status}`);
    }

    //배열에 저장 -> 전자제품은 자식에게 별도로 전달
    try {
      const data = await response.json();
      const productList = data.list;


      for (const product of productList) {
        const { name, description, price, tags, images, favoriteCount, manufacturer } = product;

        if (tags.includes("전자제품")) {
          products.push(new ElectronicProduct(name, description, price, tags, images, favoriteCount, manufacturer));
        }
        else {
          products.push(new Product(name, description, price, tags, images, favoriteCount));
        }
      }
      return products;
      
    } catch(error) {
      console.log("생성 오류", error);
      throw new Error(`데이터 처리 중 오류`);
    }
  }

  //GET
  async getProduct(productId) {
    const response = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${productId}`
    );
    if (!response.ok) throw new Error('조회 실패');
    return await response.json();
  }

  //POST ,request body에 name, description, price, tags, images 를 포함
  async createProduct({ name, description, price,tags, images }) {
    const response = await fetch('https://panda-market-api-crud.vercel.app/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, description, price,tags, images })
    });
    if (!response.ok) throw new Error('생성 실패');
    return await response.json();
  }

  //PATCH
  async patchProduct(productId, updateData) {
    const response = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${productId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      }
    );
    if (!response.ok) throw new Error('수정 실패');
    return await response.json();
  }

  //DELETE
  async deleteProduct(productId) {
    const response = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${productId}`,
      {
        method: 'DELETE'
      }
    );
    if (!response.ok) throw new Error('삭제 실패');
    return await response.json();
  }

}





export { Product, ElectronicProduct, ProductService };