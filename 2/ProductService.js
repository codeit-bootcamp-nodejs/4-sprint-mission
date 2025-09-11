export async function getProductList(params = {}) {
  try {
    const url = new URL("https://panda-market-api-crud.vercel.app/products");
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("에러래");
  }
}

export async function getProduct(id) {
  const res = await fetch(
    `https://panda-market-api-crud.vercel.app/products/${id}`
  );
  const data = res.json();
  return data;
}

export async function createProduct(Product) {
  const res = await fetch("https://panda-market-api-crud.vercel.app/products", {
    method: "POST",
    body: JSON.stringify({
      name: Product.name,
      description: Product.description,
      price: Product.price,
      tags: Product.tags,
      images: Product.images,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = res.json();
  return data;
}

export async function patchProduct(id) {
  const res = await fetch(
    `https://panda-market-api-crud.vercel.app/products/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = res.json();
  return data;
}

export async function deleteProduct(id) {
  const res = await fetch(
    `https://panda-market-api-crud.vercel.app/products/${id}`,
    {
      method: "DELETE",
    }
  );
  const data = res.json();
  return data;
}
