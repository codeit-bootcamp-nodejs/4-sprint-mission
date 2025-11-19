const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'panda_market',
  user: 'panda_user',
  password: 'panda1234'
});

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('테스트 데이터 생성 시작...');

    await client.query('DELETE FROM notifications');
    await client.query('DELETE FROM product_likes');
    await client.query('DELETE FROM post_comments');
    await client.query('DELETE FROM product_comments');
    await client.query('DELETE FROM posts');
    await client.query('DELETE FROM products');
    await client.query('DELETE FROM categories');
    await client.query('DELETE FROM users');
    console.log('✓ 기존 데이터 삭제 완료');

    await client.query(`
      INSERT INTO users (id, email, password_hash, nickname, profile_image) VALUES
      (1, 'user1@test.com', '$2a$10$hash1', '사용자1', 'https://via.placeholder.com/100'),
      (2, 'user2@test.com', '$2a$10$hash2', '사용자2', 'https://via.placeholder.com/100'),
      (3, 'user3@test.com', '$2a$10$hash3', '사용자3', 'https://via.placeholder.com/100')
    `);
    console.log('✓ 사용자 3명 생성 완료');

    await client.query(`
      INSERT INTO categories (id, name) VALUES
      (1, '전자기기'),
      (2, '의류'),
      (3, '도서'),
      (4, '가구')
    `);
    console.log('✓ 카테고리 4개 생성 완료');

    await client.query(`
      INSERT INTO products (id, seller_id, category_id, name, description, price, condition, status) VALUES
      (1, 1, 1, 'iPhone 15 Pro', '거의 새것 같은 아이폰 15 Pro입니다. 케이스와 함께 드립니다.', 1200000, 'LIKE_NEW', 'FOR_SALE'),
      (2, 2, 1, 'MacBook Pro 2023', '2023년형 맥북프로 M2 칩 탑재. 사용감 거의 없습니다.', 2500000, 'LIKE_NEW', 'FOR_SALE'),
      (3, 1, 2, '나이키 운동화', '새상품 나이키 에어맥스. 250mm 사이즈입니다.', 89000, 'NEW', 'FOR_SALE'),
      (4, 3, 3, '클린코드 도서', '로버트 C. 마틴의 클린코드. 한 번 읽었습니다.', 25000, 'GOOD', 'FOR_SALE'),
      (5, 2, 4, '사무용 책상', 'IKEA 책상. 조립식입니다. 직거래만 가능합니다.', 150000, 'GOOD', 'FOR_SALE')
    `);
    console.log('✓ 상품 5개 생성 완료');

    await client.query(`
      INSERT INTO posts (id, board_id, author_id, title, content) VALUES
      (1, 1, 1, '판다마켓 사용 후기', '판다마켓에서 처음 거래해봤는데 정말 편리하고 좋네요! 안전거래 시스템 덕분에 안심하고 거래할 수 있었습니다.'),
      (2, 1, 2, '중고거래 안전하게 하는 팁', '중고거래 할 때 꼭 확인해야 할 것들을 정리해봤어요. 1. 직거래 우선 2. 안전거래 필수 3. 상품 상태 꼼꼼히 확인'),
      (3, 1, 3, '전자기기 구매 질문', '아이폰 중고로 사려고 하는데 어떤 점을 확인해야 할까요?'),
      (4, 1, 1, '판다마켓 추천합니다', '여러 중고거래 플랫폼 써봤는데 판다마켓이 제일 좋은 것 같아요!')
    `);
    console.log('✓ 게시글 4개 생성 완료');

    await client.query(`
      INSERT INTO product_likes (user_id, product_id) VALUES
      (2, 1),
      (3, 1),
      (1, 2),
      (3, 2),
      (2, 4),
      (1, 5)
    `);
    console.log('✓ 상품 좋아요 6개 생성 완료');

    await client.query(`
      INSERT INTO post_comments (post_id, user_id, content) VALUES
      (1, 2, '저도 판다마켓 정말 만족스럽게 사용하고 있어요!'),
      (1, 3, '좋은 후기 감사합니다~'),
      (2, 1, '유용한 팁 감사합니다!'),
      (3, 2, '배터리 상태랑 액정 상태를 꼭 확인하세요!')
    `);
    console.log('✓ 게시글 댓글 4개 생성 완료');

    await client.query(`
      INSERT INTO product_comments (product_id, user_id, content) VALUES
      (1, 2, '이 상품 아직 판매중인가요?'),
      (1, 3, '배터리 상태 어떤가요?'),
      (2, 1, '직거래 가능한가요?'),
      (4, 2, '책 상태 궁금합니다!')
    `);
    console.log('✓ 상품 댓글 4개 생성 완료');

    await client.query(`
      SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
      SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
      SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
      SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts));
    `);
    console.log('✓ 시퀀스 재설정 완료');

    await client.query('COMMIT');

    console.log('\n✅ 테스트 데이터 생성 완료!');
    console.log('\n생성된 데이터:');
    console.log('- 사용자: 3명 (ID: 1, 2, 3)');
    console.log('- 카테고리: 4개');
    console.log('- 상품: 5개');
    console.log('- 게시글: 4개');
    console.log('- 상품 좋아요: 6개');
    console.log('- 게시글 댓글: 4개');
    console.log('- 상품 댓글: 4개');
    console.log('\n이제 서버를 실행하고 http://localhost:3000 에 접속하세요!');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ 오류 발생:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(err => {
  console.error('Seed 실패:', err);
  process.exit(1);
});
