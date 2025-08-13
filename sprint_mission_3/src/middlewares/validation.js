export const validateProduct = (req, res, next) => {
  const { name, description, price } = req.body;
  if (!name || !description || price == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (typeof price !== 'number' || price < 0) {
    return res
      .status(400)
      .json({ error: 'Price must be a non-negative number' });
  }
  next();
};

export const validateProductPatch = (req, res, next) => {
  const { name, description, price, tags, imageUrl } = req.body;
  if (
    name == null &&
    description == null &&
    price == null &&
    tags == null &&
    imageUrl == null
  ) {
    return res.status(400).json({ error: 'At least one field is required' });
  }
  if (price != null && (typeof price !== 'number' || price < 0)) {
    return res
      .status(400)
      .json({ error: 'Price must be a non-negative number' });
  }
  next();
};

export const validateArticle = (req, res, next) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  next();
};

export const validateArticlePatch = (req, res, next) => {
  const { title, content } = req.body;
  if (title == null && content == null) {
    return res.status(400).json({ error: 'At least one field is required' });
  }
  next();
};
