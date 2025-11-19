import request from 'supertest';
import { app, prisma } from '../../src/app';
import path from 'path';
import fs from 'fs';

describe('Upload API', () => {
  const uploadsDir = path.join(__dirname, '../../public/uploads');
  const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');

  beforeAll(async () => {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create a test image if it doesn't exist
    const fixturesDir = path.join(__dirname, '../fixtures');
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }

    if (!fs.existsSync(testImagePath)) {
      // Create a minimal valid JPEG file (1x1 pixel red dot)
      const jpegBuffer = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
        0x00, 0x03, 0x02, 0x02, 0x02, 0x02, 0x02, 0x03, 0x02, 0x02, 0x02, 0x03,
        0x03, 0x03, 0x03, 0x04, 0x06, 0x04, 0x04, 0x04, 0x04, 0x04, 0x08, 0x06,
        0x06, 0x05, 0x06, 0x09, 0x08, 0x0a, 0x0a, 0x09, 0x08, 0x09, 0x09, 0x0a,
        0x0c, 0x0f, 0x0c, 0x0a, 0x0b, 0x0e, 0x0b, 0x09, 0x09, 0x0d, 0x11, 0x0d,
        0x0e, 0x0f, 0x10, 0x10, 0x11, 0x10, 0x0a, 0x0c, 0x12, 0x13, 0x12, 0x10,
        0x13, 0x0f, 0x10, 0x10, 0x10, 0xff, 0xc9, 0x00, 0x0b, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xcc, 0x00, 0x06, 0x00, 0x10,
        0x10, 0x05, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00,
        0xd2, 0xcf, 0x20, 0xff, 0xd9,
      ]);
      fs.writeFileSync(testImagePath, jpegBuffer);
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();

    // Cleanup test fixtures
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  });

  describe('POST /api/upload', () => {
    it('should upload an image successfully', async () => {
      const response = await request(app)
        .post('/api/upload')
        .attach('image', testImagePath)
        .expect(200);

      expect(response.body).toHaveProperty('imageUrl');
      expect(response.body.imageUrl).toMatch(/^\/uploads\/.+\.jpg$/);

      // Cleanup uploaded file
      if (response.body.imageUrl) {
        const uploadedFilePath = path.join(
          __dirname,
          '../../public',
          response.body.imageUrl
        );
        if (fs.existsSync(uploadedFilePath)) {
          fs.unlinkSync(uploadedFilePath);
        }
      }
    });

    it('should return 400 when no file is uploaded', async () => {
      const response = await request(app).post('/api/upload').expect(400);

      expect(response.body).toHaveProperty('message', 'No file uploaded');
    });

    it('should reject non-image files', async () => {
      const textFilePath = path.join(__dirname, '../fixtures/test.txt');
      fs.writeFileSync(textFilePath, 'This is a text file');

      const response = await request(app)
        .post('/api/upload')
        .attach('image', textFilePath);

      expect([400, 500]).toContain(response.status);
      if (response.body.message) {
        expect(response.body).toHaveProperty('message');
      } else {
        expect(response.body).toHaveProperty('error');
      }

      fs.unlinkSync(textFilePath);
    });

    it('should accept JPEG images', async () => {
      const response = await request(app)
        .post('/api/upload')
        .attach('image', testImagePath)
        .expect(200);

      expect(response.body.imageUrl).toMatch(/\.jpg$/);

      // Cleanup
      if (response.body.imageUrl) {
        const uploadedFilePath = path.join(
          __dirname,
          '../../public',
          response.body.imageUrl
        );
        if (fs.existsSync(uploadedFilePath)) {
          fs.unlinkSync(uploadedFilePath);
        }
      }
    });

    it('should accept PNG images', async () => {
      // Create a minimal valid PNG file
      const pngPath = path.join(__dirname, '../fixtures/test.png');
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
        0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
        0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
      ]);
      fs.writeFileSync(pngPath, pngBuffer);

      const response = await request(app)
        .post('/api/upload')
        .attach('image', pngPath)
        .expect(200);

      expect(response.body.imageUrl).toMatch(/\.png$/);

      // Cleanup
      if (response.body.imageUrl) {
        const uploadedFilePath = path.join(
          __dirname,
          '../../public',
          response.body.imageUrl
        );
        if (fs.existsSync(uploadedFilePath)) {
          fs.unlinkSync(uploadedFilePath);
        }
      }
      fs.unlinkSync(pngPath);
    });

    it('should generate unique filenames for uploads', async () => {
      const response1 = await request(app)
        .post('/api/upload')
        .attach('image', testImagePath)
        .expect(200);

      // Small delay to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));

      const response2 = await request(app)
        .post('/api/upload')
        .attach('image', testImagePath)
        .expect(200);

      expect(response1.body.imageUrl).not.toBe(response2.body.imageUrl);

      // Cleanup
      [response1.body.imageUrl, response2.body.imageUrl].forEach((imageUrl) => {
        if (imageUrl) {
          const uploadedFilePath = path.join(__dirname, '../../public', imageUrl);
          if (fs.existsSync(uploadedFilePath)) {
            fs.unlinkSync(uploadedFilePath);
          }
        }
      });
    });

    it('should return imageUrl with correct format', async () => {
      const response = await request(app)
        .post('/api/upload')
        .attach('image', testImagePath)
        .expect(200);

      expect(response.body.imageUrl).toMatch(/^\/uploads\/image-\d+-\d+\.jpg$/);

      // Cleanup
      if (response.body.imageUrl) {
        const uploadedFilePath = path.join(
          __dirname,
          '../../public',
          response.body.imageUrl
        );
        if (fs.existsSync(uploadedFilePath)) {
          fs.unlinkSync(uploadedFilePath);
        }
      }
    });

    it('should handle multiple file uploads sequentially', async () => {
      const uploads = [];

      for (let i = 0; i < 3; i++) {
        const response = await request(app)
          .post('/api/upload')
          .attach('image', testImagePath);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('imageUrl');
        uploads.push(response.body.imageUrl);
      }

      // All should have unique URLs
      const uniqueUrls = new Set(uploads);
      expect(uniqueUrls.size).toBe(3);

      // Cleanup
      uploads.forEach((imageUrl) => {
        if (imageUrl) {
          const uploadedFilePath = path.join(__dirname, '../../public', imageUrl);
          if (fs.existsSync(uploadedFilePath)) {
            fs.unlinkSync(uploadedFilePath);
          }
        }
      });
    });
  });
});
