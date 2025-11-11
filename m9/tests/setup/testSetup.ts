import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test environment variables
config({ path: path.resolve(__dirname, '../../.env.test') });

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';
