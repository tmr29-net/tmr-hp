// api/scratch.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { type, target, offset = 0, limit = 20 } = req.query;

  try {
    let url = '';

    if (type === 'project') {
      url = `https://api.scratch.mit.edu/projects/${target}`;
    } else if (type === 'user_projects') {
      url = `https://api.scratch.mit.edu/users/${target}/projects?offset=${offset}&limit=${limit}`;
    } else {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from Scratch API' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}