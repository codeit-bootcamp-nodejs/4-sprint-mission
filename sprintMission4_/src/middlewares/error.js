import prisma from '../lib/prisma';

const app = express.Router();

export const errorMiddleWare = (err, req, res, next) => {
  if (err instanceof prisma.PrismaClientValidationError){
    console.err (err.message);
    return res.status(400).json({ message: 'Bad Request' });
  } else {
    const code = err.code || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(code).json({ message });
  }
};

