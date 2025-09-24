import ProductService from "../services/product/product.service.js";

// const res = await ProductService.getProductList();
// console.log(res);

export async function testAllProductService() {
  let createdId = null;

  console.log("-------상품 리스트 조회--------");
  try {
    const query = { page: 1, pageSize: 3, keyword: "전자" };
    const res = await ProductService.getProductList(query);
    console.log(`상품 ${res.list.length}개 조회 성공`);
  } catch (err) {
    console.log(`❌`, err);
  }

  console.log("-------상품 등록--------");
  try {
    const newProduct = {
      images: ["https://example.com/..."],
      tags: ["전자제품"],
      price: 0,
      description: "string",
      name: "상품 이름",
    };
    const created = await ProductService.createProduct(newProduct);
    createdId = created.id;
    console.log(`등록한 상품 id : ${createdId}`);
  } catch (err) {
    console.log(`❌`, err);
  }

  console.log("-------개별 상품 조회--------");
  try {
    const product = await ProductService.getProduct(createdId);
    console.log(`[등록한 상품]`, product);
  } catch (err) {
    console.log(`❌`, err);
  }

  console.log("-------개별 상품 수정--------");
  try {
    const patchProductData = { name: "이름을 수정함" };
    const updated = await ProductService.patchProduct(createdId, patchProductData);
    console.log(`[상품 정보 수정 성공]`, updated);
  } catch (err) {
    console.log(`❌`, err);
  }

  console.log("---------상품 삭제--------");
  try {
    const deleted = await ProductService.deleteProduct(createdId);
    console.log(`[상품 삭제 성공]`, deleted);
  } catch (err) {
    console.log(`❌`, err);
  }

  console.log("-------상품 리스트 조회--------");
  try {
    const query = { page: 1, pageSize: 3, keyword: "전자" };
    const res = await ProductService.getProductList(query);
    console.log(res.list);
  } catch (err) {
    console.log(`❌`, err);
  }
}
