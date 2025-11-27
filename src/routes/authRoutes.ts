import express, { Request, Response } from 'express';
import * as authService from '../services/authService';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, nickname, image } = req.body;

    if (!email || !password || !nickname) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await authService.register({ email, password, nickname, image });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const { accessToken, refreshToken } = await authService.login(email, password);

    res.cookie('access-token', accessToken, { httpOnly: true });
    res.cookie('refresh-token', refreshToken, { httpOnly: true });

    res.status(200).json({ message: 'Login successful' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('access-token');
  res.clearCookie('refresh-token');
  res.status(200).json({ message: 'Logout successful' });
});

export default router;
