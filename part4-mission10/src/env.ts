import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ quiet: true });
} else {
  dotenv.config();
}
