import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();



async function validateProduct (req, res, next) {
  const {
    name,
    description,
    price,
    tags
  } = req.body;

  // validation logic (possible improvements with Zod library in the future)
  if ( !name || !description || !price || !tags )
    return res.status(400).json({ message: "Invalid SQL Parameters" });

  next();
}



router.route('/')

  // Upload a new product
  .post(validateProduct, async (req, res) => {
    // destructuring field data from request body
    const {
      name,
      description,
      price,
      tags
    } = req.body;

    try {
      // insert into Product table
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          tags
        }
      });

      // send 201 response status code indicating the query was processed successfully
      // with the Product record
      res.status(201).json(product);
    } catch (err) {
      console.error('An error has occurred: ', err);

      res.status(500).json({ message: "An error has occurred during processing sql" });
    }
  })

  // Inquiry all products
  .get(async (req, res) => {
    const { 
      offset = 0, 
      limit = 10, 
      sort = 'recent',
      search = ''
    } = req.query;

    let productsSort = '';

    switch (sort) {
      case 'old':
        productsSort = 'asc';
        break;

      case 'recent':
      default:
        productsSort = 'desc';
    }

    try {
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true
        },
        orderBy: {
          createdAt: productsSort
        },
        where: {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
             }
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              }
            }
          ],
        },
        skip: offset * limit,
        take: limit
      });

      if (products)
        res.status(200).json(products);
      else 
        res.status(404).json({ message: `Cannot find product with ID ${id}` });
    } catch (err) {
      console.error('An error has occurred: ', err.message);

      res.status(500).json({ message: "An error has occurred during processing sql" });
    }
  });



router.route('/:id')

  // Get informations of a certain product
  .get(async (req, res) => {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Invalid parameter 'id'" });

    try {
      const product = await prisma.product.findUnique({
        where: {
          id: parseInt(id)
        }
      });

      if (product)
        res.status(200).json(product);
      else 
        res.status(404).json({ message: `Cannot find product with ID ${id}` })
    } catch (err) {
      console.error('An error has occurred: ', err.message);

      res.status(500).json({ message: "An error has occurred during processing sql" });
    }
  })

  // Modify a product property
  .patch(async (req, res) => {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Invalid parameter 'id'" });

    // Columns in model Product
    const productCols = [
      "name",
      "description",
      "price",
      "tags"
    ];

    const filteredBody = Object.entries(req.body)
      .filter(e => productCols.includes(e[0]))
      .reduce((obj, ele) => {
        obj[ele[0]] = ele[1]
        return obj;
      }, {});
    
    try {
      const product = await prisma.product.update({
        where: {
          id: Number(id)
        },
        data: {
          ...filteredBody
        }
      });

      if (product)
        res.status(200).json(product);
      else 
        res.status(404).json({ message: `Cannot find product with ID ${id}` });
    } catch (err) {
      console.error('An error has occurred: ', err.message);

      res.status(500).json({ message: "An error has occurred during processing sql" });
    }
  })

  // Delete a particular product
  .delete(async (req, res) => {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Invalid parameter 'id'" });

    try {
      const deleted = await prisma.product.delete({
        where: {
          id: Number(id)
        }
      });

      if (deleted)
        res.status(200).json(deleted);
      else 
        res.status(404).json({ message: `Cannot find product with ID ${id}` });
    } catch (err) {
      console.error('An error has occurred: ', err.message);

      res.status(500).json({ message: "An error has occurred during processing sql" });
    }
  });



router.route('/:id/comments')

  // Add a comment
  .post(async (req, res, next) => {
    const { id: pid } = req.params;
    if (!pid)
      return res.status(400).json({ message: "Invalid parameter 'id'" });

    const { 
      name, 
      content
    } = req.body;
    
    // validation
    if ( !name || !content || !pid ) 
      return res.status(400).json({ message: "Invalid SQL Parameters"} );

    const comment = await prisma.comment.create({
      data: {
        name,
        content,
        productId: Number(pid)
      }
    });

    res.status(201).json(comment);
  })

  // Inquery all comments
  .get(async (req, res, next) => {
    const { id: pid } = req.params;
    if (!pid)
      return res.status(400).json({ message: "Invalid parameter 'id'" });

    const { cursor, limit = 10 } = req.query;

    const comments = await prisma.comment.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true
      },
      where: {
        productId: Number(pid)
      },
      orderBy: {
        id: 'asc'
      },
      take: Number(limit),
      ...(cursor
        ? {
          skip: 1,
          cursor: { id: Number(cursor) }
        }
        : {}
      )
    });

    const nextCursor = comments.length > 0 ? comments[comments.length - 1] : null;

    if (comments)
      res.status(200).json({
        comments,
        nextCursor
      });
    else
      throw new Error(`Cannot find any comments with board ${board}`);
  });


  
router.route('/:id/comments/:cid')

  .patch(async (req, res) => {
    const { id: pid, cid } = req.params;
    if (!pid || !cid)
      return res.status(400).json({ message: "Invalid parameter 'id' and 'cid'" });

    const { name, content } = req.body;
    if ( !name || !content )
      return res.status(400).json({ message: "Invalid SQL Parameters" });

    const comment = await prisma.comment.update({
      where: {
        id: Number(cid)
      },
      data: {
        name,
        content
      }
    });

    if (comment)
      res.status(200).json(comment);
    else
      res.status(404).json({ message: `Cannot find any comment with ID ${id}` });
  })

  .delete(async (req, res) => {
    const { id: pid, cid } = req.params;
    if (!pid || !cid)
      return res.status(400).json({ message: "Invalid parameter 'id' and 'cid'" });

    const deleted = await prisma.comment.delete({
      where: {
        id: Number(cid)
      }
    });

    if (deleted)
      res.status(200).json(deleted);
    else 
      res.status(404).json({ message: `Cannot find product with ID ${id}` });
  });



  export default router;