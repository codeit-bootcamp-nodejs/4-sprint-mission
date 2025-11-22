import { setupTestDatabase } from './helpers/dbHelper';

// Increase timeout for database operations
jest.setTimeout(10000);

beforeAll(async () => {
  await setupTestDatabase(process.env.DATABASE_URL as string);
});
