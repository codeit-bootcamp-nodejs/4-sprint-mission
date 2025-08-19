const imageUploadController = {
  async uploadImage(req, res) {
    const filename = req.file.filename;
    const imageUrl = `/file/${filename}`;
    res.json({ imageUrl });
  },
};

export default imageUploadController;
