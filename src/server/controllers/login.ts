import { Router } from 'express';
import { stringify } from 'querystring';

import { randomString } from '../utils';

const { CLIENT_ID, REDIRECT_URI } = process.env;

const router = Router();

router.get('/login', (req, res) => {
  const scope =
    'playlist-read-private playlist-modify-private playlist-modify-public playlist-read-collaborative';

  const query = stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope,
    state: 'aha',
    response_type: 'code',
  });

  res.send(randomString(16));
});

export default router;
