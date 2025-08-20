const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 상품 등록
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price), // 가격을 정수로 변환
        tags,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    next(error); // 에러 핸들러로 전달
  }
};

// 상품 목록 조회
exports.getProducts = async (req, res, next) => {
  try {
    // 쿼리 파라미터에서 검색, 정렬, 페이지네이션 정보 추출
    const { search, sort, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit; // 페이지네이션을 위한 offset 계산

    // 검색어가 있는 경우 where 조건 생성
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } }, // 이름에서 검색 (대소문자 구분 안함)
            { description: { contains: search, mode: 'insensitive' } }, // 설명에서 검색
          ],
        }
      : {};

    // 정렬 조건 설정 (기본은 오름차순, 'recent'일 경우 최신순)
    const orderBy = sort === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: offset,
      take: parseInt(limit),
      select: { id: true, name: true, price: true, createdAt: true }, // 필요한 필드만 선택
    });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// 상품 상세 조회
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, name: true, description: true, price: true, tags: true, createdAt: true },
    });

    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// 상품 수정
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, tags } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: price ? parseInt(price) : undefined, // 가격이 있는 경우에만 업데이트
        tags,
      },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// 상품 삭제
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // 성공적으로 삭제되었으나 컨텐츠는 없음을 알림
  } catch (error) {
    next(error);
  }
};

// 이미지 업로드
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '이미지가 제공되지 않았습니다.' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({ imageUrl });
};
