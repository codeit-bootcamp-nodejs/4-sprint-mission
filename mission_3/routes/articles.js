import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();



async function validateArticle (req, res, next) {
  const {
    title,
    content
  } = req.body;

  // validation
  if ( !title || !content )
    return res.status(400).json({ message: "Invalid SQL Parameters" });

  next();
}



router.route('/')

  // Create a post
  .post(validateArticle, async (req, res) => {
    const { 
      title, 
      content 
    } = req.body;

    try {
      const article = await prisma.article.create({
        data: {
          title,
          content
        }
      });

      res.status(201).json(article);
    } catch (err) {
      console.error('An error has occurred: ', err);

      res.status(500).json({ message: "An error has occurred during processing sql" });
    }
  })

  // Inquiry all articles
  .get(async (req, res) => {
    const { 
      offset = 0, 
      limit = 10, 
      sort = 'recent',
      search = ''
    } = req.query;

    let articlesSort = '';

    switch (sort) {
      case 'old':
        articlesSort = 'asc';
        break;

      case 'recent':
      default:
        articlesSort = 'desc';
    }

    try {
      const articles = await prisma.article.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true
        },
        orderBy: {
          createdAt: articlesSort
        },
        where: {
          OR: [
            {
              title: {
                contains: search,
                mode: 'insensitive',
             }
            },
            {
              content: {
                contains: search,
                mode: 'insensitive',
              }
            }
          ],
        },
        skip: offset * limit,
        take: limit
      });

      if (articles)
        res.status(200).json(articles);
      else 
        res.status(404).json({ message: `Cannot find article with ID ${id}` });
    } catch (err) {
      console.error('An error has occurred: ', err.message);

      res.status(500).json({ message: "An error has occurred during processing sql" });
    }
  });



router.route('/:id')

  // Get informations of a certain article
  .get(async (req, res) => {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Invalid parameter 'id'" });

    try {
      const article = await prisma.article.findUnique({
        where: {
          id: parseInt(id)
        }
      });

      if (article)
        res.status(200).json(article);
      else 
        res.status(404).json({ message: `Cannot find article with ID ${id}` })
    } catch (err) {
      console.error('An error has occurred: ', err.message);

      res.status(500).json({ message: "An error has occurred during processing sql" });
    }
  })

  // Modify a article property
  .patch(async (req, res) => {
    const { id } = req.params;
    if (!id) 
      return res.status(400).json({ message: "Invalid parameter 'id'" });

    // Columns in model Article
    const articleCols = [
      "title",
      "content"
    ];

    const filteredBody = Object.entries(req.body)
      .filter(e => articleCols.includes(e[0]))
      .reduce((obj, ele) => {
        obj[ele[0]] = ele[1];
        return obj;
      }, {});

    try {
      const article = await prisma.article.update({
        where: {
          id: Number(id)
        },
        data: {
          ...filteredBody
        }
      });

      if (article)
        res.status(200).json(article);
      else
        res.status(404).json({ message: `Cannot find article with ID ${id}` });
    } catch (err) {
      console.error('An error has occurred: ', err.message);

      res.status(500).json({ message: "An error has occurred during processing sql" });
    }
  })

  // Delete a particular article
  .delete(async (req, res) => {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Invalid parameter 'id'" });

    try {
      const deleted = await prisma.article.delete({
        where: {
          id: Number(id)
        }
      });

      if (deleted)
        res.status(200).json(deleted);
      else 
        res.status(404).json({ message: `Cannot find article with ID ${id}` });
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
        articleId: Number(pid)
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
        articleId: Number(pid)
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
      res.status(404).json({ message: `Cannot find article with ID ${id}` });
  });



export default router;