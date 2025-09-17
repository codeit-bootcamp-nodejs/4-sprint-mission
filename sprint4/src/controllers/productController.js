//src/controllers/productController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 상품 생성
exports.createProduct = async (req, res) => {
    try {
        const { title, description, price, imageUrl } = req.body;

        // 필수 필드 검증
        if (!title || !price) {
            return res.status(400).json({ message: '제목과 가격은 필수 입력사항입니다.' });
        }

        // 가격 유효성 검증
        if (isNaN(price) || price < 0) {
            return res.status(400).json({ message: '가격은 0 이상의 숫자여야 합니다.' });
        }

        const product = await prisma.product.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                imageUrl,
                userId: req.userId // 인증 미들웨어에서 설정된 userId
            }
        });

        res.status(201).json({
            message: '상품이 성공적으로 등록되었습니다.',
            product
        });
    } catch (error) {
        console.error('상품 생성 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 상품 목록 조회
exports.getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        image: true
                    }
                },
                _count: {
                    select: {
                        likes: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({ products });
    } catch (error) {
        console.error('상품 목록 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 상품 상세 조회
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        image: true
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                nickname: true,
                                image: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                _count: {
                    select: {
                        likes: true
                    }
                }
            }
        });

        if (!product) {
            return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
        }

        // 로그인한 사용자가 이 상품에 좋아요를 눌렀는지 확인
        let isLiked = false;
        if (req.userId) {
            const like = await prisma.productLike.findUnique({
                where: {
                    userId_productId: {
                        userId: req.userId,
                        productId: parseInt(id)
                    }
                }
            });
            isLiked = !!like;
        }

        res.status(200).json({
            product,
            isLiked
        });
    } catch (error) {
        console.error('상품 상세 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 상품 수정 (소유권 확인)
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, imageUrl } = req.body;

        // 상품 존재 확인
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) {
            return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
        }

        // 소유권 확인
        if (product.userId !== req.userId) {
            return res.status(403).json({ message: '상품을 수정할 권한이 없습니다.' });
        }

        // 가격 유효성 검증
        let parsedPrice = undefined;
        if (price !== undefined) {
            if (isNaN(price) || price < 0) {
                return res.status(400).json({ message: '가격은 0 이상의 숫자여야 합니다.' });
            }
            parsedPrice = parseFloat(price);
        }

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(parsedPrice !== undefined && { price: parsedPrice }),
                ...(imageUrl !== undefined && { imageUrl })
            }
        });

        res.status(200).json({
            message: '상품이 성공적으로 수정되었습니다.',
            product: updatedProduct
        });
    } catch (error) {
        console.error('상품 수정 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 상품 삭제 (소유권 확인)
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // 상품 존재 확인
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) {
            return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
        }

        // 소유권 확인
        if (product.userId !== req.userId) {
            return res.status(403).json({ message: '상품을 삭제할 권한이 없습니다.' });
        }

        await prisma.product.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: '상품이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error('상품 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 상품 좋아요
exports.likeProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // 상품 존재 확인
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) {
            return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
        }

        // 이미 좋아요를 눌렀는지 확인
        const existingLike = await prisma.productLike.findUnique({
            where: {
                userId_productId: {
                    userId: req.userId,
                    productId: parseInt(id)
                }
            }
        });

        if (existingLike) {
            return res.status(409).json({ message: '이미 좋아요를 누른 상품입니다.' });
        }

        await prisma.productLike.create({
            data: {
                userId: req.userId,
                productId: parseInt(id)
            }
        });

        res.status(201).json({ message: '상품에 좋아요를 눌렀습니다.' });
    } catch (error) {
        console.error('상품 좋아요 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 상품 좋아요 취소
exports.unlikeProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // 좋아요 존재 확인
        const like = await prisma.productLike.findUnique({
            where: {
                userId_productId: {
                    userId: req.userId,
                    productId: parseInt(id)
                }
            }
        });

        if (!like) {
            return res.status(404).json({ message: '좋아요를 누르지 않은 상품입니다.' });
        }

        await prisma.productLike.delete({
            where: {
                userId_productId: {
                    userId: req.userId,
                    productId: parseInt(id)
                }
            }
        });

        res.status(200).json({ message: '상품 좋아요가 취소되었습니다.' });
    } catch (error) {
        console.error('상품 좋아요 취소 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 내가 등록한 상품 목록 조회
exports.getMyProducts = async (req, res) => {
    try {
        // req.userId를 사용해 자신이 등록한 상품만 조회
        const products = await prisma.product.findMany({
            where: {
                userId: req.userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        image: true
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({ products });
    } catch (error) {
        console.error('내 상품 목록 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 내가 좋아요한 상품 목록 조회
exports.getLikedProducts = async (req, res) => {
    try {
        const likedProducts = await prisma.productLike.findMany({
            where: {
                userId: req.userId
            },
            include: {
                product: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                nickname: true,
                                image: true
                            }
                        },
                        _count: {
                            select: {
                                likes: true,
                                comments: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // 응답 형식을 다른 상품 조회 API와 일관되게 맞추기 위해 변환
        const products = likedProducts.map(item => item.product);

        res.status(200).json({ products });
    } catch (error) {
        console.error('좋아요한 상품 목록 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};