import deleteProduct from "./delete.product.js";
import deleteProductComment from "./delete.product.comment.js";
import getProductComments from "./get.product.comments.js";
import getProductDetail from "./get.product.detail.js";
import getProductList from "./get.product.list.js";
import createProductComment from "./post.product.comment.create.js";
import createProduct from "./post.product.create.js";
import updateProduct from "./update.product.js";
import updateProductComment from "./update.product.comment.js";
import ProductLike from "./post.product.like.js";
import getLikeProducts from "./get.like.products.js";

const productAPI = {
  createProduct,
  createProductComment,
  getProductComments,
  getProductDetail,
  getProductList,
  updateProduct,
  updateProductComment,
  deleteProduct,
  deleteProductComment,
  ProductLike,
  getLikeProducts,
};

Object.freeze(productAPI);

export default productAPI;
