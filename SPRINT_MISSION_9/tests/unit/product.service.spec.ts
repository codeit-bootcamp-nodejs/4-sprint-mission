class ProductService {
  createProduct(data: { price: number }) {
    if (data.price < 0) throw new Error("가격이 음수");

    return { id: 1, ...data };
  }
}

describe("ProductService", () => {
  const service = new ProductService();

  it("음수 가격 → 에러", () => {
    expect(() => service.createProduct({ price: -1 })).toThrow();
  });

  it("정상 생성", () => {
    expect(service.createProduct({ price: 1000 }).id).toBe(1);
  });
});
