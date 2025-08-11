import { Request, Response, Router } from 'express';
import { registerUser, loginUser } from '../../../services/auth/auth.service';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: (error as Error).message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { user, token } = await loginUser(req.body);
    res.status(200).json({ token, userId: user.id, email: user.email });
  } catch (error) {
    res.status(401).json({ message: 'Login failed', error: (error as Error).message });
  }
});

export default router;
