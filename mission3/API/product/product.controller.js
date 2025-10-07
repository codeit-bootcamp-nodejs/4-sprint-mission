import { PrismaClient } from "@prisma/client";
import { getUniqueProductById } from "./product.service.js";

// creating prisma instance
const prisma = new PrismaClient();

// access product list API
export const getProductList = async (req, res) => {
  const { page,  take, name, description, keyword} = req.query;
  

  // handling for pagination
  const pageNumber = parseInt(page) || 1;
  const takeNumber = parseInt(take) || 10;
  const skip = (pageNumber - 1) * takeNumber;

  // searching for condition
  const whereCondition = keyword ?{
    OR : [
      {name :{contains: keyword , mode: "insensitive"}},
      {description:{contain: keyword, mode:"insensitive"}}
    ]
  }:{}
  try {
    // product list access (basic sort is latest)
    const productList = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: takeNumber,
      where:whereCondition,
    });

    res.status(200).json({
      message: "successfully access product list",
      data: productList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};
// 

// access product API
export const getProduct = async (req, res) => {
  const id = Number(req.params.id);
  const uniqueProduct = await getUniqueProductById(id)
  try {
    // access product
    return res.status(200).json({
      message: "successfully access product",
      data : uniqueProduct
     });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

// create product API
export const createProduct = async (req, res) => {
  const { name, description, tags, price } = req.body;

  // creating new product and connected tags.
  console.log("incoming data : ", req.body)
  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        createdAt: new Date(),
        price,
        //Connect existing tags by ID when creating a new product
        productTags: {
          create: tags.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      },
      include: {
        productTags: true,
      },
    });
    res.status(201).json({
      message: "successfully create product",
      data: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

// Delete product API
export const deletedProduct = async (req, res) => {
  const id = Number(req.params.id);

  // break if it is not unique product(validation)
  const uniqueProduct = await getUniqueProductById(id);
  console.log("incoming request date : ", uniqueProduct);
  if (!uniqueProduct) return res.status(400).json({ error: "invalid product" });

  try {
    // delete product
    await prisma.product.delete({ where: { id } });
    return res.status(200).json({ message: "successfully delete product" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

//modify product API
export const modifyProduct = async (req, res) => {
  const id = Number(req.params.id);
  const { data } = req.body;

  // break if it is not unique product(validation)
  const uniqueProduct = await getUniqueProductById(id);
  console.log("request data" , uniqueProduct)
  if (!uniqueProduct) return res.status(400).json({ error: "invalid product" });

  //Connect existing tags by ID, replacing all previous tag relations
  try {
    const updatedData = { ...data };

    if (data.tags !== undefined) {
      updatedData.productTag = {
        deleteMany: {},
        create: data.tags.map((tagId) => ({
          tag: { connect: { id: tagId } },
        })),
      };
      delete updatedData.tags;
    }
    // including productTags and tag, update the product
    const modifiedProduct = await prisma.product.update({
      where: { id },
      data: updatedData,
      include: {
        productTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "successfully update product",
      data: modifiedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};
