export function isAuthenticated(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // 로그인한 유저 정보 세팅
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}