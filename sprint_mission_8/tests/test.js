async function bulkArticleCreate() {
  for (let i = 1; i <= 100; i++) {
    await fetch(`http://localhost:3000/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `Article ${i}`,
        content: `This is the content of article ${i}.`,
        image: `https://example.com/image${i}.jpg`,
      }),
    });
  }
}

async function bulkArticleCommentCreate(articleId) {
  for (let i = 1; i <= 100; i++) {
    await fetch(`http://localhost:3000/articles/${articleId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `This is the content of article ${articleId} comment${i}.`,
      }),
    });
  }
}

async function bulkProductCreate() {
  for (let i = 1; i <= 100; i++) {
    await fetch(`http://localhost:3000/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Test Product ${i}`,
        description: `This is a test product description ${i}.`,
        price: 100,
        tags: ['test', 'product'],
        images: ['image1.png', 'image2.png'],
      }),
    });
  }
}

async function bulkProductCommentCreate(productId) {
  for (let i = 1; i <= 100; i++) {
    await fetch(`http://localhost:3000/products/${productId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `This is the content of product ${productId} comment${i}.`,
      }),
    });
  }
}

bulkArticleCreate();
bulkArticleCommentCreate(1);
bulkArticleCommentCreate(2);
bulkProductCreate();
bulkProductCommentCreate(1);
bulkProductCommentCreate(2);
