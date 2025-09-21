"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArticle = exports.validateProduct = void 0;
//validation
const validateProduct = (req, res, next) => {
    const { name, description, price } = req.body;
    if (!name || !description || price == null) {
        return res.status(400).json({ message: '이름, 설명, 가격을 입력해야 합니다.' });
    }
    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ message: '가격은 0보다 커야합니다.' });
    }
    next();
};
exports.validateProduct = validateProduct;
//article validation
const validateArticle = (req, res, next) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: '제목, 내용을 입력해야 합니다.' });
    }
    next();
};
exports.validateArticle = validateArticle;
