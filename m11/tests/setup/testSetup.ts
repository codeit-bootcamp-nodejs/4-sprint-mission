import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test environment variables only if DATABASE_URL is not already set
// (GitHub Actions sets env vars in test.yml, local uses .env.test)
if (!process.env.DATABASE_URL) {
    config({ path: path.resolve(__dirname, '../../.env.test') });
}

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';
