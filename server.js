import express from 'express';
import path from 'path';

// Dynamically import node-fetch
const fetch = (await import('node-fetch')).default;

const app = express();
const port = 3000;

const TOKEN_LIST_URL = 'https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json';

// Use import.meta.url to get the directory name
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file when accessing the root URL
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Fetch the latest Solana token list
app.get('/tokens', async (req, res) => {
  try {
    const response = await fetch(TOKEN_LIST_URL);
    const data = await response.json();
    res.json(data.tokens);
  } catch (error) {
    console.error('Error fetching token list:', error);
    res.status(500).json({ error: 'Failed to fetch token list' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
