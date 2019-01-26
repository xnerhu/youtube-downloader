import { Router } from 'express';

const router = Router();

router.get('/login', (req, res) => {
  console.log('test');
});

export default router;
