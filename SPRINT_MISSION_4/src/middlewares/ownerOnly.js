export function ownerOnly(getResource) {
  return async (req, res, next) => {
    try {
      const resource = await getResource(req);
      if (resource.userId !== req.user.id) return res.status(403).json({ message: "Forbidden" });
      next();
    } catch {
      return res.status(404).json({ message: "Not found" });
    }
  };
}
