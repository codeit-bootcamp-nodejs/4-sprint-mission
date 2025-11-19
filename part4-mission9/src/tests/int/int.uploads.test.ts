import fs from 'fs';
import path from 'path';
import request from 'supertest';

describe('[통합] 이미지 업로드', () => {
  let app: import('express').Express;
  const projectRoot = path.resolve(process.cwd());
  const savedDir = path.join(projectRoot, 'src', 'uploads');

  beforeAll(async () => {
    const { createTestApp } = await import('../_helper/test-app.js');
    app = await createTestApp();

    fs.mkdirSync(savedDir, { recursive: true });
  });

  afterEach(() => {
    if (!fs.existsSync(savedDir)) return;
    for (const f of fs.readdirSync(savedDir)) {
      try {
        fs.unlinkSync(path.join(savedDir, f));
      } catch {}
    }
  });

  test('POST /images/upload/single → 400 (파일 없음)', async () => {
    await request(app).post('/images/upload/single').expect(400);
  });

  test('단일 업로드: 이미지(jpg) → 200 + 파일 생성', async () => {
    const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xd9]);
    const res = await request(app)
      .post('/images/upload/single')
      .attach('myImage', jpg, { filename: 'a.jpg', contentType: 'image/jpeg' })
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        filename: expect.stringMatching(/myImage-\d+\.jpg$/),
        url: expect.stringMatching(/^\/uploads\/myImage-\d+\.jpg$/),
      })
    );

    const filename: string = res.body.filename;
    const onDisk = path.join(savedDir, filename);
    expect(fs.existsSync(onDisk)).toBe(true);
    expect(fs.statSync(onDisk).size).toBeGreaterThan(0);
  });

  test('여러 파일 업로드(<=5개) → 200 + files 배열', async () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
    const req = request(app).post('/images/upload/array');
    for (let i = 0; i < 3; i++) {
      req.attach('myImages', png, {
        filename: `b${i}.png`,
        contentType: 'image/png',
      });
    }
    const res = await req.expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        files: expect.any(Array),
      })
    );
    expect(res.body.files).toHaveLength(3);
    for (const f of res.body.files as Array<{
      filename: string;
      url: string;
    }>) {
      expect(f.filename).toMatch(/^myImages-\d+\.png$/);
      expect(f.url).toMatch(/^\/uploads\/myImages-\d+\.png$/);
    }
  });

  test('허용되지 않는 형식(text/plain) → 400', async () => {
    const txt = Buffer.from('hello');
    await request(app)
      .post('/images/upload/single')
      .attach('myImage', txt, { filename: 'c.txt', contentType: 'text/plain' })
      .expect(400);
  });

  test('파일 개수 초과(6개) → 400 (LIMIT_FILE_COUNT)', async () => {
    const webp = Buffer.from('RIFF');
    let req = request(app).post('/images/upload/array');
    for (let i = 0; i < 6; i++) {
      req = req.attach('myImages', webp, {
        filename: `d${i}.webp`,
        contentType: 'image/webp',
      });
    }
    const _res = await req.expect(400);
  });

  test('파일 크기 초과(>5MB) → 400 (LIMIT_FILE_SIZE)', async () => {
    const big = Buffer.alloc(5 * 1024 * 1024 + 1, 0); // 5MB + 1
    const _res = await request(app)
      .post('/images/upload/single')
      .attach('myImage', big, { filename: 'e.jpg', contentType: 'image/jpeg' })
      .expect(400);
  });

  test('단일 업로드: 파일 미첨부 → 400', async () => {
    await request(app)
      .post('/images/upload/single')
      .field('note', 'no file')
      .expect(400);
  });

  test('여러 파일 업로드: 파일 미첨부 → 400', async () => {
    await request(app)
      .post('/images/upload/array')
      .field('note', 'no files')
      .expect(400);
  });
});
