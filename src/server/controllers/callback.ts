import { Router } from 'express';

const router = Router();

router.get('/callback', async (req, res) => {
  console.log('aha', req.query);
  res.send('aha');
});

export default router;
