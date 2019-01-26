import { Router } from 'express';
import { stringify } from 'querystring';

const { CLIENT_ID, REDIRECT_URI } = process.env;

const router = Router();

router.get('/login', async (req, res) => {
  const scope =
    'playlist-read-private playlist-modify-private playlist-modify-public playlist-read-collaborative';

  const query = stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope,
    response_type: 'code',
  });

  res.redirect(`https://accounts.spotify.com/authorize?${query}`);
});

export default router;
